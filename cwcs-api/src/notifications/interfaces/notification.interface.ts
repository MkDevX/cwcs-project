import { NotificationPriority } from '../enums/notifitcation-priority.enum'

export interface Notification {
  id?: string
  userId?: string
  roomId?: string
  workstationId?: string
  dateNotification?: Date
  dateFaultNotice: Date
  notificationDescription: string
  notificationStatus?: boolean
  notificationPriority?: NotificationPriority
  categoryId?: string
}
