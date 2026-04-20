import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSellerProductsThunk } from "../../store/slices/productsSlice";
import { fetchSellerOrdersThunk } from "../../store/slices/ordersSlice";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../utils/formatters";
import PageWrapper from "../../components/layout/PageWrapper";
import { LuPackage, LuShoppingBag, LuPlus, LuArrowRight } from "react-icons/lu";

function StatCard({ label, value, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-md border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-primary)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-surface)]">
        <Icon size={18} className="text-[var(--color-accent)]" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-semibold text-[var(--color-primary)]">{value}</p>
        <p className="text-xs text-[var(--color-secondary)]">{label}</p>
      </div>
      <LuArrowRight
        size={16}
        className="text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </Link>
  );
}

export default function SellerDashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { sellerTotal, sellerLoading } = useAppSelector(s => s.products);
  const { sellerOrders } = useAppSelector(s => s.orders);

  const pendingCount = sellerOrders.items?.filter(o => o.status === "pending").length ?? 0;

  useEffect(() => {
    dispatch(fetchSellerProductsThunk({ limit: 1 }));
    dispatch(fetchSellerOrdersThunk({ status: "pending", limit: 5 }));
  }, [dispatch]);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Welcome, {user?.firstName}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-secondary)]">Your seller dashboard</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total products"
          value={sellerLoading ? "…" : sellerTotal}
          icon={LuShoppingBag}
          to="/seller/products"
        />
        <StatCard
          label="Pending orders"
          value={sellerOrders.loading ? "…" : sellerOrders.total}
          icon={LuPackage}
          to="/seller/orders"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-background)] hover:bg-[var(--color-secondary)] transition-colors"
        >
          <LuPlus size={15} /> New product
        </Link>
        <Link
          to="/seller/orders"
          className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
        >
          View orders
        </Link>
      </div>
    </PageWrapper>
  );
}
