
import React, { useState, useCallback } from 'react';
import { ProjectOverview, RiskItem, AppStep } from './types';
import { generateRiskAssessment } from './geminiService';
import { RiskLevelBadge } from './components/RiskLevelBadge';
import { 
  ClipboardCheck, 
  Construction, 
  ArrowRight, 
  Download, 
  RefreshCcw, 
  Loader2, 
  CheckCircle2,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('OVERVIEW');
  const [overview, setOverview] = useState<ProjectOverview>({
    projectName: '',
    location: '',
    duration: '',
    description: ''
  });
  const [workTypes, setWorkTypes] = useState('');
  const [results, setResults] = useState<RiskItem[]>([]);
  const [loadingMsg, setLoadingMsg] = useState('위험 요인을 분석하고 있습니다...');

  const handleOverviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('WORK_TYPE');
  };

  const handleWorkTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('ANALYZING');
    
    // Simulate thinking steps
    const messages = [
      "공사 현장의 특성을 파악 중입니다...",
      "공종별 위험 요인을 도출하고 있습니다...",
      "KOSHA 가이드라인에 따른 안전 대책을 수립 중입니다...",
      "최종 위험성평가표를 생성하고 있습니다..."
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMsg(messages[msgIndex]);
    }, 2000);

    try {
      const data = await generateRiskAssessment(overview, workTypes);
      setResults(data);
      setStep('RESULT');
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep('WORK_TYPE');
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setStep('OVERVIEW');
    setResults([]);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 px-4 no-print shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg text-slate-900">
              <Construction size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI 위험성평가 자동생성기</h1>
              <p className="text-slate-400 text-xs">GenAI Powered Risk Assessment Tool</p>
            </div>
          </div>
          {step === 'RESULT' && (
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCcw size={16} /> 새 작업 시작
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {/* Step Indicators */}
        <div className="flex justify-between mb-8 no-print">
          {[
            { id: 'OVERVIEW', label: '공사개요', icon: Briefcase },
            { id: 'WORK_TYPE', label: '공종입력', icon: Construction },
            { id: 'ANALYZING', label: 'AI 분석', icon: Loader2 },
            { id: 'RESULT', label: '결과확인', icon: ClipboardCheck }
          ].map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = ['OVERVIEW', 'WORK_TYPE', 'ANALYZING', 'RESULT'].indexOf(step) > idx;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${isActive ? 'border-yellow-500 bg-yellow-50 text-yellow-600 font-bold scale-110' : 
                    isCompleted ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200 text-slate-400'}`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <s.icon size={20} className={isActive && s.id === 'ANALYZING' ? 'animate-spin' : ''} />}
                </div>
                <span className={`text-xs ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 transition-all">
          
          {step === 'OVERVIEW' && (
            <form onSubmit={handleOverviewSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Briefcase className="text-yellow-600" /> 공사 개요 입력
                </h2>
                <p className="text-slate-500">평가 대상이 될 공사 현장의 기본 정보를 입력해주세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">공사명</label>
                  <input 
                    required
                    value={overview.projectName}
                    onChange={e => setOverview({...overview, projectName: e.target.value})}
                    placeholder="예: OO 아파트 신축공사"
                    className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">현장 위치</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      value={overview.location}
                      onChange={e => setOverview({...overview, location: e.target.value})}
                      placeholder="예: 서울특별시 강남구..."
                      className="w-full border-slate-200 border rounded-xl p-3 pl-10 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">공사 기간</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      value={overview.duration}
                      onChange={e => setOverview({...overview, duration: e.target.value})}
                      placeholder="예: 2024.01 ~ 2025.12"
                      className="w-full border-slate-200 border rounded-xl p-3 pl-10 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">주요 공법/특징</label>
                  <input 
                    value={overview.description}
                    onChange={e => setOverview({...overview, description: e.target.value})}
                    placeholder="예: 철근콘크리트 구조, 고층 건물 등"
                    className="w-full border-slate-200 border rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md"
                >
                  다음 단계로 <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {step === 'WORK_TYPE' && (
            <form onSubmit={handleWorkTypeSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                  <Construction className="text-yellow-600" /> 공종 입력
                </h2>
                <p className="text-slate-500">위험성평가를 실시할 주요 공종들을 쉼표(,)로 구분하여 입력해주세요.</p>
              </div>

              <div className="space-y-2">
                <textarea 
                  required
                  rows={5}
                  value={workTypes}
                  onChange={e => setWorkTypes(e.target.value)}
                  placeholder="예: 비계 설치 작업, 거푸집 조립, 타워크레인 양중 작업, 용접 작업"
                  className="w-full border-slate-200 border rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none text-lg"
                />
                <p className="text-xs text-slate-400">구체적으로 입력할수록 AI가 더 정확한 위험요인을 분석합니다.</p>
              </div>

              <div className="pt-4 flex justify-between">
                <button 
                  type="button"
                  onClick={() => setStep('OVERVIEW')}
                  className="text-slate-600 px-6 py-3 font-semibold hover:bg-slate-50 rounded-xl transition-all"
                >
                  이전으로
                </button>
                <button 
                  type="submit"
                  className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-md"
                >
                  AI 위험성 분석 시작 <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {step === 'ANALYZING' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-yellow-100 border-t-yellow-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Construction size={24} className="text-yellow-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{loadingMsg}</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  공사 현장의 안전을 위해 데이터베이스를 조회하고 최적의 안전 대책을 도출하고 있습니다.
                </p>
              </div>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 no-print border-b pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">위험성평가표 생성 완료</h2>
                  <p className="text-slate-500">AI가 분석한 결과를 확인하고 보고서로 출력하세요.</p>
                </div>
                <button 
                  onClick={printReport}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md"
                >
                  <Download size={18} /> PDF/인쇄하기
                </button>
              </div>

              {/* Print Layout */}
              <div id="assessment-report" className="border border-slate-800 bg-white">
                <div className="p-6 border-b-2 border-slate-800 bg-slate-50 flex justify-between items-center">
                  <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">위험성평가표</h1>
                  <div className="text-right text-xs">
                    <p>작성일: {new Date().toLocaleDateString()}</p>
                    <p>시스템: Construction AI Safety Engine</p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">공사명</span>
                    <span className="font-bold text-slate-900">{overview.projectName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">현장 위치</span>
                    <span className="text-slate-900">{overview.location}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">공사 기간</span>
                    <span className="text-slate-900">{overview.duration}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">현장 특성</span>
                    <span className="text-slate-900">{overview.description || '-'}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="px-4 py-3 border border-slate-700 text-left font-bold w-1/5">공종</th>
                        <th className="px-4 py-3 border border-slate-700 text-left font-bold w-2/5">위험요인</th>
                        <th className="px-4 py-3 border border-slate-700 text-center font-bold w-24">위험등급</th>
                        <th className="px-4 py-3 border border-slate-700 text-left font-bold w-2/5">안전대책</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {results.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-4 py-4 border border-slate-200 font-bold text-slate-900 align-top">
                            {item.workType}
                          </td>
                          <td className="px-4 py-4 border border-slate-200 text-slate-700 align-top leading-relaxed whitespace-pre-wrap">
                            {item.riskFactor}
                          </td>
                          <td className="px-4 py-4 border border-slate-200 text-center align-top">
                            <RiskLevelBadge level={item.riskLevel} />
                          </td>
                          <td className="px-4 py-4 border border-slate-200 text-slate-700 align-top leading-relaxed whitespace-pre-wrap">
                            <div className="flex items-start gap-2">
                              <span className="mt-1 text-green-600 shrink-0"><CheckCircle2 size={14} /></span>
                              {item.safetyMeasure}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 text-[10px] text-slate-400 border-t border-slate-800">
                  본 평가표는 AI에 의해 자동 생성된 참고용 데이터입니다. 실제 현장 상황을 반드시 반영하여 최종 확인 바랍니다.
                </div>
              </div>

              <div className="no-print bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 h-fit">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">전문가 검토 권장</h4>
                  <p className="text-blue-800 text-xs mt-1">
                    생성된 위험성평가표는 산업안전보건기준을 바탕으로 작성되었으나, 실제 현장의 가변적인 상황(날씨, 주변 환경 등)은 반영되지 않았을 수 있습니다. 안전관리자의 검토 후 사용하세요.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 px-4 text-center text-slate-400 text-sm border-t border-slate-200 no-print">
        <p>© 2024 AI Construction Safety Solution. Built with Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
