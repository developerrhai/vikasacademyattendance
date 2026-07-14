"use client";

import { useState } from "react";
import Link from "next/link";
import { useAttendance } from "@/hooks/useAttendance";
import type { Batch } from "@/types/attendance";

export default function BatchesPage() {
  const { batches, addBatch, updateBatch, deleteBatch, error } = useAttendance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("16:00:00");
  const [endTime, setEndTime] = useState("17:30:00");
  const [lateGrace, setLateGrace] = useState(10);

  const openAdd = () => {
    setEditingBatch(null);
    setName("");
    setStartTime("16:00:00");
    setEndTime("17:30:00");
    setLateGrace(10);
    setIsFormOpen(true);
  };

  const openEdit = (b: Batch) => {
    setEditingBatch(b);
    setName(b.name);
    setStartTime(b.startTime);
    setEndTime(b.endTime);
    setLateGrace(b.lateGraceMinutes ?? 10);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatch && editingBatch.id !== null) {
      await updateBatch(editingBatch.id, {
        name,
        startTime,
        endTime,
        lateGraceMinutes: lateGrace,
      });
    } else {
      await addBatch({
        name,
        startTime,
        endTime,
        lateGraceMinutes: lateGrace,
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this batch? All student mapping to this batch will be cleared.")) {
      await deleteBatch(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-white text-lg font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Batch & Timing Management
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Configure school/institute class schedules and grace periods
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/attendance"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 text-gray-200 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
          >
            ← Back to Attendance
          </Link>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Batch
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {batches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">No Batches Configured</h3>
            <p className="text-gray-500 text-sm mt-1 mb-6 max-w-sm mx-auto">
              Create batches to set start, end, and late-grace times for your student cohorts.
            </p>
            <button
              onClick={openAdd}
              className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Your First Batch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 text-base">{b.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                      ID: {b.id}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between border-b border-gray-50 pb-1.5">
                      <span className="text-gray-400">Start Time</span>
                      <span className="font-mono font-medium text-gray-800">{b.startTime.slice(0, 5)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-1.5">
                      <span className="text-gray-400">End Time</span>
                      <span className="font-mono font-medium text-gray-800">{b.endTime.slice(0, 5)}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-gray-400">Late Grace</span>
                      <span className="font-medium text-gray-800">{b.lateGraceMinutes ?? 10} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    Edit Timing
                  </button>
                  <button
                    onClick={() => b.id !== null && handleDelete(b.id)}
                    className="px-3 py-1.5 text-xs font-medium border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete batch"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-medium">
                {editingBatch ? "Edit Batch Details" : "Create New Timing Batch"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Batch / Class Name *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 10th Math, Physics Morning Class"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime.length === 5 ? startTime + ":00" : startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">End Time *</label>
                  <input
                    type="time"
                    required
                    value={endTime.length === 5 ? endTime + ":00" : endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Late Grace Period (Minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={lateGrace}
                  onChange={(e) => setLateGrace(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Students punching in after (Start Time + Grace Period) will be marked Late.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingBatch ? "Save Changes" : "Create Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
