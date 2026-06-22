type CsvColumn<T> = {
  header: string;
  getValue: (row: T, index: number) => unknown;
};

type DownloadCsvParams<T> = {
  filename: string;
  rows: T[];
  columns: CsvColumn<T>[];
  separator?: string;
};

function escapeCsvValue(value: unknown, separator: string) {
  const text = String(value ?? "");

  const mustBeQuoted =
    text.includes(separator) ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r");

  const escapedText = text.replaceAll('"', '""');

  return mustBeQuoted ? `"${escapedText}"` : escapedText;
}

export function downloadCsv<T>({
  filename,
  rows,
  columns,
  separator = ";",
}: DownloadCsvParams<T>) {
  const headers = columns.map((column) =>
    escapeCsvValue(column.header, separator),
  );

  const lines = rows.map((row, index) =>
    columns
      .map((column) => escapeCsvValue(column.getValue(row, index), separator))
      .join(separator),
  );

  const csvContent = ["\uFEFF" + headers.join(separator), ...lines].join("\r\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}