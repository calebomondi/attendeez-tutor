// src/components/Header.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TeacherInfo } from '../../types';
import apiService from '../../services/apiService';
import Home from '../Home/home';
import Attendance from '../attendance/attendance';
import Authenticate from '../auth/authenticate';
import MyAccount from '../myaccount/myaccount';
import Session from '../attendance/session';
import { AuthProvider } from '../auth/authProvider';
import { ProtectedRoute } from '../auth/protectedRoute';
import { useAuth } from '../auth/useAuth';

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();
  const email: string = user?.email || 'macharianancy@jkuat.ac.ke';
  console.log(`user-email-> ${email}`)

  const [data, setData] = useState<TeacherInfo>({
    "teacher_id": "",
    "name": "",
    "email": "",
    "units": [
      {
        "unit_id": "",
        "semester": ""
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getTeacherInfo(email)
        setData(result)
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }
    fetchData()
  }, [email]);

  const teacher_id = data.teacher_id;
  const unit_id = data.units[0].unit_id;

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home teacher_id={teacher_id} unit_id={unit_id}/>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/session-attendance" 
        element={
          <ProtectedRoute>
            <Session />
          </ProtectedRoute>
        } 
      />
      <Route path="/auth" element={<Authenticate />} />
    </Routes>
  );
};

// Main Header component
export default function Header() {
  return (
    <Router>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </Router>
  );
}