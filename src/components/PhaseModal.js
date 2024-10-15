import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import { getAllNations, getSchools } from '../utils/api';
import { phaseMapping } from '../utils/constants';
import ReactDOM from 'react-dom';

import '../styles/PhaseModal.css';

const PhaseModal = () => {
  const {
    meUserProfile,
    handleUpdateInterestedSchools,
    handleDeleteAllInterestedSchools,
    handleUpdateUserPhase,
    handleUpdateUserExchangeSchool,
    handleUpdateUserOriginSchool,
    handleDeleteUserExchangeSchool,
  } = useContext(UserContext);

  const { token, userId: currentUserId } = useContext(AuthContext);
  const { reLoadPosts, setMePosts, setPosts } = useContext(PostContext);

  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);

  const [tempPhase, setTempPhase] = useState('');
  const [tempOriginNationId, setTempOriginNationId] = useState('');
  const [tempOriginSchoolId, setTempOriginSchoolId] = useState('');
  const [tempOriginSchoolName, setTempOriginSchoolName] = useState('');
  const [tempExchangeNationId, setTempExchangeNationId] = useState('');
  const [tempExchangeSchoolId, setTempExchangeSchoolId] = useState('');
  const [tempExchangeSchoolName, setTempExchangeSchoolName] = useState('');
  const [tempInterestedSchoolIds, setTempInterestedSchoolIds] = useState([]);
  const [tempInterestedSchoolNames, setTempInterestedSchoolNames] = useState([]);

  const [allNations, setAllNations] = useState([]);
  const [originSchools, setOriginSchools] = useState([]);
  const [exchangeSchools, setExchangeSchools] = useState([]);
  const [interestedSchools, setInterestedSchools] = useState([]);

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await getAllNations(token);
        if (response.data) {
          setAllNations(response.data);
        } else {
          console.error('未收到國家列表數據', response);
        }
      } catch (error) {
        console.error('獲取國家列表失敗', error);
      }
    };
    fetchNations();
  }, [token]);

  const fetchSchoolsByNation = async (nationId, setSchools) => {
    try {
      const response = await getSchools(token, nationId);
      if (response.data) {
        setSchools(response.data);
      } else {
        console.error('未收到學校列表數據', response);
      }
    } catch (error) {
      console.error('獲取學校列表失敗', error);
    }
  };

  const handleOpenModal = () => {
    setIsPhaseModalOpen(true);
  };

  const handleCloseModal = () => {
    setTempPhase('');
    setTempOriginNationId('');
    setTempOriginSchoolId('');
    setTempOriginSchoolName('');
    setTempExchangeNationId('');
    setTempExchangeSchoolId('');
    setTempExchangeSchoolName('');
    setTempInterestedSchoolIds([]);
    setTempInterestedSchoolNames([]);
    setIsPhaseModalOpen(false);
  };


  const handleSavePhaseAndSchools = async () => {
    if (meUserProfile.originSchoolName == null && !tempOriginSchoolId) {
      alert('請先選擇原學校');
      return;
    }
  
    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';
    document.body.appendChild(overlay);
  
    let counter = 0;
    const textStates = ["階段與學校更新中.", "階段與學校更新中..", "階段與學校更新中..."];
    const loadingImgs = ['/img/loading-1.png', '/img/loading-2.png', '/img/loading-3.png']
  
    // 初始化 Toast，並設置輪詢動畫
    const toastId = toast.loading(
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '20px' }}>
        {/* 圖片保持顯示 */}
        <img 
          src={loadingImgs[0]}
          alt="loading-icon" 
          style={{ width: '250px'}} 
        />
        {/* 動態顯示的文字 */}
        <p style={{ margin: 0 }}>{textStates[0]}</p>
      </div>,
      {
        position: "top-center",
        style: {
          backgroundColor: "#ffffff",
          color: "#000000",
          fontSize: "20px",
          fontWeight: "bold",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          zIndex: 9999,
          width: "400px",
          textAlign: "center",
          marginTop: '220px'
        },
        icon: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  
    // 使用 setInterval 來動態更新 "階段與學校更新中..." 的點數
    const intervalId = setInterval(() => {
      counter++;
      toast.update(toastId, {
        render: (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '20px' }}>
            {/* 圖片保持顯示 */}
            <img 
              src={loadingImgs[counter % loadingImgs.length]}
              alt="loading-icon" 
              style={{width: '250px'}} 
            />
            {/* 動態顯示的文字 */}
            <p style={{ margin: 0 }}>{textStates[counter % textStates.length]}</p>
          </div>
        ),
      });
    }, 500); // 每 500 毫秒更新一次
  
    try {
      setIsPhaseModalOpen(false);
  
      // 更新原學校
      if (tempOriginSchoolId && tempOriginSchoolName) {
        await handleUpdateUserOriginSchool(tempOriginSchoolId, tempOriginSchoolName);
      }
  
      // 更新感興趣的學校或目的學校
      if (tempPhase === 'APPLYING') {
        if (tempInterestedSchoolIds.length === 0) {
          alert('請至少選擇一個感興趣的學校');
          toast.dismiss(toastId);
          clearInterval(intervalId);
          document.body.removeChild(overlay);
          return;
        }
        await handleUpdateInterestedSchools(tempInterestedSchoolIds, tempInterestedSchoolNames);
      } else {
        if (!tempExchangeSchoolId) {
          alert('請先選擇目的學校');
          toast.dismiss(toastId);
          clearInterval(intervalId);
          document.body.removeChild(overlay);
          return;
        }
        await handleUpdateUserExchangeSchool(tempExchangeSchoolId, tempExchangeSchoolName);
      }
  
      // 更新階段
      if (tempPhase) {
        await handleUpdateUserPhase(tempPhase);
      }
  
      // 如果是 ADMITTED 階段，刪除所有感興趣的學校
      if (tempPhase === 'ADMITTED') {
        await handleDeleteAllInterestedSchools();
      }
  
      // 刷新帖子
      await reLoadPosts();
  
      // 更新 mePosts
      setMePosts((prevMePosts) =>
        prevMePosts.map((post) => ({
          ...post,
          originSchoolName: tempOriginSchoolName !== '' ? tempOriginSchoolName : post.originSchoolName,
          exchangeSchoolName: tempPhase === 'APPLYING' ? null : (tempExchangeSchoolName !== '' ? tempExchangeSchoolName : post.exchangeSchoolName),
          phase: tempPhase !== '' ? tempPhase : post.phase,
        }))
      );      
  
      // 停止點動畫，並更新成功提示
      clearInterval(intervalId);
      toast.update(toastId, {
        render: (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '20px'}}>
            {/* 圖片保持顯示 */}
            <img 
              src="/img/loading-4.png" 
              alt="loading-icon" 
              style={{ width: '250px'}} 
            />
            {/* 成功提示的文字 */}
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
              <img
                src="/img/check.png" 
                alt="check" 
                style={{ marginRight: '10px', width: '30px'}} 
              />
              <p style={{ margin: 0 }}>更新完成囉！</p>
            </div>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 1600,
      });
  
      // 移除 overlay
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 1800); 
  
      handleCloseModal();
    } catch (error) {
      console.error('保存階段和學校時出錯', error);
  
      // 停止點動畫，並顯示錯誤提示
      clearInterval(intervalId);
      toast.update(toastId, {
        render: "階段更新失敗，請重試。",
        type: "error",
        isLoading: false,
        autoClose: 5000,  // 5 秒後自動關閉
      });
  
      document.body.removeChild(overlay);
    }
  };
  
  

  const handlePhaseAdvance = async () => {
    try {
      if (meUserProfile.phase === 'APPLYING') {
        const confirmAdvance = window.confirm('恭喜你錄取！是否要現在設置即將前往的學校？');
        if (confirmAdvance) {
          setTempPhase('ADMITTED');
          handleOpenModal();
        }
      } else if (meUserProfile.phase === 'ADMITTED') {
        const confirmAdvance = window.confirm('是否將階段調整為出國中？');
        if (confirmAdvance) {
          await handleUpdateUserPhase('STUDYING_ABROAD');
          setPosts((prevPosts) =>
            prevPosts.map((post) => 
              post.userId == currentUserId
                ? {
                    ...post,
                    phase: 'STUDYING_ABROAD',
                  }
                : post
            )
          );
          setMePosts((prevMePosts) =>
            prevMePosts.map((post) => ({
              ...post,
              phase: 'STUDYING_ABROAD',
            }))
          );            
        }
      } else if (meUserProfile.phase === 'STUDYING_ABROAD') {
        const confirmAdvance = window.confirm('是否將階段調整為已返國？');
        if (confirmAdvance) {
          await handleUpdateUserPhase('RETURNED');
          setPosts((prevPosts) =>
            prevPosts.map((post) => 
              post.userId == currentUserId
                ? {
                    ...post,
                    phase: 'RETURNED',
                  }
                : post
            )
          );
          setMePosts((prevMePosts) =>
            prevMePosts.map((post) => ({
              ...post,
              phase: 'RETURNED',
            }))
          );   
        }
      } else if (meUserProfile.phase === 'RETURNED') {
        const confirmAdvance = window.confirm('是否已完全結束此次國外學習，開始設置新的一次？');
        if (confirmAdvance) {
          setTempPhase('');
          setTempOriginSchoolId('');
          setTempOriginSchoolName('');
          setTempExchangeSchoolId('');
          setTempExchangeSchoolName('');
          setTempInterestedSchoolIds([]);
          setTempInterestedSchoolNames([]);
          handleOpenModal();
          await handleDeleteUserExchangeSchool();
          await handleDeleteAllInterestedSchools();
        }
      }
    } catch (error) {
      console.error('階段推進時出錯', error);
    }
  };

  if (!meUserProfile) {
    return null;
  }

  const renderModal = () => (
    <div className="small-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={handleCloseModal}>
          &times;
        </button>
        <h2>設置階段與學校</h2>

        {!tempPhase && (
          <>
            <label>請選擇您的階段：</label>
            <div className="phase-options">
              <button
                className={`phase-button ${tempPhase === 'APPLYING' ? 'selected' : ''}`}
                onClick={() => setTempPhase('APPLYING')}
              >
                申請中
              </button>
              <button
                className={`phase-button ${tempPhase === 'ADMITTED' ? 'selected' : ''}`}
                onClick={() => setTempPhase('ADMITTED')}
              >
                已錄取
              </button>
              <button
                className={`phase-button ${tempPhase === 'STUDYING_ABROAD' ? 'selected' : ''}`}
                onClick={() => setTempPhase('STUDYING_ABROAD')}
              >
                出國中
              </button>
              <button
                className={`phase-button ${tempPhase === 'RETURNED' ? 'selected' : ''}`}
                onClick={() => setTempPhase('RETURNED')}
              >
                已返國
              </button>
            </div>
          </>
        )}

        {tempPhase && (
          <>
            {meUserProfile.originSchoolName == null && (
              <>
                <label>選擇原學校：</label>
                <select
                  value={tempOriginNationId}
                  onChange={(e) => {
                    setTempOriginNationId(e.target.value);
                    fetchSchoolsByNation(e.target.value, setOriginSchools);
                  }}
                >
                  <option value="">-- 請選擇國家 --</option>
                  {allNations.map((nation) => (
                    <option key={nation.nationId} value={nation.nationId}>
                      {nation.name}
                    </option>
                  ))}
                </select>

                <select
                  value={tempOriginSchoolId}
                  onChange={(e) => {
                    setTempOriginSchoolId(e.target.value);
                    const selectedSchool = originSchools.find(
                      (school) => school.schoolId === parseInt(e.target.value)
                    );
                    setTempOriginSchoolName(selectedSchool ? selectedSchool.name : '');
                  }}
                >
                  <option value="">-- 請選擇學校 --</option>
                  {originSchools.map((school) => (
                    <option key={school.schoolId} value={school.schoolId}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {tempPhase === 'APPLYING' && (
              <>
                <label>選擇感興趣或正在申請中的學校（可多選）：</label>
                <select
                  value={tempExchangeNationId}
                  onChange={(e) => {
                    setTempExchangeNationId(e.target.value);
                    fetchSchoolsByNation(e.target.value, setInterestedSchools);
                  }}
                >
                  <option value="">-- 請選擇國家 --</option>
                  {allNations.map((nation) => (
                    <option key={nation.nationId} value={nation.nationId}>
                      {nation.name}
                    </option>
                  ))}
                </select>

                <select
                  value=""
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedSchool = interestedSchools.find(
                      (school) => school.schoolId === parseInt(selectedId)
                    );
                    if (selectedSchool && !tempInterestedSchoolIds.includes(selectedId)) {
                      setTempInterestedSchoolIds([...tempInterestedSchoolIds, selectedId]);
                      setTempInterestedSchoolNames([...tempInterestedSchoolNames, selectedSchool.name]);
                    }
                  }}
                >
                  <option value="">-- 請選擇學校 --</option>
                  {interestedSchools.map((school) => (
                    <option key={school.schoolId} value={school.schoolId}>
                      {school.name}
                    </option>
                  ))}
                </select>

                <div>
                  {tempInterestedSchoolNames.map((name, index) => (
                    <span key={index} className="interest-tag">
                      {name}
                      <button
                        onClick={() => {
                          const newIds = [...tempInterestedSchoolIds];
                          const newNames = [...tempInterestedSchoolNames];
                          newIds.splice(index, 1);
                          newNames.splice(index, 1);
                          setTempInterestedSchoolIds(newIds);
                          setTempInterestedSchoolNames(newNames);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}

            {(['ADMITTED', 'STUDYING_ABROAD', 'RETURNED'].includes(tempPhase) &&
              (meUserProfile.exchangeSchoolName == null || meUserProfile.phase === 'RETURNED')) && (
              <>
                <label>選擇目的學校：</label>
                <select
                  value={tempExchangeNationId}
                  onChange={(e) => {
                    setTempExchangeNationId(e.target.value);
                    fetchSchoolsByNation(e.target.value, setExchangeSchools);
                  }}
                >
                  <option value="">-- 請選擇國家 --</option>
                  {allNations.map((nation) => (
                    <option key={nation.nationId} value={nation.nationId}>
                      {nation.name}
                    </option>
                  ))}
                </select>

                <select
                  value={tempExchangeSchoolId}
                  onChange={(e) => {
                    setTempExchangeSchoolId(e.target.value);
                    const selectedSchool = exchangeSchools.find(
                      (school) => school.schoolId === parseInt(e.target.value)
                    );
                    setTempExchangeSchoolName(selectedSchool ? selectedSchool.name : '');
                  }}
                >
                  <option value="">-- 請選擇學校 --</option>
                  {exchangeSchools.map((school) => (
                    <option key={school.schoolId} value={school.schoolId}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="submit-button-container">
              <button className="btn-primary" onClick={handleSavePhaseAndSchools}>
                保存
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="phase-modal-container">
      <div className="phase-info">
        <img src="/img/earth.jpg" alt="Earth" />
        {meUserProfile.phase === null || meUserProfile.phase === '' ? (
          <>
            <h2>Let's Go Global!</h2>
            <p>現在就進行階段與目標學校設置，GoGlobal 將為您推薦最佳內容與伙伴！</p>
            <button onClick={handleOpenModal}>設置階段</button>
          </>
        ) : (
          <>
            <p className="phase">{phaseMapping[meUserProfile.phase] || '未設置'}</p>
            {meUserProfile.phase === 'APPLYING' && (
              <>
                {meUserProfile.interestedSchools && meUserProfile.interestedSchools.length > 0 ? (
                  meUserProfile.interestedSchools.map((interestedSchoolName, index) => (
                    <p key={index} className="exchange-school">
                      {interestedSchoolName}
                    </p>
                  ))
                ) : (
                  <p>未設置</p>
                )}
              </>
            )}
            {meUserProfile.phase !== 'APPLYING' && (
              <>
                <p className="exchange-school">{meUserProfile.exchangeSchoolName || '未設置'}</p>
              </>
            )}
            <button onClick={handlePhaseAdvance}>
              {meUserProfile.phase === 'APPLYING' && '我錄取了！'}
              {meUserProfile.phase === 'ADMITTED' && '我出國了！'}
              {meUserProfile.phase === 'STUDYING_ABROAD' && '我回國了！'}
              {meUserProfile.phase === 'RETURNED' && '邁向下次旅程！'}
            </button>
          </>
        )}
      </div>

      {isPhaseModalOpen && ReactDOM.createPortal(renderModal(), document.body)}
    </div>
  );
};

export default PhaseModal;
