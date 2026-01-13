"use client";

import dynamic from 'next/dynamic';

const GameWrapper = dynamic(() => import('@/components/GameWrapper'), { ssr: false });

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
       <GameWrapper />
    </main>
  );
}
