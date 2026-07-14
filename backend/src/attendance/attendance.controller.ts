import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PunchInDto } from './dto/punch-in.dto';
import type { Response } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('punch-in')
  punchIn(@Body() dto: PunchInDto) {
    return this.attendanceService.punchIn(dto.employeeId);
  }

  @Post('punch-out')
  punchOut(@Body() dto: PunchInDto) {
    return this.attendanceService.punchOut(dto.employeeId);
  }

  // IMPORTANT: Put this BEFORE ':employeeId'
  @Get('all')
  getAllAttendance() {
    return this.attendanceService.getAllAttendance();
  }

  @Get('export/csv')
  exportCSV(@Res() res: Response) {
    return this.attendanceService.exportCSV(res);
  }

  @Get('export/pdf')
  exportPDF(@Res() res: Response) {
    return this.attendanceService.exportPDF(res);
  }

  @Get(':employeeId')
  getAttendance(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getAttendance(employeeId);
  }
}