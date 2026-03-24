import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MedicalInteraction } from './MedicalInteraction';
import { LogoutIcon } from '@/components/Icons';

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
        className="absolute top-4 right-4 p-2 text-red-500 bg-slate-200 hover:text-red-800 rounded-full hover:bg-red-200 transition-colors z-50"
        title="Cerrar sesión"
      >
        <LogoutIcon className="w-7 h-7" />
      </button>

      {/* Triage / Interacción Médica Central */}
      <MedicalInteraction />

    </div>
  );
};
