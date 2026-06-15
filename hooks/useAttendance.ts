"use client";

<<<<<<< HEAD
import { useState, useCallback, useMemo } from "react";
=======
import { useState, useCallback, useMemo, useEffect } from "react";
>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148
import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceStatus,
  FilterState,
} from "@/types/attendance";

const today = new Date().toISOString().split("T")[0];

const defaultFilter: FilterState = {
  search: "",
  status: "",
  date: today,
};

<<<<<<< HEAD
// ── Static student records ──────────────────────────────────────────
const staticRecords: AttendanceRecord[] = [
  {
    student: { id: "1", code: "STU001", name: "Aarav Sharma", gender: "Male", contact: "9876543210", rollNo: "01", standard: "10A" },
    date: today, punchIn: "08:05:32", punchOut: "14:30:10", serialNumber: "DEV-001", status: "Present", temperature: 36.5, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "2", code: "STU002", name: "Priya Patel", gender: "Female", contact: "9876543211", rollNo: "02", standard: "10A" },
    date: today, punchIn: "08:45:11", punchOut: "14:28:55", serialNumber: "DEV-001", status: "Late", temperature: 36.7, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "3", code: "STU003", name: "Rohan Mehta", gender: "Male", contact: "9876543212", rollNo: "03", standard: "10A" },
    date: today, punchIn: null, punchOut: null, serialNumber: "DEV-001", status: "Absent", logCount: 0,
  },
  {
    student: { id: "4", code: "STU004", name: "Ananya Gupta", gender: "Female", contact: "9876543213", rollNo: "04", standard: "10A" },
    date: today, punchIn: "07:55:20", punchOut: "14:35:42", serialNumber: "DEV-001", status: "Present", temperature: 36.4, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "5", code: "STU005", name: "Vihaan Singh", gender: "Male", contact: "9876543214", rollNo: "05", standard: "10A" },
    date: today, punchIn: null, punchOut: null, serialNumber: "DEV-001", status: "On Leave", logCount: 0,
  },
  {
    student: { id: "6", code: "STU006", name: "Diya Reddy", gender: "Female", contact: "9876543215", rollNo: "06", standard: "10A" },
    date: today, punchIn: "08:02:17", punchOut: "14:29:03", serialNumber: "DEV-001", status: "Present", temperature: 36.6, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "7", code: "STU007", name: "Arjun Nair", gender: "Male", contact: "9876543216", rollNo: "07", standard: "10A" },
    date: today, punchIn: "09:10:44", punchOut: "14:32:18", serialNumber: "DEV-001", status: "Late", temperature: 36.8, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "8", code: "STU008", name: "Ishita Verma", gender: "Female", contact: "9876543217", rollNo: "08", standard: "10A" },
    date: today, punchIn: "08:00:05", punchOut: "14:25:33", serialNumber: "DEV-001", status: "Present", temperature: 36.3, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "9", code: "STU009", name: "Kabir Joshi", gender: "Male", contact: "9876543218", rollNo: "09", standard: "10A" },
    date: today, punchIn: null, punchOut: null, serialNumber: "DEV-001", status: "Absent", logCount: 0,
  },
  {
    student: { id: "10", code: "STU010", name: "Myra Khan", gender: "Female", contact: "9876543219", rollNo: "10", standard: "10A" },
    date: today, punchIn: "07:58:29", punchOut: "14:31:47", serialNumber: "DEV-001", status: "Present", temperature: 36.5, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "11", code: "STU011", name: "Reyansh Chopra", gender: "Male", contact: "9876543220", rollNo: "11", standard: "10A" },
    date: today, punchIn: "08:03:55", punchOut: "14:27:12", serialNumber: "DEV-001", status: "Present", temperature: 36.4, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "12", code: "STU012", name: "Sara Ali", gender: "Female", contact: "9876543221", rollNo: "12", standard: "10A" },
    date: today, punchIn: null, punchOut: null, serialNumber: "DEV-001", status: "On Leave", logCount: 0,
  },
  {
    student: { id: "13", code: "STU013", name: "Aditya Kumar", gender: "Male", contact: "9876543222", rollNo: "13", standard: "10A" },
    date: today, punchIn: "08:50:30", punchOut: "14:33:05", serialNumber: "DEV-001", status: "Late", temperature: 36.9, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "14", code: "STU014", name: "Navya Iyer", gender: "Female", contact: "9876543223", rollNo: "14", standard: "10A" },
    date: today, punchIn: "07:50:12", punchOut: "14:34:28", serialNumber: "DEV-001", status: "Present", temperature: 36.2, temperatureState: "Normal", logCount: 2,
  },
  {
    student: { id: "15", code: "STU015", name: "Vivaan Desai", gender: "Male", contact: "9876543224", rollNo: "15", standard: "10A" },
    date: today, punchIn: null, punchOut: null, serialNumber: "DEV-001", status: "Absent", logCount: 0,
  },
];

let nextId = 16;
=======
const API_BASE = "https://absolutefoundationattend.rhaitech.online/api";
>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148

function computeSummary(recs: AttendanceRecord[]): AttendanceSummary {
  return {
    total: recs.length,
    present: recs.filter((r) => r.status === "Present").length,
    absent: recs.filter((r) => r.status === "Absent").length,
    late: recs.filter((r) => r.status === "Late").length,
    onLeave: recs.filter((r) => r.status === "On Leave").length,
  };
}

export interface AddEmployeeData {
<<<<<<< HEAD
=======
  code: string;
>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148
  name: string;
  gender: string;
  contact: string;
  rollNo: string;
  standard: string;
  status: AttendanceStatus;
  punchIn: string;
  punchOut: string;
}

<<<<<<< HEAD
=======
export interface BiometricUploadOptions {
  cardNumber?: string;
  serialNumbers?: string; // comma-separated; defaults to configured device(s) on the backend
  verifyMode?: string;    // e.g. "1" for face+card dual verification
  isFaceUpload?: boolean;
  isFPUpload?: boolean;
  isCardUpload?: boolean;
  isBioPasswordUpload?: boolean;
}

>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148
export interface EditRecordData {
  name: string;
  contact: string;
  status: AttendanceStatus;
  punchIn: string;
  punchOut: string;
}

export function useAttendance() {
<<<<<<< HEAD
  const [records, setRecords] = useState<AttendanceRecord[]>(staticRecords);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [syncing] = useState(false);
  const [syncedAt] = useState<string | null>(new Date().toISOString());
  const [error] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const PER_PAGE = 10;

  // Sync is a no-op with static data
  const sync = useCallback(async (_date?: string) => {
    // No-op: data is static
  }, []);

  const markLeave = useCallback(async (studentCode: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.student.code === studentCode
          ? { ...r, status: "On Leave" as const }
          : r
      )
    );
  }, []);

  // ── Add Employee ──────────────────────────────────────────────────
  const addEmployee = useCallback((data: AddEmployeeData) => {
    const id = String(nextId++);
    const code = `STU${id.padStart(3, "0")}`;

    const newRecord: AttendanceRecord = {
      student: {
        id,
        code,
        name: data.name,
        gender: data.gender,
        contact: data.contact,
        rollNo: data.rollNo,
        standard: data.standard,
      },
      date: today,
      punchIn: data.punchIn || null,
      punchOut: data.punchOut || null,
      serialNumber: "DEV-001",
      status: data.status,
      logCount: data.punchIn ? (data.punchOut ? 2 : 1) : 0,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setPage(0);
  }, []);

  // ── Edit Record ───────────────────────────────────────────────────
  const editRecord = useCallback((studentCode: string, data: EditRecordData) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.student.code === studentCode
          ? {
              ...r,
              student: { ...r.student, name: data.name, contact: data.contact },
              status: data.status,
              punchIn: data.punchIn || null,
              punchOut: data.punchOut || null,
              logCount: data.punchIn ? (data.punchOut ? 2 : 1) : 0,
            }
          : r
      )
    );
  }, []);

  // ── Delete Record ─────────────────────────────────────────────────
  const deleteRecord = useCallback((studentCode: string) => {
    setRecords((prev) => prev.filter((r) => r.student.code !== studentCode));
  }, []);
=======
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [biometricImportCode, setBiometricImportCode] = useState<string | null>(null);

  const PER_PAGE = 10;

  // ── Fetch Attendance ──────────────────────────────────────────────
  const fetchAttendance = useCallback(async (targetDate: string) => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/attendance?date=${targetDate}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch attendance.");
      }
      const data = await res.json();
      setRecords(data.records);
      setSyncedAt(data.syncedAt);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch attendance.");
    } finally {
      setSyncing(false);
    }
  }, []);

  // Fetch on date change
  useEffect(() => {
    fetchAttendance(filter.date);
  }, [filter.date, fetchAttendance]);

  // ── Sync Biometric Logs ───────────────────────────────────────────
  const sync = useCallback(async (targetDate?: string) => {
    const d = targetDate || filter.date;
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/attendance/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: d }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Sync failed.");
      }
      const data = await res.json();
      setRecords(data.records);
      setSyncedAt(data.syncedAt);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sync biometric data.");
    } finally {
      setSyncing(false);
    }
  }, [filter.date]);

  // ── Mark Leave ────────────────────────────────────────────────────
  const markLeave = useCallback(async (studentCode: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/attendance/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentCode, date: filter.date }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to mark leave.");
      }
      // Update local state directly
      setRecords((prev) =>
        prev.map((r) =>
          r.student.code === studentCode
            ? { ...r, status: "On Leave" as const, punchIn: null, punchOut: null, manuallyEdited: true }
            : r
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to mark leave.");
    }
  }, [filter.date]);

  // ── Add Employee ──────────────────────────────────────────────────
  const addEmployee = useCallback(async (data: AddEmployeeData) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: data.code,
          name: data.name,
          gender: data.gender,
          contact: data.contact,
          rollNo: data.rollNo,
          standard: data.standard,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add student.");
      }

      // If manual override details are specified, update the attendance record
      if (data.punchIn || data.punchOut || data.status !== "Present") {
        await fetch(`${API_BASE}/attendance/record`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentCode: data.code,
            date: filter.date,
            status: data.status,
            punchIn: data.punchIn,
            punchOut: data.punchOut,
          }),
        });
      }

      await fetchAttendance(filter.date);
      setPage(0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to add employee.");
    }
  }, [filter.date, fetchAttendance]);

  // ── Edit Record ───────────────────────────────────────────────────
  const editRecord = useCallback(async (studentCode: string, data: EditRecordData) => {
    setError(null);
    try {
      // 1. Update Student Profile Details
      const studentRes = await fetch(`${API_BASE}/students/${studentCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          contact: data.contact,
        }),
      });
      if (!studentRes.ok) {
        const errData = await studentRes.json();
        throw new Error(errData.error || "Failed to update student profile.");
      }

      // 2. Update Attendance punch / status details
      const attendanceRes = await fetch(`${API_BASE}/attendance/record`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentCode,
          date: filter.date,
          status: data.status,
          punchIn: data.punchIn,
          punchOut: data.punchOut,
        }),
      });
      if (!attendanceRes.ok) {
        const errData = await attendanceRes.json();
        throw new Error(errData.error || "Failed to update attendance record.");
      }

      await fetchAttendance(filter.date);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to edit attendance record.");
    }
  }, [filter.date, fetchAttendance]);

  // ── Delete Record ─────────────────────────────────────────────────
  const deleteRecord = useCallback(async (studentCode: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/students/${studentCode}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete student.");
      }
      await fetchAttendance(filter.date);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete student.");
    }
  }, [filter.date, fetchAttendance]);

  // ── Import / Register Student on Biometric Device ────────────────
  const importToBiometric = useCallback(
    async (studentCode: string, options?: BiometricUploadOptions) => {
      setError(null);
      setBiometricImportCode(studentCode);
      try {
        const res = await fetch(`${API_BASE}/biometric/upload-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentCode,
            cardNumber: options?.cardNumber,
            serialNumbers: options?.serialNumbers,
            verifyMode: options?.verifyMode,
            isFaceUpload: options?.isFaceUpload,
            isFPUpload: options?.isFPUpload,
            isCardUpload: options?.isCardUpload,
            isBioPasswordUpload: options?.isBioPasswordUpload,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to register student on the biometric device.");
        }
        return await res.json();
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to register student on the biometric device.");
        throw err;
      } finally {
        setBiometricImportCode(null);
      }
    },
    []
  );
>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148

  const updateFilter = useCallback((patch: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const filtered = useMemo(() => {
    const q = filter.search.toLowerCase();
    return records.filter((r) => {
      const matchSearch =
        !q ||
        r.student.name.toLowerCase().includes(q) ||
        r.student.contact.includes(q) ||
<<<<<<< HEAD
        r.student.code.includes(q);
=======
        r.student.code.toLowerCase().includes(q);
>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148

      const matchStatus = !filter.status || r.status === filter.status;

      return matchSearch && matchStatus;
    });
  }, [records, filter.search, filter.status]);

  const filteredSummary = useMemo(() => computeSummary(filtered), [filtered]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return {
    records: paged,
    allRecords: records,
    summary: filteredSummary,
    filter,
    updateFilter,
    syncing,
    syncedAt,
    error,
    page,
    totalPages,
    totalFiltered: filtered.length,
    setPage,
    sync,
    markLeave,
    addEmployee,
    editRecord,
    deleteRecord,
<<<<<<< HEAD
  };
}
=======
    importToBiometric,
    biometricImportCode,
  };
}
>>>>>>> 95cfb05157c1abe523ec9466570f4e16732a0148
