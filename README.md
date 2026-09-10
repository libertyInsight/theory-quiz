# 윤리사상가 기출 아카이브

동양·서양 윤리사상가 48인, 948문항 O/X 기출 퀴즈 웹앱.

## 로컬에서 실행해보기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 배포 (Vercel 기준)

1. 이 폴더를 GitHub 저장소에 업로드
2. https://vercel.com 에서 GitHub 계정으로 로그인
3. "Add New Project" → 방금 만든 저장소 선택
4. 빌드 설정은 자동 감지됨 (Framework: Vite) — 그대로 "Deploy" 클릭
5. 2~3분 뒤 `프로젝트명.vercel.app` 주소로 접속 가능

Netlify를 쓰는 경우도 동일하게 GitHub 저장소만 연결하면 자동으로 빌드됩니다
(Build command: `npm run build`, Publish directory: `dist`).

## 문항 데이터 업데이트하는 법 (엑셀 → 웹앱 재반영)

이 배포판에는 브라우저에서 바로 엑셀을 업로드하는 관리자 모드가 빠져 있습니다
(Claude 아티팩트 전용 저장소 API에 의존했던 기능이라 일반 웹 배포에서는 작동하지
않기 때문입니다). 대신 다음 방식으로 업데이트합니다.

1. 엑셀 파일(`윤리사상가_기출DB_전체통합.xlsx`와 같은 형식)을 준비해서 Claude에게 전달
2. Claude가 `src/data/quizData.json` 파일 하나만 새로 만들어 드림
3. 그 파일을 이 프로젝트의 `src/data/quizData.json`에 덮어쓰기
4. `src/App.jsx` 최상단의 `VERSION` 상수를 한 단계 올리기 (예: `"v1.0.0"` → `"v1.1.0"`)
5. GitHub에 다시 push → Vercel/Netlify가 자동으로 재배포

## 버전 기록

- v1.0.0 — 최초 배포. 8개 테마(유불도 십인전 / 성리학 오현전 / 근대 구인전 /
  실존 육인전 / 자본주의 육인전 / 희랍 육인전 / 중세 삼현전 / 헬레니즘
  삼현전), 총 948문항.
