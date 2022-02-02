import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Delete, Put } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { RoleStatus } from './enums/role-status.enum'
import { Roles } from './decorators/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from './guards/roles.guard'
import { AddAdminAccountDto } from './dto/add-admin-account.dto'
import { AddAccountDto } from './dto/add-account.dto'
import { EditAccountDto } from './dto/edit-account.dto'
import { LoginDto } from './dto/login.dto'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Get('is-admin-account-exist')
  async isAdminAccountExist(): Promise<Boolean> {
    return await this.accountsService.isAdminAccountExist()
  }

  @Post('admin')
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async addAdminAccount(@Body() addAdminAccountDto: AddAdminAccountDto) {
    return await this.accountsService.addAdminAccount(addAdminAccountDto)
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async addAccount(@Body() addAccountDto: AddAccountDto) {
    return await this.accountsService.addAccount(addAccountDto)
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return await this.accountsService.login(loginDto)
  }

  @Get('employees')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN)
  async getEmployeesAccounts(): Promise<Array<Object>> {
    return await this.accountsService.getEmployeesAccounts()
  }

  @Get('employee/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN)
  async getEmployeeAccount(@Param('id') id: string): Promise<any> {
    return await this.accountsService.getEmployeeAccount(id)
  }

  @Put('employee/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editEmployeeAccount(@Param('id') id: string, @Body() editAccountDto: EditAccountDto) {
    return await this.accountsService.editEmployeeAccount(id, editAccountDto)
  }

  @Delete('employee/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN)
  async deleteEmployeeAccount(@Param('id') id: string) {
    return await this.accountsService.deleteEmployeeAccount(id)
  }

  @Get('users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getUsersAccounts(): Promise<Array<Object>> {
    return await this.accountsService.getUsersAccounts()
  }

  @Get('user/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getUserAccount(@Param('id') id: string): Promise<any> {
    return await this.accountsService.getUserAccount(id)
  }

  @Put('user/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editUserAccount(@Param('id') id: string, @Body() editAccountDto: EditAccountDto) {
    return await this.accountsService.editUserAccount(id, editAccountDto)
  }

  @Delete('user/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN)
  async deleteUserAccount(@Param('id') id: string) {
    return await this.accountsService.deleteUserAccount(id)
  }

  @Get(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE, RoleStatus.USER)
  async getAccount(@Param('id') id: string): Promise<any> {
    return await this.accountsService.getAccount(id)
  }

  @Put(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE, RoleStatus.USER)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editAccount(@Param('id') id: string, @Body() editAccountDto: EditAccountDto) {
    return await this.accountsService.editAccount(id, editAccountDto)
  }

  @Get('user-details/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getUserDetails(@Param('id') id: string): Promise<Array<Object>> {
    return await this.accountsService.getUserDetails(id)
  }

  @Put('user-processes/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.USER)
  async addProcessesToUserDetails(@Param('id') id: string, @Body() processes: Array<Object>) {
    return await this.accountsService.addProcessesToUserDetails(id, processes)
  }
}
