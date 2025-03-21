import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import all screen components
import LaunchScreen from "./screens/LaunchScreen";
import LoginRegister from "./screens/LoginRegister";
import RegisterIntro from "./screens/RegisterIntro";
import RegisterPhone from "./screens/RegisterPhone";
import RegisterCode from "./screens/RegisterCode";
// import RegisterScreen from "./screens/RegisterScreen";
import RegisterDetails from "./screens/RegisterDetails";
import LoginPhone from "./screens/LoginPhone";
import LoginCode from "./screens/LoginCode";
import PreferencesLocation from "./screens/PreferencesLocation";
import PreferencesFood from "./screens/PreferencesFood";
import GiverUploadFood from "./screens/GiverUploadFood";
import GiverMealCardApproval from "./screens/GiverMealCardApproval";
import HomePage from "./screens/HomePage";
import Profile from "./screens/Profile";
import Messages from "./screens/Messages";
import Settings from "./screens/Settings";
import TalkToUs from "./screens/TalkToUs";
import GiveFood from "./screens/GiveFood";
import CollectFood from "./screens/CollectFood";
import UnderConstruction from "./screens/UnderConstruction";
import GiverMealMapScreen from "./screens/GiverMealMapScreen";

/**
 * App sets up the main router and routes for the application.
 */
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
        <Route
          path="/giver-meal-approval"
          element={<GiverMealCardApproval />}
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/talk-to-us" element={<TalkToUs />} />
        <Route path="/give-food" element={<GiveFood />} />
        <Route path="/giver-meal-map" element={<GiverMealMapScreen />} />
        <Route path="/collect-food" element={<CollectFood />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
      </Routes>
    </Router>
  );
};

export default App;
