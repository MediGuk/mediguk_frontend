import { useAuth } from '@/context/AuthContext';
import { setAccessToken } from '@/utils/auth';
import { handleSessionExpired } from '@/utils/session';

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  let token = useAuth().token;

  let res = await fetch(url, {
    ...options,
    credentials: 'include', // IMPORTANT: allows cookies to be sent
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Si token expirado
  if (res.status === 401) {
    console.log("Token expirado, intentando refresh...");

    const refreshRes = await fetch('http://localhost:8080/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      handleSessionExpired();
      throw new Error("Session expired");
    }

    const refreshData = await refreshRes.json();

    // Guardar nuevo token
    setAccessToken(refreshData.jwtToken);

    token = refreshData.jwtToken;

    // Repetir request original
    res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'API Error');
  }

  return res.json();
}