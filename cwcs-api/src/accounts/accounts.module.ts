import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'
import { AccountSchema } from './schemas/account.schema'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RoomsModule } from '../rooms/rooms.module'
import { WorkstationsModule } from '../workstations/workstations.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { CategoriesModule } from '../categories/categories.module'



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'jWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y',
      signOptions: {
        expiresIn: 3600
      }
    }),
    forwardRef(() => RoomsModule), 
    forwardRef(() => WorkstationsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => CategoriesModule)
  ],
  controllers: [AccountsController],
  providers: [AccountsService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AccountsModule {}
