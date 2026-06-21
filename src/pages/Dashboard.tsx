import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getDashboardMetrics } from "../services/creditorService";

export default function Dashboard() {
  const [metrics, setMetrics] =
  useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const data = await getDashboardMetrics();
    setMetrics(data);
  };

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Vinay Cloth Store
        </h1>

        <p className="text-gray-500">
          Creditor Intelligence Platform
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <StatCard
          title="Outstanding"
          value={`₹${metrics.totalOutstanding.toLocaleString()}`}
        />

        <StatCard
          title="Overdue"
          value={`₹${metrics.overdueAmount.toLocaleString()}`}
        />

        <StatCard
          title="Due This Week"
          value={`₹${metrics.dueThisWeek.toLocaleString()}`}
        />

        <StatCard
          title="Bills"
          value={`₹${metrics.totalBills.toLocaleString()}`}
        />

        <StatCard
          title="Payments"
          value={`₹${metrics.totalPayments.toLocaleString()}`}
        />

        <StatCard
          title="Suppliers"
          value={`${metrics.supplierCount}`}
        />
      </div>
    </div>
  );
}