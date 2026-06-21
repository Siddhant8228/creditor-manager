import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getSupplierLedger } from "../services/ledgerService";
import { generateSupplierStatement } from "../services/pdfService";

export default function Ledger() {
  const [suppliers, setSuppliers] =
    useState<any[]>([]);

  const [selectedSupplier, setSelectedSupplier] =
    useState("");

  const [ledger, setLedger] =
    useState<any>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const { data } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    setSuppliers(data || []);
  };

  const loadLedger = async (
    supplierId: string
  ) => {
    const data =
      await getSupplierLedger(supplierId);

    setLedger(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Supplier Ledger
      </h1>

      <select
        className="border p-2 rounded"
        value={selectedSupplier}
        onChange={(e) => {
          setSelectedSupplier(
            e.target.value
          );
          loadLedger(e.target.value);
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

      {ledger && (
        <div className="mt-8">

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white shadow rounded p-4">
              <h3>Total Bills</h3>
              <p className="text-2xl font-bold">
                ₹{ledger.totalBills.toLocaleString()}
              </p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <h3>Total Payments</h3>
              <p className="text-2xl font-bold">
                ₹{ledger.totalPayments.toLocaleString()}
              </p>
            </div>

            <div className="bg-white shadow rounded p-4">
              <h3>Outstanding</h3>
              <p className="text-2xl font-bold text-red-600">
                ₹{ledger.outstanding.toLocaleString()}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold">
            Bills
          </h2>

          <table className="w-full border mt-2">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {ledger.bills.map((bill: any) => (
                <tr key={bill.id}>
                  <td>{bill.bill_number}</td>
                  <td>{bill.bill_date}</td>
                  <td>{bill.due_date}</td>
                  <td>
                    ₹{Number(
                      bill.amount
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold mt-8">
            Payments
          </h2>

          <table className="w-full border mt-2">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mode</th>
                <th>Amount</th>
              </tr>
            </thead>
             <button
  onClick={() =>
    generateSupplierStatement(
      suppliers.find(
    (s) => s.id === selectedSupplier
    )?.name || "Supplier",
      ledger.bills,
      ledger.payments,
      ledger.outstanding
    )
  }
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Download Statement PDF
</button>
            <tbody>
              {ledger.payments.map(
                (payment: any) => (
                  <tr key={payment.id}>
                    <td>
                      {payment.payment_date}
                    </td>
                    <td>
                      {payment.payment_mode}
                    </td>
                    <td>
                      ₹{Number(
                        payment.amount
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}