import ProductCard from "./ProductCard";
import Spinner from "../ui/Spinner";

export default function ProductGrid({ products, loading, emptyMessage = "No products found." }) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-(--color-secondary)">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map(p => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
