import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountsModule } from './accounts/accounts.module'
import { RoomsModule } from './rooms/rooms.module'
import { WorkstationsModule } from './workstations/workstations.module'
import { EventsModule } from './events/events.module'
import { NotificationsModule } from './notifications/notifications.module'
import { CategoriesModule } from './categories/categories.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://cwcs:tttL1SLa0enyM2dZ@cluster0-7789z.mongodb.net/cwcs?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }), 
    AccountsModule, 
    RoomsModule,
    WorkstationsModule,
    EventsModule,
    NotificationsModule,
    CategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
