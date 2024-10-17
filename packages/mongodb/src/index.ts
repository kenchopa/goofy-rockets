export {
  connectMongoDB,
  disconnectMongoDB,
  mongoose,
  transformObject,
  transformObjects,
} from './database.connection';

// Export mongoose for external usage if needed
export { type UpdateQuery, Document, model, Schema } from 'mongoose';
