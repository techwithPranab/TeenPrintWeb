import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'Untitled Design',
    },
    // Fabric.js canvas JSON data
    canvasData: {
      front: {
        type: mongoose.Schema.Types.Mixed, // Stores Fabric.js JSON
        default: null,
      },
      back: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
    // Preview images stored in Cloudinary
    previews: {
      front: {
        url: String,
        publicId: String,
      },
      back: {
        url: String,
        publicId: String,
      },
    },
    // Uploaded images used in design
    uploadedImages: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'final', 'ordered'],
      default: 'draft',
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
designSchema.index({ user: 1, createdAt: -1 });
designSchema.index({ product: 1 });

const Design = mongoose.model('Design', designSchema);

export default Design;
