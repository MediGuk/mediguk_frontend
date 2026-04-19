import { apiFetch } from '@/api/client';

const GO_BACKEND_URL = 'http://localhost:8090/api/triage-context';

export interface TriageResponse {
  question: string;
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

const TRANSCRIBE_URL = 'http://localhost:8090/api/transcribe';

export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  return apiFetch(TRANSCRIBE_URL, {
    method: 'POST',
    body: formData,
  });
}
export interface TriageHistoryItem {
  id: string;
  category: string;
  status: string;
  fullTranscript?: {
    question: string;
    answer: string;
  }[];
  stage1Details: {
    specialtyDetails?: {
      aiSummary: string;
      mainSymptom: string;
      suspectedDiagnosis: string;
      systemAffected: string;
      generalState: string;
      requiresUrgentLab: boolean;
      urgencyLevel?: number; // Agregamos este por si acaso lo mandamos luego
    }
  }
}

export async function fetchTriageHistory(): Promise<TriageHistoryItem[]> {
  return apiFetch('http://localhost:8080/api/triage/history', {
    method: 'GET',
  });
}
