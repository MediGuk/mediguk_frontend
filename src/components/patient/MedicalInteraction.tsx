import { useState } from 'react';

export const MedicalInteraction = () => {
  const [symptoms, setSymptoms] = useState('');

  const handleSend = () => {
    if (!symptoms.trim()) return;
    console.log("Enviando síntomas:", symptoms);
    // TODO: Connect to backend API
    setSymptoms('');
  };

  const handleMic = () => {
    console.log("Activar micrófono");
  };

  const handleAddImage = () => {
    console.log("Añadir imagen");
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>

        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Escribe aquí tus síntomas o adjunta..."
          className="w-full px-2 py-2 bg-transparent focus:outline-none resize-none h-24 sm:h-32 text-slate-700 text-lg placeholder-slate-400"
        ></textarea>
        
        {/* BARRA INFERIOR DE BOTONES */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-4 pl-8 sm:pl-10">
          
          {/* Micrófono (A la izquierda, al lado del icono de la imagen asomando) */}
          <button 
            onClick={handleMic}
            title="Grabar Audio"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </button>

          {/* Enviar Mensaje (Rectángulo Píldora) */}
          <button
            onClick={handleSend}
            disabled={!symptoms.trim()}
            title="Enviar"
            className="w-20 h-12 flex items-center justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 disabled:opacity-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
          
        </div>
      </div>
      
    </div>
  );
};
