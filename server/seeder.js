import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Gig from './models/Gig.js';
import Bid from './models/Bid.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Bid.deleteMany();
        await Gig.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const users = await User.insertMany([
            { name: 'Alice Client', email: 'alice@example.com', password },
            { name: 'Bob Client', email: 'bob@example.com', password },
            { name: 'Charlie Freelancer', email: 'charlie@example.com', password },
            { name: 'Dave Freelancer', email: 'dave@example.com', password },
            { name: 'Eve Freelancer', email: 'eve@example.com', password },
        ]);

        const clients = [users[0], users[1]];
        const freelancers = [users[2], users[3], users[4]];

        console.log('Users Created...');

        // Generate extensive gig data
        const titles = [
            "React Native App for E-commerce", "Fix Node.js Backend 500 Errors", "Redesign Corporate Website (Dark Mode)",
            "SEO Content for Tech Blog", "Python Script for Data Scraping", "Custom Shopify Theme Development",
            "Logo Design for Fintech Startup", "AI Model Integration for Chatbot", "AWS Infrastructure Setup",
            "Figma Prototyping for SaaS Dashboard", "Smart Contract Auditing", "React Dashboard with Recharts",
            "Unity 3D Game Level Design", "Video Editing for YouTube Channel", "Voiceover for explainer video",
            "Translate 5000 words EN to ES", "Social Media Management (1 Month)", "Wordpress Plugin Customization",
            "Mobile App UI/UX Review", "Automated QA Testing Suite"
        ];

        const descriptions = [
            "Looking for an expert to handle this quickly. Must have portfolio.",
            "Long term opportunity for the right candidate. We value communication.",
            "Need this done by end of week. Strict deadline.",
            "High quality work required. Budget is flexible for top talent.",
            "Simple task but needs attention to detail."
        ];

        const gigData = titles.map((title, index) => ({
            title,
            description: descriptions[index % descriptions.length] + " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
            budget: Math.floor(Math.random() * 4500) + 100, // Random budget 100-4600
            ownerId: clients[index % clients.length]._id,
            status: index > 15 ? 'assigned' : 'open' // Last few are assigned
        }));

        const createdGigs = await Gig.insertMany(gigData);
        console.log('Gigs Created...');

        // Create Bids
        const bids = [];
        createdGigs.forEach((gig) => {
            // Randomly bid on gigs
            if (Math.random() > 0.3) {
                const bidder = freelancers[Math.floor(Math.random() * freelancers.length)];
                bids.push({
                    gigId: gig._id,
                    freelancerId: bidder._id,
                    message: "I am perfect for this job. I have the skills you need.",
                    price: gig.budget - 50,
                    status: gig.status === 'assigned' ? 'rejected' : 'pending' // Just logical placeholder
                });
            }
        });

        await Bid.insertMany(bids);
        console.log('Bids Created...');

        console.log(`===========================================
        DATA SEEDED SUCCESSFULLY!
        ===========================================`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Bid.deleteMany();
        await Gig.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
