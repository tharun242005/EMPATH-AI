import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  autoSpeak?: boolean;
  lastMessage?: string;
}

export function VoiceAssistant({ onTranscript, autoSpeak = false, lastMessage }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [onTranscript]);

  useEffect(() => {
    // Auto-speak when new message arrives and TTS is enabled
    if (autoSpeak && ttsEnabled && lastMessage && !isSpeaking) {
      speakText(lastMessage);
    }
  }, [lastMessage, autoSpeak, ttsEnabled]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Get voice preference from localStorage
    const voicePreference = localStorage.getItem('empathai_voice') || 'female';
    
    // Wait for voices to load
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice;
      if (voicePreference === 'female') {
        // Prioritize female voices
        selectedVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') || 
          voice.name.includes('Karen') ||
          voice.name.includes('Victoria') ||
          voice.name.includes('Google US English Female') ||
          voice.name.includes('Microsoft Zira') ||
          (voice.lang.includes('en') && voice.name.toLowerCase().includes('female'))
        );
      } else {
        // Male voices
        selectedVoice = voices.find(voice => 
          voice.name.includes('Male') ||
          voice.name.includes('Daniel') ||
          voice.name.includes('Google US English Male') ||
          voice.name.includes('Microsoft David') ||
          (voice.lang.includes('en') && voice.name.toLowerCase().includes('male'))
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    };

    // Voices might not be loaded yet
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleTTS = () => {
    if (ttsEnabled && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setTtsEnabled(!ttsEnabled);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Microphone button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isListening ? 'default' : 'outline'}
            size="icon"
            onClick={toggleListening}
            className={`relative ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Stop listening' : 'Start voice input'}</p>
        </TooltipContent>
      </Tooltip>

      {/* Speaker button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={ttsEnabled ? 'default' : 'outline'}
            size="icon"
            onClick={toggleTTS}
            className={ttsEnabled ? 'bg-[#4B3F72] hover:bg-[#6C4B8C]' : ''}
          >
            {isSpeaking ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Volume2 className="w-5 h-5" />
              </motion.div>
            ) : ttsEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{ttsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
