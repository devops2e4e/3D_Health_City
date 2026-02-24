import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Facility } from './src/models/Facility';
import { User } from './src/models/User';
import { Alert } from './src/models/Alert';
import bcrypt from 'bcrypt';

dotenv.config();

const sampleFacilities = [
    {
        name: 'Lagos General Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.3792, 6.5244] },
        capacity: 500,
        currentLoad: 425,
        services: ['Emergency', 'ICU', 'Surgery', 'Maternity', 'Pediatrics'],
    },
    {
        name: 'Ikeja Health Center',
        type: 'Health Center',
        location: { type: 'Point', coordinates: [3.3567, 6.6018] },
        capacity: 150,
        currentLoad: 98,
        services: ['General Practice', 'Vaccination', 'Maternity'],
    },
    {
        name: 'Victoria Island Clinic',
        type: 'Clinic',
        location: { type: 'Point', coordinates: [3.4219, 6.4281] },
        capacity: 80,
        currentLoad: 52,
        services: ['General Practice', 'Laboratory'],
    },
    {
        name: 'Surulere Medical Center',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.3611, 6.4969] },
        capacity: 300,
        currentLoad: 287,
        services: ['Emergency', 'Surgery', 'Radiology'],
    },
    {
        name: 'Yaba Community Clinic',
        type: 'Clinic',
        location: { type: 'Point', coordinates: [3.3711, 6.5156] },
        capacity: 60,
        currentLoad: 45,
        services: ['General Practice', 'Vaccination'],
    },
    {
        name: 'Lekki Peninsula Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.4742, 6.4474] },
        capacity: 400,
        currentLoad: 198,
        services: ['Emergency', 'ICU', 'Surgery', 'Cardiology'],
    },
    {
        name: 'Apapa Health Center',
        type: 'Health Center',
        location: { type: 'Point', coordinates: [3.3594, 6.4500] },
        capacity: 120,
        currentLoad: 115,
        services: ['General Practice', 'Maternity', 'Pediatrics'],
    },
    {
        name: 'Ikoyi Medical Clinic',
        type: 'Clinic',
        location: { type: 'Point', coordinates: [3.4333, 6.4550] },
        capacity: 100,
        currentLoad: 67,
        services: ['General Practice', 'Laboratory', 'Radiology'],
    },
    {
        name: 'Mushin General Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.3444, 6.5292] },
        capacity: 350,
        currentLoad: 342,
        services: ['Emergency', 'Surgery', 'Maternity', 'Pediatrics'],
    },
    {
        name: 'Ajah Health Center',
        type: 'Health Center',
        location: { type: 'Point', coordinates: [3.5667, 6.4667] },
        capacity: 180,
        currentLoad: 92,
        services: ['General Practice', 'Vaccination', 'Maternity'],
    },
    {
        name: 'Maryland Specialist Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.3697, 6.5783] },
        capacity: 450,
        currentLoad: 456,
        services: ['Emergency', 'ICU', 'Surgery', 'Oncology', 'Cardiology'],
    },
    {
        name: 'Festac Town Clinic',
        type: 'Clinic',
        location: { type: 'Point', coordinates: [3.2806, 6.4644] },
        capacity: 90,
        currentLoad: 71,
        services: ['General Practice', 'Laboratory'],
    },
    {
        name: 'Ikorodu General Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.5042, 6.6194] },
        capacity: 450,
        currentLoad: 432,
        services: ['Emergency', 'Surgery', 'Maternity', 'Pediatrics'],
    },
    {
        name: 'Epe Health Center',
        type: 'Health Center',
        location: { type: 'Point', coordinates: [3.9833, 6.5833] },
        capacity: 120,
        currentLoad: 118,
        services: ['General Practice', 'Vaccination', 'Maternity'],
    },
    {
        name: 'Badagry Medical Center',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [2.8833, 6.4167] },
        capacity: 250,
        currentLoad: 185,
        services: ['Emergency', 'Surgery', 'Radiology'],
    },
    {
        name: 'Gbagada Specialist Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.3889, 6.5583] },
        capacity: 380,
        currentLoad: 375,
        services: ['Emergency', 'ICU', 'Surgery', 'Cardiology'],
    },
    {
        name: 'Alimosho General Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.2500, 6.6000] },
        capacity: 400,
        currentLoad: 395,
        services: ['Emergency', 'Surgery', 'Maternity'],
    },
    {
        name: 'Agege Health Center',
        type: 'Health Center',
        location: { type: 'Point', coordinates: [3.3167, 6.6167] },
        capacity: 150,
        currentLoad: 142,
        services: ['General Practice', 'Vaccination'],
    },
    {
        name: 'Ojo Medical Clinic',
        type: 'Clinic',
        location: { type: 'Point', coordinates: [3.1833, 6.4667] },
        capacity: 80,
        currentLoad: 75,
        services: ['General Practice', 'Laboratory'],
    },
    {
        name: 'Isolo General Hospital',
        type: 'Hospital',
        location: { type: 'Point', coordinates: [3.3167, 6.5333] },
        capacity: 320,
        currentLoad: 305,
        services: ['Emergency', 'Surgery', 'Maternity'],
    },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsecity';
        await mongoose.connect(uri, { dbName: 'pulsecity' });

        // Obfuscate URI for logging
        const obfuscatedUri = uri.replace(/\/\/.*?:.*?@/, '//****:****@');
        console.log(`✅ Connected to MongoDB: ${obfuscatedUri}`);

        // Clear existing data
        await Facility.deleteMany({});
        await User.deleteMany({});
        await Alert.deleteMany({});
        console.log('🗑️  Cleared existing data (Facilities, Users, and Alerts)');

        // Create admin user
        const hashedPassword = await bcrypt.hash('Admin123', 12);
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@pulsecity.gov',
            password: hashedPassword,
            role: 'Admin',
            preferences: {
                theme: 'light',
                defaultView: '3d',
                alertThresholds: {
                    overcapacity: 85,
                    underservedRadius: 5,
                    critical: 95,
                },
            },
        });
        console.log('👤 Created admin user: admin@pulsecity.gov / Admin123');

        // Create facilities
        const facilities = await Facility.insertMany(sampleFacilities);
        console.log(`🏥 Created ${facilities.length} facilities`);

        // Generate alerts based on seed data
        for (const facility of facilities) {
            const loadPercentage = (facility.currentLoad / facility.capacity) * 100;

            if (loadPercentage >= 95) {
                await Alert.create({
                    facilityId: facility._id,
                    type: 'critical',
                    message: `${facility.name} is at CRITICAL capacity (${Math.round(loadPercentage)}%)`,
                    severity: 'critical',
                    metadata: { loadPercentage: Math.round(loadPercentage) }
                });
            } else if (loadPercentage >= 85) {
                await Alert.create({
                    facilityId: facility._id,
                    type: 'overcapacity',
                    message: `${facility.name} is at ${Math.round(loadPercentage)}% capacity`,
                    severity: 'high',
                    metadata: { loadPercentage: Math.round(loadPercentage) }
                });
            }
        }
        console.log('🔔 Generated initial system alerts');

        // Display statistics
        const stats = {
            total: facilities.length,
            overcapacity: facilities.filter(f => (f.currentLoad / f.capacity) * 100 > 85).length,
            avgLoad: Math.round(
                facilities.reduce((sum, f) => sum + (f.currentLoad / f.capacity) * 100, 0) / facilities.length
            ),
        };

        console.log('\n📊 Database Statistics:');
        console.log(`   Total Facilities: ${stats.total}`);
        console.log(`   Overcapacity: ${stats.overcapacity}`);
        console.log(`   Average Load: ${stats.avgLoad}%`);
        console.log('\n✨ Seed data created successfully!');
        console.log('\n🚀 You can now login with:');
        console.log('   Email: admin@pulsecity.gov');
        console.log('   Password: Admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
