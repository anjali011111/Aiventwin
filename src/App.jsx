import { Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './app/AuthProvider';
import { TwinProvider } from './app/TwinProvider';
import ProtectedRoute from './app/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import PublicLayout from './components/layout/PublicLayout';
import CommandPalette from './components/layout/CommandPalette';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import ForgotPassword from './pages/public/ForgotPassword';
import VerifyEmail from './pages/public/VerifyEmail';
import About from './pages/public/About';
import Privacy from './pages/public/Privacy';

import PatientDashboard from './pages/patient/Dashboard';
import Records from './pages/patient/Records';
import Vitals from './pages/patient/Vitals';
import PatientTwin from './pages/patient/DigitalTwin';
import Timeline from './pages/patient/Timeline';
import Medications from './pages/patient/Medications';
import Appointments from './pages/patient/Appointments';
import Insights from './pages/patient/Insights';
import FamilyHistory from './pages/patient/FamilyHistory';
import Assistant from './pages/patient/Assistant';
import PatientSettings from './pages/patient/Settings';

import DoctorDashboard from './pages/doctor/Dashboard';
import Patients from './pages/doctor/Patients';
import PatientDetail from './pages/doctor/PatientDetail';
import DoctorTwin from './pages/doctor/DigitalTwin';
import Analytics from './pages/doctor/Analytics';
import PredictionReview from './pages/doctor/PredictionReview';
import Evidence from './pages/doctor/Evidence';
import DoctorSettings from './pages/doctor/Settings';

export default function App() {
  return (
    // reducedMotion="user" makes every Framer Motion animation respect prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <TwinProvider>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route element={<PublicLayout />}>
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>

            <Route path="/patient" element={<ProtectedRoute role="patient" />}>
              <Route element={<AppShell role="patient" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="records" element={<Records />} />
                <Route path="vitals" element={<Vitals />} />
                <Route path="digital-twin" element={<PatientTwin />} />
                <Route path="timeline" element={<Timeline />} />
                <Route path="medications" element={<Medications />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="insights" element={<Insights />} />
                <Route path="family-history" element={<FamilyHistory />} />
                <Route path="assistant" element={<Assistant />} />
                <Route path="settings" element={<PatientSettings />} />
              </Route>
            </Route>

            <Route path="/doctor" element={<ProtectedRoute role="doctor" />}>
              <Route element={<AppShell role="doctor" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="patients/:patientId" element={<PatientDetail />} />
                <Route path="digital-twin" element={<DoctorTwin />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="insights" element={<PredictionReview />} />
                <Route path="evidence" element={<Evidence />} />
                <Route path="settings" element={<DoctorSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<div className="grid min-h-screen place-items-center text-center"><div><h1 className="font-serif text-4xl text-navy">Page not found</h1><a href="/" className="mt-3 inline-block font-semibold text-bluex">Back to home</a></div></div>} />
          </Routes>
        </TwinProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
