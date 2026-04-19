import { useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MedicalInteraction } from './MedicalInteraction';
import { LogoutIcon, PlusIcon, SearchIcon } from '@/components/Icons';
import { TriageHistoryModal } from './TriageHistoryModal';
import { fetchTriageHistory } from '@/api/triageContext';
import type { TriageHistoryItem } from '@/api/triageContext';
import { useState } from 'react';

export const PatientDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const triageRef = useRef<{ handleReset: () => void }>(null);
  const [history, setHistory] = useState<TriageHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await fetchTriageHistory();
      setHistory(data);
      setIsHistoryOpen(true);
    } catch (err: any) {
      console.error("Error loading history:", err);
    } finally {
      setLoadingHistory(false);
    }
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

      {/* Botón de Historial (Lupa) */}
      <button 
        onClick={handleOpenHistory}
        disabled={loadingHistory}
        className="absolute top-36 right-4 p-2 text-slate-600 bg-slate-200 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all z-50 shadow-sm"
        title="Ver historial médico"
      >
        {loadingHistory ? (
          <div className="w-7 h-7 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <SearchIcon className="w-7 h-7" />
        )}
      </button>

      {/* Triage / Interacción Médica Central */}
      <MedicalInteraction ref={triageRef} />

      {/* MODAL DE HISTORIAL */}
      {isHistoryOpen && (
        <TriageHistoryModal 
          history={history} 
          onClose={() => setIsHistoryOpen(false)} 
        />
      )}

    </div>
  );
};
