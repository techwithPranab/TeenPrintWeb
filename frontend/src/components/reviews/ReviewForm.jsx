import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { createProductReview, updateProductReview, clearCreateReviewState, clearUpdateReviewState } from '../../features/reviews/reviewsSlice';

const ReviewForm = ({ productId, orderId, existingReview = null, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { createReview, updateReview } = useSelector((state) => state.reviews);
  const [selectedRating, setSelectedRating] = useState(existingReview?.rating || 0);
  const [images, setImages] = useState(existingReview?.images || []);
  const [imageFiles, setImageFiles] = useState([]);

  const isEditing = !!existingReview;

  useEffect(() => {
    return () => {
      // Clear states when component unmounts
      dispatch(clearCreateReviewState());
      dispatch(clearUpdateReviewState());
    };
  }, [dispatch]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .max(100, 'Title must be less than 100 characters'),
    comment: Yup.string()
      .required('Review comment is required')
      .min(10, 'Review must be at least 10 characters')
      .max(1000, 'Review must be less than 1000 characters'),
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > 5) {
      alert('You can upload maximum 5 images.');
      return;
    }

    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      alt: file.name,
    }));

    setImages(prev => [...prev, ...newImages]);
    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const reviewData = {
        orderId,
        rating: selectedRating,
        title: values.title,
        comment: values.comment,
        images: imageFiles, // Files will be handled by the API
      };

      if (isEditing) {
        await dispatch(updateProductReview({
          reviewId: existingReview._id,
          reviewData,
        })).unwrap();
      } else {
        await dispatch(createProductReview({
          productId,
          reviewData,
        })).unwrap();
      }

      onClose();
    } catch (error) {
      console.error('Review submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && setSelectedRating(i + 1)}
        className={`w-8 h-8 ${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
      >
        <Star
          className={`w-full h-full ${
            i < selectedRating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to write a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit Review' : 'Write a Review'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <Formik
        initialValues={{
          title: existingReview?.title || '',
          comment: existingReview?.comment || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-1">
                {renderStars(true)}
                <span className="ml-2 text-sm text-gray-600">
                  {selectedRating > 0 ? `${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
              {selectedRating === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select a rating</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <Field
                name="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summarize your experience"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <Field
                name="comment"
                as="textarea"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your thoughts about this product..."
              />
              <ErrorMessage
                name="comment"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-gray-400" />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Upload up to 5 images (max 5MB each)
              </p>
            </div>

            {/* Error Messages */}
            {(createReview.error || updateReview.error) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  {createReview.error?.message || updateReview.error?.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedRating === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReviewForm;
