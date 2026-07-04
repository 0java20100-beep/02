"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode as QrIcon, Printer } from "lucide-react";
import { useMenu } from "@/context/menu-provider";
import {
  PageHeader,
  Card,
  Field,
  TextInput,
  Button,
} from "@/components/admin/ui";

interface TableQr {
  table: number;
  url: string;
  dataUrl: string;
}

export default function AdminTablesPage() {
  const { settings } = useMenu();
  const [count, setCount] = useState(10);
  const [baseUrl, setBaseUrl] = useState("");
  const [qrs, setQrs] = useState<TableQr[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setBaseUrl(window.location.origin);
  }, []);

  const generate = async () => {
    const origin = baseUrl.replace(/\/$/, "");
    const n = Math.max(1, Math.min(200, count));
    setGenerating(true);
    const results: TableQr[] = [];
    for (let table = 1; table <= n; table++) {
      const url = `${origin}/order?table=${table}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 480,
        margin: 2,
        color: { dark: "#07271b", light: "#ffffff" },
      });
      results.push({ table, url, dataUrl });
    }
    setQrs(results);
    setGenerating(false);
  };

  const download = (qr: TableQr) => {
    const a = document.createElement("a");
    a.href = qr.dataUrl;
    a.download = `sharqona-stol-${qr.table}.png`;
    a.click();
  };

  const printAll = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const cards = qrs
      .map(
        (qr) => `
        <div style="display:inline-flex;flex-direction:column;align-items:center;
          width:260px;margin:12px;padding:20px;border:1px solid #ddd;border-radius:16px;
          font-family:sans-serif;page-break-inside:avoid;">
          <div style="font-size:20px;font-weight:700;color:#07271b;">${settings.name}</div>
          <div style="font-size:14px;color:#666;margin-bottom:8px;">Stol #${qr.table}</div>
          <img src="${qr.dataUrl}" width="200" height="200" />
          <div style="font-size:12px;color:#888;margin-top:8px;">Skaner qiling va buyurtma bering</div>
        </div>`,
      )
      .join("");
    win.document.write(
      `<html><head><title>${settings.name} — QR kodlar</title></head>
       <body style="text-align:center;">${cards}</body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div>
      <PageHeader
        title="Stollar / QR kodlar"
        subtitle="Har bir stol uchun QR kod — skaner qilinganda sayt ochiladi"
      />

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stollar soni">
            <TextInput
              type="number"
              min={1}
              max={200}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </Field>
          <Field label="Sayt manzili (QR shu manzilga yo'naltiradi)">
            <TextInput
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://sharqona.uz"
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-muted">
          Har bir QR{" "}
          <code className="rounded bg-foreground/5 px-1">
            {baseUrl || "..."}/order?table=N
          </code>{" "}
          manzilini ochadi. Domain ulangach, manzilni shu yerda yangilab QR
          kodlarni qayta yarating.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={generate} disabled={generating}>
            <QrIcon className="h-4 w-4" />
            {generating ? "Yaratilmoqda..." : "QR kod yaratish"}
          </Button>
          {qrs.length > 0 && (
            <Button variant="outline" onClick={printAll}>
              <Printer className="h-4 w-4" /> Barchasini chop etish
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {qrs.map((qr) => (
          <Card key={qr.table} className="flex flex-col items-center text-center">
            <p className="mb-2 font-display text-lg font-bold">
              Stol #{qr.table}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.dataUrl}
              alt={`Stol ${qr.table} QR`}
              className="w-full max-w-[180px] rounded-xl"
            />
            <Button
              variant="outline"
              className="mt-3 !px-4 !py-2 text-xs"
              onClick={() => download(qr)}
            >
              <Download className="h-4 w-4" /> Yuklab olish
            </Button>
          </Card>
        ))}
      </div>

      {qrs.length === 0 && !generating && (
        <p className="py-16 text-center text-muted">
          QR kodlarni yaratish uchun yuqoridagi tugmani bosing
        </p>
      )}
    </div>
  );
}
