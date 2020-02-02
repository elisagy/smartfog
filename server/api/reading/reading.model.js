import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { registerEvents } from './reading.events';

var ReadingSchema = new mongoose.Schema({
    humidity: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

ReadingSchema.plugin(timestamps);
registerEvents(ReadingSchema);
export default mongoose.model('Reading', ReadingSchema);
