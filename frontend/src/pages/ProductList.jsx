import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, resetFilters } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/common/Pagination';
import { Loader2 } from 'lucide-react';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, filters, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {};
    if (searchParams.get('category')) urlFilters.category = searchParams.get('category');
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search');
    if (searchParams.get('minPrice')) urlFilters.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) urlFilters.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('sort')) urlFilters.sort = searchParams.get('sort');

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }

    dispatch(fetchCategories());
  }, [searchParams, dispatch]);

  // Fetch products when filters or page changes
  useEffect(() => {
    const params = {
      ...filters,
      page: currentPage,
      limit: 12,
    };

    // Remove null/undefined values
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    dispatch(fetchProducts(params));
  }, [filters, currentPage, dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setCurrentPage(1); // Reset to first page on filter change

    // Update URL params
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-lg text-gray-600">
            Customize and order from our wide collection of products
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              categories={categories}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-700">
                  Showing{' '}
                  <span className="font-semibold">
                    {Math.min((currentPage - 1) * 12 + 1, pagination.total)}
                  </span>{' '}
                  -{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * 12, pagination.total)}
                  </span>{' '}
                  of <span className="font-semibold">{pagination.total}</span> products
                </p>
                {pagination.pages > 1 && (
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {pagination.pages}
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium mb-2">Error loading products</p>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={() => dispatch(fetchProducts({ ...filters, page: currentPage }))}
                  className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Products Found */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
