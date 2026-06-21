import { supabase } from "../lib/supabase";

export async function getSupplierLedger(
  supplierId: string
) {
  const [{ data: bills }, { data: payments }] =
    await Promise.all([
      supabase
        .from("purchase_bills")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("bill_date"),

      supabase
        .from("payments")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("payment_date"),
    ]);

  const totalBills =
    bills?.reduce(
      (sum, bill) => sum + Number(bill.amount),
      0
    ) || 0;

  const totalPayments =
    payments?.reduce(
      (sum, payment) =>
        sum + Number(payment.amount),
      0
    ) || 0;

  return {
    bills: bills || [],
    payments: payments || [],
    totalBills,
    totalPayments,
    outstanding:
      totalBills - totalPayments,
  };
}