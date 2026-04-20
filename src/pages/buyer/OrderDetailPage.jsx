import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchMyOrderThunk,
  cancelOrderThunk,
  clearSelectedOrder,
} from "../../store/slices/ordersSlice";
import { useToast } from "../../hooks/useToast";
import { formatPrice, formatDate } from "../../utils/formatters";
import { getImageUrl } from "../../utils/imageUrl";
import { canBuyerCancel } from "../../utils/orderHelpers";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import OrderStatusStepper from "../../components/order/OrderStatusStepper";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import PageWrapper from "../../components/layout/PageWrapper";
import { LuArrowLeft } from "react-icons/lu";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { selectedOrder: order, selectedOrderLoading: loading } = useAppSelector(s => s.orders);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrderThunk(orderId));
    return () => dispatch(clearSelectedOrder());
  }, [orderId, dispatch]);

  const handleCancel = async () => {
    setCancelling(true);
    const result = await dispatch(cancelOrderThunk({ orderId, cancelReason }));
    setCancelling(false);
    if (cancelOrderThunk.fulfilled.match(result)) {
      toast.success("Order cancelled");
      setCancelModal(false);
    } else {
      toast.error(result.payload || "Failed to cancel");
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

  return (
    <PageWrapper>
      <div className="mb-6">
        <Link
          to="/orders"
          className="flex items-center gap-1.5 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <LuArrowLeft size={14} /> Back to orders
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-primary)]">Order details</h1>
          <p className="text-xs text-[var(--color-secondary)] mt-0.5">
            Placed {formatDate(order.createdAt)} · ID: {order._id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {canBuyerCancel(order.status) && (
            <Button variant="outline" size="sm" onClick={() => setCancelModal(true)}>
              Cancel order
            </Button>
          )}
        </div>
      </div>

      {/* Status stepper */}
      <div className="mb-8 rounded-md border border-[var(--color-border)] bg-white p-5">
        <OrderStatusStepper status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
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
                <Link
                  to={`/products/${order.product?.slug || order.product?._id}`}
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  {order.product?.name}
                </Link>
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

          {/* Status history */}
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

        {/* Summary sidebar */}
        <div className="flex flex-col gap-4">
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
            <p className="mb-3 text-sm font-semibold text-[var(--color-primary)]">Seller</p>
            <p className="text-sm text-[var(--color-secondary)]">
              {order.seller?.firstName} {order.seller?.lastName}
            </p>
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

      <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)} title="Cancel order">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-secondary)]">
            Are you sure you want to cancel this order? This cannot be undone.
          </p>
          <textarea
            rows={3}
            placeholder="Reason (optional)"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            className="w-full rounded-sm border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCancelModal(false)}
              className="flex-1 justify-center"
            >
              Keep order
            </Button>
            <Button
              variant="danger"
              loading={cancelling}
              onClick={handleCancel}
              className="flex-1 justify-center"
            >
              Cancel order
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
