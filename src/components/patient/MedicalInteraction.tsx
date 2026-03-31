import { useState } from 'react';
import { ImageIcon, MicIcon, SendIcon } from '@/components/Icons';
import { sendTriageContext } from '@/api/triageContext';
import type { TriageResponse } from '@/api/triageContext';

const HUMAN_QUESTIONS: Record<string, string> = {
  "zona_afectada": "¿En qué zona exacta lo sientes?",
  "cronopatologia": "¿Hace cuánto empezó el malestar?",
  "escala_dolor": "¿Cómo es de intenso del 1 al 10?",
  "tipo_sintoma": "¿Es pinchazo, racha o presión?",
  "sintomas_asociados": "¿Sientes alguna otra molestia?",
  "factores_disparadores": "¿Hay algo que lo empeore o mejore?"
};

export const MedicalInteraction = () => {
  const [context, setContext] = useState('');
  const [latestResponse, setLatestResponse] = useState<TriageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (messageOverride?: string) => {
    const messageToSend = typeof messageOverride === 'string' ? messageOverride : context.trim();
    
    if (!messageToSend || loading) return;

    setLatestResponse(null);
    setContext('');
    setLoading(true);

    try {
      const response = await sendTriageContext(messageToSend);
      console.log("Mediguk Server Response:", response);
      setLatestResponse(response);
    } catch (error) {
      console.error("Error sending triage message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (technicalKey: string) => {
     const question = HUMAN_QUESTIONS[technicalKey] || technicalKey;
     setContext(`Sobre ${question.toLowerCase().replace('¿', '').replace('?', '')}: `);
  };

  const handleDisabledAction = (name: string) => {
    alert(`${name} estará disponible próximamente.`);
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 gap-6 h-full overflow-hidden">
      
      {/* AREA 1: Servidor (Focused Response) */}
      <div 
        className={`flex-1 min-h-0 overflow-y-auto bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col relative ${!latestResponse && !loading ? 'items-center justify-center' : 'items-center justify-start'}`}
      >
        {!latestResponse && !loading ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <img 
              src="/mediguk.png" 
              alt="Asistente Mediguk" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shadow-sm mb-4"
            />
            <p className="text-lg sm:text-xl font-medium text-slate-800 text-center tracking-tight max-w-md">
              ¿Cómo te encuentras hoy? Cuéntame tus síntomas.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {loading ? (
               <div className="flex flex-col items-center gap-3 py-8 w-full">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium italic">Analizando tu situación...</p>
               </div>
             ) : (
               <div className="flex flex-col gap-6">
                  {/* Respuesta Principal */}
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl text-slate-800 leading-tight font-medium">
                      {latestResponse?.resumenClinico}
                    </p>
                  </div>

                  {/* Preguntas Iterativas (Datos Faltantes) */}
                  {latestResponse?.datos_faltantes?.length ? (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preguntas clave:</p>
                        <div className="flex flex-col gap-2">
                          {latestResponse.datos_faltantes.map((dato, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleQuickQuestion(dato)}
                              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                            >
                              <span className="text-base text-slate-700 font-medium group-hover:text-blue-700">
                                {HUMAN_QUESTIONS[dato] || dato}
                              </span>
                              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">RESPONDER →</span>
                            </button>
                          ))}
                        </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-green-600 font-medium bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm animate-in zoom-in duration-300">
                       <span className="text-2xl">✅</span>
                       <p className="text-base">Tengo información suficiente para tu diagnóstico preliminar.</p>
                    </div>
                  )}
               </div>
             )}
          </div>
        )}
      </div>

      {/* AREA 2: Paciente (Textarea + Botones) */}
      <div className="flex-none flex flex-col gap-2 bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm relative">
        
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="DIME QUÉ TE PASA..."
          className="w-full px-4 py-2 bg-transparent focus:outline-none resize-none h-20 sm:h-24 text-slate-700 text-base placeholder-slate-400"
          disabled={loading}
        ></textarea>
        
        {/* BARRA INFERIOR DE BOTONES */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-4 pl-8 sm:pl-10">
          
          {/* Botón Imagen */}
          <button 
            onClick={() => handleDisabledAction("La subida de imágenes")}
            className="absolute -left-6 bottom-4 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all z-20"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Botón Audio */}
          <button 
            onClick={() => handleDisabledAction("La grabación de audio")}
            className="w-14 h-14 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-all"
          >
            <MicIcon className="w-7 h-7" />
          </button>

          {/* Botón Enviar */}
          <button
            onClick={() => handleSend()}
            disabled={!context.trim() || loading} 
            className="w-24 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white disabled:opacity-50 transition-all font-bold group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center gap-2">
                <span>ENVIAR</span>
                <SendIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
          
        </div>
      </div>
      
    </div>
  );
};
