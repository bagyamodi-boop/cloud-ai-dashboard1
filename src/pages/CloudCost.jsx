import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../App';

const USD_TO_INR = 83.5;

const pricing = {
  AWS:   { storage: 0.023, compute: 0.096, transfer: 0.09  },
  Azure: { storage: 0.018, compute: 0.085, transfer: 0.087 },
  GCP:   { storage: 0.020, compute: 0.048, transfer: 0.08  },
};

function CloudCost() {
  const theme = useTheme();
  const [storage, setStorage]   = useState('');
  const [compute, setCompute]   = useState('');
  const [transfer, setTransfer] = useState('');
  const [results, setResults]   = useState(null);
  const [currency, setCurrency] = useState('INR');
  const [budget, setBudget]     = useState('');
  const [liveINR, setLiveINR]   = useState(USD_TO_INR);

  useEffect(() => {
    const s = parseFloat(storage) || 0;
    const c = parseFloat(compute) || 0;
    const t = parseFloat(transfer) || 0;
    if (s || c || t) {
      const data = Object.entries(pricing).map(([provider, p]) => {
        const totalUSD = s * p.storage + c * p.compute + t * p.transfer;
        return {
          provider,
          Storage:  parseFloat((s * p.storage  * (currency === 'INR' ? liveINR : 1)).toFixed(2)),
          Compute:  parseFloat((c * p.compute  * (currency === 'INR' ? liveINR : 1)).toFixed(2)),
          Transfer: parseFloat((t * p.transfer * (currency === 'INR' ? liveINR : 1)).toFixed(2)),
          Total:    parseFloat((totalUSD       * (currency === 'INR' ? liveINR : 1)).toFixed(2)),
        };
      });
      setResults(data);
    }
  }, [storage, compute, transfer, currency, liveINR]);

  const sym = currency === 'INR' ? '₹' : '$';

  const cardStyle = {
    backgroundColor: theme.card,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: theme.dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${theme.border}`,
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '6px',
    backgroundColor: theme.inputBg,
    color: theme.text,
    transition: 'all 0.3s ease',
  };

  const cheapest = results ? results.reduce((a, b) => a.Total < b.Total ? a : b) : null;
  const overBudget = budget && results ? results.filter(r => r.Total > parseFloat(budget) * (currency === 'INR' ? liveINR : 1)) : [];

  return (
    <div>
      <h1 style={{ color: theme.text, fontSize: '26px', marginBottom: '4px' }}>☁️ Cloud Cost Calculator</h1>
      <p style={{ color: theme.subtext, marginBottom: '24px' }}>Real-time cost comparison — AWS vs Azure vs GCP</p>

      {/* Live INR rate */}
      <div style={{ ...cardStyle, padding: '14px 24px', backgroundColor: theme.dark ? '#134e26' : '#dcfce7', border: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ color: theme.text, fontSize: '14px' }}>
            💱 <strong>Live Rate:</strong> 1 USD = ₹
            <input
              type="number"
              value={liveINR}
              onChange={e => setLiveINR(parseFloat(e.target.value) || 83.5)}
              style={{ ...inputStyle, width: '90px', display: 'inline-block', marginTop: 0, marginLeft: '8px', padding: '4px 8px' }}
            />
            <span style={{ color: theme.subtext, fontSize: '12px', marginLeft: '8px' }}>(update manually if needed)</span>
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['INR', 'USD'].map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{
                padding: '6px 18px', borderRadius: '8px', border: `2px solid ${theme.accent}`,
                backgroundColor: currency === c ? theme.accent : 'transparent',
                color: currency === c ? 'white' : theme.accent,
                fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
              }}>{c === 'INR' ? '🇮🇳 ₹ INR' : '🇺🇸 $ USD'}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div style={cardStyle}>
        <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '20px' }}>⚡ Enter Usage (Real-time)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { label: '🗄️ Storage (GB)', val: storage, set: setStorage, hint: 'Cost = GB × price/GB' },
            { label: '💻 Compute Hours', val: compute, set: setCompute, hint: 'Cost = hours × cost/hr' },
            { label: '🌐 Data Transfer (GB)', val: transfer, set: setTransfer, hint: 'Cost = GB × rate' },
          ].map(({ label, val, set, hint }) => (
            <div key={label}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: theme.accent, display: 'block' }}>{label}</label>
              <input style={inputStyle} type="number" placeholder="e.g. 500" value={val} onChange={e => set(e.target.value)} />
              <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '4px' }}>{hint}</p>
            </div>
          ))}
        </div>

        {/* Budget Alert */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: theme.accent }}>🚨 Budget Alert ({sym}):</label>
          <input
            style={{ ...inputStyle, width: '160px', marginTop: 0 }}
            type="number"
            placeholder={`e.g. ${currency === 'INR' ? '50000' : '600'}`}
            value={budget}
            onChange={e => setBudget(e.target.value)}
          />
          {overBudget.length > 0 && (
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px' }}>
              ⚠️ {overBudget.map(r => r.provider).join(', ')} exceed your budget!
            </span>
          )}
        </div>
      </div>

      {/* Pricing Reference */}
      <div style={cardStyle}>
        <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>📋 Real Pricing Reference</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: theme.tableHead }}>
              {['Provider', 'Storage ($/GB)', 'Compute ($/hr)', 'Transfer ($/GB)'].map(h => (
                <th key={h} style={{ padding: '10px', textAlign: h === 'Provider' ? 'left' : 'center', borderBottom: `2px solid ${theme.border}`, color: theme.text }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(pricing).map(([provider, p], i) => (
              <tr key={provider} style={{ backgroundColor: i % 2 === 0 ? theme.card : theme.tableBg }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: theme.accent }}>{provider}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: theme.text }}>${p.storage}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: theme.text }}>${p.compute}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: theme.text }}>${p.transfer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      {results && (
        <>
          {cheapest && (
            <div style={{ ...cardStyle, backgroundColor: theme.dark ? '#134e26' : '#dcfce7', border: '2px solid #4ade80', padding: '16px 24px' }}>
              <p style={{ margin: 0, color: theme.text, fontWeight: 'bold', fontSize: '15px' }}>
                🏆 Cheapest Option: <span style={{ color: theme.accent, fontSize: '18px' }}>{cheapest.provider}</span> at {sym}{cheapest.Total.toLocaleString('en-IN')} /month
              </p>
            </div>
          )}

          <div style={cardStyle}>
            <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>💰 Cost Breakdown</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: theme.tableHead }}>
                  {['Provider', 'Storage', 'Compute', 'Transfer', 'Total'].map(h => (
                    <th key={h} style={{ padding: '10px', textAlign: h === 'Provider' ? 'left' : 'center', borderBottom: `2px solid ${theme.border}`, color: theme.text }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.provider} style={{ backgroundColor: i % 2 === 0 ? theme.card : theme.tableBg }}>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: theme.accent }}>{r.provider}</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: theme.text }}>{sym}{r.Storage.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: theme.text }}>{sym}{r.Compute.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: theme.text }}>{sym}{r.Transfer.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: r.provider === cheapest?.provider ? '#15803d' : theme.text }}>
                      {r.provider === cheapest?.provider ? '🏆 ' : ''}{sym}{r.Total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={cardStyle}>
            <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>📊 Cost Comparison Chart</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={results} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="provider" stroke={theme.text} />
                <YAxis tickFormatter={v => `${sym}${v.toLocaleString('en-IN')}`} stroke={theme.text} />
                <Tooltip formatter={v => `${sym}${v.toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }} />
                <Legend />
                <Bar dataKey="Storage"  fill="#4ade80" radius={[4,4,0,0]} />
                <Bar dataKey="Compute"  fill="#15803d" radius={[4,4,0,0]} />
                <Bar dataKey="Transfer" fill="#86efac" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {results.map(r => (
              <div key={r.provider} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center', border: `2px solid ${theme.border}` }}>
                <p style={{ fontSize: '13px', color: theme.subtext, marginBottom: '4px' }}>{r.provider} Total</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: theme.accent, margin: 0 }}>{sym}{r.Total.toLocaleString('en-IN')}</p>
                <p style={{ fontSize: '12px', color: theme.subtext, marginTop: '4px' }}>per month (estimated)</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CloudCost;