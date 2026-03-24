import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MedicalInteraction } from './MedicalInteraction';

export const PatientDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative w-full">
      {/* Botón de Logout Minimalista */}
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors z-50"
        title="Cerrar sesión"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      </button>

      {/* Triage / Interacción Médica Central */}
      <MedicalInteraction />

    </div>
  );
};
