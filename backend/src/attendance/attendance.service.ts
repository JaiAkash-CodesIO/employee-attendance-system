import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly firebase: FirebaseService) {}

  // =======================
  // Punch In
  // =======================
  async punchIn(employeeId: string) {
    const db = this.firebase.getFirestore();

    const today = new Date().toISOString().split('T')[0];

    const attendance = {
      employeeId,
      date: today,
      punchIn: new Date(),
      punchOut: null,
      status: 'Present',
    };

    const docRef = await db.collection('attendance').add(attendance);

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

    const today = new Date().toISOString().split('T')[0];

    const snapshot = await db
      .collection('attendance')
      .where('employeeId', '==', employeeId)
      .where('date', '==', today)
      .where('punchOut', '==', null)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        message: 'No Punch In record found for today.',
      };
    }

    const doc = snapshot.docs[0];

    await doc.ref.update({
      punchOut: new Date(),
    });

    return {
      success: true,
      message: 'Punch Out Successful',
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

    // Sort records in JavaScript instead of Firestore
    records.sort((a: any, b: any) => b.date.localeCompare(a.date));

    return records;
  }
  async getAllAttendance() {
  const db = this.firebase.getFirestore();

  const snapshot = await db.collection("attendance").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
}