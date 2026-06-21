import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBills: 0,
    totalPayments: 0,
    outstanding: 0,
    overdue: 0,
    totalReturns: 0,
    suppliers: 0,
  });

  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
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
    const totalBills =
      bills?.reduce(
        (sum, bill) =>
          sum + Number(bill.amount),
        0
      ) || 0;

    const totalPayments =
      payments?.reduce(
        (sum, payment) =>
          sum + Number(payment.amount),
        0
      ) || 0;

    const totalReturns =
     returnsData?.reduce(
     (sum, r) =>
      sum + Number(r.amount),
     0
     ) || 0;
    const today = new Date();

    const overdue =
      bills?.filter(
        (bill) =>
          bill.due_date &&
          new Date(bill.due_date) < today
      )
      .reduce(
        (sum, bill) =>
          sum + Number(bill.amount),
        0
      ) || 0;

    setStats({
      totalBills,
      totalPayments,
      totalReturns,
      outstanding:
      totalBills -
      totalPayments -
      totalReturns,
      overdue,
      suppliers:
        suppliers?.length || 0,
    });

    setRecentBills(
      (bills || [])
        .sort(
          (a, b) =>
            new Date(
              b.bill_date
            ).getTime() -
            new Date(
              a.bill_date
            ).getTime()
        )
        .slice(0, 5)
    );

    setRecentPayments(
      (payments || [])
        .sort(
          (a, b) =>
            new Date(
              b.payment_date
            ).getTime() -
            new Date(
              a.payment_date
            ).getTime()
        )
        .slice(0, 5)
    );
  };

  const cardStyle = {
    background: "#161b22",
    padding: "20px",
    borderRadius: "16px",
    minWidth: "220px",
    boxShadow:
      "0 0 20px rgba(59,130,246,0.15)",
  };

  return (
    
    <div
      style={{
        padding: "25px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "5px",
        }}
      >
        🏪 Vinay Cloth Store
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "30px",
        }}
      >
        Creditor Intelligence Platform
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Bills</h3>
          <h1>
            ₹
            {stats.totalBills.toLocaleString()}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Payments</h3>
          <h1>
            ₹
            {stats.totalPayments.toLocaleString()}
          </h1>
        </div>
        <div style={cardStyle}>
  <h3>Total Returns</h3>

  <h1>
    ₹
    {stats.totalReturns.toLocaleString()}
  </h1>
</div>
        <div style={cardStyle}>
          <h3>Outstanding</h3>
          <h1>
            ₹
            {stats.outstanding.toLocaleString()}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>Overdue</h3>
          <h1>
            ₹
            {stats.overdue.toLocaleString()}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>Suppliers</h3>
          <h1>{stats.suppliers}</h1>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#161b22",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Recent Bills</h2>

          {recentBills.map((bill) => (
            <div
              key={bill.id}
              style={{
                padding: "10px 0",
                borderBottom:
                  "1px solid #30363d",
              }}
            >
              <strong>
                {bill.bill_number}
              </strong>

              <div>
                ₹
                {Number(
                  bill.amount
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#161b22",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Recent Payments</h2>

          {recentPayments.map(
            (payment) => (
              <div
                key={payment.id}
                style={{
                  padding: "10px 0",
                  borderBottom:
                    "1px solid #30363d",
                }}
              >
                <strong>
                  {
                    payment.payment_mode
                  }
                </strong>

                <div>
                  ₹
                  {Number(
                    payment.amount
                  ).toLocaleString()}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}