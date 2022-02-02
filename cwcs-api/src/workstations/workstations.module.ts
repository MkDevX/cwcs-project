import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WorkstationSchema } from './schemas/workstation.schema'
import { WorkstationsController } from './workstations.controller'
import { WorkstationsService } from './workstations.service'
import { AccountsModule } from '../accounts/accounts.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Workstation', schema: WorkstationSchema }]),
    forwardRef(() => AccountsModule),
    NotificationsModule
  ],
  controllers: [WorkstationsController],
  providers: [WorkstationsService],
  exports: [WorkstationsService]
})
export class WorkstationsModule {}
