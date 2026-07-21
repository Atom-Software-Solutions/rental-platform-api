import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiExtraModels()
export class AuthCreateTenantDto {
  @ApiProperty({ description: 'Verification token for tenant creation' })
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiProperty({ description: 'Human-friendly name for the tenant' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Contact email for the tenant' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Contact phone number for the tenant' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Optional slug for the tenant' })
  @IsOptional()
  @IsString()
  slug?: string;
}
