import { Link } from "react-router-dom";
import { LuStar } from "react-icons/lu";
import { getImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/formatters";

export default function ProductCard({ product }) {
  const { name, brand, basePrice, images, averageRating, reviewCount, slug, _id } = product;
  const imageUrl = getImageUrl(images?.[0]);
  const href = `/products/${slug || _id}`;

  return (
    <Link to={href} className="group block">
      <div
        className="overflow-hidden rounded-(--radius-md) bg-white transition-all duration-300 hover:-translate-y-1"
        style={{
          boxShadow: "var(--shadow-card)",
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
      >
        {/* Image */}
        <div className="overflow-hidden bg-(--color-surface) aspect-square">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-(--color-accent)/20 flex items-center justify-center">
              <span className="text-4xl opacity-20">👟</span>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="p-3 space-y-0.5">
          <p className="text-xs font-medium text-(--color-secondary) uppercase tracking-widest">
            {brand}
          </p>
          <p className="text-sm font-medium text-(--color-primary) leading-snug line-clamp-2">
            {name}
          </p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-semibold text-(--color-primary)">
              {formatPrice(basePrice)}
            </p>
            {reviewCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-(--color-secondary)">
                <LuStar size={11} className="fill-(--color-accent) text-(--color-accent)" />
                {averageRating?.toFixed(1)}
                <span className="opacity-60">({reviewCount})</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
