import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

async function resetRiderCash() {
    try {
        if (!MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            return;
        }
        await mongoose.connect(MONGO_URI);
        
        // Define DeliveryBoy schema for mongoose
        const schema = new mongoose.Schema({
            name: String,
            phone: String,
            cashInHand: Number,
            cashCollected: Number
        }, { collection: 'deliveryboys', strict: false });
        
        const DeliveryBoy = mongoose.models.DeliveryBoy || mongoose.model('DeliveryBoy', schema);
        
        const rider = await DeliveryBoy.findOne({ phone: '7894561230' });
        if (!rider) {
            console.log('Rider with phone 7894561230 not found');
            return;
        }
        
        console.log('--- Current Rider Stats ---');
        console.log(`Name: ${rider.name}`);
        console.log(`Phone: ${rider.phone}`);
        console.log(`Cash In Hand: ${rider.cashInHand}`);
        console.log(`Cash Collected: ${rider.cashCollected}`);
        
        // Reset the cashInHand to 0
        rider.cashInHand = 0;
        rider.cashCollected = 0;
        
        await rider.save();
        console.log('\n--- Updated Rider Stats ---');
        console.log(`Cash In Hand: ${rider.cashInHand}`);
        console.log(`Cash Collected: ${rider.cashCollected}`);
        
        console.log('\nSuccessfully reset the cash in hand for Test Rider to 0!');
    } catch (error) {
        console.error('Error during reset:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetRiderCash();
