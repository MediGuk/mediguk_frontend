import { useMutation } from '@tanstack/react-query';
import { verifyOtp } from '@/api/auth';
import type { VerifyOtpDTO, AuthResponse } from '@/types/models';

export function useVerifyOtp() {
  return useMutation<AuthResponse, Error, VerifyOtpDTO>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log('✅ VERIFY OK', data);
      if (data.jwtToken) {
        localStorage.setItem("accessToken", data.jwtToken);
      }
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      console.log('❌ VERIFY ERROR', error);
    },
  });
}