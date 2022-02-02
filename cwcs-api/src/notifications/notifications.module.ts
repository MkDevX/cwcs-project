import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NotificationSchema } from './schemas/notification.schema'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { AccountsModule } from '../accounts/accounts.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
    forwardRef(() =>AccountsModule)
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
