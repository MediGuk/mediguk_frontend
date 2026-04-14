import { apiFetch } from '@/api/client';

const GO_BACKEND_URL = 'http://localhost:8090/api/triage-context';

export interface TriageResponse {
  questions: string[];
  case_title: string;
  is_complete: boolean;
  is_emergency: boolean;
}

export async function sendTriageContext(
  text: string,
  isFinal: boolean = false,
  image?: File,
  audio?: Blob,
  newSession: boolean = false
): Promise<TriageResponse> {
  const formData = new FormData();
  
  if (text) formData.append('text', text);
  if (isFinal) formData.append('isFinal', 'true');
  if (newSession) formData.append('newSession', 'true');
  if (image) formData.append('image', image);
  if (audio) formData.append('audio', audio, 'recording.webm');

  return apiFetch(GO_BACKEND_URL, {
    method: 'POST',
    body: formData,
  });
}
