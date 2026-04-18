import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from '../App';

const priceUSD = 100;
const priceINR = priceUSD * USD_TO_INR;
const COLORS = ['#15803d', '#3b82f6', '#f59e0b'];
const PIE_COLORS = ['#4ade80', '#15803d', '#86efac', '#166534', '#bbf7d0'];

const monthlyData = [
  { month: 'Jan', AWS: 351350, Azure: 325650, GCP: 292250 },
  { month: 'Feb', AWS: 367400, Azure: 342350, GCP: 308950 },
  { month: 'Mar', AWS: 342350, Azure: 317300, GCP: 283900 },
  { month: 'Apr', AWS: 384100, Azure: 359050, GCP: 325650 },
  { month: 'May', AWS: 400800, Azure: 375750, GCP: 342350 },
  { month: 'Jun', AWS: 417500, Azure: 392450, GCP: 359050 },
];

const comparisonTable = [
  { feature: 'Backend Server (10 VMs)', AWS: '₹80,160', Azure: '₹70,975', GCP: '₹40,080', winner: 'GCP' },
  { feature: 'Database (Managed SQL)',  AWS: '₹1,00,200', Azure: '₹91,850', GCP: '₹75,150', winner: 'GCP' },
  { feature: 'Storage (10 TB)',         AWS: '₹19,205', Azure: '₹15,030', GCP: '₹16,700', winner: 'Azure' },
  { feature: 'Data Transfer (50 TB)',   AWS: '₹3,75,750', Azure: '₹3,63,225', GCP: '₹3,34,000', winner: 'GCP' },
  { feature: 'CDN',                     AWS: '₹35,488', Azure: '₹33,400', GCP: '₹31,730', winner: 'GCP' },
];

const totalCosts = [
  { provider: 'AWS',   total: 610803, storage: 19205, compute: 80160, database: 100200, transfer: 375750, cdn: 35488 },
  { provider: 'Azure', total: 574480, storage: 15030, compute: 70975, database: 91850,  transfer: 363225, cdn: 33400 },
  { provider: 'GCP',   total: 497660, storage: 16700, compute: 40080, database: 75150,  transfer: 334000, cdn: 31730 },
];

const featureComparison = [
  { feature: 'Global Regions',          AWS: '33',          Azure: '60+',        GCP: '40+' },
  { feature: 'Free Tier',               AWS: '12 months',   Azure: '12 months',  GCP: 'Always free' },
  { feature: 'Best For',                AWS: 'Enterprises', Azure: 'MS Stack',   GCP: 'AI / ML' },
  { feature: 'Kubernetes',              AWS: 'EKS',         Azure: 'AKS',        GCP: 'GKE (Best)' },
  { feature: 'Carbon Neutral Goal',     AWS: '2040',        Azure: '2030',       GCP: '2030' },
  { feature: 'Pricing Model',           AWS: 'Pay-as-go',   Azure: 'Pay-as-go',  GCP: 'Per-second' },
  { feature: 'India Data Centers',      AWS: 'Mumbai',      Azure: 'Pune+Chennai', GCP: 'Mumbai+Delhi' },
  { feature: 'Sustainability Score',    AWS: '⭐⭐⭐',     Azure: '⭐⭐⭐⭐',   GCP: '⭐⭐⭐⭐⭐' },
];

function Comparison() {
  const theme = useTheme();
  const [selectedProvider, setSelectedProvider] = useState('AWS');
  const [activeTab, setActiveTab] = useState('cost');

  const cardStyle = {
    backgroundColor: theme.card,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: theme.dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
  };

  const pieData = (provider) => {
    const d = totalCosts.find(t => t.provider === provider);
    return [
      { name: 'Storage',  value: d.storage },
      { name: 'Compute',  value: d.compute },
      { name: 'Database', value: d.database },
      { name: 'Transfer', value: d.transfer },
      { name: 'CDN',      value: d.cdn },
    ];
  };

  const tabs = ['cost', 'features', 'sustainability'];

  return (
    <div>
      <h1 style={{ color: theme.text, fontSize: '26px', marginBottom: '4px' }}>📊 Cloud Provider Comparison</h1>
      <p style={{ color: theme.subtext, marginBottom: '24px' }}>E-commerce app (like Swiggy/Flipkart) — costs in Indian Rupees ₹</p>

      {/* Use Case */}
      <div style={{ ...cardStyle, backgroundColor: theme.dark ? '#134e26' : '#dcfce7', border: '2px solid #4ade80' }}>
        <h2 style={{ color: theme.accent, fontSize: '16px', margin: '0 0 8px' }}>🛒 Use Case: Medium E-Commerce App (India)</h2>
        <p style={{ color: theme.text, fontSize: '14px', margin: 0 }}>
          10 backend VMs · 10 TB storage · 50 TB/month transfer · Managed DB · CDN · ~1 Lakh users/day
        </p>
      </div>

      {/* Total Cost Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {totalCosts.map((t, i) => (
          <div key={t.provider} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center', border: `2px solid ${COLORS[i]}` }}>
            <p style={{ fontSize: '13px', color: theme.subtext, marginBottom: '4px' }}>{t.provider} Monthly</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS[i], margin: 0 }}>₹{t.total.toLocaleString('en-IN')}</p>
            {t.provider === 'GCP' && (
              <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: '999px', fontWeight: 'bold' }}>
                💰 Saves ₹{(totalCosts[0].total - t.total).toLocaleString('en-IN')}/mo vs AWS
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 24px', borderRadius: '8px', border: `2px solid ${theme.accent}`,
            backgroundColor: activeTab === tab ? theme.accent : 'transparent',
            color: activeTab === tab ? 'white' : theme.accent,
            fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize',
          }}>
            {tab === 'cost' ? '💰 Cost' : tab === 'features' ? '⚙️ Features' : '🌱 Sustainability'}
          </button>
        ))}
      </div>

      {activeTab === 'cost' && (
        <>
          {/* Cost Table */}
          <div style={cardStyle}>
            <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>💰 Detailed Cost Breakdown (₹/month)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: theme.tableHead }}>
                  {['Component', 'AWS', 'Azure', 'GCP', 'Winner'].map((h, i) => (
                    <th key={h} style={{ padding: '12px', textAlign: i === 0 ? 'left' : 'center', borderBottom: `2px solid ${theme.border}`, color: theme.text }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? theme.card : theme.tableBg }}>
                    <td style={{ padding: '12px', fontWeight: '500', color: theme.text }}>{row.feature}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: theme.text }}>{row.AWS}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: theme.text }}>{row.Azure}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: theme.text }}>{row.GCP}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>{row.winner}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div style={cardStyle}>
            <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>📊 Cost Comparison Chart</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={totalCosts} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="provider" stroke={theme.text} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} stroke={theme.text} />
                <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }} />
                <Legend />
                <Bar dataKey="storage"  name="Storage"  fill="#4ade80" radius={[4,4,0,0]} />
                <Bar dataKey="compute"  name="Compute"  fill="#15803d" radius={[4,4,0,0]} />
                <Bar dataKey="database" name="Database" fill="#166534" radius={[4,4,0,0]} />
                <Bar dataKey="transfer" name="Transfer" fill="#86efac" radius={[4,4,0,0]} />
                <Bar dataKey="cdn"      name="CDN"      fill="#bbf7d0" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={cardStyle}>
            <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>🥧 Cost Distribution</h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              {['AWS', 'Azure', 'GCP'].map((p, i) => (
                <button key={p} onClick={() => setSelectedProvider(p)} style={{
                  padding: '8px 24px', borderRadius: '8px', border: `2px solid ${COLORS[i]}`,
                  backgroundColor: selectedProvider === p ? COLORS[i] : 'transparent',
                  color: selectedProvider === p ? 'white' : COLORS[i],
                  fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
                }}>{p}</button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData(selectedProvider)} cx="50%" cy="50%" outerRadius={110} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData(selectedProvider).map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div style={cardStyle}>
            <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>📈 6-Month Cost Trend (₹)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="month" stroke={theme.text} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} stroke={theme.text} />
                <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }} />
                <Legend />
                <Line type="monotone" dataKey="AWS"   stroke="#15803d" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Azure" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="GCP"   stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'features' && (
        <div style={cardStyle}>
          <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>⚙️ Feature Comparison</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHead }}>
                {['Feature', 'AWS', 'Azure', 'GCP'].map((h, i) => (
                  <th key={h} style={{ padding: '12px', textAlign: i === 0 ? 'left' : 'center', borderBottom: `2px solid ${theme.border}`, color: [theme.text, '#15803d', '#3b82f6', '#f59e0b'][i] }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? theme.card : theme.tableBg }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: theme.text }}>{row.feature}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: theme.text }}>{row.AWS}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: theme.text }}>{row.Azure}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: theme.text }}>{row.GCP}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sustainability' && (
        <div style={cardStyle}>
          <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '16px' }}>🌱 Sustainability Comparison</h2>
          {[
            { provider: 'AWS', goal: '2040', renewable: '100% by 2025', score: '⭐⭐⭐', color: '#15803d', desc: 'The Water Positive and Zero Waste programs are strong. Largest carbon footprint due to sheer scale.' },
            { provider: 'Azure', goal: '2030', renewable: 'Carbon negative by 2030', score: '⭐⭐⭐⭐', color: '#3b82f6', desc: 'Microsoft committed to remove all historical carbon emissions by 2050. Very strong sustainability roadmap.' },
            { provider: 'GCP', goal: '2030', renewable: '24/7 Carbon-free energy', score: '⭐⭐⭐⭐⭐', color: '#f59e0b', desc: 'Google has matched 100% renewable energy since 2017. Most sustainable cloud provider overall.' },
          ].map((p, i) => (
            <div key={i} style={{ padding: '20px', borderRadius: '10px', border: `2px solid ${p.color}`, marginBottom: '16px', backgroundColor: theme.dark ? '#0f172a' : '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ color: p.color, margin: 0, fontSize: '18px' }}>{p.provider}</h3>
                <span style={{ fontSize: '20px' }}>{p.score}</span>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: theme.subtext }}>🎯 Net Zero: <strong style={{ color: theme.text }}>{p.goal}</strong></span>
                <span style={{ color: theme.subtext }}>♻️ {p.renewable}</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: theme.subtext }}>{p.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Conclusion */}
      <div style={{ ...cardStyle, border: '2px solid #4ade80', backgroundColor: theme.dark ? '#134e26' : '#f0fdf4' }}>
        <h2 style={{ color: theme.accent, fontSize: '18px', marginBottom: '12px' }}>🏆 Final Recommendation</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { p: 'AWS', v: 'Best ecosystem. Most services. Highest cost. Good for large enterprises.', c: '#15803d' },
            { p: 'Azure', v: 'Best for Microsoft/enterprise stack. Strong in India with Pune & Chennai DCs.', c: '#3b82f6' },
            { p: 'GCP', v: 'Most cost-effective. Best sustainability. Best for AI/ML & startups.', c: '#f59e0b' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '16px', backgroundColor: theme.card, borderRadius: '10px', border: `2px solid ${c.c}` }}>
              <p style={{ fontWeight: 'bold', color: c.c, marginBottom: '6px', fontSize: '15px' }}>{c.p}</p>
              <p style={{ fontSize: '13px', color: theme.subtext, margin: 0 }}>{c.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comparison;
