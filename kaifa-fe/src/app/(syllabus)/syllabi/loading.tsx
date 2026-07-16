import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';

export default function Loading() {
  return (
    <RouteLoadingRobot
      message="Kaifa AI is mapping your syllabus..."
      translation="Kaifa AI sedang memetakan silabusmu..."
      arabicMessage="كايفا بالذكاء الاصطناعي ترسم خريطة منهجك..."
      tone="green"
    />
  );
}
