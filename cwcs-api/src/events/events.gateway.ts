import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { EventsService } from './events.service'
import { RoleStatus } from '../accounts/enums/role-status.enum'

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly eventsService: EventsService) { }

  @WebSocketServer() server

  afterInit(socket) {
    console.log('SOCKET SERVER STARTED')
  }

  async handleConnection(socket) {
    console.log('SOCKET CONECTED', socket.id)
  }

  async handleDisconnect(socket) {
    console.log('SOCKET DISCONETED', socket.id)
    const account = this.eventsService.getActiveAccountsBySockettId(socket.id)
    await this.eventsService.removeActiveAccount(socket.id)
    if(account.length > 0) {
      socket.broadcast.emit('ROOMS', await this.eventsService.getActiveRooms())
      socket.broadcast.emit('WORKSTATIONS', await this.eventsService.getActiveWorkstationsFromRoom(account[0].roomName))
      if(account[0].role == RoleStatus.USER) socket.broadcast.emit('USERS', await this.eventsService.getActiveAccountsByRole(RoleStatus.USER))
      if(account[0].role == RoleStatus.EMPLOYEE) socket.broadcast.emit('EMPLOYEES', await this.eventsService.getActiveAccountsByRole(RoleStatus.EMPLOYEE))
    }
  }

  @SubscribeMessage('LOGIN')
  async login(socket, data): Promise<Boolean> {
    data = { socketId: socket.id, ...data }

    if(data.role === RoleStatus.ADMIN || (data.role === RoleStatus.EMPLOYEE && (!data.roomName || !data.workstationName))) {
      return socket.emit('LOGIN', 'SUCCESS')
    }

    if(data.accountId && data.role && data.addressMac && data.roomName && data.workstationName && data.firstName && data.lastName) {
      const login = await this.eventsService.addActiveAccount(data)
      if(login) { 
        socket.emit('LOGIN', 'SUCCESS')
        socket.broadcast.emit('ROOMS', await this.eventsService.getActiveRooms())
        socket.broadcast.emit('WORKSTATIONS', await this.eventsService.getActiveWorkstationsFromRoom(data.roomName))
        if(data.role == RoleStatus.USER) socket.broadcast.emit('USERS', await this.eventsService.getActiveAccountsByRole(RoleStatus.USER))
        if(data.role == RoleStatus.EMPLOYEE) socket.broadcast.emit('EMPLOYEES', await this.eventsService.getActiveAccountsByRole(RoleStatus.EMPLOYEE))
      } else {
        socket.emit('LOGIN', 'ERROR')
      }
    }
  }

  @SubscribeMessage('LOGOUT')
  async logout(socket, data) {
    await this.eventsService.removeActiveAccount(socket.id)
    socket.broadcast.emit('ROOMS', await this.eventsService.getActiveRooms())
    socket.broadcast.emit('WORKSTATIONS', await this.eventsService.getActiveWorkstationsFromRoom(data.roomName))
    if(data.role == RoleStatus.USER) socket.broadcast.emit('USERS', await this.eventsService.getActiveAccountsByRole(RoleStatus.USER))
    if(data.role == RoleStatus.EMPLOYEE) socket.broadcast.emit('EMPLOYEES', await this.eventsService.getActiveAccountsByRole(RoleStatus.EMPLOYEE))
  }

  @SubscribeMessage('USERS')
  async getUsers(socket, data) {
    return socket.emit('USERS', await this.eventsService.getActiveAccountsByRole(RoleStatus.USER))
  }

  @SubscribeMessage('EMPLOYEES')
  async getEmployees(socket, data) {
    return socket.emit('EMPLOYEES', await this.eventsService.getActiveAccountsByRole(RoleStatus.EMPLOYEE))
  }

  @SubscribeMessage('ROOMS')
  async getActiveRooms(socket, data) {
    return socket.emit('ROOMS', await this.eventsService.getActiveRooms())
  }

  @SubscribeMessage('WORKSTATIONS')
  async getActiveWorkstationsFromRoom(socket, data) {
    return socket.emit('WORKSTATIONS', await this.eventsService.getActiveWorkstationsFromRoom(data.roomName))
  }

  @SubscribeMessage('NOTIFICATIONS')
  async newNotifications(socket, data) {
    return socket.broadcast.emit('NOTIFICATIONS')
  }

}