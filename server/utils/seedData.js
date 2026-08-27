import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Match from '../models/Match.js';
import Claim from '../models/Claim.js';
import Notification from '../models/Notification.js';
import { runMatchEngine } from '../services/matchEngine.js';

export const seedDatabase = async () => {
  try {
    // 1. Clear database collections
    await User.deleteMany({});
    await LostItem.deleteMany({});
    await FoundItem.deleteMany({});
    await Match.deleteMany({});
    await Claim.deleteMany({});
    await Notification.deleteMany({});

    console.log('Database cleared for seeding...');

    // 2. Create Demo Users
    const userA = new User({
      name: 'Chaitanya Aripirala',
      email: 'chaitanya@lostlink.com',
      password: 'password123',
      studentId: '2026CS101',
      college: 'Campus School of Engineering',
      phone: '9876543210',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      role: 'user'
    });

    const userB = new User({
      name: 'John Doe',
      email: 'john@lostlink.com',
      password: 'password123',
      studentId: '2026EC202',
      college: 'Campus School of Engineering',
      phone: '8765432109',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'user'
    });

    const adminUser = new User({
      name: 'LostLink Admin',
      email: 'admin@lostlink.com',
      password: 'adminpassword',
      studentId: 'ADMIN001',
      college: 'LostLink HQ',
      phone: '9999999999',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'admin'
    });

    await userA.save();
    await userB.save();
    await adminUser.save();

    console.log('Users seeded successfully');

    // 3. Create Lost Items (posted by User A / Chaitanya)
    const lostItems = [
      {
        userId: userA._id,
        title: 'Black HP Laptop Charger',
        category: 'Electronics',
        description: 'Black HP laptop charger lost near Central Library. It has a black sticky tape around the brick wire.',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500',
        color: 'Black',
        brand: 'HP',
        location: 'Central Library',
        dateLost: new Date('2026-08-25'),
        timeLost: '14:30',
        uniqueDetails: 'It has a small scratch near the USB-C pin and black electric tape on the wire.',
        verificationQuestion: 'What color tape is wrapped around the charger cable?',
        verificationAnswer: 'black',
        status: 'active'
      },
      {
        userId: userA._id,
        title: 'Blue Samsung Phone',
        category: 'Electronics',
        description: 'Samsung smartphone with blue back panel lost in the Student Cafeteria. Screen is cracked at the bottom.',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
        color: 'Blue',
        brand: 'Samsung',
        location: 'Student Cafeteria',
        dateLost: new Date('2026-08-24'),
        timeLost: '13:15',
        uniqueDetails: 'Cracked screen at bottom-right corner, transparent silicon cover.',
        verificationQuestion: 'What is unique about the screen and case?',
        verificationAnswer: 'cracked screen and transparent cover',
        status: 'active'
      },
      {
        userId: userA._id,
        title: 'Brown Leather Wallet',
        category: 'Wallet',
        description: 'Brown leather bi-fold wallet lost, contains ID card and some cash.',
        image: 'https://images.unsplash.com/photo-1627124765135-56f33a7f8f90?w=500',
        color: 'Brown',
        brand: 'Tommy Hilfiger',
        location: 'Main Auditorium',
        dateLost: new Date('2026-08-23'),
        timeLost: '18:00',
        uniqueDetails: 'Has a small metallic logo of Tommy Hilfiger on the bottom corner.',
        verificationQuestion: 'What brand logo is on the wallet?',
        verificationAnswer: 'Tommy Hilfiger',
        status: 'active'
      },
      {
        userId: userA._id,
        title: 'Student ID Card',
        category: 'Documents',
        description: 'Official student ID card for Chaitanya Aripirala.',
        image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500',
        color: 'White',
        brand: 'Campus Card',
        location: 'Block A Parking',
        dateLost: new Date('2026-08-26'),
        timeLost: '09:00',
        uniqueDetails: 'Name: Chaitanya Aripirala, Roll: 2026CS101.',
        verificationQuestion: 'What is the student Roll number on the ID card?',
        verificationAnswer: '2026CS101',
        status: 'active'
      },
      {
        userId: userA._id,
        title: 'AirPods Case',
        category: 'Accessories',
        description: 'White Apple AirPods charging case lost near basketball court.',
        image: 'https://images.unsplash.com/photo-1588449668338-d15176d900c9?w=500',
        color: 'White',
        brand: 'Apple',
        location: 'Basketball Court',
        dateLost: new Date('2026-08-25'),
        timeLost: '17:15',
        uniqueDetails: 'The case has a red Spigen protective cover.',
        verificationQuestion: 'What color and brand cover does the case have?',
        verificationAnswer: 'red Spigen cover',
        status: 'active'
      }
    ];

    const seededLost = await LostItem.insertMany(lostItems);
    console.log('Lost items seeded');

    // 4. Create Found Items (posted by User B / John Doe)
    const foundItems = [
      {
        userId: userB._id,
        title: 'Black HP 65W Charger',
        category: 'Electronics',
        description: 'Found black HP 65W laptop charger near Central Library. Seems like it has some black tape on the wire.',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500',
        color: 'Black',
        brand: 'HP',
        location: 'Central Library',
        dateFound: new Date('2026-08-25'),
        timeFound: '16:00',
        uniqueDetails: 'Black tape on wire, small scratch near the connector.',
        verificationQuestion: 'What is wrapped around the wire?',
        verificationAnswer: 'black tape',
        status: 'active'
      },
      {
        userId: userB._id,
        title: 'Blue Samsung Smartphone',
        category: 'Electronics',
        description: 'Found a blue Samsung phone in Student Cafeteria. Screen has a crack at the bottom side.',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
        color: 'Blue',
        brand: 'Samsung',
        location: 'Student Cafeteria',
        dateFound: new Date('2026-08-25'),
        timeFound: '12:00',
        uniqueDetails: 'Cracked screen at bottom right corner, clear transparent cover.',
        verificationQuestion: 'What cover does it have?',
        verificationAnswer: 'transparent silicon cover',
        status: 'active'
      },
      {
        userId: userB._id,
        title: 'Brown Wallet',
        category: 'Wallet',
        description: 'Found brown leather wallet in Auditorium. Checked inside, it has some cash and cards.',
        image: 'https://images.unsplash.com/photo-1627124765135-56f33a7f8f90?w=500',
        color: 'Brown',
        brand: 'Tommy Hilfiger',
        location: 'Main Auditorium',
        dateFound: new Date('2026-08-24'),
        timeFound: '10:00',
        uniqueDetails: 'Tommy Hilfiger metallic badge on bottom corner.',
        verificationQuestion: 'What is the brand name of the wallet?',
        verificationAnswer: 'Tommy Hilfiger',
        status: 'active'
      },
      {
        userId: userB._id,
        title: 'Student ID Card',
        category: 'Documents',
        description: 'Found student card belonging to a CS student.',
        image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500',
        color: 'White',
        brand: 'Campus Card',
        location: 'Block A Parking lot',
        dateFound: new Date('2026-08-26'),
        timeFound: '09:30',
        uniqueDetails: 'Name on card is Chaitanya.',
        verificationQuestion: 'What is the first name on the card?',
        verificationAnswer: 'Chaitanya',
        status: 'active'
      },
      {
        userId: userB._id,
        title: 'White Earbuds Case',
        category: 'Accessories',
        description: 'Found white charging case for wireless earbuds near sports complex.',
        image: 'https://images.unsplash.com/photo-1588449668338-d15176d900c9?w=500',
        color: 'White',
        brand: 'Apple',
        location: 'Basketball Court',
        dateFound: new Date('2026-08-25'),
        timeFound: '18:00',
        uniqueDetails: 'Red silicone case cover.',
        verificationQuestion: 'What is the color of the protective silicone cover?',
        verificationAnswer: 'red',
        status: 'active'
      },
      {
        userId: userA._id, // Seed one found item by User A to test the reverse flow
        title: 'Black HP College Backpack',
        category: 'Bags',
        description: 'Found black backpack with HP logo in Block C lab.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        color: 'Black',
        brand: 'HP',
        location: 'Block C Lab',
        dateFound: new Date('2026-08-25'),
        timeFound: '11:00',
        uniqueDetails: 'Has a blue water bottle in the side pocket.',
        verificationQuestion: 'What object is in the side pocket?',
        verificationAnswer: 'blue water bottle',
        status: 'active'
      }
    ];

    const seededFound = await FoundItem.insertMany(foundItems);
    console.log('Found items seeded');

    // 5. Run Match Engine to automatically create matches
    await runMatchEngine(LostItem, FoundItem, Match, Notification);
    console.log('Match Engine executed. Demo matches created!');

    return {
      success: true,
      message: 'Demo database seeded successfully.',
      users: {
        chaitanya: { email: 'chaitanya@lostlink.com', password: 'password123' },
        john: { email: 'john@lostlink.com', password: 'password123' },
        admin: { email: 'admin@lostlink.com', password: 'adminpassword' }
      }
    };
  } catch (error) {
    console.error('Seeding database error:', error);
    throw error;
  }
};
