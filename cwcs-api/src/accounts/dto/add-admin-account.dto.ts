import { IsNotEmpty, Length, NotContains } from 'class-validator'

export class AddAdminAccountDto {
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
  @NotContains(' ', { message: 'firstName should not contain an empty string' })
  @Length(1, 20)
  readonly firstName: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'firstName should not contain an empty string' })
  @Length(1, 20)
  readonly lastName: string
}
