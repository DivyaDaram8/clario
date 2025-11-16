import React, { useState } from 'react';
import { FileUp, Zap, Copy, Check } from 'lucide-react';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import "../styles/Summarizers.css";

export default function Summarizers() {
  const [textInput, setTextInput] = useState('');
  const [textSummary, setTextSummary] = useState('');
  const [docSummary, setDocSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [language, setLanguage] = useState('en');
  const [summaryLength, setSummaryLength] = useState('short');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleTextSummarize = async () => {
    if (!textInput.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          text: textInput,
          language,
          length: summaryLength,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const data = await response.json();
      setTextSummary(data.summary);
    } catch (err) {
      setError(err.message || 'Failed to summarize text');
      console.error('Summarization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocSummarize = async () => {
    if (!selectedFile) {
      setError('Please select a file to summarize');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('summary_length', summaryLength);
      formData.append('output_language', language);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/summarizer/docs', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const data = await response.json();
      setDocSummary(data.data?.summary || JSON.stringify(data));
    } catch (err) {
      setError(err.message || 'Failed to summarize document');
      console.error('Document summarization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* <NavbarLeft />
      <NavbarTop /> */}
      
      <div className="summarizers-container">
        <div className="summarizers-content">
          {/* Header */}
          <div className="summarizers-header">
            <h1 className="summarizers-title">
              <Zap className="summarizers-title-icon" size={32} />
              Smart Summarizer
            </h1>
            <p className="summarizers-subtitle">
              Transform your content into concise summaries instantly
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="summarizers-tabs">
            <button
              onClick={() => setActiveTab('text')}
              className={`summarizers-tab ${activeTab === 'text' ? 'active' : ''}`}
            >
              Text Summarizer
            </button>
            <button
              onClick={() => setActiveTab('doc')}
              className={`summarizers-tab ${activeTab === 'doc' ? 'active' : ''}`}
            >
              Document Summarizer
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="summarizers-error">
              {error}
            </div>
          )}

          {/* Text Summarizer Tab */}
          {activeTab === 'text' && (
            <div className="summarizers-grid">
              {/* Input Section */}
              <div className="summarizers-section">
                <div className="summarizers-card">
                  <div className="summarizers-input-card">
                    <label className="summarizers-label">
                      Text to Summarize
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste your text here..."
                      className="summarizers-textarea"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="summarizers-settings">
                  <div className="summarizers-setting-group">
                    <label className="summarizers-label">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="summarizers-select"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>

                  <div className="summarizers-setting-group">
                    <label className="summarizers-label">Summary Length</label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="summarizers-select"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleTextSummarize}
                  disabled={loading}
                  className="summarizers-button"
                >
                  <Zap size={20} className="summarizers-button-icon" />
                  {loading ? 'Summarizing...' : 'Summarize Text'}
                </button>
              </div>

              {/* Output Section */}
              <div className="summarizers-section">
                <div className="summarizers-card summarizers-output-card">
                  <label className="summarizers-label">
                    Summary Result
                  </label>
                  <div className="summarizers-output-content">
                    {textSummary ? (
                      <p className="summarizers-output-text">{textSummary}</p>
                    ) : (
                      <p className="summarizers-output-placeholder">
                        Your summary will appear here...
                      </p>
                    )}
                  </div>
                  {textSummary && (
                    <button
                      onClick={() => copyToClipboard(textSummary)}
                      className="summarizers-copy-button"
                    >
                      {copied ? (
                        <>
                          <Check size={18} className="summarizers-copy-icon" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} className="summarizers-copy-icon" />
                          Copy Summary
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Document Summarizer Tab */}
          {activeTab === 'doc' && (
            <div className="summarizers-grid">
              {/* Upload Section */}
              <div className="summarizers-section">
                <div
                  className="summarizers-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) {
                      setSelectedFile(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <FileUp size={48} className="summarizers-upload-icon" />
                  <p className="summarizers-upload-title">
                    Drag and drop your file here
                  </p>
                  <p className="summarizers-upload-subtitle">or</p>
                  <label className="summarizers-upload-button">
                    Choose File
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0])}
                      className="summarizers-upload-input"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                  {selectedFile && (
                    <p className="summarizers-upload-filename">
                      ✓ {selectedFile.name}
                    </p>
                  )}
                </div>

                {/* Settings */}
                <div className="summarizers-settings">
                  <div className="summarizers-setting-group">
                    <label className="summarizers-label">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="summarizers-select"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>

                  <div className="summarizers-setting-group">
                    <label className="summarizers-label">Summary Length</label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="summarizers-select"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleDocSummarize}
                  disabled={loading || !selectedFile}
                  className="summarizers-button"
                >
                  <Zap size={20} className="summarizers-button-icon" />
                  {loading ? 'Processing...' : 'Summarize Document'}
                </button>
              </div>

              {/* Output Section */}
              <div className="summarizers-section">
                <div className="summarizers-card summarizers-output-card">
                  <label className="summarizers-label">
                    Summary Result
                  </label>
                  <div className="summarizers-output-content">
                    {docSummary ? (
                      <p className="summarizers-output-text">{docSummary}</p>
                    ) : (
                      <p className="summarizers-output-placeholder">
                        Document summary will appear here...
                      </p>
                    )}
                  </div>
                  {docSummary && (
                    <button
                      onClick={() => copyToClipboard(docSummary)}
                      className="summarizers-copy-button"
                    >
                      {copied ? (
                        <>
                          <Check size={18} className="summarizers-copy-icon" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} className="summarizers-copy-icon" />
                          Copy Summary
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}