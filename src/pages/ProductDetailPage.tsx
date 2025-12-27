import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '../icons';
import { Spinner } from '../components';
import { getProduct } from '../api';
import type { Product } from '../api';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    getProduct(parseInt(id, 10))
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch product'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </Link>
        </div>
      </header>

      {/* Product Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img
                src={images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-indigo-600 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mt-2">{product.title}</h1>
              {product.brand && (
                <p className="text-slate-500 mt-1">by {product.brand}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.rating)
                        ? 'text-amber-400'
                        : 'text-slate-200'
                    }`}
                    filled={star <= Math.round(product.rating)}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">
                ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-600 text-sm font-semibold rounded-full">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 10
                    ? 'bg-emerald-500'
                    : product.stock > 0
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-sm font-medium text-slate-700">
                {product.availabilityStatus}
              </span>
              <span className="text-sm text-slate-400">({product.stock} in stock)</span>
            </div>

            {/* Product Details */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">SKU:</span>
                  <span className="ml-2 text-slate-700 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-slate-500">Weight:</span>
                  <span className="ml-2 text-slate-700 font-medium">{product.weight} kg</span>
                </div>
                <div>
                  <span className="text-slate-500">Warranty:</span>
                  <span className="ml-2 text-slate-700 font-medium">
                    {product.warrantyInformation}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Shipping:</span>
                  <span className="ml-2 text-slate-700 font-medium">
                    {product.shippingInformation}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 text-sm">Return Policy:</span>
                <span className="ml-2 text-slate-700 text-sm font-medium">
                  {product.returnPolicy}
                </span>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{review.reviewerName}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'text-amber-400' : 'text-slate-200'
                        }`}
                        filled={star <= review.rating}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

