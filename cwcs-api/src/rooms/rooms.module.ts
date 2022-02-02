import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoomsController } from './rooms.controller'
import { RoomsService } from './rooms.service'
import { RoomSchema } from './schemas/room.schema'
import { AccountsModule } from '../accounts/accounts.module'
import { WorkstationsModule } from '../workstations/workstations.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    forwardRef(() => AccountsModule),
    WorkstationsModule,
    NotificationsModule
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService]
})
export class RoomsModule {}
