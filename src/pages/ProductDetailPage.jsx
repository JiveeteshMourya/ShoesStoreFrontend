import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductThunk, clearSelectedProduct } from "../store/slices/productsSlice";
import { placeOrderThunk } from "../store/slices/ordersSlice";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { formatPrice } from "../utils/formatters";
import ImageGallery from "../components/product/ImageGallery";
import SizeSelector from "../components/product/SizeSelector";
import ReviewSection from "../components/product/ReviewSection";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import StarRating from "../components/ui/StarRating";
import PageWrapper from "../components/layout/PageWrapper";
import { LuArrowLeft, LuChevronRight } from "react-icons/lu";

export default function ProductDetailPage() {
  const { slugOrId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, isBuyer, user } = useAuth();

  const { selectedProduct: product, selectedProductLoading: loading } = useAppSelector(
    s => s.products
  );
  const { placeOrderLoading } = useAppSelector(s => s.orders);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductThunk(slugOrId));
    return () => dispatch(clearSelectedProduct());
  }, [slugOrId, dispatch]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <PageWrapper>
        <p className="text-sm text-(--color-secondary)">Product not found.</p>
      </PageWrapper>
    );
  }

  const effectivePrice = selectedSize
    ? (product.sizeVariants?.find(v => v.size === selectedSize)?.price ?? product.basePrice)
    : product.basePrice;

  const selectedVariant = product.sizeVariants?.find(v => v.size === selectedSize);
  const maxQty = selectedVariant?.stock ?? 99;

  const handleOrder = async () => {
    if (!isAuthenticated) return navigate("/login");
    if (!isBuyer) return toast.error("Only buyers can place orders");
    if (!user?.address?.street) {
      toast.error("Please add a shipping address in your profile first");
      return navigate("/profile");
    }
    if (!selectedSize) return toast.error("Please select a size");

    const result = await dispatch(
      placeOrderThunk({ productId: product._id, size: selectedSize, quantity })
    );
    if (placeOrderThunk.fulfilled.match(result)) {
      toast.success("Order placed successfully!");
      setOrderModalOpen(false);
      navigate("/orders");
    } else {
      toast.error(result.payload || "Failed to place order");
    }
  };

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-(--color-secondary)">
        <Link to="/products" className="hover:text-(--color-primary) flex items-center gap-1">
          <LuArrowLeft size={13} /> Products
        </Link>
        <LuChevronRight size={12} />
        <span className="text-(--color-primary) truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-(--color-accent)">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-snug text-(--color-primary)">
              {product.name}
            </h1>

            {product.reviewCount > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <StarRating value={Math.round(product.averageRating)} size={14} />
                <span className="text-sm text-(--color-secondary)">
                  {product.averageRating?.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <p className="text-2xl font-semibold text-(--color-primary)">
            {formatPrice(effectivePrice)}
          </p>

          <p className="text-sm text-(--color-secondary) leading-relaxed">{product.description}</p>

          <SizeSelector
            sizeVariants={product.sizeVariants}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />

          {selectedSize && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-(--color-secondary)">Qty</p>
              <div className="flex items-center gap-2 rounded-sm border border-(--color-border) px-3 py-1.5">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-(--color-secondary) hover:text-(--color-primary) transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                  className="text-(--color-secondary) hover:text-(--color-primary) transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-(--color-secondary)">{maxQty} in stock</span>
            </div>
          )}

          {isBuyer ? (
            <Button
              size="lg"
              className="w-full justify-center"
              onClick={() => setOrderModalOpen(true)}
              disabled={!selectedSize}
            >
              {selectedSize ? "Place Order" : "Select a size"}
            </Button>
          ) : !isAuthenticated ? (
            <Button size="lg" className="w-full justify-center" onClick={() => navigate("/login")}>
              Sign in to buy
            </Button>
          ) : null}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-(--color-border) px-3 py-0.5 text-xs text-(--color-secondary)"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewSection productId={product._id} />

      {/* Order confirmation modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title="Confirm your order"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 rounded-sm bg-(--color-surface) p-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-(--color-primary)">{product.name}</p>
              <p className="text-xs text-(--color-secondary)">{product.brand}</p>
              <p className="mt-1 text-xs text-(--color-secondary)">
                Size EU {selectedSize} · Qty {quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-(--color-primary) shrink-0">
              {formatPrice(effectivePrice * quantity)}
            </p>
          </div>

          <p className="text-xs text-(--color-secondary)">
            Shipping to: {user?.address?.street}, {user?.address?.city}
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOrderModalOpen(false)}
              className="flex-1 justify-center"
            >
              Cancel
            </Button>
            <Button
              loading={placeOrderLoading}
              onClick={handleOrder}
              className="flex-1 justify-center"
            >
              Confirm order
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
