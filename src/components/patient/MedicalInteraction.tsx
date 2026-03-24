import { useState } from 'react';
import { ImageIcon, MicIcon, SendIcon } from '@/components/Icons';

export const MedicalInteraction = () => {
  const [context, setContext] = useState('');

  const handleSend = () => {
    if (!context.trim()) return;
    console.log("Enviando context:", context);
    // TODO: Connect to backend API
    setContext('');
  };

  const handleMic = () => {
    console.log("Activar micrófono");
  };

  const handleAddImage = () => {
    alert("La subida de imágenes estará disponible próximamente.");
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 gap-6 h-[calc(100vh-80px)]">
      
      {/* AREA 1: Servidor (Scrollable) */}
      <div className="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative">
        {/* Aquí iría el texto o charla generada por el servidor, de momento centramos el saludo */}
        <div className="flex flex-col items-center">
          <img 
            src="/mediguk.png" 
            alt="Asistente Mediguk" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-3xl shadow-sm mb-6"
          />
          <p className="text-xl sm:text-2xl font-medium text-slate-800 text-center tracking-tight max-w-lg">
            ¿Cómo te encuentras hoy?
          </p>
        </div>
      </div>

      {/* AREA 2: Paciente (Textarea + Botones) */}
      <div className="flex-none flex flex-col gap-2 bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm relative">
        
        {/* Insertar Imagen (Medio salido del contenedor a la izquierda) */}
        <button 
          onClick={handleAddImage}
          title="Añadir Imagen o Documento"
          className="absolute -left-6 bottom-4 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors z-20"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="HÁBLAME AQUI MISMO..."
          className="w-full px-2 py-2 bg-transparent focus:outline-none resize-none h-24 sm:h-32 text-slate-700 text-lg placeholder-slate-400"
        ></textarea>
        
        {/* BARRA INFERIOR DE BOTONES */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-4 pl-8 sm:pl-10">
          
          {/* Micrófono (Restaurado a su tamaño normal) */}
          <button 
            onClick={handleMic}
            title="Grabar Audio"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-500 transition-colors"
          >
            <MicIcon className="w-7 h-7" />
          </button>

          {/* Enviar Mensaje (Rectángulo Píldora) */}
          <button
            onClick={handleSend}
            disabled={!context.trim()} //desactiva el boton si no hay texto quitando espacios en blanco
            title="Enviar"
            className="w-20 h-12 flex items-center justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 disabled:opacity-50 transition-colors"
          >
            <SendIcon className="w-6 h-6 ml-1" />
          </button>
          
        </div>
      </div>
      
    </div>
  );
};
