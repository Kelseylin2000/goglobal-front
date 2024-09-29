import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getAllNations, getSchools, deleteAllInterestedSchools } from '../utils/api';
import {phaseMapping} from '../utils/constants';

const PhaseModal = () => {
  const { meUserProfile, setMeUserProfile } = useContext(UserContext);

  // 初始化狀態變量
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [phase, setPhase] = useState('');
  const [originSchoolName, setOriginSchoolName] = useState('');
  const [exchangeSchoolName, setExchangeSchoolName] = useState('');
  const [interestedSchools, setInterestedSchools] = useState([]);
  const [allNations, setAllNations] = useState([]);
  const [schools, setSchools] = useState([]);

  // 使用 useEffect 初始化狀態
  useEffect(() => {
    if (meUserProfile) {
      setPhase(meUserProfile.phase || '');
      setOriginSchoolName(meUserProfile.originSchoolName || '');
      setExchangeSchoolName(meUserProfile.exchangeSchoolName || '');
      setInterestedSchools(meUserProfile.interestedSchools || []);

      // 當 phase 為 null 時，打開 modal
      if (!meUserProfile.phase) {
        setIsPhaseModalOpen(true);
      }
    }
  }, [meUserProfile]);

  // 選擇階段時的處理
  const handlePhaseChange = async (selectedPhase) => {
    setPhase(selectedPhase);

    if (selectedPhase !== 'APPLYING') {
      setInterestedSchools([]);
      await deleteAllInterestedSchools(); // 確保 interestedSchools 為空
    }

    setIsPhaseModalOpen(true); // 打開學校設置的 Modal
  };

  // 保存階段和學校的處理
  const handleSavePhaseAndSchools = async () => {
    setMeUserProfile({
      ...meUserProfile,
      phase,
      originSchoolName,
      exchangeSchoolName,
      interestedSchools,
    });

    setIsPhaseModalOpen(false); // 保存後關閉 Modal
  };

  // 獲取國家和學校的數據
  useEffect(() => {
    async function fetchNationsAndSchools() {
      const nationsData = await getAllNations();
      setAllNations(nationsData);
    }
    fetchNationsAndSchools();
  }, []);

  // 檢查是否有 meUserProfile，如果沒有則返回 null
  if (!meUserProfile) {
    return null;
  }

  return (
    <div className="phase-modal-container">
      <div className="phase-info">
      <img src='/img/earth.jpg'></img>
      {phase === null || phase == "" ? (
          <>
            <h2>Let's Go Global!</h2>
            <p>現在就進行階段與目標學校設定，為您推薦最佳內容與夥伴！</p>
          </>
        ) : (
          <>
            <p className="phase">{phaseMapping[phase] || '未設定'}</p>
            {phase === 'APPLYING' && (
              <>
                {interestedSchools.length > 0 ? (
                  interestedSchools.map((school, index) => (
                    <p key={index} className="exchange-school">{school}</p>
                  ))
                ) : (
                  <p>未設定</p>
                )}
              </>
            )}
            {phase !== 'APPLYING' && (
              <>
                <p className="exchange-school">{exchangeSchoolName || '未設定'}</p>
              </>
            )}
          </>
        )}
        <button onClick={() => setIsPhaseModalOpen(true)}>設定階段</button>
      </div>

      {isPhaseModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>設定階段與學校</h2>
            <select onChange={(e) => handlePhaseChange(e.target.value)} value={phase}>
              <option value="">請選擇階段</option>
              <option value="APPLYING">申請中</option>
              <option value="ADMITTED">已錄取</option>
              <option value="STUDYING_ABROAD">留學中</option>
              <option value="RETURNED">已返國</option>
            </select>

            {phase && (
              <>
                <h3>選擇原學校</h3>
                <select onChange={(e) => setOriginSchoolName(e.target.value)} value={originSchoolName}>
                  <option value="">請選擇學校</option>
                  {schools.map((school) => (
                    <option key={school.schoolId} value={school.schoolName}>{school.schoolName}</option>
                  ))}
                </select>

                {(phase === 'ADMITTED' || phase === 'STUDYING_ABROAD' || phase === 'RETURNED') && (
                  <>
                    <h3>選擇目的學校</h3>
                    <select onChange={(e) => setExchangeSchoolName(e.target.value)} value={exchangeSchoolName}>
                      <option value="">請選擇學校</option>
                      {schools.map((school) => (
                        <option key={school.schoolId} value={school.schoolName}>{school.schoolName}</option>
                      ))}
                    </select>
                  </>
                )}

                {phase === 'APPLYING' && (
                  <>
                    <h3>選擇感興趣的學校</h3>
                    <select onChange={(e) => setInterestedSchools([...interestedSchools, e.target.value])} multiple>
                      {schools.map((school) => (
                        <option key={school.schoolId} value={school.schoolName}>{school.schoolName}</option>
                      ))}
                    </select>
                  </>
                )}

                <button onClick={handleSavePhaseAndSchools}>保存</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseModal;
