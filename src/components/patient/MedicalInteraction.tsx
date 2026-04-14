import { useState, forwardRef, useImperativeHandle } from 'react';
import { MicIcon, SendIcon } from '@/components/Icons';
import { sendTriageContext } from '@/api/triageContext';
import type { TriageResponse } from '@/api/triageContext';


export const MedicalInteraction = forwardRef((props, ref) => {
  const [context, setContext] = useState('');
  const [latestResponse, setLatestResponse] = useState<TriageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPendingReset, setIsPendingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (messageOverride?: string, isFinal: boolean = false) => {
    const messageToSend = typeof messageOverride === 'string' ? messageOverride : context.trim();
    
    // Si no hay mensaje y no es un cierre final, no hacemos nada
    if (!messageToSend && !isFinal) return;
    if (loading) return;

    // Guardamos el estado del reset antes de limpiar
    const shouldReset = isPendingReset;
    
    setLoading(true);
    setError(null);

    try {
      const response = await sendTriageContext(messageToSend, isFinal, undefined, undefined, shouldReset);
      console.log("Mediguk Server Response:", response);
      
      if (isFinal) {
        alert("¡Informe enviado con éxito al equipo médico! El caso está cerrado.");
        setLatestResponse(null);
        setContext('');
      } else {
        setLatestResponse(response);
        setContext(''); // WhatsApp style: Limpiamos al recibir respuesta OK
        setIsPendingReset(false); // Reset consumido con éxito
      }
    } catch (err: any) {
      console.error("Error sending triage message:", err);
      setError(err.message || "Ha ocurrido un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleReset: () => {
      setLatestResponse(null);
      setContext('');
      setIsPendingReset(true);
      console.log("♻️ UI Reseteada. El próximo mensaje será 'newSession: true'");
    }
  }));


  const handleDisabledAction = (name: string) => {
    alert(`${name} estará disponible próximamente.`);
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 gap-6 h-full overflow-hidden">
      
      {/* AREA 1: Servidor (Focused Response) */}
      <div 
        className={`flex-1 min-h-0 overflow-y-auto border-2 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col relative transition-all duration-500 ${
          latestResponse?.is_emergency ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-white'
        } ${!latestResponse && !loading ? 'items-center justify-center' : 'items-center justify-start'}`}
      >
        {!latestResponse && !loading ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <p className="text-xl sm:text-2xl font-bold text-slate-800 text-center tracking-tight max-w-md">
              ¿Cómo podemos ayudarte hoy?
            </p>
            <p className="text-slate-500 mt-2">Describe tus síntomas para comenzar el triaje.</p>
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
                  <p className="text-slate-500 text-sm font-medium italic">Procesando información...</p>
               </div>
              ) : (
                <div className="flex flex-col gap-6 w-full">
                   {/* Título del caso (Interior) */}
                   {latestResponse?.case_title && (
                     <div className="flex flex-col mb-2 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                          {latestResponse.case_title}
                        </h2>
                        <div className="w-12 h-1 bg-slate-900 mt-1 rounded-full"></div>
                     </div>
                   )}

                   {/* Mensaje de Emergencia */}
                   {latestResponse?.is_emergency && (
                     <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center gap-4 animate-pulse shadow-lg shadow-red-200">
                       <span className="text-3xl">⚠️</span>
                       <div>
                         <p className="font-bold text-lg leading-tight text-white">SITUACIÓN URGENTE DETECTADA</p>
                         <p className="text-red-100 text-sm">Por favor, contacta con emergencias o acude al centro más cercano si los síntomas empeoran.</p>
                       </div>
                     </div>
                   )}

                    {/* Mensaje de la IA (Pregunta Única) */}
                    <div className="flex flex-col gap-3">
                      {latestResponse?.question && (
                        <p 
                          className={`text-lg sm:text-xl leading-tight font-medium ${latestResponse?.is_emergency ? 'text-red-900' : 'text-slate-800'} animate-in fade-in slide-in-from-left-4 duration-500`}
                        >
                          {latestResponse.question}
                        </p>
                      )}
                    </div>

                   {/* Estado Completado */}
                   {latestResponse?.is_complete && (
                     <div className="flex items-start gap-4 text-emerald-600 font-medium bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm animate-in zoom-in duration-300">
                        <span className="text-3xl">✅</span>
                        <div className="space-y-1">
                           <p className="text-lg font-bold text-emerald-700">Triaje Finalizado</p>
                           <p className="text-emerald-600/80">Hemos recopilado toda la información necesaria. Puedes enviar el informe ahora.</p>
                        </div>
                     </div>
                   )}
                </div>
              )}
          </div>
        )}
      </div>

      {/* AREA 2: Paciente (Textarea + Botones) */}
      <div className="flex-none flex flex-col gap-2 relative">
        
        {/* BANNER DE ERROR (Toast-like) */}
        {error && (
          <div className="absolute -top-16 left-0 right-0 bg-red-50 border border-red-200 p-3 rounded-2xl flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-2 duration-300 z-10">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 p-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm relative">
          <textarea
          value={context}
          onChange={(e) => {
            setContext(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={latestResponse?.is_complete ? "Triaje completo..." : "DIME QUÉ TE PASA..."}
          className="w-full px-4 py-2 bg-transparent focus:outline-none resize-none h-20 sm:h-24 text-slate-700 text-base placeholder-slate-400"
          disabled={loading || latestResponse?.is_complete}
        ></textarea>
        
        {/* BARRA INFERIOR DE BOTONES */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-4 pl-4 sm:pl-6">
          
          <div className="flex gap-2">
            {/* Botón Audio */}
            <button 
              onClick={() => handleDisabledAction("La grabación de audio")}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
              disabled={latestResponse?.is_complete}
            >
              <MicIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Botón Enviar Principal / Finalizar */}
          {latestResponse?.is_complete ? (
            <button
              onClick={() => handleSend(undefined, true)}
              disabled={loading}
              className="px-8 h-12 flex items-center justify-center rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-200 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <span>🚀 ENVIAR A SANITARIO</span>
                </div>
              )}
            </button>
          ) : (
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
          )}
          
        </div>
      </div>
    </div>
  </div>
);
});

MedicalInteraction.displayName = 'MedicalInteraction';
