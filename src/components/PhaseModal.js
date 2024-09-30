import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { getAllNations, getSchools } from '../utils/api';
import { phaseMapping } from '../utils/constants';

import '../styles/PhaseModal.css';

const PhaseModal = () => {
  const {
    meUserProfile,
    handleUpdateInterestedSchools,
    handleDeleteAllInterestedSchools,
    handleUpdateUserPhase,
    handleUpdateUserExchangeSchool,
    handleUpdateUserOriginSchool,
  } = useContext(UserContext);

  const { token } = useContext(AuthContext);

  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);

  // 臨時狀態變量，用於在模態框中編輯，不影響實際數據，直到保存時才更新
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

  // 初始化狀態變量
  useEffect(() => {
    if (meUserProfile) {
      // 在打開模態框之前，保存當前的用戶數據到臨時狀態變量
      setTempPhase(meUserProfile.phase || '');
      setTempOriginSchoolName(meUserProfile.originSchoolName || '');
      setTempExchangeSchoolName(meUserProfile.exchangeSchoolName || '');
      setTempInterestedSchoolNames(meUserProfile.interestedSchools || []);
    }
  }, [meUserProfile]);

  useEffect(() => {
    // 獲取所有國家
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

  const fetchOriginSchoolsByNation = async (nationId) => {
    try {
      const response = await getSchools(token, nationId);
      if (response.data) {
        setOriginSchools(response.data);
      } else {
        console.error('未收到原學校列表數據', response);
      }
    } catch (error) {
      console.error('獲取原學校列表失敗', error);
    }
  };

  const fetchExchangeSchoolsByNation = async (nationId) => {
    try {
      const response = await getSchools(token, nationId);
      if (response.data) {
        setExchangeSchools(response.data);
      } else {
        console.error('未收到目的學校列表數據', response);
      }
    } catch (error) {
      console.error('獲取目的學校列表失敗', error);
    }
  };

  const fetchInterestedSchoolsByNation = async (nationId) => {
    try {
      const response = await getSchools(token, nationId);
      if (response.data) {
        setInterestedSchools(response.data);
      } else {
        console.error('未收到感興趣的學校列表數據', response);
      }
    } catch (error) {
      console.error('獲取感興趣的學校列表失敗', error);
    }
  };

  const handleOpenModal = () => {
    // 在打開模態框時，保存當前的用戶數據到臨時狀態變量
    setTempPhase(meUserProfile.phase || '');
    setTempOriginSchoolName(meUserProfile.originSchoolName || '');
    setTempExchangeSchoolName(meUserProfile.exchangeSchoolName || '');
    setTempInterestedSchoolNames(meUserProfile.interestedSchools || []);

    setIsPhaseModalOpen(true);
  };


  const handleCloseModal = () => {
    // 關閉模態框時，恢覆臨時狀態變量到之前的值
    setTempPhase(meUserProfile.phase || '');

    setTempOriginNationId('');
    setTempOriginSchoolId('');
    setTempOriginSchoolName(meUserProfile.originSchoolName || '');

    setTempExchangeNationId('');
    setTempExchangeSchoolId('');
    setTempExchangeSchoolName(meUserProfile.exchangeSchoolName || '');

    setTempInterestedSchoolIds('');
    setTempInterestedSchoolNames(meUserProfile.interestedSchools || []);

    setIsPhaseModalOpen(false);
  };

  const handleSavePhaseAndSchools = async () => {
    if (!tempOriginSchoolId) {
      alert('請先選擇原學校');
      return;
    }

    try {
      await handleUpdateUserOriginSchool(tempOriginSchoolId, tempOriginSchoolName);
      await handleUpdateUserPhase(tempPhase);

      if (tempPhase === 'APPLYING') {
        if (tempInterestedSchoolIds.length === 0) {
          alert('請至少選擇一個感興趣的學校');
          return;
        }
        await handleUpdateInterestedSchools(tempInterestedSchoolIds, tempInterestedSchoolNames);
      } else {
        if (!tempExchangeSchoolId) {
          alert('請先選擇目的學校');
          return;
        }
        await handleUpdateUserExchangeSchool(tempExchangeSchoolId, tempExchangeSchoolName);
      }

      setIsPhaseModalOpen(false);
    } catch (error) {
      console.error('保存階段和學校時出錯', error);
    }
  };

  const handlePhaseAdvance = async () => {
    if (tempPhase === 'APPLYING') {
      // 我錄取了
      const confirmAdvance = window.confirm('是否錄取了並設置目的學校？');
      if (confirmAdvance) {
        // 清空感興趣的學校
        await handleDeleteAllInterestedSchools();
        // 打開設置目的學校的模態框
        setTempPhase('ADMITTED');
        setIsPhaseModalOpen(true);
      }
    } else if (tempPhase === 'ADMITTED') {
      // 我出國了
      const confirmAdvance = window.confirm('是否將階段調整為留學中？');
      if (confirmAdvance) {
        await handleUpdateUserPhase('STUDYING_ABROAD');
        setTempPhase('STUDYING_ABROAD');
      }
    } else if (tempPhase === 'STUDYING_ABROAD') {
      // 我回國了
      const confirmAdvance = window.confirm('是否將階段調整為已返國？');
      if (confirmAdvance) {
        await handleUpdateUserPhase('RETURNED');
        setTempPhase('RETURNED');
      }
    } else if (tempPhase === 'RETURNED') {
      // 邁向下次旅程
      const confirmAdvance = window.confirm('是否已完全結束此次國外學習，開始設置新的一次？');
      if (confirmAdvance) {
        // 重置所有狀態並打開模態框
        setTempPhase('');
        setTempOriginSchoolId('');
        setTempOriginSchoolName('');
        setTempExchangeSchoolId('');
        setTempExchangeSchoolName('');
        setTempInterestedSchoolIds([]);
        setTempInterestedSchoolNames([]);
        setIsPhaseModalOpen(true);
      }
    }
  };

  // 檢查是否有 meUserProfile，如果沒有則返回 null
  if (!meUserProfile) {
    return null;
  }

  return (
    <div className="phase-modal-container">
      <div className="phase-info">
        <img src="/img/earth.jpg" alt="Earth" />
        {meUserProfile.phase === null || meUserProfile.phase === '' ? (
          <>
            <h2>Let's Go Global!</h2>
            <p>現在就進行階段與目標學校設置，GoGlobal 將為您推薦最佳內容與夥伴！</p>
            <button onClick={handleOpenModal}>設置階段</button>
          </>
        ) : (
          <>
            <p className="phase">{phaseMapping[meUserProfile.phase] || '未設置'}</p>
            {meUserProfile.phase === 'APPLYING' && (
              <>
                  {meUserProfile.interestedSchools && meUserProfile.interestedSchools.length > 0 ? (
                    meUserProfile.interestedSchools.map((interestedSchoolName, index) => (
                      <p key={index} className="exchange-school">{interestedSchoolName}</p>
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

      {isPhaseModalOpen && (
        <div className="small-modal">
          <div className="modal-content">
            <h2>設置階段與學校</h2>

            {/* 選擇階段 */}
            {!tempPhase && (
              <>
                <label>請選擇您的階段：</label>
                <select value={tempPhase} onChange={(e) => setTempPhase(e.target.value)}>
                  <option value="">-- 請選擇階段 --</option>
                  <option value="APPLYING">申請中</option>
                  <option value="ADMITTED">已錄取</option>
                  <option value="STUDYING_ABROAD">留學中</option>
                  <option value="RETURNED">已返國</option>
                </select>
              </>
            )}

            {/* 選擇原學校 */}
            {tempPhase && (
              <>
                <label>選擇原學校：</label>
                <select
                  value={tempOriginNationId}
                  onChange={(e) => {
                    setTempOriginNationId(e.target.value);
                    fetchOriginSchoolsByNation(e.target.value);
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

                {/* 根據階段顯示不同的學校選擇 */}
                {tempPhase === 'APPLYING' && (
                  <>
                    <label>選擇感興趣或正在申請中的學校（可多選）：</label>
                    <select
                      value={tempExchangeNationId}
                      onChange={(e) => {
                        setTempExchangeNationId(e.target.value);
                        fetchInterestedSchoolsByNation(e.target.value);
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

                {tempPhase !== 'APPLYING' && (
                  <>
                    <label>選擇目的學校：</label>
                    <select
                      value={tempExchangeNationId}
                      onChange={(e) => {
                        setTempExchangeNationId(e.target.value);
                        fetchExchangeSchoolsByNation(e.target.value);
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
                  <button className="btn-primary" onClick={handleSavePhaseAndSchools}>保存</button>
                  <button className="btn-primary" onClick={handleCloseModal}>取消</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseModal;
