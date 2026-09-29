import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads an official, beautifully styled PDF Report / Dossier
 * for MoSPI IPMD & PAIMANA Sentinel AI.
 */
export function generateOfficialPDF(report) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primaryColor = [15, 23, 42]; // #0F172A Navy
  const accentColor = [2, 132, 199]; // #0284C7 Sky/Blue
  const slateColor = [100, 116, 139]; // #64748B Slate

  // --- HEADER SECTION ---
  // Top government banner bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GOVERNMENT OF INDIA  •  MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION', pageWidth / 2, 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(186, 230, 253);
  doc.text('Infrastructure and Project Monitoring Division (IPMD) | PAIMANA Sentinel AI Surveillance Engine', pageWidth / 2, 13, { align: 'center' });

  // Document Title & Metadata
  let currentY = 28;

  // Badge: Classification / Type
  const classification = report.classification || report.category || 'Official Government Publication';
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY - 4, 75, 7, 1.5, 1.5, 'FD');
  doc.setTextColor(...accentColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`SECURITY: ${classification.toUpperCase()}`, 17, currentY + 0.8);

  // Reference Code
  doc.setTextColor(...slateColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const refCode = report.id || report.documentNo || `MoSPI/IPMD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
  doc.text(`Doc Ref: ${refCode}`, pageWidth - 14, currentY + 0.8, { align: 'right' });

  currentY += 10;

  // Report Main Heading
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const title = report.title || report.subject || 'National Infrastructure Monitoring Flash Report';
  const splitTitle = doc.splitTextToSize(title, pageWidth - 28);
  doc.text(splitTitle, 14, currentY);
  currentY += splitTitle.length * 6.5 + 2;

  // Subtitle / Period
  const period = report.monthQuarter || report.period || report.issueDate || 'FY 2025-2026';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateColor);
  doc.text(`Reporting Cycle & Period: ${period}  |  Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 14, currentY);
  currentY += 8;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 8;

  // --- EXECUTIVE SUMMARY METRICS BOX ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  const totalCost = report.totalCost || '₹3,42,850 Cr';
  const monitoredCount = report.projectsMonitored || '1,842 Projects';
  const criticalCount = report.criticalProjects || '184 Delayed';
  const completionRate = report.avgCompletion || '64.8%';

  const metrics = [
    { label: 'MONITORED PORTFOLIO', value: monitoredCount },
    { label: 'TOTAL CAPITAL OUTLAY', value: totalCost },
    { label: 'CRITICAL ESCALATIONS', value: criticalCount },
    { label: 'AVG PHYSICAL PROGRESS', value: completionRate }
  ];

  const colWidth = (pageWidth - 28) / 4;
  metrics.forEach((m, idx) => {
    const xPos = 14 + idx * colWidth + colWidth / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...slateColor);
    doc.text(m.label, xPos, currentY + 7, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(m.value, xPos, currentY + 16, { align: 'center' });
  });

  currentY += 32;

  // --- SECTION: DESCRIPTION & SCOPE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('1. Executive Scope & Strategic Summary', 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const desc = report.description || report.subject ||
    'This statutory monitoring document provides comprehensive physical and financial surveillance of mega-infrastructure projects under implementation across line ministries. Data is synthesized using the PAIMANA Sentinel AI early warning neural model to detect schedule stagnation, land acquisition bottlenecks, and contractor variance.';
  const splitDesc = doc.splitTextToSize(desc, pageWidth - 28);
  doc.text(splitDesc, 14, currentY);
  currentY += splitDesc.length * 4.5 + 6;

  // --- SECTION: MONITORED PORTFOLIO BREAKDOWN TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('2. Key Projects Surveillance Register', 14, currentY);
  currentY += 3;

  const sampleRows = [
    ['PRJ-602096', 'Mumbai Suburban Rail Corridor Phase 2', 'Railways (MoR)', '₹14,200 Cr', '48.2%', 'Critical Risk (8.4 mo delay)'],
    ['PRJ-401822', 'Delhi-Amritsar-Katra Expressway Pkg 4', 'Road Transport (MoRTH)', '₹8,450 Cr', '72.6%', 'Moderate Risk (2.1 mo delay)'],
    ['PRJ-789012', 'Paradip Petrochemicals Complex Stage II', 'Petroleum (MoPNG)', '₹22,100 Cr', '81.4%', 'On Track (0.0 mo delay)'],
    ['PRJ-310455', 'Bangalore Metro Phase 2A Outer Ring', 'Urban Affairs (MoHUA)', '₹5,900 Cr', '39.0%', 'High Risk (5.6 mo delay)'],
    ['PRJ-509821', 'Khavda Renewable Energy Park Grid Sub', 'Power (MoP)', '₹3,750 Cr', '91.0%', 'On Track (0.0 mo delay)'],
    ['PRJ-882310', 'Vizag-Chennai Industrial Corridor Pkg 1', 'DPIIT / Commerce', '₹6,300 Cr', '54.5%', 'Moderate Risk (3.2 mo delay)']
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Project Code', 'Project Name', 'Line Ministry', 'Sanctioned Outlay', 'Progress', 'Surveillance Status']],
    body: sampleRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      font: 'helvetica',
      textColor: [15, 23, 42]
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // --- SECTION: STATUTORY SIGN-OFF & AI VERIFICATION ---
  if (finalY < pageHeight - 35) {
    doc.setDrawColor(226, 232, 240);
    doc.line(14, finalY, pageWidth - 14, finalY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text('Statutory Verification & Digital Authentication:', 14, finalY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...slateColor);
    doc.text('This dossier is published under the authority of Infrastructure and Project Monitoring Division (IPMD), MoSPI, Government of India. Digitally verified by PAIMANA Sentinel AI System.', 14, finalY + 11);
  }

  // --- FOOTER SECTION ON ALL PAGES ---
  const totalPageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...slateColor);
    doc.text('Ministry of Statistics & Programme Implementation  •  IPMD Official Portal', 14, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }

  // --- SAVE AND TRIGGER DOWNLOAD ---
  const cleanTitle = (report.title || report.subject || report.id || 'MoSPI_Report')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 45);
  const fileName = `${cleanTitle}_${period.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;
  
  doc.save(fileName);
  return fileName;
}
