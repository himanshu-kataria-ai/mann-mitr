// src/components/Router.jsx
import React from "react";
import { Routes, Route } from "react-router"
import Home from "../screens/Home";
import Layout from "../components/Layout";
import Chat from "../screens/Chat";
import UserDetail from "../screens/UserDetail";
import BreathingScreen from "../screens/BreathingScreen";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/user-details' element={<UserDetail/>}/>
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/breathing" element={<BreathingScreen/>}/>
      {/* Optional: Add a fallback for undefined routes */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRouter;
