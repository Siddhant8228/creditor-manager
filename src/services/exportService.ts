export const exportToCSV = (
  filename: string,
  rows: any[]
) => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => row[header])
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const link =
    document.createElement("a");

  const url =
    URL.createObjectURL(blob);

  link.href = url;
  link.download =
    `${filename}.csv`;

  link.click();
};