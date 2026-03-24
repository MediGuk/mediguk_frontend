import { useMutation } from '@tanstack/react-query';
import { verifyOtp } from '@/api/auth';
import type { VerifyOtpDTO, AuthResponse } from '@/types/models';

export function useVerifyOtp() {
  return useMutation<AuthResponse, Error, VerifyOtpDTO>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log('✅ VERIFY OK', data);
    },
    onError: (error) => {
      console.log('❌ VERIFY ERROR', error);
    },
  });
}