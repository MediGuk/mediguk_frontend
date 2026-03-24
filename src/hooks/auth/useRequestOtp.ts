import { useMutation } from '@tanstack/react-query';
import { requestOtp } from '@/api/auth';
import type { RequestOtpDTO } from '@/types/models';

type RequestOtpResponse = {
  otp: string;
};

export function useRequestOtp() {
  return useMutation<RequestOtpResponse, Error, RequestOtpDTO>({
    mutationFn: requestOtp,
    onSuccess: (data) => {
      console.log('✅ REQUEST OK', data);
    },
    onError: (error) => {
      console.log('❌ REQUEST ERROR', error);
    },
  });
}