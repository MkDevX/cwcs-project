import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Workstation } from './interfaces/workstation.interface'
import { WorkstationDto} from './dto/workstation.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class WorkstationsService {
  constructor(@InjectModel('Workstation') private readonly workstationModel: Model<Workstation>, private readonly notificationsService: NotificationsService) { }

  async getWorkstationsFromRoom(roomId): Promise<Workstation[]> {
    return await this.workstationModel.find({ roomId: roomId }).exec()
  }

  async getWorkstationByAddressMac(addressMac): Promise<Workstation> {
    return await this.workstationModel.findOne({ addressMac: addressMac}).exec()
  }

  async getQuantityWorkstationsInRoom(roomId): Promise<Number> {
    return await this.workstationModel.countDocuments({ roomId: roomId }).exec()
  }

  async validateAddressMac(addressMac: string) {
    let regex = /^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/
    if(regex.test(addressMac)) return true
    return false
  }

  async addWorkstation(workstationDto: WorkstationDto) {
    try {
      const { roomId, workstationName, addressMac } = workstationDto

      if(!this.validateAddressMac(addressMac)) throw new ConflictException("This mac address is invalid!")
      
      const newWorkstation = new this.workstationModel({
        roomId,
        workstationName,
        addressMac
      })

      await newWorkstation.save()
    } catch(error) {
      if(error.errmsg.includes('workstationName_1')) throw new ConflictException("This workstation name is already in use!")
      if(error.errmsg.includes('addressMac_1')) throw new ConflictException("This mac address is already in use!")

      throw error
    }
  }

  async editWorkstation(workstationDto: WorkstationDto) {
    const { id, roomId, workstationName, addressMac } = workstationDto

    if(!this.validateAddressMac(addressMac)) throw new ConflictException("This mac address is invalid!")

    try {
      await this.workstationModel.findOneAndUpdate({ _id: id, roomId: roomId }, { workstationName: workstationName, addressMac: addressMac }) 
    } catch(error) {
      if(error.errmsg.includes('workstationName_1')) throw new ConflictException("This workstation name is already in use!")
      if(error.errmsg.includes('addressMac_1')) throw new ConflictException("This mac address is already in use!")

      throw error
    }
  }

  async deleteWorkstation(id: string) {
    await this.notificationsService.deleteNotificationsByWorkstationId(id)
    return await this.workstationModel.deleteOne({ _id: id }).exec()
  }

  async deleteWorkstationsFromRoom(roomId: string) {
    return await this.workstationModel.deleteMany({ roomId: roomId }).exec()
  }

}
