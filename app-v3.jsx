// ===== TRAINING PLAN v5 APP =====
const { useState, useEffect, useCallback, useMemo } = React;

// ========== DATA ==========
const DATA = window.PLAN_V5 || {};

// ========== DOSAGE PARAMETRIC SYSTEM ==========
// Build lookup from data.dosage_parametric
const GOALS = (DATA.dosage_parametric?.by_goal || []).map(g => ({
  id: g.id,
  name: g.name,
  ranges: g.ranges,
}));

const EXP_MAP = DATA.dosage_parametric?.by_experience || {};
const EXPERIENCES = [
  { id: "beginner_0_3m", ...(EXP_MAP.beginner_0_3m || { name: "新手 0-3 月", multiplier_sets: 0.75, rpe_cap: 8 }) },
  { id: "intermediate_3_12m", ...(EXP_MAP.intermediate_3_12m || { name: "进阶 3-12 月", multiplier_sets: 1.0, rpe_cap: 9 }) },
  { id: "advanced_12m_plus", ...(EXP_MAP.advanced_12m_plus || { name: "高阶 12 月+", multiplier_sets: 1.2, rpe_cap: 10 }) },
];

const MOVEMENT_CLASS_NAMES = {
  compound_lower:    "复合下肢",
  compound_push:     "复合推",
  compound_pull:     "复合拉",
  compound_overhead: "复合过头推",
  isolation_chest:   "孤立胸部",
  isolation_shoulder:"孤立肩部",
  isolation_arm:     "孤立手臂",
  isolation_leg:     "孤立腿部",
  isolation_core:    "孤立核心",
  cardio:            "有氧",
};

const PHASE_NAMES = {
  setup: "起始准备",
  concentric: "向心（发力）",
  peak: "顶峰收缩",
  eccentric: "离心（回放）",
  return: "复位",
};

// ========== HELPERS ==========
function parseRange(str) {
  if (!str) return [0, 0];
  const parts = String(str).split("-").map(n => parseInt(n, 10));
  if (parts.length === 1) return [parts[0], parts[0]];
  return [parts[0], parts[1]];
}

function computeDosage(movementClass, goalId, expId) {
  const goal = GOALS.find(g => g.id === goalId);
  if (!goal || !goal.ranges) return null;
  const base = goal.ranges[movementClass];
  if (!base) return null;

  const exp = EXPERIENCES.find(e => e.id === expId);
  if (!exp) return { ...base };

  const result = { ...base };

  // Apply set multiplier
  if (base.sets) {
    const [low, high] = parseRange(base.sets);
    const newLow = Math.max(1, Math.round(low * exp.multiplier_sets));
    const newHigh = Math.max(newLow, Math.round(high * exp.multiplier_sets));
    result.display_sets = newLow === newHigh ? `${newLow} 组` : `${newLow}-${newHigh} 组`;
  }

  // RPE cap
  if (base.rpe !== undefined && base.rpe !== null) {
    const capped = Math.min(base.rpe, exp.rpe_cap);
    result.display_rpe = String(capped);
  }

  // Rest format
  if (base.rest !== undefined) {
    const r = base.rest;
    if (r >= 60) {
      const mins = Math.floor(r / 60);
      const secs = r % 60;
      result.display_rest = secs === 0 ? `${mins} 分钟` : `${mins} 分 ${secs} 秒`;
    } else {
      result.display_rest = `${r} 秒`;
    }
  }

  if (base.reps) result.display_reps = base.reps + " 次";
  if (base.duration_min !== undefined) result.display_duration = `${base.duration_min} 分钟`;

  return result;
}

// Equipment catalog as map
const EQUIP_MAP = {};
(DATA.equipment_catalog || []).forEach(eq => { EQUIP_MAP[eq.id] = eq; });

const STRETCH_LIB = DATA.stretch_library || {};

const DAYS = DATA.days || [];

const COMMON_PRINCIPLES = DATA.common_principles ? [
  { title: "热身",      text: DATA.common_principles.warmup },
  { title: "动作节奏",  text: DATA.common_principles.tempo },
  { title: "呼吸",      text: DATA.common_principles.breathing },
  { title: "记录",      text: DATA.common_principles.monitor },
  { title: "恢复",      text: DATA.common_principles.recovery },
  { title: "关节优先",  text: DATA.common_principles.joint_first },
] : [];

// ========== IMAGE PATHS ==========
// HD equipment images first, fallback to old
function eqImgPath(id) {
  const eq = EQUIP_MAP[id];
  if (eq && eq.image) {
    // equipment_images_hd/xxx.jpg -> assets/equipment-hd/xxx.jpg
    const fname = eq.image.split('/').pop();
    return `assets/equipment-hd/${fname}`;
  }
  return `assets/equipment/${id}.jpg`;
}

function gifPath(demoGif) {
  if (!demoGif) return null;
  // anim_gifs/xxxx.gif -> assets/anim-gifs/xxxx.gif
  const fname = demoGif.split('/').pop();
  return `assets/anim-gifs/${fname}`;
}

function stretchGif(poseId) {
  const s = STRETCH_LIB[poseId];
  if (!s) return null;
  return gifPath(s.demo_gif);
}

function splitPoints(text) {
  if (!text) return [];
  return text.split(/[；;。\n]/).map(s => s.trim()).filter(s => s.length > 1);
}

// ========== ICONS ==========
const I = {
  Clock: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>),
  Warm: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s4 4 4 8a4 4 0 01-8 0c0-4 4-8 4-8z"/>
      <path d="M12 15v3"/><path d="M9 18h6"/>
    </svg>),
  Cardio: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
    </svg>),
  Stretch: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v6M8 10l4 3 4-3"/>
      <path d="M12 13l-3 8M12 13l3 8"/>
    </svg>),
  Bolt: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||13} height={p.size||13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>
    </svg>),
  Breath: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||13} height={p.size||13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c0-4 4-6 8-6s8 2 8 6-4 6-8 6-8-2-8-6z"/>
    </svg>),
  Tempo: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||13} height={p.size||13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="9"/><path d="M12 14V9"/><path d="M9 11h6"/>
    </svg>),
  Note: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||13} height={p.size||13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4"/><path d="M8 13h8M8 17h6"/>
    </svg>),
  Recover: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||13} height={p.size||13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
    </svg>),
  Joint: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||13} height={p.size||13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4"/>
      <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9"/>
    </svg>),
  Play: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||12} height={p.size||12} fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>),
  Info: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||12} height={p.size||12} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/>
    </svg>),
};
const PRINCIPLE_ICKS = [I.Warm, I.Tempo, I.Breath, I.Note, I.Recover, I.Joint];

// ========== APP ==========
function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedEx, setSelectedEx] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [modalClosing, setModalClosing] = useState(false);
  const [goalId, setGoalId] = useState(GOALS[0]?.id || "hypertrophy");
  const [expId, setExpId] = useState("intermediate_3_12m");

  const day = DAYS[activeDay];

  const openModal = useCallback((ex) => {
    setSelectedEx(ex);
    setModalClosing(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalClosing(true);
    setTimeout(() => {
      setSelectedEx(null);
      setModalClosing(false);
    }, 200);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && selectedEx) { closeModal(); return; }
      if (!selectedEx && e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON") {
        if (e.key === "ArrowLeft" && activeDay > 0) setActiveDay(d => d - 1);
        if (e.key === "ArrowRight" && activeDay < DAYS.length - 1) setActiveDay(d => d + 1);
        if (/^[1-5]$/.test(e.key)) {
          const n = parseInt(e.key, 10) - 1;
          if (n >= 0 && n < DAYS.length) setActiveDay(n);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedEx, activeDay, closeModal]);

  if (!day) return <div style={{padding: 40}}>加载中...</div>;

  return (
    <div className="app">
      <Hero />
      <DosageBar goalId={goalId} expId={expId} setGoal={setGoalId} setExp={setExpId} />
      <DayTabs active={activeDay} onChange={setActiveDay} />
      <DayHeader day={day} />
      <ExerciseList
        exercises={day.exercises}
        goalId={goalId}
        expId={expId}
        onSelect={openModal}
      />
      <DosageFramework goalId={goalId} expId={expId} />
      <PrinciplesSection />
      <RiskAndSourceSection />

      {selectedEx && (
        <ExerciseModal
          exercise={selectedEx}
          goalId={goalId}
          expId={expId}
          closing={modalClosing}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// ===== Hero =====
function Hero() {
  return (
    <div className="hero">
      <span className="hero-tag">
        <span className="dot"></span>
        5 天动作库 · 固定器械 · v5
      </span>
      <h1>{DATA.plan_title || "周一至周五 训练动作库"}</h1>
      <p className="hero-sub">
        <strong>{DATA.scope_intro || ""}</strong>
        <br />
        动作示范 GIF 来自 fitness.xingshuwen.com（数据集 © Gym Visual / gymvisual.com）。
      </p>
    </div>
  );
}

// ===== Dosage Bar =====
function DosageBar({ goalId, expId, setGoal, setExp }) {
  const currentGoal = GOALS.find(g => g.id === goalId);
  const currentExp = EXPERIENCES.find(e => e.id === expId);
  return (
    <div className="dosage-bar">
      <div className="ds-group">
        <label>训练目标</label>
        <div className="ds-options">
          {GOALS.map(g => (
            <button
              key={g.id}
              className={`ds-option ${goalId === g.id ? "active" : ""}`}
              onClick={() => setGoal(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
      <div className="ds-group">
        <label>经验水平</label>
        <div className="ds-options">
          {EXPERIENCES.map(e => (
            <button
              key={e.id}
              className={`ds-option ${expId === e.id ? "active" : ""}`}
              onClick={() => setExp(e.id)}
              title={e.note}
            >
              {e.name}
            </button>
          ))}
        </div>
      </div>
      <div className="ds-explain">
        <strong>剂量联动：</strong>
        当前为「{currentGoal?.name}」+「{currentExp?.name}」，
        所有动作按动作分类（复合推/拉/腿/肩推 vs 孤立胸/肩/臂/腿/核心）实时计算组数、次数、RPE 与组间休息。
        替换器械后动作分类不变，剂量自动同步。
      </div>
    </div>
  );
}

// ===== Day Tabs =====
function DayTabs({ active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {DAYS.map((d, i) => (
        <button
          key={d.day}
          role="tab"
          aria-selected={i === active}
          className={`tab-btn ${i === active ? "active" : ""}`}
          onClick={() => onChange(i)}
          title={`${d.day} · ${d.theme}（快捷键 ${i + 1}）`}
        >
          <span className="tab-day">{d.day}</span>
          <span className="tab-theme">{d.theme}</span>
        </button>
      ))}
    </div>
  );
}

// ===== Day Header =====
function DayHeader({ day }) {
  return (
    <div className="day-header">
      <div className="day-title-row">
        <h2 className="day-title">{day.day} · {day.theme}</h2>
        <div className="day-meta">
          <span className="meta-chip">
            <I.Clock size={12} />
            <span>{day.duration}</span>
          </span>
        </div>
      </div>
      <div className="day-benefit">
        <strong>今日效益：</strong>{day.focus_benefit}
      </div>
    </div>
  );
}

// ===== Exercise List =====
function ExerciseList({ exercises, goalId, expId, onSelect }) {
  let mainIdx = 0;
  return (
    <div className="exercise-list">
      {exercises.map((ex, i) => {
        const isMain = ex.type === "main";
        const num = isMain ? ++mainIdx : null;
        return (
          <ExerciseCard
            key={i}
            exercise={ex}
            num={num}
            goalId={goalId}
            expId={expId}
            onClick={() => onSelect(ex)}
          />
        );
      })}
    </div>
  );
}

// ===== Exercise Card =====
function ExerciseCard({ exercise, num, goalId, expId, onClick }) {
  const eq = exercise.primary_equipment_id ? EQUIP_MAP[exercise.primary_equipment_id] : null;
  const cls = exercise.type || "";

  const dosage = useMemo(() => {
    if (exercise.type === "stretch_block" || exercise.type === "stretch") return null;
    // Warmup has static dosage
    if (exercise.dosage && exercise.type !== "main" && exercise.type !== "cardio") {
      return {
        display_sets: exercise.dosage.duration || "—",
        display_reps: exercise.dosage.intensity || null,
        display_rpe: exercise.dosage.rpe || "—",
        isStatic: true,
      };
    }
    // Cardio type main with static dosage (like treadmill warmup)
    if (exercise.type === "warmup" && exercise.dosage) {
      return {
        display_sets: exercise.dosage.duration || "—",
        display_reps: exercise.dosage.intensity || null,
        display_rpe: exercise.dosage.rpe || "—",
        isStatic: true,
      };
    }
    // Parametric
    if (exercise.movement_class) {
      const d = computeDosage(exercise.movement_class, goalId, expId);
      if (d) return d;
    }
    return null;
  }, [exercise, goalId, expId]);

  let iconNode = null;
  if (exercise.type === "warmup") iconNode = <I.Warm size={16} />;
  else if (exercise.type === "cardio") iconNode = <I.Cardio size={16} />;
  else if (exercise.type === "stretch_block" || exercise.type === "stretch") iconNode = <I.Stretch size={16} />;

  // GIF match label
  const gifMatch = exercise.demo_gif_match;
  const hasGif = exercise.demo_gif;

  return (
    <div className={`ex-card ${cls === "stretch_block" || cls === "stretch" ? "stretch-card" : cls}`} onClick={onClick}
         data-comment-anchor={`ex-${exercise.name}`}>
      <div className="ex-num">{iconNode || num}</div>
      <div className="ex-main">
        <div className="ex-name">
          {exercise.name}
          {hasGif && exercise.type !== "stretch_block" && exercise.type !== "stretch" && (
            <span className={`gif-match-badge ${gifMatch === "exact" ? "exact" : "close"}`} title={gifMatch === "exact" ? "动作与器械精确匹配" : "最近似动作示意，器械/角度可能略有差异"}>
              <I.Play size={9} />
              {gifMatch === "exact" ? "精确 GIF" : "近似 GIF"}
            </span>
          )}
          {(exercise.type === "main" && exercise.benefit) && (
            <span className="ex-benefit-tag" title={exercise.benefit}>
              {exercise.benefit.length > 20 ? exercise.benefit.slice(0, 20) + "…" : exercise.benefit}
            </span>
          )}
        </div>
        {exercise.type === "stretch_block" || exercise.type === "stretch" ? (
          <>
            <div className="ex-equipment">
              <I.Stretch size={13} />
              {(exercise.poses?.length || 0)} 个拉伸动作 · {exercise.duration} · 点击查看详情
            </div>
            <div className="stretch-poses">
              {(exercise.poses || []).map((p, i) => {
                const s = STRETCH_LIB[p];
                if (!s) return null;
                return (
                  <span className="stretch-pose-chip" key={p}>
                    <span className="pose-num">{i + 1}</span>
                    {s.name}
                    {s.demo_gif && (
                      <span className={`mini-gif-tag ${s.demo_gif_match === "exact" ? "exact" : "close"}`}>
                        <I.Play size={7} />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="stretch-note">
              <I.Bolt size={11} />
              {exercise.pose_logic}
            </div>
          </>
        ) : (
          <div className="ex-equipment">
            {eq ? (
              <>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--ink-3)"}}>
                  <rect x="2" y="9" width="20" height="6" rx="1"/>
                  <path d="M6 9V7M18 9V7M6 15v2M18 15v2"/>
                </svg>
                {eq.name}
                {exercise.movement_class && (
                  <span style={{ marginLeft: 6, color: "var(--accent-deep)", fontSize: 11, fontWeight: 500 }}>
                    · {MOVEMENT_CLASS_NAMES[exercise.movement_class] || exercise.movement_class}
                  </span>
                )}
                <span className="click-hint">查看详情 →</span>
              </>
            ) : exercise.type === "warmup" ? "热身 · 提升心率体温" : ""}
          </div>
        )}
      </div>
      <div className="ex-stats">
        {dosage && (
          <>
            <div className="stat-pill">
              <div className="val">{dosage.display_sets}</div>
              <div className="lbl">{dosage.isStatic ? "时长" : "组数"}</div>
            </div>
            {dosage.display_reps && (
              <div className="stat-pill">
                <div className="val">{dosage.display_reps}</div>
                <div className="lbl">{dosage.isStatic ? "强度" : "次数"}</div>
              </div>
            )}
            {dosage.display_rpe && dosage.display_rpe !== "—" && (
              <div className="stat-pill" style={{ background: "var(--ok-soft)", borderColor: "transparent" }}>
                <div className="val" style={{ color: "var(--ok)" }}>{dosage.display_rpe}</div>
                <div className="lbl" style={{ color: "var(--ok)", opacity: .75 }}>RPE</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ===== Exercise Modal =====
function ExerciseModal({ exercise, goalId, expId, closing, onClose }) {
  const handleOverlay = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  const isStretch = exercise.type === "stretch_block" || exercise.type === "stretch";

  return (
    <div
      className={`modal-overlay ${closing ? "closing" : ""}`}
      onClick={handleOverlay}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal ${closing ? "modal-closing" : ""} ${isStretch ? "stretch-modal" : ""}`}>
        <ModalHead exercise={exercise} onClose={onClose} />
        {isStretch ? (
          <StretchModalBody exercise={exercise} />
        ) : (
          <ExerciseModalBody exercise={exercise} goalId={goalId} expId={expId} />
        )}
      </div>
    </div>
  );
}

function ModalHead({ exercise, onClose }) {
  let tag = "动作";
  if (exercise.type === "warmup") tag = "热身";
  else if (exercise.type === "cardio") tag = "有氧";
  else if (exercise.type === "main") tag = "主项";

  const eq = exercise.primary_equipment_id ? EQUIP_MAP[exercise.primary_equipment_id] : null;

  return (
    <div className="modal-head">
      <button className="modal-close" onClick={onClose} aria-label="关闭">
        <I.Close size={13} />
      </button>
      <div className="modal-tag">{tag}</div>
      <h2>{exercise.name}</h2>
      {eq && (
        <div className="modal-sub">
          器械：{eq.name} · {eq.category}
          {exercise.movement_class && (
            <span> · {MOVEMENT_CLASS_NAMES[exercise.movement_class] || ""}</span>
          )}
        </div>
      )}
      {(exercise.type === "stretch_block" || exercise.type === "stretch") && (
        <div className="modal-sub">{exercise.duration} · {(exercise.poses?.length || 0)} 个动作，全部完成</div>
      )}
    </div>
  );
}

// ===== Exercise Modal Body =====
function ExerciseModalBody({ exercise, goalId, expId }) {
  const [subIdx, setSubIdx] = useState(-1);
  const subs = exercise.substitutes || [];

  let currentEqId = exercise.primary_equipment_id;
  let currentCue = exercise.feel_cue;
  let currentKeyPoints = exercise.key_points;
  let currentStop = exercise.stop;
  let currentGif = exercise.demo_gif;
  let currentGifMatch = exercise.demo_gif_match;
  let currentGifId = exercise.demo_gif_id;
  const movementClass = exercise.movement_class;

  if (subIdx >= 0 && subs[subIdx]) {
    const s = subs[subIdx];
    currentEqId = s.id;
    currentCue = s.cue;
    currentKeyPoints = s.key_points;
    currentStop = s.stop;
    currentGif = s.demo_gif;
    currentGifMatch = s.demo_gif_match;
    currentGifId = s.demo_gif_id;
  }

  const equipImg = eqImgPath(currentEqId);
  const gifSrc = gifPath(currentGif);
  const eqName = EQUIP_MAP[currentEqId]?.name || currentEqId;
  const eqInfo = EQUIP_MAP[currentEqId];
  const keyPointsArr = splitPoints(currentKeyPoints);
  const phases = exercise.phases;

  // Compute dosage (linked to global selectors)
  const dosage = useMemo(() => {
    if (exercise.dosage && exercise.type !== "main") {
      return {
        display_sets: exercise.dosage.duration,
        display_reps: exercise.dosage.intensity || null,
        display_rpe: exercise.dosage.rpe,
        isStatic: true,
      };
    }
    if (movementClass) {
      const d = computeDosage(movementClass, goalId, expId);
      if (d) return d;
    }
    return null;
  }, [movementClass, goalId, expId, exercise.dosage, exercise.type]);

  return (
    <>
      {/* Substitute selector */}
      {subs.length > 0 && (
        <div className="sub-selector">
          <div className="sub-selector-label">器械选择（点击切换器械图、动作 GIF 与要领）</div>
          <div className="sub-btns">
            <button
              className={`sub-btn ${subIdx === -1 ? "active" : ""}`}
              onClick={() => setSubIdx(-1)}
            >
              <span className="sub-dot"></span>
              <span>{EQUIP_MAP[exercise.primary_equipment_id]?.name || "主器械"}（主）</span>
            </button>
            {subs.map((s, i) => (
              <button
                key={i}
                className={`sub-btn ${subIdx === i ? "active" : ""}`}
                onClick={() => setSubIdx(i)}
              >
                <span className="sub-dot"></span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Two-column image: equipment + GIF */}
      <div className="modal-media">
        <div className="media-panel eq-panel">
          <div className="media-inner">
            <img src={equipImg} alt={`${eqName} 器械图`} loading="lazy"
              onError={(e) => {
                const fb = e.target.parentElement.querySelector('.img-fallback');
                if (fb) fb.style.display = 'flex';
                e.target.style.display = 'none';
              }}/>
            <div className="img-fallback">暂无器械图</div>
          </div>
          <div className="media-label">
            <span className="ml-icon">🏋️</span>
            器械外观
          </div>
        </div>
        <div className="media-panel gif-panel">
          <div className="media-inner">
            {gifSrc ? (
              <img src={gifSrc} alt={`${exercise.name} 动作示范`}
                onError={(e) => {
                  const fb = e.target.parentElement.querySelector('.img-fallback');
                  if (fb) fb.style.display = 'flex';
                  e.target.style.display = 'none';
                }}/>
            ) : (
              <div className="no-gif-placeholder">
                <I.Info size={20} />
                <span>暂无动作 GIF</span>
              </div>
            )}
            <div className="img-fallback">
              <I.Info size={18} />
              GIF 加载失败
            </div>
          </div>
          <div className="media-label">
            <I.Play size={10} />
            动作示范
            {currentGifMatch && (
              <span className={`gif-match-mini ${currentGifMatch === "exact" ? "exact" : "close"}`}>
                {currentGifMatch === "exact" ? "精确匹配" : "近似示意"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="gif-source-note">
        <I.Info size={10} />
        动作示范来源：fitness.xingshuwen.com · 数据集 © Gym Visual / gymvisual.com
      </div>

      <div className="modal-body">
        {/* Benefit */}
        {exercise.benefit && (
          <div className="benefit-box">
            <strong>目标效益：</strong>{exercise.benefit}
          </div>
        )}

        {/* Stats */}
        {dosage && (
          <div className="modal-stats">
            <div className="modal-stat">
              <div className="v">{dosage.display_sets}</div>
              <div className="l">{dosage.isStatic ? "时长" : "组数"}</div>
            </div>
            {dosage.display_reps && (
              <div className="modal-stat">
                <div className="v">{dosage.display_reps}</div>
                <div className="l">{dosage.isStatic ? "强度" : "次数"}</div>
              </div>
            )}
            {dosage.display_rpe && (
              <div className="modal-stat rpe">
                <div className="v">{dosage.display_rpe}</div>
                <div className="l">RPE</div>
              </div>
            )}
            {dosage.display_rest && (
              <div className="modal-stat">
                <div className="v">{dosage.display_rest}</div>
                <div className="l">组间休息</div>
              </div>
            )}
            {dosage.isStatic && <div className="modal-stat"><div className="v">—</div><div className="l">休息</div></div>}
          </div>
        )}

        {movementClass && !dosage?.isStatic && (
          <div className="mc-note">
            剂量按「{MOVEMENT_CLASS_NAMES[movementClass] || movementClass}」分类查表，随顶部目标与经验联动。
          </div>
        )}

        {/* Phases: 5-step breakdown */}
        {phases && (
          <>
            <h3 className="section-title">动作五段分解</h3>
            <ul className="phases-list">
              {["setup", "concentric", "peak", "eccentric", "return"].map((phase, i) => (
                phases[phase] && (
                  <li key={phase} className={`phase-item ${phase}`}>
                    <span className="phase-name">{PHASE_NAMES[phase]}：</span>
                    {phases[phase]}
                  </li>
                )
              ))}
            </ul>
          </>
        )}

        {/* Feel cue */}
        {currentCue && (
          <div className="cue-box">
            <strong>动作感觉：</strong>{currentCue}
          </div>
        )}

        {/* Key points */}
        {keyPointsArr.length > 0 && (
          <>
            <h3 className="section-title">
              {subIdx >= 0 ? "替代器械动作要领" : "动作要领"}
            </h3>
            <ul className="points-list">
              {keyPointsArr.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </>
        )}

        {/* Stop */}
        {currentStop && currentStop !== "—" && (
          <>
            <h3 className="section-title">停止信号</h3>
            <div className="stop-box">
              <strong>注意：</strong>{currentStop}
            </div>
          </>
        )}

        {/* Equipment info */}
        {eqInfo && (
          <>
            <h3 className="section-title">器械信息</h3>
            <div className="eq-info">
              <strong>{eqInfo.name}</strong> · {eqInfo.appearance}
              {eqInfo.two_function_note && (
                <div className="two-func-note">
                  ⚡ 双功能器械：{eqInfo.two_function_note}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ===== Stretch Modal Body =====
function StretchModalBody({ exercise }) {
  const poses = exercise.poses || [];
  return (
    <>
      <div className="benefit-box" style={{ margin: "12px 20px 0" }}>
        <strong>目标效益：</strong>{exercise.benefit}
      </div>
      <div className="stretch-logic">
        <strong>动作顺序：</strong>{exercise.pose_logic}
      </div>
      <div className="stretch-poses-full noimg">
        {poses.map((poseId, i) => {
          const s = STRETCH_LIB[poseId];
          if (!s) return null;
          const gif = gifPath(s.demo_gif);
          const match = s.demo_gif_match;
          return (
            <div className="stretch-pose-card noimg" key={poseId}>
              <span className="pose-order">{i + 1}</span>
              {gif && (
                <div className="pose-gif-wrap">
                  <img src={gif} alt={s.name} className="pose-gif"
                       onError={(e) => { e.target.style.display = "none"; }}/>
                </div>
              )}
              <div className="pose-body">
                <div className="pose-head">
                  <span className="pose-name">{s.name}</span>
                  <span className="pose-dur">{s.duration}</span>
                  {gif && (
                    <span className={`gif-match-mini ${match === "exact" ? "exact" : "close"}`}>
                      <I.Play size={8} />
                      {match === "exact" ? "精确" : "近似"}
                    </span>
                  )}
                </div>
                <div className="pose-cue">牵拉感：{s.feel_cue}</div>
                <div className="pose-points">{s.key_points}</div>
                <div className="pose-stop">停止信号：{s.stop}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="gif-source-note stretch-src">
        <I.Info size={10} />
        拉伸示范 GIF 来源：fitness.xingshuwen.com · 数据集 © Gym Visual / gymvisual.com
      </div>
      <div style={{ padding: "12px 20px 20px" }}>
        <h3 className="section-title">提示</h3>
        <p style={{ fontSize: "12px", color: "var(--ink-3)", margin: 0, lineHeight: 1.7 }}>
          每个拉伸动作保持均匀呼吸，不要憋气；牵拉感到舒适酸胀即可，不追求痛感。
          所有动作均为自重，不需要器械。
        </p>
      </div>
    </>
  );
}

// ===== Dosage Framework =====
function DosageFramework({ goalId, expId }) {
  const goal = GOALS.find(g => g.id === goalId);
  const exp = EXPERIENCES.find(e => e.id === expId);
  const table = goal?.ranges || {};

  function formatSets(setsStr) {
    if (!setsStr) return "—";
    const [low, high] = parseRange(setsStr);
    const newLow = Math.max(1, Math.round(low * exp.multiplier_sets));
    const newHigh = Math.max(newLow, Math.round(high * exp.multiplier_sets));
    return newLow === newHigh ? `${newLow} 组` : `${newLow}-${newHigh} 组`;
  }
  function formatRest(secs) {
    if (secs === undefined || secs === null) return "—";
    if (secs >= 60) {
      const mins = Math.floor(secs / 60);
      const s = secs % 60;
      return s === 0 ? `${mins} 分钟` : `${mins} 分 ${s} 秒`;
    }
    return `${secs} 秒`;
  }

  const compoundRow = table.compound_push;
  const isoRow = table.isolation_arm;
  const cardioRow = table.cardio;

  return (
    <div className="dosage-section">
      <div className="dosage-head">
        <h3>剂量框架 · 查表说明</h3>
        <p>
          当前为 <strong style={{color: "var(--accent-deep)"}}>「{goal?.name}」×「{exp?.name}」</strong> 组合。
          所有动作按 movement_class（复合推/拉/腿/肩推 vs 孤立胸/肩/臂/腿/核心）查表后，
          用经验系数调整组数下限与 RPE 上限。
        </p>
      </div>
      <div className="dosage-table">
        <div className="dt-row">
          <div className="dt-label">经验系数</div>
          <div className="dt-val">
            组数 × <strong>{exp?.multiplier_sets}</strong>，RPE ≤ <strong>{exp?.rpe_cap}</strong>
            <br />
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{exp?.note}</span>
          </div>
        </div>

        <div className="dt-row">
          <div className="dt-label">复合动作</div>
          <div className="dt-val">
            复合推/拉/下肢/过头推：<strong>{formatSets(compoundRow?.sets)}</strong> × <strong>{compoundRow?.reps} 次</strong>
             · RPE <strong>{Math.min(compoundRow?.rpe || 0, exp?.rpe_cap || 99)}</strong> · 休息 <strong>{formatRest(compoundRow?.rest)}</strong>
          </div>
        </div>

        <div className="dt-row">
          <div className="dt-label">孤立动作</div>
          <div className="dt-val">
            <strong>{formatSets(isoRow?.sets)}</strong> × <strong>{isoRow?.reps} 次</strong>
             · RPE <strong>{Math.min(isoRow?.rpe || 0, exp?.rpe_cap || 99)}</strong> · 休息 <strong>{formatRest(isoRow?.rest)}</strong>
            <br />
            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
              胸/肩/臂/腿/核心的孤立动作次数范围略有差异（核心 12-30 次，肩 12-20 次），卡片与弹窗按各动作分类精确显示。
            </span>
          </div>
        </div>

        {cardioRow && (
          <div className="dt-row">
            <div className="dt-label">有氧</div>
            <div className="dt-val">
              <strong>{cardioRow.duration_min} 分钟</strong> · RPE <strong>{cardioRow.rpe}</strong>
              <br />
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>热身固定为 5 分钟（不联动）；训练日有氧按目标联动（增肌 10 分钟 / 力量 5 分钟 / 肌耐力 20 分钟）。</span>
            </div>
          </div>
        )}

        <div className="dt-row">
          <div className="dt-label">进阶法则</div>
          <div className="dt-val">
            {DATA.dosage_framework?.progression?.progress}
            <br />
            {DATA.dosage_framework?.progression?.stalled}
            <br />
            {DATA.dosage_framework?.progression?.deload}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Principles =====
function PrinciplesSection() {
  return (
    <div className="principles-section">
      <h3>通用原则</h3>
      <div className="rules-grid">
        {COMMON_PRINCIPLES.map((p, i) => {
          const Icon = PRINCIPLE_ICKS[i % PRINCIPLE_ICKS.length];
          return (
            <div className="rule-item" key={i}>
              <div className="rule-icon"><Icon size={12} /></div>
              <div className="rule-text">
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== Risk & Source Section =====
function RiskAndSourceSection() {
  const rows = [
    {
      claim: "动作示范 GIF 来自 fitness.xingshuwen.com，数据集归属 © Gym Visual (gymvisual.com)",
      status: "待核验事实",
      risk: "GIF 由第三方聚合站提供；底层数据集为公开动作数据集；非医院或认证医学来源",
      confidence: "中",
      verify: "访问 fitness.xingshuwen.com 对照动作；本地 anim_gifs/ 文件可直接检查",
    },
    {
      claim: "GIF 与本计划动作的匹配关系（主项 29/34，替代 35/35，拉伸 8/10）",
      status: "待核验事实",
      risk: "未匹配项主要是猫式伸展、肱二头肌拉伸（数据集中无对应条目）；已 close 标记的为最近似动作（如站姿股四头肌拉伸用侧卧版）",
      confidence: "中",
      verify: "动作卡片与弹窗均标注「精确」或「近似」；以动作要领文字为准",
    },
    {
      claim: "器械实拍图为商用产品图，外观可作参考",
      status: "待核验事实",
      risk: "不同健身房型号/角度会有差异；图片为搜索结果，未与实际健身房逐一核对",
      confidence: "中",
      verify: "按 id 命名的 HD 器械图，可与门店实际器械对照",
    },
    {
      claim: "计划本身为通用起点方案，未读取任何用户身体数据",
      status: "假设",
      risk: "用户未提供身高/体重/伤病/经验/打卡数据；剂量与组次仅给区间，需个人调整",
      confidence: "高",
      verify: "本页训练计划为通用版本，落地需按个人恢复状态微调",
    },
    {
      claim: "五人站系列动作（绳索夹胸/下压/弯举/站姿推举/单臂侧平举/面拉）通过 cable 系列动作示范映射",
      status: "待核验事实",
      risk: "「五人站」为中国健身房常见龙门架术语；GIF 来自 cable 系列示意，动作模式一致但器械外形不同",
      confidence: "中",
      verify: "动作模式一致，仅器械外形有差异；以文字要领为准",
    },
  ];

  const statusColor = {
    "待核验事实": "var(--warn)",
    "假设": "var(--ink-3)",
    "事实": "var(--ok)",
  };
  const confColor = {
    "高": "var(--ok)",
    "中": "var(--warn)",
    "低": "var(--stop)",
  };

  return (
    <div className="risk-section">
      <div className="risk-head">
        <h3>
          <I.Shield size={16} />
          数据风险与置信度说明
        </h3>
        <p>
          本计划的各个组成部分来源不同、置信度不同，请结合自身情况与实际环境调整。
          如有疑问以专业教练、医生或物理治疗师的当面评估为准。
        </p>
      </div>
      <div className="risk-table-wrap">
        <table className="risk-table">
          <thead>
            <tr>
              <th style={{ width: "24%" }}>场景 / 主张</th>
              <th style={{ width: "10%" }}>事实状态</th>
              <th style={{ width: "30%" }}>数据风险与限制</th>
              <th style={{ width: "8%" }}>置信度</th>
              <th style={{ width: "28%" }}>核验方式</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.claim}</strong></td>
                <td>
                  <span className="status-chip" style={{ color: statusColor[r.status] || "var(--ink-3)" }}>
                    {r.status}
                  </span>
                </td>
                <td>{r.risk}</td>
                <td>
                  <span className="conf-chip" style={{ color: confColor[r.confidence] || "var(--ink-3)" }}>
                    {r.confidence}
                  </span>
                </td>
                <td>{r.verify}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="risk-footnote">
        <strong>动作示范 GIF 来源：</strong>fitness.xingshuwen.com（数据集 © Gym Visual / gymvisual.com）。
        GIF 仅作动作模式参考，具体发力感与幅度以本页文字要领与个人实际感受为准。
      </div>
    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
