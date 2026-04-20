import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyOrdersThunk } from "../../store/slices/ordersSlice";
import OrderCard from "../../components/order/OrderCard";
import Pagination from "../../components/ui/Pagination";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionTitle from "../../components/layout/SectionTitle";
import Spinner from "../../components/ui/Spinner";
import { ORDER_STATUS_LABELS } from "../../utils/orderHelpers";

const STATUS_FILTERS = [
  "",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { buyerOrders } = useAppSelector(s => s.orders);
  const { items, total, page, totalPages, loading } = buyerOrders;
  const [status, setStatus] = useState("");

  const load = (p = 1, s = status) => {
    const params = { page: p, limit: 10 };
    if (s) params.status = s;
    dispatch(fetchMyOrdersThunk(params));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = s => {
    setStatus(s);
    load(1, s);
  };

  return (
    <PageWrapper>
      <SectionTitle title="My Orders" subtitle={`${total} total order${total !== 1 ? "s" : ""}`} />

      {/* Status filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => handleStatus(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              status === s
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-background)]"
                : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)]"
            }`}
          >
            {s ? ORDER_STATUS_LABELS[s] : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-20 text-center text-sm text-[var(--color-secondary)]">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(o => (
            <OrderCard key={o._id} order={o} linkBase="/orders" />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onPageChange={p => load(p)} />
        </div>
      )}
    </PageWrapper>
  );
}
