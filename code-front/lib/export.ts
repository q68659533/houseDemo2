import type { MarketProperty } from "./api";

interface ColumnSpec {
  key: keyof MarketProperty;
  label: string;
  csvValue: (p: MarketProperty) => string;
  displayValue: (p: MarketProperty) => string;
  align: "left" | "right";
}

const EXPORT_COLUMNS: ColumnSpec[] = [
  {
    key: "squareFootage",
    label: "面积 (sq ft)",
    csvValue: (p) => String(p.squareFootage),
    displayValue: (p) => p.squareFootage.toLocaleString(),
    align: "right",
  },
  {
    key: "bedrooms",
    label: "卧室",
    csvValue: (p) => String(p.bedrooms),
    displayValue: (p) => String(p.bedrooms),
    align: "right",
  },
  {
    key: "bathrooms",
    label: "浴室",
    csvValue: (p) => p.bathrooms.toFixed(1),
    displayValue: (p) => p.bathrooms.toFixed(1),
    align: "right",
  },
  {
    key: "yearBuilt",
    label: "建造年份",
    csvValue: (p) => String(p.yearBuilt),
    displayValue: (p) => String(p.yearBuilt),
    align: "right",
  },
  {
    key: "lotSize",
    label: "占地面积",
    csvValue: (p) => String(p.lotSize),
    displayValue: (p) => p.lotSize.toLocaleString(),
    align: "right",
  },
  {
    key: "distanceToCityCenter",
    label: "距市中心 (mi)",
    csvValue: (p) => p.distanceToCityCenter.toFixed(1),
    displayValue: (p) => p.distanceToCityCenter.toFixed(1),
    align: "right",
  },
  {
    key: "schoolRating",
    label: "学校评分",
    csvValue: (p) => String(p.schoolRating),
    displayValue: (p) => String(p.schoolRating),
    align: "right",
  },
  {
    key: "predictedPrice",
    label: "预测价格",
    csvValue: (p) => p.predictedPrice.toFixed(2),
    displayValue: (p) =>
      `$${p.predictedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    align: "right",
  },
];

export const PDF_MAX_ROWS = 100;

function escapeCsv(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateForFilename(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildCsv(properties: MarketProperty[]): string {
  const header = EXPORT_COLUMNS.map((c) => escapeCsv(c.label)).join(",");
  const rows = properties.map((p) =>
    EXPORT_COLUMNS.map((c) => escapeCsv(c.csvValue(p))).join(",")
  );
  return "﻿" + [header, ...rows].join("\r\n");
}

export function downloadCsv(
  properties: MarketProperty[],
  filenamePrefix = "property-data"
): void {
  const csv = buildCsv(properties);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenamePrefix}_${formatDateForFilename(new Date())}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildPrintHtml(properties: MarketProperty[]): string {
  const subset = properties.slice(0, PDF_MAX_ROWS);
  const date = formatDateForFilename(new Date());

  const headers = EXPORT_COLUMNS.map(
    (c) =>
      `<th style="text-align:${c.align}">${escapeHtml(c.label)}</th>`
  ).join("");

  const rows = subset
    .map(
      (p) =>
        "<tr>" +
        EXPORT_COLUMNS.map(
          (c) =>
            `<td style="text-align:${c.align}">${escapeHtml(c.displayValue(p))}</td>`
        ).join("") +
        "</tr>"
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>市场数据明细 ${date}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif; margin: 24px; color: #1f2937; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { padding: 6px 8px; border: 1px solid #d1d5db; }
  th { background: #f3f4f6; font-weight: 600; text-transform: none; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  tfoot { font-size: 10px; color: #6b7280; }
  @media print {
    body { margin: 12mm; }
    @page { size: A4 landscape; }
  }
</style>
</head>
<body>
  <h1>市场数据明细</h1>
  <div class="meta">导出日期：${date} · 总记录数：${properties.length} · 本次打印：${subset.length} 条</div>
  <table>
    <thead><tr>${headers}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <script>
    window.addEventListener('load', function() {
      window.focus();
      window.print();
    });
  </script>
</body>
</html>`;
}

export function printPdf(properties: MarketProperty[]): void {
  const html = buildPrintHtml(properties);
  const win = window.open("", "_blank");
  if (!win) {
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
