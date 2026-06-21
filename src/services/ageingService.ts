import { supabase } from "../lib/supabase";

export async function getAgeingData() {
  const { data: bills } = await supabase
    .from("purchase_bills")
    .select("*");

  const today = new Date();

  let bucket0to30 = 0;
  let bucket31to60 = 0;
  let bucket61to90 = 0;
  let bucket90plus = 0;

  bills?.forEach((bill) => {
    const dueDate = new Date(bill.due_date);

    const days =
      (today.getTime() -
        dueDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (days <= 30)
      bucket0to30 += Number(bill.amount);

    else if (days <= 60)
      bucket31to60 += Number(bill.amount);

    else if (days <= 90)
      bucket61to90 += Number(bill.amount);

    else
      bucket90plus += Number(bill.amount);
  });

  return {
    bucket0to30,
    bucket31to60,
    bucket61to90,
    bucket90plus,
  };
}