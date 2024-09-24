import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';

import { PostProvider } from './context/PostContext';
import { SaveProvider } from './context/SaveContext';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderRoutes = ['/signin', '/signup'];

  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />} 
      {children}
      {showHeader && <ChatWindow />}
    </>
  );
};


function App() {
return (
  <AuthProvider>
    <SaveProvider>
      <PostProvider>
        <ChatProvider>
          <Router>
            <Layout>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  } 
                  exact 
                />
                <Route 
                  path="/post/:postId" 
                  element={
                    <PrivateRoute>
                      <PostPage />
                    </PrivateRoute>
                  } 
                />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
              </Routes>
            </Layout>
          </Router>
        </ChatProvider>
      </PostProvider>
    </SaveProvider>
  </AuthProvider>
);
}

export default App;