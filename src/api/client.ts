import { getAccessToken, setAccessToken, logout } from '@/utils/auth';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export async function apiFetch(url: string, options: RequestInit = {}) 
{
  const token = getAccessToken();

  const isFormData = options.body instanceof FormData;

  let res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Token expirado (401)
  if (res.status === 401) {
    console.log("🔄 Token expirado - Intentando Silent Refresh...");

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = fetch('http://localhost:8080/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      .then(async (refreshRes) => {
        if (!refreshRes.ok) {
          throw new Error("Refresh session failed");
        }
        const data = await refreshRes.json();
        const newToken = data.jwtToken;
        
        // Guardar nuevo token
        setAccessToken(newToken);
        console.log("✅ Token refrescado con éxito");
        return newToken;
      })
      .catch((error) => {
        console.error("❌ Error en Silent Refresh:", error);
        // Sesión caducada del todo o error en servidor Java -> Logout forzoso
        logout();
        throw error;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    try {
      // Esperar al refresh en curso (propio o de otra petición paralela)
      const newToken = await refreshPromise;

      if (newToken) {
        // Repetir request original con el nuevo token
        res = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
        });
      }
    } catch (retryError) {
       console.error("Retry failed after refresh:", retryError);
    }
  }

  if (!res.ok) {
    // Si llegamos aquí después de un refresh fallido, lanzamos error
    const errorData = await res.json().catch(() => ({ message: 'API Error' }));
    throw new Error(errorData.message || 'API Error');
  }

  return res.json();
}