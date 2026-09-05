(() => {
  const { useState, useEffect, useCallback, useMemo } = React;
  const DATA = window.PLAN_V6 || {};
  const GOALS = (DATA.dosage_parametric?.by_goal || []).map((g) => ({
    id: g.id,
    name: g.name,
    ranges: g.ranges
  }));
  const EXP_MAP = DATA.dosage_parametric?.by_experience || {};
  const EXPERIENCES = [
    { id: "beginner_0_3m", ...EXP_MAP.beginner_0_3m || { name: "\u65B0\u624B 0-3 \u6708", multiplier_sets: 0.75, rpe_cap: 8 } },
    { id: "intermediate_3_12m", ...EXP_MAP.intermediate_3_12m || { name: "\u8FDB\u9636 3-12 \u6708", multiplier_sets: 1, rpe_cap: 9 } },
    { id: "advanced_12m_plus", ...EXP_MAP.advanced_12m_plus || { name: "\u9AD8\u9636 12 \u6708+", multiplier_sets: 1.2, rpe_cap: 10 } }
  ];
  const MOVEMENT_CLASS_NAMES = {
    compound_lower: "\u590D\u5408\u4E0B\u80A2",
    compound_push: "\u590D\u5408\u63A8",
    compound_pull: "\u590D\u5408\u62C9",
    compound_overhead: "\u590D\u5408\u8FC7\u5934\u63A8",
    isolation_chest: "\u5B64\u7ACB\u80F8\u90E8",
    isolation_shoulder: "\u5B64\u7ACB\u80A9\u90E8",
    isolation_arm: "\u5B64\u7ACB\u624B\u81C2",
    isolation_leg: "\u5B64\u7ACB\u817F\u90E8",
    isolation_core: "\u5B64\u7ACB\u6838\u5FC3",
    cardio: "\u6709\u6C27"
  };
  const PHASE_NAMES = {
    setup: "\u8D77\u59CB\u51C6\u5907",
    concentric: "\u5411\u5FC3(\u53D1\u529B)",
    peak: "\u9876\u5CF0\u6536\u7F29",
    eccentric: "\u79BB\u5FC3(\u56DE\u653E)",
    return: "\u590D\u4F4D"
  };
  function parseRange(str) {
    if (!str) return [0, 0];
    const parts = String(str).split("-").map((n) => parseInt(n, 10));
    const low = Number.isFinite(parts[0]) ? parts[0] : 0;
    const high = Number.isFinite(parts[1]) ? parts[1] : low;
    return [low, high];
  }
  function computeDosage(movementClass, goalId, expId) {
    const goal = GOALS.find((g) => g.id === goalId);
    if (!goal || !goal.ranges) return null;
    const base = goal.ranges[movementClass];
    if (!base) return null;
    const exp = EXPERIENCES.find((e) => e.id === expId);
    if (!exp) return { ...base };
    const result = { ...base };
    if (base.sets) {
      const [low, high] = parseRange(base.sets);
      const newLow = Math.max(1, Math.round(low * exp.multiplier_sets));
      const newHigh = Math.max(newLow, Math.round(high * exp.multiplier_sets));
      result.display_sets = newLow === newHigh ? `${newLow} \u7EC4` : `${newLow}-${newHigh} \u7EC4`;
    }
    if (base.rpe !== void 0 && base.rpe !== null) {
      const capped = Math.min(base.rpe, exp.rpe_cap);
      result.display_rpe = String(capped);
    }
    if (base.rest !== void 0) {
      const r = base.rest;
      if (r >= 60) {
        const mins = Math.floor(r / 60);
        const secs = r % 60;
        result.display_rest = secs === 0 ? `${mins} \u5206\u949F` : `${mins} \u5206 ${secs} \u79D2`;
      } else {
        result.display_rest = `${r} \u79D2`;
      }
    }
    if (base.reps) result.display_reps = base.reps + " \u6B21";
    if (base.duration_min !== void 0) result.display_duration = `${base.duration_min} \u5206\u949F`;
    return result;
  }
  function getStaticDosage(ex) {
    if (!ex.dosage) return null;
    const sets = ex.dosage.duration || "\u2014";
    const reps = ex.dosage.intensity || null;
    const rpe = ex.dosage.rpe || "\u2014";
    return {
      display_sets: sets,
      display_reps: reps,
      display_rpe: rpe,
      isStatic: true,
      setsLbl: sets.includes("\u5206\u949F") ? "\u65F6\u957F" : "\u7EC4\u6570",
      repsLbl: reps && reps.includes("\u6B21") ? "\u6B21\u6570" : "\u5F3A\u5EA6"
    };
  }
  function getExerciseDosage(ex, goalId, expId) {
    if (ex.type === "stretch_block" || ex.type === "stretch") return null;
    if (ex.dosage && (ex.type === "warmup" || ex.type === "cardio")) return getStaticDosage(ex);
    if (ex.movement_class) return computeDosage(ex.movement_class, goalId, expId);
    return null;
  }
  const EQUIP_MAP = {};
  (DATA.equipment_catalog || []).forEach((eq) => {
    EQUIP_MAP[eq.id] = eq;
  });
  const STRETCH_LIB = DATA.stretch_library || {};
  const DAYS = DATA.days || [];
  const COMMON_PRINCIPLES = DATA.common_principles ? [
    { title: "\u70ED\u8EAB", text: DATA.common_principles.warmup },
    { title: "\u52A8\u4F5C\u8282\u594F", text: DATA.common_principles.tempo },
    { title: "\u547C\u5438", text: DATA.common_principles.breathing },
    { title: "\u8BB0\u5F55", text: DATA.common_principles.monitor },
    { title: "\u6062\u590D", text: DATA.common_principles.recovery },
    { title: "\u5173\u8282\u4F18\u5148", text: DATA.common_principles.joint_first }
  ] : [];
  function eqImgPath(id) {
    const eq = EQUIP_MAP[id];
    if (eq && eq.image) {
      const fname = eq.image.split("/").pop();
      return `assets/equipment-hd/${fname}`;
    }
    return "";
  }
  function gifPath(demoGif) {
    if (!demoGif) return null;
    const fname = demoGif.split("/").pop();
    return `assets/anim-gifs/${fname}`;
  }
  function stretchSvgPath(poseId) {
    const s = STRETCH_LIB[poseId];
    if (!s || !s.demo_svg) return null;
    const fname = s.demo_svg.split("/").pop();
    return `assets/stretch-svgs/${fname}`;
  }
  function splitPoints(text) {
    if (!text) return [];
    return text.split(/[；;。\n]/).map((s) => s.trim()).filter((s) => s.length > 1);
  }
  const I = {
    Clock: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 14, height: p.size || 14, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7v5l3 2" })),
    Close: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 14, height: p.size || 14, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" })),
    Warm: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 18, height: p.size || 18, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M12 3s4 4 4 8a4 4 0 01-8 0c0-4 4-8 4-8z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 15v3" }), /* @__PURE__ */ React.createElement("path", { d: "M9 18h6" })),
    Cardio: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 18, height: p.size || 18, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" })),
    Stretch: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 18, height: p.size || 18, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "5", r: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7v6M8 10l4 3 4-3" }), /* @__PURE__ */ React.createElement("path", { d: "M12 13l-3 8M12 13l3 8" })),
    Bolt: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 13, height: p.size || 13, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M13 2L4 14h7l-1 8 9-12h-7l1-8z" })),
    Breath: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 13, height: p.size || 13, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 12c0-4 4-6 8-6s8 2 8 6-4 6-8 6-8-2-8-6z" })),
    Tempo: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 13, height: p.size || 13, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "14", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 14V9" }), /* @__PURE__ */ React.createElement("path", { d: "M9 11h6" })),
    Note: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 13, height: p.size || 13, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 4h12l4 4v12H4z" }), /* @__PURE__ */ React.createElement("path", { d: "M16 4v4h4" }), /* @__PURE__ */ React.createElement("path", { d: "M8 13h8M8 17h6" })),
    Recover: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 13, height: p.size || 13, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" })),
    Joint: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 13, height: p.size || 13, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M9 12l2 2 4-4" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9" })),
    Play: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 12, height: p.size || 12, fill: "currentColor" }, /* @__PURE__ */ React.createElement("path", { d: "M8 5v14l11-7z" })),
    Info: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 12, height: p.size || 12, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16v-4M12 8h.01" })),
    Shield: (p) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: p.size || 14, height: p.size || 14, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" }))
  };
  const PRINCIPLE_ICKS = [I.Warm, I.Tempo, I.Breath, I.Note, I.Recover, I.Joint];
  function App() {
    const [activeDay, setActiveDay] = useState(0);
    const [selectedEx, setSelectedEx] = useState(null);
    const [modalClosing, setModalClosing] = useState(false);
    const [goalId, setGoalId] = useState(GOALS[0]?.id || "hypertrophy");
    const [expId, setExpId] = useState("beginner_0_3m");
    const [searchQuery, setSearchQuery] = useState("");
    const [showRecords, setShowRecords] = useState(false);
    const [theme, setTheme] = useState(() => { const s = localStorage.getItem("theme"); if (s) return s; return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; });
    const [principlesOpen, setPrinciplesOpen] = useState(() => localStorage.getItem("principlesOpen") !== "false");
    const [showBackTop, setShowBackTop] = useState(false);
    const [listTransition, setListTransition] = useState("entered");
    const listRef = React.useRef(null);
    const prevDayRef = React.useRef(0);
    const searchInputRef = React.useRef(null);

    // 暗色模式
    useEffect(() => { document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); }, [theme]);

    // 回到顶部
    useEffect(() => {
      const onScroll = () => setShowBackTop(window.scrollY > window.innerHeight * 0.8);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Day Tab 过渡动画
    useEffect(() => {
      if (prevDayRef.current !== activeDay) {
        setListTransition("entering");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setListTransition("entered"));
        });
        prevDayRef.current = activeDay;
      }
    }, [activeDay]);

    // 训练原则折叠状态持久化
    const togglePrinciples = () => { const v = !principlesOpen; setPrinciplesOpen(v); localStorage.setItem("principlesOpen", String(v)); };

    // 搜索功能
    const allExercises = React.useMemo(() => {
      const results = [];
      DAYS.forEach((d, di) => {
        d.exercises.forEach((ex) => {
          results.push({ ...ex, dayIndex: di, dayName: d.day });
          (ex.substitutes || []).forEach((sub) => {
            results.push({ ...sub, dayIndex: di, dayName: d.day, isSubstitute: true, parentName: ex.name });
          });
        });
      });
      return results;
    }, []);
    const searchResults = React.useMemo(() => {
      if (!searchQuery.trim()) return [];
      const q = searchQuery.toLowerCase();
      return allExercises.filter((ex) => (ex.name || "").toLowerCase().includes(q) || (ex.benefit || "").toLowerCase().includes(q) || (ex.movement_class || "").toLowerCase().includes(q) || (ex.primary_equipment_id || "").toLowerCase().includes(q)).slice(0, 20);
    }, [searchQuery, allExercises]);

    // IntersectionObserver 懒加载
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: "100px" });
      document.querySelectorAll("img[data-src]").forEach((img) => observer.observe(img));
      return () => observer.disconnect();
    }, [activeDay, selectedEx]);
    const day = DAYS[activeDay];
    const openModal = useCallback((ex) => {
      setSelectedEx(ex);
      setModalClosing(false);
    }, []);
    const closeModal = useCallback(() => {
      setModalClosing(true);
    }, []);
    useEffect(() => {
      let timer;
      if (modalClosing) {
        timer = setTimeout(() => {
          setSelectedEx(null);
          setModalClosing(false);
        }, 200);
      }
      return () => { if (timer) clearTimeout(timer); };
    }, [modalClosing]);
    const selectedExRef = React.useRef(selectedEx);
    selectedExRef.current = selectedEx;
    const activeDayRef = React.useRef(activeDay);
    activeDayRef.current = activeDay;
    const closeModalRef = React.useRef(closeModal);
    closeModalRef.current = closeModal;
    useEffect(() => {
      const handleKey = (e) => {
        if (e.key === "Escape" && selectedExRef.current) {
          closeModalRef.current();
          return;
        }
        if (!selectedExRef.current && e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON") {
          if (e.key === "ArrowLeft" && activeDayRef.current > 0) setActiveDay((d) => d - 1);
          if (e.key === "ArrowRight" && activeDayRef.current < DAYS.length - 1) setActiveDay((d) => d + 1);
          if (/^[1-5]$/.test(e.key)) {
            const n = parseInt(e.key, 10) - 1;
            if (n >= 0 && n < DAYS.length) setActiveDay(n);
          }
        }
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, []);
    if (!day) return /* @__PURE__ */ React.createElement("div", { style: { padding: 40 } }, "\u52A0\u8F7D\u4E2D...");
    return /* @__PURE__ */ React.createElement(React.Fragment, null,
      /* @__PURE__ */ React.createElement("button", { className: "theme-toggle", onClick: () => setTheme(theme === "light" ? "dark" : "light"), title: theme === "light" ? "\u5207\u6362\u6697\u8272\u6A21\u5F0F" : "\u5207\u6362\u6D45\u8272\u6A21\u5F0F" }, theme === "light" ? "\u263D" : "\u2600"),
      /* @__PURE__ */ React.createElement("div", { className: "keyboard-hint" }, /* @__PURE__ */ React.createElement("span", null, "\u5FEB\u6377\u952E\uFF1A", /* @__PURE__ */ React.createElement("kbd", null, "\u2190\u2192"), "\u5207\u6362\u65E5\u671F ", /* @__PURE__ */ React.createElement("kbd", null, "1-5"), "\u8DF3\u8F6C ", /* @__PURE__ */ React.createElement("kbd", null, "ESC"), "\u5173\u95ED")),
      /* @__PURE__ */ React.createElement("div", { className: "app" },
        /* @__PURE__ */ React.createElement(Hero, null),
        /* @__PURE__ */ React.createElement(DosageBar, { goalId, expId, setGoal: setGoalId, setExp: setExpId }),
        /* @__PURE__ */ React.createElement(SearchBar, { query: searchQuery, setQuery: setSearchQuery, results: searchResults, onSelect: (ex) => { setSearchQuery(""); setActiveDay(ex.dayIndex); setTimeout(() => openModal(ex), 100); } }),
        searchQuery.trim() ? /* @__PURE__ */ React.createElement(SearchResults, { results: searchResults, onSelect: (ex) => { setSearchQuery(""); setActiveDay(ex.dayIndex); setTimeout(() => openModal(ex), 100); } }) : null,
        /* @__PURE__ */ React.createElement(CollapsiblePrinciples, { open: principlesOpen, onToggle: togglePrinciples }),
        /* @__PURE__ */ React.createElement(DayTabs, { active: activeDay, onChange: (i) => { setListTransition("entering"); setActiveDay(i); requestAnimationFrame(() => requestAnimationFrame(() => setListTransition("entered"))); } }),
        /* @__PURE__ */ React.createElement(DayHeader, { day }),
        /* @__PURE__ */ React.createElement("div", { ref: listRef, className: `exercise-list ${listTransition}` }, day.exercises.map((ex, i) => {
          const isMain = ex.type === "main";
          const num = isMain ? i + 1 - day.exercises.slice(0, i).filter((e) => e.type !== "main").length : null;
          return /* @__PURE__ */ React.createElement(ExerciseCard, { key: ex.name || i, exercise: ex, num, goalId, expId, onClick: () => openModal(ex) });
        })),
        /* @__PURE__ */ React.createElement(DosageFramework, { goalId, expId }),
        /* @__PURE__ */ React.createElement(RiskAndSourceSection, null),
        selectedEx && /* @__PURE__ */ React.createElement(ExerciseModal, { exercise: selectedEx, goalId, expId, closing: modalClosing, onClose: closeModal })
      ),
      /* @__PURE__ */ React.createElement("button", { className: `back-to-top ${showBackTop ? "visible" : ""}`, onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) }, "\u2191"),
      /* @__PURE__ */ React.createElement("button", { className: "record-history-btn", onClick: () => setShowRecords(true), title: "\u6211\u7684\u8BAD\u7EC3\u8BB0\u5F55" }, "\u270F"),
      showRecords && /* @__PURE__ */ React.createElement(RecordModal, { onClose: () => setShowRecords(false) })
    );
  }
  function Hero() {
    return /* @__PURE__ */ React.createElement("div", { className: "hero" }, /* @__PURE__ */ React.createElement("span", { className: "hero-tag" }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), "5 \u5929\u52A8\u4F5C\u5E93 \xB7 \u56FA\u5B9A\u5668\u68B0\u4E3A\u4E3B \xB7 \u542B\u81EA\u7531\u91CD\u91CF / \u5F92\u624B\u5907\u9009"), /* @__PURE__ */ React.createElement("h1", null, DATA.plan_title || "\u4E94\u5206\u5316\u8BAD\u7EC3\u52A8\u4F5C\u5E93"), /* @__PURE__ */ React.createElement("p", { className: "hero-sub" }, /* @__PURE__ */ React.createElement("strong", null, DATA.scope_intro || "")));
  }
  function DosageBar({ goalId, expId, setGoal, setExp }) {
    const currentGoal = GOALS.find((g) => g.id === goalId);
    const currentExp = EXPERIENCES.find((e) => e.id === expId);
    return /* @__PURE__ */ React.createElement("div", { className: "dosage-bar" }, /* @__PURE__ */ React.createElement("div", { className: "ds-group" }, /* @__PURE__ */ React.createElement("label", null, "\u8BAD\u7EC3\u76EE\u6807"), /* @__PURE__ */ React.createElement("div", { className: "ds-options" }, GOALS.map((g) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: g.id,
        className: `ds-option ${goalId === g.id ? "active" : ""}`,
        onClick: () => setGoal(g.id)
      },
      g.name
    )))), /* @__PURE__ */ React.createElement("div", { className: "ds-group" }, /* @__PURE__ */ React.createElement("label", null, "\u7ECF\u9A8C\u6C34\u5E73"), /* @__PURE__ */ React.createElement("div", { className: "ds-options" }, EXPERIENCES.map((e) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: e.id,
        className: `ds-option ${expId === e.id ? "active" : ""}`,
        onClick: () => setExp(e.id),
        title: e.note
      },
      e.name
    )))), /* @__PURE__ */ React.createElement("div", { className: "ds-explain" }, /* @__PURE__ */ React.createElement("strong", null, "\u8D1F\u8377\u8054\u52A8\uFF1A"), "\u5F53\u524D\u4E3A\u300C", currentGoal?.name, "\u300D+\u300C", currentExp?.name, "\u300D\uFF0C \u6240\u6709\u52A8\u4F5C\u6309\u52A8\u4F5C\u5206\u7C7B\u5B9E\u65F6\u8BA1\u7B97\u7EC4\u6570\u3001\u6B21\u6570\u3001RPE \u4E0E\u7EC4\u95F4\u4F11\u606F\u3002 \u66FF\u6362\u5668\u68B0\u540E\u52A8\u4F5C\u5206\u7C7B\u4E0D\u53D8\uFF0C\u8D1F\u8377\u81EA\u52A8\u540C\u6B65\u3002", /* @__PURE__ */ React.createElement("span", { className: "term-tip", title: "RPE 1=\u6781\u8F7B\u677E 10=\u6781\u9650\u529B\u7AED\uFF0C\u63A8\u8350\u8BAD\u7EC3\u533A\u95F4 RPE 6-9" }, "RPE?")));
  }
  function DayTabs({ active, onChange }) {
    return /* @__PURE__ */ React.createElement("div", { className: "tabs", role: "tablist" }, DAYS.map((d, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: d.day,
        role: "tab",
        "aria-selected": i === active,
        className: `tab-btn ${i === active ? "active" : ""}`,
        onClick: () => onChange(i),
        title: `${d.day} \xB7 ${d.theme}\uFF08\u5FEB\u6377\u952E ${i + 1}\uFF09`
      },
      /* @__PURE__ */ React.createElement("span", { className: "tab-day" }, d.day),
      /* @__PURE__ */ React.createElement("span", { className: "tab-theme" }, d.theme)
    )));
  }
  function DayHeader({ day }) {
    return /* @__PURE__ */ React.createElement("div", { className: "day-header" }, /* @__PURE__ */ React.createElement("div", { className: "day-title-row" }, /* @__PURE__ */ React.createElement("h2", { className: "day-title" }, day.day, " \xB7 ", day.theme), /* @__PURE__ */ React.createElement("div", { className: "day-meta" }, /* @__PURE__ */ React.createElement("span", { className: "meta-chip" }, /* @__PURE__ */ React.createElement(I.Clock, { size: 12 }), /* @__PURE__ */ React.createElement("span", null, day.duration)))), /* @__PURE__ */ React.createElement("div", { className: "day-benefit" }, /* @__PURE__ */ React.createElement("strong", null, "\u4ECA\u65E5\u6548\u76CA\uFF1A"), day.focus_benefit));
  }
  function ExerciseList({ exercises, goalId, expId, onSelect }) {
    let mainIdx = 0;
    return /* @__PURE__ */ React.createElement("div", { className: "exercise-list" }, exercises.map((ex, i) => {
      const isMain = ex.type === "main";
      const num = isMain ? ++mainIdx : null;
      return /* @__PURE__ */ React.createElement(
        ExerciseCard,
        {
          key: ex.name || i,
          exercise: ex,
          num,
          goalId,
          expId,
          onClick: () => onSelect(ex)
        }
      );
    }));
  }
  function ExerciseCard({ exercise, num, goalId, expId, onClick }) {
    const eq = exercise.primary_equipment_id ? EQUIP_MAP[exercise.primary_equipment_id] : null;
    const cls = exercise.type || "";
    const dosage = useMemo(() => getExerciseDosage(exercise, goalId, expId), [exercise, goalId, expId]);
    let iconNode = null;
    if (exercise.type === "warmup") iconNode = /* @__PURE__ */ React.createElement(I.Warm, { size: 16 });
    else if (exercise.type === "cardio") iconNode = /* @__PURE__ */ React.createElement(I.Cardio, { size: 16 });
    else if (exercise.type === "stretch_block" || exercise.type === "stretch") iconNode = /* @__PURE__ */ React.createElement(I.Stretch, { size: 16 });
    const gifMatch = exercise.demo_gif_match;
    const hasGif = exercise.demo_gif;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `ex-card ${cls === "stretch_block" || cls === "stretch" ? "stretch-card" : cls}`,
        onClick,
        "data-comment-anchor": `ex-${exercise.name}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "ex-num" }, iconNode || num),
      /* @__PURE__ */ React.createElement("div", { className: "ex-main" }, /* @__PURE__ */ React.createElement("div", { className: "ex-name" }, exercise.name, hasGif && exercise.type !== "stretch_block" && exercise.type !== "stretch" && /* @__PURE__ */ React.createElement("span", { className: `gif-match-badge ${gifMatch === "exact" ? "exact" : "close"}`, title: gifMatch === "exact" ? "\u52A8\u4F5C\u4E0E\u5668\u68B0\u7CBE\u786E\u5339\u914D" : "\u6700\u8FD1\u4F3C\u52A8\u4F5C\u793A\u610F\uFF0C\u5668\u68B0/\u89D2\u5EA6\u53EF\u80FD\u7565\u6709\u5DEE\u5F02" }, /* @__PURE__ */ React.createElement(I.Play, { size: 9 }), gifMatch === "exact" ? "\u7CBE\u786E GIF" : "\u8FD1\u4F3C GIF"), exercise.type === "main" && exercise.benefit && /* @__PURE__ */ React.createElement("span", { className: "ex-benefit-tag", title: exercise.benefit }, exercise.benefit.length > 20 ? exercise.benefit.slice(0, 20) + "\u2026" : exercise.benefit)), exercise.type === "stretch_block" || exercise.type === "stretch" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "ex-equipment" }, /* @__PURE__ */ React.createElement(I.Stretch, { size: 13 }), exercise.poses?.length || 0, " \u4E2A\u62C9\u4F38\u52A8\u4F5C \xB7 ", exercise.duration, " \xB7 \u70B9\u51FB\u67E5\u770B\u8BE6\u60C5"), /* @__PURE__ */ React.createElement("div", { className: "stretch-poses" }, (exercise.poses || []).map((p, i) => {
        const s = STRETCH_LIB[p];
        if (!s) return null;
        return /* @__PURE__ */ React.createElement("span", { className: "stretch-pose-chip", key: p }, /* @__PURE__ */ React.createElement("span", { className: "pose-num" }, i + 1), s.name, s.demo_gif && /* @__PURE__ */ React.createElement("span", { className: `mini-gif-tag ${s.demo_gif_match === "exact" ? "exact" : "close"}`, title: s.demo_gif_match === "exact" ? "\u7CBE\u786EGIF" : "\u8FD1\u4F3CGIF" }, /* @__PURE__ */ React.createElement(I.Play, { size: 7 })), s.demo_svg && !s.demo_gif && /* @__PURE__ */ React.createElement("span", { className: "mini-svg-tag", title: "\u624B\u7ED8\u793A\u610F" }, "\u270E"));
      })), /* @__PURE__ */ React.createElement("div", { className: "stretch-note" }, /* @__PURE__ */ React.createElement(I.Bolt, { size: 11 }), exercise.pose_logic)) : /* @__PURE__ */ React.createElement("div", { className: "ex-equipment" }, eq ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("svg", { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { color: "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "9", width: "20", height: "6", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M6 9V7M18 9V7M6 15v2M18 15v2" })), eq.name, exercise.movement_class && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 6, color: "var(--accent-deep)", fontSize: 11, fontWeight: 500 } }, "\xB7 ", MOVEMENT_CLASS_NAMES[exercise.movement_class] || exercise.movement_class), /* @__PURE__ */ React.createElement("span", { className: "click-hint" }, "\u67E5\u770B\u8BE6\u60C5 \u2192")) : exercise.type === "warmup" ? `\u70ED\u8EAB\u6FC0\u6D3B${exercise.equipment_name ? " \xB7 " + exercise.equipment_name : " \xB7 \u63D0\u5347\u5FC3\u7387\u4F53\u6E29"}` : "")),
      /* @__PURE__ */ React.createElement("div", { className: "ex-stats" }, dosage && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "stat-pill" }, /* @__PURE__ */ React.createElement("div", { className: "val" }, dosage.display_sets), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, dosage.isStatic ? dosage.setsLbl || "\u65F6\u957F" : "\u7EC4\u6570")), dosage.display_reps && /* @__PURE__ */ React.createElement("div", { className: "stat-pill" }, /* @__PURE__ */ React.createElement("div", { className: "val" }, dosage.display_reps), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, dosage.isStatic ? dosage.repsLbl || "\u5F3A\u5EA6" : "\u6B21\u6570")), dosage.display_rpe && dosage.display_rpe !== "\u2014" && /* @__PURE__ */ React.createElement("div", { className: "stat-pill", style: { background: "var(--ok-soft)", borderColor: "transparent" } }, /* @__PURE__ */ React.createElement("div", { className: "val", style: { color: "var(--ok)" } }, dosage.display_rpe), /* @__PURE__ */ React.createElement("div", { className: "lbl", style: { color: "var(--ok)", opacity: 0.75 } }, "RPE"))))
    );
  }
  function ExerciseModal({ exercise, goalId, expId, closing, onClose }) {
    const handleOverlay = (e) => {
      if (e.target.classList.contains("modal-overlay")) onClose();
    };
    const isStretch = exercise.type === "stretch_block" || exercise.type === "stretch";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `modal-overlay ${closing ? "closing" : ""}`,
        onClick: handleOverlay,
        role: "dialog",
        "aria-modal": "true"
      },
      /* @__PURE__ */ React.createElement("div", { className: `modal ${closing ? "modal-closing" : ""} ${isStretch ? "stretch-modal" : ""}` }, /* @__PURE__ */ React.createElement(ModalHead, { exercise, onClose }), isStretch ? /* @__PURE__ */ React.createElement(StretchModalBody, { exercise }) : /* @__PURE__ */ React.createElement(ExerciseModalBody, { exercise, goalId, expId }))
    );
  }
  function ModalHead({ exercise, onClose }) {
    let tag = "\u52A8\u4F5C";
    if (exercise.type === "warmup") tag = "\u70ED\u8EAB";
    else if (exercise.type === "cardio") tag = "\u6709\u6C27";
    else if (exercise.type === "main") tag = "\u4E3B\u9879";
    const eq = exercise.primary_equipment_id ? EQUIP_MAP[exercise.primary_equipment_id] : null;
    return /* @__PURE__ */ React.createElement("div", { className: "modal-head" }, /* @__PURE__ */ React.createElement("button", { className: "modal-close", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement(I.Close, { size: 13 })), /* @__PURE__ */ React.createElement("div", { className: "modal-tag" }, tag), /* @__PURE__ */ React.createElement("h2", null, exercise.name), eq && /* @__PURE__ */ React.createElement("div", { className: "modal-sub" }, "\u5668\u68B0\uFF1A", eq.name, " \xB7 ", eq.category, exercise.movement_class && /* @__PURE__ */ React.createElement("span", null, " \xB7 ", MOVEMENT_CLASS_NAMES[exercise.movement_class] || "")), (exercise.type === "stretch_block" || exercise.type === "stretch") && /* @__PURE__ */ React.createElement("div", { className: "modal-sub" }, exercise.duration, " \xB7 ", exercise.poses?.length || 0, " \u4E2A\u52A8\u4F5C\uFF0C\u5168\u90E8\u5B8C\u6210"));
  }
  function ExerciseModalBody({ exercise, goalId, expId }) {
    const [subIdx, setSubIdx] = useState(-1);
    const [expandedSections, setExpandedSections] = useState({ stats: true, phases: true, cue: true, points: true, stop: true, equipment: true, freeWeight: true });
    const GIF_DIFF_NOTES = {
      "0233": "GIF 展示的是标准绳索面拉，使用高位滑轮。您选择的器械为五人站/绳索塔，动作轨迹基本一致。",
      "1301": "GIF 展示的是标准塔式推胸。替代方案要求调低座椅角度，重点刺激胸肌下沿，推起时轨迹略向下倾斜。",
      "0818": "GIF 展示的是宽握高位下拉。替代方案要求窄握，下拉时肘部更贴近身体，重点刺激背阔肌下部。",
      "2135": "GIF 展示的是标准平板支撑。替代方案要求保持 30-60 秒等长收缩，注意臀部不要塌陷或翘起。",
      "0201": "GIF 展示的是绳索三头下压。替代方案使用臂下压背肌训练器，动作轨迹为向下向后拉，重点在背阔肌而非肱三头肌。"
    };
    const subs = exercise.substitutes || [];
    const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    const CollapsibleSection = ({ title, sectionKey, children }) => {
      const isOpen = expandedSections[sectionKey] !== false;
      return React.createElement("div", { className: "collapsible-section" },
        React.createElement("button", {
          className: `collapsible-header ${isOpen ? "open" : ""}`,
          onClick: () => toggleSection(sectionKey)
        },
          React.createElement("span", { className: "collapsible-icon" }, isOpen ? "\u25BC" : "\u25B6"),
          title
        ),
        React.createElement("div", { className: `collapsible-body ${isOpen ? "open" : ""}` }, children)
      );
    };
    let currentCue = exercise.feel_cue;
    let currentKeyPoints = exercise.key_points;
    let currentStop = exercise.stop;
    let currentCommonErrors = null;
    let currentGif = exercise.demo_gif;
    let currentGifMatch = exercise.demo_gif_match;
    let currentPhases = exercise.phases;
    let currentBenefit = exercise.benefit;
    let currentSubName = null;
    const movementClass = exercise.movement_class;
    if (subIdx >= 0 && subs[subIdx]) {
      const s = subs[subIdx];
      currentCue = s.feel_cue || s.cue;
      currentKeyPoints = s.key_points;
      currentStop = s.stop;
      currentGif = s.demo_gif;
      currentGifMatch = s.demo_gif_match;
      currentPhases = s.phases || exercise.phases;
      currentSubName = s.name;
      currentBenefit = s.cue || exercise.benefit;
      currentCommonErrors = s.common_errors;
    }
    const activeSub = subIdx >= 0 ? subs[subIdx] : null;
    const cur = activeSub || exercise;
    const isFree = !!cur.free_weight;
    let actualEqId = null;
    if (!isFree) {
      const cand = activeSub ? activeSub.primary_equipment_id || activeSub.id : exercise.primary_equipment_id;
      if (EQUIP_MAP[cand]) actualEqId = cand;
    }
    const kind = cur.equipment_kind;
    const KIND_LABEL = { band: "\u5F39\u529B\u5E26", bodyweight: "\u5F92\u624B", wheel: "\u5DE5\u5177", barbell: "\u81EA\u7531", dumbbell: "\u81EA\u7531" };
    const kindLabel = KIND_LABEL[kind] || "\u81EA\u7531";
    const equipImg = isFree ? `assets/free-weight/${kind}.svg` : eqImgPath(actualEqId);
    const gifSrc = gifPath(currentGif);
    const eqName = isFree ? cur.equipment_name || cur.name : EQUIP_MAP[actualEqId]?.name || cur.name;
    const eqInfo = isFree ? null : EQUIP_MAP[actualEqId];
    const keyPointsArr = splitPoints(currentKeyPoints);
    const phases = currentPhases;
    const mediaSingle = exercise.type === "warmup" && isFree;
    const dosage = useMemo(() => {
      if (cur.dosage && exercise.type !== "main") return getStaticDosage(cur);
      if (movementClass) {
        const d = computeDosage(movementClass, goalId, expId);
        if (d) return d;
      }
      return null;
    }, [cur, movementClass, goalId, expId, exercise.type]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, subs.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "sub-selector" }, /* @__PURE__ */ React.createElement("div", { className: "sub-selector-label" }, exercise.type === "warmup" ? "\u70ED\u8EAB\u52A8\u4F5C\u9009\u62E9\uFF08\u70B9\u51FB\u5207\u6362\u52A8\u4F5C GIF \u4E0E\u8981\u9886\uFF0C\u9996\u4E2A\u4E3A\u63A8\u8350\u4E3B\u52A8\u4F5C\uFF09" : "\u5668\u68B0\u9009\u62E9\uFF08\u70B9\u51FB\u5207\u6362\u5668\u68B0\u56FE\u3001\u52A8\u4F5C GIF \u4E0E\u8981\u9886\uFF09"), /* @__PURE__ */ React.createElement("div", { className: "sub-btns" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `sub-btn ${subIdx === -1 ? "active" : ""}`,
        onClick: () => setSubIdx(-1)
      },
      /* @__PURE__ */ React.createElement("span", { className: "sub-dot" }),
      /* @__PURE__ */ React.createElement("span", null, exercise.equipment_name || EQUIP_MAP[exercise.primary_equipment_id]?.name || "\u4E3B\u52A8\u4F5C", "\uFF08\u4E3B\uFF09")
    ), subs.map((s, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        className: `sub-btn ${subIdx === i ? "active" : ""} ${s.free_weight ? "is-free" : ""}`,
        onClick: () => setSubIdx(i)
      },
      /* @__PURE__ */ React.createElement("span", { className: "sub-dot" }),
      s.free_weight && /* @__PURE__ */ React.createElement("span", { className: "free-tag" }, KIND_LABEL[s.equipment_kind] || "\u81EA\u7531"),
      /* @__PURE__ */ React.createElement("span", null, s.name)
    )))), /* @__PURE__ */ React.createElement("div", { className: `modal-media${mediaSingle ? " single" : ""}` }, !mediaSingle && /* @__PURE__ */ React.createElement("div", { className: "media-panel eq-panel" }, /* @__PURE__ */ React.createElement("div", { className: "media-inner" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: equipImg,
        alt: `${eqName} \u5668\u68B0\u56FE`,
        loading: "lazy",
        onError: (e) => {
          const fb = e.target.parentElement.querySelector(".img-fallback");
          if (fb) fb.style.display = "flex";
          e.target.style.display = "none";
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "img-fallback" }, "\u6682\u65E0\u5668\u68B0\u56FE")), /* @__PURE__ */ React.createElement("div", { className: "media-label" }, /* @__PURE__ */ React.createElement("span", { className: "ml-icon" }, "\u{1F3CB}\uFE0F"), isFree ? "\u52A8\u4F5C\u7C7B\u522B\u793A\u610F" : "\u5668\u68B0\u5916\u89C2")), /* @__PURE__ */ React.createElement("div", { className: "media-panel gif-panel" }, /* @__PURE__ */ React.createElement("div", { className: "media-inner" }, gifSrc ? /* @__PURE__ */ React.createElement(
      "img",
      {
        src: gifSrc,
        alt: `${exercise.name} \u52A8\u4F5C\u793A\u8303`,
        loading: "lazy",
        onError: (e) => {
          const fb = e.target.parentElement.querySelector(".img-fallback");
          if (fb) fb.style.display = "flex";
          e.target.style.display = "none";
        }
      }
    ) : /* @__PURE__ */ React.createElement("div", { className: "no-gif-placeholder" }, /* @__PURE__ */ React.createElement(I.Info, { size: 20 }), /* @__PURE__ */ React.createElement("span", null, "\u6682\u65E0\u52A8\u4F5C GIF")), /* @__PURE__ */ React.createElement("div", { className: "img-fallback" }, /* @__PURE__ */ React.createElement(I.Info, { size: 18 }), "GIF \u52A0\u8F7D\u5931\u8D25")), /* @__PURE__ */ React.createElement("div", { className: "media-label" }, /* @__PURE__ */ React.createElement(I.Play, { size: 10 }), "\u52A8\u4F5C\u793A\u8303", mediaSingle && isFree && /* @__PURE__ */ React.createElement("span", { className: "gif-match-mini exact" }, kindLabel === eqName ? eqName : `${kindLabel} \xB7 ${eqName}`), currentGifMatch && /* @__PURE__ */ React.createElement("span", { className: `gif-match-mini ${currentGifMatch === "exact" ? "exact" : "close"}` }, currentGifMatch === "exact" ? "\u7CBE\u786E\u5339\u914D" : "\u8FD1\u4F3C\u793A\u610F")))), currentGifMatch === "close" && currentGif && /* @__PURE__ */ React.createElement("div", { className: "gif-diff-note" }, /* @__PURE__ */ React.createElement("strong", null, "\u8FD1\u4F3C GIF \u8BF4\u660E\uFF1A"), GIF_DIFF_NOTES[currentGif.split("/").pop().replace(".gif", "")] || "\u6B64\u6F14\u793A GIF \u4E0E\u60A8\u9009\u62E9\u7684\u5668\u68B0/\u89D2\u5EA6\u53EF\u80FD\u7565\u6709\u5DEE\u5F02\uFF0C\u8BF7\u4EE5\u6587\u5B57\u8981\u9886\u4E3A\u51C6\u3002"), /* @__PURE__ */ React.createElement("div", { className: "modal-body" }, eqInfo && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "\u5668\u68B0\u4FE1\u606F"), /* @__PURE__ */ React.createElement("div", { className: "eq-info" }, /* @__PURE__ */ React.createElement("strong", null, eqInfo.name), " \xB7 ", eqInfo.appearance, eqInfo.two_function_note && /* @__PURE__ */ React.createElement("div", { className: "two-func-note" }, "\u26A1 \u53CC\u529F\u80FD\u5668\u68B0\uFF1A", eqInfo.two_function_note))), currentBenefit && /* @__PURE__ */ React.createElement("div", { className: "benefit-box" }, /* @__PURE__ */ React.createElement("strong", null, "\u76EE\u6807\u6548\u76CA\uFF1A"), currentBenefit), dosage && /* @__PURE__ */ React.createElement("div", { className: "modal-stats compact" }, /* @__PURE__ */ React.createElement("div", { className: "modal-stat" }, /* @__PURE__ */ React.createElement("div", { className: "v" }, dosage.display_sets), /* @__PURE__ */ React.createElement("div", { className: "l" }, dosage.isStatic ? dosage.setsLbl || "\u65F6\u957F" : "\u7EC4\u6570")), dosage.display_reps && /* @__PURE__ */ React.createElement("div", { className: "modal-stat" }, /* @__PURE__ */ React.createElement("div", { className: "v" }, dosage.display_reps), /* @__PURE__ */ React.createElement("div", { className: "l" }, dosage.isStatic ? dosage.repsLbl || "\u5F3A\u5EA6" : "\u6B21\u6570")), dosage.display_rpe && /* @__PURE__ */ React.createElement("div", { className: "modal-stat rpe" }, /* @__PURE__ */ React.createElement("div", { className: "v" }, dosage.display_rpe), /* @__PURE__ */ React.createElement("div", { className: "l" }, "RPE"), /* @__PURE__ */ React.createElement(RPEScale, { value: dosage.display_rpe })), dosage.display_rest && /* @__PURE__ */ React.createElement("div", { className: "modal-stat" }, /* @__PURE__ */ React.createElement("div", { className: "v" }, dosage.display_rest), /* @__PURE__ */ React.createElement("div", { className: "l" }, "\u7EC4\u95F4\u4F11\u606F")), dosage.isStatic && /* @__PURE__ */ React.createElement("div", { className: "modal-stat" }, /* @__PURE__ */ React.createElement("div", { className: "v" }, "\u2014"), /* @__PURE__ */ React.createElement("div", { className: "l" }, "\u4F11\u606F"))), phases && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "\u52A8\u4F5C\u4E94\u6BB5\u5206\u89E3"), /* @__PURE__ */ React.createElement("ul", { className: "phases-list" }, ["setup", "concentric", "peak", "eccentric", "return"].map((phase, i) => phases[phase] && /* @__PURE__ */ React.createElement("li", { key: phase, className: `phase-item ${phase}` }, /* @__PURE__ */ React.createElement("span", { className: "phase-name" }, PHASE_NAMES[phase], "\uFF1A"), phases[phase])))), currentCue && /* @__PURE__ */ React.createElement("div", { className: "cue-box" }, /* @__PURE__ */ React.createElement("strong", null, "\u52A8\u4F5C\u611F\u89C9\uFF1A"), currentCue), keyPointsArr.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, subIdx >= 0 ? `\u66FF\u4EE3\u5668\u68B0 \xB7 ${currentSubName || ""}\u52A8\u4F5C\u8981\u9886` : "\u52A8\u4F5C\u8981\u9886"), /* @__PURE__ */ React.createElement("ul", { className: "points-list" }, keyPointsArr.map((p, i) => /* @__PURE__ */ React.createElement("li", { key: i }, p)))), currentStop && currentStop !== "\u2014" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "\u505C\u6B62\u4FE1\u53F7"), /* @__PURE__ */ React.createElement("div", { className: "stop-box" }, /* @__PURE__ */ React.createElement("strong", null, "\u6CE8\u610F\uFF1A"), currentStop)), currentCommonErrors && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "常见错误"), /* @__PURE__ */ React.createElement("div", { className: "stop-box common-errors-box" }, /* @__PURE__ */ React.createElement("strong", null, "注意："), currentCommonErrors)), isFree && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, kind === "band" || kind === "bodyweight" || kind === "wheel" ? "\u505A\u6CD5\u4E0E\u8981\u70B9" : "\u81EA\u7531\u5668\u68B0\u505A\u6CD5"), /* @__PURE__ */ React.createElement("div", { className: "eq-info" }, /* @__PURE__ */ React.createElement("strong", null, eqName), " \xB7 ", kind === "band" ? "\u5F39\u529B\u5E26/\u5C0F\u5DE5\u5177\u52A8\u4F5C\uFF0C\u5168\u7A0B\u4FDD\u6301\u5F20\u529B\u3001\u6162\u800C\u53EF\u63A7\uFF0C\u4F5C\u4E3A\u70ED\u8EAB\u6FC0\u6D3B\u4E0D\u8FFD\u6C42\u529B\u7AED\u3002" : kind === "bodyweight" ? "\u81EA\u91CD\u52A8\u4F5C\uFF0C\u6CE8\u610F\u8EAF\u5E72\u7A33\u5B9A\u4E0E\u547C\u5438\u8282\u594F\uFF0C\u5E45\u5EA6\u5728\u53EF\u63A7\u3001\u65E0\u75DB\u8303\u56F4\u5185\u5FAA\u5E8F\u6E10\u8FDB\u3002" : kind === "wheel" ? "\u6838\u5FC3\u4E0E\u80A9\u80DB\u534F\u540C\u7684\u5DE5\u5177\u52A8\u4F5C\uFF0C\u5148\u6C42\u7A33\u5B9A\u518D\u6C42\u5E45\u5EA6\uFF0C\u5B81\u5C0F\u52FF\u584C\u8170\u3002" : "\u975E\u56FA\u5B9A\u8F68\u8FF9\u7684\u81EA\u7531\u91CD\u91CF\u52A8\u4F5C\uFF0C\u9700\u8981\u81EA\u5DF1\u7A33\u5B9A\u8EAF\u5E72\u4E0E\u5173\u8282\u8F68\u8FF9\uFF1B\u8BF7\u5148\u7528\u53EF\u63A7\u91CD\u91CF\u5B66\u52A8\u4F5C\uFF0C\u5367\u63A8\u3001\u63A8\u4E3E\u3001\u786C\u62C9\u7B49\u5EFA\u8BAE\u5728\u4FDD\u62A4\u67B6\u6216\u4ED6\u4EBA\u4FDD\u62A4\u4E0B\u8FDB\u884C\u3002", /* @__PURE__ */ React.createElement("div", { className: "two-func-note" }, "\u26A1 ", kind === "band" || kind === "bodyweight" || kind === "wheel" ? `\u8FD9\u662F\u300C${exercise.name}\u300D\u5F53\u524D\u9009\u4E2D\u7684\u70ED\u8EAB\u505A\u6CD5\uFF0C\u6309\u4E0A\u65B9\u5242\u91CF\u5B8C\u6210\u5373\u53EF\u3002` : `\u6B21\u9009\u66FF\u4EE3\uFF1A\u8FD9\u662F\u300C${exercise.name}\u300D\u7684\u81EA\u7531\u91CD\u91CF\u7248\u672C\uFF0C\u8D1F\u8377\u4F1A\u6839\u636E\u4F60\u9009\u7684\u8BAD\u7EC3\u76EE\u6807\u548C\u7ECF\u9A8C\u81EA\u52A8\u5339\u914D\u3002`)), currentCommonErrors && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "\u5E38\u89C1\u9519\u8BEF"), /* @__PURE__ */ React.createElement("div", { className: "stop-box common-errors-box" }, /* @__PURE__ */ React.createElement("strong", null, "\u6CE8\u610F\uFF1A"), currentCommonErrors)),)));
  }
  function StretchModalBody({ exercise }) {
    const poses = exercise.poses || [];
    const hasAnyGif = poses.some((p) => STRETCH_LIB[p]?.demo_gif);
    const hasAnySvg = poses.some((p) => STRETCH_LIB[p]?.demo_svg);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "benefit-box", style: { margin: "12px 20px 0" } }, /* @__PURE__ */ React.createElement("strong", null, "\u76EE\u6807\u6548\u76CA\uFF1A"), exercise.benefit), /* @__PURE__ */ React.createElement("div", { className: "stretch-logic" }, /* @__PURE__ */ React.createElement("strong", null, "\u52A8\u4F5C\u987A\u5E8F\uFF1A"), exercise.pose_logic), /* @__PURE__ */ React.createElement("div", { className: "stretch-poses-full" }, poses.map((poseId, i) => {
      const s = STRETCH_LIB[poseId];
      if (!s) return null;
      const gif = gifPath(s.demo_gif);
      const svg = stretchSvgPath(poseId);
      const match = s.demo_gif_match;
      const hasVisual = gif || svg;
      return /* @__PURE__ */ React.createElement("div", { className: `stretch-pose-card ${hasVisual ? "" : "noimg"}`, key: poseId }, /* @__PURE__ */ React.createElement("span", { className: "pose-order" }, i + 1), hasVisual && /* @__PURE__ */ React.createElement("div", { className: `pose-visual-wrap ${svg ? "svg-wrap" : "gif-wrap"}` }, gif && /* @__PURE__ */ React.createElement(
        "img",
        {
          "data-src": gif,
          alt: s.name,
          className: "pose-visual unified-stretch",
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ), svg && !gif && /* @__PURE__ */ React.createElement(
        "img",
        {
          src: svg,
          alt: s.name,
          className: "pose-visual pose-svg",
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ), svg && !gif && /* @__PURE__ */ React.createElement("span", { className: "pose-visual-label" }, "\u59FF\u52BF\u793A\u610F")), /* @__PURE__ */ React.createElement("div", { className: "pose-body" }, /* @__PURE__ */ React.createElement("div", { className: "pose-head" }, /* @__PURE__ */ React.createElement("span", { className: "pose-name" }, s.name), /* @__PURE__ */ React.createElement("span", { className: "pose-dur" }, s.duration), gif && /* @__PURE__ */ React.createElement("span", { className: `gif-match-mini ${match === "exact" ? "exact" : "close"}` }, /* @__PURE__ */ React.createElement(I.Play, { size: 8 }), match === "exact" ? "\u7CBE\u786E GIF" : "\u8FD1\u4F3C GIF"), svg && !gif && /* @__PURE__ */ React.createElement("span", { className: "svg-match-mini" }, "\u624B\u7ED8\u793A\u610F")), /* @__PURE__ */ React.createElement("div", { className: "pose-cue" }, "\u7275\u62C9\u611F\uFF1A", s.feel_cue), /* @__PURE__ */ React.createElement("div", { className: "pose-points" }, s.key_points), /* @__PURE__ */ React.createElement("div", { className: "pose-stop" }, "\u505C\u6B62\u4FE1\u53F7\uFF1A", s.stop)));
    })), hasAnySvg && /* @__PURE__ */ React.createElement("div", { className: "gif-source-note stretch-src" }, /* @__PURE__ */ React.createElement(I.Info, { size: 10 }), "\u6807\u6CE8\u300C\u624B\u7ED8\u793A\u610F\u300D\u8005\u4E3A\u672C\u9875\u81EA\u7ED8\u793A\u610F\u56FE\uFF08\u975E\u7167\u7247\u7EA7\u793A\u8303\uFF09\uFF0C\u52A8\u4F5C\u4EE5\u6587\u5B57\u8981\u9886\u4E3A\u51C6\uFF1B\u52A8\u4F5C GIF \u6765\u6E90\u7EDF\u4E00\u89C1\u9875\u811A\u3002"), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 20px 20px" } }, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "\u63D0\u793A"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "12px", color: "var(--ink-3)", margin: 0, lineHeight: 1.7 } }, "\u6BCF\u4E2A\u62C9\u4F38\u52A8\u4F5C\u4FDD\u6301\u5747\u5300\u547C\u5438\uFF0C\u4E0D\u8981\u618B\u6C14\uFF1B\u7275\u62C9\u611F\u5230\u8212\u9002\u9178\u80C0\u5373\u53EF\uFF0C\u4E0D\u8FFD\u6C42\u75DB\u611F\u3002 \u6240\u6709\u52A8\u4F5C\u5747\u4E3A\u81EA\u91CD\uFF0C\u4E0D\u9700\u8981\u5668\u68B0\u3002")));
  }
  function DosageFramework({ goalId, expId }) {
    const goal = GOALS.find((g) => g.id === goalId);
    const exp = EXPERIENCES.find((e) => e.id === expId);
    const table = goal?.ranges || {};
    function formatSets(setsStr) {
      if (!setsStr) return "\u2014";
      const [low, high] = parseRange(setsStr);
      const newLow = Math.max(1, Math.round(low * exp.multiplier_sets));
      const newHigh = Math.max(newLow, Math.round(high * exp.multiplier_sets));
      return newLow === newHigh ? `${newLow} \u7EC4` : `${newLow}-${newHigh} \u7EC4`;
    }
    function formatRest(secs) {
      if (secs === void 0 || secs === null) return "\u2014";
      if (secs >= 60) {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return s === 0 ? `${mins} \u5206\u949F` : `${mins} \u5206 ${s} \u79D2`;
      }
      return `${secs} \u79D2`;
    }
    const compoundRow = table.compound_push;
    const isoRow = table.isolation_arm;
    const cardioRow = table.cardio;
    return /* @__PURE__ */ React.createElement("div", { className: "dosage-section" }, /* @__PURE__ */ React.createElement("div", { className: "dosage-head" }, /* @__PURE__ */ React.createElement("h3", null, "\u4F60\u7684\u8BAD\u7EC3\u5242\u91CF"), /* @__PURE__ */ React.createElement("p", null, "\u5F53\u524D\u4E3A ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--accent-deep)" } }, "\u300C", goal?.name, "\u300D\xD7\u300C", exp?.name, "\u300D"), " \u7EC4\u5408\u3002 \u6240\u6709\u52A8\u4F5C\u6309\u300C\u52A8\u4F5C\u5206\u7C7B\u300D\uFF08\u590D\u5408\u63A8 / \u62C9 / \u4E0B\u80A2 / \u8FC7\u5934\u63A8\uFF0C\u4EE5\u53CA\u80F8 / \u80A9 / \u81C2 / \u817F / \u6838\u5FC3\u7684\u5355\u5173\u8282\u52A8\u4F5C\uFF09\uFF0C\u7ECF\u9A8C\u7CFB\u6570\u81EA\u52A8\u8C03\u6574\u7EC4\u6570\u4E0E RPE \u4E0A\u9650\u3002")), /* @__PURE__ */ React.createElement("div", { className: "dosage-table" }, /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u7ECF\u9A8C\u8C03\u6574"), /* @__PURE__ */ React.createElement("div", { className: "dt-val" }, "\u7EC4\u6570 \xD7 ", /* @__PURE__ */ React.createElement("strong", null, exp?.multiplier_sets), "\uFF0CRPE \u2264 ", /* @__PURE__ */ React.createElement("strong", null, exp?.rpe_cap), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--ink-3)" } }, exp?.note))), /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u591A\u5173\u8282\u52A8\u4F5C"), /* @__PURE__ */ React.createElement("div", { className: "dt-val" }, "\u590D\u5408\u63A8/\u62C9/\u4E0B\u80A2/\u8FC7\u5934\u63A8\uFF1A", /* @__PURE__ */ React.createElement("strong", null, formatSets(compoundRow?.sets)), " \xD7 ", /* @__PURE__ */ React.createElement("strong", null, compoundRow?.reps, " \u6B21"), "\xB7 RPE ", /* @__PURE__ */ React.createElement("strong", null, Math.min(compoundRow?.rpe ?? 0, exp?.rpe_cap ?? 99)), " \xB7 \u4F11\u606F ", /* @__PURE__ */ React.createElement("strong", null, formatRest(compoundRow?.rest)))), /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u5355\u5173\u8282\u52A8\u4F5C"), /* @__PURE__ */ React.createElement("div", { className: "dt-val" }, /* @__PURE__ */ React.createElement("strong", null, formatSets(isoRow?.sets)), " \xD7 ", /* @__PURE__ */ React.createElement("strong", null, isoRow?.reps, " \u6B21"), "\xB7 RPE ", /* @__PURE__ */ React.createElement("strong", null, Math.min(isoRow?.rpe ?? 0, exp?.rpe_cap ?? 99)), " \xB7 \u4F11\u606F ", /* @__PURE__ */ React.createElement("strong", null, formatRest(isoRow?.rest)), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--ink-3)" } }, "\u80F8/\u80A9/\u81C2/\u817F/\u6838\u5FC3\u7684\u5355\u5173\u8282\u52A8\u4F5C\u6B21\u6570\u8303\u56F4\u7565\u6709\u5DEE\u5F02\uFF08\u6838\u5FC3 12-30 \u6B21\uFF0C\u80A9 12-20 \u6B21\uFF09\uFF0C\u5361\u7247\u4E0E\u5F39\u7A97\u6309\u5404\u52A8\u4F5C\u5206\u7C7B\u7CBE\u786E\u663E\u793A\u3002"))), cardioRow && /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u6709\u6C27"), /* @__PURE__ */ React.createElement("div", { className: "dt-val" }, /* @__PURE__ */ React.createElement("strong", null, cardioRow.duration_min, " \u5206\u949F"), " \xB7 RPE ", /* @__PURE__ */ React.createElement("strong", null, cardioRow.rpe), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--ink-3)" } }, "\u70ED\u8EAB\u4EE5\u9488\u5BF9\u6027\u6FC0\u6D3B\u4E3A\u4E3B\uFF081-2 \u7EC4\uFF09\uFF0C\u53EF\u518D\u505A 5 \u5206\u949F\u6709\u6C27\u5347\u6E29\uFF1B\u8BAD\u7EC3\u65E5\u6709\u6C27\u65F6\u95F4\u968F\u76EE\u6807\u81EA\u52A8\u8C03\u6574\u3002"))), /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u672F\u8BED\u901F\u67E5"), /* @__PURE__ */ React.createElement("div", { className: "dt-val", style: { fontSize: 12, color: "var(--ink-3)", lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("span", { title: "Rating of Perceived Exertion\uFF0C\u4E3B\u89C2\u7528\u529B\u7A0B\u5EA6\u8BC4\u5206\uFF0C1=\u6781\u8F7B\u677E\uFF0C10=\u6781\u9650\u529B\u7AED" }, "RPE"), " \xB7 ", /* @__PURE__ */ React.createElement("span", { title: "\u529B\u7AED\u524D\u4E3B\u52A8\u964D\u4F4E\u91CD\u91CF\u7EE7\u7EED\u5B8C\u6210\u989D\u5916\u6B21\u6570\uFF0C\u7528\u4E8E\u7A81\u7834\u5E73\u53F0\u671F" }, "\u8BA9\u9000\u7EC4"), " \xB7 ", /* @__PURE__ */ React.createElement("span", { title: "\u5C4F\u6C14\u589E\u52A0\u8179\u538B\u4EE5\u7A33\u5B9A\u810A\u67F1\uFF0C\u5927\u91CD\u91CF\u65F6\u81EA\u7136\u53D1\u751F\uFF0C\u9AD8\u8840\u538B\u60A3\u8005\u907F\u514D\u523B\u610F\u4F7F\u7528" }, "Valsalva"), " \xB7 ", /* @__PURE__ */ React.createElement("span", { title: "\u808C\u8089\u7F29\u77ED\u53D1\u529B\u7684\u9636\u6BB5\uFF0C\u5982\u63A8\u8D77\u3001\u62C9\u8D77" }, "\u5411\u5FC3"), " \xB7 ", /* @__PURE__ */ React.createElement("span", { title: "\u808C\u8089\u88AB\u62C9\u957F\u7684\u9636\u6BB5\uFF0C\u5982\u653E\u4E0B\u3001\u56DE\u653E" }, "\u79BB\u5FC3"))), /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u5982\u4F55\u9009\u8D77\u59CB\u91CD\u91CF"), /* @__PURE__ */ React.createElement("div", { className: "dt-val" }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-3)" } }, "\u65B0\u624B\u4ECE\u8F7B\u91CF\u5F00\u59CB\uFF0C\u5148\u5B66\u4E60\u52A8\u4F5C\u8F68\u8FF9\uFF1B\u80FD\u6807\u51C6\u5B8C\u6210\u76EE\u6807\u6B21\u6570\u7684\u6700\u5927\u91CD\u91CF\uFF0C\u7B2C\u4E00\u7EC4\u7528\u7EA670%\u63A2\u8DEF\u3002\u5982\u679C\u6307\u5B9A\u6B21\u6570\u8303\u56F4\u5185\u8FD8\u80FD\u505A2-3\u6B21\u4EE5\u4E0A\uFF0C\u4E0B\u6B21\u52A0\u91CD\u3002"))), /* @__PURE__ */ React.createElement("div", { className: "dt-row" }, /* @__PURE__ */ React.createElement("div", { className: "dt-label" }, "\u8FDB\u9636\u6CD5\u5219"), /* @__PURE__ */ React.createElement("div", { className: "dt-val" }, DATA.dosage_framework?.progression?.progress, /* @__PURE__ */ React.createElement("br", null), DATA.dosage_framework?.progression?.stalled, /* @__PURE__ */ React.createElement("br", null), DATA.dosage_framework?.progression?.deload))));
  }
  function PrinciplesSection() {
    return /* @__PURE__ */ React.createElement("div", { className: "principles-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u901A\u7528\u539F\u5219"), /* @__PURE__ */ React.createElement("div", { className: "rules-grid" }, COMMON_PRINCIPLES.map((p, i) => {
      const Icon = PRINCIPLE_ICKS[i % PRINCIPLE_ICKS.length];
      return /* @__PURE__ */ React.createElement("div", { className: "rule-item", key: i }, /* @__PURE__ */ React.createElement("div", { className: "rule-icon" }, /* @__PURE__ */ React.createElement(Icon, { size: 12 })), /* @__PURE__ */ React.createElement("div", { className: "rule-text" }, /* @__PURE__ */ React.createElement("h4", null, p.title), /* @__PURE__ */ React.createElement("p", null, p.text)));
    })));
  }
  function RiskAndSourceSection() {
    return /* @__PURE__ */ React.createElement("div", { className: "risk-section" }, /* @__PURE__ */ React.createElement("div", { className: "risk-head" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement(I.Shield, { size: 16 }), "\u5B89\u5168\u63D0\u793A"), /* @__PURE__ */ React.createElement("p", null, "\u672C\u9875\u4E3A\u901A\u7528\u8BAD\u7EC3\u8D77\u70B9\uFF0C\u52A8\u4F5C\u4E0E\u8D1F\u8377\u8BF7\u7ED3\u5408\u81EA\u8EAB\u60C5\u51B5\u4E0E\u73B0\u573A\u73AF\u5883\u8C03\u6574\uFF1B\u51FA\u73B0\u5173\u8282\u9510\u75DB\u3001\u5934\u6655\u3001\u80F8\u95F7\u8BF7\u7ACB\u5373\u505C\u6B62\uFF0C\u65E7\u4F24\u6216\u75BE\u75C5\u8BF7\u5148\u54A8\u8BE2\u533B\u751F\u6216\u7269\u7406\u6CBB\u7597\u5E08\u3002")), /* @__PURE__ */ React.createElement("div", { className: "footer-source" }, /* @__PURE__ */ React.createElement("p", null, "\u52A8\u4F5C\u793A\u8303 GIF \u6765\u81EA fitness.xingshuwen.com\uFF08\u6570\u636E\u96C6 \xA9 Gym Visual\uFF09\uFF0C\u4EC5\u4F9B\u52A8\u4F5C\u6A21\u5F0F\u53C2\u8003\u3002\u5668\u68B0\u5916\u89C2\u53EF\u80FD\u56E0\u578B\u53F7\u4E0D\u540C\u800C\u6709\u5DEE\u5F02\u3002"), /* @__PURE__ */ React.createElement("p", { className: "last-updated" }, "\u6700\u540E\u66F4\u65B0\uFF1A", DATA.last_updated || "2026-09-03")));
  }
  
  // === v2.3 new components ===

  function SearchBar({ query, setQuery, results, onSelect }) {
    return /* @__PURE__ */ React.createElement("div", { className: "search-bar" },
      /* @__PURE__ */ React.createElement("div", { className: "search-input-wrap" },
        /* @__PURE__ */ React.createElement("span", { className: "search-icon" }, "\u{1F50D}"),
        /* @__PURE__ */ React.createElement("input", {
          className: "search-input",
          type: "text",
          placeholder: "\u641C\u7D22\u52A8\u4F5C\u540D\u79F0 / \u808C\u7FA4 / \u5668\u68B0...",
          value: query,
          onChange: (e) => setQuery(e.target.value)
        }),
        query && /* @__PURE__ */ React.createElement("button", { className: "search-clear", onClick: () => setQuery("") }, "\u00D7")
      )
    );
  }

  function SearchResults({ results, onSelect }) {
    if (results.length === 0) return /* @__PURE__ */ React.createElement("div", { className: "search-results-info" }, "\u672A\u627E\u5230\u5339\u914D\u7ED3\u679C");
    return /* @__PURE__ */ React.createElement("div", { className: "exercise-list" },
      /* @__PURE__ */ React.createElement("div", { className: "search-results-info" }, `\u627E\u5230 ${results.length} \u4E2A\u7ED3\u679C`),
      results.map((ex, i) => /* @__PURE__ */ React.createElement("div", {
        key: ex.name + i,
        className: "ex-card",
        onClick: () => onSelect(ex)
      },
        /* @__PURE__ */ React.createElement("div", { className: "ex-num" }, ex.dayName ? ex.dayName.slice(0, 2) : ""),
        /* @__PURE__ */ React.createElement("div", { className: "ex-main" },
          /* @__PURE__ */ React.createElement("div", { className: "ex-name" },
            ex.name,
            ex.isSubstitute && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--ink-3)", marginLeft: 6 } }, "(\u66FF\u4EE3)"),
            /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--accent-deep)", marginLeft: 6 } }, ex.dayName)
          ),
          /* @__PURE__ */ React.createElement("div", { className: "ex-equipment" }, ex.movement_class ? (MOVEMENT_CLASS_NAMES[ex.movement_class] || ex.movement_class) : "")
        )
      ))
    );
  }

  function CollapsiblePrinciples({ open, onToggle }) {
    return /* @__PURE__ */ React.createElement("div", { className: "principles-section" },
      /* @__PURE__ */ React.createElement("button", { className: "principles-toggle", onClick: onToggle },
        /* @__PURE__ */ React.createElement("span", { className: "principles-toggle-icon" }, open ? "\u25BC" : "\u25B6"),
        "\u901A\u7528\u539F\u5219"
      ),
      /* @__PURE__ */ React.createElement("div", { className: `principles-body ${open ? "open" : ""}` },
        /* @__PURE__ */ React.createElement("div", { className: "rules-grid" }, COMMON_PRINCIPLES.map((p, i) => {
          const Icon = PRINCIPLE_ICKS[i % PRINCIPLE_ICKS.length];
          return /* @__PURE__ */ React.createElement("div", { className: "rule-item", key: p.title || i },
            /* @__PURE__ */ React.createElement("div", { className: "rule-icon" }, /* @__PURE__ */ React.createElement(Icon, { size: 12 })),
            /* @__PURE__ */ React.createElement("div", { className: "rule-text" },
              /* @__PURE__ */ React.createElement("h4", null, p.title),
              /* @__PURE__ */ React.createElement("p", null, p.text)
            )
          );
        }))
      )
    );
  }

  function RPEScale({ value }) {
    const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const descs = ["\u6781\u8F7B", "\u5F88\u8F7B", "\u8F7B", "\u8F7B\u5EA6", "\u4E2D\u7B49", "\u4E2D\u5EA6", "\u6709\u70B9\u91CD", "\u91CD", "\u5F88\u91CD", "\u6781\u9650"];
    const v = parseInt(value, 10) || 0;
    return /* @__PURE__ */ React.createElement("div", { className: "rpe-scale" },
      labels.map((l, i) => /* @__PURE__ */ React.createElement("div", {
        key: l,
        className: `rpe-bar ${i < v ? "filled" : ""} ${i === v - 1 ? "current" : ""}`
      }, /* @__PURE__ */ React.createElement("span", { className: "rpe-tooltip" }, `${l}: ${descs[i]}`))),
      /* @__PURE__ */ React.createElement("div", { className: "rpe-labels" }, /* @__PURE__ */ React.createElement("span", null, "1"), /* @__PURE__ */ React.createElement("span", null, "10"))
    );
  }

  function RecordModal({ onClose }) {
    const [records, setRecords] = useState(() => {
      try { return JSON.parse(localStorage.getItem("workout_records") || "[]"); } catch (e) { return []; }
    });
    const [newRecord, setNewRecord] = useState({ name: "", weight: "", sets: "", reps: "", rpe: "" });
    const addRecord = () => {
      if (!newRecord.name) return;
      const rec = { ...newRecord, date: new Date().toLocaleString("zh-CN"), id: Date.now() };
      const updated = [rec, ...records].slice(0, 200);
      setRecords(updated);
      localStorage.setItem("workout_records", JSON.stringify(updated));
      setNewRecord({ name: "", weight: "", sets: "", reps: "", rpe: "" });
    };
    const deleteRecord = (id) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      localStorage.setItem("workout_records", JSON.stringify(updated));
    };
    return /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", onClick: (e) => { if (e.target.classList.contains("modal-overlay")) onClose(); }, role: "dialog", "aria-modal": "true" },
      /* @__PURE__ */ React.createElement("div", { className: "modal" },
        /* @__PURE__ */ React.createElement("div", { className: "modal-head" },
          /* @__PURE__ */ React.createElement("button", { className: "modal-close", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ React.createElement(I.Close, { size: 13 })),
          /* @__PURE__ */ React.createElement("h2", null, "\u6211\u7684\u8BAD\u7EC3\u8BB0\u5F55")
        ),
        /* @__PURE__ */ React.createElement("div", { className: "modal-body record-modal-body" },
          /* @__PURE__ */ React.createElement("div", { className: "record-form" },
            /* @__PURE__ */ React.createElement("input", { placeholder: "\u52A8\u4F5C\u540D", value: newRecord.name, onChange: (e) => setNewRecord({ ...newRecord, name: e.target.value }) }),
            /* @__PURE__ */ React.createElement("input", { placeholder: "\u91CD\u91CF(kg)", value: newRecord.weight, onChange: (e) => setNewRecord({ ...newRecord, weight: e.target.value }) }),
            /* @__PURE__ */ React.createElement("input", { placeholder: "\u7EC4\u6570", value: newRecord.sets, onChange: (e) => setNewRecord({ ...newRecord, sets: e.target.value }) }),
            /* @__PURE__ */ React.createElement("input", { placeholder: "\u6B21\u6570", value: newRecord.reps, onChange: (e) => setNewRecord({ ...newRecord, reps: e.target.value }) }),
            /* @__PURE__ */ React.createElement("input", { placeholder: "RPE", value: newRecord.rpe, onChange: (e) => setNewRecord({ ...newRecord, rpe: e.target.value }) }),
            /* @__PURE__ */ React.createElement("button", { className: "record-btn", onClick: addRecord }, "\u6DFB\u52A0\u8BB0\u5F55")
          ),
          records.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { color: "var(--ink-3)", fontSize: 13, marginTop: 16 } }, "\u6682\u65E0\u8BB0\u5F55") :
          records.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "record-entry" },
            /* @__PURE__ */ React.createElement("div", { className: "record-entry-date" }, r.date),
            /* @__PURE__ */ React.createElement("div", null, `${r.name} \u00B7 ${r.weight}kg \u00B7 ${r.sets}\u7EC4 \u00B7 ${r.reps}\u6B21 \u00B7 RPE ${r.rpe}`),
            /* @__PURE__ */ React.createElement("button", { className: "sub-btn", style: { marginTop: 4 }, onClick: () => deleteRecord(r.id) }, "\u5220\u9664")
          ))
        )
      )
    );
  }
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
