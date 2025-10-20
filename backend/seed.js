import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';

// Import seed data
import categoriesData from './seed/categories.js';
import productsData from './seed/products.js';
import usersData from './seed/users.js';
import couponsData from './seed/coupons.js';

// Import models
import Category from './src/models/Category.model.js';
import Product from './src/models/Product.model.js';
import User from './src/models/User.model.js';
import Coupon from './src/models/Coupon.model.js';
import ContactInfo from './src/models/ContactInfo.model.js';

import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Coupon.deleteMany({});
    await ContactInfo.deleteMany({});

    // Seed categories
    console.log('Seeding categories...');
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} categories`);

    // Create category map for products
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Update products with category references
    const productsWithCategories = productsData.map(product => {
      const categorySlug = product.name.toLowerCase().includes('t-shirt') ? 't-shirts' :
                          product.name.toLowerCase().includes('mug') ? 'mugs' :
                          product.name.toLowerCase().includes('phone') ? 'phone-cases' :
                          product.name.toLowerCase().includes('tote') ? 'tote-bags' :
                          product.name.toLowerCase().includes('poster') ? 'posters' :
                          product.name.toLowerCase().includes('hoodie') ? 'hoodies' :
                          product.name.toLowerCase().includes('cap') ? 'caps' : 't-shirts';

      return {
        ...product,
        category: categoryMap[categorySlug] || categories[0]._id,
      };
    });

    // Seed products
    console.log('Seeding products...');
    const products = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${products.length} products`);

    // Hash passwords and seed users
    console.log('Seeding users...');
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash('password123', 12),
      }))
    );
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${users.length} users`);

    // Update coupons with category references
    const couponsWithCategories = couponsData.map(coupon => {
      if (coupon.code === 'TEES30') {
        coupon.applicableCategories = [categoryMap['t-shirts']];
      } else if (coupon.code === 'MUGS50') {
        coupon.applicableCategories = [categoryMap['mugs']];
      }
      return coupon;
    });

    // Seed coupons
    console.log('Seeding coupons...');
    const coupons = await Coupon.insertMany(couponsWithCategories);
    console.log(`✅ Created ${coupons.length} coupons`);

    // Seed contact info
    console.log('Seeding contact information...');
    const contactInfoData = {
      address: {
        street: '123 Print Street, Design Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      phoneNumbers: [
        { number: '+91 98765 43210', label: 'Support' },
        { number: '+91 98765 43211', label: 'Orders' }
      ],
      emailAddresses: [
        { email: 'support@teenprintweb.com', label: 'Support' },
        { email: 'orders@teenprintweb.com', label: 'Orders' }
      ],
      businessHours: [
        { day: 'monday', hours: '9:00 AM - 6:00 PM', isOpen: true },
        { day: 'tuesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
        { day: 'wednesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
        { day: 'thursday', hours: '9:00 AM - 6:00 PM', isOpen: true },
        { day: 'friday', hours: '9:00 AM - 6:00 PM', isOpen: true },
        { day: 'saturday', hours: '10:00 AM - 4:00 PM', isOpen: true },
        { day: 'sunday', hours: 'Closed', isOpen: false }
      ]
    };
    const contactInfo = await ContactInfo.create(contactInfoData);
    console.log('✅ Created contact information');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Seed Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Coupons: ${coupons.length}`);
    console.log(`   Contact Info: 1`);

    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@teenprint.com');
    console.log('   Password: password123');

    console.log('\n👥 Sample User Credentials:');
    users.slice(1).forEach((user, index) => {
      console.log(`   ${user.firstName} ${user.lastName}: ${user.email} / password123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
