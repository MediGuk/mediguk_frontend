import type { RequestOtpDTO, VerifyOtpDTO, AuthResponse } from '@/types/models';

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
    throw new Error(errorData.error || errorData.message || 'Error requesting OTP');
  }

  return res.json();
}


export async function verifyOtp(data: VerifyOtpDTO): Promise<AuthResponse> {
  const res = await fetch('http://localhost:8080/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || errorData.message || 'Error verifying OTP');
  }

  return res.json();
}