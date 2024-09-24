import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { signIn } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleSignIn = (event) => {
    event.preventDefault();
    const provider = "native";
    
    signIn(provider, email, password)
      .then((data) => {
        if (data.error) {
          alert('登入失敗: ' + data.error);
        } else if (data.data && data.data.accessToken) {
          setAuth(data.data.accessToken, data.data.user.userId);
          navigate('/'); // Redirect to HomePage after successful sign-in
        } else {
          alert('登入失敗: 無法取得 access token。');
        }
      })
      .catch((error) => {
        console.error('錯誤:', error);
      });
  };

  return (
    <div className="container">
      <h2>登入</h2>
      <form onSubmit={handleSignIn}>
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

        <button type="submit">登入</button>
      </form>
      <button onClick={() => navigate('/signup')}>前往註冊</button>
    </div>
  );
};

export default SignInPage;
