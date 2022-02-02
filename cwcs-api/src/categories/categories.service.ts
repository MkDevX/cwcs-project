import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from './interfaces/category.interface'
import { CategoryDto } from './dto/category.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>, private readonly notificationsService: NotificationsService) { }
  
  async getCategories(): Promise<Category[]> {
    let categories = await this.categoryModel.find().sort({ _id: -1 }).exec()

    return categories
  }

  async addCategory(categoryDto: CategoryDto) {
    try {
      const { categoryName } = categoryDto

      const newCategory = new this.categoryModel({
        categoryName
      })

      await newCategory.save()
    } catch (error) {
      if(error.code === 11000) throw new ConflictException("This category name already exists!")
      throw error
    }
  }

  async editCategory(categoryDto: CategoryDto) {
    const { id, categoryName } = categoryDto

    try {
      await this.categoryModel.findOneAndUpdate({ _id: id }, { categoryName: categoryName }) 
    } catch(error) {
      if(error.code === 11000) throw new ConflictException("This category name already exists!")
      throw error
    }
  }

  async deleteCategory(id: string) {
    await this.notificationsService.deleteAssignedNotificationCategoryByCategoryId(id)
    return await this.categoryModel.deleteOne({ _id: id }).exec()
  }
}
