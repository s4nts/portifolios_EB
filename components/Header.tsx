import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Link href="/" className="flex justify-center">
          <div className="relative w-20 h-20">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
