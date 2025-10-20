import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminAPI from './adminAPI';

// Initial state
const initialState = {
  // Dashboard
  dashboardStats: null,
  recentOrders: [],
  topProducts: [],
  
  // Analytics
  analyticsData: null,
  
  // Orders
  orders: [],
  ordersPagination: null,
  currentOrder: null,
  
  // Users
  users: [],
  usersPagination: null,
  currentUser: null,
  
  // Products
  adminProducts: [],
  adminProductsPagination: null,
  currentProduct: null,
  
  // Coupons
  coupons: [],
  currentCoupon: null,
  
  // Contacts
  contacts: [],
  contactsPagination: null,
  currentContact: null,
  
  // UI States
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks

// Dashboard
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (dateRange, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardStats(dateRange);
      return response.data.data || response.data; // Handle both structures
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Analytics
export const fetchAnalyticsData = createAsyncThunk(
  'admin/fetchAnalyticsData',
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAnalyticsData(timeRange);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Orders
export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchAdminOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllOrders(params);
      return response.data.data; // Orders has nested structure: data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status, trackingInfo }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, { 
        orderStatus: status,
        ...trackingInfo 
      });
      return response.data.data.order; // Return the order directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Users
export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllUsers(params);
      return response.data.data; // Users has nested structure: data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { role });
      return response.data.data.user; // Return the user directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Products
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchAdminProducts',
  async (params, { rejectWithValue }) => {
    try {
      console.log('fetchAdminProducts params:', params)
      const response = await adminAPI.getAllProducts(params);
      console.log('fetchAdminProducts response:', response.data.data);
      return response.data.data || response.data; // Handle both structures
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  'admin/createAdminProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createProduct(productData);
      return response.data.data.product; // Return the product directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  'admin/updateAdminProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateProduct(productId, productData);
      return response.data.data.product; // Return the product directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  'admin/deleteAdminProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteProduct(productId);
      return { ...response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Coupons
export const fetchAdminCoupons = createAsyncThunk(
  'admin/fetchAdminCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllCoupons();
      return response.data.data; // Coupons has nested structure: data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createAdminCoupon = createAsyncThunk(
  'admin/createAdminCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createCoupon(couponData);
      return response.data.data.coupon; // Return the coupon directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAdminCoupon = createAsyncThunk(
  'admin/updateAdminCoupon',
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateCoupon(couponId, couponData);
      return response.data.data.coupon; // Return the coupon directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAdminCoupon = createAsyncThunk(
  'admin/deleteAdminCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteCoupon(couponId);
      return { ...response.data, couponId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Contacts
export const fetchAdminContacts = createAsyncThunk(
  'admin/fetchAdminContacts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllContacts(params);
      return response.data.data; // Contacts has nested structure: data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAdminContactById = createAsyncThunk(
  'admin/fetchAdminContactById',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getContactById(contactId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'admin/updateContactStatus',
  async ({ contactId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateContactStatus(contactId, { status });
      return response.data.data.contact; // Return the contact directly
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAdminContact = createAsyncThunk(
  'admin/deleteAdminContact',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteContact(contactId);
      return { ...response.data, contactId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCurrentCoupon: (state, action) => {
      state.currentCoupon = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        state.topProducts = action.payload.topProducts;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch dashboard stats';
      });

    // Analytics Data
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch analytics data';
      });

    // Admin Orders
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Update order in the list
        const index = state.orders.findIndex(order => 
          order._id === action.payload._id || 
          order.orderId === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update current order if it matches
        if (state.currentOrder && 
            (state.currentOrder._id === action.payload._id || 
             state.currentOrder.orderId === action.payload.orderId)) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update order status';
      });

    // Admin Users
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      });

    // Update User Role
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Update user in the list
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user role';
      });

    // Admin Products
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProducts = action.payload.products;
        state.adminProductsPagination = action.payload.pagination;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      });

    // Create Product
    builder
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product created successfully';
        state.adminProducts.unshift(action.payload);
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create product';
      });

    // Update Product
    builder
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product updated successfully';
        
        // Update product in the list
        const index = state.adminProducts.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.adminProducts[index] = action.payload;
        }
        
        // Update current product if it matches
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update product';
      });

    // Delete Product
    builder
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Remove product from the list
        state.adminProducts = state.adminProducts.filter(product => product._id !== action.payload.productId);
        
        // Clear current product if it matches
        if (state.currentProduct && state.currentProduct._id === action.payload.productId) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete product';
      });

    // Admin Coupons
    builder
      .addCase(fetchAdminCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
      })
      .addCase(fetchAdminCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch coupons';
      });

    // Create Coupon
    builder
      .addCase(createAdminCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Coupon created successfully';
        state.coupons.unshift(action.payload);
      })
      .addCase(createAdminCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create coupon';
      });

    // Update Coupon
    builder
      .addCase(updateAdminCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Coupon updated successfully';
        
        // Update coupon in the list
        const index = state.coupons.findIndex(coupon => coupon._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        
        // Update current coupon if it matches
        if (state.currentCoupon && state.currentCoupon._id === action.payload._id) {
          state.currentCoupon = action.payload;
        }
      })
      .addCase(updateAdminCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update coupon';
      });

    // Delete Coupon
    builder
      .addCase(deleteAdminCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Remove coupon from the list
        state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload.couponId);
        
        // Clear current coupon if it matches
        if (state.currentCoupon && state.currentCoupon._id === action.payload.couponId) {
          state.currentCoupon = null;
        }
      })
      .addCase(deleteAdminCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete coupon';
      });

    // Admin Contacts
    builder
      .addCase(fetchAdminContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.contactsPagination = action.payload.pagination;
      })
      .addCase(fetchAdminContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch contacts';
      });

    // Fetch Contact By ID
    builder
      .addCase(fetchAdminContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContact = action.payload.data.contact;
      })
      .addCase(fetchAdminContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch contact';
      });

    // Update Contact Status
    builder
      .addCase(updateContactStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Update contact in the list
        const index = state.contacts.findIndex(contact => contact._id === action.payload._id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        
        // Update current contact if it matches
        if (state.currentContact && state.currentContact._id === action.payload._id) {
          state.currentContact = action.payload;
        }
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update contact status';
      });

    // Delete Contact
    builder
      .addCase(deleteAdminContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminContact.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Remove contact from the list
        state.contacts = state.contacts.filter(contact => contact._id !== action.payload.contactId);
        
        // Clear current contact if it matches
        if (state.currentContact && state.currentContact._id === action.payload.contactId) {
          state.currentContact = null;
        }
      })
      .addCase(deleteAdminContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete contact';
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentProduct,
  setCurrentCoupon,
  setCurrentUser,
  setCurrentOrder,
  setCurrentContact,
} = adminSlice.actions;

export default adminSlice.reducer;
