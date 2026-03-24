import type { RequestOtpDTO } from '@/types/models';

type RequestOtpResponse = {
  otp: string;
};

export async function requestOtp(data: RequestOtpDTO): Promise<RequestOtpResponse> {
  const res = await fetch('http://localhost:8080/auth/request-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error requesting OTP');
  }

  return res.json();
}