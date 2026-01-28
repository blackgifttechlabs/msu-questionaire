
import React, { useState, useEffect, useMemo } from 'react';
import { firebaseService } from '../services/firebaseService';
import { SurveyResponse } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  CartesianGrid, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import ResponseDetail from './ResponseDetail';
import * as Analytics from '../utils/analyticsUtils';

const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'table' | 'charts' | 'behaviors'>('table');
  const [viewingResponse, setViewingResponse] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await firebaseService.getResponses();
      setResponses(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Memoized Analytics Data
  const metrics = useMemo(() => ({
    quality: Analytics.getQualityMetrics(responses),
    adoption: Analytics.getPracticeAdoption(responses),
    demographics: Analytics.getDemographicInsights(responses),
    perceptions: Analytics.getPerceptionScores(responses),
    geography: Analytics.getGeographicData(responses),
    extension: Analytics.getExtensionImpact(responses),
    challenges: Analytics.getChallengeThemes(responses)
  }), [responses]);

  if (viewingResponse) {
    return <ResponseDetail response={viewingResponse} onBack={() => setViewingResponse(null)} />;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Records</p>
          <h3 className="text-3xl font-black text-stone-900">{responses.length}</h3>
          <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded">Synced</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Completion Rate</p>
          <h3 className="text-3xl font-black text-stone-900">{metrics.quality.completionRate.toFixed(1)}%</h3>
          <div className="w-full bg-stone-100 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${metrics.quality.completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Extension Reach</p>
          <h3 className="text-3xl font-black text-stone-900">{metrics.extension.contactRate}%</h3>
          <p className="text-[10px] text-stone-400 font-bold mt-1">Contacted Agritex</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Avg Perception</p>
          <h3 className="text-3xl font-black text-stone-900">
            {(metrics.perceptions.reduce((a, b) => a + b.average, 0) / metrics.perceptions.length || 0).toFixed(1)}/5
          </h3>
          <p className="text-[10px] text-stone-400 font-bold mt-1">Sustainability Score</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-emerald-900 uppercase tracking-tight">Research Analytics</h2>
        <div className="flex bg-stone-200 p-1.5 rounded-2xl w-full md:w-auto">
          {(['table', 'charts', 'behaviors'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none py-2 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-emerald-900 shadow-md' : 'text-stone-500 hover:text-stone-700'}`}
            >
              {tab === 'behaviors' ? 'Response Behaviors' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'table' && (
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-stone-400 font-black text-xs uppercase tracking-widest">Syncing Cloud Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-stone-50 text-stone-400 font-black uppercase text-[10px] tracking-widest border-b border-stone-200">
                  <tr>
                    <th className="px-8 py-5">Farmer ID</th>
                    <th className="px-8 py-5">Location (Ward)</th>
                    <th className="px-8 py-5">Date Collected</th>
                    <th className="px-8 py-5 text-center">Gender</th>
                    <th className="px-8 py-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {responses.map(r => (
                    <tr 
                      key={r.id} 
                      onClick={() => setViewingResponse(r)}
                      className="hover:bg-emerald-50/50 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-5 font-black text-stone-900 group-hover:text-emerald-700">{r.farmerId}</td>
                      <td className="px-8 py-5 text-stone-600 font-medium">{r.ward}</td>
                      <td className="px-8 py-5 text-stone-400 font-bold">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${r.answers['A1_gender'] === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                          {r.answers['A1_gender'] || 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest border-2 border-emerald-100 px-3 py-1 rounded-lg group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                          View Page
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="font-black text-stone-800 mb-8 flex items-center gap-3 text-xs uppercase tracking-widest">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              Practice Adoption (Tillage)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.adoption.tillage}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {metrics.adoption.tillage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="font-black text-stone-800 mb-8 flex items-center gap-3 text-xs uppercase tracking-widest">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Education Impact on Sample
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.demographics.education}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'behaviors' && (
        <div className="space-y-8 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Perception Radar */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="font-black text-stone-800 mb-6 uppercase tracking-widest text-xs">Farmer Perception Matrix (Avg)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics.perceptions}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                    <Radar name="Averages" dataKey="average" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="font-black text-stone-800 mb-6 uppercase tracking-widest text-xs">Responses per Ward</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.geography} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Challenge Word Cloud Placeholder Data */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm md:col-span-2">
              <h3 className="font-black text-stone-800 mb-6 uppercase tracking-widest text-xs">Most Common Challenges (Mentions)</h3>
              <div className="flex flex-wrap gap-3">
                {metrics.challenges.map(theme => (
                  <div key={theme.keyword} className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-2xl border border-stone-100 hover:border-emerald-200 transition-all cursor-default">
                    <span className="font-black text-stone-900">{theme.keyword}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-black">{theme.mentions}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extension Impact */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="font-black text-stone-800 mb-6 uppercase tracking-widest text-xs">Agritex Relevance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.extension.relevanceDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.extension.relevanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {metrics.extension.relevanceDistribution.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2 text-[9px] font-bold text-stone-400">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
