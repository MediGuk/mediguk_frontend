import { useMutation } from '@tanstack/react-query';
import { requestOtp } from '@/api/auth';

export function useRequestOtp() {
  return useMutation({
    mutationFn: requestOtp,
  });
}