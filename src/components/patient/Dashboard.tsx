import { useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MedicalInteraction } from './MedicalInteraction';
import { LogoutIcon, PlusIcon } from '@/components/Icons';

export const PatientDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const triageRef = useRef<{ handleReset: () => void }>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col relative w-full overflow-hidden">
      {/* Botón de Logout Minimalista */}
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 text-red-500 bg-slate-200 hover:text-red-800 rounded-full hover:bg-red-200 transition-colors z-50 shadow-sm"
        title="Cerrar sesión"
      >
        <LogoutIcon className="w-7 h-7" />
      </button>

      {/* Botón de Nueva Sesión (Plus icon) */}
      <button 
        onClick={() => triageRef.current?.handleReset()}
        className="absolute top-20 right-4 p-2 text-blue-600 bg-slate-200 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all z-50 shadow-sm"
        title="Nueva sesión de triaje"
      >
        <PlusIcon className="w-7 h-7" />
      </button>

      {/* Triage / Interacción Médica Central */}
      <MedicalInteraction ref={triageRef} />

    </div>
  );
};
