import Link from 'next/link';
interface Props {
  children: React.ReactNode;
}
import AuthButton from '../../(auth)/_components/AuthButton';
import { Separator } from '@/components/ui/separator';

export default function Header({ children }: Props) {
  return (
    <header className="flex  dark:border-white">
      <section className="flex gap-4 sm:px-8 lg:px-20 sm:py-4 items-center justify-between w-full">
        {children}
        <div className="hidden w-12 sm:block">
          <AuthButton />
        </div>
      </section>
    </header>
  );
}
