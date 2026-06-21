import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Bills() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

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

    const { data: billsData } =
      await supabase
        .from("purchase_bills")
        .select("*")
        .order("bill_date", { ascending: false });

    setSuppliers(suppliersData || []);
    setBills(billsData || []);
  };

  const clearForm = () => {
    setEditingId(null);
    setSupplierId("");
    setBillNumber("");
    setBillDate("");
    setDueDate("");
    setAmount("");
  };

  const saveBill = async () => {
    if (editingId) {
      const { error } = await supabase
        .from("purchase_bills")
        .update({
          supplier_id: supplierId,
          bill_number: billNumber,
          bill_date: billDate,
          due_date: dueDate,
          amount: Number(amount),
        })
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Bill Updated");
    } else {
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

      alert("Bill Added");
    }

    clearForm();
    loadData();
  };

  const editBill = (bill: any) => {
    setEditingId(bill.id);
    setSupplierId(bill.supplier_id);
    setBillNumber(bill.bill_number);
    setBillDate(bill.bill_date);
    setDueDate(bill.due_date);
    setAmount(String(bill.amount));
  };

  const deleteBill = async (id: string) => {
    if (!window.confirm("Delete bill?")) return;

    await supabase
      .from("purchase_bills")
      .delete()
      .eq("id", id);

    loadData();
  };

  const getSupplierName = (supplierId: string) => {
    return (
      suppliers.find(
        (s) => s.id === supplierId
      )?.name || "-"
    );
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.bill_number
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      getSupplierName(
        bill.supplier_id
      ).toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ color: "white", padding: 25 }}>
      <h1>🧾 Purchase Bills</h1>

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
            ? "Edit Bill"
            : "Add Bill"}
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
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <br />
        <br />

        <button onClick={saveBill}>
          {editingId
            ? "Update Bill"
            : "Add Bill"}
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
          placeholder="Search Bills..."
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
              <th>Bill No</th>
              <th>Supplier</th>
              <th>Bill Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.bill_number}</td>
                <td>
                  {getSupplierName(
                    bill.supplier_id
                  )}
                </td>
                <td>{bill.bill_date}</td>
                <td>{bill.due_date}</td>
                <td>
                  ₹
                  {Number(
                    bill.amount
                  ).toLocaleString()}
                </td>

                <td>
                  <button
                    onClick={() =>
                      editBill(bill)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      marginLeft: 10,
                    }}
                    onClick={() =>
                      deleteBill(bill.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}