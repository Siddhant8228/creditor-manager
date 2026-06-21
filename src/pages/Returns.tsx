import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Returns() {
  const [returns, setReturns] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [supplierId, setSupplierId] =
    useState("");

  const [returnNumber, setReturnNumber] =
    useState("");

  const [returnDate, setReturnDate] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: suppliersData } =
      await supabase
        .from("suppliers")
        .select("*");

    const { data: returnData } =
      await supabase
        .from("purchase_returns")
        .select("*")
        .order("return_date", {
          ascending: false,
        });

    setSuppliers(suppliersData || []);
    setReturns(returnData || []);
  };

  const saveReturn = async () => {
    const { error } = await supabase
      .from("purchase_returns")
      .insert([
        {
          supplier_id: supplierId,
          return_number: returnNumber,
          return_date: returnDate,
          amount: Number(amount),
          remarks,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Return Saved");

    setSupplierId("");
    setReturnNumber("");
    setReturnDate("");
    setAmount("");
    setRemarks("");

    loadData();
  };

  const getSupplierName = (id: string) =>
    suppliers.find(
      (s) => s.id === id
    )?.name || "-";

  return (
    <div style={{ padding: 25 }}>
      <h1>↩ Goods Returns</h1>

      <select
        value={supplierId}
        onChange={(e) =>
          setSupplierId(e.target.value)
        }
      >
        <option>Select Supplier</option>

        {suppliers.map((s) => (
          <option
            key={s.id}
            value={s.id}
          >
            {s.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Return Number"
        value={returnNumber}
        onChange={(e) =>
          setReturnNumber(
            e.target.value
          )
        }
      />

      <input
        type="date"
        value={returnDate}
        onChange={(e) =>
          setReturnDate(
            e.target.value
          )
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

      <input
        placeholder="Remarks"
        value={remarks}
        onChange={(e) =>
          setRemarks(e.target.value)
        }
      />

      <button onClick={saveReturn}>
        Save Return
      </button>

      <hr />

      <table>
        <thead>
          <tr>
            <th>Return No</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {returns.map((r) => (
            <tr key={r.id}>
              <td>{r.return_number}</td>
              <td>
                {getSupplierName(
                  r.supplier_id
                )}
              </td>
              <td>{r.return_date}</td>
              <td>
                ₹
                {Number(
                  r.amount
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}