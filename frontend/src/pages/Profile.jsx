
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, LogOut, User, Mail, Eye, EyeOff, CheckCircle2, XCircle, Zap } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  };
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Something went wrong");
  return result;
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest("/auth/me");
        setUser(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setSubmitting(true);
      await apiRequest("/auth/change-password", "PUT", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowChangePassword(false);
        setMessage({ type: '', text: '' });
      }, 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const handleBack = () => {
    if (showChangePassword) {
      setShowChangePassword(false);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: '', text: '' });
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative text-white text-center">
            <div className="w-12 h-12 border-3 border-cyan-500 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* Container */}
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 mb-12 group"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 transition-colors">
            <ChevronLeft size={24} />
          </div>
          <span className="text-sm font-semibold uppercase tracking-widest">{showChangePassword ? 'Back to Profile' : 'Back'}</span>
        </button>

        {/* Main Content */}
        {!showChangePassword ? (
          <>
            {/* Profile Header */}
            <div className="mb-12">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative backdrop-blur-xl bg-white/[0.08] border border-white/[0.2] rounded-3xl p-12 shadow-2xl overflow-hidden">
                  {/* Decorative Grid */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
                      backgroundSize: '50px 50px'
                    }}></div>
                  </div>

                  <div className="relative z-10 flex items-center gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
                        <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-blue-600 flex items-center justify-center shadow-xl">
                          <User size={56} className="text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{user?.name}</h1>
                      <p className="text-lg text-cyan-400 font-semibold mb-4">@{user?.username}</p>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail size={18} className="text-purple-400" />
                        <p className="break-all font-medium">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Change Password Card */}
              <button
                onClick={() => setShowChangePassword(true)}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.08] border border-white/[0.2] group-hover:bg-white/[0.12] group-hover:border-white/[0.3] transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/40 transition-colors">
                      <Lock size={28} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <Zap size={20} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Change Password</h3>
                  <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">Update your security credentials</p>
                </div>
              </button>

              {/* Logout Card */}
              <button
                onClick={handleLogout}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.08] border border-white/[0.2] group-hover:bg-white/[0.12] group-hover:border-white/[0.3] transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 rounded-xl bg-red-500/20 group-hover:bg-red-500/40 transition-colors">
                      <LogOut size={28} className="text-red-400 group-hover:text-red-300 transition-colors" />
                    </div>
                    <Zap size={20} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Logout</h3>
                  <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">Sign out from your account</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Change Password View */
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative backdrop-blur-xl bg-white/[0.08] border border-white/[0.2] rounded-3xl p-10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-2">Update Password</h2>
                <p className="text-gray-400 mb-8 text-sm">Keep your account secure with a strong password</p>

                {/* Message Alert */}
                {message.text && (
                  <div className={`mb-8 p-4 rounded-xl backdrop-blur-md border flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
                    message.type === 'success'
                      ? 'bg-green-500/15 border-green-500/30'
                      : 'bg-red-500/15 border-red-500/30'
                  }`}>
                    <div>
                      {message.type === 'success' ? (
                        <CheckCircle2 size={24} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle size={24} className="text-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                      {message.text}
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Old Password */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        className="w-full bg-white/[0.06] border border-white/[0.15] rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.1] transition-all duration-300 pr-12 text-sm"
                        placeholder="Enter current password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full bg-white/[0.06] border border-white/[0.15] rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.1] transition-all duration-300 pr-12 text-sm"
                        placeholder="Enter new password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full bg-white/[0.06] border border-white/[0.15] rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.1] transition-all duration-300 pr-12 text-sm"
                        placeholder="Confirm new password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-8 mt-8 border-t border-white/[0.1]">
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      setMessage({ type: '', text: '' });
                    }}
                    className="flex-1 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:border-white/[0.3]"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}