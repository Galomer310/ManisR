import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LaunchScreen from "./screens/LaunchScreen";
import LoginRegister from "./screens/LoginRegister";
import RegisterIntro from "./screens/RegisterIntro";
import RegisterPhone from "./screens/RegisterPhone";
import RegisterCode from "./screens/RegisterCode";
import RegisterDetails from "./screens/RegisterDetails";
import LoginPhone from "./screens/LoginPhone";
import LoginCode from "./screens/LoginCode";
import PreferencesLocation from "./screens/PreferencesLocation";
import PreferencesFood from "./screens/PreferencesFood";
import HomePage from "./screens/HomePage";
import GiverUploadFood from "./screens/GiverUploadFood";
import Profile from "./screens/Profile";
import Messages from "./screens/Messages";
import Settings from "./screens/Settings";
import TalkToUs from "./screens/TalkToUs";
import GiveFood from "./screens/GiveFood";
import CollectFood from "./screens/CollectFood";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/register" element={<RegisterIntro />} />
        <Route path="/register/phone" element={<RegisterPhone />} />
        <Route path="/register/code" element={<RegisterCode />} />
        <Route path="/register/details" element={<RegisterDetails />} />
        <Route path="/login" element={<LoginPhone />} />
        <Route path="/login/code" element={<LoginCode />} />
        <Route path="/preferences/location" element={<PreferencesLocation />} />
        <Route path="/preferences/food" element={<PreferencesFood />} />
        <Route path="/give-food" element={<GiverUploadFood />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/talk-to-us" element={<TalkToUs />} />
        <Route path="/give-food" element={<GiveFood />} />
        <Route path="/collect-food" element={<CollectFood />} />
      </Routes>
    </Router>
  );
};

export default App;
