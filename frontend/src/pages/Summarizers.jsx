import React, { useState } from 'react';
import { FileUp, Zap, Copy, Check } from 'lucide-react';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

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
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="flex h-screen">
        {/* Left Navbar */}
        <NavbarLeft />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <NavbarTop />

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-8 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Zap className="text-yellow-400" size={32} />
                  Smart Summarizer
                </h1>
                <p className="text-gray-400">Transform your content into concise summaries instantly</p>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'text'
                      ? 'bg-white/20 text-white border border-white/30 backdrop-blur-md'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Text Summarizer
                </button>
                <button
                  onClick={() => setActiveTab('doc')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'doc'
                      ? 'bg-white/20 text-white border border-white/30 backdrop-blur-md'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Document Summarizer
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Text Summarizer Tab */}
              {activeTab === 'text' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Text to Summarize
                      </label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Paste your text here..."
                        className="w-full h-64 bg-black/40 text-white rounded-lg p-4 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-gray-500 resize-none"
                      />
                    </div>

                    {/* Settings */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="it">Italian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Summary Length
                        </label>
                        <select
                          value={summaryLength}
                          onChange={(e) => setSummaryLength(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Zap size={20} />
                      {loading ? 'Summarizing...' : 'Summarize Text'}
                    </button>
                  </div>

                  {/* Output Section */}
                  <div>
                    <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md min-h-96 flex flex-col">
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Summary Result
                      </label>
                      <div className="flex-1 bg-black/40 rounded-lg p-4 border border-white/10 overflow-auto">
                        {textSummary ? (
                          <p className="text-gray-200 leading-relaxed">{textSummary}</p>
                        ) : (
                          <p className="text-gray-500 text-center mt-12">Your summary will appear here...</p>
                        )}
                      </div>
                      {textSummary && (
                        <button
                          onClick={() => copyToClipboard(textSummary)}
                          className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check size={18} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={18} /> Copy Summary
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Upload Section */}
                  <div className="space-y-4">
                    <div
                      className="p-12 bg-white/10 border-2 border-dashed border-white/30 rounded-xl backdrop-blur-md hover:bg-white/15 hover:border-white/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-80"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0]) {
                          setSelectedFile(e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <FileUp size={48} className="text-blue-400 mb-4" />
                      <p className="text-white font-semibold mb-2">Drag and drop your file here</p>
                      <p className="text-gray-400 text-sm mb-4">or</p>
                      <label className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300">
                        Choose File
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0])}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </label>
                      {selectedFile && (
                        <p className="text-green-400 text-sm mt-4">✓ {selectedFile.name}</p>
                      )}
                    </div>

                    {/* Settings */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="it">Italian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Summary Length
                        </label>
                        <select
                          value={summaryLength}
                          onChange={(e) => setSummaryLength(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Zap size={20} />
                      {loading ? 'Processing...' : 'Summarize Document'}
                    </button>
                  </div>

                  {/* Output Section */}
                  <div>
                    <div className="p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md min-h-96 flex flex-col">
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Summary Result
                      </label>
                      <div className="flex-1 bg-black/40 rounded-lg p-4 border border-white/10 overflow-auto">
                        {docSummary ? (
                          <p className="text-gray-200 leading-relaxed">{docSummary}</p>
                        ) : (
                          <p className="text-gray-500 text-center mt-12">Document summary will appear here...</p>
                        )}
                      </div>
                      {docSummary && (
                        <button
                          onClick={() => copyToClipboard(docSummary)}
                          className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check size={18} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={18} /> Copy Summary
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
        </div>
      </div>
    </div>
  );
}