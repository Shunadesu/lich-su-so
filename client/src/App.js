import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ContentList from './pages/ContentList';
import ContentDetail from './pages/ContentDetail';
import UploadContent from './pages/UploadContent';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import UserManagement from './pages/UserManagement';
import ContentApproval from './pages/ContentApproval';
import CreateFirstTeacher from './pages/CreateFirstTeacher';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lich-su-10" element={<ContentList category="lich-su-10" />} />
          <Route path="/lich-su-11" element={<ContentList category="lich-su-11" />} />
          <Route path="/lich-su-12" element={<ContentList category="lich-su-12" />} />
          <Route path="/lich-su-dia-phuong" element={<ContentList category="lich-su-dia-phuong" />} />
          <Route path="/content" element={<ContentList />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Protected Routes */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadContent />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireTeacher>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requireTeacher>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute requireTeacher>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/content-approval" element={
            <ProtectedRoute requireTeacher>
              <ContentApproval />
            </ProtectedRoute>
          } />
          <Route path="/student-dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-first-teacher" element={<CreateFirstTeacher />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App; 