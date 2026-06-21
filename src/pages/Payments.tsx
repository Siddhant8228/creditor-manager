import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [referenceNo, setReferenceNo] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: suppliersData } =
      await supabase.from("suppliers").select("*");

    const { data: paymentsData } =
      await supabase
        .from("payments")
        .select("*")
        .order("payment_date", {
          ascending: false,
        });

    setSuppliers(suppliersData || []);
    setPayments(paymentsData || []);
  };

  const clearForm = () => {
    setEditingId(null);
    setSupplierId("");
    setPaymentDate("");
    setAmount("");
    setPaymentMode("UPI");
    setReferenceNo("");
    setRemarks("");
  };

  const savePayment = async () => {
    if (!supplierId) {
      alert("Select supplier");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("payments")
        .update({
          supplier_id: supplierId,
          payment_date: paymentDate,
          amount: Number(amount),
          payment_mode: paymentMode,
          reference_no: referenceNo,
          remarks,
        })
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Payment Updated");
    } else {
      const { error } = await supabase
        .from("payments")
        .insert([
          {
            supplier_id: supplierId,
            payment_date: paymentDate,
            amount: Number(amount),
            payment_mode: paymentMode,
            reference_no: referenceNo,
            remarks,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Payment Added");
    }

    clearForm();
    loadData();
  };

  const editPayment = (payment: any) => {
    setEditingId(payment.id);
    setSupplierId(payment.supplier_id);
    setPaymentDate(payment.payment_date);
    setAmount(String(payment.amount));
    setPaymentMode(payment.payment_mode);
    setReferenceNo(payment.reference_no || "");
    setRemarks(payment.remarks || "");
  };

  const deletePayment = async (id: string) => {
    if (!window.confirm("Delete payment?")) return;

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  };

  const getSupplierName = (id: string) => {
    return (
      suppliers.find(
        (s) => s.id === id
      )?.name || "-"
    );
  };

  const filteredPayments = payments.filter(
    (payment) =>
      getSupplierName(payment.supplier_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.payment_mode
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.reference_no
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 25, color: "white" }}>
      <h1>💳 Payments</h1>

      <div
        style={{
          background: "#161b22",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <h2>
          {editingId
            ? "Edit Payment"
            : "Add Payment"}
        </h2>

        <select
          value={supplierId}
          onChange={(e) =>
            setSupplierId(e.target.value)
          }
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

        <input
          type="date"
          value={paymentDate}
          onChange={(e) =>
            setPaymentDate(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <select
          value={paymentMode}
          onChange={(e) =>
            setPaymentMode(e.target.value)
          }
        >
          <option>UPI</option>
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
        </select>

        <input
          placeholder="Reference Number"
          value={referenceNo}
          onChange={(e) =>
            setReferenceNo(e.target.value)
          }
        />

        <input
          placeholder="Remarks"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
        />

        <br />
        <br />

        <button onClick={savePayment}>
          {editingId
            ? "Update Payment"
            : "Save Payment"}
        </button>
      </div>

      <div
        style={{
          background: "#161b22",
          padding: 20,
          borderRadius: 15,
        }}
      >
        <input
          placeholder="Search payments..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            marginBottom: 15,
          }}
        />

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Reference</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map(
              (payment) => (
                <tr key={payment.id}>
                  <td>
                    {getSupplierName(
                      payment.supplier_id
                    )}
                  </td>

                  <td>
                    {payment.payment_date}
                  </td>

                  <td>
                    ₹
                    {Number(
                      payment.amount
                    ).toLocaleString()}
                  </td>

                  <td>
                    {payment.payment_mode}
                  </td>

                  <td>
                    {payment.reference_no}
                  </td>

                  <td>
                    {payment.remarks}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        editPayment(
                          payment
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        marginLeft: 10,
                      }}
                      onClick={() =>
                        deletePayment(
                          payment.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}