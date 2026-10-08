import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { PunchInDto } from './dto/punch-in.dto';
import type { Response } from 'express';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('punch-in')
  @ApiOperation({ summary: 'Punch In with optional GPS coordinates' })
  @ApiResponse({ status: 201, description: 'Punch In recorded successfully' })
  punchIn(@Body() dto: PunchInDto) {
    return this.attendanceService.punchIn(dto);
  }

  @Post('punch-out')
  @ApiOperation({ summary: 'Punch Out and calculate total working duration' })
  @ApiResponse({ status: 200, description: 'Punch Out recorded successfully' })
  punchOut(@Body() dto: PunchInDto) {
    return this.attendanceService.punchOut(dto);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get summary statistics and analytics for Admin Dashboard' })
  getStats() {
    return this.attendanceService.getStats();
  }

  // IMPORTANT: Put this BEFORE ':employeeId'
  @Get('all')
  @ApiOperation({ summary: 'Get all attendance records for company' })
  getAllAttendance() {
    return this.attendanceService.getAllAttendance();
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export full attendance history as CSV' })
  exportCSV(@Res() res: Response) {
    return this.attendanceService.exportCSV(res);
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Export full attendance history as PDF' })
  exportPDF(@Res() res: Response) {
    return this.attendanceService.exportPDF(res);
  }

  @Get(':employeeId')
  @ApiOperation({ summary: 'Get personal attendance history by employeeId' })
  getAttendance(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getAttendance(employeeId);
  }
}