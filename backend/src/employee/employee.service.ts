import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private firebase: FirebaseService) {}

  // Register Employee
  async create(dto: CreateEmployeeDto) {
    const db = this.firebase.getFirestore();

    const employee = {
      employeeId: dto.employeeId,
      name: dto.name,
      email: dto.email,
      department: dto.department,
      password: dto.password,
    };

    const doc = await db.collection('employees').add(employee);

    return {
      success: true,
      id: doc.id,
    };
  }

  // Employee Login
  async login(employeeId: string, password: string) {
    const db = this.firebase.getFirestore();

    const snapshot = await db
      .collection('employees')
      .where('employeeId', '==', employeeId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: 'Employee not found',
      };
    }

    const employee: any = snapshot.docs[0].data();

    if (employee.password !== password) {
      return {
        success: false,
        message: 'Incorrect password',
      };
    }

    return {
      success: true,
      employee,
    };
  }

  // Get All Employees
  async findAll() {
    const db = this.firebase.getFirestore();

    const snapshot = await db.collection('employees').get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
  async findOne(employeeId: string) {
  const db = this.firebase.getFirestore();

  const snapshot = await db
    .collection("employees")
    .where("employeeId", "==", employeeId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}
}