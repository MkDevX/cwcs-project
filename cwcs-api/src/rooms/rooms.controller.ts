import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Delete, Put } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { RoleStatus } from '../accounts/enums/role-status.enum'
import { Roles } from '../accounts/decorators/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../accounts/guards/roles.guard'
import { RoomDto } from './dto/room.dto'
import { Room } from './interfaces/room.interface'
import { WorkstationsService } from '../workstations/workstations.service'

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService, private readonly workstationsService: WorkstationsService) { }

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getRooms(): Promise<Room[]> {
    return await this.roomsService.getRooms()
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async addRoom(@Body() roomDto: RoomDto) {
    return await this.roomsService.addRoom(roomDto)
  }

  @Put()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editRoom(@Body() roomDto: RoomDto) {
    return await this.roomsService.editRoom(roomDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async deleteRoom(@Param('id') id: string) {
    await this.workstationsService.deleteWorkstationsFromRoom(id)
    return await this.roomsService.deleteRoom(id)
  }
}
