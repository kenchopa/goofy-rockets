import { Document, model, Schema } from '@wgp/mongodb';

export interface Room extends Document {
  gameId: string;
  roomId: string;
  users?: string[];
  createdAt: Date;
  updatedAt?: Date | null;
}

const roomSchema = new Schema<Room>(
  {
    gameId: { required: true, type: String },
    roomId: { required: true, type: String, unique: true },
    users: [{ required: true, type: String }],
  },
  {
    timestamps: true,
  },
);

export const RoomModel = model<Room>('Room', roomSchema);
