import { useState } from "react";
import { LuStar } from "react-icons/lu";

export default function StarRating({ value = 0, max = 5, onChange, size = 16 }) {
  const [hovered, setHovered] = useState(0);
  const interactive = Boolean(onChange);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= (hovered || value);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`transition-colors ${interactive ? "cursor-pointer" : "cursor-default"}`}
          >
            <LuStar
              size={size}
              className={
                filled
                  ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                  : "text-[var(--color-border)]"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
