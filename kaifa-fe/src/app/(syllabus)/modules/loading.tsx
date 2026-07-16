import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';

export default function Loading() {
  return (
    <RouteLoadingRobot
      message="Kaifa AI is arranging your modules..."
      translation="Kaifa AI sedang menyusun modul-modulmu..."
      arabicMessage="كايفا بالذكاء الاصطناعي ترتب وحداتك..."
      tone="purple"
    />
  );
}
