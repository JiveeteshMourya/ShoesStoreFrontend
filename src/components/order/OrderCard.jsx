import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import { formatPrice, formatDate } from "../../utils/formatters";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ order, linkBase = "/orders" }) {
  const { _id, product, size, quantity, totalPrice, status, createdAt } = order;
  const imageUrl = getImageUrl(product?.images?.[0]);

  return (
    <Link
      to={`${linkBase}/${_id}`}
      className="flex gap-4 rounded-md border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-primary)]"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-[var(--color-surface)]">
        {imageUrl ? (
          <img src={imageUrl} alt={product?.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xl opacity-20">
            👟
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-primary)] truncate">
              {product?.name ?? "Product"}
            </p>
            <p className="text-xs text-[var(--color-secondary)]">
              EU {size} · Qty {quantity}
            </p>
          </div>
          <OrderStatusBadge status={status} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-secondary)]">{formatDate(createdAt)}</p>
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>
    </Link>
  );
}
