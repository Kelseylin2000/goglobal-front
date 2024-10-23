import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { signUp } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { signIn } from '../utils/api';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleSignUp = (event) => {
    event.preventDefault();

    signUp(name, email, password)
      .then((data) => {
        if (data.error) {
          alert('註冊失敗: ' + data.error);
        } else if (data.data && data.data.accessToken) {
          setAuth(data.data.accessToken, data.data.user.userId);
          navigate('/'); // Redirect to HomePage after successful sign-up
        } else {
          alert('註冊失敗: 無法取得 access token。');
        }
      })
      .catch((error) => {
        console.error('錯誤:', error);
      });
  };

  const handleQuickSignIn = () => {
    signIn("native", '1@gmail.com', '123')
      .then((data) => {
        if (data.error) {
          alert('快速登入失敗: ' + data.error);
        } else if (data.data && data.data.accessToken) {
          setAuth(data.data.accessToken, data.data.user.userId);
          navigate('/');
        } else {
          alert('快速登入失敗: 無法取得 access token。');
        }
      })
      .catch((error) => {
        console.error('快速登入錯誤:', error);
      });
  };

  return (
    <div className="container">
      <div className="main-container">
        <h2>註冊</h2>
        <form onSubmit={handleSignUp}>
          <label htmlFor="name">名稱</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          /><br />

          <label htmlFor="email">電子郵件</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />

          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />

          <button className='normal-btn' type="submit">註冊</button>
        </form>
        <button className='normal-btn' onClick={() => navigate('/signin')}>前往登入</button>
        <button className='highlight-btn' onClick={handleQuickSignIn}>免註冊 快速瀏覽網站</button>
        <p>* 快速瀏覽：模擬正在申請東京大學及加州理工學院的學生角色</p>
      </div>
      <div className="intro-container">
        <img className="signin-logo" src="/img/GoGlobal.png" alt="GoGlobal" />
        <img className="signin-img" src="/img/signin-img.png" alt="Earth" />
        <h3>為交換生與留學生打造的社群平台</h3>
        <p>無論您正準備申請或已在異國求學</p>
        <p>我們將依據您的所處階段和目標學校</p>
        <p>為您提供個性化的資訊與人脈連結</p>
        <p>With <span className='blue-word'>GoGlobal</span>, Let's Go Global!</p>
      </div>
    </div>
  );
};

export default SignUpPage;
