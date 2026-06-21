export interface Supplier {
  id: string;
  name: string;
  phone: string;
  gst: string;
  credit_days: number;
}

export interface PurchaseBill {
  id: string;
  supplier_id: string;
  bill_number: string;
  bill_date: string;
  due_date: string;
  amount: number;
}

export interface Payment {
  id: string;
  supplier_id: string;
  payment_date: string;
  amount: number;
  payment_mode: string;
}