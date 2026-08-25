import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { ExperiencePage } from './pages/ExperiencePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TravelPage } from './pages/TravelPage';
import { TravelDetailPage } from './pages/TravelDetailPage';
import { AviationPage } from './pages/AviationPage';
import { AviationDetailPage } from './pages/AviationDetailPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminExperience } from './pages/admin/AdminExperience';
import { AdminTechnologies } from './pages/admin/AdminTechnologies';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminTravel } from './pages/admin/AdminTravel';
import { AdminAviation } from './pages/admin/AdminAviation';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ================================================================= */}
            {/* PUBLIC CLIENT-FACING ROUTES */}
            {/* ================================================================= */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/travel" element={<TravelPage />} />
              <Route path="/travel/:id" element={<TravelDetailPage />} />
              <Route path="/aviation" element={<AviationPage />} />
              <Route path="/aviation/:id" element={<AviationDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* ================================================================= */}
            {/* ADMIN AUTHENTICATION */}
            {/* ================================================================= */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ================================================================= */}
            {/* PROTECTED ADMIN CONSOLE ROUTES */}
            {/* ================================================================= */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="technologies" element={<AdminTechnologies />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="travel" element={<AdminTravel />} />
              <Route path="aviation" element={<AdminAviation />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
