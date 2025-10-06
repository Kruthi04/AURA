import React from "react";
import { useVapi } from "../hooks/useVapi";

interface VapiButtonProps {
  publicKey?: string;
  assistantId?: string;
  baseUrl?: string;
  className?: string;
  children?: React.ReactNode;
  // Optional props to use external Vapi state
  startCall?: () => Promise<void>;
  endCall?: () => void;
  isSessionActive?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export const VapiButton: React.FC<VapiButtonProps> = ({
  publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY,
  assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID,
  baseUrl = import.meta.env.VITE_VAPI_BASE_URL,
  className,
  children,
  // External state props
  startCall: externalStartCall,
  endCall: externalEndCall,
  isSessionActive: externalIsSessionActive,
  isLoading: externalIsLoading,
  error: externalError,
}) => {
  // Use external state if provided, otherwise use internal useVapi hook
  const internalVapi = useVapi({
    publicKey: publicKey || "",
    assistantId: assistantId || "",
    baseUrl,
  });

  const startCall = externalStartCall || internalVapi.startCall;
  const endCall = externalEndCall || internalVapi.endCall;
  const isSessionActive = externalIsSessionActive ?? internalVapi.isSessionActive;
  const isLoading = externalIsLoading ?? internalVapi.isLoading;
  const error = externalError ?? internalVapi.error;

  const handleClick = () => {
    if (isSessionActive) {
      endCall();
    } else {
      startCall();
    }
  };

  if (!publicKey || !assistantId) {
    return (
      <div className="text-red-500 p-2">
        Missing Vapi configuration. Please set environment variables.
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={
          className ||
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        }
      >
        {children ||
          (isLoading
            ? "Connecting..."
            : isSessionActive
            ? "End Call"
            : "Talk to me")}
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">Error: {error}</div>}
    </>
  );
};
