import { useState, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import * as reviewsApi from "../../api/reviewsApi";
import { formatDate } from "../../utils/formatters";
import { validateReview } from "../../utils/validators";
import { getImageUrl } from "../../utils/imageUrl";
import StarRating from "../ui/StarRating";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import Spinner from "../ui/Spinner";

function ReviewAvatar({ buyer }) {
  const initial = buyer?.firstName?.[0]?.toUpperCase() || "?";
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-accent) text-xs font-semibold text-white">
      {initial}
    </div>
  );
}

export default function ReviewSection({ productId }) {
  const { user, isBuyer } = useAuth();
  const toast = useToast();

  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: "" });
  const [formErrors, setFormErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const myReview = reviews.find(r => r.buyer?._id === user?._id);

  const loadReviews = async p => {
    setLoading(true);
    try {
      const res = await reviewsApi.getProductReviews(productId, { page: p, limit: 10 });
      const data = res.data.data;
      setReviews(data.items);
      setTotal(data.total);
      setPage(p);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) loadReviews(1);
  }, [productId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setFormErrors({});
    const errors = validateReview(form);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      if (errors.rating) toast.error(errors.rating);
      return;
    }
    setSubmitting(true);
    try {
      await reviewsApi.createReview(productId, form);
      toast.success("Review submitted!");
      setForm({ rating: 0, comment: "" });
      setFormErrors({});
      loadReviews(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async e => {
    e.preventDefault();
    setEditErrors({});
    const errors = validateReview(editForm);
    if (Object.keys(errors).length) {
      setEditErrors(errors);
      if (errors.rating) toast.error(errors.rating);
      return;
    }
    setSubmitting(true);
    try {
      await reviewsApi.updateReview(editId, editForm);
      toast.success("Review updated");
      setEditId(null);
      setEditErrors({});
      loadReviews(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this review?")) return;
    try {
      await reviewsApi.deleteReview(id);
      toast.success("Review deleted");
      loadReviews(1);
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="mt-12 border-t border-(--color-border) pt-10">
      <h3 className="mb-6 text-lg font-semibold text-(--color-primary)">
        Reviews{" "}
        {total > 0 && (
          <span className="text-(--color-secondary) font-normal text-base">({total})</span>
        )}
      </h3>

      {/* Submit form */}
      {isBuyer && !myReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-(--radius-md) border border-(--color-border) p-5"
        >
          <p className="mb-3 text-sm font-medium text-(--color-primary)">Write a review</p>
          <StarRating
            value={form.rating}
            onChange={r => setForm(f => ({ ...f, rating: r }))}
            size={20}
          />
          <div className="mt-3">
            <Textarea
              placeholder="Share your thoughts (optional)..."
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              rows={3}
              error={formErrors.comment}
            />
          </div>
          <Button type="submit" loading={submitting} size="sm" className="mt-3">
            Submit review
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-(--color-secondary)">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col divide-y divide-(--color-border)">
          {reviews.map(r => (
            <div key={r._id} className="py-5">
              <div className="flex items-start gap-3">
                <ReviewAvatar buyer={r.buyer} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-(--color-primary)">
                      {r.buyer?.firstName} {r.buyer?.lastName}
                    </p>
                    <p className="text-xs text-(--color-secondary) shrink-0">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={r.rating} size={13} />
                    {r.isEdited && (
                      <span className="text-xs text-(--color-secondary) italic">edited</span>
                    )}
                  </div>
                  {editId === r._id ? (
                    <form onSubmit={handleEdit} className="mt-3">
                      <StarRating
                        value={editForm.rating}
                        onChange={v => setEditForm(f => ({ ...f, rating: v }))}
                        size={16}
                      />
                      <Textarea
                        className="mt-2"
                        value={editForm.comment}
                        onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                        rows={2}
                        error={editErrors.comment}
                      />
                      <div className="mt-2 flex gap-2">
                        <Button type="submit" size="sm" loading={submitting}>
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    r.comment && (
                      <p className="mt-2 text-sm text-(--color-primary) leading-relaxed">
                        {r.comment}
                      </p>
                    )
                  )}
                  {user?._id === r.buyer?._id && editId !== r._id && (
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => {
                          setEditId(r._id);
                          setEditForm({ rating: r.rating, comment: r.comment || "" });
                        }}
                        className="text-xs text-(--color-secondary) underline hover:text-(--color-primary) transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-xs text-(--color-error) underline hover:opacity-80 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
