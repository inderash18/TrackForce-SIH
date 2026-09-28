import React, { useState } from 'react';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import { Building2, MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, ExternalLink, Users } from 'lucide-react';
export const ContactView = ({ onNavigate, onOpenAddProject, onOpenLoginModal }) => {
    const [formState, setFormState] = useState({
        name: '',
        designation: '',
        organization: '',
        email: '',
        phone: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };
    const officeDirectory = [
        {
            role: 'Director (IPMD)',
            officer: 'Director, Infrastructure and Project Monitoring Division',
            phone: '011-23455604',
            email: 'dir-ipmd@mospi.gov.in',
            room: 'Room No. 308, 3rd Floor'
        },
        {
            role: 'Joint Director (Monitoring)',
            officer: 'Joint Director, Central Project Monitoring Unit',
            phone: '011-23455612',
            email: 'jd-ipmd@mospi.gov.in',
            room: 'Room No. 312, 3rd Floor'
        },
        {
            role: 'Deputy Director (OCMS / IT Support)',
            officer: 'Deputy Director, PAIMANA Portal Technical Cell',
            phone: '011-23455620',
            email: 'paimana-support@mospi.gov.in',
            room: 'Room No. 315, 3rd Floor'
        },
        {
            role: 'Technical Helpdesk (NIC)',
            officer: 'National Informatics Centre (NIC) Support Team',
            phone: '011-23455699',
            email: 'helpdesk-paimana@gov.in',
            room: 'IT Operations Lab, 2nd Floor'
        }
    ];
    return (<div className="min-h-screen flex flex-col font-sans" style={{ background: 'var(--color-bg-gradient)' }}>
      <PaimanaHeader activeRoute="contact" onNavigate={onNavigate} onOpenAddProject={onOpenAddProject} onOpenLoginModal={onOpenLoginModal}/>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Page Header Banner */}
        <div className="mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-[#0F172A] text-white rounded-xl shadow-sm">
              <Building2 className="w-6 h-6"/>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
                Contact Us & Official Directory
              </h1>
              <p className="text-sm text-slate-500">
                Infrastructure and Project Monitoring Division (IPMD) • Ministry of Statistics and Programme Implementation
              </p>
            </div>
          </div>
          <div className="h-1 w-20 bg-[#0284C7] rounded-full mt-2"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Official Address, Map & Key Contacts (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Headquarters Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#F8FAFC] border-b border-slate-200 text-[#0F172A] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0284C7]"/>
                  <h2 className="font-bold text-base text-[#0F172A]">Divisional Headquarters</h2>
                </div>
                <span className="text-xs bg-white px-2.5 py-1 rounded-md text-slate-600 border border-slate-200 font-medium">
                  Government of India
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Office Address
                    </h3>
                    <p className="text-slate-800 font-medium leading-relaxed text-sm">
                      <strong>Infrastructure and Project Monitoring Division (IPMD)</strong><br />
                      Ministry of Statistics & Programme Implementation<br />
                      Government of India<br />
                      Khurshid Lal Bhawan, Janpath Road<br />
                      New Delhi – 110001, India
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2.5 text-sm text-slate-700">
                        <Phone className="w-4 h-4 text-[#0084C7] shrink-0"/>
                        <span><strong>EPABX:</strong> 011-23455600 / 011-23455604</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-slate-700">
                        <Mail className="w-4 h-4 text-[#0084C7] shrink-0"/>
                        <span><strong>Email:</strong> dir-ipmd@mospi.gov.in</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-slate-700">
                        <Clock className="w-4 h-4 text-[#0084C7] shrink-0"/>
                        <span><strong>Office Hours:</strong> Mon - Fri, 9:00 AM - 5:30 PM IST</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Map Visual */}
                  <div className="bg-[#EEF6FB] rounded-lg border border-[#0084C7]/20 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#081C36] uppercase tracking-wide">
                          Location Map
                        </span>
                        <a href="https://maps.google.com/?q=Khurshid+Lal+Bhawan+Janpath+New+Delhi" target="_blank" rel="noreferrer" className="text-xs text-[#0084C7] hover:underline flex items-center gap-1 font-semibold">
                          Google Maps <ExternalLink className="w-3 h-3"/>
                        </a>
                      </div>
                      <div className="w-full h-36 bg-slate-200 rounded border border-slate-300 relative overflow-hidden flex items-center justify-center text-center p-3">
                        {/* Map Graphic mockup */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#081C36_1px,transparent_1px)] [background-size:12px_12px]"/>
                        <div className="z-10 flex flex-col items-center">
                          <div className="p-2 bg-red-600 text-white rounded-full shadow-lg animate-bounce">
                            <MapPin className="w-5 h-5"/>
                          </div>
                          <p className="text-xs font-bold text-[#081C36] mt-1 bg-white/90 px-2 py-0.5 rounded shadow-sm">
                            Khurshid Lal Bhawan, Janpath
                          </p>
                          <span className="text-[10px] text-slate-600">Central Delhi, Near Patel Chowk Metro</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2">
                      * Nearest Metro Station: <strong>Janpath (Violet Line)</strong> or <strong>Patel Chowk (Yellow Line)</strong> (500m walk).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Officer Directory */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#F8FAFC] border-b border-slate-200 text-[#0F172A] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0284C7]"/>
                  <h2 className="font-bold text-base text-[#0F172A]">Key Officers & Contact Directory</h2>
                </div>
                <span className="text-xs bg-white px-2.5 py-1 rounded-md text-slate-600 border border-slate-200 font-medium">MoSPI IPMD Division</span>
              </div>

              <div className="divide-y divide-slate-100">
                {officeDirectory.map((officer, idx) => (<div key={idx} className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">{officer.role}</div>
                      <div className="text-xs text-slate-600 font-medium">{officer.officer}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{officer.room} • Khurshid Lal Bhawan</div>
                    </div>
                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0 text-xs">
                      <a href={`tel:${officer.phone}`} className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0284C7] font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                        <Phone className="w-3.5 h-3.5 text-[#0284C7]"/>
                        {officer.phone}
                      </a>
                      <a href={`mailto:${officer.email}`} className="inline-flex items-center gap-1.5 text-[#0284C7] hover:underline font-medium">
                        <Mail className="w-3.5 h-3.5"/>
                        {officer.email}
                      </a>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry / Feedback Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
              <div className="bg-[#F8FAFC] border-b border-slate-200 text-[#0F172A] px-6 py-4">
                <h2 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#0284C7]"/>
                  Submit Official Inquiry / Feedback
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct communication with IPMD project nodal desk
                </p>
              </div>

              <div className="p-6">
                {submitted ? (<div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-10 h-10"/>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      Inquiry Registered Successfully
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting IPMD MoSPI. Your acknowledgment reference ID is <strong className="text-[#0F172A]">IPMD/2026/INQ-8821</strong>. Our nodal officer will get in touch with you shortly.
                    </p>
                    <button onClick={() => {
                setSubmitted(false);
                setFormState({
                    name: '',
                    designation: '',
                    organization: '',
                    email: '',
                    phone: '',
                    category: 'General Inquiry',
                    subject: '',
                    message: ''
                });
            }} className="mt-4 px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-semibold hover:bg-[#1E293B] shadow transition">
                      Send Another Message
                    </button>
                  </div>) : (<form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} placeholder="e.g. Ramesh Sharma" className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition"/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Designation
                        </label>
                        <input type="text" value={formState.designation} onChange={(e) => setFormState({ ...formState, designation: e.target.value })} placeholder="e.g. Executive Engineer" className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition"/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ministry / Agency / Organization <span className="text-red-500">*</span>
                      </label>
                      <input type="text" required value={formState.organization} onChange={(e) => setFormState({ ...formState, organization: e.target.value })} placeholder="e.g. Ministry of Railways / NHAI / State PWD" className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition"/>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Official Email <span className="text-red-500">*</span>
                        </label>
                        <input type="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} placeholder="name@gov.in / name@org.com" className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition"/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input type="tel" required value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} placeholder="e.g. +91 98765 43210" className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition"/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Category <span className="text-red-500">*</span>
                      </label>
                      <select value={formState.category} onChange={(e) => setFormState({ ...formState, category: e.target.value })} className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition">
                        <option value="General Inquiry">General Division Inquiry</option>
                        <option value="Project Monitoring Query">Project Milestone / Monitoring Query</option>
                        <option value="OCMS Login / Onboarding">OCMS Login & Agency Onboarding</option>
                        <option value="Report Verification">Flash / Review Report Verification</option>
                        <option value="Technical Support">Portal Technical Issue / Bug Report</option>
                        <option value="RTI / Official Record">RTI / Official Information Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input type="text" required value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })} placeholder="Summary of your inquiry or request" className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 transition"/>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detailed Message <span className="text-red-500">*</span>
                      </label>
                      <textarea required rows={4} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} placeholder="Provide project code, agency name, or detailed background if applicable..." className="w-full text-xs px-3.5 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0284C7] focus:border-transparent outline-none text-slate-900 resize-none transition"/>
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer">
                        {loading ? (<>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                            <span>Transmitting Inquiry...</span>
                          </>) : (<>
                            <Send className="w-4 h-4"/>
                            <span>Submit Official Inquiry</span>
                          </>)}
                      </button>
                    </div>

                    <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5"/>
                      <span>
                        Inquiries submitted via this portal are logged directly into the MoSPI e-Office tracking registry.
                      </span>
                    </div>
                  </form>)}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaimanaFooter onNavigate={onNavigate}/>
    </div>);
};
