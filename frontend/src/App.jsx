import React, { useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Type, 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Activity, 
  ChevronRight,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  MessageSquareQuote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const resetState = () => {
    setResult(null);
    setError(null);
    setInputText("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetState();
  }

  const processText = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/text?text=${encodeURIComponent(inputText)}`);
      setResult(res.data);
    } catch (err) {
      setError("Failed to analyze text. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/image`, formData);
      setResult(res.data);
    } catch (err) {
      setError(`Failed to process image. Ensure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <BrainCircuit size={32} color="#7c3aed" />
          <span>OmniAI</span>
        </div>
        <div className="nav-links">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => handleTabChange('dashboard')} 
          />
          <NavItem 
            icon={<Type size={20} />} 
            label="Text Intelligence" 
            active={activeTab === 'text'} 
            onClick={() => handleTabChange('text')} 
          />
          <NavItem 
            icon={<ImageIcon size={20} />} 
            label="Visual Recognition" 
            active={activeTab === 'image'} 
            onClick={() => handleTabChange('image')} 
          />
        </div>
        
        <div style={{ marginTop: 'auto', padding: '1rem', background: '#1e232b', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af' }}>
            <Activity size={14} color="#10b981" />
            <span>Backend Online</span>
          </div>
        </div>
      </div>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="page-header">
                <h1 className="page-title">Welcome to OmniAI</h1>
                <p className="page-subtitle">Your unified platform for multimodal intelligence.</p>
              </div>

              <div className="card-grid">
                <DashboardCard 
                  icon={<Type />} 
                  title="Text Intelligence" 
                  desc="Summarize long documents and detect sentiment in seconds."
                  onClick={() => handleTabChange('text')}
                />
                <DashboardCard 
                  icon={<ImageIcon />} 
                  title="Visual Recognition" 
                  desc="Detect objects and extract text from images with OCR."
                  onClick={() => handleTabChange('image')}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'text' && (
            <motion.div 
              key="text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tool-container"
            >
              <div className="page-header">
                <h1 className="page-title">Text Intelligence</h1>
                <p className="page-subtitle">Analyze context, sentiment, and key insights.</p>
              </div>

              <div className="input-group">
                <label className="label">Input Text</label>
                <textarea 
                  placeholder="Paste your text here (min 10 words for summary)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <button className="btn" onClick={processText} disabled={loading || !inputText.trim()}>
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>

              {error && <ErrorMessage message={error} />}
              {result && <TextResult data={result} />}
            </motion.div>
          )}

          {activeTab === 'image' && (
            <motion.div 
              key="image"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tool-container"
            >
              <div className="page-header">
                <h1 className="page-title">Visual Recognition</h1>
                <p className="page-subtitle">
                  Extract text and detect objects from any image.
                </p>
              </div>

              <div className="upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                <Upload size={48} color="#7c3aed" style={{ marginBottom: '1rem' }} />
                <h3>Click to upload or drag and drop</h3>
                <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                  JPG, PNG, WEBP
                </p>
                <input 
                  id="fileInput"
                  type="file" 
                  hidden 
                  accept="image/*"
                  onChange={(e) => processFile(e.target.files[0])}
                />
              </div>

              {loading && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Loader2 className="animate-spin" size={40} color="#7c3aed" />
                  <p style={{ marginTop: '1rem' }}>Processing file...</p>
                </div>
              )}

              {error && <ErrorMessage message={error} />}
              {result && <ImageResult data={result} preview={previewUrl} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function DashboardCard({ icon, title, desc, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3 style={{ fontFamily: 'Outfit' }}>{title}</h3>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{desc}</p>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed', fontWeight: 600, fontSize: '0.9rem' }}>
        Try now <ChevronRight size={16} />
      </div>
    </div>
  );
}

function TextResult({ data }) {
  return (
    <div className="results-card animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
        <CheckCircle2 color="#10b981" />
        <h3 style={{ fontFamily: 'Outfit' }}>Analysis Complete</h3>
      </div>
      
      <div className="result-item">
        <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquareQuote size={16} /> Summary
        </div>
        <p style={{ lineHeight: 1.6 }}>{data.summary}</p>
      </div>

      <div className="result-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="label">Sentiment</div>
          <span className={`badge ${data.sentiment === 'POSITIVE' ? 'badge-sentiment' : ''}`} 
                style={{ background: data.sentiment === 'NEGATIVE' ? 'rgba(239, 68, 68, 0.15)' : '', 
                         color: data.sentiment === 'NEGATIVE' ? '#ef4444' : '' }}>
            {data.sentiment}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="label">Confidence</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{(data.confidence * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

function ImageResult({ data, preview }) {
  return (
    <div className="results-card animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
        <CheckCircle2 color="#10b981" />
        <h3 style={{ fontFamily: 'Outfit' }}>Image Processed</h3>
      </div>

      {preview && (
        <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src={preview} alt="Uploaded" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', background: '#000' }} />
        </div>
      )}

      <div className="result-item">
        <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSearch size={16} /> OCR Extracted Text
        </div>
        <p style={{ fontStyle: data.raw_text ? 'normal' : 'italic', color: data.raw_text ? 'inherit' : '#9ca3af' }}>
          {data.raw_text || "No text detected in image."}
        </p>
      </div>

      {data.detections && data.detections.length > 0 && (
        <div className="result-item">
          <div className="label">Object Detections</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '0.5rem' }}>
            {data.detections.map((det, i) => (
              <div key={i} style={{ background: '#1e232b', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600 }}>{det.label}</span>
                <span style={{ marginLeft: '8px', color: '#9ca3af', fontSize: '0.8rem' }}>{(det.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.text_analysis && data.text_analysis.summary !== "No text provided for analysis." && (
        <div className="result-item" style={{ background: 'rgba(124, 58, 237, 0.05)', padding: '1rem', borderRadius: '12px', marginTop: '1rem' }}>
          <div className="label">Text Summary</div>
          <p style={{ fontSize: '0.9rem' }}>{data.text_analysis.summary}</p>
        </div>
      )}
    </div>
  );
}



function ErrorMessage({ message }) {
  return (
    <div style={{ 
      marginTop: '2rem', 
      padding: '1rem', 
      background: 'rgba(239, 68, 68, 0.1)', 
      border: '1px solid rgba(239, 68, 68, 0.2)', 
      borderRadius: '12px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      color: '#ef4444' 
    }}>
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
}

export default App;
