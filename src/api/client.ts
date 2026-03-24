import { useAuth } from '@/context/AuthContext';

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = useAuth().token;

  const res = await fetch(url, {
    ...options,
    credentials: 'include', // IMPORTANT: allows cookies to be sent
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'API Error');
  }

  return res.json();
}