import mongoose from 'mongoose';
import {registerEvents} from './reading.events';

var ReadingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ReadingSchema);
export default mongoose.model('Reading', ReadingSchema);
