export interface Student {
  id: string;
  nume: string;
  prenume: string;
  clasa: string;
  pluton: number;
  ziLibera: boolean;
  localitate?: string;
  judet?: string;
  anStudiu?: number;
  grad?: string;
}

export interface LeaveRequest {
  id: number;
  studentId: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface Permission {
  id: number;
  studentId: string;
  type: 'medical' | 'permisie' | 'spital' | 'misiune';
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface DatabaseLeaveRequest {
  id: number;
  student_id: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  approved_by?: string;
}

export interface DatabasePermission {
  id: number;
  student_id: string;
  type: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  approved_by?: string;
}
