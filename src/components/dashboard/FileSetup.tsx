"use client";

import { useState } from "react";

interface FileSetupProps {
  onConfigured: () => void;
  initialPath?: string;
}

export default function FileSetup({ onConfigured, initialPath }: FileSetupProps) {
  const [filePath, setFilePath] = useState(initialPath || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSample, setUseSample] = useState(false);

  async function handleGenerateSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-sample", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate sample");
      setFilePath(data.path);
      setUseSample(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate sample");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filePath.trim()) {
      setError("Please enter the path to your Excel financial model");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save config
      const configRes = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excel_path: filePath.trim() }),
      });
      if (!configRes.ok) {
        const data = await configRes.json();
        throw new Error(data.error || "Failed to save configuration");
      }

      // Trigger refresh
      const refreshRes = await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excel_path: filePath.trim() }),
      });
      const refreshData = await refreshRes.json();
      if (!refreshRes.ok) throw new Error(refreshData.error || "Failed to refresh data");

      onConfigured();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold mb-4">
            FM
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Model Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Connect your Excel financial model to generate an interactive dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Path to Financial Model (Excel)
            </label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => {
                setFilePath(e.target.value);
                setError(null);
              }}
              placeholder="/path/to/your/financial_model.xlsx"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder:text-gray-400"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-2">
              Enter the full path to your .xlsx or .xlsm financial model file
            </p>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !filePath.trim()}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing Financial Model...
                </span>
              ) : (
                "Load Financial Model"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or try with sample data</span>
            </div>
          </div>

          <button
            onClick={handleGenerateSample}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border-2 border-dashed border-gray-300 text-gray-600 font-medium rounded-xl hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-50"
          >
            {useSample ? "Sample model generated - click Load above" : "Generate Sample Financial Model"}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs font-semibold text-blue-700 mb-2">Expected Sheet Names</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              The dashboard works best with sheets named: <strong>Project Summary</strong>,{" "}
              <strong>Sources &amp; Uses</strong>, <strong>Development Budget</strong>,{" "}
              <strong>Debt Schedule</strong>, <strong>Cash Flow</strong>,{" "}
              <strong>Returns Analysis</strong>, <strong>Sensitivity Analysis</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
