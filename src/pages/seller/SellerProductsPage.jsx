import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSellerProductsThunk, deleteProductThunk } from "../../store/slices/productsSlice";
import { useToast } from "../../hooks/useToast";
import { formatPrice } from "../../utils/formatters";
import { getImageUrl } from "../../utils/imageUrl";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionTitle from "../../components/layout/SectionTitle";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";

export default function SellerProductsPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { sellerProducts, sellerTotal, sellerPage, sellerTotalPages, sellerLoading } =
    useAppSelector(s => s.products);
  const [deletingId, setDeletingId] = useState(null);

  const load = (p = 1) => dispatch(fetchSellerProductsThunk({ page: p, limit: 12 }));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async id => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    const result = await dispatch(deleteProductThunk(id));
    setDeletingId(null);
    if (deleteProductThunk.fulfilled.match(result)) {
      toast.success("Product deleted");
    } else {
      toast.error(result.payload || "Failed to delete");
    }
  };

  return (
    <PageWrapper>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle title="My Products" subtitle={`${sellerTotal} products`} className="mb-0" />
        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)] hover:bg-[var(--color-secondary)] transition-colors"
        >
          <LuPlus size={14} /> New product
        </Link>
      </div>

      {sellerLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : sellerProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-[var(--color-secondary)]">No products yet.</p>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-background)]"
          >
            <LuPlus size={14} /> Add your first product
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sellerProducts.map(p => {
            const imageUrl = getImageUrl(p.images?.[0]);
            return (
              <div
                key={p._id}
                className="flex items-center gap-4 rounded-md border border-[var(--color-border)] bg-white p-4"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-[var(--color-surface)]">
                  {imageUrl ? (
                    <img src={imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xl opacity-20">
                      👟
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-primary)] truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-[var(--color-secondary)]">
                    {p.brand} · {formatPrice(p.basePrice)}
                  </p>
                  <p className="text-xs text-[var(--color-secondary)]">
                    {p.sizeVariants?.length ?? 0} sizes ·{" "}
                    <span className={p.isActive ? "text-green-600" : "text-[var(--color-error)]"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/seller/products/${p._id}/edit`}
                    className="flex items-center gap-1.5 rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
                  >
                    <LuPencil size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deletingId === p._id}
                    className="flex items-center gap-1.5 rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-error)] hover:border-[var(--color-error)] transition-colors disabled:opacity-50"
                  >
                    {deletingId === p._id ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <LuTrash2 size={12} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sellerTotalPages > 1 && (
        <div className="mt-8">
          <Pagination page={sellerPage} totalPages={sellerTotalPages} onPageChange={load} />
        </div>
      )}
    </PageWrapper>
  );
}
