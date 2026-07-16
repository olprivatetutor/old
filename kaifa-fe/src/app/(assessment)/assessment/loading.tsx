import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';

export default function Loading() {
  return (
    <RouteLoadingRobot
      message="Kaifa AI is preparing your assessment..."
      translation="Kaifa AI sedang menyiapkan penilaianmu..."
      arabicMessage="كايفا بالذكاء الاصطناعي تجهّز تقييمك..."
      tone="purple"
    />
  );
}
