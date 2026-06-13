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
  
  // Location Configuration
  const locationOptions = {
    patna: {
      name: 'Patna',
      address: '1st Floor, Siyaram Mansion, Opp. Telephone Exchange, Near P&M Mall, Khurji, Patna, Bihar – 800010',
      gstin: '10AAJCV6337M1Z2'
    },
    purnea: {
      name: 'Purnea',
      address: 'First Floor, Shakuntala Sagar, Ct Station Rd, PWD Colony, Purnia, Bihar 854301',
      gstin: '10AAJCV6337M1Z2'
    },
    noida: {
      name: 'Noida',
      address: 'G 94 (Basement), G Block, Sector 63, Noida, Chotpur, Uttar Pradesh 201301',
      gstin: '09AAJCV6337M1ZL'
    }
  };

  // ==================== OFFER LETTER FORM ====================
  const [offerFormData, setOfferFormData] = useState({
    candidateName: '',
    jobTitle: '',
    department: '',
    joiningDate: '2024-04-01',
    workLocation: 'patna', // Changed to location key
    reportingManager: '',
    ctc: '',
    probationPeriod: '3 months',
    noticePeriod: '',
    workingHours: '10:00 AM - 7:00 PM',
    workingDays: 'Tuesday to Sunday',
    companyName: 'COACHINGYAARI PRIVATE LIMITED',
    companyPhone: '9973725719',
    companyEmail: 'support@coachingyaari.com',
    hrName: 'Rani Shreya',
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

  // Get current location details
  const getCurrentLocationDetails = () => {
    const location = locationOptions[offerFormData.workLocation as keyof typeof locationOptions];
    return location || locationOptions.patna;
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
    const currentLocation = getCurrentLocationDetails();
    
    const mappedFormData = {
      name: offerFormData.candidateName,
      designation: offerFormData.jobTitle,
      joiningDate: offerFormData.joiningDate,
      ctc: offerFormData.ctc,
      reportingManager: offerFormData.reportingManager,
      workLocation: offerFormData.workLocation, // Send the location key
      department: offerFormData.department,
      probationPeriod: offerFormData.probationPeriod,
      noticePeriod: offerFormData.noticePeriod,
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
      message: `Offer letter for ${offerFormData.candidateName} has been generated successfully with ${currentLocation.name} location.`,
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
      workLocation: 'patna',
      reportingManager: '',
      ctc: '',
      probationPeriod: '3 months',
      noticePeriod: '15 days',
      workingHours: '10:00 AM - 7:00 PM',
      workingDays: 'Tuesday to Sunday',
      companyName: 'COACHINGYAARI PRIVATE LIMITED',
      companyPhone: '9973725719',
      companyEmail: 'support@coachingyaari.com',
      hrName: 'Rani Shreya',
      hrDesignation: 'HR Manager',
      offerDate: new Date().toISOString().split('T')[0]
    });
  };

  const currentLocation = getCurrentLocationDetails();

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
                
                {/* Work Location Dropdown - Updated with 3 locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Location *</label>
                  <select 
                    name="workLocation" 
                    value={offerFormData.workLocation} 
                    onChange={handleOfferChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="patna">Patna, Bihar</option>
                    <option value="purnea">Purnea, Bihar</option>
                    <option value="noida">Noida, Uttar Pradesh</option>
                  </select>
                  {currentLocation && (
                    <p className="text-xs text-gray-500 mt-1">
                      GST: {currentLocation.gstin} | {currentLocation.address.substring(0, 50)}...
                    </p>
                  )}
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
                  <input type="text" name="probationPeriod" value={offerFormData.probationPeriod} onChange={handleOfferChange} placeholder="e.g., 3 months" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                  <input type="text" name="noticePeriod" value={offerFormData.noticePeriod} onChange={handleOfferChange} placeholder="e.g., 15 days" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                  <input type="text" name="workingHours" value={offerFormData.workingHours} onChange={handleOfferChange} placeholder="e.g., 10:00 AM - 7:00 PM" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <input type="text" name="workingDays" value={offerFormData.workingDays} onChange={handleOfferChange} placeholder="e.g., Monday to Friday" className="w-full px-4 py-2.5 border rounded-lg" />
                </div>
              </div>
            </div>

            {/* Company Details Section - Now shows dynamic location info */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN (Auto-updates with Location)</label>
                  <input 
                    type="text" 
                    value={currentLocation.gstin} 
                    disabled 
                    className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">GST is automatically set based on selected location</p>
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Address (Auto-updates with Location)</label>
                <textarea 
                  value={currentLocation.address} 
                  disabled 
                  rows={2} 
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Address is automatically set based on selected location</p>
              </div>
            </div>

            {/* Digital Signature Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Fingerprint className="h-5 w-5 mr-2 text-indigo-600" />
                Digital Signature (HR)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HR Signature</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="signature-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="signature-upload" name="signature-upload" type="file" className="sr-only" accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Signature Preview</label>
                  <div className="border rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400 text-sm">No signature uploaded yet</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Digital signature will appear on the offer letter</p>
                </div>
              </div>
            </div>

            {/* Summary Card */}
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
                  <p className="font-semibold text-purple-600">{currentLocation.name}</p>
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
                <h3 className="font-semibold mb-2">Multi-Location Support</h3>
                <p className="text-sm text-gray-500">Patna, Purnea & Noida with dynamic GST</p>
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