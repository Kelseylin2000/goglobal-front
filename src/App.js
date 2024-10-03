import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import FindPartnerPage from './pages/FindPartnerPage';
import SearchResultPage from './pages/SearchResultPage';

import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import PhaseModal from './components/PhaseModal';


import { PostProvider } from './context/PostContext';
import { SaveProvider } from './context/SaveContext';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';


const Layout = ({ children }) => {

  const location = useLocation();
  const noHeaderRoutes = ['/signin', '/signup'];

  const showHeader = !noHeaderRoutes.includes(location.pathname);

  const showPhaseModal = ['/', '/find-partner'].includes(location.pathname) || 
    location.pathname.startsWith('/user/'); 

  return (
    <>
      {showHeader && <Header />} 
      {children}
      {showHeader && <ChatWindow />}
      {showHeader && showPhaseModal && <PhaseModal />}
    </>
  );
};

function App() {
return (
  <AuthProvider>
    <UserProvider>
      <SaveProvider>
        <PostProvider>
          <ChatProvider>
            <Router>
              <ToastContainer 
                position="top-center"
                hideProgressBar={true}
                autoClose={1800}
                className="custom-toast-container"
              />
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
                  <Route 
                    path="/find-partner" 
                    element={
                      <PrivateRoute>
                        <FindPartnerPage />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/user/:userId" element={<UserProfilePage />} />
                  <Route path="/search" element={<SearchResultPage />} />
                </Routes>
              </Layout>
            </Router>
          </ChatProvider>
        </PostProvider>
      </SaveProvider>
    </UserProvider>
  </AuthProvider>
);
}

export default App;