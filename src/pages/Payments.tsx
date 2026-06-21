import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Payments() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] =
    useState("UPI");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: suppliersData } =
      await supabase.from("suppliers").select("*");

    const { data: paymentData } =
      await supabase.from("payments").select("*");

    setSuppliers(suppliersData || []);
    setPayments(paymentData || []);
  };

  const savePayment = async () => {
    const { error } = await supabase
      .from("payments")
      .insert([
        {
          supplier_id: supplierId,
          payment_date: paymentDate,
          amount: Number(amount),
          payment_mode: paymentMode,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Payment Saved");

    loadData();
  };

  return (
    <div>
      <h1>Payments</h1>

      <select
        value={supplierId}
        onChange={(e) =>
          setSupplierId(e.target.value)
        }
      >
        <option value="">Select Supplier</option>

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

      <button onClick={savePayment}>
        Save Payment
      </button>

      <hr />

      {payments.map((payment) => (
        <div key={payment.id}>
          ₹{payment.amount} -
          {payment.payment_mode}
        </div>
      ))}
    </div>
  );
}