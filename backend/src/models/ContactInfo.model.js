import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
  {
    // Address Information
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
        default: 'India',
      },
    },

    // Contact Numbers
    phoneNumbers: [{
      number: {
        type: String,
        required: true,
        trim: true,
      },
      label: {
        type: String,
        trim: true,
        default: 'Phone',
      },
    }],

    // Email Addresses
    emailAddresses: [{
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      label: {
        type: String,
        trim: true,
        default: 'Email',
      },
    }],

    // Business Hours
    businessHours: [{
      day: {
        type: String,
        required: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      hours: {
        type: String,
        required: true,
        trim: true,
      },
      isOpen: {
        type: Boolean,
        default: true,
      },
    }],

    // Social Media Links (optional)
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
    },

    // Additional Information
    description: {
      type: String,
      trim: true,
      default: 'Have a question or need assistance? Our team is here to help. Reach out to us through any of the channels below.',
    },

    // Map/Location Information
    mapLocation: {
      latitude: Number,
      longitude: Number,
      embedUrl: String, // Google Maps embed URL
    },

    // Contact Form Settings
    contactFormEnabled: {
      type: Boolean,
      default: true,
    },

    // Meta Information
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one contact info document exists
contactInfoSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await mongoose.model('ContactInfo').findOne();
    if (existing) {
      throw new Error('Only one contact info document can exist. Use update instead.');
    }
  }
  next();
});

// Static method to get the contact info (should only be one document)
contactInfoSchema.statics.getContactInfo = function() {
  return this.findOne().sort({ updatedAt: -1 });
};

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

export default ContactInfo;
