import React, { useState } from 'react';
import type { TriageHistoryItem } from '@/api/triageContext';

interface Props {
  history: TriageHistoryItem[];
  onClose: () => void;
}

export const TriageHistoryModal: React.FC<Props> = ({ history, onClose }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRawId, setShowRawId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId === id) setShowRawId(null);
  };

  const toggleRaw = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShowRawId(showRawId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl max-h-[85vh] rounded-[3rem] shadow-[0_25px_70px_rgba(0,0,0,0.2)] border border-white/60 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/60">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <span className="bg-blue-600 text-white p-2.5 rounded-2xl text-xl shadow-lg shadow-blue-100">🔍</span>
              Historial Clínico
            </h2>
            <p className="text-slate-500 font-semibold mt-1">Análisis detallados de la IA Especialista</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 transition-all text-slate-400 group border border-slate-100"
          >
            <span className="group-hover:rotate-90 transition-transform duration-300 text-xl font-bold">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
          {history.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <span className="text-6xl block mb-6 animate-bounce">📂</span>
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Sin informes aún</h3>
               <p className="text-slate-500 mt-2 font-medium">Tus triajes aparecerán aquí una vez procesados.</p>
            </div>
          ) : (
            history.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const isRawVisible = showRawId === item.id;
              const details = item.stage1Details?.specialtyDetails;

              return (
                <div 
                  key={item.id} 
                  onClick={() => details && toggleExpand(item.id)}
                  className={`group relative overflow-hidden transition-all duration-500 cursor-pointer ${
                    isExpanded 
                      ? 'bg-white ring-8 ring-blue-50/50 shadow-2xl border-blue-100' 
                      : 'bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
                  } rounded-[2rem] p-6 animate-in slide-in-from-bottom-8 duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Status & Category Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.category}
                      </span>
                      {details?.urgencyLevel && (
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          details.urgencyLevel > 7 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          Urgencia {details.urgencyLevel}/10
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                       {isExpanded && (
                         <button 
                           onClick={(e) => toggleRaw(e, item.id)}
                           className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                             isRawVisible ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                           }`}
                           title="Ver relato original del paciente"
                         >
                           <span className="text-xl">💬</span>
                         </button>
                       )}
                       <span className={`text-[10px] font-black uppercase tracking-tight ${isExpanded ? 'text-slate-400' : 'text-slate-300'}`}>
                         {item.status === 'ST1_SPECIALIST_ACCEPTED' ? '✓ Analizado' : '⏳ En cola'}
                       </span>
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className={`text-2xl font-black leading-tight tracking-tight ${isExpanded ? 'text-slate-900' : 'text-slate-800'}`}>
                        {details?.suspectedDiagnosis || "Analizando cuadro clínico..."}
                      </h3>
                      {!isExpanded && (
                        <p className="text-slate-400 text-sm font-medium line-clamp-1">
                          {details?.aiSummary || "El análisis detallado estará disponible pronto."}
                        </p>
                      )}
                    </div>
                    {details && (
                       <span className={`text-2xl transition-transform duration-500 ${isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-200'}`}>
                         ▼
                       </span>
                    )}
                  </div>

                  {/* Expandable Section */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[1000px] mt-8 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="space-y-6">
                      
                      {/* Patient Raw Input (Full Clinical Transcript) */}
                      {isRawVisible && (
                        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 shadow-inner animate-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                             <span>📋</span> Registro Literal de Conversación
                          </div>
                          
                          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {item.fullTranscript && item.fullTranscript.length > 0 ? (
                              item.fullTranscript.map((entry, idx) => (
                                <div key={idx} className="space-y-2">
                                  {/* IA Question */}
                                  <div className="flex flex-col items-start max-w-[90%]">
                                    <span className="text-[9px] font-black text-blue-500 uppercase ml-3 mb-1 tracking-tighter">Mediguk System</span>
                                    <div className="bg-blue-600 text-white p-4 rounded-3xl rounded-tl-none text-sm font-medium leading-relaxed shadow-md shadow-blue-100">
                                      {entry.question}
                                    </div>
                                  </div>
                                  
                                  {/* Patient Answer */}
                                  <div className="flex flex-col items-end max-w-[90%] ml-auto">
                                    <span className="text-[9px] font-black text-slate-400 uppercase mr-3 mb-1 tracking-tighter">Voz del Paciente</span>
                                    <div className="bg-white text-slate-900 p-4 rounded-3xl rounded-tr-none text-sm font-bold leading-relaxed italic border border-slate-200 shadow-sm">
                                      "{entry.answer}"
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-8 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm font-medium italic">
                                  No hay registro detallado disponible para este caso.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* AI Summary Card */}
                      <div className="bg-slate-50 p-7 rounded-[2.5rem] border border-slate-100">
                        <p className="text-slate-700 text-base leading-relaxed font-medium">
                          {details?.aiSummary}
                        </p>
                        <div className="h-px bg-slate-200/50 w-full my-5" />
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Informe de Inteligencia Sanitaria</p>
                      </div>

                      {/* Grid Data */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1.5">Estado General</p>
                          <p className="text-slate-900 font-bold text-lg leading-tight">{details?.generalState || "Estable"}</p>
                        </div>
                        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1.5">Sistema Afectado</p>
                          <p className="text-slate-900 font-bold text-lg leading-tight">{details?.systemAffected || "Pendiente"}</p>
                        </div>
                      </div>

                      {/* Urgent Alert */}
                      {details?.requiresUrgentLab && (
                        <div className="flex items-center gap-4 bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100">
                          <span className="text-3xl animate-pulse">🧪</span>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Alerta de Laboratorio</p>
                            <p className="text-sm font-black">Analítica de urgencia requerida</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-slate-100 flex justify-center">
            <button 
              onClick={onClose}
              className="px-16 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Listo
            </button>
        </div>
      </div>
    </div>
  );
};
