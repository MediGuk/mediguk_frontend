import { useState } from 'react';
import { useRequestOtp } from '@/hooks/useRequestOtp';
import { FullScreenLoader } from '@/components/FullScreenLoader';

export const PatientLogin = () => {
  const [dni, setDni] = useState('');
  const { mutate, isPending, isError, error, data } = useRequestOtp();

  const handleClick = () => {
    mutate({ documentNumber: dni });
  };

  return (
    <>
      <FullScreenLoader isPending={isPending} message="Enviando código OTP..." delayMs={300} />

      <div className="w-full max-w-sm mx-auto my-16 p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-center mb-6 relative">
          <img src="/mediguk.png" alt="Mediguk" className="h-24 w-24 object-cover rounded-2xl shadow-sm opacity-90" />
        </div>
        
        <h1 className="text-xl font-bold mb-6 text-center tracking-wider text-gray-900 border-b pb-4">
          PORTAL DEL PACIENTE
        </h1>
        
        <p className="mb-4 text-sm text-gray-600 text-center">
          Inserta el DNI de prueba: <strong>12345678A</strong>
        </p>
        
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="12345678A"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          />
        </div>
        
        {isError && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {error?.message}
          </p>
        )}

        {data && (
          <p className="text-green-600 text-sm mt-2 text-center">
            OTP: {data.otp}
          </p>
        )}
        
        <button 
          onClick={handleClick}
          disabled={isPending}
          className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? 'Enviando...' : 'Acceder'}
        </button>
      </div>
    </>
  );
};
