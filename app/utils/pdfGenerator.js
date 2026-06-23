import jsPDF from 'jspdf';

export const generatePDF = async (formData) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 12;
  const maxWidth = pageWidth - margin * 2;

  // ========== DIRECT FORM DATA SE LO - FULLY MANUAL ==========
  const location = {
    name: formData.workLocation || 'Patna, Bihar',
    address: formData.workAddress || '1st Floor, Siyaram Mansion, Opp. Telephone Exchange, Near P&M Mall, Khurji, Patna, Bihar – 800010',
    gstin: formData.gstin || '10AAJCV6337M1Z2',
    pincode: formData.pincode || '800010',
  };
  // ==========================================================

  // ========== MANUAL INPUTS ==========
  const manualSettings = {
    workingHours: formData.workingHours || '10:00 AM - 07:00 PM',
    workingDays: formData.workingDays || 'Tuesday to Sunday',
    noticePeriod: formData.noticePeriod || '1 Month',
    probationPeriod: formData.probationPeriod || '3 Months',
  };
  // ==================================

  const colors = {
    primary: [26, 35, 126],
    secondary: [63, 81, 181],
    accent: [0, 121, 107],
    border: [210, 214, 220],
    lightBg: [245, 247, 251],
    textDark: [15, 23, 42],
  };

  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const logoImage = await loadImage('/cm.jpeg');
  const hrSignature = await loadImage('/hrs-ign.jpeg');

  const addHeader = () => {
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 38, 'F');

    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(0, 38, pageWidth, 2, 'F');

    if (logoImage) {
      doc.setFillColor(255, 255, 255, 0.15);
      doc.roundedRect(margin - 2, 6, 24, 24, 3, 3, 'F');
      doc.addImage(logoImage, 'PNG', margin, 8, 20, 20);
    }

    const infoX = margin + 28;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('COACHINGYAARI PRIVATE LIMITED', infoX, 14);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(location.address, pageWidth - infoX - margin);
    doc.text(addressLines, infoX, 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    const contactY = 20 + addressLines.length * 3 + 1;
    doc.text('PH: +91 9973725719  |  WEB: www.coachingyaari.com', infoX, contactY);
    doc.setFont('helvetica', 'normal');
    doc.text(`GSTIN: ${location.gstin}  |  EMAIL: coachingyaari@gmail.com`, infoX, contactY + 4);

    return 52;
  };

  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.rect(4, 4, pageWidth - 8, pageHeight - 8);

  let yPosition = addHeader();

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('OFFER LETTER', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  doc.setFontSize(7);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(`REF: OFF/CY/${new Date().getFullYear()}/${formData.name?.substring(0, 3).toUpperCase() || 'XXX'}`, margin, yPosition);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 40, yPosition);
  yPosition += 8;

  doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2]);
  doc.roundedRect(margin, yPosition, maxWidth, 20, 2, 2, 'F');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('TO,', margin + 4, yPosition + 5);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(formData.name?.toUpperCase() || 'CANDIDATE', margin + 4, yPosition + 11);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.designation || ''} | ${formData.department || ''}`, margin + 4, yPosition + 17);
  yPosition += 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Subject: Letter of Offer for Employment', margin, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Dear ${formData.name || 'Candidate'},`, margin, yPosition);
  yPosition += 5;

  const intro = `Following our recent discussions, we are pleased to offer you a full-time position at COACHINGYAARI PRIVATE LIMITED. We are confident that your expertise will be a significant asset to our educational excellence and organizational growth.`;
  const splitIntro = doc.splitTextToSize(intro, maxWidth);
  doc.text(splitIntro, margin, yPosition);
  yPosition += splitIntro.length * 4 + 5;

  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, yPosition, maxWidth, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('REMUNERATION & KEY TERMS', margin + 4, yPosition + 4);
  yPosition += 10;

  // ========== TERMS - 2 COLUMNS ==========
  const terms = [
    { label: 'Date of Joining', value: formData.joiningDate || 'Not Specified' },
    { label: 'Annual CTC', value: `Rs. ${formData.ctc || '0'} /-` },
    { label: 'Designation', value: formData.designation || 'Not Specified' },
    { label: 'Work Location', value: location.name },
    { label: 'Address', value: location.address },
    { label: 'Pincode', value: location.pincode },
    { label: 'GSTIN', value: location.gstin },
    { label: 'Probation Period', value: manualSettings.probationPeriod },
    { label: 'Notice Period', value: manualSettings.noticePeriod },
    { label: 'Working Hours', value: manualSettings.workingHours },
    { label: 'Working Days', value: manualSettings.workingDays },
  ];

  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.setFontSize(7);

  let addressLines = [];
  let addressExtraHeight = 0;
  terms.forEach((term) => {
    if (term.label === 'Address') {
      addressLines = doc.splitTextToSize(term.value, 50);
      addressExtraHeight = Math.max(addressExtraHeight, (addressLines.length - 1) * 3.5);
    }
  });

  const rowHeight = 8 + addressExtraHeight;

  terms.forEach((term, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (maxWidth / 2);
    const y = yPosition + row * rowHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`${term.label}:`, x, y);
    doc.setFont('helvetica', 'normal');

    let valueLines = [];
    if (term.label === 'Address') {
      valueLines = doc.splitTextToSize(term.value, 50);
    } else {
      valueLines = [term.value];
    }
    doc.text(valueLines, x + 30, y);
  });

  const totalRows = Math.ceil(terms.length / 2);
  yPosition += totalRows * rowHeight + 6;

  // ========== SIGNATURE SECTION ==========
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('For COACHINGYAARI PRIVATE LIMITED', margin, yPosition);

  if (hrSignature) {
    doc.addImage(hrSignature, 'PNG', margin + 4, yPosition + 2, 40, 16);
  }
  yPosition += 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Apurwa Kumari', margin, yPosition);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('HR Manager - Human Resources Department', margin, yPosition + 4);
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text('(Digitally Authorized Signature)', margin, yPosition + 8);

  yPosition += 16;

  // ========== DECLARATION SECTION ==========
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPosition, maxWidth, 24, 'F');
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.rect(margin, yPosition, maxWidth, 24, 'S');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text('DECLARATION & ACCEPTANCE', margin + 4, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('I accept the above offer and agree to the terms and conditions.', margin + 4, yPosition + 11);
  doc.line(margin + 4, yPosition + 17, margin + 50, yPosition + 17);
  doc.text('Candidate Signature & Date', margin + 4, yPosition + 21);

  // ========== FOOTER ==========
  doc.setFontSize(5);
  doc.setTextColor(150, 150, 150);
  doc.text('COACHINGYAARI PRIVATE LIMITED | Confidential Document', pageWidth / 2, pageHeight - 8, {
    align: 'center',
  });

  doc.save(`Offer_Letter_${(formData.name || 'Candidate').replace(/\s+/g, '_')}.pdf`);
};