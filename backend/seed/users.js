import User from '../src/models/User.model.js';
import bcrypt from 'bcryptjs';

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@teenprint.com',
    password: null, // Will be hashed
    role: 'admin',
    phone: '+1234567890',
    isVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: null, // Will be hashed
    role: 'user',
    phone: '+1987654321',
    isVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: null, // Will be hashed
    role: 'user',
    phone: '+1122334455',
    isVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    password: null, // Will be hashed
    role: 'user',
    phone: '+1555666777',
    isVerified: false,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    password: null, // Will be hashed
    role: 'user',
    phone: '+1444333222',
    isVerified: true,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

export default users;
