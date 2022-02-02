import { RoleStatus } from '../enums/role-status.enum'
import { IsNotEmpty, IsEnum, Length, NotContains, IsBoolean, IsOptional } from 'class-validator'

export class AddAccountDto {
  @IsNotEmpty()
  @NotContains(' ', { message: 'username should not contain an empty string' })
  @Length(8, 15)
  readonly username: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'password1 should not contain an empty string' })
  @Length(8, 15)
  readonly password1: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'password2 should not contain an empty string' })
  @Length(8, 15)
  readonly password2: string

  @IsNotEmpty()
  @IsEnum(RoleStatus)
  readonly role: RoleStatus

  @IsNotEmpty()
  @NotContains(' ', { message: 'firstName should not contain an empty string' })
  @Length(1, 20)
  readonly firstName: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'firstName should not contain an empty string' })
  @Length(1, 20)
  readonly lastName: string

  @IsOptional()
  @IsBoolean()
  readonly accessNotifications: boolean

  @IsOptional()
  @IsBoolean()
  readonly accessUsersManagement: boolean

  @IsOptional()
  @IsBoolean()
  readonly accessRoomsManagement: boolean

  @IsOptional()
  @IsBoolean()
  readonly accessWorkstationsManagement: boolean
}
