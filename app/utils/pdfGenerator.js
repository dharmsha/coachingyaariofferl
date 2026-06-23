import jsPDF from 'jspdf';

export const generatePDF = async (formData) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  // Location & GST Configuration
  const locationConfig = {
    patna: {
      name: 'Patna',
      gstin: '10AAMCK7097E1ZG',
      address:
        '1st Floor, Siyaram Mansion, Opp. Telephone Exchange, Near P&M Mall, Khurji, Patna, Bihar – 800010',
    },
    purnea: {
      name: 'Purnea',
      gstin: '10AAMCK7097E1ZG',
      address:
        'First Floor, Shakuntala Sagar, Ct Station Rd, PWD Colony, Purnia, Bihar 854301',
    },
    noida: {
      name: 'Noida',
      gstin: '10AAMCK7097E1ZG',
      address:
        'G 94 (Basement), G Block, Sector 63, Noida, Chotpur, Uttar Pradesh 201301',
    },
    falka: {
      name: 'Falka, Katihar',
      gstin: '10AAMCK7097E1ZG',
      address:
        'Falka, Katihar District, Bihar - 855117',
    },
    katihar: {
      name: 'Katihar',
      gstin: '10AAMCK7097E1ZG',
      address:
        'Katihar, Bihar - 854105',
    },
  };

  const selectedLocation = formData.workLocation?.toLowerCase() || 'patna';
  const location = locationConfig[selectedLocation] || locationConfig.patna;

  // ========== MANUAL INPUTS - YAHAN SE SET KAREIN ==========
  const manualSettings = {
    workingHours: formData.workingHours || '10:00 AM - 07:00 PM',  // Manual se set karein
    workingDays: formData.workingDays || 'Tuesday to Sunday',      // Manual se set karein
    noticePeriod: formData.noticePeriod || '1 Month',              // Manual se set karein
    probationPeriod: formData.probationPeriod || '3 Months',       // Manual se set karein
  };
  // ========================================================

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
    doc.rect(0, 0, pageWidth, 52, 'F');

    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(0, 52, pageWidth, 2, 'F');

    if (logoImage) {
      doc.setFillColor(255, 255, 255, 0.15);
      doc.roundedRect(margin - 2, 10, 32, 32, 3, 3, 'F');
      doc.addImage(logoImage, 'PNG', margin, 12, 28, 28);
    }

    const infoX = margin + 35;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('COACHINGYAARI PRIVATE LIMITED', infoX, 20);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(location.address, pageWidth - infoX - margin);
    doc.text(addressLines, infoX, 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const contactY = 28 + addressLines.length * 4 + 2;
    doc.text('PH: +91 8084720333  |  WEB: www.coachingyaari.com', infoX, contactY);
    doc.setFont('helvetica', 'normal');
    doc.text(`GSTIN: ${location.gstin}  |  EMAIL: coachingyaari@gmail.com`, infoX, contactY + 7);

    return 70;
  };

  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  let yPosition = addHeader();

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('OFFER LETTER', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 18;

  doc.setFontSize(9);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(`REF: OFF/CY/${new Date().getFullYear()}/${formData.name.substring(0, 3).toUpperCase()}`, margin, yPosition);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 40, yPosition);
  yPosition += 12;

  doc.setFillColor(colors.lightBg[0], colors.lightBg[1], colors.lightBg[2]);
  doc.roundedRect(margin, yPosition, maxWidth, 30, 2, 2, 'F');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TO,', margin + 5, yPosition + 7);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(formData.name.toUpperCase(), margin + 5, yPosition + 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.designation} | ${formData.department}`, margin + 5, yPosition + 24);
  yPosition += 42;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Subject: Letter of Offer for Employment', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Dear ${formData.name},`, margin, yPosition);
  yPosition += 8;

  const intro = `Following our recent discussions, we are pleased to offer you a full-time position at COACHING YAARI PRIVATE LIMITED. We are confident that your expertise will be a significant asset to our educational excellence and organizational growth.`;
  const splitIntro = doc.splitTextToSize(intro, maxWidth);
  doc.text(splitIntro, margin, yPosition);
  yPosition += splitIntro.length * 5.5 + 10;

  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, yPosition, maxWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('REMUNERATION & KEY TERMS', margin + 5, yPosition + 5.5);
  yPosition += 15;

  // ========== TERMS - AB MANUAL SETTINGS USE KARENGE ==========
  const terms = [
    {
      label: 'Date of Joining',
      value: formData.joiningDate,
    },
    {
      label: 'Annual CTC',
      value: `Rs. ${formData.ctc} /-`,
    },
    {
      label: 'Designation',
      value: formData.designation,
    },
    {
      label: 'Work Location',
      value: `${location.name} - ${location.address}`,
    },
    {
      label: 'Probation',
      value: manualSettings.probationPeriod,  // Manual se set
    },
    {
      label: 'Notice Period',
      value: manualSettings.noticePeriod,      // Manual se set
    },
    {
      label: 'Working Hours',
      value: manualSettings.workingHours,      // Manual se set
    },
    {
      label: 'Working Days',
      value: manualSettings.workingDays,       // Manual se set
    },
  ];

  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.setFontSize(9);

  let extraHeight = 0;
  terms.forEach((term, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (maxWidth / 2);
    const y = yPosition + row * 12;

    doc.setFont('helvetica', 'bold');
    doc.text(`${term.label}:`, x, y);
    doc.setFont('helvetica', 'normal');

    let valueLines = [];
    if (term.label === 'Work Location') {
      valueLines = doc.splitTextToSize(term.value, 55);
      extraHeight = Math.max(extraHeight, (valueLines.length - 1) * 5);
    } else {
      valueLines = [term.value];
    }
    doc.text(valueLines, x + 32, y);
  });

  yPosition += 50 + extraHeight;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('For COACHINGYAARI PRIVATE LIMITED', margin, yPosition);

  if (hrSignature) {
    doc.addImage(hrSignature, 'PNG', margin + 5, yPosition + 2, 50, 20);
  }
  yPosition += 28;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Apurwa Kumari ', margin, yPosition);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('HR Manager - Human Resources Department', margin, yPosition + 5);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('(Digitally Authorized Signature)', margin, yPosition + 10);

  yPosition += 24;

  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPosition, maxWidth, 32, 'F');
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.rect(margin, yPosition, maxWidth, 32, 'S');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text('DECLARATION & ACCEPTANCE', margin + 5, yPosition + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('I accept the above offer and agree to the terms and conditions.', margin + 5, yPosition + 16);
  doc.line(margin + 5, yPosition + 25, margin + 65, yPosition + 25);
  doc.text('Candidate Signature & Date', margin + 5, yPosition + 29);

  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('COACHINGYAARI PRIVATE LIMITED | Confidential Document', pageWidth / 2, pageHeight - 12, {
    align: 'center',
  });

  doc.save(`Offer_Letter_${formData.name.replace(/\s+/g, '_')}_${location.name}.pdf`);
};