"use client";

import { useState, useEffect, useCallback } from "react";

interface SpeechRecognitionOptions {
  onResult?: (result: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
}

export function useSpeechRecognition({ onResult, onEnd, continuous = false }: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) onEnd();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [continuous, onEnd, onResult]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return { isListening, error, startListening, stopListening };
}
