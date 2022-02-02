import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { RoleStatus } from './enums/role-status.enum'
import { Account } from './interfaces/account.interface'
import { AddAdminAccountDto } from './dto/add-admin-account.dto'
import { AddAccountDto } from './dto/add-account.dto'
import { EditAccountDto } from './dto/edit-account.dto'
import { LoginDto } from './dto/login.dto'
import { RoomsService } from '../rooms/rooms.service'
import { WorkstationsService } from '../workstations/workstations.service'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class AccountsService {
  constructor(@InjectModel('Account') private readonly accountModel: Model<Account>, private readonly jwtService: JwtService, private readonly roomsService: RoomsService, private readonly workstationsService: WorkstationsService, private readonly notificationsService: NotificationsService) { }

  async isAdminAccountExist(): Promise<Boolean> {
    const isAdminAccountExist = await this.accountModel.countDocuments({ role: RoleStatus.ADMIN })
    
    if (isAdminAccountExist === 1) {
      return true
    } else {
      await this.accountModel.deleteMany({ role: RoleStatus.ADMIN })
      return false
    }
  }

  async addAdminAccount(addAdminAccountDto: AddAdminAccountDto) {
    try {
      const { username, password1, password2, firstName, lastName } = addAdminAccountDto

      const { password, salt } = await this.passwordHashSalt(password1, password2)

      if(await this.isAdminAccountExist()) throw new ConflictException("Administrator account already exists!")


      const adminAccount = new this.accountModel({
        username,
        password,
        salt,
        role: RoleStatus.ADMIN,
        firstName,
        lastName,
        accessUsersManagement: true,
        accessNotifications: true,
        accessRoomsManagement: true,
        accessWorkstationsManagement: true
      })

      await adminAccount.save()
    } catch (error) {
      if(error.code === 11000) throw new ConflictException("This username is already in use!")
      throw error
    }
  }

  async addAccount(addAccountDto: AddAccountDto) {
    try {
      const { username, password1, password2, role, firstName, lastName, accessUsersManagement, accessNotifications, accessRoomsManagement, accessWorkstationsManagement } = addAccountDto

      const { password, salt } = await this.passwordHashSalt(password1, password2)

      if(role === RoleStatus.ADMIN) {
        if(await this.isAdminAccountExist()) throw new ConflictException("Administrator account already exists!")
      }

      const newAccount = new this.accountModel({
        username,
        password,
        salt,
        role,
        firstName,
        lastName,
        accessUsersManagement,
        accessNotifications,
        accessRoomsManagement,
        accessWorkstationsManagement
      })

      await newAccount.save()
    } catch (error) {
      if(error.code === 11000) throw new ConflictException("This username is already in use!")
      throw error
    }
  }

  async passwordHashSalt(password1: string, password2: string): Promise<{ password: string; salt: string }> {
    if(password1 !== password2) throw new ConflictException('Passwords are not the same!')

    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(password1, salt)

    return { password, salt }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password, addressMac } = loginDto

    const account = await this.accountModel.findOne({ username: username }).exec()

    if(account && await this.validatePassword(password, account.password, account.salt)) {
      if(!this.validateAddressMac(addressMac) && account.role === RoleStatus.USER) {
        throw new ConflictException('The MAC address of this computer is invalid!')
      }

      const { id: workstationId, workstationName, roomId } = await this.workstationsService.getWorkstationByAddressMac(addressMac) || { id: null, workstationName: null, roomId: null } 
      const { roomName } = await this.roomsService.getRoomById(roomId) || { roomName: null }

      const id = account._id
      const role = account.role as RoleStatus 
      const firstName = account.firstName
      const lastName = account.lastName
      const accessUsersManagement = account.accessUsersManagement
      const accessNotifications = account.accessNotifications
      const accessRoomsManagement = account.accessRoomsManagement
      const accessWorkstationsManagement = account.accessWorkstationsManagement 

      if((!workstationName || !roomName) && role === RoleStatus.USER) {
        throw new ConflictException('There is no such computer with this MAC address!')
      }

      if(role === RoleStatus.USER) {
        await this.addLoginDateToDetails(id)
      }
      
      const payload: JwtPayload = { id, role, firstName, lastName, accessUsersManagement, accessNotifications, accessRoomsManagement, accessWorkstationsManagement, roomId, roomName, workstationId, workstationName, addressMac }
      const accessToken = await this.jwtService.sign(payload)

      return { accessToken }
    }

    throw new UnauthorizedException('Invalid credentials!')
  }

  async validatePassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt)

    return hash === hashedPassword
  }

  validateAddressMac(addressMac: string) {
    let regex = /^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/
    if(regex.test(addressMac)) return true
    return false
  }

  async addLoginDateToDetails(id) {
    let { details } = await this.accountModel.findOne({ _id: id, role: RoleStatus.USER }).select('details').exec()

    if(details.length === 10) {
      await details.shift()
    }

    if(details.length < 10) {
      await details.push({loginDate: new Date(), processes: ''})
      await this.accountModel.findOneAndUpdate({ _id: id, role: RoleStatus.USER }, { details: details })
    }
  }

  async addProcessesToUserDetails(id, processes) {
    let { details } = await this.accountModel.findOne({ _id: id, role: RoleStatus.USER }).select('details').exec()

    details[details.length-1].processes = processes 
    
    await this.accountModel.findOneAndUpdate({ _id: id, role: RoleStatus.USER }, { details: details })
  }

  async getUserDetails(id: string): Promise<Array<Object>> {
    let { firstName, lastName, details } = await this.accountModel.findOne({ _id: id, role: RoleStatus.USER }).exec()

    details.map(detail => {
      detail.loginDate = this.notificationsService.formatDate_YYYY_MM_DD_H_M_S(detail.loginDate, 1)
    })

    details = {
      details: details.reverse(),
      firstName,
      lastName
    }

    return details
  }

  async getAccount(id: string): Promise<Account> {
    return await this.accountModel.findOne({ _id: id }).select('username firstName lastName').exec()
  }

  async editAccount(id: string, editAccountDto: EditAccountDto) {
    const { username, currentPassword, password1, password2, firstName, lastName } = editAccountDto

    try {
      if(currentPassword && password1 && password2 && password1 === password2) {
        const account = await this.accountModel.findOne({ _id: id }).exec()

        if(!await this.validatePassword(currentPassword, account.password, account.salt)) throw new ConflictException('Invalid current password!')
        
        const { password, salt } = await this.passwordHashSalt(password1, password2)
        await this.accountModel.findOneAndUpdate({ _id: id }, { username: username, password: password, salt: salt, firstName: firstName, lastName: lastName }).exec() 
      } else {
        await this.accountModel.findOneAndUpdate({ _id: id }, { username: username, firstName: firstName, lastName: lastName }).exec() 
      }
    } catch(error) {
      if(error.code === 11000) throw new ConflictException("This username is already in use!")
      throw error
    }
  }

  async getEmployeesAccounts(): Promise<Account[]> {
    return await this.accountModel.find({ role: RoleStatus.EMPLOYEE }).select('_id username firstName lastName accessNotifications accessUsersManagement accessRoomsManagement accessWorkstationsManagement').exec()
  }

  async getEmployeeAccount(id: string): Promise<Account> {
    return await this.accountModel.findOne({ _id: id, role: RoleStatus.EMPLOYEE }).select('username firstName lastName accessNotifications accessUsersManagement accessRoomsManagement accessWorkstationsManagement').exec()
  }

  async editEmployeeAccount(id: string, editAccountDto: EditAccountDto) {
    const { username, password1, password2, firstName, lastName, accessNotifications, accessUsersManagement, accessRoomsManagement, accessWorkstationsManagement } = editAccountDto

    try {
      if(password1 && password2 && password1 === password2) {
        const { password, salt } = await this.passwordHashSalt(password1, password2)
        await this.accountModel.findOneAndUpdate({ _id: id, role: RoleStatus.EMPLOYEE }, { username: username, password: password, salt: salt, role: RoleStatus.EMPLOYEE, firstName: firstName, lastName: lastName, accessNotifications: accessNotifications, accessUsersManagement: accessUsersManagement, accessRoomsManagement: accessRoomsManagement, accessWorkstationsManagement: accessWorkstationsManagement })        
      } else {
        await this.accountModel.findOneAndUpdate({ _id: id, role: RoleStatus.EMPLOYEE }, { username: username, role: RoleStatus.EMPLOYEE, firstName: firstName, lastName: lastName, accessNotifications: accessNotifications, accessUsersManagement: accessUsersManagement, accessRoomsManagement: accessRoomsManagement, accessWorkstationsManagement: accessWorkstationsManagement }) 
      }
    } catch(error) {
      if(error.code === 11000) throw new ConflictException("This username is already in use!")
      throw error
    }
  }

  async deleteEmployeeAccount(id: string) {
    return await this.accountModel.deleteOne({ _id: id, role: RoleStatus.EMPLOYEE }).exec()
  }

  async getUsersAccounts(): Promise<Account[]> {
    return await this.accountModel.find({ role: RoleStatus.USER }).select('_id username firstName lastName accessNotifications').exec()
  }

  async getUserAccount(id: string): Promise<Account> {
    return await this.accountModel.findOne({ _id: id, role: RoleStatus.USER }).select('username firstName lastName accessNotifications').exec()
  }

  async editUserAccount(id: string, editAccountDto: EditAccountDto) {
    const {username, password1, password2, firstName, lastName, accessNotifications } = editAccountDto

    try {
      if(password1 && password2 && password1 === password2) {
        const { password, salt } = await this.passwordHashSalt(password1, password2)
        await this.accountModel.findOneAndUpdate({ _id: id, role: RoleStatus.USER }, { username: username, password: password, salt: salt, role: RoleStatus.USER, firstName: firstName, lastName: lastName, accessNotifications: accessNotifications })        
      } else {
        await this.accountModel.findOneAndUpdate({ _id: id, role: RoleStatus.USER }, { username: username, role: RoleStatus.USER, firstName: firstName, lastName: lastName, accessNotifications: accessNotifications }) 
      }
    } catch(error) {
      if(error.code === 11000) throw new ConflictException("This username is already in use!")
      throw error
    }
  }

  async deleteUserAccount(id: string) {
    await this.notificationsService.deleteNotificationsByUserId(id)
    return await this.accountModel.deleteOne({ _id: id, role: RoleStatus.USER }).exec()
  }

}
