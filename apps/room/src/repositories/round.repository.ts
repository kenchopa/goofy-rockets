/* eslint-disable class-methods-use-this */
import { UpdateQuery } from '@wgp/mongodb';

import { Room, RoomModel } from '../models/room.model';

export class RoomRepository {
  // Create a new room
  async createRoom(
    gameId: string,
    roomId: string,
    users: string[],
  ): Promise<Room> {
    const newRoom = new RoomModel({ gameId, roomId, users });
    return newRoom.save();
  }

  // Get a room by roomId
  async getRoomById(roomId: string): Promise<Room | null> {
    return RoomModel.findOne({ roomId }).exec();
  }

  async getRoomsByGameId(gameId: string): Promise<Room[]> {
    return RoomModel.find({ gameId }).exec();
  }

  // Get all rooms
  async getAllRooms(): Promise<Room[]> {
    return RoomModel.find().exec();
  }

  // Update a room by roomId
  async updateRoomById(
    roomId: string,
    update: UpdateQuery<Room>,
  ): Promise<Room | null> {
    return RoomModel.findOneAndUpdate({ roomId }, update, {
      new: true,
    }).exec();
  }

  // Delete a room by roomId
  async deleteRoomById(roomId: string): Promise<Room | null> {
    return RoomModel.findOneAndDelete({ roomId }).exec();
  }

  // Add a user to a room
  async addUserToRoom(roomId: string, userId: string): Promise<Room | null> {
    return RoomModel.findOneAndUpdate(
      { roomId },
      { $addToSet: { users: userId } }, // Add user if not already in the room
      { new: true },
    ).exec();
  }

  // Remove a user from a room
  async removeUserFromRoom(
    roomId: string,
    userId: string,
  ): Promise<Room | null> {
    return RoomModel.findOneAndUpdate(
      { roomId },
      { $pull: { users: userId } },
      { new: true },
    ).exec();
  }
}

const roundRepository = new RoomRepository();

export default roundRepository;
