import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  X,
  Phone,
  Mail,
  User,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  RefreshCw,
  KeyRound,
  IdCard,
  Building2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    sendOtp,
    verifyOtp,
    registerStudent,
    signInStudent,
    allUsers,
    switchUser,
    setIdCardUser,
    setIsIdCardModalOpen,
  } = useCampus();

  // Mode: 'signup' | 'signin' | 'otp'
  const [activeMode, setActiveMode] = useState<'signup' | 'signin' | 'otp'>('signup');

  // Form fields for registration
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'Computer Science & Engineering',
    year: '1st Year (Class of 2029)',
    rollNo: '',
    bloodGroup: 'B+',
  });

  // Sign In identifier
  const [signInInput, setSignInInput] = useState('');

  // OTP states
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [dispatchedPhoneOtp, setDispatchedPhoneOtp] = useState('');
  const [dispatchedEmailOtp, setDispatchedEmailOtp] = useState('');
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [copiedPhoneOtp, setCopiedPhoneOtp] = useState(false);
  const [copiedEmailOtp, setCopiedEmailOtp] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync mode when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveMode(authModalMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen, authModalMode]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (activeMode === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMode, resendCooldown]);

  if (!isAuthModalOpen) return null;

  // Handler: Request OTP for Sign Up
  const handleRequestSignUpOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter student full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / college email address');
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(formData.phone, formData.email);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || 'Failed to dispatch OTP');
      return;
    }

    setDispatchedPhoneOtp(res.phoneOtp || '482910');
    setDispatchedEmailOtp(res.emailOtp || '739104');
    setPhoneOtpInput('');
    setEmailOtpInput('');
    setResendCooldown(30);
    setSuccessMsg('OTPs sent successfully to your Phone number and Gmail!');
    setActiveMode('otp');
  };

  // Handler: Verify OTP and Register Student
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!phoneOtpInput.trim() || !emailOtpInput.trim()) {
      setErrorMsg('Please enter both the Mobile Phone OTP and Gmail OTP');
      return;
    }

    setIsLoading(true);
    const verifyRes = await verifyOtp(formData.phone, formData.email, phoneOtpInput, emailOtpInput);
    if (!verifyRes.success) {
      setIsLoading(false);
      setErrorMsg(verifyRes.message || 'Invalid OTP. Please check the code and try again.');
      return;
    }

    // Now call register
    const regRes = await registerStudent({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      branch: formData.branch,
      year: formData.year,
      rollNo: formData.rollNo,
      bloodGroup: formData.bloodGroup,
    });
    setIsLoading(false);

    if (!regRes.success) {
      setErrorMsg(regRes.message || 'Registration failed');
      return;
    }

    setSuccessMsg('Verification successful! Your IES College Student ID Card has been generated.');
    // Close auth modal and open ID Card modal after brief delay
    setTimeout(() => {
      setIsAuthModalOpen(false);
      if (regRes.user) {
        setIdCardUser(regRes.user);
        setIsIdCardModalOpen(true);
      }
    }, 900);
  };

  // Handler: Quick Auto-Fill OTP (Testing helper)
  const handleAutoFillOtp = () => {
    setPhoneOtpInput(dispatchedPhoneOtp);
    setEmailOtpInput(dispatchedEmailOtp);
  };

  // Handler: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMsg('');
    const res = await sendOtp(formData.phone, formData.email);
    setIsLoading(false);
    if (res.success) {
      setDispatchedPhoneOtp(res.phoneOtp || '482910');
      setDispatchedEmailOtp(res.emailOtp || '739104');
      setResendCooldown(30);
      setSuccessMsg('Fresh OTPs sent to your Phone and Gmail!');
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handler: Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signInInput.trim()) {
      setErrorMsg('Please enter your Mobile number, Gmail, Roll No, or IES Student ID');
      return;
    }

    setIsLoading(true);
    const res = await signInStudent(signInInput);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || 'No student found with this detail. Please register first.');
      return;
    }

    setSuccessMsg(`Welcome back, ${res.user?.name}!`);
    setTimeout(() => {
      setIsAuthModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner - IES College Official Theme */}
        <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 px-6 py-5 text-white">
          <button
            id="close-auth-modal"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
              <GraduationCap className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  IES College of Technology & Management
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded">
                  Bhopal
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {activeMode === 'signup' && 'Student Registration & ID Creation'}
                {activeMode === 'otp' && 'Dual OTP Phone & Gmail Verification'}
                {activeMode === 'signin' && 'Sign In to IES Student Portal'}
              </h2>
              <p className="text-xs text-slate-300">
                {activeMode === 'signup' && 'Register with your phone & Gmail to generate your official verified Student ID Card'}
                {activeMode === 'otp' && 'Enter the OTPs sent to your mobile phone number and Gmail inbox'}
                {activeMode === 'signin' && 'Access your registered events, Campus Passport, and IES Student ID Card'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          {activeMode !== 'otp' && (
            <div className="flex rounded-lg bg-black/30 p-1 mt-4 text-xs font-semibold">
              <button
                type="button"
                id="auth-tab-signup"
                onClick={() => {
                  setActiveMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 rounded-md transition flex items-center justify-center gap-1.5 ${
                  activeMode === 'signup'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <IdCard className="w-3.5 h-3.5" />
                <span>Register (Sign Up & Generate ID)</span>
              </button>
              <button
                type="button"
                id="auth-tab-signin"
                onClick={() => {
                  setActiveMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 rounded-md transition flex items-center justify-center gap-1.5 ${
                  activeMode === 'signin'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback alerts */}
        <div className="px-6 pt-4">
          {errorMsg && (
            <div className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Form Bodies */}
        <div className="p-6 pt-2">
          {/* ==================== 1. SIGN UP FORM ==================== */}
          {activeMode === 'signup' && (
            <form onSubmit={handleRequestSignUpOtp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                    <span className="text-[10px] text-emerald-600 font-normal ml-1">(OTP will be sent here)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98260 12345"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Gmail Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gmail / College Email <span className="text-rose-500">*</span>
                    <span className="text-[10px] text-emerald-600 font-normal ml-1">(OTP will be sent here)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Branch / Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Branch <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science (AI-DS)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering">Civil Engineering (CE)</option>
                    <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  >
                    <option value="1st Year (Class of 2029)">1st Year (Batch 2025 - 2029)</option>
                    <option value="2nd Year (Class of 2028)">2nd Year (Batch 2024 - 2028)</option>
                    <option value="3rd Year (Class of 2027)">3rd Year (Batch 2023 - 2027)</option>
                    <option value="4th Year (Class of 2026)">4th Year (Batch 2022 - 2026)</option>
                  </select>
                </div>

                {/* Roll No & Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrollment / Roll No <span className="text-slate-400 font-normal">(Optional - auto generated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="e.g. 0103CS221045"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group <span className="text-slate-400 font-normal">(Printed on IES ID Card)</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Institution badge note */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-950">Organised & Issued by IES College, Bhopal</p>
                  <p className="text-[11px] text-emerald-800">
                    Dual OTP verification guarantees that your Phone and Gmail are authentic before your permanent IES Student ID Card Number and QR credential are cryptographically created.
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-register-otp"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching OTPs to Phone & Gmail...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification OTPs (SMS & Gmail)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ==================== 2. DUAL OTP VERIFICATION ==================== */}
          {activeMode === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Target Mobile:</span>
                  <span className="font-bold text-slate-900">{formData.phone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Target Gmail:</span>
                  <span className="font-bold text-slate-900">{formData.email}</span>
                </div>
              </div>

              {/* LIVE SIMULATED INBOX / NOTIFICATION DISPLAY (Real-time visual proof of OTP delivery) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Simulated SMS Card */}
                <div className="p-3 bg-gradient-to-b from-blue-50 to-blue-100/40 border border-blue-200 rounded-xl text-xs">
                  <div className="flex items-center justify-between text-blue-900 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      Incoming SMS
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-200/80 text-blue-900 font-mono">
                      IES-SMS
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-950 leading-tight">
                    "Your IES College Portal verification OTP is:{' '}
                    <strong className="font-mono text-sm tracking-wider text-blue-900 bg-white px-1.5 py-0.5 rounded border border-blue-300">
                      {dispatchedPhoneOtp}
                    </strong>
                    . Valid for 10 minutes."
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneOtpInput(dispatchedPhoneOtp);
                      setCopiedPhoneOtp(true);
                      setTimeout(() => setCopiedPhoneOtp(false), 1500);
                    }}
                    className="mt-2 text-[10px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    {copiedPhoneOtp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPhoneOtp ? 'Copied to field!' : 'Click to copy SMS OTP'}</span>
                  </button>
                </div>

                {/* Simulated Gmail Card */}
                <div className="p-3 bg-gradient-to-b from-rose-50 to-rose-100/40 border border-rose-200 rounded-xl text-xs">
                  <div className="flex items-center justify-between text-rose-900 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-rose-600" />
                      Gmail Inbox
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200/80 text-rose-900 font-mono">
                      Google Mail
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-950 leading-tight">
                    "IES College Verification Code:{' '}
                    <strong className="font-mono text-sm tracking-wider text-rose-900 bg-white px-1.5 py-0.5 rounded border border-rose-300">
                      {dispatchedEmailOtp}
                    </strong>
                    . Use this code to verify your IES Student ID."
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailOtpInput(dispatchedEmailOtp);
                      setCopiedEmailOtp(true);
                      setTimeout(() => setCopiedEmailOtp(false), 1500);
                    }}
                    className="mt-2 text-[10px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                  >
                    {copiedEmailOtp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmailOtp ? 'Copied to field!' : 'Click to copy Gmail OTP'}</span>
                  </button>
                </div>
              </div>

              {/* Input OTP Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Phone OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>1. Enter Mobile Phone OTP:</span>
                    {phoneOtpInput === dispatchedPhoneOtp && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Match
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={phoneOtpInput}
                    onChange={(e) => setPhoneOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit Mobile OTP"
                    className="w-full px-3 py-2 text-sm font-mono tracking-widest text-center rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>

                {/* Gmail OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>2. Enter Gmail OTP:</span>
                    {emailOtpInput === dispatchedEmailOtp && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Match
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={emailOtpInput}
                    onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit Gmail OTP"
                    className="w-full px-3 py-2 text-sm font-mono tracking-widest text-center rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Quick 1-Click Auto Fill */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Click Auto-fill Both OTPs</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="text-xs text-slate-600 hover:text-slate-900 disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTPs'}
                </button>
              </div>

              {/* Verify & Create CTA */}
              <button
                type="submit"
                id="verify-otp-submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying OTPs & Minting Student ID...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Both OTPs & Generate IES Student ID Card</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveMode('signup')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Edit mobile number or Gmail address
                </button>
              </div>
            </form>
          )}

          {/* ==================== 3. SIGN IN FORM ==================== */}
          {activeMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Mobile Number, Gmail, Roll No, or IES Student ID
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signInInput}
                    onChange={(e) => setSignInInput(e.target.value)}
                    placeholder="e.g. +91 98260 11111 or student@gmail.com or IES-2025-CS-401"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="signin-submit-button"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to IES Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Profiles */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">
                  Or quickly sign in as an active IES College member:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allUsers.slice(0, 4).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        switchUser(user.id);
                        setIsAuthModalOpen(false);
                      }}
                      className="p-2 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition text-left flex items-center gap-2"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {user.role.toUpperCase()} • {user.studentIdCardNo || user.rollNo}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            IES College Campus Portal
          </span>
          <span className="text-emerald-700 font-medium">Bhopal • AICTE & RGPV Affiliated</span>
        </div>
      </div>
    </div>
  );
};
