
# AI Construction Risk Assessment Builder

이 애플리케이션은 Gemini AI를 활용하여 건설 현장의 공종별 위험성평가표를 자동으로 생성합니다.

## 주요 기능
- **공사 개요 입력**: 프로젝트 명칭, 기간, 위치 등 기본 정보 설정
- **공종 분석**: 평가할 공종을 입력하면 AI가 관련 위험 요인을 분석
- **자동 생성**: 위험요인, 위험등급(상/중/하), 안전대책을 포함한 표 생성
- **보고서 출력**: 생성된 결과물을 인쇄하거나 PDF로 저장 가능 (브라우저 인쇄 기능 활용)

## 배포 가이드 (Vercel)

1. **GitHub 저장소 생성**: 이 파일들을 GitHub 저장소에 푸시합니다.
2. **Vercel 프로젝트 연결**: Vercel 대시보드에서 `Import Project`를 클릭하고 해당 저장소를 선택합니다.
3. **환경 변수 설정**: **[중요]** Vercel 프로젝트 설정의 `Environment Variables` 섹션에 다음 항목을 추가해야 합니다.
   - `API_KEY`: Google AI Studio에서 발급받은 Gemini API 키

## 로컬 개발
```bash
npm install
npm run dev
```
