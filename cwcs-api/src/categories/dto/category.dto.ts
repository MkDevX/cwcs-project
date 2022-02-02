import { IsNotEmpty, Length, IsMongoId, IsOptional, NotContains } from 'class-validator'

export class CategoryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly id: string

  @IsNotEmpty()
  @NotContains(' ', { message: 'categoryName should not contain an empty string' })
  @Length(1, 20)
  readonly categoryName: string
}