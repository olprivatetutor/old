import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';

export default function Loading() {
  return (
    <RouteLoadingRobot
      message="Kaifa AI is calculating your grade..."
      translation="Kaifa AI sedang menghitung nilaimu..."
      arabicMessage="كايفا بالذكاء الاصطناعي تحسب درجتك..."
      tone="green"
    />
  );
}
