'use client';
export default function ChatMessage({ m, isSelf }:{ m:{id:string; message:string; createdAt?:string; senderId:string}; isSelf:boolean }) {
  return (
    <div className={`mb-2 ${isSelf?'text-right':''}`}>
      <div className={`inline-block px-3 py-2 rounded-2xl ${isSelf?'bg-brand-primary text-white':'bg-black/5'}`}>{m.message}</div>
    </div>
  );
}
