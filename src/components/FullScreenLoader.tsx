import { useState, useEffect } from 'react';

type Props = {
  isPending: boolean;
  delayMs?: number;
  message?: string;
};

export const FullScreenLoader = ({ isPending, message = "Cargando...", delayMs = 300 }: Props) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isPending) {
      timeout = setTimeout(() => setShowLoader(true), delayMs);
    } else {
      setShowLoader(false);
    }

    return () => clearTimeout(timeout);
  }, [isPending, delayMs]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50 gap-4">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white text-sm tracking-wide">{message}</p>
    </div>
  );
};