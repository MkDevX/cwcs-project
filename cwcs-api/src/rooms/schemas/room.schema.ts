import * as mongoose from 'mongoose'

export const RoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true, min: 1, max: 20 }
})