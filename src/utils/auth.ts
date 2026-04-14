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

  // 1. Evitamos duplicados si ya hay uno
  if (document.getElementById("session-expired-toast")) return;

  // 2. Crear el contenedor del Toast con estética Premium
  const toast = document.createElement("div");
  toast.id = "session-expired-toast";
  // Estilos: Glassmorphism, Sombra profunda, Bordes redondeados, Animación suave
  toast.className = "fixed top-8 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-4 px-6 py-4 bg-red-600/90 backdrop-blur-lg text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 transition-all duration-500 transform translate-y-0 opacity-100";
  
  // Estilos inline para asegurar la animación de entrada inicial si no hay plugins de animación específicos
  toast.style.animation = "toast-slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
  
  // Inyectamos el keyframes en el documento de forma dinámica si no existe
  if (!document.getElementById("toast-animation-styles")) {
    const style = document.createElement("style");
    style.id = "toast-animation-styles";
    style.innerHTML = `
      @keyframes toast-slide-down {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // 3. Contenido (Icono + Texto)
  toast.innerHTML = `
    <div class="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
      <span class="text-xl">🔒</span>
    </div>
    <div class="flex flex-col">
      <span class="text-sm font-black uppercase tracking-widest text-white/90">Sesión Finalizada</span>
      <span class="text-xs font-medium text-red-100">Cerrando por seguridad en 3 segundos...</span>
    </div>
  `;

  document.body.appendChild(toast);

  // 4. Temporizador de 3 segundos para el "Hard Refresh" al inicio
  console.warn("🔐 Sesión caducada. Redirigiendo en 3s...");
  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
}
