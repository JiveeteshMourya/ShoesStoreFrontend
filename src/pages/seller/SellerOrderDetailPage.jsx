import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchSellerOrderThunk,
  updateOrderStatusThunk,
  clearSelectedOrder,
} from "../../store/slices/ordersSlice";
import { useToast } from "../../hooks/useToast";
import { formatPrice, formatDate } from "../../utils/formatters";
import { getImageUrl } from "../../utils/imageUrl";
import { SELLER_TRANSITIONS, ORDER_STATUS_LABELS } from "../../utils/orderHelpers";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import OrderStatusStepper from "../../components/order/OrderStatusStepper";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import PageWrapper from "../../components/layout/PageWrapper";
import { LuArrowLeft } from "react-icons/lu";

export default function SellerOrderDetailPage() {
  const { orderId } = useParams();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { selectedOrder: order, selectedOrderLoading: loading } = useAppSelector(s => s.orders);

  const [nextStatus, setNextStatus] = useState("");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchSellerOrderThunk(orderId));
    return () => dispatch(clearSelectedOrder());
  }, [orderId, dispatch]);

  useEffect(() => {
    if (order) {
      const transitions = SELLER_TRANSITIONS[order.status] ?? [];
      setNextStatus(transitions[0] ?? "");
    }
  }, [order?.status]);

  const handleUpdateStatus = async () => {
    if (!nextStatus) return;
    setUpdating(true);
    const result = await dispatch(updateOrderStatusThunk({ orderId, status: nextStatus, note }));
    setUpdating(false);
    if (updateOrderStatusThunk.fulfilled.match(result)) {
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[nextStatus]}`);
      setNote("");
    } else {
      toast.error(result.payload || "Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (!order)
    return (
      <PageWrapper>
        <p className="text-sm text-[var(--color-secondary)]">Order not found.</p>
      </PageWrapper>
    );

  const imageUrl = getImageUrl(order.product?.images?.[0]);
  const allowedTransitions = SELLER_TRANSITIONS[order.status] ?? [];

  return (
    <PageWrapper>
      <div className="mb-6">
        <Link
          to="/seller/orders"
          className="flex items-center gap-1.5 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <LuArrowLeft size={14} /> Back to orders
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-primary)]">Order details</h1>
          <p className="text-xs text-[var(--color-secondary)] mt-0.5">
            {formatDate(order.createdAt)} · {order._id}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Stepper */}
      <div className="mb-8 rounded-md border border-[var(--color-border)] bg-white p-5">
        <OrderStatusStepper status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Product */}
          <div className="rounded-md border border-[var(--color-border)] bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-[var(--color-primary)]">Item</p>
            <div className="flex gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-[var(--color-surface)]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={order.product?.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl opacity-20">
                    👟
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-primary)]">
                  {order.product?.name}
                </p>
                <p className="text-xs text-[var(--color-secondary)]">{order.product?.brand}</p>
                <p className="mt-2 text-xs text-[var(--color-secondary)]">
                  EU {order.size} · Qty {order.quantity} · {formatPrice(order.unitPrice)} each
                </p>
              </div>
              <p className="text-sm font-semibold text-[var(--color-primary)] shrink-0">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>

          {/* Update status */}
          {allowedTransitions.length > 0 && (
            <div className="rounded-md border border-[var(--color-border)] bg-white p-5">
              <p className="mb-4 text-sm font-semibold text-[var(--color-primary)]">
                Update status
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {allowedTransitions.map(s => (
                    <button
                      key={s}
                      onClick={() => setNextStatus(s)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        nextStatus === s
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-background)]"
                          : "border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Add a note (optional)"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full rounded-sm border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
                />
                <div>
                  <Button loading={updating} onClick={handleUpdateStatus} disabled={!nextStatus}>
                    Mark as {nextStatus ? ORDER_STATUS_LABELS[nextStatus] : "…"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="rounded-md border border-[var(--color-border)] bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-[var(--color-primary)]">Timeline</p>
              <div className="flex flex-col gap-3">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <div>
                      <p className="text-xs font-medium text-[var(--color-primary)] capitalize">
                        {h.status.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-[var(--color-secondary)]">
                        {formatDate(h.changedAt)}
                      </p>
                      {h.note && (
                        <p className="mt-0.5 text-xs text-[var(--color-secondary)]">{h.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-[var(--color-border)] bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-[var(--color-primary)]">Buyer</p>
            <p className="text-sm text-[var(--color-secondary)]">
              {order.buyer?.firstName} {order.buyer?.lastName}
            </p>
          </div>

          <div className="rounded-md border border-[var(--color-border)] bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-[var(--color-primary)]">
              Shipping address
            </p>
            {order.shippingAddress ? (
              <address className="not-italic text-sm text-[var(--color-secondary)] leading-relaxed">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </address>
            ) : (
              <p className="text-sm text-[var(--color-secondary)]">—</p>
            )}
          </div>

          <div className="rounded-md border border-[var(--color-border)] bg-white p-5">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-secondary)]">Total</span>
              <span className="font-semibold text-[var(--color-primary)]">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
