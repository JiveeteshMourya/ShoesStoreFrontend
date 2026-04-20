import { useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";

export default function ImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const urls = images.map(getImageUrl).filter(Boolean);

  if (urls.length === 0) {
    return (
      <div className="aspect-square w-full rounded-(--radius-md) bg-(--color-surface) flex items-center justify-center">
        <span className="text-6xl opacity-20">👟</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-(--radius-md) bg-(--color-surface)">
        <img src={urls[active]} alt={name} className="h-full w-full object-cover" />
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-(--radius-sm) border-2 transition-colors ${
                i === active ? "border-(--color-primary)" : "border-(--color-border)"
              }`}
            >
              <img src={url} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
