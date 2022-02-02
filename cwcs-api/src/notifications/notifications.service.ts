import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Notification } from './interfaces/notification.interface'
import { NotificationDto } from './dto/notification.dto'
import * as mongoose from 'mongoose'

@Injectable()
export class NotificationsService {
  constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) { }

  async getNotifications(): Promise<Notification[]> {
    let notifications = await this.notificationModel.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room"
        },
      },
      {
        $lookup: {
          from: "workstations",
          localField: "workstationId",
          foreignField: "_id",
          as: "workstation"
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        },
      },
      { $unwind:'$user' },
      { $unwind:'$room' },
      { $unwind:'$workstation' },
      { 
        $project: {
          _id: 1,
          userId: 1,
          roomId: 1,
          workstationId: 1,
          dateNotification: 1,
          dateFaultNotice: 1,
          notificationDescription: 1,
          notificationStatus: 1,
          notificationPriority: 1,
          firstName:'$user.firstName',
          lastName:'$user.lastName',
          roomName:'$room.roomName',
          workstationName: '$workstation.workstationName',
          categoryName: '$category.categoryName'
        }
      }
    ]).sort({dateNotification: 'desc'}).exec()

    return notifications.map(notification => {
      return {
        ...notification,
        dateNotification: this.formatDate_YYYY_MM_DD_H_M_S(notification.dateNotification, 1),
        dateFaultNotice: this.formatDate_YYYY_MM_DD_H_M_S(notification.dateFaultNotice, 0)
      }
    })
  }

  async getNotificationsByUserId(userId): Promise<Notification[]> {
    let notifications = await this.notificationModel.find({ userId: userId }).sort({dateNotification: 'desc'}).exec()

    notifications = notifications.map(notification => {
      return {
        _id: notification._id,
        dateNotification: this.formatDate_YYYY_MM_DD_H_M_S(notification.dateNotification, 1),
        dateFaultNotice: this.formatDate_YYYY_MM_DD_H_M_S(notification.dateFaultNotice, 0),
        notificationStatus: notification.notificationStatus,
        notificationDescription: notification.notificationDescription
      }
    })

    return notifications
  }

  async getNotificationById(id: string): Promise<any> {
    let notification = await this.notificationModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "accounts",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room"
        },
      },
      {
        $lookup: {
          from: "workstations",
          localField: "workstationId",
          foreignField: "_id",
          as: "workstation"
        },
      },
      { $unwind:'$user' },
      { $unwind:'$room' },
      { $unwind:'$workstation' },
      { 
        $project: {
          _id: 1,
          userId: 1,
          roomId: 1,
          workstationId: 1,
          dateNotification: 1,
          dateFaultNotice: 1,
          notificationDescription: 1,
          notificationStatus: 1,
          notificationPriority: 1,
          categoryId: 1,
          firstName:'$user.firstName',
          lastName:'$user.lastName',
          roomName:'$room.roomName',
          workstationName: '$workstation.workstationName'
        }
      }
    ]).exec()

    //console.log(notification)

    notification[0].dateNotification = this.formatDate_YYYY_MM_DD_H_M_S(notification[0].dateNotification, 1)
    notification[0].dateFaultNotice = this.formatDate_YYYY_MM_DD_H_M_S(notification[0].dateFaultNotice, 0)


    return notification[0]
  }

  formatDate_YYYY_MM_DD_H_M_S(date, type) {
    let d = new Date(date)
    let year = d.getFullYear()
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let hours = '' + d.getHours()
    let minutes = '' + d.getMinutes()
    let seconds = '' + d.getSeconds()

    if (month.length < 2) 
      month = '0' + month
    if (day.length < 2) 
      day = '0' + day
    if (hours.length < 2) 
      hours = '0' + hours
    if (minutes.length < 2) 
      minutes = '0' + minutes
    if (seconds.length < 2) 
      seconds = '0' + seconds

    if(type === 1)
    return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':')

    if(type === 0)
    return [year, month, day].join('-')
  }

  async addNotification(notificationDto: NotificationDto) {
    try {
      const { userId, roomId, workstationId, dateNotification, dateFaultNotice, notificationDescription, categoryId } = notificationDto
      
      const newNotification = new this.notificationModel({
        userId,
        roomId,
        workstationId,
        dateNotification,
        dateFaultNotice,
        notificationDescription,
        categoryId
      })

      await newNotification.save()
    } catch(error) {
      throw error
    }
  }

  async editNotification(id: string, notificationDto: NotificationDto) {
    try {
      await this.notificationModel.findOneAndUpdate({ _id: id }, notificationDto).exec() 
    } catch(error) {
      throw error
    }
  }

  async deleteNotification(id: string) {
    return await this.notificationModel.deleteOne({ _id: id }).exec()
  }

  async deleteNotificationsByUserId(userId: string) {
    return await this.notificationModel.deleteMany({ userId: userId }).exec()
  }

  async deleteNotificationsByRoomId(roomId: string) {
    return await this.notificationModel.deleteMany({ roomId: roomId }).exec()
  }

  async deleteNotificationsByWorkstationId(workstationId: string) {
    return await this.notificationModel.deleteMany({ workstationId: workstationId }).exec()
  }

  async deleteAssignedNotificationCategoryByCategoryId(categoryId: string) {
    await this.notificationModel.updateMany({ categoryId: categoryId }, { categoryId: null }).exec()
  }

}
