import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import Landing from './app/landing/landing';
import NoPage from './app/nopage/nopage';
import Login from './app/auth/login/login';
import Input from './app/dashboard/input';
import Result from './app/result/result';
import Dashboard from './app/dashboard/dashboard';

import { auth, signInWithGoogle, firestore } from "./firebase/firebase_config";
import { useAuthState } from "react-firebase-hooks/auth";
import AboutView from './app/about/AboutView';
import HelpView from './app/help/HelpView';
import ProfileView from './app/auth/profile/ProfileView';

function App() {

  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} auth={auth} signInWithGoogle={signInWithGoogle} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/input" element={<Input  user={user} auth={auth} signInWithGoogle={signInWithGoogle} />} />
        <Route path="/result" element={<Result user={user} auth={auth} signInWithGoogle={signInWithGoogle}/>} />
        <Route path='/about' element={<AboutView user={user} auth={auth} signInWithGoogle={signInWithGoogle} />} />
        <Route path='/profile' element={<ProfileView user={user} auth={auth} signInWithGoogle={signInWithGoogle} />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;