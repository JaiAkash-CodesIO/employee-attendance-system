import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PunchInDto {
  @ApiProperty({ example: 'EMP101', description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiPropertyOptional({ example: 12.9716, description: 'Latitude of punch location' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 77.5946, description: 'Longitude of punch location' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'Office Main Gate', description: 'Optional location note' })
  @IsOptional()
  @IsString()
  locationName?: string;
}