import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly jwtService: JwtService,
  ) {}

  // Register Employee with Bcrypt password hashing
  async create(dto: CreateEmployeeDto) {
    const db = this.firebase.getFirestore();

    // Check if employeeId already exists
    const existingId = await db
      .collection('employees')
      .where('employeeId', '==', dto.employeeId)
      .limit(1)
      .get();

    if (!existingId.empty) {
      return {
        success: false,
        message: 'Employee ID is already registered.',
      };
    }

    // Check if email already exists
    const existingEmail = await db
      .collection('employees')
      .where('email', '==', dto.email)
      .limit(1)
      .get();

    if (!existingEmail.empty) {
      return {
        success: false,
        message: 'Email address is already registered.',
      };
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const employee = {
      employeeId: dto.employeeId,
      name: dto.name,
      email: dto.email,
      department: dto.department,
      password: hashedPassword,
      role: 'EMPLOYEE',
      createdAt: new Date(),
    };

    const doc = await db.collection('employees').add(employee);

    const token = this.jwtService.sign({
      sub: dto.employeeId,
      employeeId: dto.employeeId,
      name: dto.name,
      email: dto.email,
      role: 'EMPLOYEE',
    });

    return {
      success: true,
      id: doc.id,
      token,
      message: 'Employee registered successfully',
    };
  }

  // Employee Login with secure password verification & JWT token
  async login(dto: LoginDto) {
    const db = this.firebase.getFirestore();

    const snapshot = await db
      .collection('employees')
      .where('employeeId', '==', dto.employeeId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: 'Invalid Employee ID or password.',
      };
    }

    const doc = snapshot.docs[0];
    const employee: any = doc.data();

    // Check bcrypt hash or fallback to plaintext for legacy records
    let isPasswordValid = false;
    if (employee.password?.startsWith('$2a$') || employee.password?.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(dto.password, employee.password);
    } else if (employee.password === dto.password) {
      // Legacy unhashed password: migrate on login
      isPasswordValid = true;
      const upgradedHash = await bcrypt.hash(dto.password, 10);
      await doc.ref.update({ password: upgradedHash });
    }

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid Employee ID or password.',
      };
    }

    const token = this.jwtService.sign({
      sub: employee.employeeId,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: 'EMPLOYEE',
    });

    // Omit password from returned object
    const { password, ...safeEmployee } = employee;

    return {
      success: true,
      token,
      employee: {
        id: doc.id,
        ...safeEmployee,
      },
    };
  }

  // Admin Login with JWT issuance
  async adminLogin(dto: AdminLoginDto) {
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (
      dto.username !== expectedUsername ||
      dto.password !== expectedPassword
    ) {
      return {
        success: false,
        message: 'Invalid Admin username or password.',
      };
    }

    const token = this.jwtService.sign({
      sub: 'admin',
      username: dto.username,
      role: 'ADMIN',
    });

    return {
      success: true,
      token,
      admin: {
        username: dto.username,
        role: 'ADMIN',
      },
    };
  }

  // Get All Employees (passwords omitted)
  async findAll() {
    const db = this.firebase.getFirestore();
    const snapshot = await db.collection('employees').get();

    return snapshot.docs.map((doc) => {
      const data: any = doc.data();
      const { password, ...safeData } = data;
      return {
        id: doc.id,
        ...safeData,
      };
    });
  }

  // Get single Employee by employeeId
  async findOne(employeeId: string) {
    const db = this.firebase.getFirestore();
    const snapshot = await db
      .collection('employees')
      .where('employeeId', '==', employeeId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const data: any = snapshot.docs[0].data();
    const { password, ...safeData } = data;

    return {
      id: snapshot.docs[0].id,
      ...safeData,
    };
  }
}