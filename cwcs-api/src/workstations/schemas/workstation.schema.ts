import * as mongoose from 'mongoose'

export const WorkstationSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.ObjectId, required: true },
  workstationName: { type: String, required: true, unique: true, min: 1, max: 20 },
  addressMac: { type: String, required: true, unique: true, min: 17, max: 17 }
})