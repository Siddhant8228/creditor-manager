import { useState } from "react";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Ledger from "./pages/Ledger";
import OutstandingReport from "./pages/OutstandingReport";
import Suppliers from "./pages/Suppliers";
import Bills from "./pages/Bills";
import Payments from "./pages/Payments";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-indigo-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold">
            Vinay Cloth Store
          </h1>

          <p className="text-indigo-100">
            Creditor Intelligence Platform
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Navbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">

        {currentPage === "Dashboard" && (
          <Dashboard />
        )}

        {currentPage === "Ledger" && (
          <Ledger />
        )}

        {currentPage ===
          "Outstanding Report" && (
          <OutstandingReport />
        )}

        {currentPage === "Suppliers" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold">
              Suppliers Module
            </h2>

            <p className="mt-3 text-gray-600">
              {currentPage === "Suppliers" && <Suppliers />}
            </p>
          </div>
        )}

        {currentPage === "Bills" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold">
              Purchase Bills
            </h2>

            <p className="mt-3 text-gray-600">
              {currentPage === "Bills" && <Bills />}
            </p>
          </div>
        )}

        {currentPage === "Payments" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold">
              Payments
            </h2>

            <p className="mt-3 text-gray-600">
              {currentPage === "Payments" && <Payments />}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}