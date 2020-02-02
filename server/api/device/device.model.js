import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { registerEvents } from './device.events';

var DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    info: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

DeviceSchema.plugin(timestamps);
registerEvents(DeviceSchema);
export default mongoose.model('Device', DeviceSchema);
