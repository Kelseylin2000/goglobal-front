import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { signUp } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

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

  return (
    <div className="container">
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

        <button type="submit">註冊</button>
      </form>
      <button onClick={() => navigate('/signin')}>前往登入</button>
    </div>
  );
};

export default SignUpPage;
