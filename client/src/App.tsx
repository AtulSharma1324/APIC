import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

import { StudentDashboard } from './pages/StudentDashboard';
import { ProgramsPage } from './pages/ProgramsPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { CreditsPage } from './pages/CreditsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { SearchPage } from './pages/SearchPage';
import { AIAssistantPage } from './pages/AIAssistantPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProgramsPage } from './pages/admin/AdminProgramsPage';
import { AdminSpecializationsPage } from './pages/admin/AdminSpecializationsPage';
import { AdminSemestersPage } from './pages/admin/AdminSemestersPage';
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage';
import { AdminCreditsPage } from './pages/admin/AdminCreditsPage';
import { AdminSyllabusPage } from './pages/admin/AdminSyllabusPage';
import { AdminCARulesPage } from './pages/admin/AdminCARulesPage';
import { AdminAIKnowledgePage } from './pages/admin/AdminAIKnowledgePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Student Portal Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/student/curriculum" element={<CurriculumPage />} />
            <Route path="/subjects/:id" element={<SubjectDetailPage />} />
            <Route path="/student/credits" element={<CreditsPage />} />
            <Route path="/student/assessment" element={<AssessmentPage />} />
            <Route path="/student/syllabus" element={<SyllabusPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
          </Route>

          {/* Admin Protected Console Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/programs" element={<AdminProgramsPage />} />
            <Route path="/admin/specializations" element={<AdminSpecializationsPage />} />
            <Route path="/admin/semesters" element={<AdminSemestersPage />} />
            <Route path="/admin/subjects" element={<AdminSubjectsPage />} />
            <Route path="/admin/credits" element={<AdminCreditsPage />} />
            <Route path="/admin/syllabus" element={<AdminSyllabusPage />} />
            <Route path="/admin/ca-rules" element={<AdminCARulesPage />} />
            <Route path="/admin/ai-knowledge" element={<AdminAIKnowledgePage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
