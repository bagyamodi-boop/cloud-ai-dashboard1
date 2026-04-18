import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';

const optimizationTips = [
  { icon: '🤏', title: 'Use smaller models', desc: 'GPT-3.5 uses 10x less energy than GPT-4 for simple tasks' },
  { icon: '✂️', title: 'Reduce prompt size', desc: 'Remove unnecessary context and filler words' },
  { icon: '💾', title: 'Cache responses', desc: 'Store repeated query results instead of calling API again' },
  { icon: '📦', title: 'Use batching', desc: 'Group multiple requests into one API call to save compute' },
  { icon: '🔁', title: 'Avoid repeated calls', desc: 'Never call the API in a loop — process data in bulk' },
];

const BAD_PROMPT  = "Explain everything about Artificial Intelligence in great detail covering all topics including history, machine learning, deep learning, neural networks, NLP, computer vision, robotics, ethics, future of AI, and give examples for each topic in at least 2000 words.";
const GOOD_PROMPT = "Explain AI basics in 5 key points, keep it concise.";

const INR_PER_1K_TOKENS_LARGE = 0.25 * 83.5;
const INR_PER_1K_TOKENS_SMALL = 0.002 * 83.5;

function estimateTokens(text) {
  return Math.round(text.trim().split(/\s+/).filter(Boolean).length * 1.3);
}

function getEnergyWh(tokens, model) {
  return (tokens * (model === 'large' ? 0.0003 : 0.00005)).toFixed(4);
}

function getCO2(tokens, model) {
  const wh = parseFloat(getEnergyWh(tokens, model));
  return (wh * 0.475).toFixed(4);
}

function getAPICost(tokens, model) {
  const rate = model === 'large' ? INR_PER_1K_TOKENS_LARGE : INR_PER_1K_TOKENS_SMALL;
  return ((tokens / 1000) * rate).toFixed(4);
}

function getEnergyLevel(tokens) {
  if (tokens < 100) return { level: 'Low',    color: '#15803d', bg: '#f0fdf4', bar: '#4ade80', width: '20%' };
  if (tokens < 300) return { level: 'Medium', color: '#92400e', bg: '#fffbeb', bar: '#fbbf24', width: '55%' };
  return               { level: 'High',   color: '#991b1b', bg: '#fef2f2', bar: '#f87171', width: '90%' };
}

function TokenCounter() {
  const theme = useTheme();
  const [text, setText]               = useState('');
  const [model, setModel]             = useState('large');
  const [showExample, setShowExample] = useState('bad');
  const [history, setHistory]         = useState([]);
  const [charCount, setCharCount]     = useState(0);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const tokens     = estimateTokens(text || '');
  const energy     = getEnergyWh(tokens, model);
  const co2        = getCO2(tokens, model);
  const apiCost    = getAPICost(tokens, model);
  const energyInfo = getEnergyLevel(tokens);

  const handleSave = () => {
    if (!text.trim()) return;
    setHistory(h => [{ text: text.slice(0, 60) + '...', tokens, energy, model, time: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
  };

  const cardStyle = {
    backgroundColor: theme.card,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: theme.dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
  };

  const exampleText   = showExample === 'bad' ? BAD_PROMPT : GOOD_PROMPT;
  const exampleTokens = estimateTokens(exampleText);

  return (
    <div>
      <h1 style={{ color: theme.text, fontSize: '26px', marginBottom: '4px' }}>⚡ AI Token Counter</h1>
      <p style={{ color: theme.subtext, marginBottom: '24px' }}>Real-time token, energy & CO₂ estimator for AI prompts</p>

      {/* Input */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ color: theme.accent, fontSize: '18px', margin: 0 }}>Enter Your Prompt</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: theme.subtext }}>Model:</span>
            <select value={model} onChange={e => setModel(e.target.value)} style={{
              padding: '6px 12px', borderRadius: '8px', border: `1.5px solid ${theme.border}`,
              fontSize: '14px', color: theme.accent, fontWeight: 'bold',
              backgroundColor: theme.inputBg, cursor: 'pointer',
            }}>
              <option value="large">Large (GPT-4 / Claude Opus)</option>
              <option value="small">Small (GPT-3.5 / Claude Haiku)</option>
            </select>
          </div>
        </div>
        <textarea
          rows={5}
          placeholder="Type or paste your prompt here... results update in real time!"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            border: `1.5px solid ${theme.border}`, fontSize: '14px',
            resize: 'vertical', boxSizing: 'border-box', outline: 'none',
            backgroundColor: theme.inputBg, color: theme.text,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: theme.subtext }}>{charCount} characters · updates in real-time</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setText('')} style={{
              padding: '6px 16px', borderRadius: '8px', border: `1.5px solid ${theme.border}`,
              backgroundColor: 'transparent', color: theme.subtext, cursor: 'pointer', fontSize: '13px',
            }}>🗑️ Clear</button>
            <button onClick={handleSave} style={{
              padding: '6px 16px', borderRadius: '8px', border: 'none',
              backgroundColor: theme.accent, color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
            }}>💾 Save to History</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Tokens', value: tokens, unit: 'tokens', icon: '🔢' },
          { label: 'Energy', value: energy, unit: 'Wh', icon: '⚡' },
          { label: 'CO₂ Emission', value: co2, unit: 'g CO₂', icon: '🌿' },
          { label: 'API Cost', value: `₹${apiCost}`, unit: 'estimated', icon: '💰' },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center', border: `2px solid ${energyInfo.bar}` }}>
            <p style={{ fontSize: '20px', margin: '0 0 4px' }}>{stat.icon}</p>
            <p style={{ fontSize: '13px', color: theme.subtext, marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: energyInfo.color, margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '4px' }}>{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Energy Bar */}
      <div style={cardStyle}>
        <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>🔋 Energy Impact Meter</h2>
        <div style={{ backgroundColor: theme.dark ? '#0f172a' : '#f3f4f6', borderRadius: '999px', height: '28px', overflow: 'hidden' }}>
          <div style={{ width: energyInfo.width, backgroundColor: energyInfo.bar, height: '100%', borderRadius: '999px', transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>
            <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{energyInfo.level}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: theme.subtext }}>
          <span>🟢 Low (&lt;100)</span><span>🟡 Medium (100–300)</span><span>🔴 High (&gt;300)</span>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: energyInfo.bg, borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: energyInfo.color, fontWeight: '500' }}>
            {energyInfo.level === 'Low'    && '✅ Great! Efficient prompt with low energy consumption.'}
            {energyInfo.level === 'Medium' && '⚠️ Moderate energy use. Consider shortening your prompt.'}
            {energyInfo.level === 'High'   && '🚨 High energy! Try splitting into smaller prompts or use a smaller model.'}
          </p>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>📜 Prompt History</h2>
          {history.map((h, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '8px', backgroundColor: theme.tableBg, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: theme.text, flex: 1 }}>{h.text}</span>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: theme.subtext, marginLeft: '12px' }}>
                <span>🔢 {h.tokens}</span>
                <span>⚡ {h.energy}Wh</span>
                <span>🕐 {h.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bad vs Good */}
      <div style={cardStyle}>
        <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>📖 Prompt Optimization Example</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {['bad', 'good'].map(type => (
            <button key={type} onClick={() => setShowExample(type)} style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
              backgroundColor: showExample === type ? (type === 'bad' ? '#fee2e2' : '#dcfce7') : theme.tableBg,
              color: showExample === type ? (type === 'bad' ? '#991b1b' : '#15803d') : theme.subtext,
            }}>
              {type === 'bad' ? '❌ Bad Prompt' : '✅ Good Prompt'}
            </button>
          ))}
        </div>
        <div style={{ padding: '16px', backgroundColor: showExample === 'bad' ? '#fef2f2' : '#f0fdf4', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#374151' }}>{exampleText}</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span style={{ fontWeight: 'bold', color: showExample === 'bad' ? '#991b1b' : '#15803d' }}>~{exampleTokens} tokens</span>
            <span style={{ color: theme.subtext }}>Energy: {getEnergyWh(exampleTokens, 'large')} Wh · CO₂: {getCO2(exampleTokens, 'large')}g</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div style={cardStyle}>
        <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>💡 Optimization Strategies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {optimizationTips.map((tip, i) => (
            <div key={i} style={{ padding: '16px', backgroundColor: theme.dark ? '#0f172a' : '#f0fdf4', borderRadius: '10px', border: `1px solid ${theme.border}`, display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{tip.icon}</span>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: theme.accent, fontSize: '14px' }}>{tip.title}</p>
                <p style={{ margin: 0, fontSize: '13px', color: theme.subtext }}>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TokenCounter;