"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Batch {
  id: number;
  name: string;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"attendance" | "enrollment" | "fee">("attendance");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchId, setBatchId] = useState("all");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch batches for the dropdown
    async function fetchBatches() {
      try {
        // Adjust the API URL based on your .env setup. Defaulting to local dev path.
        const res = await fetch("http://localhost:5013/api/batches");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setBatches(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    }
    fetchBatches();
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        reportType,
        batchId: batchId.toString(),
      });
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const url = `http://localhost:5013/api/reports/download?${queryParams.toString()}`;
      
      // We can use an invisible anchor link to trigger download directly from the browser
      // This is better for streaming large files directly to disk
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}_report.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err: any) {
      setError(err.message || "Failed to download report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-medium">Reports Generator</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Download comprehensive system reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/attendance"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 text-gray-200 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Attendance
          </Link>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-10S17.52 3 12 3z"/>
          </svg>
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-900 px-5 py-4 border-b border-gray-800">
            <h2 className="text-white text-base font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Configure Report
            </h2>
          </div>
          
          <form onSubmit={handleDownload} className="p-6 space-y-6">
            
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="attendance">Attendance Report</option>
                <option value="enrollment">Student Enrollment Report</option>
                <option value="fee">Fee Collection Report</option>
              </select>
            </div>

            {/* Batch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Batch
              </label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range - Only for Attendance and Fee */}
            {(reportType === "attendance" || reportType === "fee") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 transition-colors"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                {loading ? "Generating..." : "Download Report (CSV)"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
