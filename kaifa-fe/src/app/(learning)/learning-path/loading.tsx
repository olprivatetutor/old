import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';

export default function Loading() {
  return (
    <RouteLoadingRobot
      message="Kaifa AI is building your learning path..."
      translation="Kaifa AI sedang menyusun learning path-mu..."
      arabicMessage="كايفا بالذكاء الاصطناعي تبني مسار تعلمك..."
      tone="purple"
    />
  );
}
