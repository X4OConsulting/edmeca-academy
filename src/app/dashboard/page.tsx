"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardData, DashboardTab } from "@/types/dashboard";
import { formatDate } from "@/lib/format";
import FileSetup from "@/components/dashboard/FileSetup";
import SummaryView from "@/components/dashboard/SummaryView";
import LenderView from "@/components/dashboard/LenderView";
import FunderView from "@/components/dashboard/FunderView";
import DevManagerView from "@/components/dashboard/DevManagerView";

const tabs: { id: DashboardTab; label: string; description: string }[] = [
  { id: "summary", label: "Executive Summary", description: "Key metrics overview" },
  { id: "lender", label: "Lender View", description: "Debt & risk analysis" },
  { id: "funder", label: "Funder / Investor", description: "Returns & equity" },
  { id: "devmanager", label: "Dev Manager", description: "Budget & delivery" },
];

export default function DashboardPage() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("summary");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configPath, setConfigPath] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const dashData = await res.json();
        if (!dashData.error) {
          setData(dashData);
          setConfigured(true);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Check if already configured
  useEffect(() => {
    async function checkConfig() {
      try {
        const configRes = await fetch("/api/config");
        const config = await configRes.json();

        if (config.excel_path) {
          setConfigPath(config.excel_path);
          const hasData = await loadData();
          if (!hasData) {
            setConfigured(false);
          }
        } else {
          setConfigured(false);
        }
      } catch {
        setConfigured(false);
      }
    }
    checkConfig();
  }, [loadData]);

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Refresh failed");

      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  }

  function handleReconfigure() {
    setConfigured(false);
    setData(null);
  }

  // Loading state
  if (configured === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Setup flow
  if (!configured || !data) {
    return (
      <FileSetup
        onConfigured={async () => {
          await loadData();
        }}
        initialPath={configPath || undefined}
      />
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                FM
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-none">Financial Dashboard</h1>
                <p className="text-[11px] text-gray-400">{data.metadata.file_name}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {data.metadata.last_refreshed && (
                <span className="hidden sm:inline text-xs text-gray-400">
                  Updated: {formatDate(data.metadata.last_refreshed)}
                </span>
              )}

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={handleReconfigure}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                title="Change financial model file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.label}</span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-1.5">
                  {tab.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "summary" && <SummaryView data={data} />}
        {activeTab === "lender" && <LenderView data={data} />}
        {activeTab === "funder" && <FunderView data={data} />}
        {activeTab === "devmanager" && <DevManagerView data={data} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <span>Financial Model Dashboard - Edmeca Developments</span>
            <span>
              Source: {data.metadata.file_name} | Sheets: {data.metadata.sheets_found.length}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
