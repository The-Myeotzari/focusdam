import { HomePage } from '@/widgets/home-page';

export default function Page() {
  // new 혹은 returning은 나중에 API 연동해서 바꿔야 할 듯
  return <HomePage userKind="returning" />;
}
