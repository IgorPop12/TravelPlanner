import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const pdfService = {
  generatePlanReport: (plan, destinations, activities, expenses, checklist) => {
    const doc = new jsPDF();
    const formatDate = (d) => new Date(d).toLocaleDateString('sr-RS');

    // Naslov
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(plan.name, 14, 20);

    // Osnovni podaci
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`, 14, 32);
    doc.text(`Budzet: EUR ${plan.budget}`, 14, 40);
    if (plan.description) doc.text(`Opis: ${plan.description}`, 14, 48);

    let y = plan.description ? 58 : 50;

    // Destinacije
    if (destinations.length > 0) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Destinacije', 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [['Naziv', 'Lokacija', 'Dolazak', 'Odlazak']],
        body: destinations.map(d => [
          d.name,
          d.location,
          formatDate(d.arrivalDate),
          formatDate(d.departureDate)
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Aktivnosti
    if (activities.length > 0) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Aktivnosti', 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [['Naziv', 'Datum', 'Lokacija', 'Status', 'Trosak (EUR)']],
        body: activities.map(a => [
          a.name,
          formatDate(a.date),
          a.location || '-',
          a.status,
          a.estimatedCost > 0 ? a.estimatedCost : '-'
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Troskovi
    if (expenses.length > 0) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Troskovi', 14, y);
      y += 4;

      const total = expenses.reduce((sum, e) => sum + e.amount, 0);

      autoTable(doc, {
        startY: y,
        head: [['Naziv', 'Kategorija', 'Iznos (EUR)', 'Datum']],
        body: [
          ...expenses.map(e => [e.name, e.category, e.amount, formatDate(e.date)]),
          ['UKUPNO', '', total.toFixed(2), '']
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] },
        foot: [['Preostali budzet', '', (plan.budget - total).toFixed(2), '']],
        footStyles: { fillColor: [5, 150, 105], textColor: 255 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Checklist
    if (checklist.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Checklist', 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [['Stavka', 'Status']],
        body: checklist.map(c => [c.name, c.isCompleted ? 'Zavrseno' : 'Nije zavrseno']),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] }
      });
    }

    // Footer na svakoj stranici
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `TravelPlanner | Generisano: ${new Date().toLocaleDateString('sr-RS')} | Stranica ${i} od ${pageCount}`,
        14, doc.internal.pageSize.height - 8
      );
    }

    doc.save(`${plan.name.replace(/\s+/g, '_')}_plan.pdf`);
  }
};