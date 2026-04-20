import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createProductThunk, updateProductThunk } from "../../store/slices/productsSlice";
import { fetchCategoriesThunk } from "../../store/slices/categoriesSlice";
import { validateProductForm, validateVariants } from "../../utils/validators";
import { useToast } from "../../hooks/useToast";
import { getImageUrl } from "../../utils/imageUrl";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionTitle from "../../components/layout/SectionTitle";
import { LuPlus, LuX, LuUpload } from "react-icons/lu";

const EMPTY_VARIANT = { size: "", stock: "", price: "" };

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const categories = useAppSelector(s => s.categories.items);
  const sellerProducts = useAppSelector(s => s.products.sellerProducts);

  const existing = isEdit ? sellerProducts.find(p => p._id === id) : null;

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    basePrice: "",
    tags: "",
    isActive: true,
  });
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "",
        description: existing.description || "",
        brand: existing.brand || "",
        category: existing.category?._id || existing.category || "",
        basePrice: String(existing.basePrice || ""),
        tags: (existing.tags || []).join(", "),
        isActive: existing.isActive ?? true,
      });
      setVariants(
        existing.sizeVariants?.length
          ? existing.sizeVariants.map(v => ({ size: v.size, stock: v.stock, price: v.price ?? "" }))
          : [{ ...EMPTY_VARIANT }]
      );
    } else if (categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0]._id }));
    }
  }, [existing, categories]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setVariant = (i, k, v) =>
    setVariants(vs => vs.map((vt, idx) => (idx === i ? { ...vt, [k]: v } : vt)));

  const addVariant = () => setVariants(vs => [...vs, { ...EMPTY_VARIANT }]);
  const removeVariant = i => setVariants(vs => vs.filter((_, idx) => idx !== i));

  const MAX_SIZE = 5 * 1024 * 1024;

  const handleImages = e => {
    const files = Array.from(e.target.files);
    const oversized = files.filter(f => f.size > MAX_SIZE);
    if (oversized.length) {
      toast.error(`${oversized.map(f => f.name).join(", ")} exceeds the 5 MB limit`);
      e.target.value = "";
      return;
    }
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = i => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFieldErrors({});
    const errors = {
      ...validateProductForm(form),
      ...validateVariants(variants),
    };
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      if (errors.variants) toast.error(errors.variants);
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("brand", form.brand);
    fd.append("category", form.category);
    fd.append("basePrice", form.basePrice);
    fd.append(
      "sizeVariants",
      JSON.stringify(
        variants.map(v => ({
          size: Number(v.size),
          stock: Number(v.stock),
          ...(v.price ? { price: Number(v.price) } : {}),
        }))
      )
    );
    if (form.tags.trim())
      fd.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)
        )
      );
    if (isEdit) fd.append("isActive", String(form.isActive));
    images.forEach(img => fd.append("images", img));

    setLoading(true);
    const result = isEdit
      ? await dispatch(updateProductThunk({ id, formData: fd }))
      : await dispatch(createProductThunk(fd));
    setLoading(false);

    if ((isEdit ? updateProductThunk : createProductThunk).fulfilled.match(result)) {
      toast.success(isEdit ? "Product updated" : "Product created");
      navigate("/seller/products");
    } else {
      toast.error(result.payload || "Failed to save product");
    }
  };

  return (
    <PageWrapper>
      <SectionTitle title={isEdit ? "Edit Product" : "New Product"} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
        {/* Basic info */}
        <div className="flex flex-col gap-4 rounded-md border border-[var(--color-border)] p-5">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Basic info</p>
          <Input
            label="Product name"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            error={fieldErrors.name}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={e => set("description", e.target.value)}
            rows={3}
            error={fieldErrors.description}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Brand"
              value={form.brand}
              onChange={e => set("brand", e.target.value)}
              error={fieldErrors.brand}
            />
            <Input
              label="Base price (₹)"
              type="number"
              min="0"
              step="0.01"
              value={form.basePrice}
              onChange={e => set("basePrice", e.target.value)}
              error={fieldErrors.basePrice}
            />
          </div>
          <Select
            label="Category"
            value={form.category}
            onChange={e => set("category", e.target.value)}
            error={fieldErrors.category}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={e => set("tags", e.target.value)}
            placeholder="running, cushion, lightweight"
            error={fieldErrors.tags}
          />
          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => set("isActive", e.target.checked)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-primary)]">
                Active (visible to buyers)
              </span>
            </label>
          )}
        </div>

        {/* Size variants */}
        <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Size variants</p>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors"
            >
              <LuPlus size={13} /> Add size
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-[var(--color-secondary)] px-1">
            <span>Size (EU)</span>
            <span>Stock</span>
            <span>Price (opt.)</span>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="grid flex-1 grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="42"
                  value={v.size}
                  onChange={e => setVariant(i, "size", e.target.value)}
                  className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                  required
                />
                <input
                  type="number"
                  placeholder="10"
                  value={v.stock}
                  onChange={e => setVariant(i, "stock", e.target.value)}
                  className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                  required
                />
                <input
                  type="number"
                  placeholder="Base"
                  value={v.price}
                  onChange={e => setVariant(i, "price", e.target.value)}
                  className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="shrink-0 text-[var(--color-secondary)] hover:text-[var(--color-error)] transition-colors"
                >
                  <LuX size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] p-5">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Images</p>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[var(--color-border)] py-8 hover:border-[var(--color-primary)] transition-colors">
            <LuUpload size={20} className="text-[var(--color-secondary)]" />
            <p className="text-sm text-[var(--color-secondary)]">Click to upload images</p>
            <p className="text-xs text-[var(--color-secondary)] opacity-60">
              JPEG, PNG, WebP · max 5 MB each
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImages}
            />
          </label>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative h-16 w-16">
                  <img src={src} alt="" className="h-full w-full rounded-sm object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-error)] text-white"
                  >
                    <LuX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {isEdit && existing?.images?.length > 0 && (
            <div>
              <p className="mb-2 text-xs text-[var(--color-secondary)]">Existing images</p>
              <div className="flex flex-wrap gap-2">
                {existing.images.map((imgId, i) => (
                  <img
                    key={i}
                    src={getImageUrl(imgId)}
                    alt=""
                    className="h-16 w-16 rounded-sm object-cover border border-[var(--color-border)]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/seller/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
