export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function logout() {
  clearAccessToken();

  // 1. Evitamos duplicados
  if (document.getElementById("session-expired-overlay")) return;

  // 2. Crear el Overlay que cubre toda la pantalla
  const overlay = document.createElement("div");
  overlay.id = "session-expired-overlay";
  // Fondo negro semi-transparente con desenfoque
  overlay.className = "fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500";
  
  // 3. Crear la Card Central
  const card = document.createElement("div");
  card.className = "bg-white p-8 rounded-[2rem] shadow-2xl border-2 border-red-100 flex flex-col items-center gap-6 max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-300";
  
  // Inyectamos estilos de animación si no existen
  if (!document.getElementById("overlay-animation-styles")) {
    const style = document.createElement("style");
    style.id = "overlay-animation-styles";
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }

  let countdown = 3;

  const updateCardContent = () => {
    card.innerHTML = `
      <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-float">
        <span class="text-4xl">🔐</span>
      </div>
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Sesión Caducada</h2>
        <p class="text-slate-500 font-medium leading-relaxed">Por tu seguridad, hemos cerrado la sesión. Volviendo al inicio en...</p>
      </div>
      <div class="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-2xl text-3xl font-black shadow-lg shadow-red-200">
        ${countdown}
      </div>
    `;
  };

  updateCardContent();
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // 4. Temporizador con Cuenta Atrás Real
  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      updateCardContent();
    } else {
      clearInterval(interval);
      window.location.href = "/";
    }
  }, 1000);
}
