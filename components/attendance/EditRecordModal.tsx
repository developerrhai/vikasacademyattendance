"use client";

import { useState, useEffect } from "react";
import type { AttendanceStatus, AttendanceRecord, Batch } from "@/types/attendance";
import type { EditRecordData } from "@/hooks/useAttendance";

interface Props {
  open: boolean;
  record: AttendanceRecord | null;
  onClose: () => void;
  onSubmit: (studentCode: string, data: EditRecordData) => void;
  batches: Batch[];
}

const statusOptions: AttendanceStatus[] = ["Present", "Absent", "Late", "On Leave"];

export function EditRecordModal({ open, record, onClose, onSubmit, batches }: Props) {
  const [form, setForm] = useState<EditRecordData>({
    name: "",
    contact: "",
    status: "Present",
    punchIn: "",
    punchOut: "",
    standard: "",
    section: "",
    rollNo: "",
    parentName: "",
    parentMobile: "",
  });

  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([]);

  useEffect(() => {
    if (record) {
      setForm({
        name: record.student.name,
        contact: record.student.contact,
        status: record.status,
        punchIn: record.punchIn ?? "",
        punchOut: record.punchOut ?? "",
        standard: record.student.standard ?? "",
        section: record.student.section ?? "",
        rollNo: record.student.rollNo ?? "",
        parentName: record.student.parentName ?? "",
        parentMobile: record.student.parentMobile ?? "",
      });

      const initialBatchIds = (record.student.batches ?? [])
        .map((b) => b.id)
        .filter((id): id is number => id !== null);
      setSelectedBatchIds(initialBatchIds);
    }
  }, [record]);

  if (!open || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(record.student.code, {
      ...form,
      batchIds: selectedBatchIds,
      batchId: record.batch.id, // specific batch index being edited
    });
    onClose();
  };

  const handleToggleBatch = (id: number) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const update = (patch: Partial<EditRecordData>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="text-white font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Student Profile & Attendance
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Name & Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Contact *</label>
              <input
                required
                value={form.contact}
                onChange={(e) => update({ contact: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Assigned Batches checklist */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Assigned Batches (Select all that apply)</label>
            <div className="border border-gray-100 rounded-lg p-3 space-y-2 max-h-[120px] overflow-y-auto bg-gray-50/50">
              {batches.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No batches created yet. Will default to General Batch.</p>
              ) : (
                batches.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100/50 p-1.5 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={b.id !== null && selectedBatchIds.includes(b.id)}
                      onChange={() => b.id !== null && handleToggleBatch(b.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      {b.name} <span className="text-gray-400 font-mono">({b.startTime.slice(0, 5)} - {b.endTime.slice(0, 5)})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Roll No, Standard, Section */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Roll No</label>
              <input
                value={form.rollNo}
                onChange={(e) => update({ rollNo: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Standard / Class</label>
              <input
                value={form.standard}
                onChange={(e) => update({ standard: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Section</label>
              <input
                value={form.section}
                onChange={(e) => update({ section: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Parent Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Parent Name</label>
              <input
                value={form.parentName}
                onChange={(e) => update({ parentName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Parent Mobile</label>
              <input
                value={form.parentMobile}
                onChange={(e) => update({ parentMobile: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status (For selected batch context) */}
          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-xs font-semibold text-gray-800 mb-2">
              Attendance Override — {record.batch.name} Context
            </h4>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status *</label>
              <select
                required
                value={form.status}
                onChange={(e) => update({ status: e.target.value as AttendanceStatus })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Punch In & Out */}
          <div className="grid grid-cols-2 gap-4 pb-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Punch In</label>
              <input
                type="time"
                step="1"
                value={form.punchIn}
                onChange={(e) => update({ punchIn: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Punch Out</label>
              <input
                type="time"
                step="1"
                value={form.punchOut}
                onChange={(e) => update({ punchOut: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
