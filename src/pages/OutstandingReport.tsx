import { useEffect, useState } from "react";
import { getSupplierOutstanding } from "../services/outstandingService";
import { exportOutstandingToExcel } from "../services/exportService";

export default function OutstandingReport() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await getSupplierOutstanding() || [];

    result.sort(
      (a, b) => b.outstanding - a.outstanding
    );

    setData(result || []);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Outstanding Report
      </h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Supplier</th>
            <th className="p-3">Bills</th>
            <th className="p-3">Payments</th>
            <th className="p-3">Outstanding</th>
          </tr>
        </thead>
<button
  onClick={() =>
    exportOutstandingToExcel(data)
  }
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Export Excel
</button>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.supplierName}
              className="border-t"
            >
              <td className="p-3">
                {row.supplierName}
              </td>

              <td className="p-3">
                ₹{row.bills.toLocaleString()}
              </td>

              <td className="p-3">
                ₹{row.payments.toLocaleString()}
              </td>

              <td className="p-3 font-bold text-red-600">
                ₹{row.outstanding.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}