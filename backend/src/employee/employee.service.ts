import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private firebase: FirebaseService) {}

  async create(dto: CreateEmployeeDto) {
    const db = this.firebase.getFirestore();

    // Prevent duplicate employee IDs
    const existing = await db
      .collection('employees')
      .where('employeeId', '==', dto.employeeId)
      .limit(1)
      .get();

    if (!existing.empty) {
      return {
        success: false,
        message: 'Employee already exists',
      };
    }

    const doc = await db.collection('employees').add(dto);

    return {
      success: true,
      id: doc.id,
      message: 'Employee Registered Successfully',
    };
  }

  async login(employeeId: string, password: string) {
    const db = this.firebase.getFirestore();

    const snapshot = await db
      .collection('employees')
      .where('employeeId', '==', employeeId)
      .where('password', '==', password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: 'Invalid Employee ID or Password',
      };
    }

    const employee = snapshot.docs[0].data();

    return {
      success: true,
      employee,
    };
  }

  async findAll() {
    const db = this.firebase.getFirestore();

    const snapshot = await db.collection('employees').get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}