'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  getAuthTokenInitials,
  getFallbackInitials,
  subscribeAuthTokenInitials,
} from '@/features/auth/utils/jwt-profile';
import type { AssessmentResult } from '@/features/assessment/types/assessment.types';
import { SyllabusTranslations } from '@/features/syllabus/components/syllabus-translations';
import type {
  SyllabusLanguage,
  SyllabusTranslation,
} from '@/features/syllabus/types/syllabus.types';
import { apiClient } from '@/lib/api/client';

interface AssessmentChatProps {
  activitySteps: string[];
  gradeHref: string;
  initialReply?: string | undefined;
  language: SyllabusLanguage;
  moduleId: string;
  moduleTitle: string;
  moduleTranslations?: SyllabusTranslation[] | undefined;
  topic: string;
  translatedActivitySteps?: string[] | undefined;
  unitTitle: string;
  unitTranslations?: SyllabusTranslation[] | undefined;
}

interface AssessmentChatResponse {
  success: boolean;
  data?: {
    reply: string;
    result?: AssessmentResult;
  };
  message?: string;
}

interface SpeechToTextResponse {
  success: boolean;
  data?: {
    text: string;
  };
  message?: string;
}

interface ChatMessage {
  id: number;
  role: 'ai' | 'user';
  text: string;
}

const latestAssessmentResultStorageKey = 'kaifa:assessment-result:latest';
const preferredAudioMimeTypes = ['audio/webm;codecs=opus', 'audio/webm'];
const speechToTextTimeoutMs = 20_000;

function createAssessmentResultStorageKey(moduleId: string) {
  return `kaifa:assessment-result:${moduleId}`;
}

function getSupportedAudioMimeType() {
  return preferredAudioMimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

const assessmentQuestions = {
  english: [
    'What is your name, and what do your friends usually call you?',
    'Where are you from, and what do you like about your hometown?',
    'Can you tell me about one activity you enjoy after school?',
    'Please describe someone who inspires you and explain why.',
    'Tell me about a memorable experience you had recently.',
    'What is one goal you want to achieve this year?',
    'Imagine you are meeting a new classmate. How would you start a friendly conversation?',
  ],
  arabic: [
    'ما اسمك؟ وبماذا يناديك أصدقاؤك عادة؟',
    'من أين أنت؟ وماذا تحب في مدينتك؟',
    'حدثني عن نشاط تستمتع به بعد المدرسة.',
    'صف شخصاً يلهمك واشرح السبب.',
    'حدثني عن تجربة مميزة مررت بها مؤخراً.',
    'ما هدف واحد تريد تحقيقه هذا العام؟',
    'تخيل أنك تقابل زميلاً جديداً. كيف تبدأ محادثة ودية؟',
  ],
} satisfies Record<SyllabusLanguage, string[]>;

const assessmentChatCopy = {
  english: {
    partnerName: 'Kaifa',
    active: 'Active',
    mobileSession: 'Session',
    conversationHint: 'Start the conversation by typing or using the microphone',
    conversationHintTranslation: 'Mulai percakapan dengan mengetik atau menggunakan mikrofon',
    fallbackGreeting: (topic: string, question: string) =>
      `Assalamu'alaikum! Today we'll practice “${topic}”. Let's begin. ${question}`,
    speechUnavailable: 'AI audio is not available yet.',
    audioPlayError: 'AI audio could not be played. Please try again.',
    speechRecognitionUnsupported:
      'Speech to text is not supported in this browser. You can still type your answer.',
    transcribing: 'Processing your voice...',
    speechTimeout: 'Voice processing took too long. Please try again.',
    microphonePermission: 'Allow microphone access to use this feature.',
    voiceNotCaptured: 'Your voice was not captured. Please try again.',
    sendError: 'Your answer could not be sent. Please try again.',
    stopAudio: 'Stop audio',
    playAiResponse: 'Play AI response',
    playing: 'Playing...',
    listen: 'Listen',
    listening: 'Listening... tap the microphone again when done',
    answerLabel: 'Write answer',
    preparingResult: 'Preparing assessment result...',
    preparingResultTranslation: 'Menyiapkan hasil penilaian...',
    answerPlaceholder: 'Write your answer...',
    stopMicrophone: 'Stop microphone',
    answerWithMicrophone: 'Answer with microphone',
    sendAnswer: 'Send answer',
    closeSession: 'Close session details',
    sessionLabel: 'Practice session',
    sessionTitle: 'Practice with AI',
    sessionDescription: 'Answer with confidence. Kaifa will guide you and give feedback.',
    selectedMaterial: 'Selected material',
    progressLabel: 'Assessment progress',
  },
  arabic: {
    partnerName: 'كايفا',
    active: 'نشط',
    mobileSession: 'الجلسة',
    conversationHint: 'ابدأ المحادثة بالكتابة أو باستخدام الميكروفون',
    conversationHintTranslation: 'Mulai percakapan dengan mengetik atau menggunakan mikrofon',
    fallbackGreeting: (topic: string, question: string) =>
      `السلام عليكم! سنتدرّب اليوم على “${topic}”. لنبدأ. ${question}`,
    speechUnavailable: 'صوت الذكاء الاصطناعي غير متاح حالياً.',
    audioPlayError: 'تعذر تشغيل صوت الذكاء الاصطناعي. حاول مرة أخرى.',
    speechRecognitionUnsupported:
      'تحويل الكلام إلى نص غير مدعوم في هذا المتصفح. يمكنك كتابة إجابتك.',
    transcribing: 'جارٍ معالجة صوتك...',
    speechTimeout: 'استغرقت معالجة الصوت وقتاً طويلاً. حاول مرة أخرى.',
    microphonePermission: 'اسمح بالوصول إلى الميكروفون لاستخدام هذه الميزة.',
    voiceNotCaptured: 'لم يتم التقاط صوتك. حاول مرة أخرى.',
    sendError: 'تعذر إرسال إجابتك. حاول مرة أخرى.',
    stopAudio: 'إيقاف الصوت',
    playAiResponse: 'تشغيل رد الذكاء الاصطناعي',
    playing: 'جارٍ التشغيل...',
    listen: 'استمع',
    listening: 'جارٍ الاستماع... اضغط الميكروفون مرة أخرى عند الانتهاء',
    answerLabel: 'اكتب الإجابة',
    preparingResult: 'جارٍ إعداد نتيجة التقييم...',
    preparingResultTranslation: 'Menyiapkan hasil penilaian...',
    answerPlaceholder: 'اكتب إجابتك...',
    stopMicrophone: 'إيقاف الميكروفون',
    answerWithMicrophone: 'الإجابة بالميكروفون',
    sendAnswer: 'إرسال الإجابة',
    closeSession: 'إغلاق تفاصيل الجلسة',
    sessionLabel: 'جلسة تدريب',
    sessionTitle: 'تدرّب مع الذكاء الاصطناعي',
    sessionDescription: 'أجب بثقة. سترافقك كايفا وتقدم لك ملاحظات.',
    selectedMaterial: 'المادة المختارة',
    progressLabel: 'تقدم التقييم',
  },
} satisfies Record<
  SyllabusLanguage,
  {
    partnerName: string;
    active: string;
    mobileSession: string;
    conversationHint: string;
    conversationHintTranslation: string;
    fallbackGreeting: (topic: string, question: string) => string;
    speechUnavailable: string;
    audioPlayError: string;
    speechRecognitionUnsupported: string;
    transcribing: string;
    speechTimeout: string;
    microphonePermission: string;
    voiceNotCaptured: string;
    sendError: string;
    stopAudio: string;
    playAiResponse: string;
    playing: string;
    listen: string;
    listening: string;
    answerLabel: string;
    preparingResult: string;
    preparingResultTranslation: string;
    answerPlaceholder: string;
    stopMicrophone: string;
    answerWithMicrophone: string;
    sendAnswer: string;
    closeSession: string;
    sessionLabel: string;
    sessionTitle: string;
    sessionDescription: string;
    selectedMaterial: string;
    progressLabel: string;
  }
>;

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
        <>
          <path d="M9 7v10M15 7v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </>
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

function PreparingResultOverlay({
  message,
  translation,
}: {
  message: string;
  translation: string;
}) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-[#fff9e9]/88 px-4 text-center backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-[#ead8b7] bg-[#fff9e9] px-5 py-7 shadow-[0_18px_50px_rgba(91,58,24,0.22)]">
        <div className="relative mx-auto grid size-32 place-items-center" aria-hidden="true">
          <span className="kaifa-ai-orbit absolute inset-0 rounded-full border-2 border-dashed border-[#dfcda9]" />
          <span className="kaifa-ai-pulse absolute inset-5 rounded-full bg-[#f2b84b]/25" />
          <div className="kaifa-ai-float relative">
            <div className="mx-auto h-6 w-1 rounded-full bg-[#49321d]" />
            <div className="mx-auto size-4 rounded-full bg-[#f2b84b]" />
            <div className="mt-1 w-24 rounded-[1.25rem] border-4 border-[#49321d] bg-[#2f6a43] p-2 shadow-[0_6px_0_#245234]">
              <div className="rounded-xl bg-[#fff6df] px-2 py-3">
                <div className="flex items-center justify-center gap-2.5">
                  <span className="kaifa-ai-eye size-3 rounded-full bg-[#49321d]" />
                  <span className="kaifa-ai-eye kaifa-ai-eye-delayed size-3 rounded-full bg-[#49321d]" />
                </div>
                <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-[#f2b84b]" />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xl leading-tight font-black text-[#2f2518]">{message}</p>
        <p className="mt-1 text-xs leading-5 font-medium text-[#8b765a] italic">{translation}</p>
      </div>
    </div>
  );
}

export function AssessmentChat({
  activitySteps,
  gradeHref,
  initialReply,
  language,
  moduleId,
  moduleTitle,
  moduleTranslations,
  topic,
  translatedActivitySteps,
  unitTitle,
  unitTranslations,
}: AssessmentChatProps) {
  const router = useRouter();
  const copy = assessmentChatCopy[language];
  const questions = assessmentQuestions[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      text: initialReply ?? copy.fallbackGreeting(topic, questions[0] ?? ''),
    },
  ]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [speechNotice, setSpeechNotice] = useState('');
  const [isSessionOpen, setIsSessionOpen] = useState(false);
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
  const messageIdRef = useRef(2);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const textToSpeechMutation = useMutation({
    mutationFn: (userText: string) =>
      apiClient.post<Blob>(
        '/api/assessment/speech/tts',
        { user_text: userText },
        { responseType: 'blob' },
      ),
  });
  const speechToTextMutation = useMutation({
    mutationFn: ({ audioBlob, signal }: { audioBlob: Blob; signal: AbortSignal }) =>
      apiClient.post<SpeechToTextResponse>('/api/assessment/speech/stt', audioBlob, {
        headers: { 'Content-Type': 'audio/webm' },
        params: { module_id: moduleId },
        signal,
      }),
  });
  const sendChatMutation = useMutation({
    mutationFn: (userText: string) =>
      apiClient.post<AssessmentChatResponse>('/api/assessment/chat', {
        module_id: moduleId,
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

  useEffect(() => {
    if (!isSessionOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsSessionOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isSessionOpen]);

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
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), speechToTextTimeoutMs);

    try {
      const payload = await speechToTextMutation.mutateAsync({
        audioBlob,
        signal: abortController.signal,
      });

      if (!payload.success || !payload.data?.text?.trim()) {
        throw new Error(payload?.message ?? copy.voiceNotCaptured);
      }

      return payload.data.text.trim();
    } catch (error) {
      if (abortController.signal.aborted) {
        throw new Error(copy.speechTimeout);
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function toggleListening() {
    if (mediaRecorderRef.current || isListening) {
      stopActiveRecording();
      return;
    }

    if (isThinking || isFinishing || isTranscribing) return;

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
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
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
    if (!trimmedAnswer || isThinking || isFinishing) return;

    setMessages((current) => [
      ...current,
      { id: messageIdRef.current++, role: 'user', text: trimmedAnswer },
    ]);
    setAnswer('');
    setIsThinking(true);
    const nextAnsweredCount = answeredCount + 1;
    setAnsweredCount(nextAnsweredCount);

    try {
      const payload = await sendChatMutation.mutateAsync(trimmedAnswer);

      if (!payload.success || !payload.data?.reply) {
        throw new Error(payload?.message ?? copy.sendError);
      }

      const responseData = payload.data;
      setMessages((current) => [
        ...current,
        {
          id: messageIdRef.current++,
          role: 'ai',
          text: responseData.reply,
        },
      ]);
      setIsThinking(false);

      if (responseData.result) {
        try {
          const serializedResult = JSON.stringify(responseData.result);
          window.sessionStorage.setItem(
            createAssessmentResultStorageKey(moduleId),
            serializedResult,
          );
          window.sessionStorage.setItem(latestAssessmentResultStorageKey, serializedResult);
        } catch {
          // The result is still available in this response; storage can fail in restricted browsers.
        }
        setIsFinishing(true);
        window.setTimeout(() => router.push(gradeHref), 900);
      }
    } catch (error) {
      setIsThinking(false);
      setSpeechNotice(error instanceof Error ? error.message : copy.sendError);
    }
  }

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/60 bg-[#fff9e9] shadow-[0_12px_35px_rgba(91,58,24,0.2)] sm:rounded-[2rem] sm:shadow-[0_24px_70px_rgba(91,58,24,0.24)]">
      {isFinishing && (
        <PreparingResultOverlay
          message={copy.preparingResult}
          translation={copy.preparingResultTranslation}
        />
      )}

      <header className="shrink-0 border-b border-[#ead8b7] bg-white/55 px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl sm:size-11 sm:rounded-2xl">
              <Image
                src="/images/icon_ai.png"
                alt="AI"
                width={124}
                height={124}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#2f2518]">{copy.partnerName}</p>
              <p className="truncate text-xs text-[#75644f]">{moduleTitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-xl bg-[#f4ead6] px-2.5 py-1.5 text-[10px] font-black text-[#2f6a43] ring-1 ring-[#dfcda9] sm:text-[11px]">
              {answeredCount}/{questions.length}
            </span>
            <button
              type="button"
              onClick={() => setIsSessionOpen(true)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#f4ead6] px-2.5 text-[10px] font-black text-[#49321d] ring-1 ring-[#dfcda9] lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={isSessionOpen}
            >
              <svg viewBox="0 0 20 20" className="size-3.5" fill="none" aria-hidden="true">
                <path
                  d="M5 3h8a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v14m3-10h4m-4 3h4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {copy.mobileSession}
            </button>
            <span
              aria-label={copy.active}
              className="grid size-2.5 shrink-0 place-items-center rounded-full bg-[#2f6a43] sm:size-auto sm:bg-[#e8f1e8] sm:px-3 sm:py-1.5 sm:text-[11px] sm:font-black sm:text-[#2f6a43]"
            >
              <span className="hidden sm:inline">{copy.active}</span>
            </span>
          </div>
        </div>
      </header>

      <div
        ref={messageListRef}
        className="min-h-0 flex-1 scrollbar-none space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:space-y-5 sm:px-6 sm:py-6"
        aria-live="polite"
      >
        <div className="mx-auto rounded-full bg-[#f4ead6] px-3 py-1.5 text-center text-[10px] font-bold text-[#8b765a] sm:w-fit sm:px-4 sm:py-2 sm:text-[11px]">
          {copy.conversationHint}
          <span className="mt-0.5 block text-[10px] leading-4 font-medium text-[#8b765a]/75 italic">
            {copy.conversationHintTranslation}
          </span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'ai' && <AiAvatar isSpeaking={playingId === message.id} />}
            <div
              className={`max-w-[86%] rounded-2xl px-3.5 py-3 text-sm leading-5 shadow-sm sm:max-w-[72%] sm:rounded-3xl sm:px-4 sm:py-3.5 sm:leading-6 ${
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

      <footer className="shrink-0 border-t border-[#ead8b7] bg-white/65 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:p-4">
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-[#dfcda9]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[#2f6a43] transition-[width] duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
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
          <label htmlFor="assessment-answer" className="sr-only">
            {copy.answerLabel}
          </label>
          <textarea
            id="assessment-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendAnswer();
              }
            }}
            rows={1}
            placeholder={isFinishing ? copy.preparingResult : copy.answerPlaceholder}
            disabled={isFinishing}
            className="min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-[#d9c4a0] bg-[#fffdf7] px-3 py-2.5 text-base text-[#2f2518] placeholder:text-[#9d8c73] focus:border-[#7154b7] focus:ring-4 focus:ring-[#7154b7]/15 focus:outline-none sm:min-h-12 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
          />
          <button
            type="button"
            onClick={toggleListening}
            disabled={isThinking || isFinishing || isTranscribing}
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
            disabled={!answer.trim() || isThinking || isFinishing}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#7154b7] text-white shadow-[0_3px_0_#52388d] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#7154b7]/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 sm:size-12 sm:rounded-2xl sm:shadow-[0_5px_0_#52388d]"
            aria-label={copy.sendAnswer}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d="m4 5 16 7-16 7 3-7-3-7Zm3 7h13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </footer>

      {isSessionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[#2f2518]/45 p-2 pt-[max(1rem,env(safe-area-inset-top))] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-session-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsSessionOpen(false)}
            aria-label={copy.closeSession}
          />
          <section className="relative max-h-[85dvh] w-full scrollbar-none overflow-y-auto rounded-[1.75rem] border border-white/60 bg-[#fff9e9] pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-18px_55px_rgba(47,37,24,0.28)]">
            <div className="sticky top-0 z-10 grid grid-cols-[2.25rem_1fr_2.25rem] items-center border-b border-[#ead8b7] bg-[#fff9e9]/95 px-3 py-3 backdrop-blur">
              <span aria-hidden="true" />
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d9c4a0]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setIsSessionOpen(false)}
                className="grid size-9 place-items-center rounded-xl bg-[#f4ead6] text-lg font-bold text-[#49321d] ring-1 ring-[#dfcda9] transition hover:bg-[#ead8b7] focus-visible:ring-4 focus-visible:ring-[#7154b7]/30 focus-visible:outline-none"
                aria-label={copy.closeSession}
              >
                ×
              </button>
            </div>

            <div className="relative overflow-hidden bg-[#2f6a43] px-5 py-6 text-[#fff6df]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_25%),linear-gradient(155deg,transparent_45%,rgba(0,0,0,0.18))]" />
              <div className="relative">
                <span className="inline-flex rounded-full bg-[#fff6df]/15 px-3 py-1.5 text-xs font-bold ring-1 ring-[#fff6df]/25">
                  {copy.sessionLabel}
                </span>
                <h2 id="mobile-session-title" className="mt-3 text-2xl font-black">
                  {copy.sessionTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#fff6df]/75">
                  {copy.sessionDescription}
                </p>
              </div>
            </div>

            <div className="p-5">
              <p className="text-[11px] font-black tracking-[0.16em] text-[#7b62bd] uppercase">
                {copy.selectedMaterial}
              </p>
              <h3 className="mt-2 text-xl font-black">{moduleTitle}</h3>
              <SyllabusTranslations translations={moduleTranslations} />
              <p className="mt-1 text-sm leading-6 text-[#75644f]">{unitTitle}</p>
              <SyllabusTranslations translations={unitTranslations} compact />

              <div className="mt-5 rounded-2xl bg-[#f4ead6] p-4">
                <div className="flex items-center justify-between gap-3 text-xs font-black">
                  <span>{copy.progressLabel}</span>
                  <span className="text-[#2f6a43]">
                    {answeredCount}/{questions.length}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfcda9]">
                  <div
                    className="h-full rounded-full bg-[#2f6a43] transition-[width] duration-500"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {activitySteps.map((title, index) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-2xl border border-[#ead8b7] bg-white/60 p-3"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f2b84b] text-xs font-black text-[#49321d]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs leading-4 font-black">{title}</p>
                      {translatedActivitySteps?.[index] && (
                        <p className="mt-0.5 text-[11px] leading-4 font-medium text-[#8b765a] italic">
                          {translatedActivitySteps[index]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
