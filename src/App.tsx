import { Routes, Route } from 'react-router-dom';
import { PatientLogin } from '@/components/patient/Login';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PatientDashboard } from '@/components/patient/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PatientLogin />} />
      <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
