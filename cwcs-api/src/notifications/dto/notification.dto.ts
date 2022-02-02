import { IsNotEmpty, Length, IsMongoId, IsOptional, IsBoolean, IsDateString, IsEnum } from 'class-validator'
import { NotificationPriority } from '../enums/notifitcation-priority.enum'

export class NotificationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly id: string

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly userId: string

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly roomId: string

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly workstationId: string

  @IsOptional()
  @IsDateString()
  readonly dateNotification: Date

  @IsOptional()
  @IsDateString()
  readonly dateFaultNotice: Date

  @IsNotEmpty()
  @Length(1, 1000)
  readonly notificationDescription: string

  @IsOptional()
  @IsBoolean()
  readonly notificationStatus: boolean

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(NotificationPriority)
  readonly notificationPriority: NotificationPriority

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly categoryId: string
}