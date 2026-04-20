import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductsThunk } from "../store/slices/productsSlice";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import Pagination from "../components/ui/Pagination";
import PageWrapper from "../components/layout/PageWrapper";
import { LuSearch } from "react-icons/lu";
import { useState } from "react";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, total, page, totalPages } = useAppSelector(s => s.products);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");

  const buildParams = p => {
    const obj = {};
    for (const [k, v] of p.entries()) if (v) obj[k] = v;
    return obj;
  };

  useEffect(() => {
    dispatch(fetchProductsThunk(buildParams(params)));
  }, [params, dispatch]);

  const handleFilterChange = (key, value) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      if (key === "__clear__") {
        return new URLSearchParams({ sort: "newest" });
      }
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete("page");
      return next;
    });
  };

  const handleSearch = e => {
    e.preventDefault();
    setParams(prev => {
      const next = new URLSearchParams(prev);
      if (search) next.set("search", search);
      else next.delete("search");
      next.delete("page");
      return next;
    });
  };

  const handlePageChange = p => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-(--color-primary)">Products</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-(--color-secondary)">
              {total} {total === 1 ? "result" : "results"}
            </p>
          )}
        </div>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <LuSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-secondary)"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="rounded-sm border border-(--color-border) bg-(--color-background) pl-9 pr-4 py-2 text-sm outline-none focus:border-(--color-primary) w-56"
            />
          </div>
        </form>
      </div>

      <div className="flex gap-10">
        <ProductFilters params={params} onChange={handleFilterChange} />

        <div className="flex-1 min-w-0">
          {/* Mobile filter row */}
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <ProductFilters params={params} onChange={handleFilterChange} />
          </div>

          <ProductGrid products={items} loading={loading} />

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
