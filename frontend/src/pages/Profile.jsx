import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, LogOut, User, Mail, Eye, EyeOff, CheckCircle2, XCircle, Zap } from 'lucide-react';
import "../styles/Profile.css";

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
      <div className="profile-loading">
        <div className="profile-loading-content">
          <div className="profile-loading-spinner"></div>
          <p className="profile-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Container */}
      <div className="profile-content">
        {/* Back Button */}
        <button onClick={handleBack} className="profile-back-button">
          <div className="profile-back-icon">
            <ChevronLeft size={20} />
          </div>
          <span className="profile-back-text">
            {showChangePassword ? 'Back to Profile' : 'Back'}
          </span>
        </button>

        {/* Main Content */}
        {!showChangePassword ? (
          <>
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-card-wrapper">
                <div className="profile-card">
                  <div className="profile-card-content">
                    {/* Avatar */}
                    <div className="profile-avatar-wrapper">
                      <div className="profile-avatar">
                        <User size={48} strokeWidth={2} />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="profile-info">
                      <h1 className="profile-name">{user?.name}</h1>
                      <p className="profile-username">@{user?.username}</p>
                      <div className="profile-email-wrapper">
                        <Mail size={16} className="profile-email-icon" />
                        <p className="profile-email">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="profile-actions-grid">
              {/* Change Password Card */}
              <button
                onClick={() => setShowChangePassword(true)}
                className="profile-action-card"
              >
                <div className="profile-action-card-content">
                  <div className="profile-action-card-header">
                    <div className="profile-action-card-icon profile-action-card-icon-cyan">
                      <Lock size={24} />
                    </div>
                    <Zap size={18} className="profile-action-card-zap" />
                  </div>
                  <h3 className="profile-action-card-title">Change Password</h3>
                  <p className="profile-action-card-description">Update your security credentials</p>
                </div>
              </button>

              {/* Logout Card */}
              <button
                onClick={handleLogout}
                className="profile-action-card"
              >
                <div className="profile-action-card-content">
                  <div className="profile-action-card-header">
                    <div className="profile-action-card-icon profile-action-card-icon-red">
                      <LogOut size={24} />
                    </div>
                    <Zap size={18} className="profile-action-card-zap" />
                  </div>
                  <h3 className="profile-action-card-title">Logout</h3>
                  <p className="profile-action-card-description">Sign out from your account</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Change Password View */
          <div className="profile-password-wrapper">
            <div className="profile-password-card-wrapper">
              <div className="profile-password-card">
                <h2 className="profile-password-title">Update Password</h2>
                <p className="profile-password-subtitle">Keep your account secure with a strong password</p>

                {/* Message Alert */}
                {message.text && (
                  <div className={`profile-message ${message.type === 'success' ? 'profile-message-success' : 'profile-message-error'}`}>
                    <div>
                      {message.type === 'success' ? (
                        <CheckCircle2 size={20} className="profile-message-icon-success" />
                      ) : (
                        <XCircle size={20} className="profile-message-icon-error" />
                      )}
                    </div>
                    <p className={`profile-message-text ${message.type === 'success' ? 'profile-message-text-success' : 'profile-message-text-error'}`}>
                      {message.text}
                    </p>
                  </div>
                )}

                <div className="profile-form">
                  {/* Old Password */}
                  <div className="profile-form-group">
                    <label className="profile-form-label">Current Password</label>
                    <div className="profile-form-input-wrapper">
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        className="profile-form-input"
                        placeholder="Enter current password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                        className="profile-form-toggle"
                      >
                        {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="profile-form-group">
                    <label className="profile-form-label">New Password</label>
                    <div className="profile-form-input-wrapper">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="profile-form-input"
                        placeholder="Enter new password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="profile-form-toggle"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="profile-form-group">
                    <label className="profile-form-label">Confirm Password</label>
                    <div className="profile-form-input-wrapper">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="profile-form-input"
                        placeholder="Confirm new password"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="profile-form-toggle"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      setMessage({ type: '', text: '' });
                    }}
                    className="profile-button profile-button-cancel"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="profile-button profile-button-submit"
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