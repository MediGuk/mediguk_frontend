import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const PatientDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};
