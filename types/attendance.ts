export type AttendanceStatus = "Present" | "Absent" | "Late" | "On Leave";

export interface BiometricLog {
  EmployeeCode: string;
  LogDate: string;
  SerialNumber: string;
  PunchDirection: "in" | "out" | "";
  Temperature: number;
  TemperatureState: string;
}

export interface Batch {
  id: number | null;
  name: string;
  startTime: string;
  endTime: string;
  lateGraceMinutes?: number;
  scheduledDays?: string[];
}

export interface Student {
  id: string;
  code: string;
  name: string;
  gender: "Male" | "Female" | string;
  contact: string;
  rollNo?: string;
  standard?: string;
  section?: string;
  parentName?: string;
  parentMobile?: string;
  batches?: Batch[];
}

export interface AttendanceRecord {
  student: Student;
  employeeName?: string;
  batch: Batch;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  serialNumber: string;
  status: AttendanceStatus;
  temperature?: number;
  temperatureState?: string;
  logCount: number;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
}

export interface SyncResult {
  success: boolean;
  records: AttendanceRecord[];
  summary: AttendanceSummary;
  syncedAt: string;
  error?: string;
}

export interface SmartOfficeError {
  status: boolean;
  message: string;
}

export interface FilterState {
  search: string;
  status: AttendanceStatus | "";
  date: string;
  standard?: string;
  batchId?: string;
}

export interface Holiday {
  id?: number;
  date: string;
  reason: string;
  is_closed: number;
}
