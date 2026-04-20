import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductsThunk } from "../store/slices/productsSlice";
import { getImageUrl } from "../utils/imageUrl";
import Hero from "../components/Hero/Hero";
import ProductGrid from "../components/product/ProductGrid";
import SectionTitle from "../components/layout/SectionTitle";

function CategoryCard({ category }) {
  const imageUrl = getImageUrl(category.image);
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-(--radius-md) aspect-[4/3] bg-(--color-surface) block"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-(--color-accent)/15 flex items-center justify-center">
          <span className="text-5xl opacity-30">👟</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <p className="absolute bottom-3 left-4 text-sm font-medium text-white">{category.name}</p>
    </Link>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: newArrivals, loading } = useAppSelector(s => s.products);
  const categories = useAppSelector(s => s.categories.items);

  useEffect(() => {
    dispatch(fetchProductsThunk({ sort: "newest", limit: 8 }));
  }, [dispatch]);

  return (
    <>
      <Hero />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle title="Shop by Category" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map(c => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <SectionTitle title="New Arrivals" className="mb-0" />
          <Link
            to="/products?sort=newest"
            className="text-sm text-(--color-secondary) underline hover:text-(--color-primary) transition-colors"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} />
      </section>
    </>
  );
}
