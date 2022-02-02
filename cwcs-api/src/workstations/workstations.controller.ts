import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Delete, Put } from '@nestjs/common'
import { WorkstationsService } from './workstations.service'
import { RoleStatus } from '../accounts/enums/role-status.enum'
import { Roles } from '../accounts/decorators/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../accounts/guards/roles.guard'
import { WorkstationDto } from './dto/workstation.dto'
import { Workstation } from './interfaces/workstation.interface'

@Controller('workstations')
export class WorkstationsController {
  constructor(private readonly workstationsService: WorkstationsService) { }

  @Get(':roomId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getWorkstationsFromRoom(@Param('roomId') roomId: string): Promise<Workstation[]> {
    return await this.workstationsService.getWorkstationsFromRoom(roomId)
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async addWorkstation(@Body() workstationDto: WorkstationDto) {
    return await this.workstationsService.addWorkstation(workstationDto)
  }

  @Put()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editWorkstation(@Body() workstationDto: WorkstationDto) {
    return await this.workstationsService.editWorkstation(workstationDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async deleteWorkstation(@Param('id') id: string) {
    return await this.workstationsService.deleteWorkstation(id)
  }
}
