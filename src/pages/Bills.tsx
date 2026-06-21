import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Bills() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: suppliersData } =
      await supabase.from("suppliers").select("*");

    const { data: billData } =
      await supabase.from("purchase_bills").select("*");

    setSuppliers(suppliersData || []);
    setBills(billData || []);
  };

  const saveBill = async () => {
    const { error } = await supabase
      .from("purchase_bills")
      .insert([
        {
          supplier_id: supplierId,
          bill_number: billNumber,
          bill_date: billDate,
          due_date: dueDate,
          amount: Number(amount),
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Bill Saved");

    loadData();
  };

  return (
    <div>
      <h1>Purchase Bills</h1>

      <select
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
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
        placeholder="Bill Number"
        value={billNumber}
        onChange={(e) =>
          setBillNumber(e.target.value)
        }
      />

      <input
        type="date"
        value={billDate}
        onChange={(e) =>
          setBillDate(e.target.value)
        }
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />

      <input
        type="number"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <button onClick={saveBill}>
        Save Bill
      </button>

      <hr />

      {bills.map((bill) => (
        <div key={bill.id}>
          {bill.bill_number} - ₹{bill.amount}
        </div>
      ))}
    </div>
  );
}