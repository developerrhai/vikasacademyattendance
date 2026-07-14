"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAttendance } from "@/hooks/useAttendance";
import type { Holiday } from "@/types/attendance";

export default function HolidaysPage() {
  const { holidays, fetchHolidays, addHoliday, deleteHoliday, error } = useAttendance();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [reason, setReason] = useState("");

  const yyyy = currentDate.getFullYear();
  const mm = currentDate.getMonth(); // 0-indexed
  const monthStr = `${yyyy}-${String(mm + 1).padStart(2, "0")}`; // YYYY-MM

  // Fetch holidays on month change
  useEffect(() => {
    fetchHolidays(monthStr);
  }, [monthStr, fetchHolidays]);

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(yyyy, mm - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(yyyy, mm + 1, 1));
  };

  // Calendar calculations
  const firstDayIndex = new Date(yyyy, mm, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
  const totalDays = new Date(yyyy, mm + 1, 0).getDate();

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyDaysBefore = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map dates to holidays
  const holidayMap = new Map<string, Holiday>();
  for (const h of holidays) {
    // Normalise date string from DB (can be YYYY-MM-DD or YYYY-MM-DDT...)
    const dateOnly = h.date.slice(0, 10);
    holidayMap.set(dateOnly, h);
  }

  const handleDayClick = (day: number) => {
    const formattedDate = `${yyyy}-${String(mm + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const existing = holidayMap.get(formattedDate);

    if (existing) {
      if (confirm(`Remove holiday status for ${formattedDate} (${existing.reason || "No Reason"})?`)) {
        if (existing.id) {
          deleteHoliday(existing.id, formattedDate);
        }
      }
    } else {
      setSelectedDateStr(formattedDate);
      setReason("");
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addHoliday(selectedDateStr, reason, true);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-white text-lg font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Holiday & Closure Calendar
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Mark dates as holidays to suppress automated notifications
          </p>
        </div>
        <Link
          href="/attendance"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 text-gray-200 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
        >
          ← Back to Attendance
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Content Card */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Calendar Header / Month Nav */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-850">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-750 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-white text-base font-semibold">
              {monthNames[mm]} {yyyy}
            </h2>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-750 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 text-center py-2.5 bg-gray-55 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 flex-1 min-h-[350px] p-2 bg-gray-50/50 gap-1.5">
            {/* Blank days before start of month */}
            {emptyDaysBefore.map((idx) => (
              <div key={`empty-${idx}`} className="bg-white/40 rounded-xl" />
            ))}

            {/* Days of the month */}
            {daysArray.map((day) => {
              const formattedDate = `${yyyy}-${String(mm + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const holiday = holidayMap.get(formattedDate);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === mm &&
                new Date().getFullYear() === yyyy;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative flex flex-col justify-between items-start p-2.5 rounded-xl border transition-all text-left group overflow-hidden ${
                    holiday
                      ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100/70"
                      : isToday
                      ? "bg-indigo-50/40 border-indigo-300 text-indigo-900 hover:bg-indigo-50"
                      : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50/70"
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? "px-1.5 py-0.5 bg-indigo-600 text-white rounded-full" : ""}`}>
                    {day}
                  </span>

                  {holiday ? (
                    <div className="w-full mt-2">
                      <div className="text-[10px] font-bold text-red-800 truncate" title={holiday.reason}>
                        🛑 {holiday.reason || "Holiday"}
                      </div>
                      <span className="text-[8px] bg-red-100 text-red-850 px-1 py-0.5 rounded font-medium mt-1 inline-block">
                        Closed
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity w-full text-right">
                      <span className="text-[9px] text-gray-400 font-medium">Mark Holiday</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend / Info Footer */}
          <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between text-xs text-gray-505">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-white border border-gray-200" />
                Normal Class Day
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-200" />
                Holiday / Suppressed
              </span>
            </div>
            <span>Click any day to Toggle Holiday status</span>
          </div>

        </div>
      </div>

      {/* Add Holiday Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-medium">Mark Day Closed / Holiday</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Selected Date</label>
                <input
                  type="text"
                  readOnly
                  value={selectedDateStr}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Holiday Reason *</label>
                <input
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Diwali Festival, Monsoon Closure"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
