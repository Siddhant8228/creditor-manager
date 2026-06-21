import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportOutstandingToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Outstanding Report"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    file,
    `Outstanding_Report_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`
  );
}