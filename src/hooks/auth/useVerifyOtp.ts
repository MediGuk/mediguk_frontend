import { useMutation } from '@tanstack/react-query';
import { verifyOtp } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import type { VerifyOtpDTO, AuthResponse } from '@/types/models';
import { useAuth } from '@/context/AuthContext';

export function useVerifyOtp() {

  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation<AuthResponse, Error, VerifyOtpDTO>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log('✅ VERIFY OK', data);
      if (data.jwtToken) {
        login(data.jwtToken);
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      console.log('❌ VERIFY ERROR', error);
    },
  });
}