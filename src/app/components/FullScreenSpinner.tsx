"use client";

import { useEffect, useState } from "react";

export default function FullscreenSpinner({ visible }: { visible: boolean }) {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(visible);
  }, [visible]);

  if (!visible && !loading) return null;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10 backdrop-blur-[6px]">
          <div className="circle-loader" />
          <style jsx>{`
            .circle-loader {
              width: 40px;
              height: 40px;
              border: 4px solid #ec4899;
              border-top: 4px solid transparent;
              border-radius: 50%;
              animation: spin 0.7s linear infinite;
            }

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
