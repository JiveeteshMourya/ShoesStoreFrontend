import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { name, basePrice, averageRating, reviewCount, images, slug } = product;
  const imgUrl = getImageUrl(images?.[0]);

  return (
    <div
      onClick={() => navigate(`/products/${slug}`)}
      className="flex-shrink-0 w-[120px] bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="w-full h-[96px] bg-gray-100">
        {imgUrl ? (
          <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">👟</div>
        )}
      </div>
      <div className="p-2 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">{name}</p>
        <p className="text-xs font-bold text-gray-900">₹{basePrice.toLocaleString("en-IN")}</p>
        <div className="flex items-center gap-0.5">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-600">{averageRating?.toFixed(1)}</span>
          {reviewCount > 0 && <span className="text-[10px] text-gray-400">({reviewCount})</span>}
        </div>
      </div>
    </div>
  );
}
