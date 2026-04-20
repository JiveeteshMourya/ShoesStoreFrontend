import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative z-10 w-full ${maxWidth} rounded-[var(--radius-md)] bg-[var(--color-background)] shadow-xl`}
        onClick={e => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            {title && (
              <h3 className="text-base font-semibold text-[var(--color-primary)]">{title}</h3>
            )}
            <button
              onClick={onClose}
              className="ml-auto text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <LuX size={20} />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
