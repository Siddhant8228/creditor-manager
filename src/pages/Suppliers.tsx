import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");
  const [creditDays, setCreditDays] = useState("30");

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

  const saveSupplier = async () => {
    const { error } = await supabase
      .from("suppliers")
      .insert([
        {
          name,
          phone,
          gst,
          address,
          credit_days: Number(creditDays),
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Supplier Added");

    setName("");
    setPhone("");
    setGst("");
    setAddress("");
    setCreditDays("30");

    loadSuppliers();
  };

  return (
    <div>
      <h1>Supplier Management</h1>

      <input
        placeholder="Supplier Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="GST"
        value={gst}
        onChange={(e) => setGst(e.target.value)}
      />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="number"
        placeholder="Credit Days"
        value={creditDays}
        onChange={(e) => setCreditDays(e.target.value)}
      />

      <button onClick={saveSupplier}>
        Add Supplier
      </button>

      <hr />

      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>GST</th>
            <th>Credit Days</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.gst}</td>
              <td>{supplier.credit_days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}