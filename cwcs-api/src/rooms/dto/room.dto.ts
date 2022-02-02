import { IsNotEmpty, Length, NotContains, IsOptional, IsMongoId } from 'class-validator'

export class RoomDto {
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly id: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'roomName should not contain an empty string' })
  @Length(1, 20)
  readonly roomName: string
}
