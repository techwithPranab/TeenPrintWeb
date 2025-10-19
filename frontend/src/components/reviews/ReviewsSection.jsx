import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, MessageSquare, Plus, Filter, ChevronDown } from 'lucide-react';
import { fetchProductReviews } from '../../features/reviews/reviewsSlice';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

const ReviewsSection = ({ productId, productName }) => {
  const dispatch = useDispatch();
  const { productReviews } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [ratingFilter, setRatingFilter] = useState('');

  const reviewsData = productReviews[productId] || {
    reviews: [],
    pagination: {},
    ratingDistribution: {},
    loading: false,
    error: null,
  };

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews({
        productId,
        params: {
          sortBy,
          sortOrder,
          rating: ratingFilter,
        },
      }));
    }
  }, [dispatch, productId, sortBy, sortOrder, ratingFilter]);

  const handleWriteReview = () => {
    // In a real app, you'd fetch user's orders for this product
    // For now, we'll just show the form
    setSelectedOrderId('dummy-order-id'); // This should come from user's orders
    setShowReviewForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setSelectedOrderId(review.order);
    setShowReviewForm(true);
  };

  const handleCloseForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setSelectedOrderId(null);
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingDistribution = () => {
    const distribution = reviewsData.ratingDistribution;
    const total = reviewsData.reviews.length;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 w-12">
                <span>{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-gray-600 w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (reviewsData.loading && reviewsData.reviews.length === 0) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Reviews ({reviewsData.pagination.total || 0})
          </h3>
        </div>
        {user && (
          <button
            onClick={handleWriteReview}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Write a Review
          </button>
        )}
      </div>

      {reviewsData.reviews.length > 0 && (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Rating Breakdown</h4>
              {renderRatingDistribution()}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters and Sorting */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="helpful.count-desc">Most Helpful</option>
              </select>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {reviewsData.reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={() => {}} // Handled in ReviewCard
                  showActions={user && review.user._id === user.id}
                />
              ))}
            </div>

            {/* Load More */}
            {reviewsData.pagination.pages > reviewsData.pagination.page && (
              <div className="text-center">
                <button
                  onClick={() => {
                    dispatch(fetchProductReviews({
                      productId,
                      params: {
                        page: reviewsData.pagination.page + 1,
                        sortBy,
                        sortOrder,
                        rating: ratingFilter,
                      },
                    }));
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {reviewsData.reviews.length === 0 && !reviewsData.loading && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-600 mb-4">
            Be the first to share your thoughts about this product.
          </p>
          {user && (
            <button
              onClick={handleWriteReview}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write the First Review
            </button>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm
              productId={productId}
              orderId={selectedOrderId}
              existingReview={editingReview}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
