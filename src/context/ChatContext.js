import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { getChatSessions, getChatHistory, getPendingFriendRequests, getUserFriends, rejectFriendRequestApi} from '../utils/api';
import { WS_BASE_URL } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const currentChatRef = useRef(currentChat); // 新增的 ref
  const [userNameCache, setUserNameCache] = useState({});
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const {token, userId} = useContext(AuthContext);

  // 更新 currentChatRef
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    connectChat();
    loadSessions();
  }, [token]);

  const connectChat = () => {

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

    // client.subscribe('/user/queue/friend-reject', (message) => {
    //     const receivedReject = JSON.parse(message.body);
    //     handleFriendReject(receivedReject);
    //     console.log('Friend request rejected:', receivedReject);
    // });
  
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

    if (
      currentChatRef.current &&
      message.chatId == currentChatRef.current.chatId
    ) {
      setCurrentChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, message],
      }));
    }
    setChatSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.chatId == message.chatId
          ? {
              ...session,
              latestMessage: message,
            }
          : session
      )
    );
  };

  const openChatWindow = async (chatId, friendId) => {
    try {
      const chatHistory = await getChatHistory(token, chatId);
      const messages = chatHistory.data.reverse();
      const friendName = getFriendName(friendId);

      setCurrentChat({
        chatId,
        friendId,
        friendName,
        messages,
      });
      setIsChatWindowOpen(true);
    } catch (error) {
      console.error('Error opening chat window:', error);
    }
  };

  const getFriendName = (friendId) => {
    let friendName = userNameCache[friendId];
    if (!friendName) {
      const session = chatSessions.find((s) =>
        s.participants.includes(friendId)
      );
      if (session) {
        const index = session.participants.indexOf(friendId);
        friendName = session.participantsName[index];
        setUserNameCache((prev) => ({ ...prev, [friendId]: friendName }));
      } else {
        friendName = '未知用户';
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
      // 本地更新消息列表
      setCurrentChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, message],
      }));
      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.chatId == message.chatId
            ? {
                ...session,
                latestMessage: message,
              }
            : session
        )
      );
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
      setPendingRequests(data);
    } catch (error) {
      console.error('Error fetching pending friend requests:', error);
    }
  };

  const loadUserFriends = async () => {
    try {
      const data = await getUserFriends(token);
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends list:', error);
    }
  };

  // 接受好友請求
    const acceptFriendRequest = (userId, targetUserId, newFriendInfo) => {
      if (stompClient) {
          const request = { userId, targetUserId };
          stompClient.send('/app/friend.acceptRequest', {}, JSON.stringify(request));
      }

      setFriends((prevFriends) => [...prevFriends, newFriendInfo]);
      setPendingRequests((prevRequests) => prevRequests.filter(req => req.userId !== newFriendInfo.userId));
    };

    // 送出好友請求
    const sendFriendRequest = (userId, targetUserId) => {
      if (stompClient) {
          const request = { userId, targetUserId };
          stompClient.send('/app/friend.sendRequest', {}, JSON.stringify(request));
      }
    };

  // 拒絕好友請求
  const rejectFriendRequest = async (request) => {
    try {
      await rejectFriendRequestApi(token, userId, request.userId);
      setPendingRequests((prevRequests) => prevRequests.filter(req => req.userId !== request.userId));
    } catch (error) {
      console.error('Error rejecting the friend request:', error);
    }
  };

    // 處理收到的好友請求
    const handleIncomingFriendRequest = (request) => {
        setPendingRequests((prevRequests) => [...prevRequests, request]);
    };

    // 處理好友請求接受
    const handleFriendAccept = (friendInfo) => {
        setFriends((prevFriends) => [...prevFriends, friendInfo]);
        // setPendingRequests((prevRequests) => prevRequests.filter(req => req.userId !== friendInfo.userId));
    };

    // const rejectFriendRequest = (userId, targetUserId) => {
    //     if (stompClient) {
    //         const request = { userId, targetUserId };
    //         stompClient.send('/app/friend.rejectRequest', {}, JSON.stringify(request));
    //     }
    // };

    // 處理好友請求拒絕
    // const handleFriendReject = (request) => {
    //     setPendingRequests((prevRequests) => prevRequests.filter(req => req.targetUserId !== request.userId));
    // };
    

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
        rejectFriendRequest
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};