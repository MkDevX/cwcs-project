import { RoleStatus } from '../enums/role-status.enum';

export interface JwtPayload {
  id: string,
  role: RoleStatus
  firstName: string
  lastName: string
  accessNotifications: boolean 
  accessUsersManagement: boolean 
  accessRoomsManagement: boolean
  accessWorkstationsManagement: boolean
  roomId: string
  roomName: string
  workstationId: string
  workstationName: string
  addressMac: string
}