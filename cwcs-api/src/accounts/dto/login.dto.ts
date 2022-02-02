import { IsNotEmpty, Length, NotContains, IsOptional } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @NotContains(' ', { message: 'username should not contain an empty string' })
  @Length(8, 15)
  readonly username: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'password should not contain an empty string' })
  @Length(8, 15)
  readonly password: string

  @IsOptional()
  @IsNotEmpty()
  @NotContains(' ', { message: 'addressMac should not contain an empty string' })
  @Length(17, 17)
  readonly addressMac: string
}
