import * as mongoose from 'mongoose'
import { NotificationPriority } from '../enums/notifitcation-priority.enum'


export const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  roomId: { type: mongoose.Schema.ObjectId, required: true },
  workstationId: { type: mongoose.Schema.ObjectId, required: true },
  dateNotification: { type: Date, required: false },
  dateFaultNotice: { type: Date, required: true },
  notificationDescription: { type: String, required: true , min: 1, max: 1000 },
  notificationStatus: { type: Boolean, required: false, default: true },
  notificationPriority: { type: String, required: true, enum: Object.keys(NotificationPriority).map(k => NotificationPriority[k]), default: NotificationPriority.LOW },
  categoryId: { type: mongoose.Schema.ObjectId, required: false, default: null },
})