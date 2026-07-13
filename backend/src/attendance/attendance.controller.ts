import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PunchInDto } from './dto/punch-in.dto';
//import { Body, Controller, Get, Param, Post } from "@nestjs/common";

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

  @Get(':employeeId')
  getAttendance(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getAttendance(employeeId);
  }
  @Get("all")
getAllAttendance() {
  return this.attendanceService.getAllAttendance();
}
}