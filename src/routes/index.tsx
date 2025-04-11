import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Dashboard from '../components/Admin/Dashboard';
import UserManagement from '../components/Admin/UserManagement';
import Profile from '../components/User/Profile';
import FamilyTree from '../components/User/FamilyTree';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="family-tree" element={<FamilyTree />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;