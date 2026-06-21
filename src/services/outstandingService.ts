import { supabase } from "../lib/supabase";

export async function getSupplierOutstanding() {
  const [{ data: suppliers }, { data: bills }, { data: payments }] =
    await Promise.all([
      supabase.from("suppliers").select("*"),
      supabase.from("purchase_bills").select("*"),
      supabase.from("payments").select("*"),
    ]);

  return suppliers?.map((supplier) => {
    const supplierBills =
      bills?.filter(
        (bill) =>
          bill.supplier_id === supplier.id
      ) || [];

    const supplierPayments =
      payments?.filter(
        (payment) =>
          payment.supplier_id === supplier.id
      ) || [];

    const billTotal = supplierBills.reduce(
      (sum, bill) => sum + Number(bill.amount),
      0
    );

    const paymentTotal = supplierPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount),
      0
    );

    return {
      supplierName: supplier.name,
      bills: billTotal,
      payments: paymentTotal,
      outstanding: billTotal - paymentTotal,
    };
  });
}