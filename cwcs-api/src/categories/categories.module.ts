import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { CategorySchema } from './schemas/category.schema'
import { AccountsModule } from '../accounts/accounts.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    forwardRef(() => AccountsModule),
    NotificationsModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
