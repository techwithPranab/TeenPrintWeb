import Product from '../src/models/Product.model.js';

const products = [
  // T-Shirts
  {
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-t-shirt',
    description: 'Premium 100% cotton t-shirt perfect for custom printing. Soft, comfortable, and durable.',
    basePrice: 599,
    category: null, // Will be set after categories are created
    sizes: [
      { name: 'S', priceModifier: 0, isAvailable: true },
      { name: 'M', priceModifier: 0, isAvailable: true },
      { name: 'L', priceModifier: 0, isAvailable: true },
      { name: 'XL', priceModifier: 50, isAvailable: true },
      { name: 'XXL', priceModifier: 100, isAvailable: true },
    ],
    colors: [
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'Navy', hexCode: '#000080', isAvailable: true },
      { name: 'Gray', hexCode: '#808080', isAvailable: true },
      { name: 'Red', hexCode: '#FF0000', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        publicId: 'tshirt_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
        publicId: 'tshirt_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        publicId: 'tshirt_image_1',
        alt: 'Classic Cotton T-Shirt',
      },
      {
        url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
        publicId: 'tshirt_image_2',
        alt: 'Classic Cotton T-Shirt Back',
      },
    ],
    stock: 100,
    isActive: true,
    isFeatured: true,
    specifications: {
      material: '100% Cotton',
      careInstructions: 'Machine wash cold, tumble dry low',
    },
    tags: ['t-shirt', 'cotton', 'classic', 'comfortable'],
  },
  {
    name: 'Premium Graphic Tee',
    slug: 'premium-graphic-tee',
    description: 'High-quality graphic t-shirt with excellent print quality. Perfect for bold designs.',
    basePrice: 699,
    category: null,
    sizes: [
      { name: 'S', priceModifier: 0, isAvailable: true },
      { name: 'M', priceModifier: 0, isAvailable: true },
      { name: 'L', priceModifier: 0, isAvailable: true },
      { name: 'XL', priceModifier: 50, isAvailable: true },
      { name: 'XXL', priceModifier: 100, isAvailable: true },
    ],
    colors: [
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'Navy', hexCode: '#000080', isAvailable: true },
      { name: 'Gray', hexCode: '#808080', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
        publicId: 'graphic_tee_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        publicId: 'graphic_tee_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
        publicId: 'graphic_tee_image_1',
        alt: 'Premium Graphic Tee',
      },
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        publicId: 'graphic_tee_image_2',
        alt: 'Premium Graphic Tee Back',
      },
    ],
    stock: 75,
    isActive: true,
    isFeatured: true,
    specifications: {
      material: 'Cotton Blend',
      careInstructions: 'Machine wash cold, tumble dry low',
    },
    tags: ['t-shirt', 'graphic', 'premium', 'bold'],
  },

  // Mugs
  {
    name: 'Classic Ceramic Mug',
    slug: 'classic-ceramic-mug',
    description: 'Beautiful white ceramic mug perfect for coffee, tea, or hot chocolate. Dishwasher and microwave safe.',
    basePrice: 349,
    category: null,
    sizes: [
      { name: '11 oz', priceModifier: 0, isAvailable: true },
    ],
    colors: [
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600',
        publicId: 'mug_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        publicId: 'mug_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600',
        publicId: 'mug_image_1',
        alt: 'Classic Ceramic Mug',
      },
      {
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        publicId: 'mug_image_2',
        alt: 'Classic Ceramic Mug Back',
      },
    ],
    stock: 200,
    isActive: true,
    isFeatured: true,
    specifications: {
      material: 'Ceramic',
      capacity: '11 oz',
      careInstructions: 'Dishwasher and microwave safe',
    },
    tags: ['mug', 'ceramic', 'coffee', 'tea'],
  },
  {
    name: 'Travel Mug',
    slug: 'travel-mug',
    description: 'Insulated stainless steel travel mug that keeps drinks hot or cold for hours.',
    basePrice: 599,
    category: null,
    sizes: [
      { name: '16 oz', priceModifier: 0, isAvailable: true },
    ],
    colors: [
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
      { name: 'Silver', hexCode: '#C0C0C0', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        publicId: 'travel_mug_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600',
        publicId: 'travel_mug_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        publicId: 'travel_mug_image_1',
        alt: 'Travel Mug',
      },
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600',
        publicId: 'travel_mug_image_2',
        alt: 'Travel Mug Back',
      },
    ],
    stock: 150,
    isActive: true,
    isFeatured: false,
    specifications: {
      material: 'Stainless Steel',
      capacity: '16 oz',
      careInstructions: 'Hand wash recommended',
    },
    tags: ['mug', 'travel', 'insulated', 'stainless-steel'],
  },

  // Phone Cases
  {
    name: 'iPhone Case',
    slug: 'iphone-case',
    description: 'Durable protective case for iPhone with perfect cutouts and easy access to all ports.',
    basePrice: 499,
    category: null,
    sizes: [
      { name: 'iPhone 12/13/14', priceModifier: 0, isAvailable: true },
    ],
    colors: [
      { name: 'Clear', hexCode: '#FFFFFF', isAvailable: true },
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
      { name: 'Navy', hexCode: '#000080', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
        publicId: 'iphone_case_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600',
        publicId: 'iphone_case_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600',
        publicId: 'iphone_case_image_1',
        alt: 'iPhone Case',
      },
      {
        url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600',
        publicId: 'iphone_case_image_2',
        alt: 'iPhone Case Back',
      },
    ],
    stock: 300,
    isActive: true,
    isFeatured: true,
    specifications: {
      material: 'Polycarbonate',
      compatibility: 'iPhone 12/13/14 series',
      careInstructions: 'Wipe with soft cloth',
    },
    tags: ['phone-case', 'iphone', 'protective', 'durable'],
  },

  // Tote Bags
  {
    name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    description: 'Eco-friendly canvas tote bag perfect for shopping, beach trips, or everyday use.',
    basePrice: 399,
    category: null,
    sizes: [
      { name: 'Standard', priceModifier: 0, isAvailable: true },
    ],
    colors: [
      { name: 'Natural', hexCode: '#F5F5DC', isAvailable: true },
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'Navy', hexCode: '#000080', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        publicId: 'tote_bag_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
        publicId: 'tote_bag_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        publicId: 'tote_bag_image_1',
        alt: 'Canvas Tote Bag',
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
        publicId: 'tote_bag_image_2',
        alt: 'Canvas Tote Bag Back',
      },
    ],
    stock: 120,
    isActive: true,
    isFeatured: false,
    specifications: {
      material: 'Canvas',
      dimensions: '15" x 15"',
      careInstructions: 'Spot clean only',
    },
    tags: ['tote-bag', 'canvas', 'eco-friendly', 'shopping'],
  },

  // Posters
  {
    name: 'Art Print Poster',
    slug: 'art-print-poster',
    description: 'High-quality art print poster perfect for home decor. Printed on premium paper.',
    basePrice: 299,
    category: null,
    sizes: [
      { name: '24" x 36"', priceModifier: 0, isAvailable: true },
    ],
    colors: [
      { name: 'Various', hexCode: '#000000', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
        publicId: 'poster_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
        publicId: 'poster_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
        publicId: 'poster_image_1',
        alt: 'Art Print Poster',
      },
      {
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
        publicId: 'poster_image_2',
        alt: 'Art Print Poster Back',
      },
    ],
    stock: 500,
    isActive: true,
    isFeatured: false,
    specifications: {
      material: 'Premium Art Paper',
      dimensions: '24" x 36"',
      careInstructions: 'Frame under glass',
    },
    tags: ['poster', 'art-print', 'home-decor', 'wall-art'],
  },

  // Hoodies
  {
    name: 'Classic Hoodie',
    slug: 'classic-hoodie',
    description: 'Comfortable cotton blend hoodie perfect for casual wear and custom printing.',
    basePrice: 1299,
    category: null,
    sizes: [
      { name: 'S', priceModifier: 0, isAvailable: true },
      { name: 'M', priceModifier: 0, isAvailable: true },
      { name: 'L', priceModifier: 0, isAvailable: true },
      { name: 'XL', priceModifier: 100, isAvailable: true },
      { name: 'XXL', priceModifier: 200, isAvailable: true },
    ],
    colors: [
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'Gray', hexCode: '#808080', isAvailable: true },
      { name: 'Navy', hexCode: '#000080', isAvailable: true },
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
        publicId: 'hoodie_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        publicId: 'hoodie_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
        publicId: 'hoodie_image_1',
        alt: 'Classic Hoodie',
      },
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        publicId: 'hoodie_image_2',
        alt: 'Classic Hoodie Back',
      },
    ],
    stock: 80,
    isActive: true,
    isFeatured: true,
    specifications: {
      material: 'Cotton Blend',
      careInstructions: 'Machine wash cold, tumble dry low',
    },
    tags: ['hoodie', 'sweatshirt', 'casual', 'comfortable'],
  },

  // Caps
  {
    name: 'Baseball Cap',
    slug: 'baseball-cap',
    description: 'Classic baseball cap with adjustable strap. Perfect for outdoor activities.',
    basePrice: 449,
    category: null,
    sizes: [
      { name: 'One Size', priceModifier: 0, isAvailable: true },
    ],
    colors: [
      { name: 'Black', hexCode: '#000000', isAvailable: true },
      { name: 'Navy', hexCode: '#000080', isAvailable: true },
      { name: 'White', hexCode: '#FFFFFF', isAvailable: true },
      { name: 'Gray', hexCode: '#808080', isAvailable: true },
    ],
    mockups: {
      front: {
        url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
        publicId: 'cap_front_mockup',
      },
      back: {
        url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600',
        publicId: 'cap_back_mockup',
      },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
        publicId: 'cap_image_1',
        alt: 'Baseball Cap',
      },
      {
        url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600',
        publicId: 'cap_image_2',
        alt: 'Baseball Cap Back',
      },
    ],
    stock: 150,
    isActive: true,
    isFeatured: false,
    specifications: {
      material: 'Cotton',
      adjustable: 'Yes',
      careInstructions: 'Spot clean only',
    },
    tags: ['cap', 'baseball-cap', 'hat', 'adjustable'],
  },
];

export default products;
