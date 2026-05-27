import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";

  return (
    <a
      aria-label="Contact on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-premium transition hover:-translate-y-1"
      href={`https://wa.me/${number}`}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle size={26} />
    </a>
  );
}
