import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { PunchInDto } from './dto/punch-in.dto';
import { Response } from 'express';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

@Injectable()
export class AttendanceService {
  constructor(private readonly firebase: FirebaseService) {}

  // =======================
  // Punch In with GPS support
  // =======================
  async punchIn(dto: PunchInDto) {
    const db = this.firebase.getFirestore();
    const today = new Date().toISOString().split('T')[0];

    const existing = await db
      .collection('attendance')
      .where('employeeId', '==', dto.employeeId)
      .where('date', '==', today)
      .limit(1)
      .get();

    if (!existing.empty) {
      return {
        success: false,
        message: 'Employee has already punched in today.',
      };
    }

    const attendance = {
      employeeId: dto.employeeId,
      date: today,
      punchIn: new Date(),
      punchOut: null,
      status: 'Present',
      workDuration: null,
      durationMinutes: 0,
      punchInLocation: dto.latitude && dto.longitude ? {
        latitude: dto.latitude,
        longitude: dto.longitude,
        locationName: dto.locationName || 'GPS Location',
      } : null,
      punchOutLocation: null,
    };

    const docRef = await db.collection('attendance').add(attendance);

    return {
      success: true,
      id: docRef.id,
      attendance,
      message: 'Punched In successfully',
    };
  }

  // =======================
  // Punch Out with work duration calculation
  // =======================
  async punchOut(dto: PunchInDto) {
    const db = this.firebase.getFirestore();
    const today = new Date().toISOString().split('T')[0];

    const snapshot = await db
      .collection('attendance')
      .where('employeeId', '==', dto.employeeId)
      .where('date', '==', today)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: 'Please Punch In first.',
      };
    }

    const doc = snapshot.docs[0];
    const data: any = doc.data();

    if (data.punchOut) {
      return {
        success: false,
        message: 'Already punched out for today.',
      };
    }

    const punchInDate = data.punchIn?.toDate
      ? data.punchIn.toDate()
      : data.punchIn?._seconds
      ? new Date(data.punchIn._seconds * 1000)
      : new Date(data.punchIn);

    const punchOutDate = new Date();
    const durationMs = Math.max(0, punchOutDate.getTime() - punchInDate.getTime());
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const workDuration = `${hours}h ${mins}m`;

    const updatePayload: any = {
      punchOut: punchOutDate,
      durationMinutes,
      workDuration,
      status: 'Completed',
    };

    if (dto.latitude && dto.longitude) {
      updatePayload.punchOutLocation = {
        latitude: dto.latitude,
        longitude: dto.longitude,
        locationName: dto.locationName || 'GPS Location',
      };
    }

    await doc.ref.update(updatePayload);

    return {
      success: true,
      message: `Punch Out Successful! Total Work Duration: ${workDuration}`,
      workDuration,
    };
  }

  // =======================
  // Attendance History for Employee
  // =======================
  async getAttendance(employeeId: string) {
    const db = this.firebase.getFirestore();

    const snapshot = await db
      .collection('attendance')
      .where('employeeId', '==', employeeId)
      .get();

    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    records.sort((a: any, b: any) => b.date.localeCompare(a.date));

    return records;
  }

  // =======================
  // Get All Attendance for Admin
  // =======================
  async getAllAttendance() {
    const db = this.firebase.getFirestore();

    const attendanceSnapshot = await db.collection('attendance').get();

    const records = await Promise.all(
      attendanceSnapshot.docs.map(async (doc) => {
        const attendance: any = doc.data();

        const employeeSnapshot = await db
          .collection('employees')
          .where('employeeId', '==', attendance.employeeId)
          .limit(1)
          .get();

        let employee: any = null;

        if (!employeeSnapshot.empty) {
          employee = employeeSnapshot.docs[0].data();
        }

        return {
          id: doc.id,
          ...attendance,
          name: employee?.name || '-',
          email: employee?.email || '-',
          department: employee?.department || '-',
        };
      }),
    );

    return records.sort((a: any, b: any) => b.date.localeCompare(a.date));
  }

  // =======================
  // Admin Analytics & Stats Overview
  // =======================
  async getStats() {
    const db = this.firebase.getFirestore();
    const today = new Date().toISOString().split('T')[0];

    const [empSnapshot, attSnapshot] = await Promise.all([
      db.collection('employees').get(),
      db.collection('attendance').get(),
    ]);

    const totalEmployees = empSnapshot.size;
    const allRecords = attSnapshot.docs.map((d) => d.data() as any);

    const todayRecords = allRecords.filter((r) => r.date === today);
    const presentToday = todayRecords.length;
    const completedToday = todayRecords.filter((r) => r.punchOut).length;
    const activeWorking = presentToday - completedToday;

    // Department breakdown map
    const deptMap: Record<string, number> = {};
    for (const doc of empSnapshot.docs) {
      const data = doc.data();
      const dept = data.department || 'Unassigned';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    }

    const departmentStats = Object.keys(deptMap).map((dept) => ({
      name: dept,
      employees: deptMap[dept],
    }));

    return {
      totalEmployees,
      totalAttendanceRecords: allRecords.length,
      presentToday,
      activeWorking,
      completedToday,
      todayDate: today,
      departmentStats,
    };
  }

  // =======================
  // Export CSV
  // =======================
  async exportCSV(res: Response) {
    const db = this.firebase.getFirestore();
    const attendanceSnapshot = await db.collection('attendance').get();

    const rows = await Promise.all(
      attendanceSnapshot.docs.map(async (doc) => {
        const attendance: any = doc.data();

        const employeeSnapshot = await db
          .collection('employees')
          .where('employeeId', '==', attendance.employeeId)
          .limit(1)
          .get();

        const employee: any = employeeSnapshot.empty
          ? {}
          : employeeSnapshot.docs[0].data();

        const formatTime = (ts: any) => {
          if (!ts) return '';
          if (ts.toDate) return ts.toDate().toLocaleTimeString();
          if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleTimeString();
          return new Date(ts).toLocaleTimeString();
        };

        return {
          EmployeeID: attendance.employeeId,
          Name: employee.name || '',
          Email: employee.email || '',
          Department: employee.department || '',
          Date: attendance.date,
          PunchIn: formatTime(attendance.punchIn),
          PunchOut: formatTime(attendance.punchOut),
          WorkDuration: attendance.workDuration || '',
          Status: attendance.status,
        };
      }),
    );

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('Employee_Attendance_Report.csv');
    return res.send(csv);
  }

  // =======================
  // Export PDF
  // =======================
  async exportPDF(res: Response) {
    const db = this.firebase.getFirestore();
    const attendanceSnapshot = await db.collection('attendance').get();

    const pdf = new PDFDocument({
      margin: 40,
      size: 'A4',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Employee_Attendance_Report.pdf',
    );

    pdf.pipe(res);

    pdf.fontSize(22).text('EMPLOYEE ATTENDANCE REPORT', { align: 'center' });
    pdf.moveDown();

    pdf.fontSize(12);
    pdf.text(`Generated On : ${new Date().toLocaleString()}`);
    pdf.text(`Total Records : ${attendanceSnapshot.size}`);
    pdf.moveDown();

    const formatTime = (ts: any) => {
      if (!ts) return '-';
      if (ts.toDate) return ts.toDate().toLocaleTimeString();
      if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleTimeString();
      return new Date(ts).toLocaleTimeString();
    };

    for (const doc of attendanceSnapshot.docs) {
      const attendance: any = doc.data();

      const employeeSnapshot = await db
        .collection('employees')
        .where('employeeId', '==', attendance.employeeId)
        .limit(1)
        .get();

      const employee: any = employeeSnapshot.empty
        ? {}
        : employeeSnapshot.docs[0].data();

      pdf.fontSize(14).text(`Employee : ${attendance.employeeId}`);
      pdf.fontSize(11);
      pdf.text(`Name          : ${employee.name || '-'}`);
      pdf.text(`Email         : ${employee.email || '-'}`);
      pdf.text(`Department    : ${employee.department || '-'}`);
      pdf.text(`Date          : ${attendance.date}`);
      pdf.text(`Punch In      : ${formatTime(attendance.punchIn)}`);
      pdf.text(`Punch Out     : ${formatTime(attendance.punchOut)}`);
      pdf.text(`Duration      : ${attendance.workDuration || '-'}`);
      pdf.text(`Status        : ${attendance.status}`);
      pdf.moveDown();

      pdf.moveTo(40, pdf.y).lineTo(550, pdf.y).stroke();
      pdf.moveDown();
    }

    pdf.end();
  }
}