import { Link } from 'react-router-dom';
import { StarIcon } from '../icons';
import type { Product } from '../api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
        {product.stock <= 10 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <StarIcon className="w-4 h-4 text-amber-400" filled />
          <span className="text-sm font-medium text-slate-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.reviews.length} reviews)</span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

