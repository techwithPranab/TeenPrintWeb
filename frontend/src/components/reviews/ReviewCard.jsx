import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ThumbsUp, Star, User, MoreVertical, Edit, Trash2, Flag } from 'lucide-react';
import { markReviewHelpful, deleteProductReview } from '../../features/reviews/reviewsSlice';

const ReviewCard = ({ review, onEdit, onDelete, showActions = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);

  const handleMarkHelpful = async () => {
    if (!user) return;

    setIsMarkingHelpful(true);
    try {
      await dispatch(markReviewHelpful(review._id)).unwrap();
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteProductReview(review._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
    setShowMenu(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const isOwner = user && review.user._id === user.id;
  const hasMarkedHelpful = review.isHelpful;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.user.profilePicture ? (
            <img
              src={review.user.profilePicture}
              alt={review.user.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {review.user.firstName} {review.user.lastName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
              <span>•</span>
              <span>{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
              {review.isVerified && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Verified Purchase</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => {
                      onEdit(review);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.alt || `Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleMarkHelpful}
          disabled={!user || isMarkingHelpful}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-colors ${
            hasMarkedHelpful
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasMarkedHelpful ? 'fill-current' : ''}`} />
          <span>Helpful ({review.helpful?.count || 0})</span>
        </button>

        {/* Admin Response */}
        {review.adminResponse && (
          <div className="flex-1 ml-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Admin Response
            </div>
            <p className="text-sm text-blue-800">{review.adminResponse.comment}</p>
            <div className="text-xs text-blue-600 mt-1">
              {format(new Date(review.adminResponse.respondedAt), 'MMM d, yyyy')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
