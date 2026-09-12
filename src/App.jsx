import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ArrowLeft, Shuffle, Check, X as XIcon, RotateCcw, LayoutGrid, SkipForward } from "lucide-react";
import QUIZ_DATA from "./data/quizData.json";

const VERSION = "v1.4.0";

/* ============================================================
   동양윤리사상 기출 아카이브 — 데이터
   ============================================================ */

const SCHOOL_COLOR = {
  "유가": "#3B5478",
  "도가": "#3F7A5D",
  "묵가": "#8B5A2B",
  "법가": "#A6301F",
  "불교": "#B08D2B",
  "유가(성리학)": "#1A5276",
  "유가(양명학)": "#76448A",
  "유가(실학)": "#922B21",
  "소피스트": "#7D6608",
  "그리스철학": "#1B4F72",
  "쾌락주의": "#B7472A",
  "스토아학파": "#2E4053",
  "자연법사상": "#795548",
  "교부철학": "#4A235A",
  "스콜라철학": "#7B241C",
  "유명론": "#1B2631",
  "대륙 합리론": "#1A237E",
  "사회계약론": "#4E342E",
  "독일 관념론": "#004D40",
  "공리주의": "#880E4F",
  "생철학": "#5D4037",
  "유신론적 실존주의": "#283593",
  "무신론적 실존주의": "#37474F",
  "고전 자유주의": "#6D4C41",
  "수정자본주의": "#1565C0",
  "신자유주의": "#EF6C00",
  "평등주의적 자유주의": "#2E7D32",
  "자유지상주의": "#C62828",
  "선종": "#6A1B4D",
  "한국불교(통불교)": "#00695C",
  "한국불교(천태종)": "#4527A0",
  "한국불교(조계종)": "#37474F",
};

const C = {
  ink: "#14161B",
  inkAlt: "#1D2129",
  inkLine: "#2B303A",
  paper: "#E4DFCB",
  paperAlt: "#D7D0B8",
  seal: "#A6301F",
  sealDark: "#7E2116",
  jade: "#3F7A5D",
  jadeDark: "#2E5C46",
  gold: "#B08D2B",
  inkText: "#221F19",
  paperText: "#EDE7D8",
  muted: "#8A8368",
  mutedDark: "#6B7280",
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function BrushDivider({ color = C.seal, opacity = 0.7 }) {
  return (
    <svg viewBox="0 0 200 8" width="100%" height="8" preserveAspectRatio="none" style={{ display: "block" }}>
      <path
        d="M2 4 C 40 1, 80 7, 120 3 S 180 5, 198 4"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}

function OGlyph({ size = 34, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 6 C 12 6 5 15 6 25 C 7 36 15 42 24 42 C 34 42 42 35 42 24 C 42 13 34 6 24 6 Z"
        stroke={color}
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function XGlyph({ size = 34, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M9 8 C 18 18 30 30 39 40" stroke={color} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M40 9 C 30 19 18 30 8 39" stroke={color} strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   테마 선택 화면 (0단계)
   ============================================================ */
const THEMES = {
  "유불도": {
    title: "유불도 십인전",
    hanja: "十人傳",
    subtitle: "공자부터 세친까지, 동양철학 열 명의 계보",
    desc: "유가·도가·묵가·법가·불교",
  },
  "성리학": {
    title: "성리학 오현전",
    hanja: "五賢傳",
    subtitle: "주희부터 정약용까지, 성리학 다섯 현자의 계보",
    desc: "주자학·양명학·조선 성리학·실학",
  },
  "선불교": {
    title: "선·한국불교 사현전",
    hanja: "四賢傳",
    subtitle: "혜능부터 지눌까지, 선과 교의 회통을 묻다",
    desc: "선종·화쟁사상·교관겸수·돈오점수",
  },
  "서양고대": {
    title: "희랍 육인전",
    hanja: "六人傳",
    subtitle: "프로타고라스부터 아리스토텔레스까지, 고대 그리스 여섯 현자",
    desc: "소피스트·소크라테스·플라톤·아리스토텔레스",
  },
  "헬레니즘": {
    title: "헬레니즘 오현전",
    hanja: "五賢傳",
    subtitle: "에피쿠로스부터 제논까지, 흔들리지 않는 마음을 묻다",
    desc: "쾌락주의·스토아학파·자연법 사상",
  },
  "중세": {
    title: "중세 삼현전",
    hanja: "三賢傳",
    subtitle: "아우구스티누스부터 오컴까지, 신앙과 이성의 시대",
    desc: "교부철학·스콜라철학·유명론",
  },
  "근대": {
    title: "근대 구인전",
    hanja: "九人傳",
    subtitle: "데카르트부터 밀까지, 근대와 계몽의 아홉 물음",
    desc: "합리론·사회계약론·독일 관념론·공리주의",
  },
  "실존": {
    title: "실존 육인전",
    hanja: "六人傳",
    subtitle: "쇼펜하우어부터 사르트르까지, 삶의 의미를 되묻다",
    desc: "생철학·유신론적 실존주의·무신론적 실존주의",
  },
  "자본주의": {
    title: "자본주의 육인전",
    hanja: "六人傳",
    subtitle: "스미스부터 노직까지, 시장과 정의를 묻다",
    desc: "고전 자유주의·수정자본주의·신자유주의·정의론",
  },
};

function ThemeScreen({ counts, onPick }) {
  return (
    <div className="px-5 pt-10 pb-12 max-w-md mx-auto">
      <div className="text-center mb-10">
        <div
          className="text-xs tracking-[0.3em] mb-2"
          style={{ color: C.gold, fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          윤리사상가 기출 아카이브
        </div>
        <h1
          className="text-2xl mb-3"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, color: C.paperText }}
        >
          어느 계보를 살펴보시겠습니까
        </h1>
        <div className="flex justify-center mb-4">
          <div style={{ width: 120 }}>
            <BrushDivider />
          </div>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: C.mutedDark, fontFamily: "'Noto Sans KR', sans-serif" }}>
          문항 카드의 <span style={{ color: C.jadeDark }}>기출 기반</span> 표시는 실제 기출·모의고사를 재편집한 문항,{" "}
          <span style={{ color: C.sealDark }}>예상문제</span> 표시는 개념을 바탕으로 새로 구성한 문항입니다.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => onPick(key)}
            className="w-full rounded-2xl p-6 text-left relative overflow-hidden active:scale-[0.98] transition-transform"
            style={{ background: C.paper, border: `1px solid ${C.paperAlt}` }}
          >
            <div
              className="absolute -right-3 -bottom-5 select-none pointer-events-none"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, fontSize: 100, color: C.inkText, opacity: 0.07 }}
            >
              {t.hanja}
            </div>
            <span
              className="inline-block text-[10px] px-2 py-0.5 rounded-full mb-3 relative z-10"
              style={{ background: C.inkText, color: C.paper, fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              {t.desc}
            </span>
            <h2
              className="text-2xl relative z-10 mb-1"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, color: C.inkText }}
            >
              {t.title}
            </h2>
            <p className="text-sm relative z-10 mb-3" style={{ color: C.muted, fontFamily: "'Noto Sans KR', sans-serif" }}>
              {t.subtitle}
            </p>
            <span
              className="text-[11px] relative z-10"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.mutedDark }}
            >
              {counts[key] || 0}문항 수록
            </span>
          </button>
        ))}
      </div>

      <div className="text-center mt-8">
        <span
          className="inline-flex items-center gap-1.5 text-[11px]"
          style={{ color: C.mutedDark, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {VERSION}
        </span>
        <p
          className="mt-2 text-[11px]"
          style={{ color: C.mutedDark, fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          © 리버티 인사이트
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   선택 화면 (사상가)
   ============================================================ */
function SelectScreen({ theme, groups, total, onPick, onBackTheme }) {
  const t = THEMES[theme];
  return (
    <div className="px-5 pt-8 pb-12 max-w-md mx-auto">
      <button onClick={onBackTheme} className="flex items-center gap-1 mb-6" style={{ color: C.muted }}>
        <ArrowLeft size={18} />
        <span className="text-sm" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          다른 계보 보기
        </span>
      </button>

      <div className="text-center mb-8">
        <div
          className="text-xs tracking-[0.3em] mb-2"
          style={{ color: C.gold, fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {t.desc}
        </div>
        <h1
          className="text-3xl mb-3"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, color: C.paperText }}
        >
          {t.title}
        </h1>
        <div className="flex justify-center mb-3">
          <div style={{ width: 120 }}>
            <BrushDivider />
          </div>
        </div>
        <p className="text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans KR', sans-serif" }}>
          사상가 {groups.length}명, 총 {total}개의 기출 선지가 도장 속에 잠들어 있습니다.
        </p>
      </div>

      <button
        onClick={() => onPick("전체")}
        className="w-full mb-4 rounded-2xl p-5 text-left relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.seal} 0%, ${C.sealDark} 100%)`,
          border: `1px solid ${C.gold}55`,
        }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div
              className="text-lg"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800, color: C.paperText }}
            >
              전체 통합풀이
            </div>
            <div className="text-xs mt-1" style={{ color: "#EAD9C9", fontFamily: "'Noto Sans KR', sans-serif" }}>
              {groups.length}명의 사상가를 무작위로 뒤섞어 풀어봅니다
            </div>
          </div>
          <Shuffle size={26} color="#EAD9C9" />
        </div>
        <div
          className="absolute -right-4 -bottom-6 select-none"
          style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 96, fontWeight: 900, color: "#ffffff14" }}
        >
          {t.hanja}
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {groups.map((g) => (
          <button
            key={g.name}
            onClick={() => onPick(g.name)}
            className="rounded-2xl p-4 text-left relative overflow-hidden active:scale-[0.97] transition-transform"
            style={{ background: C.paper, border: `1px solid ${C.paperAlt}` }}
          >
            <div
              className="absolute right-2 top-1 select-none"
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 54,
                fontWeight: 900,
                color: C.inkText,
                opacity: 0.08,
              }}
            >
              {g.hanja}
            </div>
            <span
              className="inline-block text-[10px] px-2 py-0.5 rounded-full mb-3 relative z-10"
              style={{ background: SCHOOL_COLOR[g.school], color: "#fff", fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              {g.school}
            </span>
            <div
              className="text-xl relative z-10"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800, color: C.inkText }}
            >
              {g.name}
            </div>
            <div
              className="text-[11px] mt-1 relative z-10"
              style={{ color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {g.count}문항
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* (구 SelectScreen 종료) */

/* ============================================================
   문항 수 선택 화면
   ============================================================ */
function CountScreen({ theme, scope, count, data, onStart, onBack }) {
  const options = [10, 20, 30].filter((n) => n < count).concat([count]);
  const [chosen, setChosen] = useState(options[0]);
  const themeHanja = THEMES[theme].hanja;
  return (
    <div className="px-5 pt-8 pb-12 max-w-md mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 mb-8" style={{ color: C.muted }}>
        <ArrowLeft size={18} />
        <span className="text-sm" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          사상가 다시 고르기
        </span>
      </button>

      <div className="text-center mb-10">
        <div
          className="mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ width: 84, height: 84, background: C.paper, border: `2px solid ${C.gold}` }}
        >
          <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, fontSize: 34, color: C.inkText }}>
            {scope === "전체" ? themeHanja : data.find((q) => q.name === scope)?.hanja}
          </span>
        </div>
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800, color: C.paperText }}
        >
          {scope}
        </h2>
        <p className="text-sm" style={{ color: C.muted, fontFamily: "'Noto Sans KR', sans-serif" }}>
          몇 문항을 풀어보시겠습니까? (전체 {count}문항 보유)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {options.map((n) => (
          <button
            key={n}
            onClick={() => setChosen(n)}
            className="rounded-xl py-4 text-center transition-colors"
            style={{
              background: chosen === n ? C.gold : C.inkAlt,
              border: `1px solid ${chosen === n ? C.gold : C.inkLine}`,
              color: chosen === n ? C.ink : C.paperText,
            }}
          >
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 20 }}>
              {n === count ? `전체` : n}
            </div>
            <div className="text-[11px] mt-0.5" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              {n === count ? `${n}문항` : "문항"}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onStart(chosen)}
        className="w-full rounded-2xl py-4 text-center"
        style={{ background: C.seal, color: "#F5EEDD", fontFamily: "'Noto Serif KR', serif", fontWeight: 800, fontSize: 17 }}
      >
        시작하기
      </button>
    </div>
  );
}

/* ============================================================
   퀴즈 화면
   ============================================================ */
function QuizScreen({ queue, onFinish, onExit }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0, skipped: 0 });
  const [wrongItems, setWrongItems] = useState([]);

  const item = queue[idx];
  const revealed = picked !== null;
  const isCorrect = revealed && picked === item.answer;

  const handlePick = useCallback(
    (choice) => {
      if (revealed) return;
      setPicked(choice);
      const correct = choice === item.answer;
      setScore((s) => ({ ...s, correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
      if (!correct) setWrongItems((w) => [...w, item]);
    },
    [revealed, item]
  );

  const handleNext = () => {
    if (idx + 1 >= queue.length) {
      onFinish({ score, wrongItems, total: queue.length });
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const handleSkip = () => {
    if (revealed) return;
    const nextScore = { ...score, skipped: score.skipped + 1 };
    setScore(nextScore);
    if (idx + 1 >= queue.length) {
      onFinish({ score: nextScore, wrongItems, total: queue.length });
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const pct = Math.round(((idx + 1) / queue.length) * 100);

  return (
    <div className="px-5 pt-6 pb-10 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onExit} style={{ color: C.muted }}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: SCHOOL_COLOR[item.school], color: "#fff", fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            {item.school}
          </span>
          <span
            className="text-sm"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800, color: C.paperText }}
          >
            {item.name}
          </span>
        </div>
        <div
          className="text-xs"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.muted }}
        >
          {idx + 1}/{queue.length}
        </div>
      </div>

      <div className="w-full h-1 rounded-full mb-6 overflow-hidden" style={{ background: C.inkLine }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: C.gold }} />
      </div>

      <div className="flex items-center gap-3 mb-5 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        <span className="flex items-center gap-1" style={{ color: C.jade }}>
          <OGlyph size={14} color={C.jade} /> {score.correct}
        </span>
        <span className="flex items-center gap-1" style={{ color: C.seal }}>
          <XGlyph size={14} color={C.seal} /> {score.wrong}
        </span>
        {score.skipped > 0 && (
          <span className="flex items-center gap-1" style={{ color: C.muted }}>
            <SkipForward size={13} /> {score.skipped}
          </span>
        )}
      </div>

      <div
        key={item.id}
        className="relative rounded-3xl p-6 mb-6 overflow-hidden"
        style={{ background: C.paper, minHeight: 220, border: `1px solid ${C.paperAlt}` }}
      >
        <div
          className="absolute -right-2 -top-4 select-none pointer-events-none"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, fontSize: 130, color: C.inkText, opacity: 0.06 }}
        >
          {item.hanja}
        </div>

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <span
            className="inline-block text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: C.paperAlt, color: C.inkText, fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            {item.category}
          </span>
          <span
            className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={
              item.source === "기출편집"
                ? { background: `${C.jade}22`, color: C.jadeDark, fontFamily: "'Noto Sans KR', sans-serif" }
                : { background: `${C.seal}1a`, color: C.sealDark, fontFamily: "'Noto Sans KR', sans-serif" }
            }
          >
            {item.source === "기출편집" ? "기출 기반" : "예상문제"}
          </span>
        </div>

        <p
          className="relative z-10 leading-relaxed"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 600, fontSize: 19, color: C.inkText }}
        >
          {item.question}
        </p>

        {revealed && (
          <div
            className="absolute right-4 top-4 rounded-full flex items-center justify-center stamp-anim"
            style={{
              width: 64,
              height: 64,
              border: `3px solid ${isCorrect ? C.jade : C.seal}`,
              color: isCorrect ? C.jade : C.seal,
            }}
          >
            <span style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 900, fontSize: 13 }}>
              {isCorrect ? "정답" : "오답"}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => handlePick("O")}
          disabled={revealed}
          className="rounded-2xl py-5 flex flex-col items-center gap-2 transition-transform active:scale-[0.97]"
          style={{
            background: C.inkAlt,
            border: `2px solid ${revealed ? (item.answer === "O" ? C.jade : C.inkLine) : C.jade}`,
            opacity: revealed && picked !== "O" && item.answer !== "O" ? 0.45 : 1,
          }}
        >
          <OGlyph color={C.jade} />
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: C.paperText }}>참</span>
        </button>
        <button
          onClick={() => handlePick("X")}
          disabled={revealed}
          className="rounded-2xl py-5 flex flex-col items-center gap-2 transition-transform active:scale-[0.97]"
          style={{
            background: C.inkAlt,
            border: `2px solid ${revealed ? (item.answer === "X" ? C.seal : C.inkLine) : C.seal}`,
            opacity: revealed && picked !== "X" && item.answer !== "X" ? 0.45 : 1,
          }}
        >
          <XGlyph color={C.seal} />
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: C.paperText }}>거짓</span>
        </button>
      </div>

      {!revealed && (
        <button
          onClick={handleSkip}
          className="w-full mb-6 flex items-center justify-center gap-1.5 py-2"
          style={{ color: C.muted, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13 }}
        >
          이 문항 건너뛰기
          <SkipForward size={14} />
        </button>
      )}

      {revealed && (
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: C.inkAlt,
            borderLeft: `4px solid ${isCorrect ? C.jade : C.seal}`,
          }}
        >
          <div
            className="text-xs mb-1"
            style={{ color: isCorrect ? C.jade : C.seal, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}
          >
            {isCorrect ? "정답입니다" : `오답입니다 · 정답은 '${item.answer === "O" ? "참" : "거짓"}'`}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: C.paperText, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {item.explanation}
          </p>
          {item.trap && (
            <div
              className="mt-3 inline-block text-[11px] px-2 py-1 rounded-full"
              style={{ background: `${C.gold}22`, color: C.gold, fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              ⚠ {item.trap}과(와) 자주 혼동되는 선지입니다
            </div>
          )}
        </div>
      )}

      {revealed && (
        <button
          onClick={handleNext}
          className="w-full rounded-2xl py-4 text-center"
          style={{ background: C.gold, color: C.ink, fontFamily: "'Noto Serif KR', serif", fontWeight: 800, fontSize: 16 }}
        >
          {idx + 1 >= queue.length ? "결과 보기" : "다음 문제"}
        </button>
      )}
    </div>
  );
}

/* ============================================================
   결과 화면
   ============================================================ */
function ResultScreen({ result, scope, onRetry, onHome }) {
  const { score, wrongItems, total } = result;
  const attempted = score.correct + score.wrong;
  const pct = attempted > 0 ? Math.round((score.correct / attempted) * 100) : 0;
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  const byCategory = {};
  wrongItems.forEach((it) => {
    byCategory[it.category] = (byCategory[it.category] || 0) + 1;
  });
  const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const ringColor = pct >= 80 ? C.jade : pct >= 50 ? C.gold : C.seal;

  return (
    <div className="px-5 pt-10 pb-12 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-xs tracking-[0.3em] mb-2" style={{ color: C.gold, fontFamily: "'Noto Sans KR', sans-serif" }}>
          채점 완료 · {scope}
        </div>
        <div className="relative inline-flex items-center justify-center mb-4" style={{ width: 140, height: 140 }}>
          <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={70} cy={70} r={r} fill="none" stroke={C.inkLine} strokeWidth={10} />
            <circle
              cx={70}
              cy={70}
              r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 30, color: C.paperText }}>
              {pct}%
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.muted }}>
              {score.correct}/{attempted}
            </span>
          </div>
        </div>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 800, fontSize: 22, color: C.paperText }}>
          {attempted === 0
            ? "전부 건너뛰셨네요"
            : pct >= 90 ? "군자(君子)의 경지" : pct >= 70 ? "제법 익숙합니다" : pct >= 50 ? "조금 더 정진하세요" : "다시 정독이 필요합니다"}
        </h2>
        {score.skipped > 0 && (
          <p className="text-xs mt-2 flex items-center justify-center gap-1" style={{ color: C.muted, fontFamily: "'Noto Sans KR', sans-serif" }}>
            <SkipForward size={12} /> {score.skipped}문항 건너뜀 (총 {total}문항 중)
          </p>
        )}
      </div>

      {sortedCats.length > 0 && (
        <div className="mb-8">
          <div className="text-xs mb-3" style={{ color: C.muted, fontFamily: "'Noto Sans KR', sans-serif" }}>
            복습이 필요한 개념
          </div>
          <div className="space-y-2">
            {sortedCats.map(([cat, n]) => (
              <div
                key={cat}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: C.inkAlt, border: `1px solid ${C.inkLine}` }}
              >
                <span className="text-sm" style={{ color: C.paperText, fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {cat}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${C.seal}33`, color: "#E9A79B", fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {n}회 오답
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRetry}
          className="rounded-2xl py-4 flex items-center justify-center gap-2"
          style={{ background: C.inkAlt, border: `1px solid ${C.inkLine}`, color: C.paperText }}
        >
          <RotateCcw size={16} />
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 14 }}>다시 풀기</span>
        </button>
        <button
          onClick={onHome}
          className="rounded-2xl py-4 flex items-center justify-center gap-2"
          style={{ background: C.gold, color: C.ink }}
        >
          <LayoutGrid size={16} />
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 14 }}>다른 사상가</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   메인 앱
   ============================================================ */
export default function App() {
  const [screen, setScreen] = useState("theme"); // theme | select | count | quiz | result
  const [theme, setTheme] = useState(null);
  const [scope, setScope] = useState(null);
  const [queue, setQueue] = useState([]);
  const [result, setResult] = useState(null);
  const themeCounts = useMemo(() => {
    const c = {};
    QUIZ_DATA.forEach((item) => { c[item.theme] = (c[item.theme] || 0) + 1; });
    return c;
  }, []);

  const themeItems = useMemo(() => (theme ? QUIZ_DATA.filter((q) => q.theme === theme) : []), [theme]);

  const groups = useMemo(() => {
    const map = {};
    themeItems.forEach((item) => {
      if (!map[item.name]) map[item.name] = { name: item.name, hanja: item.hanja, school: item.school, count: 0 };
      map[item.name].count += 1;
    });
    return Object.values(map);
  }, [themeItems]);

  const scopeCount = useCallback(
    (s) => {
      if (s === "전체") return themeItems.length;
      return themeItems.filter((q) => q.name === s).length;
    },
    [themeItems]
  );

  const handlePickTheme = (t) => {
    setTheme(t);
    setScreen("select");
  };

  const handlePickScope = (s) => {
    setScope(s);
    setScreen("count");
  };

  const startQuiz = (n) => {
    const pool = scope === "전체" ? themeItems : themeItems.filter((q) => q.name === scope);
    setQueue(shuffle(pool).slice(0, n));
    setScreen("quiz");
  };

  const finishQuiz = (r) => {
    setResult(r);
    setScreen("result");
  };

  const retry = () => {
    const n = queue.length;
    const pool = scope === "전체" ? themeItems : themeItems.filter((q) => q.name === scope);
    setQueue(shuffle(pool).slice(0, n));
    setScreen("quiz");
  };

  const goSelect = () => {
    setScope(null);
    setScreen("select");
  };

  const goTheme = () => {
    setTheme(null);
    setScope(null);
    setScreen("theme");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700;900&family=IBM+Plex+Mono:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes stampIn {
          0% { transform: scale(2.4) rotate(-25deg); opacity: 0; }
          55% { transform: scale(0.88) rotate(-6deg); opacity: 1; }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
        .stamp-anim { animation: stampIn 0.45s cubic-bezier(.34,1.56,.64,1) forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      {screen === "theme" && <ThemeScreen counts={themeCounts} onPick={handlePickTheme} />}
      {screen === "select" && (
        <SelectScreen theme={theme} groups={groups} total={themeItems.length} onPick={handlePickScope} onBackTheme={goTheme} />
      )}
      {screen === "count" && (
        <CountScreen theme={theme} scope={scope} count={scopeCount(scope)} data={QUIZ_DATA} onStart={startQuiz} onBack={() => setScreen("select")} />
      )}
      {screen === "quiz" && <QuizScreen queue={queue} onFinish={finishQuiz} onExit={goSelect} />}
      {screen === "result" && <ResultScreen result={result} scope={scope} onRetry={retry} onHome={goSelect} />}
    </div>
  );
}
