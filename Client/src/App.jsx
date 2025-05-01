// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Components
import NavBar from "./components/NavBar";
import ChatWidget from "./Components/ChatWidget"; // ✅ NEW

// Layouts
import SeekerLayout from "./components/Layout/SeekerLayout";
import CompanyLayout from "./components/Layout/CompanyLayout";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import WhoWeArePage from "./pages/WhoWeArePage";
import RegisterPage from "./Register/RegisterPage";
import RegisterJobSeeker from "./Register/RegisterJobSeeker";
import RegisterCompany from "./Register/RegisterCompany";
import LoginPage from "./Login/LoginPage";
import SeekerProfile from "./SeekerPage/SeekerProfile";
import SwipePage from "./SeekerPage/SwipePage";
import HistoryPage from "./SeekerPage/HistoryPage";
import JobDetails from "./Components/JobDetails";
import AdminLogin from "./AdminPage/AdminLogin";
import AdminDashboard from "./AdminPage/AdminDashboard";
import AdminInitializer from "./AdminPage/AdminInitializer";

// Company Pages
import CompanyDetails from "./CompanyPage/CompanyDetails";
import CreateJobPosting from "./CompanyPage/CreateJobPosting";
import ManageJobPostings from "./CompanyPage/ManageJobPostings";
import Applicants from "./CompanyPage/Applicants";
import ChatCompany from "./CompanyPage/Chat";
import Chats from "./SeekerPage/Chats";
import ChatSeeker from "./SeekerPage/ChatSeeker";

function App() {
  const location = useLocation();

  const publicRoutes = [
    "/",
    "/about",
    "/who-we-are",
    "/Register",
    "/Register/RegisterJobSeeker",
    "/Register/RegisterCompany",
    "/Login",
  ];

  const showNav = publicRoutes.includes(location.pathname);

  return (
    <>
      {showNav && <NavBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/who-we-are" element={<WhoWeArePage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Register/RegisterJobSeeker" element={<RegisterJobSeeker />} />
        <Route path="/Register/RegisterCompany" element={<RegisterCompany />} />
        <Route path="/Login" element={<LoginPage />} />

        {/* Job Seeker Routes with Layout */}
        <Route path="/seeker" element={<SeekerLayout />}>
          <Route path="profile" element={<SeekerProfile />} />
          <Route path="swipe" element={<SwipePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="messages" element={<Chats />} />
          <Route path="messages/:companyId" element={<ChatSeeker />} />
        </Route>
        <Route path="/job/:id" element={<JobDetails />} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="initialize" element={<AdminInitializer />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Company Routes with Layout */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<CompanyDetails />} />
          <Route path="profile" element={<CompanyDetails />} />
          <Route path="create-job" element={<CreateJobPosting />} />
          <Route path="manage-jobs" element={<ManageJobPostings />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="chat/:applicantId" element={<ChatCompany />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

      <ChatWidget /> {/* ✅ Widget on all pages */}
    </>
  );
}

export default App;
