import { useState, useRef, useEffect } from 'react';
import { ImageIcon, MicIcon, SendIcon } from '@/components/Icons';
import { sendTriageContext } from '@/api/triageContext';
import type { TriageResponse } from '@/api/triageContext';

interface Message {
  role: 'patient' | 'assistant';
  content: string;
  data?: TriageResponse;
}

export const MedicalInteraction = () => {
  const [context, setContext] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!context.trim() || loading) return;

    const patientMessage = context.trim();
    setContext('');
    setMessages(prev => [...prev, { role: 'patient', content: patientMessage }]);
    setLoading(true);

    try {
      const response = await sendTriageContext(patientMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.resumenClinico,
        data: response
      }]);
    } catch (error) {
      console.error("Error sending triage message:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMic = () => {
    console.log("Activar micrófono");
    alert("La grabación de audio estará disponible próximamente.");
  };

  const handleAddImage = () => {
    alert("La subida de imágenes estará disponible próximamente.");
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 gap-6 h-[calc(100vh-80px)]">
      
      {/* AREA 1: Servidor (Scrollable) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <img 
              src="/mediguk.png" 
              alt="Asistente Mediguk" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-3xl shadow-sm mb-6"
            />
            <p className="text-xl sm:text-2xl font-medium text-slate-800 text-center tracking-tight max-w-lg">
              ¿Cómo te encuentras hoy?
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'patient' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <p className="text-lg leading-relaxed">{msg.content}</p>
                {msg.data?.datos_faltantes?.length ? (
                   <div className="mt-3 pt-3 border-t border-slate-200/50">
                      <p className="text-sm font-semibold text-slate-500 mb-2">Necesito saber más sobre:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.data.datos_faltantes.map((dato, dIdx) => (
                          <span key={dIdx} className="px-2 py-1 bg-white/50 rounded-md text-xs text-slate-600 border border-slate-200">
                            {dato}
                          </span>
                        ))}
                      </div>
                   </div>
                ) : null}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
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
          className="w-full px-2 py-2 bg-transparent focus:outline-none resize-none h-24 sm:h-32 text-slate-700 text-lg placeholder-slate-400"
          disabled={loading}
        ></textarea>
        
        {/* BARRA INFERIOR DE BOTONES */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-4 pl-8 sm:pl-10">
          
          {/* Insertar Imagen (Absolute position) */}
          <button 
            onClick={handleAddImage}
            title="Añadir Imagen o Documento"
            className="absolute -left-6 bottom-4 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors z-20"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Micrófono */}
          <button 
            onClick={handleMic}
            title="Grabar Audio"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-500 transition-colors"
          >
            <MicIcon className="w-7 h-7" />
          </button>

          {/* Enviar Mensaje */}
          <button
            onClick={handleSend}
            disabled={!context.trim() || loading} 
            title="Enviar"
            className="w-20 h-12 flex items-center justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendIcon className="w-6 h-6 ml-1" />
            )}
          </button>
          
        </div>
      </div>
      
    </div>
  );
};
