export default function SizeSelector({ sizeVariants = [], selected, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-(--color-primary)">
        Size {selected ? `— EU ${selected}` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizeVariants.map(({ size, stock }) => {
          const oos = stock === 0;
          const active = selected === size;
          return (
            <button
              key={size}
              type="button"
              disabled={oos}
              onClick={() => !oos && onSelect(size)}
              className={`flex h-10 w-10 items-center justify-center rounded-(--radius-sm) border text-sm font-medium transition-colors
                ${oos ? "cursor-not-allowed border-(--color-border) text-(--color-secondary) line-through opacity-40" : ""}
                ${!oos && active ? "border-(--color-primary) bg-(--color-primary) text-(--color-background)" : ""}
                ${!oos && !active ? "border-(--color-border) text-(--color-primary) hover:border-(--color-primary)" : ""}
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
