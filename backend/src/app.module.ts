import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { FirebaseModule } from './firebase/firebase.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'attendance-jwt-secret-key-prod-2026',
      signOptions: { expiresIn: '7d' },
    }),
    FirebaseModule,
    AttendanceModule,
    EmployeeModule,
  ],
})
export class AppModule {}