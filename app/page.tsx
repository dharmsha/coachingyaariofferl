"use client";
import { useState, useRef, useEffect } from "react";
import { generatePDF } from "@/app/utils/pdfGenerator";

import { 
  FileText, Download, Printer, Building, User, 
  ArrowRight, Sparkles, Award, Calendar, Mail, Phone, 
  MapPin, Clock, Briefcase, CheckCircle, X, AlertCircle, Edit, Copy, 
  BriefcaseBusiness, MapPinned, CalendarDays, UserRound, 
  AtSign, PhoneCall, Fingerprint
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    type: 'offer'
  });

  // ==================== OFFER LETTER FORM ====================
  const [offerFormData, setOfferFormData] = useState({
    candidateName: '',
    jobTitle: '',
    department: '',
    joiningDate: '2024-04-01',
    workLocation: 'Patna, Bihar',           // ✅ Manual input
    workAddress: '1st Floor, Siyaram Mansion, Opp. Telephone Exchange, Near P&M Mall, Khurji, Patna, Bihar – 800010', // ✅ Manual input
    pincode: '800010',                       // ✅ Manual input (NEW)
    gstin: '10AAJCV6337M1Z2',                // ✅ Manual input
    reportingManager: '',
    ctc: '',
    probationPeriod: '3 Months',
    noticePeriod: '1 Month',
    workingHours: '10:00 AM - 07:00 PM',
    workingDays: 'Tuesday to Sunday',
    companyName: 'COACHINGYAARI PRIVATE LIMITED',
    companyPhone: '9973725719',
    companyEmail: 'coachingyaari@gmail.com',
    hrName: 'Apurwa Kumari',
    hrDesignation: 'HR Manager',
    offerDate: new Date().toISOString().split('T')[0]
  });
  
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved logo
  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) setLogoPreview(savedLogo);
  }, []);

  // ==================== OFFER HANDLERS ====================
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setOfferFormData({ ...offerFormData, [e.target.name]: e.target.value });
  };

  // ==================== LOGO HANDLERS ====================
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setLogoPreview(result);
          localStorage.setItem('companyLogo', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    localStorage.removeItem('companyLogo');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ==================== PDF GENERATION ====================
  const handleGenerateOfferPDF = async () => {
    const mappedFormData = {
      name: offerFormData.candidateName,
      designation: offerFormData.jobTitle,
      joiningDate: offerFormData.joiningDate,
      ctc: offerFormData.ctc,
      reportingManager: offerFormData.reportingManager,
      workLocation: offerFormData.workLocation,
      workAddress: offerFormData.workAddress,
      pincode: offerFormData.pincode,
      gstin: offerFormData.gstin,
      department: offerFormData.department,
      probationPeriod: offerFormData.probationPeriod,
      noticePeriod: offerFormData.noticePeriod,
      workingHours: offerFormData.workingHours,
      workingDays: offerFormData.workingDays,
      companyName: offerFormData.companyName,
      companyPhone: offerFormData.companyPhone,
      companyEmail: offerFormData.companyEmail,
      hrName: offerFormData.hrName,
      hrDesignation: offerFormData.hrDesignation,
      offerDate: offerFormData.offerDate
    };
    
    await generatePDF(mappedFormData);
    
    setModalData({
      title: 'Offer Letter Generated!',
      message: `Offer letter for ${offerFormData.candidateName} has been generated successfully.`,
      type: 'offer'
    });
    setShowSuccessModal(true);
  };

  // ==================== UTILITIES ====================
  const handlePrint = () => window.print();
  
  const handleCopyToClipboard = () => {
    const text = JSON.stringify(offerFormData, null, 2);
    navigator.clipboard.writeText(text).then(() => alert('Data copied to clipboard!'));
  };

  const handleResetForm = () => {
    setOfferFormData({
      candidateName: '',
      jobTitle: '',
      department: '',
      joiningDate: '',
      workLocation: 'Patna, Bihar',
      workAddress: '1st Floor, Siyaram Mansion, Opp. Telephone Exchange, Near P&M Mall, Khurji, Patna, Bihar – 800010',
      pincode: '800010',
      gstin: '10AAJCV6337M1Z2',
      reportingManager: '',
      ctc: '',
      probationPeriod: '3 Months',
      noticePeriod: '1 Month',
      workingHours: '10:00 AM - 07:00 PM',
      workingDays: 'Tuesday to Sunday',
      companyName: 'COACHINGYAARI PRIVATE LIMITED',
      companyPhone: '9973725719',
      companyEmail: 'support@coachingyaari.com',
      hrName: 'Apurwa Kumari',
      hrDesignation: 'HR Manager',
      offerDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{modalData.title}</h3>
              </div>
              <button onClick={() => setShowSuccessModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{modalData.message}</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowSuccessModal(false)} className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">Close</button>
              <button onClick={handlePrint} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Printer className="h-4 w-4" /><span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <main className="flex w-full max-w-5xl flex-col items-center mx-auto py-8 px-4 md:px-8">
          
          {/* Hero Section */}
          <div className="w-full text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
              <Award className="h-5 w-5" />
              <span className="font-medium">Professional Document Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Create <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Offer Letter</span> in Minutes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate professional offer letters with company branding and legal compliance
            </p>
          </div>

          {/* Logo Upload Section */}
          <div className="w-full max-w-3xl mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${logoPreview ? 'bg-green-100' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
                    {logoPreview ? <img src={logoPreview} alt="Logo" className="h-8 w-8 object-contain" /> : <Building className="h-8 w-8 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">Company Logo</h3>
                    <p className="text-xs text-gray-500">Upload logo for offer letter (Optional - default logo will be used)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {logoPreview ? (
                    <>
                      <button onClick={handleRemoveLogo} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">Remove</button>
                      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Change</button>
                    </>
                  ) : (
                    <>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                      <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">Upload Logo (Optional)</label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Bar */}
          <div className="w-full max-w-3xl mb-4">
            <div className="flex justify-end gap-3">
              <button onClick={handleCopyToClipboard} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Copy className="h-4 w-4" /><span>Copy Data</span>
              </button>
              <button onClick={handleResetForm} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="h-4 w-4" /><span>Reset Form</span>
              </button>
            </div>
          </div>

          {/* ==================== OFFER LETTER FORM ==================== */}
          <div className="w-full max-w-3xl space-y-5">
            {/* Employee Details Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Employee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name *</label>
                  <input type="text" name="candidateName" value={offerFormData.candidateName} onChange={handleOfferChange} placeholder="Enter full name" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input type="text" name="jobTitle" value={offerFormData.jobTitle} onChange={handleOfferChange} placeholder="e.g., Software Engineer" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" name="department" value={offerFormData.department} onChange={handleOfferChange} placeholder="e.g., Engineering" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
                  <input type="date" name="joiningDate" value={offerFormData.joiningDate} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
                  <input type="text" name="reportingManager" value={offerFormData.reportingManager} onChange={handleOfferChange} placeholder="Manager name" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual CTC (₹)</label>
                  <input type="text" name="ctc" value={offerFormData.ctc} onChange={handleOfferChange} placeholder="e.g., 12,00,000" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probation Period</label>
                  <input 
                    type="text" 
                    name="probationPeriod" 
                    value={offerFormData.probationPeriod} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., 3 Months"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                  <input 
                    type="text" 
                    name="noticePeriod" 
                    value={offerFormData.noticePeriod} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., 1 Month"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                  <input 
                    type="text" 
                    name="workingHours" 
                    value={offerFormData.workingHours} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., 10:00 AM - 07:00 PM"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <input 
                    type="text" 
                    name="workingDays" 
                    value={offerFormData.workingDays} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., Monday to Friday"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Location Details Section - FULLY MANUAL */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPinned className="h-5 w-5 mr-2 text-green-600" />
                Location Details (Manual Entry)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Location *</label>
                  <input 
                    type="text" 
                    name="workLocation" 
                    value={offerFormData.workLocation} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., Patna, Bihar"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter city and state (e.g., Patna, Bihar)</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Address *</label>
                  <textarea 
                    name="workAddress" 
                    value={offerFormData.workAddress} 
                    onChange={handleOfferChange} 
                    rows={2}
                    placeholder="Enter complete office address"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input 
                    type="text" 
                    name="pincode" 
                    value={offerFormData.pincode} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., 800010"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN *</label>
                  <input 
                    type="text" 
                    name="gstin" 
                    value={offerFormData.gstin} 
                    onChange={handleOfferChange} 
                    placeholder="e.g., 10AAJCV6337M1Z2"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter GSTIN number manually</p>
                </div>
              </div>
            </div>

            {/* Company Details Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-purple-600" />
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" name="companyName" value={offerFormData.companyName} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" name="companyPhone" value={offerFormData.companyPhone} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="companyEmail" value={offerFormData.companyEmail} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HR Name</label>
                  <input type="text" name="hrName" value={offerFormData.hrName} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HR Designation</label>
                  <input type="text" name="hrDesignation" value={offerFormData.hrDesignation} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Date</label>
                  <input type="date" name="offerDate" value={offerFormData.offerDate} onChange={handleOfferChange} className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
              </div>
            </div>

            {/* Summary Card - Updated with all fields */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600">Candidate</p>
                  <p className="font-semibold text-blue-700 truncate">{offerFormData.candidateName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Position</p>
                  <p className="font-semibold text-blue-700 truncate">{offerFormData.jobTitle || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">CTC</p>
                  <p className="font-semibold text-green-600">₹{offerFormData.ctc || '0'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Location</p>
                  <p className="font-semibold text-purple-600 truncate text-sm">{offerFormData.workLocation || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pincode</p>
                  <p className="font-semibold text-indigo-600">{offerFormData.pincode || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">GSTIN</p>
                  <p className="font-semibold text-orange-600 text-xs">{offerFormData.gstin || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Working Hours</p>
                  <p className="font-semibold text-indigo-600 text-sm">{offerFormData.workingHours}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Working Days</p>
                  <p className="font-semibold text-indigo-600 text-sm">{offerFormData.workingDays}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button onClick={handleGenerateOfferPDF} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                <Download className="h-5 w-5" />
                Generate Offer Letter PDF
              </button>
              <button onClick={handlePrint} className="px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-300 flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Print
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full max-w-4xl mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Features</h2>
              <p className="text-gray-600">Everything you need to create professional offer letters</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-4"><FileText className="h-6 w-6 text-blue-600" /></div>
                <h3 className="font-semibold mb-2">Professional Templates</h3>
                <p className="text-sm text-gray-500">Legal compliant offer letter templates</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="inline-flex p-3 bg-green-100 rounded-xl mb-4"><Building className="h-6 w-6 text-green-600" /></div>
                <h3 className="font-semibold mb-2">Manual Location Entry</h3>
                <p className="text-sm text-gray-500">Enter location, address, pincode & GSTIN manually</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="inline-flex p-3 bg-purple-100 rounded-xl mb-4"><Download className="h-6 w-6 text-purple-600" /></div>
                <h3 className="font-semibold mb-2">Instant Download</h3>
                <p className="text-sm text-gray-500">Generate and download PDF instantly</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-3xl mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Create Your Offer Letter?</h3>
            <p className="text-blue-100 mb-6">Fill the form above and generate a professional offer letter in seconds</p>
            <button onClick={() => document.querySelector('input')?.focus()} className="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              <span>Start Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </>
  );
}