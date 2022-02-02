import { IsNotEmpty, Length, NotContains, ValidateIf, IsOptional, IsBoolean } from 'class-validator'

export class EditAccountDto {
  @IsNotEmpty()
  @NotContains(' ', { message: 'username should not contain an empty string' })
  @Length(8, 15)
  readonly username: string

  @ValidateIf(o => o.password1 || o.password2)
  @NotContains(' ', { message: 'currentPassword should not contain an empty string' })
  @Length(8, 15)
  readonly currentPassword: string

  @ValidateIf(o => o.currentPassword || o.password2)
  @IsNotEmpty()
  @NotContains(' ', { message: 'password1 should not contain an empty string' })
  @Length(8, 15)
  readonly password1: string

  @ValidateIf(o => o.currentPassword || o.password1)
  @IsNotEmpty()
  @NotContains(' ', { message: 'password2 should not contain an empty string' })
  @Length(8, 15)
  readonly password2: string

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
