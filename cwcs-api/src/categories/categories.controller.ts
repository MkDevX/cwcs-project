import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, UseGuards, Delete, Put } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { RoleStatus } from '../accounts/enums/role-status.enum'
import { Roles } from '../accounts/decorators/roles.decorator'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../accounts/guards/roles.guard'
import { CategoryDto } from './dto/category.dto'
import { Category } from './interfaces/category.interface'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.USER, RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories()
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async addCategory(@Body() categoryDto: CategoryDto) {
    return await this.categoriesService.addCategory(categoryDto)
  }

  @Put()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  @UsePipes(new ValidationPipe({ validationError: { target: false } }))
  async editCategory(@Body() categoryDto: CategoryDto) {
    return await this.categoriesService.editCategory(categoryDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(RoleStatus.ADMIN, RoleStatus.EMPLOYEE)
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id)
  }
}
