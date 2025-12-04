'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label="Voltar"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm font-medium">Voltar</span>
    </button>
  );
}
