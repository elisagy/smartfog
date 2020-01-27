import mongoose from 'mongoose';
import {registerEvents} from './device.events';

var DeviceSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(DeviceSchema);
export default mongoose.model('Device', DeviceSchema);
