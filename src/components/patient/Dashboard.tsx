import { useAuth } from '@/context/AuthContext';

export const PatientDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido al Dashboard!</h1>
        <p className="text-gray-500 mb-8">Has iniciado sesión correctamente (Portal Paciente).</p>
        
        <button 
          onClick={logout}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
        >
          Cerrar Sesión (Logout)
        </button>
      </div>
    </div>
  );
};
