
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginForm from "./Component/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Routes/ProtectedRoutes";
import Unauthorized from "./Pages/error/Unauthorized";
import 'react-toastify/dist/ReactToastify.css';

import HomePage from "./Pages/Home"; 
import UserManagement from "./Dashboard/UserManagement/UserMangement";
import AwsServices from "./Dashboard/AwsServices/AwsServices";
import OnboardingDashboard from "./Dashboard/Onboarding/OnboardingDashboard";
import CostExplorer from "./Dashboard/CostExplorer/CostExplorer";
import User from "./Component/User";
import EditUser from "./Component/EditUser";
const ProtectedLogin = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  
  return token ? <Navigate to="/home/user-management" replace /> : children;
};

const App = () => {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/login"
        element={
          <ProtectedLogin>
            <LoginForm />
          </ProtectedLogin>
        }/>
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "READ_ONLY", "USER"]}>
            <HomePage />
          </ProtectedRoute>
        }
      >
        <Route
          path="user-management"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "READ_ONLY"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="user-management/createuser"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="user-management/edit-user/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <EditUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="onboarding"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <OnboardingDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="cost-explorer"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "READ_ONLY", "USER"]}>
              <CostExplorer />
            </ProtectedRoute>
          }
        />
        <Route
          path="aws-services"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "READ_ONLY", "USER"]}>
              <AwsServices />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </>
    
  );
};

export default App;
