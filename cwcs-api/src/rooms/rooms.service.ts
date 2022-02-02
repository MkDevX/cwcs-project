import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Room } from './interfaces/room.interface'
import { RoomDto } from './dto/room.dto'
import { WorkstationsService } from '../workstations/workstations.service'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class RoomsService {
  constructor(@InjectModel('Room') private readonly roomModel: Model<Room>, private readonly workstationsService: WorkstationsService, private readonly notificationsService: NotificationsService) { }

  async getRooms(): Promise<Room[]> {
    let rooms = await this.roomModel.find().exec()

    rooms = await Promise.all(rooms.map(async room => {
      return  {
        _id: room._id,
        roomName: room.roomName,
        quantityWorkstations: await this.workstationsService.getQuantityWorkstationsInRoom(room._id)
      }   
    }))

    return rooms
  }

  async getRoomById(roomId): Promise<Room> {
    return await this.roomModel.findOne({_id: roomId}).exec()
  }

  async addRoom(roomDto: RoomDto) {
    try {
      const { roomName } = roomDto

      const newRoom = new this.roomModel({
        roomName
      })

      await newRoom.save()
    } catch (error) {
      if(error.code === 11000) throw new ConflictException("This room name is already in use!")
      throw error
    }
  }

  async editRoom(roomDto: RoomDto) {
    const { id, roomName } = roomDto

    try {
      await this.roomModel.findOneAndUpdate({ _id: id }, { roomName: roomName }) 
    } catch(error) {
      if(error.code === 11000) throw new ConflictException("This room name is already in use!")
      throw error
    }
  }

  async deleteRoom(id: string) {
    await this.notificationsService.deleteNotificationsByRoomId(id)
    await this.workstationsService.deleteWorkstationsFromRoom(id)
    return await this.roomModel.deleteOne({ _id: id }).exec()
  }
}
