import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  // Register Employee
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  // Employee Login
  @Post('login')
  login(@Body() body: any) {
    return this.service.login(
      body.employeeId,
      body.password,
    );
  }

  // Get All Employees
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Get(":employeeId")
findOne(@Param("employeeId") employeeId: string) {
  return this.service.findOne(employeeId);
}
}