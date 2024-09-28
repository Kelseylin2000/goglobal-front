import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import SimpleUserProfileInfo from '../components/SimpleUserProfileInfo';

const FindPartnerPage = () => {
  const { sameSchoolUserProfiles, meUserProfile } = useContext(UserContext);

  // 檢查 meUserProfile 是否存在
  const schoolRecommendation =
    meUserProfile?.exchangeSchoolName ||
    (meUserProfile?.interestedSchools && meUserProfile.interestedSchools.length > 0
      ? meUserProfile.interestedSchools.join(', ')
      : null);

  return (
    <main>
      <h2 className='page-title'>校園夥伴</h2>
      {schoolRecommendation ? (
        <p className='page-subtitle'>
          嗨 {meUserProfile?.name} ! 為您推薦的校園夥伴是原學校或目的學校為 <span className="page-subtitle-em">{schoolRecommendation}</span> 的學生們，快來和他們一起交流吧！
        </p>
      ) : (
        <p>您目前還未設定感興趣的學校或著即將前往的目的學校，設定完成後就會為您推薦校園夥伴！</p>
      )}

      {sameSchoolUserProfiles && sameSchoolUserProfiles.length > 0 ? (
        sameSchoolUserProfiles.map((userProfile, index) => (
          <SimpleUserProfileInfo key={index} profile={userProfile} />
        ))
      ) : (
        <p>目前沒有來自或前往同一學校的其他用戶。</p>
      )}
    </main>
  );
};

export default FindPartnerPage;
