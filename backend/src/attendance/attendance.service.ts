import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Response } from 'express';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

@Injectable()
export class AttendanceService {
  constructor(private readonly firebase: FirebaseService) {}

  // =======================
  // Punch In
  // =======================
  async punchIn(employeeId: string) {
  const db = this.firebase.getFirestore();

  const today = new Date().toISOString().split("T")[0];

  const existing = await db
    .collection("attendance")
    .where("employeeId", "==", employeeId)
    .where("date", "==", today)
    .limit(1)
    .get();

  if (!existing.empty) {
    return {
      success: false,
      message: "Employee has already punched in today.",
    };
  }

  const attendance = {
    employeeId,
    date: today,
    punchIn: new Date(),
    punchOut: null,
    status: "Present",
  };

  const docRef = await db.collection("attendance").add(attendance);

  return {
    success: true,
    id: docRef.id,
    attendance,
  };
}
  // =======================
  // Punch Out
  // =======================
  async punchOut(employeeId: string) {
  const db = this.firebase.getFirestore();

  const today = new Date().toISOString().split("T")[0];

  const snapshot = await db
    .collection("attendance")
    .where("employeeId", "==", employeeId)
    .where("date", "==", today)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return {
      success: false,
      message: "Punch In first.",
    };
  }

  const doc = snapshot.docs[0];

  const data: any = doc.data();

  if (data.punchOut) {
    return {
      success: false,
      message: "Already punched out.",
    };
  }

  await doc.ref.update({
    punchOut: new Date(),
  });

  return {
    success: true,
    message: "Punch Out Successful",
  };
}
  // =======================
  // Attendance History
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
  // Get All Attendance
  // =======================
// =======================
// Get All Attendance
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

  return records;
}
  // =======================
  // Export CSV
  // =======================
  async exportCSV(res: Response) {
  const db = this.firebase.getFirestore();

  const attendanceSnapshot = await db.collection("attendance").get();

  const rows = await Promise.all(
    attendanceSnapshot.docs.map(async (doc) => {

      const attendance: any = doc.data();

      const employeeSnapshot = await db
        .collection("employees")
        .where("employeeId", "==", attendance.employeeId)
        .limit(1)
        .get();

      const employee: any = employeeSnapshot.empty
        ? {}
        : employeeSnapshot.docs[0].data();

      return {
        EmployeeID: attendance.employeeId,
        Name: employee.name || "",
        Email: employee.email || "",
        Department: employee.department || "",
        Date: attendance.date,
        PunchIn: attendance.punchIn
          ? attendance.punchIn.toDate().toLocaleTimeString()
          : "",
        PunchOut: attendance.punchOut
          ? attendance.punchOut.toDate().toLocaleTimeString()
          : "",
        Status: attendance.status,
      };
    })
  );

  const parser = new Parser();

  const csv = parser.parse(rows);

  res.header("Content-Type", "text/csv");
  res.attachment("Employee_Attendance_Report.csv");

  return res.send(csv);
}
  // =======================
  // Export PDF
  // =======================
  async exportPDF(res: Response) {
  const db = this.firebase.getFirestore();

  const attendanceSnapshot = await db.collection("attendance").get();

  const pdf = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Employee_Attendance_Report.pdf"
  );

  pdf.pipe(res);

  pdf.fontSize(22).text("EMPLOYEE ATTENDANCE REPORT", {
    align: "center",
  });

  pdf.moveDown();

  pdf.fontSize(12);

  pdf.text(
    `Generated On : ${new Date().toLocaleString()}`
  );

  pdf.text(
    `Total Records : ${attendanceSnapshot.size}`
  );

  pdf.moveDown();

  for (const doc of attendanceSnapshot.docs) {

    const attendance: any = doc.data();

    const employeeSnapshot = await db
      .collection("employees")
      .where("employeeId", "==", attendance.employeeId)
      .limit(1)
      .get();

    const employee: any = employeeSnapshot.empty
      ? {}
      : employeeSnapshot.docs[0].data();

    pdf.fontSize(15).text(
      `Employee : ${attendance.employeeId}`
    );

    pdf.fontSize(12);

    pdf.text(`Name       : ${employee.name || "-"}`);
    pdf.text(`Email      : ${employee.email || "-"}`);
    pdf.text(`Department : ${employee.department || "-"}`);

    pdf.text(`Date       : ${attendance.date}`);

    pdf.text(
      `Punch In   : ${
        attendance.punchIn
          ? attendance.punchIn.toDate().toLocaleTimeString()
          : "-"
      }`
    );

    pdf.text(
      `Punch Out  : ${
        attendance.punchOut
          ? attendance.punchOut.toDate().toLocaleTimeString()
          : "-"
      }`
    );

    pdf.text(`Status     : ${attendance.status}`);

    pdf.moveDown();

    pdf.moveTo(40, pdf.y)
      .lineTo(550, pdf.y)
      .stroke();

    pdf.moveDown();
  }

  pdf.end();
}
}