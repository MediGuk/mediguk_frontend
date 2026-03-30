import { getAccessToken } from '@/utils/auth';

const GO_BACKEND_URL = 'http://localhost:8090/api/triage-context';

export interface TriageResponse {
  extraData: {
    anatomSite: string | null;
    onset: string | null;
    technicalDetails: string;
    severity: string | null;
  };
  suggestedCategory: string;
  datos_faltantes: string[];
  resumenClinico: string;
}

export async function sendTriageContext(
  text: string,
  isFinal: boolean = false,
  image?: File,
  audio?: Blob
): Promise<TriageResponse> {
  const token = getAccessToken();
  const formData = new FormData();
  
  if (text) formData.append('text', text);
  if (isFinal) formData.append('isFinal', 'true');
  if (image) formData.append('image', image);
  if (audio) formData.append('audio', audio, 'recording.webm');

  const response = await fetch(GO_BACKEND_URL, {
    method: 'POST',
    credentials: 'include', // Para la cookie de fingerprint
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error en la petición de triaje');
  }

  return response.json();
}
