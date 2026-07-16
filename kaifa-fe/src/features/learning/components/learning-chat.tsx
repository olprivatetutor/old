'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  getAuthTokenInitials,
  getFallbackInitials,
  subscribeAuthTokenInitials,
} from '@/features/auth/utils/jwt-profile';
import { apiClient } from '@/lib/api/client';
import type {
  GenerateLearningPathApiData,
  SendLearningChatResponse,
} from '@/features/learning/types/learning.types';
import type { SyllabusLanguage } from '@/features/syllabus/types/syllabus.types';

interface LearningChatProps {
  initialParagraph?: string | undefined;
  initialReply?: string | undefined;
  language: SyllabusLanguage;
  learningPath: GenerateLearningPathApiData;
  moduleTitle: string;
  moduleTitleTranslation?: string | undefined;
  objective: string;
  stepOrder: number;
  topic: string;
  topicTranslation?: string | undefined;
}

interface ChatMessage {
  id: number;
  role: 'ai' | 'user';
  text: string;
}

interface SpeechToTextResponse {
  success: boolean;
  data?: {
    text?: string;
  };
  message?: string;
}

const preferredAudioMimeTypes = ['audio/webm;codecs=opus', 'audio/webm'];

function getSupportedAudioMimeType() {
  return preferredAudioMimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path
        d="m4 5 16 7-16 7 3-7-3-7Zm3 7h13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
      <rect x="8" y="3" width="8" height="13" rx="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 12a7 7 0 0 0 14 0M12 19v3m-4 0h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      {isPlaying ? (
        <path d="M9 7v10M15 7v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="m9 7 8 5-8 5V7Z" fill="currentColor" />
      )}
    </svg>
  );
}

function AiAvatar({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <span className="relative grid size-8 shrink-0 place-items-center overflow-visible">
      {isSpeaking && (
        <>
          <span className="kaifa-voice-ring absolute inset-0 rounded-xl border border-[#7154b7]/60 bg-[#7154b7]/10" />
          <span className="kaifa-voice-ring kaifa-voice-ring-delayed absolute inset-0 rounded-xl border border-[#2f6a43]/55 bg-[#2f6a43]/10" />
          <span className="absolute top-1/2 -right-1.5 z-20 flex h-5 -translate-y-1/2 items-center gap-0.5 rounded-full bg-[#fff6df]/90 px-1 shadow-sm ring-1 ring-[#dfcda9]">
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className="kaifa-voice-bar h-3 w-0.5 rounded-full bg-[#7154b7]"
                style={{ animationDelay: `${bar * 120}ms` }}
              />
            ))}
          </span>
        </>
      )}
      <span
        className={`relative z-10 size-8 overflow-hidden rounded-xl bg-[#2f6a43] ${
          isSpeaking
            ? 'kaifa-avatar-breathe shadow-[0_0_18px_rgba(113,84,183,0.48)] ring-2 ring-[#f2b84b]'
            : ''
        }`}
      >
        <Image
          src="/images/icon_ai.png"
          alt="AI"
          width={124}
          height={124}
          className="size-full object-cover"
        />
      </span>
    </span>
  );
}

const learningChatCopy = {
  english: {
    audioPlayError: 'AI audio could not be played. Please try again.',
    partnerName: 'Kaifa',
    focusKept: 'Focus maintained',
    focusKeptTranslation: 'Fokus terjaga',
    listen: 'Listen',
    playing: 'Playing...',
    playAiResponse: 'Play AI response',
    speechRecognitionUnsupported:
      'Speech to text is not supported in this browser. You can still type your answer.',
    transcribing: 'Processing your voice...',
    speechTimeout: 'Voice processing took too long. Please try again.',
    microphonePermission: 'Allow microphone access to use this feature.',
    voiceNotCaptured: 'Your voice was not captured. Please try again.',
    topicNotice: (topic: string) =>
      `AI will give feedback and guide the conversation back to “${topic}”.`,
    answerLabel: 'Write an answer',
    answerWithMicrophone: 'Answer with microphone',
    listening: 'Listening... tap the microphone again when done',
    placeholder: 'Write your answer or question...',
    sendLabel: 'Send answer',
    speechUnavailable: 'AI audio is not available yet.',
    stopAudio: 'Stop audio',
    stopMicrophone: 'Stop microphone',
    targetLabel: 'Session target',
    sendError: 'Message could not be sent. Please try again.',
    initialReply: (topic: string) =>
      `Assalamu'alaikum! Today we will focus on “${topic}”. I will help you stay on this topic and improve each answer. To begin, what do you already know about ${topic.toLowerCase()}?`,
    followUps: (topic: string) => [
      `Good start. For “${topic}”, try adding one specific example. Can you explain it in two or three sentences?`,
      `Your idea is clear. A more natural phrase could be “In my experience...”. Now, how does that phrase connect to ${topic.toLowerCase()}?`,
      `Nice progress. Let's stay with “${topic}”. What question would you ask another person about this topic?`,
      `Well done. Please summarize your main idea about ${topic.toLowerCase()} using one clear B1-level sentence.`,
    ],
    fallbackReply: (topic: string) =>
      `Let's continue practicing “${topic}” with one clear example.`,
  },
  arabic: {
    audioPlayError: 'تعذر تشغيل صوت الذكاء الاصطناعي. حاول مرة أخرى.',
    partnerName: 'كايفا',
    focusKept: 'التركيز محفوظ',
    focusKeptTranslation: 'Fokus terjaga',
    listen: 'استمع',
    playing: 'جارٍ التشغيل...',
    playAiResponse: 'تشغيل رد الذكاء الاصطناعي',
    speechRecognitionUnsupported:
      'تحويل الكلام إلى نص غير مدعوم في هذا المتصفح. يمكنك كتابة إجابتك.',
    transcribing: 'جارٍ معالجة صوتك...',
    speechTimeout: 'استغرقت معالجة الصوت وقتاً طويلاً. حاول مرة أخرى.',
    microphonePermission: 'اسمح بالوصول إلى الميكروفون لاستخدام هذه الميزة.',
    voiceNotCaptured: 'لم يتم التقاط صوتك. حاول مرة أخرى.',
    topicNotice: (topic: string) =>
      `سيقدم الذكاء الاصطناعي ملاحظات ويعيد المحادثة إلى موضوع “${topic}”.`,
    answerLabel: 'اكتب إجابتك',
    answerWithMicrophone: 'الإجابة بالميكروفون',
    listening: 'جارٍ الاستماع... اضغط الميكروفون مرة أخرى عند الانتهاء',
    placeholder: 'اكتب إجابتك أو سؤالك...',
    sendLabel: 'إرسال الإجابة',
    speechUnavailable: 'صوت الذكاء الاصطناعي غير متاح حالياً.',
    stopAudio: 'إيقاف الصوت',
    stopMicrophone: 'إيقاف الميكروفون',
    targetLabel: 'هدف الجلسة',
    sendError: 'تعذر إرسال الرسالة. حاول مرة أخرى.',
    initialReply: (topic: string) =>
      `السلام عليكم! سنركز اليوم على “${topic}”. سأساعدك على البقاء ضمن هذا الموضوع وتحسين كل إجابة. للبدء، ماذا تعرف عن هذا الموضوع؟`,
    followUps: (topic: string) => [
      `بداية جيدة. في موضوع “${topic}”، حاول إضافة مثال محدد. هل يمكنك شرحه في جملتين أو ثلاث؟`,
      `فكرتك واضحة. الآن كيف ترتبط إجابتك بموضوع “${topic}”؟`,
      `تقدم جميل. لنبق مع “${topic}”. ما السؤال الذي يمكن أن تسأله لشخص آخر عن هذا الموضوع؟`,
      `أحسنت. لخّص فكرتك الرئيسية عن “${topic}” بجملة واحدة واضحة.`,
    ],
    fallbackReply: (topic: string) => `لنواصل التدريب على “${topic}” بمثال واضح واحد.`,
  },
} satisfies Record<
  SyllabusLanguage,
  {
    audioPlayError: string;
    partnerName: string;
    focusKept: string;
    focusKeptTranslation: string;
    listen: string;
    playing: string;
    playAiResponse: string;
    speechRecognitionUnsupported: string;
    transcribing: string;
    speechTimeout: string;
    microphonePermission: string;
    voiceNotCaptured: string;
    topicNotice: (topic: string) => string;
    answerLabel: string;
    answerWithMicrophone: string;
    listening: string;
    placeholder: string;
    sendLabel: string;
    speechUnavailable: string;
    stopAudio: string;
    stopMicrophone: string;
    targetLabel: string;
    sendError: string;
    initialReply: (topic: string) => string;
    followUps: (topic: string) => string[];
    fallbackReply: (topic: string) => string;
  }
>;

export function LearningChat({
  initialParagraph,
  initialReply,
  language,
  learningPath,
  moduleTitle,
  moduleTitleTranslation,
  objective,
  stepOrder,
  topic,
  topicTranslation,
}: LearningChatProps) {
  const copy = learningChatCopy[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    ...(initialParagraph
      ? [
          {
            id: 1,
            role: 'ai' as const,
            text: initialParagraph,
          },
        ]
      : []),
    {
      id: initialParagraph ? 2 : 1,
      role: 'ai',
      text: initialReply ?? copy.initialReply(topic),
    },
  ]);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [speechNotice, setSpeechNotice] = useState('');
  const userInitials = useSyncExternalStore(
    subscribeAuthTokenInitials,
    getAuthTokenInitials,
    getFallbackInitials,
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const isUnmountingRef = useRef(false);
  const isStoppingRecordingRef = useRef(false);
  const recordingMimeTypeRef = useRef('audio/webm');
  const messageIdRef = useRef(initialParagraph ? 3 : 2);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const textToSpeechMutation = useMutation({
    mutationFn: (userText: string) =>
      apiClient.post<Blob>(
        '/api/learning/speech/tts',
        { user_text: userText },
        { responseType: 'blob' },
      ),
  });
  const speechToTextMutation = useMutation({
    mutationFn: (audioBlob: Blob) =>
      apiClient.post<SpeechToTextResponse>('/api/learning/speech/stt', audioBlob, {
        headers: { 'Content-Type': 'audio/webm' },
        params: { module_id: learningPath.module_id },
      }),
  });
  const sendChatMutation = useMutation({
    mutationFn: ({
      learningPathStepId,
      userText,
    }: {
      learningPathStepId: string;
      userText: string;
    }) =>
      apiClient.post<SendLearningChatResponse>('/api/learning/chat', {
        learning_path_step_id: learningPathStepId,
        user_text: userText,
      }),
  });

  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;

    messageList.scrollTo({ top: messageList.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    isUnmountingRef.current = false;

    return () => {
      isUnmountingRef.current = true;
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioRef.current?.pause();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  async function playMessage(message: ChatMessage) {
    if (playingId === message.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    try {
      setPlayingId(message.id);
      setSpeechNotice('');
      const audioBlob = await textToSpeechMutation.mutateAsync(message.text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audioUrlRef.current = audioUrl;
      audio.onended = () => {
        setPlayingId(null);
        URL.revokeObjectURL(audioUrl);
        if (audioUrlRef.current === audioUrl) audioUrlRef.current = null;
      };
      audio.onerror = () => {
        setPlayingId(null);
        setSpeechNotice(copy.audioPlayError);
        URL.revokeObjectURL(audioUrl);
        if (audioUrlRef.current === audioUrl) audioUrlRef.current = null;
      };
      await audio.play();
    } catch (error) {
      setPlayingId(null);
      setSpeechNotice(error instanceof Error ? error.message : copy.speechUnavailable);
    }
  }

  function stopRecordingStream() {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }

  function stopActiveRecording() {
    if (isStoppingRecordingRef.current) return;

    isStoppingRecordingRef.current = true;
    setIsListening(false);
    setIsTranscribing(true);
    setSpeechNotice('');

    try {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.stop();
      }
    } catch {
      isStoppingRecordingRef.current = false;
      setIsTranscribing(false);
      setSpeechNotice(copy.voiceNotCaptured);
      stopRecordingStream();
      return;
    }

    window.setTimeout(() => {
      if (isUnmountingRef.current) return;

      const audioBlob = new Blob(audioChunksRef.current, { type: recordingMimeTypeRef.current });
      audioChunksRef.current = [];
      mediaRecorderRef.current = null;
      isStoppingRecordingRef.current = false;
      setIsListening(false);
      stopRecordingStream();

      transcribeAudio(audioBlob)
        .then((transcript) => {
          setAnswer(transcript);
          setIsTranscribing(false);
          sendAnswer(transcript);
        })
        .catch((error) => {
          setIsTranscribing(false);
          setSpeechNotice(error instanceof Error ? error.message : copy.voiceNotCaptured);
        });
    }, 0);
  }

  async function transcribeAudio(audioBlob: Blob) {
    const payload = await speechToTextMutation.mutateAsync(audioBlob);

    if (!payload.success || !payload.data?.text?.trim()) {
      throw new Error(payload?.message ?? copy.voiceNotCaptured);
    }

    return payload.data.text.trim();
  }

  async function toggleListening() {
    if (mediaRecorderRef.current || isListening) {
      stopActiveRecording();
      return;
    }

    if (isThinking || isTranscribing) return;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setSpeechNotice(copy.speechRecognitionUnsupported);
      return;
    }

    try {
      const mimeType = getSupportedAudioMimeType();

      if (!mimeType) {
        setSpeechNotice(copy.speechRecognitionUnsupported);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingMimeTypeRef.current = mimeType;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        isStoppingRecordingRef.current = false;
        setSpeechNotice(copy.voiceNotCaptured);
        setIsListening(false);
        setIsTranscribing(false);
        stopRecordingStream();
      };

      recorder.onstop = () => {
        stopRecordingStream();
      };

      setSpeechNotice('');
      setIsListening(true);
      isStoppingRecordingRef.current = false;
      recorder.start(250);
    } catch (error) {
      setIsListening(false);
      setIsTranscribing(false);
      isStoppingRecordingRef.current = false;
      stopRecordingStream();
      setSpeechNotice(
        error instanceof DOMException ? copy.microphonePermission : copy.voiceNotCaptured,
      );
    }
  }

  async function sendAnswer(text = answer) {
    const trimmedAnswer = text.trim();
    if (!trimmedAnswer || isThinking) return;

    const userMessage: ChatMessage = {
      id: messageIdRef.current++,
      role: 'user',
      text: trimmedAnswer,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setAnswer('');
    setIsThinking(true);
    setSpeechNotice('');

    try {
      const learningPathStepId = learningPath.steps.find((step) => step.order === stepOrder)?.id;

      if (!learningPathStepId) {
        throw new Error(copy.sendError);
      }

      const payload = await sendChatMutation.mutateAsync({
        learningPathStepId,
        userText: trimmedAnswer,
      });

      if (!payload.success || !payload.data?.reply) {
        throw new Error(payload?.message ?? copy.sendError);
      }

      const responseData = payload.data;

      setMessages((current) => {
        const additions: ChatMessage[] = [];
        const paragraph = responseData.paragraph;

        if (paragraph && paragraph !== responseData.reply) {
          additions.push({
            id: messageIdRef.current++,
            role: 'ai',
            text: paragraph,
          });
        }

        additions.push({
          id: messageIdRef.current++,
          role: 'ai',
          text: responseData.reply,
        });

        return [...current, ...additions];
      });
    } catch (error) {
      setSpeechNotice(error instanceof Error ? error.message : copy.sendError);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/60 bg-[#fff9e9] shadow-[0_12px_35px_rgba(91,58,24,0.2)] sm:rounded-[2rem]">
      <header className="shrink-0 border-b border-[#ead8b7] bg-white/60 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-2xl">
              <Image
                src="/images/icon_ai.png"
                alt="AI"
                width={124}
                height={124}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{copy.partnerName}</p>
              <p className="truncate text-xs text-[#75644f]">{moduleTitle}</p>
              {moduleTitleTranslation ? (
                <p className="truncate text-[11px] font-medium text-[#8b765a] italic">
                  {moduleTitleTranslation}
                </p>
              ) : null}
            </div>
          </div>
          <span className="inline-flex shrink-0 flex-col items-center rounded-xl bg-[#e8f1e8] px-3 py-1.5 text-[10px] font-black text-[#2f6a43]">
            <span>{copy.focusKept}</span>
            <span className="leading-4 font-medium text-[#5e755d] italic">
              {copy.focusKeptTranslation}
            </span>
          </span>
        </div>
      </header>

      <div
        ref={messageListRef}
        className="min-h-0 flex-1 scrollbar-none space-y-4 overflow-y-auto px-3 py-4 sm:space-y-5 sm:px-6 sm:py-6"
        aria-live="polite"
      >
        <div className="mx-auto max-w-lg rounded-2xl bg-[#f4ead6] px-4 py-2.5 text-center text-[10px] leading-4 font-bold text-[#75644f] sm:text-[11px]">
          {copy.topicNotice(topic)}
          {topicTranslation ? (
            <p className="mt-1 text-[10px] leading-4 font-medium text-[#8b765a] italic">
              {topicTranslation}
            </p>
          ) : null}
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'ai' && <AiAvatar isSpeaking={playingId === message.id} />}
            <div
              className={`max-w-[86%] rounded-2xl px-3.5 py-3 text-sm leading-6 shadow-sm sm:max-w-[72%] sm:rounded-3xl sm:px-4 ${
                message.role === 'user'
                  ? 'rounded-br-lg bg-[#7154b7] text-white'
                  : 'rounded-bl-lg border border-[#ead8b7] bg-white text-[#49321d]'
              }`}
            >
              <p>{message.text}</p>
              {message.role === 'ai' && (
                <button
                  type="button"
                  onClick={() => playMessage(message)}
                  className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-xl bg-[#f4ead6] px-3 py-1.5 text-[11px] font-black text-[#49321d] transition hover:bg-[#ead8b7] focus-visible:ring-4 focus-visible:ring-[#7154b7]/30 focus-visible:outline-none"
                  aria-label={playingId === message.id ? copy.stopAudio : copy.playAiResponse}
                >
                  <PlayIcon isPlaying={playingId === message.id} />
                  {playingId === message.id ? copy.playing : copy.listen}
                </button>
              )}
            </div>
            {message.role === 'user' && (
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#f2b84b] text-[10px] font-black text-[#49321d] ring-2 ring-[#fff6df]">
                {userInitials}
              </span>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5">
            <AiAvatar />
            <span className="flex gap-1 rounded-2xl border border-[#ead8b7] bg-white px-4 py-3">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="size-1.5 animate-bounce rounded-full bg-[#7154b7]"
                  style={{ animationDelay: `${dot * 120}ms` }}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-[#ead8b7] bg-white/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
        {speechNotice && <p className="mb-2 text-xs font-bold text-[#9a5b29]">{speechNotice}</p>}
        {(isListening || isTranscribing) && (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-2xl bg-[#fce8e4] px-4 py-2.5 text-xs font-black text-[#b64638]">
            <span className="size-2 animate-pulse rounded-full bg-[#d55242]" />
            {isTranscribing ? copy.transcribing : copy.listening}
          </div>
        )}
        <form
          className="flex min-w-0 items-end gap-1.5 sm:gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendAnswer();
          }}
        >
          <label htmlFor="learning-answer" className="sr-only">
            {copy.answerLabel}
          </label>
          <textarea
            id="learning-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendAnswer();
              }
            }}
            rows={1}
            placeholder={copy.placeholder}
            className="min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-[#d9c4a0] bg-[#fffdf7] px-3 py-2.5 text-base text-[#2f2518] placeholder:text-[#9d8c73] focus:border-[#7154b7] focus:ring-4 focus:ring-[#7154b7]/15 focus:outline-none sm:min-h-12 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
          />
          <button
            type="button"
            onClick={toggleListening}
            disabled={isThinking || isTranscribing}
            className={`grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-[0_3px_0_rgba(73,50,29,0.25)] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#d55242]/30 focus-visible:outline-none sm:size-12 sm:rounded-2xl sm:shadow-[0_5px_0_rgba(73,50,29,0.25)] ${
              isListening ? 'bg-[#d55242]' : 'bg-[#2f6a43]'
            } disabled:pointer-events-none disabled:opacity-40`}
            aria-label={isListening ? copy.stopMicrophone : copy.answerWithMicrophone}
            aria-pressed={isListening}
          >
            <MicrophoneIcon />
          </button>
          <button
            type="submit"
            disabled={!answer.trim() || isThinking || isTranscribing}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#7154b7] text-white shadow-[0_3px_0_#52388d] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 sm:size-12 sm:rounded-2xl sm:shadow-[0_5px_0_#52388d]"
            aria-label={copy.sendLabel}
          >
            <SendIcon />
          </button>
        </form>
        <p className="mt-2 hidden text-[10px] text-[#8b765a] sm:block">
          {copy.targetLabel}: {objective}
        </p>
      </footer>
    </section>
  );
}
