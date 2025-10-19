import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewsAPI from './reviewsAPI';

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.getProductReviews(productId, params);
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProductReview = createAsyncThunk(
  'reviews/createProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.createReview(productId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProductReview = createAsyncThunk(
  'reviews/updateProductReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.updateReview(reviewId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  'reviews/deleteProductReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markReviewHelpful = createAsyncThunk(
  'reviews/markReviewHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.markReviewHelpful(reviewId);
      return { reviewId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.getUserReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    productReviews: {}, // { productId: { reviews: [], pagination: {}, ratingDistribution: {}, loading: false, error: null } }
    userReviews: {
      reviews: [],
      pagination: {},
      loading: false,
      error: null,
    },
    createReview: {
      loading: false,
      error: null,
      success: false,
    },
    updateReview: {
      loading: false,
      error: null,
      success: false,
    },
    deleteReview: {
      loading: false,
      error: null,
    },
  },
  reducers: {
    clearCreateReviewState: (state) => {
      state.createReview = {
        loading: false,
        error: null,
        success: false,
      };
    },
    clearUpdateReviewState: (state) => {
      state.updateReview = {
        loading: false,
        error: null,
        success: false,
      };
    },
    clearDeleteReviewState: (state) => {
      state.deleteReview = {
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch product reviews
    builder
      .addCase(fetchProductReviews.pending, (state, action) => {
        const { productId } = action.meta.arg;
        if (!state.productReviews[productId]) {
          state.productReviews[productId] = {
            reviews: [],
            pagination: {},
            ratingDistribution: {},
            loading: false,
            error: null,
          };
        }
        state.productReviews[productId].loading = true;
        state.productReviews[productId].error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        const { productId, reviews, pagination, ratingDistribution } = action.payload;
        state.productReviews[productId] = {
          reviews,
          pagination,
          ratingDistribution,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.productReviews[productId].loading = false;
        state.productReviews[productId].error = action.payload;
      });

    // Create review
    builder
      .addCase(createProductReview.pending, (state) => {
        state.createReview.loading = true;
        state.createReview.error = null;
        state.createReview.success = false;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.createReview.loading = false;
        state.createReview.success = true;
        // Optionally add the new review to the product reviews
        const { review } = action.payload.data;
        const productId = review.product;
        if (state.productReviews[productId]) {
          state.productReviews[productId].reviews.unshift(review);
        }
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.createReview.loading = false;
        state.createReview.error = action.payload;
      });

    // Update review
    builder
      .addCase(updateProductReview.pending, (state) => {
        state.updateReview.loading = true;
        state.updateReview.error = null;
        state.updateReview.success = false;
      })
      .addCase(updateProductReview.fulfilled, (state, action) => {
        state.updateReview.loading = false;
        state.updateReview.success = true;
        // Update the review in the state
        const { review } = action.payload.data;
        const productId = review.product;
        if (state.productReviews[productId]) {
          const index = state.productReviews[productId].reviews.findIndex(
            (r) => r._id === review._id
          );
          if (index !== -1) {
            state.productReviews[productId].reviews[index] = review;
          }
        }
      })
      .addCase(updateProductReview.rejected, (state, action) => {
        state.updateReview.loading = false;
        state.updateReview.error = action.payload;
      });

    // Delete review
    builder
      .addCase(deleteProductReview.pending, (state) => {
        state.deleteReview.loading = true;
        state.deleteReview.error = null;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.deleteReview.loading = false;
        // Remove the review from the state
        const reviewId = action.payload;
        Object.keys(state.productReviews).forEach((productId) => {
          state.productReviews[productId].reviews = state.productReviews[
            productId
          ].reviews.filter((review) => review._id !== reviewId);
        });
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.deleteReview.loading = false;
        state.deleteReview.error = action.payload;
      });

    // Mark review helpful
    builder
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const { reviewId, helpfulCount, isHelpful } = action.payload.data;
        // Update the helpful count in the state
        Object.keys(state.productReviews).forEach((productId) => {
          const review = state.productReviews[productId].reviews.find(
            (r) => r._id === reviewId
          );
          if (review) {
            review.helpful.count = helpfulCount;
            review.isHelpful = isHelpful;
          }
        });
      });

    // Fetch user reviews
    builder
      .addCase(fetchUserReviews.pending, (state) => {
        state.userReviews.loading = true;
        state.userReviews.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.userReviews = {
          ...action.payload.data,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userReviews.loading = false;
        state.userReviews.error = action.payload;
      });
  },
});

export const { clearCreateReviewState, clearUpdateReviewState, clearDeleteReviewState } =
  reviewsSlice.actions;

export default reviewsSlice.reducer;
