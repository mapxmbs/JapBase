'use client';

import DollarWidget from '@/components/ui/DollarWidget';

export default function DollarPage() {
  return (
    <div className="min-h-screen bg-japura-bg p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <DollarWidget standalone={true} />
      </div>
    </div>
  );
}
