import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { exportToCSV } from "../services/exportService";

export default function OutstandingReport() {
  const [report, setReport] = useState<any[]>([]);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const { data: suppliers } = await supabase
      .from("suppliers")
      .select("*");

    const { data: bills } = await supabase
      .from("purchase_bills")
      .select("*");

    const { data: payments } = await supabase
      .from("payments")
      .select("*");

    const { data: returnsData } = await supabase
      .from("purchase_returns")
      .select("*");

    const rows =
      suppliers?.map((supplier) => {
        const supplierBills =
          bills?.filter(
            (b) =>
              b.supplier_id === supplier.id
          ) || [];

        const supplierPayments =
          payments?.filter(
            (p) =>
              p.supplier_id === supplier.id
          ) || [];

        const supplierReturns =
          returnsData?.filter(
            (r) =>
              r.supplier_id === supplier.id
          ) || [];

        const billTotal =
          supplierBills.reduce(
            (sum, b) =>
              sum + Number(b.amount),
            0
          );

        const paymentTotal =
          supplierPayments.reduce(
            (sum, p) =>
              sum + Number(p.amount),
            0
          );

        const returnTotal =
          supplierReturns.reduce(
            (sum, r) =>
              sum + Number(r.amount),
            0
          );

        return {
          supplier: supplier.name,
          bills: billTotal,
          payments: paymentTotal,
          returns: returnTotal,
          outstanding:
            billTotal -
            paymentTotal -
            returnTotal,
        };
      }) || [];

    setReport(rows);
  };

  return (
    <div style={{ padding: 25 }}>
      <h1>📈 Outstanding Report</h1>
    <button
  onClick={() =>
    exportToCSV(
      "Outstanding_Report",
      report
    )
  }
>
  📥 Export CSV
</button>

<br />
<br />
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Bills</th>
            <th>Payments</th>
            <th>Returns</th>
            <th>Outstanding</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {report.map((row) => (
            <tr key={row.supplier}>
              <td>{row.supplier}</td>
              <td>₹{row.bills.toLocaleString()}</td>
              <td>₹{row.payments.toLocaleString()}</td>
              <td>₹{row.returns.toLocaleString()}</td>
              <td>
                ₹
                {row.outstanding.toLocaleString()}
              </td>
              <td>
                {row.outstanding > 0 ? (
                  <span style={{ color: "red" }}>Overdue</span>
                ) : (
                  <span style={{ color: "green" }}>Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}