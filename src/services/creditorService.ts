import { supabase } from "../lib/supabase";

export async function getDashboardMetrics() {
  const [{ data: bills }, { data: payments }, { data: suppliers }] =
    await Promise.all([
      supabase.from("purchase_bills").select("*"),
      supabase.from("payments").select("*"),
      supabase.from("suppliers").select("*"),
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
    totalOutstanding:
      totalBills - totalPayments,
    totalBills,
    totalPayments,
    overdueAmount: 0,
    dueThisWeek: 0,
    supplierCount:
      suppliers?.length || 0,
  };
}