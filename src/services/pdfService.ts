import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateSupplierStatement(
  supplierName: string,
  bills: any[],
  payments: any[],
  outstanding: number
) {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "VINAY CLOTH STORE",
    14,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Supplier Statement : ${supplierName}`,
    14,
    30
  );

  autoTable(doc, {
    startY: 40,
    head: [
      [
        "Bill Number",
        "Bill Date",
        "Amount",
      ],
    ],
    body: bills.map((bill) => [
      bill.bill_number,
      bill.bill_date,
      bill.amount,
    ]),
  });

  autoTable(doc, {
    startY:
      (doc as any).lastAutoTable
        .finalY + 15,
    head: [
      [
        "Payment Date",
        "Mode",
        "Amount",
      ],
    ],
    body: payments.map(
      (payment) => [
        payment.payment_date,
        payment.payment_mode,
        payment.amount,
      ]
    ),
  });

  doc.text(
    `Outstanding : ₹${outstanding.toLocaleString()}`,
    14,
    (doc as any).lastAutoTable
      .finalY + 20
  );

  doc.save(
    `${supplierName}_Statement.pdf`
  );
}