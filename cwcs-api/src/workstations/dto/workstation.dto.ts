import { IsNotEmpty, Length, NotContains, IsMongoId, IsOptional } from 'class-validator'

export class WorkstationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly id: string

  @IsNotEmpty()
  @IsMongoId()
  readonly roomId: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'workstationName should not contain an empty string' })
  @Length(1, 20)
  readonly workstationName: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'addressMac should not contain an empty string' })
  @Length(17, 17)
  readonly addressMac: string
}
