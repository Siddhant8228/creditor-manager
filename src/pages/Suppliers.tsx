import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");
  const [creditDays, setCreditDays] = useState("30");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    if (error) {
      alert(error.message);
      return;
    }

    setSuppliers(data || []);
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setGst("");
    setAddress("");
    setCreditDays("30");
  };

  const saveSupplier = async () => {
    if (!name.trim()) {
      alert("Supplier name required");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("suppliers")
        .update({
          name,
          phone,
          gst,
          address,
          credit_days: Number(creditDays),
        })
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Supplier Updated");
    } else {
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
    }

    clearForm();
    loadSuppliers();
  };

  const editSupplier = (supplier: any) => {
    setEditingId(supplier.id);
    setName(supplier.name || "");
    setPhone(supplier.phone || "");
    setGst(supplier.gst || "");
    setAddress(supplier.address || "");
    setCreditDays(
      supplier.credit_days?.toString() || "30"
    );
  };

  const deleteSupplier = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this supplier?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadSuppliers();
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      supplier.phone
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        color: "white",
        padding: "25px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "20px",
        }}
      >
        👥 Supplier Management
      </h1>

      <div
        style={{
          background: "#161b22",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <h2>
          {editingId
            ? "Edit Supplier"
            : "Add Supplier"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "10px",
          }}
        >
          <input
            placeholder="Supplier Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <input
            placeholder="GST"
            value={gst}
            onChange={(e) =>
              setGst(e.target.value)
            }
          />

          <input
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Credit Days"
            value={creditDays}
            onChange={(e) =>
              setCreditDays(e.target.value)
            }
          />
        </div>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <button onClick={saveSupplier}>
            {editingId
              ? "Update Supplier"
              : "Add Supplier"}
          </button>

          {editingId && (
            <button
              style={{
                marginLeft: "10px",
              }}
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          background: "#161b22",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h2>Supplier Directory</h2>

        <input
          placeholder="Search supplier..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            marginBottom: "15px",
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
              <th>Name</th>
              <th>Phone</th>
              <th>GST</th>
              <th>Credit Days</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map(
              (supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.gst}</td>
                  <td>
                    {supplier.credit_days}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        editSupplier(supplier)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        marginLeft: "10px",
                      }}
                      onClick={() =>
                        deleteSupplier(
                          supplier.id
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