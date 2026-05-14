export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'unknown';

export type AbsenceReason = 'ill' | 'home' | 'field' | 'other' | string;

export type UserRole = 'soldier' | 'staff_sergeant' | 'captain';

export type TimeSlot = '06:00' | '08:00' | '14:00' | '21:00';

export interface Soldier {
  id: string;
  initials: string;
  name: string;
  rank: string;
  platoonId: string;
  position: {
    row: number;
    col: number;
  };
}

export interface AttendanceRecord {
  id: string;
  soldierId: string;
  date: string;
  timeSlot: TimeSlot;
  status: AttendanceStatus;
  absenceReason?: AbsenceReason;
  markedBy: string;
  timestamp: string;
}

export interface Platoon {
  id: string;
  name: string;
  soldiers: Soldier[];
}

export interface Company {
  id: string;
  name: string;
  platoons: Platoon[];
}