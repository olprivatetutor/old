import { RouteLoadingRobot } from '@/components/ui/route-loading-robot';

export default function Loading() {
  return (
    <RouteLoadingRobot
      message="Kaifa AI is opening your learning chat..."
      translation="Kaifa AI sedang membuka chat belajar-mu..."
      arabicMessage="كايفا بالذكاء الاصطناعي تفتح محادثة التعلم..."
      tone="green"
    />
  );
}
