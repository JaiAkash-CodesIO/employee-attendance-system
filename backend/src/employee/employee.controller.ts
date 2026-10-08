import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Employees & Auth')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new employee with encrypted password' })
  @ApiResponse({ status: 201, description: 'Employee registered successfully' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Employee login and JWT generation' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post('admin-login')
  @ApiOperation({ summary: 'Admin login and JWT generation' })
  @ApiResponse({ status: 200, description: 'Admin login successful' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.service.adminLogin(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered employees (without password hashes)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':employeeId')
  @ApiOperation({ summary: 'Get employee details by employeeId' })
  findOne(@Param('employeeId') employeeId: string) {
    return this.service.findOne(employeeId);
  }
}