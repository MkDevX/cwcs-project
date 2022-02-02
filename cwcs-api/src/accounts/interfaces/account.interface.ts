import { RoleStatus } from '../enums/role-status.enum'

export interface Account {
  id?: string
  username: string
  password?: string
  salt?: string
  role?: RoleStatus
  firstName: string
  lastName: string
  accessUsersManagement?: boolean
  accessNotifications?: boolean
  accessRoomsManagement?: boolean
  accessWorkstationsManagement?: boolean
}
