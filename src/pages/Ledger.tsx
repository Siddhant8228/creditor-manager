import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { exportToCSV } from "../services/exportService";

export default function Ledger() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  const [summary, setSummary] = useState({
    bills: 0,
    payments: 0,
    returns: 0,
    outstanding: 0,
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }

    setSuppliers(data || []);
  };

  const loadLedger = async (supplierId: string) => {
    if (!supplierId) {
      setEntries([]);
      return;
    }

    const { data: bills } = await supabase
      .from("purchase_bills")
      .select("*")
      .eq("supplier_id", supplierId);

    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("supplier_id", supplierId);

    const { data: returnsData } = await supabase
      .from("purchase_returns")
      .select("*")
      .eq("supplier_id", supplierId);

    const totalBills =
      bills?.reduce(
        (sum, bill) => sum + Number(bill.amount),
        0
      ) || 0;

    const totalPayments =
      payments?.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      ) || 0;

    const totalReturns =
      returnsData?.reduce(
        (sum, ret) => sum + Number(ret.amount),
        0
      ) || 0;

    setSummary({
      bills: totalBills,
      payments: totalPayments,
      returns: totalReturns,
      outstanding:
        totalBills -
        totalPayments -
        totalReturns,
    });

    const ledger: any[] = [];

    bills?.forEach((bill) => {
      ledger.push({
        date: bill.bill_date,
        type: "Bill",
        reference: bill.bill_number,
        debit: Number(bill.amount),
        credit: 0,
      });
    });

    payments?.forEach((payment) => {
      ledger.push({
        date: payment.payment_date,
        type: "Payment",
        reference:
          payment.reference_no || "-",
        debit: 0,
        credit: Number(payment.amount),
      });
    });

    returnsData?.forEach((ret) => {
      ledger.push({
        date: ret.return_date,
        type: "Return",
        reference:
          ret.return_number || "-",
        debit: 0,
        credit: Number(ret.amount),
      });
    });

    ledger.sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    let runningBalance = 0;

    const finalLedger = ledger.map((row) => {
      runningBalance =
        runningBalance +
        row.debit -
        row.credit;

      return {
        ...row,
        balance: runningBalance,
      };
    });

    setEntries(finalLedger);
  };

  return (
    <div
      style={{
        padding: "25px",
        color: "white",
      }}
    >
      <h1>📖 Supplier Ledger</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <h3>Total Bills</h3>
          <h2>
            ₹{summary.bills.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Total Payments</h3>
          <h2>
            ₹{summary.payments.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Total Returns</h3>
          <h2>
            ₹{summary.returns.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Outstanding</h3>
          <h2>
            ₹
            {summary.outstanding.toLocaleString()}
          </h2>
        </div>
      </div>

      <select
        value={selectedSupplier}
        onChange={(e) => {
          setSelectedSupplier(
            e.target.value
          );

          loadLedger(
            e.target.value
          );
        }}
      >
        <option value="">
          Select Supplier
        </option>

        {suppliers.map((supplier) => (
          <option
            key={supplier.id}
            value={supplier.id}
          >
            {supplier.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <button
        onClick={() =>
          exportToCSV(
            "Ledger_Report",
            entries
          )
        }
      >
        📥 Export Ledger
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
            <th>Date</th>
            <th>Type</th>
            <th>Reference</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(
            (entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>

                <td>{entry.type}</td>

                <td>
                  {entry.reference}
                </td>

                <td>
                  ₹
                  {entry.debit.toLocaleString()}
                </td>

                <td>
                  ₹
                  {entry.credit.toLocaleString()}
                </td>

                <td>
                  ₹
                  {entry.balance.toLocaleString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}