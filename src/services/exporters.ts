import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import type { Prescription, Invoice } from '../types';

type Cell = string | number;
export type ExportRow = Record<string, Cell>;

const INK = '#1B1D22';

function download(blob: Blob, filename: string){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(filename: string, rows: ExportRow[]){
  if(!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (v: Cell) => `"${String(v).replace(/"/g,'""')}"`;
  const csv = [headers.join(','), ...rows.map(r=>headers.map(h=>esc(r[h])).join(','))].join('\n');
  download(new Blob([`\uFEFF${csv}`], {type:'text/csv;charset=utf-8'}), `${filename}-${dayjs().format('YYYYMMDD')}.csv`);
}

export function exportExcel(filename: string, sheetName: string, rows: ExportRow[]){
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = Object.keys(rows[0] ?? {}).map(h=>({ wch: Math.max(h.length+4, ...rows.map(r=>String(r[h]).length+2)) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0,30));
  XLSX.writeFile(wb, `${filename}-${dayjs().format('YYYYMMDD')}.xlsx`);
}

function letterhead(doc: jsPDF, title: string, subtitle?: string){
  doc.setFillColor(42, 76, 219);
  doc.rect(0, 0, 210, 3.5, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(INK);
  doc.text('MediCare HMS', 14, 18);
  doc.setFont('courier','normal'); doc.setFontSize(8); doc.setTextColor(120);
  doc.text('12 MG Road, Bengaluru · +91 80 4000 1000', 14, 23);
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(INK);
  doc.text(title, 14, 33);
  if(subtitle){ doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(100); doc.text(subtitle, 14, 38); }
}

export function exportTablePDF(filename: string, title: string, subtitle: string | undefined, rows: ExportRow[]){
  if(!rows.length) return;
  const doc = new jsPDF();
  letterhead(doc, title, `${subtitle} · Generated ${dayjs().format('MMM D, YYYY HH:mm')} · ${rows.length} records`);

  const headers = Object.keys(rows[0]);
  const colW = 182 / headers.length;
  let y = 46;
  doc.setFillColor(246,245,241); doc.rect(14, y-5, 182, 7, 'F');
  doc.setFont('courier','bold'); doc.setFontSize(7.5); doc.setTextColor(INK);
  headers.forEach((h,i)=>doc.text(h.toUpperCase().slice(0,18), 16+i*colW, y));
  y += 6;
  doc.setFont('helvetica','normal');
  rows.forEach((r,ri)=>{
    if(y > 280){ doc.addPage(); y = 20; }
    if(ri%2===1){ doc.setFillColor(250,250,248); doc.rect(14, y-4, 182, 6, 'F'); }
    headers.forEach((h,i)=>{
      doc.setFontSize(7.5); doc.text(String(r[h]).slice(0,26), 16+i*colW, y);
    });
    y += 6;
  });
  doc.setFontSize(7); doc.setTextColor(150);
  doc.text('MediCare HMS — system generated document', 14, 290);
  doc.save(`${filename}-${dayjs().format('YYYYMMDD')}.pdf`);
}

export function exportInvoicePDF(invoice: Invoice){
  const doc = new jsPDF();
  letterhead(doc, 'Invoice ' + invoice.id, `Patient: ${invoice.patient} · Date: ${dayjs(invoice.date).format('MMM D, YYYY')} · Status: ${invoice.status}`);
  let y = 50;
  doc.setFillColor(246,245,241); doc.rect(14, y-5, 182, 7, 'F');
  doc.setFont('courier','bold'); doc.setFontSize(8);
  doc.text('DESCRIPTION', 16, y); doc.text('AMOUNT (INR)', 150, y);
  y += 7; doc.setFont('helvetica','normal');
  invoice.items.forEach(it=>{
    doc.setFontSize(9); doc.text(it.label.slice(0,60), 16, y);
    doc.text(`Rs. ${it.amount.toLocaleString('en-IN')}`, 150, y);
    y += 7;
  });
  doc.setDrawColor(200); doc.line(14, y, 196, y); y += 8;
  doc.setFont('helvetica','bold'); doc.setFontSize(11);
  const total = invoice.items.reduce((s,i)=>s+i.amount,0);
  doc.text('TOTAL', 16, y); doc.text(`Rs. ${total.toLocaleString('en-IN')}`, 150, y);
  doc.save(`${invoice.id}.pdf`);
}

export function exportPrescriptionPDF(rx: Prescription){
  const doc = new jsPDF();
  letterhead(doc, 'Prescription ' + rx.id, `Patient: ${rx.patient} · Prescribed by ${rx.doctor} · ${dayjs(rx.date).format('MMM D, YYYY')}`);
  let y = 48;
  rx.items.forEach((it,i)=>{
    doc.setFont('helvetica','bold'); doc.setFontSize(10);
    doc.text(`${i+1}. ${it.medicine}`, 16, y); y+=5.5;
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(80);
    doc.text(`   ${it.dose} · ${it.frequency} · ${it.duration}`, 16, y); y+=8;
  });
  if(rx.notes){
    y+=2; doc.setFillColor(246,245,241); doc.roundedRect(14, y-5, 182, 16, 2, 2, 'F');
    doc.setFont('courier','bold'); doc.setFontSize(7); doc.text('ADVICE / NOTES', 17, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text(rx.notes.slice(0,90), 17, y+4);
  }
  doc.setFontSize(8); doc.setTextColor(120);
  doc.text('Get well soon — MediCare HMS', 14, 285);
  doc.save(`${rx.id}.pdf`);
}
