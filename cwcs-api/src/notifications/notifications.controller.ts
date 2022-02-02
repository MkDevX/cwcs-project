import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Delete, Put } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { RoleStatus } from '../accounts/enums/role-status.enum'
import { Roles } from '../accounts/decorators/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../accounts/guards/roles.guard'
import { NotificationDto } from './dto/notification.dto'
import { Notification } from './interfaces/notification.interface'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getNotifications(): Promise<Notification[]> {
    return await this.notificationsService.getNotifications()
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.USER, RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getNotificationsByUserId(@Param('userId') userId: string): Promise<Array<Object>> {
    return await this.notificationsService.getNotificationsByUserId(userId)
  }

  @Get(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.USER, RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getNotificationById(@Param('id') id: string): Promise<Array<Object>> {
    return await this.notificationsService.getNotificationById(id)
  }

  @Post('')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.USER)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async addNotification(@Body() notificationDto: NotificationDto) {
    return await this.notificationsService.addNotification(notificationDto)
  }

  @Put(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE, RoleStatus.USER)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editNotification(@Param('id') id: string, @Body() notificationDto: NotificationDto) {
    return await this.notificationsService.editNotification(id, notificationDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE, RoleStatus.USER)
  async deleteNotification(@Param('id') id: string) {
    return await this.notificationsService.deleteNotification(id)
  }
}
