import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Post('login')
  login(
    @Body()
    body: {
      employeeId: string;
      password: string;
    },
  ) {
    return this.service.login(body.employeeId, body.password);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}