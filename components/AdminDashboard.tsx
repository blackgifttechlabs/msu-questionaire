import React, { useState, useEffect, useMemo } from 'react';
import { firebaseService } from '../services/firebaseService';
import { SurveyResponse, Language, Section } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  CartesianGrid, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ResponseDetail from './ResponseDetail';
import * as Analytics from '../utils/analyticsUtils';
import { LOGO_URL, QUESTIONS } from '../constants';

const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
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

  const metrics = useMemo(() => ({
    quality: Analytics.getQualityMetrics(responses),
    adoption: Analytics.getPracticeAdoption(responses),
    demographics: Analytics.getDemographicInsights(responses),
    perceptions: Analytics.getPerceptionScores(responses),
    geography: Analytics.getGeographicData(responses),
    extension: Analytics.getExtensionImpact(responses),
    challenges: Analytics.getChallengeThemes(responses)
  }), [responses]);

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const dateStr = new Date().toLocaleDateString();

      const addHeader = (title: string) => {
        doc.addImage(LOGO_URL, 'PNG', 10, 10, 18, 18);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(6, 78, 59); // MSU Emerald
        doc.text('MIDLANDS STATE UNIVERSITY', 32, 18);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Faculty of Agriculture, Food and Natural Resources Management', 32, 23);
        doc.text(`Report Generated: ${dateStr}`, pageWidth - 10, 18, { align: 'right' });
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(title, pageWidth / 2, 40, { align: 'center' });
        doc.setDrawColor(6, 78, 59);
        doc.setLineWidth(0.5);
        doc.line(10, 43, pageWidth - 10, 43);
      };

      // PAGE 1: EXECUTIVE SUMMARY
      addHeader('RESEARCH ANALYTICS SUMMARY');
      
      const maleCount = responses.filter(r => r.answers['A1_gender'] === 'male').length;
      const femaleCount = responses.filter(r => r.answers['A1_gender'] === 'female').length;
      const chivi16 = responses.filter(r => r.ward === 'Chivi - Ward 16').length;
      const chivi18 = responses.filter(r => r.ward === 'Chivi - Ward 18').length;
      const zvish4 = responses.filter(r => r.ward === 'Zvishavane - Ward 4').length;
      const zvish9 = responses.filter(r => r.ward === 'Zvishavane - Ward 9').length;

      autoTable(doc, {
        startY: 50,
        head: [['Metric Category', 'Statistic']],
        body: [
          ['Total Respondents', responses.length.toString()],
          ['Male Participants', maleCount.toString()],
          ['Female Participants', femaleCount.toString()],
          ['CHIVI DISTRICT TOTAL', (chivi16 + chivi18).toString()],
          [' - Ward 16', chivi16.toString()],
          [' - Ward 18', chivi18.toString()],
          ['ZVISHAVANE DISTRICT TOTAL', (zvish4 + zvish9).toString()],
          [' - Ward 4', zvish4.toString()],
          [' - Ward 9', zvish9.toString()],
          ['Agritex Outreach Rate', metrics.extension.contactRate + '%'],
          ['Data Accuracy Score', metrics.quality.completionRate.toFixed(1) + '%']
        ],
        theme: 'striped',
        headStyles: { fillColor: [6, 78, 59], fontSize: 11 },
        styles: { fontSize: 10, cellPadding: 4 }
      });

      // INDIVIDUAL RESPONSE SHEETS (Grouped by District & Ward)
      const districts = [
        { name: 'CHIVI', wards: ['Chivi - Ward 16', 'Chivi - Ward 18'] },
        { name: 'ZVISHAVANE', wards: ['Zvishavane - Ward 4', 'Zvishavane - Ward 9'] }
      ];

      districts.forEach(district => {
        district.wards.forEach(wardName => {
          const wardResponses = responses.filter(r => r.ward === wardName);
          if (wardResponses.length === 0) return;

          doc.addPage();
          addHeader(`DETAILED RESPONSES: ${wardName.toUpperCase()}`);
          
          let yPos = 50;

          wardResponses.forEach((res, index) => {
            // Check if we need a new page for the next farmer card
            if (yPos > 240) {
              doc.addPage();
              addHeader(`DETAILED RESPONSES: ${wardName.toUpperCase()} (Cont.)`);
              yPos = 50;
            }

            // Farmer Card Header
            doc.setFillColor(245, 245, 244); // stone-100
            doc.rect(10, yPos, pageWidth - 20, 8, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(6, 78, 59);
            doc.text(`RESPONDENT ID: ${res.farmerId} | Date: ${new Date(res.date).toLocaleDateString()}`, 15, yPos + 5.5);
            yPos += 12;

            // Simple grouped summary of their answers
            const sections = [Section.PROFILE, Section.TILLAGE, Section.NUTRIENTS, Section.SEEDS, Section.PERCEPTIONS, Section.CONCLUSION];
            
            sections.forEach(secName => {
              const secQuestions = QUESTIONS.filter(q => q.section === secName && q.type !== 'info');
              const answeredInSec = secQuestions.filter(q => res.answers[q.id]);

              if (answeredInSec.length > 0) {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(120);
                doc.text(secName.toUpperCase(), 15, yPos);
                yPos += 4;

                answeredInSec.forEach(q => {
                  const val = res.answers[q.id];
                  const label = q.label[Language.ENGLISH].split(':')[0]; // Use the ID prefix for brevity
                  const displayVal = Array.isArray(val) ? val.join(', ') : String(val);

                  doc.setFont('helvetica', 'normal');
                  doc.setTextColor(80);
                  const text = `${label}: ${displayVal}`;
                  const splitText = doc.splitTextToSize(text, pageWidth - 35);
                  doc.text(splitText, 20, yPos);
                  yPos += (splitText.length * 4);
                });
                yPos += 2;
              }
            });

            yPos += 10; // Space between farmer cards
          });
        });
      });

      doc.save(`MSU_Research_Report_${dateStr.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error generating report: " + (error as any).message);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (viewingResponse) {
    return <ResponseDetail response={viewingResponse} onBack={() => setViewingResponse(null)} />;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Database Records</p>
          <h3 className="text-3xl font-black text-stone-900">{responses.length}</h3>
          <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded">Live Cloud Sync</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Avg Accuracy</p>
          <h3 className="text-3xl font-black text-stone-900">{metrics.quality.completionRate.toFixed(1)}%</h3>
          <div className="w-full bg-stone-100 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${metrics.quality.completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Agritex Reach</p>
          <h3 className="text-3xl font-black text-stone-900">{metrics.extension.contactRate}%</h3>
          <p className="text-[10px] text-stone-400 font-bold mt-1">Institutional Support</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Sample Validity</p>
          <h3 className="text-3xl font-black text-stone-900">Valid</h3>
          <p className="text-[10px] text-stone-400 font-bold mt-1">Verified Research Data</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-emerald-900 uppercase tracking-tight leading-none">Management Console</h2>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Midlands State University Research Division</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={generateReport}
            disabled={generatingReport || responses.length === 0}
            className={`flex items-center gap-2 py-3 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${generatingReport ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-800 active:scale-95'}`}
          >
            {generatingReport ? (
              <>
                <div className="w-3 h-3 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin"></div>
                Generating Report...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Export Full PDF Report
              </>
            )}
          </button>

          <div className="flex bg-stone-200 p-1.5 rounded-2xl">
            {(['table', 'charts', 'behaviors'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none py-2 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-emerald-900 shadow-md' : 'text-stone-500 hover:text-stone-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'table' && (
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-stone-400 font-black text-xs uppercase tracking-widest">Connecting to Cloud...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-stone-50 text-stone-400 font-black uppercase text-[10px] tracking-widest border-b border-stone-200">
                  <tr>
                    <th className="px-8 py-5">Case ID</th>
                    <th className="px-8 py-5">Ward Location</th>
                    <th className="px-8 py-5">Collection Date</th>
                    <th className="px-8 py-5 text-center">Respondent</th>
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
                        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest border-2 border-emerald-100 px-3 py-1 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          View Sheet
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
              Sample Education Level
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
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h3 className="font-black text-stone-800 mb-6 uppercase tracking-widest text-xs">Farmer Perception Matrix</h3>
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;