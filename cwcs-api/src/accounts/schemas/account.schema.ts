import * as mongoose from 'mongoose'
import { RoleStatus } from '../enums/role-status.enum'

export const AccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, min: 8, max: 15 },
  password: { type: String, required: true, min: 8, max: 15 },
  salt: { type: String, required: true, min: 8, max: 15 },
  role: { type: String, required: true, enum: Object.keys(RoleStatus).map(k => RoleStatus[k]) },
  firstName: { type: String, required: true, min: 1, max: 20 },
  lastName: { type: String, required: true, min: 1, max: 20 },
  accessNotifications: { type: Boolean, required: false, default: false },
  accessUsersManagement: { type: Boolean, required: false, default: false },
  accessRoomsManagement: { type: Boolean, required: false, default: false },
  accessWorkstationsManagement: { type: Boolean, required: false, default: false },
  details: { type: Array, required: false, default: [] }
})