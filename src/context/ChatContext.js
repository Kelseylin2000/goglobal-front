import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';

import { getChatSessions, getChatHistory, getPendingFriendRequests, getUserFriends, rejectFriendRequestApi} from '../utils/api';
import { WS_BASE_URL } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const currentChatRef = useRef(currentChat); // 新增的 ref
  const chatSessionsRef = useRef(chatSessions);

  const [userNameCache, setUserNameCache] = useState({});
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const {token, userId} = useContext(AuthContext);
  const {setSameSchoolUserProfiles} = useContext(UserContext);

  // 更新 currentChatRef
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    chatSessionsRef.current = chatSessions;
  }, [chatSessions]);
  
  useEffect(() => {
    connectChat();
    loadSessions();
  }, [token]);

  const connectChat = () => {

    if (stompClient) {
      console.log('Disconnecting previous WebSocket connection...');
      stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }

    const socket = new SockJS(`${WS_BASE_URL}?token=${token}`);
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
    console.log('Connected to chat:', frame);

    client.subscribe('/user/queue/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        handleIncomingMessage(receivedMessage);
        console.log("receivedMessage", receivedMessage);
      });

    // 訂閱 其他使用者對當前使用者 傳來的好友請求
    client.subscribe('/user/queue/friend-requests', (message) => {
        const receivedRequest = JSON.parse(message.body);
        handleIncomingFriendRequest(receivedRequest);
        console.log('Received friend request:', receivedRequest);
    });

    // 訂閱 其他使用者對當前使用者 接受成為好友
    client.subscribe('/user/queue/friend-accept', (message) => {
        const receivedAccept = JSON.parse(message.body);
        handleFriendAccept(receivedAccept);
        console.log('Friend request accepted:', receivedAccept);
    });
  
    });

    setStompClient(client);
  };

  const loadSessions = async () => {
    try {
      const sessions = await getChatSessions(token);
      setChatSessions(sessions.data);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };



  const handleIncomingMessage = (message) => {
    let sessionFound = false; // 用來標記是否找到匹配的 session
  
    // 更新當前聊天視窗中的消息
    if (
      currentChatRef.current &&
      message.chatId == currentChatRef.current.chatId
    ) {
      setCurrentChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, message],
      }));
    }
  
    // 更新會話列表中的最新消息
    setChatSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.chatId == message.chatId) {
          sessionFound = true; // 如果找到匹配的 session，設置為 true
          return {
            ...session,
            latestMessage: message,
          };
        }
        return session;
      })
    );
  
    // 如果沒有找到匹配的 session，重新加載會話列表
    if (!sessionFound) {
      loadSessions();
    }

    // 顯示通知並且在點擊通知時打開對應的聊天視窗
    toast(    
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={`https://i.pravatar.cc/200?u=${message.senderId}`}
          alt={message.sender}
          className='notify-img'
        />
          <p>{message.content}</p>
      </div>, {
      onClick: () => {
        openChatWindow(message.chatId, message.senderId);
        toast.dismiss();
      },
      autoClose: 5000, // 自動關閉時間
    });
  };
  

  const openChatWindow = async (chatId, friendId, friendName = null) => {
    try {
      // 嘗試獲取聊天歷史記錄
      const chatHistory = await getChatHistory(token, chatId);
      const messages = chatHistory.data.reverse();
      if (!friendName) {
        friendName = getFriendName(friendId);
      }  
      // 設置當前聊天
      setCurrentChat({
        chatId,
        friendId,
        friendName,
        messages,
      });
    } catch (error) {
      console.error('Error opening chat window or no chat history found:', error);
  
      // 如果發生錯誤或沒有聊天記錄，初始化空的聊天記錄      
      setCurrentChat({
        chatId,
        friendId,
        friendName,
        messages: [], // 設置空消息列表
      });
    } finally {
      // 無論是否有錯誤，都打開聊天窗口
      setIsChatWindowOpen(true);
    }
  };  

  const getFriendName = (friendId) => {
    let friendName = userNameCache[friendId];
    if (!friendName) {
      const session = chatSessionsRef.current.find((s) =>
        s.participants.includes(friendId)
      );
      if (session) {
        const index = session.participants.indexOf(friendId);
        friendName = session.participantsName[index];
        setUserNameCache((prev) => ({ ...prev, [friendId]: friendName }));
      } else {
        friendName = '未知用戶';
      }
    }
    return friendName;
  };  

  const closeChatWindow = () => {
    setIsChatWindowOpen(false);
    setCurrentChat(null);
  };

  const sendMessage = (content) => {
    if (content.trim() && stompClient && currentChat) {
      const { chatId, friendId } = currentChat;
      const message = {
        chatId,
        senderId: userId,
        receiverId: friendId,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };
      stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));

      setCurrentChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, message],
      }));

      let sessionFound = false;

      setChatSessions((prevSessions) => {
        const updatedSessions = prevSessions.map((session) => {
          if (session.chatId == message.chatId) {
            sessionFound = true;
            return {
              ...session,
              latestMessage: message,
            };
          }
          return session;
        });
  
        if (!sessionFound) {
          loadSessions();
        }
  
        return updatedSessions;
      });
    }
  };


  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (token) {
      loadPendingFriendRequests();
      loadUserFriends();
    }
  }, [token]);

  const loadPendingFriendRequests = async () => {
    try {
      const data = await getPendingFriendRequests(token);
      setPendingRequests(data.data);
    } catch (error) {
      console.error('Error fetching pending friend requests:', error);
    }
  };

  const loadUserFriends = async () => {
    try {
      const data = await getUserFriends(token);
      setFriends(data.data);
    } catch (error) {
      console.error('Error fetching friends list:', error);
    }
  };

  const updateRelationship = (userId, newRelationship) => {
    setSameSchoolUserProfiles((prevProfiles) =>
      prevProfiles.map((p) =>
        p.userId === userId ? { ...p, relationship: newRelationship } : p
      )
    );
  };

  // 接受好友請求
    const acceptFriendRequest = (userId, targetUserId, newFriendInfo) => {
      if (stompClient) {
          const request = { userId, targetUserId };
          stompClient.send('/app/friend.acceptRequest', {}, JSON.stringify(request));
      }

      setFriends((prevFriends) => [...prevFriends, newFriendInfo]);
      setPendingRequests((prevRequests) => prevRequests.filter(req => req.userId !== newFriendInfo.userId));

      updateRelationship(targetUserId, 'FRIENDS');
    };

    // 送出好友請求
    const sendFriendRequest = (userId, targetUserId) => {
      if (stompClient) {
          const request = { userId, targetUserId };
          stompClient.send('/app/friend.sendRequest', {}, JSON.stringify(request));

          console.log(request);
      }
      updateRelationship(targetUserId, 'FRIEND_REQUEST_SENT');
    };

  // 拒絕好友請求
  const rejectFriendRequest = async (request) => {
    try {
      await rejectFriendRequestApi(token, userId, request.userId);
      setPendingRequests((prevRequests) => prevRequests.filter(req => req.userId !== request.userId));
      updateRelationship(request.userId, 'NO_RELATION');
    } catch (error) {
      console.error('Error rejecting the friend request:', error);
    }
  };

    // 處理收到的好友請求
    const handleIncomingFriendRequest = (request) => {
        setPendingRequests((prevRequests) => [...prevRequests, request]);
        updateRelationship(request.userId, 'FRIEND_REQUEST_RECEIVED');

        toast(    
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={`https://i.pravatar.cc/200?u=${request.userId}`}
              alt={request.name}
              className='notify-img'
            />
              <p>{request.name} 向你傳送了交友邀請</p>
          </div>, {
          onClick: () => {
            toast.dismiss();
          },
          autoClose: 5000,
        });
    };

    // 處理好友請求接受
    const handleFriendAccept = (friendInfo) => {
        setFriends((prevFriends) => [...prevFriends, friendInfo]);
        updateRelationship(friendInfo.userId, 'FRIENDS');

        toast(    
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={`https://i.pravatar.cc/200?u=${friendInfo.userId}`}
              alt={friendInfo.name}
              className='notify-img'
            />
              <p>{friendInfo.name} 接受你的交友邀請</p>
          </div>, {
          onClick: () => {
            toast.dismiss();
          },
          autoClose: 5000,
        });
    };

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        currentChat,
        isChatWindowOpen,
        openChatWindow,
        closeChatWindow,
        sendMessage,
        loadSessions,
        acceptFriendRequest,
        sendFriendRequest,
        rejectFriendRequest,
        pendingRequests,
        friends
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};