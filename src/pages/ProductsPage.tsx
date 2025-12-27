import { useState, useEffect, useCallback } from 'react';
import { SearchInput, Dropdown, ProductCard, Spinner } from '../components';
import { FilterIcon } from '../icons';
import { getProducts, getCategories, getSortParams } from '../api';
import type { Product, Category, SortOption } from '../api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { sortBy, order } = getSortParams(sortOption);
      const response = await getProducts({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        sortBy,
        order,
        limit: 0, // Get all products
      });
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, sortOption]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ];

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortOption('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Products
            </h1>
            <div className="text-sm text-slate-500">
              {!isLoading && (
                <span>
                  Showing <span className="font-semibold text-slate-700">{products.length}</span> products
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-700">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
            />

            {/* Category Filter */}
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="All Categories"
            />

            {/* Sort */}
            <Dropdown
              options={SORT_OPTIONS}
              value={sortOption}
              onChange={(val) => setSortOption(val as SortOption)}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

