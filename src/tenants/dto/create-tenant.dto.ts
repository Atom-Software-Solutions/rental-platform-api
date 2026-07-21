import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
	@ApiProperty({ description: 'Human-friendly name for the tenant' })
	@IsNotEmpty()
	@IsString()
	name!: string;

	@ApiProperty({ description: 'Unique slug for the tenant' })
	@IsNotEmpty()
	@IsString()
	slug!: string;

	@ApiPropertyOptional({ description: 'Contact email for the tenant' })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ description: 'Contact phone number for the tenant' })
	@IsOptional()
	@IsString()
	phone?: string;
}
