
import React, { useState, useEffect } from 'react';
import { ProjectOverview, RiskItem, AppStep } from './types';
import { generateRiskAssessment } from './geminiService';
import { RiskLevelBadge } from './components/RiskLevelBadge';
import { 
  Construction, 
  ArrowRight, 
  Download, 
  RefreshCcw, 
  Loader2, 
  CheckCircle2,
  MapPin,
  Calendar,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  FileText,
  Key,
  ExternalLink,
  Settings
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
  const [loadingMsg, setLoadingMsg] = useState('데이터를 분석 중입니다...');
  
  // API 키가 있는지 확인 (Vercel 환경변수 process.env.API_KEY)
  const isApiKeyConfigured = !!process.env.API_KEY && process.env.API_KEY !== 'undefined';

  const fillExample = () => {
    setOverview({
      projectName: '성수동 지식산업센터 신축공사',
      location: '서울특별시 성동구 성수동 2가 123-4',
      duration: '2024.03 ~ 2026.08',
      description: '지하 4층, 지상 15층 규모의 철골 철근 콘크리트 구조 사무용 빌딩'
    });
    setWorkTypes('가설 비계 설치, 지하 토공사 및 버팀대 설치, 철골 부재 인양 작업, 고소 작업대 이용 용접 작업');
  };

  const handleOverviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('WORK_TYPE');
  };

  const handleWorkTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('ANALYZING');
    
    const messages = [
      "공사 현장의 건축 구조적 특성을 파악하고 있습니다...",
      "입력된 공종별 유해·위험요인을 도출하고 있습니다...",
      "산업안전보건기준에 따른 안전대책을 수립 중입니다...",
      "KOSHA 가이드라인과 최신 사고 사례를 매칭 중입니다..."
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMsg(messages[msgIndex]);
    }, 2500);

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
    if (confirm("입력한 내용이 모두 초기화됩니다. 계속하시겠습니까?")) {
      setStep('OVERVIEW');
      setResults([]);
    }
  };

  // API 키가 없을 때 보여줄 가이드 화면
  if (!isApiKeyConfigured) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-3xl shadow-2xl shadow-amber-500/20 mb-4">
              <Key size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">AI 입장권(API Key)이 필요합니다</h1>
            <p className="text-slate-400 font-medium">앱을 작동시키려면 Google의 AI 서비스를 연결해야 합니다.</p>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <div className="space-y-1">
                <p className="font-bold">입장권(API Key) 발급받기</p>
                <p className="text-sm text-slate-400 mb-3">아래 버튼을 눌러 무료 키를 발급받고 코드를 복사하세요.</p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  무료 키 발급 사이트 가기 <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <div className="space-y-1">
                <p className="font-bold">Vercel 설정에 등록하기</p>
                <p className="text-sm text-slate-400">Vercel 대시보드에서 <b>Settings &gt; Environment Variables</b> 메뉴로 이동하세요.</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="bg-slate-900 p-2 rounded-lg text-[10px] font-mono border border-slate-700">
                    <span className="text-slate-500 block mb-1 uppercase">Key</span>
                    API_KEY
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg text-[10px] font-mono border border-slate-700">
                    <span className="text-slate-500 block mb-1 uppercase">Value</span>
                    복사한_키_붙여넣기
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <div className="space-y-1">
                <p className="font-bold">다시 배포(Redeploy) 하기</p>
                <p className="text-sm text-slate-400">설정 저장 후 <b>Deployments</b> 메뉴에서 <b>Redeploy</b>를 실행하면 완료!</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-200 text-sm leading-relaxed">
            <AlertTriangle className="shrink-0" size={20} />
            <p>설정을 마친 후 다시 배포(Redeploy)를 해야 AI가 적용됩니다. 궁금한 점은 언제든 물어봐 주세요!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 no-print sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl text-white shadow-inner">
              <Construction size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">AI 위험성평가 자동생성기</h1>
              <p className="text-slate-500 text-[10px] font-medium tracking-wider uppercase">Beta: Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            {step === 'RESULT' && (
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all font-semibold"
              >
                <RefreshCcw size={16} /> 처음부터 다시 하기
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-10">
        {/* Step Indicators */}
        <div className="flex justify-between mb-12 no-print relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
          {[
            { id: 'OVERVIEW', label: '공사개요', icon: Briefcase },
            { id: 'WORK_TYPE', label: '공종입력', icon: Construction },
            { id: 'ANALYZING', label: 'AI 분석', icon: Loader2 },
            { id: 'RESULT', label: '보고서', icon: FileText }
          ].map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = ['OVERVIEW', 'WORK_TYPE', 'ANALYZING', 'RESULT'].indexOf(step) > idx;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 bg-slate-50 px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                  ${isActive ? 'border-amber-500 bg-white text-amber-600 font-bold scale-110 ring-4 ring-amber-50' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 bg-white text-slate-400'}`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <s.icon size={20} className={isActive && s.id === 'ANALYZING' ? 'animate-spin' : ''} />}
                </div>
                <span className={`text-xs font-bold tracking-tight ${isActive ? 'text-slate-900 underline underline-offset-4 decoration-amber-500' : isCompleted ? 'text-green-600' : 'text-slate-400'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className={`transition-all duration-500 ${step === 'RESULT' ? '' : 'bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 md:p-12'}`}>
          
          {step === 'OVERVIEW' && (
            <form onSubmit={handleOverviewSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">공사 개요 입력</h2>
                  <p className="text-slate-500">평가 대상이 될 공사 현장의 기본 정보를 입력해주세요.</p>
                </div>
                <button 
                  type="button"
                  onClick={fillExample}
                  className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg font-bold border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Lightbulb size={14} /> 예시 데이터 채우기
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800">공사명</label>
                  <input 
                    required
                    value={overview.projectName}
                    onChange={e => setOverview({...overview, projectName: e.target.value})}
                    placeholder="예: OO 아파트 신축공사"
                    className="w-full border-slate-200 border-2 rounded-2xl p-4 focus:border-amber-500 focus:ring-0 outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800">현장 위치</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      value={overview.location}
                      onChange={e => setOverview({...overview, location: e.target.value})}
                      placeholder="예: 서울특별시 성동구..."
                      className="w-full border-slate-200 border-2 rounded-2xl p-4 pl-12 focus:border-amber-500 focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800">공사 기간</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      value={overview.duration}
                      onChange={e => setOverview({...overview, duration: e.target.value})}
                      placeholder="예: 2024.01 ~ 2025.12"
                      className="w-full border-slate-200 border-2 rounded-2xl p-4 pl-12 focus:border-amber-500 focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800">구조 및 공법</label>
                  <input 
                    value={overview.description}
                    onChange={e => setOverview({...overview, description: e.target.value})}
                    placeholder="예: 철근콘크리트 구조, 가설 건물 등"
                    className="w-full border-slate-200 border-2 rounded-2xl p-4 focus:border-amber-500 focus:ring-0 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
                >
                  다음 단계로 <ArrowRight size={20} />
                </button>
              </div>
            </form>
          )}

          {step === 'WORK_TYPE' && (
            <form onSubmit={handleWorkTypeSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">대상 공종 입력</h2>
                <p className="text-slate-500">위험성을 평가할 작업 내용을 쉼표(,)로 구분하여 입력해주세요.</p>
              </div>

              <div className="space-y-3">
                <textarea 
                  required
                  rows={6}
                  value={workTypes}
                  onChange={e => setWorkTypes(e.target.value)}
                  placeholder="예: 비계 설치 작업, 굴착 공사, 고소 작업대 작업, 용접 및 용단 작업..."
                  className="w-full border-slate-200 border-2 rounded-2xl p-6 focus:border-amber-500 focus:ring-0 outline-none text-lg transition-all shadow-inner"
                />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between">
                <button 
                  type="button"
                  onClick={() => setStep('OVERVIEW')}
                  className="text-slate-500 px-6 py-4 font-bold hover:text-slate-800 transition-all"
                >
                  이전으로
                </button>
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl"
                >
                  위험성평가표 생성하기 <ArrowRight size={20} />
                </button>
              </div>
            </form>
          )}

          {step === 'ANALYZING' && (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
              <div className="relative">
                <div className="w-28 h-28 border-[6px] border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Construction size={32} className="text-amber-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{loadingMsg}</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm">
                  산업안전보건법 가이드라인에 맞춰 최적의 안전 대책을 수립하고 있습니다.
                </p>
              </div>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">작성이 완료되었습니다!</h2>
                    <p className="text-slate-500 font-medium">내용을 확인하고 인쇄하여 현장에 게시하세요.</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Download size={20} /> 보고서 인쇄 (PDF)
                </button>
              </div>

              {/* Assessment Report Table */}
              <div id="assessment-report" className="bg-white shadow-2xl border-4 border-slate-900 overflow-hidden rounded-sm">
                <div className="p-8 border-b-4 border-slate-900 bg-slate-50 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">위험성평가표</h1>
                    <p className="text-slate-500 font-bold mt-2 tracking-widest text-xs uppercase underline underline-offset-4 decoration-amber-500">Safety First Construction Assessment</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex justify-end gap-2 items-center mb-2">
                      <div className="w-10 h-10 border-2 border-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-400">담당</div>
                      <div className="w-10 h-10 border-2 border-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-400">안전</div>
                      <div className="w-10 h-10 border-2 border-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-400">소장</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border-b border-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">공사명</span>
                    <p className="font-bold text-slate-900 text-xs">{overview.projectName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">위치</span>
                    <p className="font-bold text-slate-900 text-xs">{overview.location}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">기간</span>
                    <p className="font-bold text-slate-900 text-xs">{overview.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">발행일</span>
                    <p className="font-bold text-slate-900 text-xs">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-4 py-3 border-r border-slate-700 text-left font-black w-[15%]">공종</th>
                      <th className="px-4 py-3 border-r border-slate-700 text-left font-black w-[30%]">유해·위험요인</th>
                      <th className="px-4 py-3 border-r border-slate-700 text-center font-black w-[10%]">등급</th>
                      <th className="px-4 py-3 text-left font-black w-[45%]">안전보건대책</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-5 border-r border-slate-200 font-bold text-slate-900 align-top">{item.workType}</td>
                        <td className="px-4 py-5 border-r border-slate-200 text-slate-700 align-top leading-relaxed">{item.riskFactor}</td>
                        <td className="px-2 py-5 border-r border-slate-200 text-center align-top">
                          <RiskLevelBadge level={item.riskLevel} />
                        </td>
                        <td className="px-4 py-5 text-slate-700 align-top leading-relaxed whitespace-pre-wrap">{item.safetyMeasure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-4 bg-slate-900 text-[8px] font-bold text-slate-400 flex justify-between items-center">
                  <p>이 보고서는 AI가 작성한 안입니다. 현장 안전보건책임자의 최종 승인 후 사용하시기 바랍니다.</p>
                  <p className="tracking-widest">AI SAFETY REPORT V1.0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 px-4 text-center text-slate-400 text-[10px] border-t border-slate-200 no-print">
        <p className="font-bold tracking-widest text-slate-500 uppercase mb-1">Safety First, AI Powered</p>
        <p>© 2024 AI Construction Safety Solution. Built with Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
