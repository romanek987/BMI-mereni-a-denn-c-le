/**
 * FitPulse – BMI & Denní Cíle Tracker
 * Moderní klientská aplikace pro sledování zdraví, tělesné váhy a návyků.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Konstanty a Výchozí data
  // =========================================================================

  const STORAGE_KEY = 'fitpulse_app_data_v1';

  const DEFAULT_GOALS = [
    {
      id: 'g-water',
      title: 'Vypít alespoň 2 litry čisté vody',
      desc: 'Pravidelná hydratace během celého dne',
      category: 'nutrition',
      emoji: '💧',
      isDefault: true
    },
    {
      id: 'g-steps',
      title: '8 000 kroků nebo 30 min procházka',
      desc: 'Přirozený denní pohyb na čerstvém vzduchu',
      category: 'fitness',
      emoji: '🚶',
      isDefault: true
    },
    {
      id: 'g-veggies',
      title: 'Porce zeleniny nebo ovoce k jídlům',
      desc: 'Dostatek vlákniny, vitamínů a minerálů',
      category: 'nutrition',
      emoji: '🥗',
      isDefault: true
    },
    {
      id: 'g-workout',
      title: '20–30 minut cvičení / tréninku',
      desc: 'Posilování, jóga, běh nebo kardio',
      category: 'fitness',
      emoji: '🏃',
      isDefault: true
    },
    {
      id: 'g-sleep',
      title: '7–8 hodin kvalitního spánku',
      desc: 'Zhasnout obrazovky 30 min před spaním',
      category: 'mindset',
      emoji: '😴',
      isDefault: true
    },
    {
      id: 'g-stretch',
      title: '10 minut strečinku / relaxace',
      desc: 'Uvolnění svalů a zklidnění mysli',
      category: 'mindset',
      emoji: '🧘',
      isDefault: true
    }
  ];

  const BADGES_CONFIG = [
    { id: 'first_bmi', title: 'První krok', desc: 'Uloženo první měření BMI', icon: '📏' },
    { id: 'water_master', title: 'Hydratační šampion', desc: 'Vypito 2000 ml vody za jeden den', icon: '💧' },
    { id: 'perfect_day', title: 'Perfektní den', desc: 'Splněno 100 % všech denních cílů', icon: '🌟' },
    { id: 'streak_3', title: 'Třídenní vlna', desc: 'Udržena aktivní šňůra 3 dny v řadě', icon: '🔥' },
    { id: 'streak_7', title: 'Železná vůle', desc: 'Udržena šňůra 7 dní za sebou', icon: '🏆' },
    { id: 'custom_goal', title: 'Vlastní cesta', desc: 'Vytvořen nový osobní cíl', icon: '✨' },
    { id: 'healthy_bmi', title: 'V ideálním pásmu', desc: 'Dosažení normální váhy (BMI 18.5 - 24.9)', icon: '🎯' },
    { id: 'tracker_pro', title: 'Poctivý záznamník', desc: 'Uloženo alespoň 5 měření v historii', icon: '📈' }
  ];

  const DAILY_QUOTES = [
    { title: 'Tajemství úspěchu', text: 'Nemusíte být extrémní, stačí být konzistentní. Každý malý návyk se počítá.' },
    { title: 'Síla hydratace', text: 'Sklenice vlažné vody po probuzení nastartuje trávení a osvěží celé tělo.' },
    { title: 'Přirozený pohyb', text: 'Chůze je nejpřirozenější lék. Rychlá 20minutová procházka sníží stres o polovinu.' },
    { title: 'Kvalitní palivo', text: 'Jezte skutečné jídlo, ne polotovary. Vaše tělo je jediný domov, ve kterém musíte žít.' },
    { title: 'Trpělivost', text: 'Změna postavy a kondice je maraton, ne sprint. Důvěřujte procesu.' }
  ];

  // =========================================================================
  // 2. Stav Aplikace (State)
  // =========================================================================

  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getInitialState() {
    const today = getTodayKey();
    return {
      user: {
        gender: 'male',
        age: 28,
        height: 175,
        weight: 72,
        activity: 1.55
      },
      goals: [...DEFAULT_GOALS],
      dailyLogs: {
        [today]: {
          completedGoalIds: [],
          waterCount: 0
        }
      },
      history: [
        // Ukázkový záznam pro rychlý start
        {
          id: 'h-demo-1',
          date: new Date(Date.now() - 7 * 86400000).toISOString(),
          weight: 74.0,
          height: 175,
          bmi: 24.2,
          category: 'Normální váha',
          note: 'Začátek sledování kondice'
        },
        {
          id: 'h-demo-2',
          date: new Date(Date.now() - 3 * 86400000).toISOString(),
          weight: 72.8,
          height: 175,
          bmi: 23.8,
          category: 'Normální váha',
          note: 'Po týdnu zdravého stravování'
        }
      ],
      unlockedBadges: [],
      settings: {
        theme: 'dark',
        sound: true
      }
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getInitialState();
      const parsed = JSON.parse(raw);
      // Doplnění dnešního dne do logů, pokud chybí
      const today = getTodayKey();
      if (!parsed.dailyLogs) parsed.dailyLogs = {};
      if (!parsed.dailyLogs[today]) {
        parsed.dailyLogs[today] = { completedGoalIds: [], waterCount: 0 };
      }
      return parsed;
    } catch (e) {
      console.error('Chyba při načítání stavu:', e);
      return getInitialState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Chyba při ukládání stavu:', e);
    }
  }

  // =========================================================================
  // 3. Zvukové Efekty (Syntetizované pomocí Web Audio API - 100% offline)
  // =========================================================================

  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.settings.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'check') {
        // Příjemné cinknutí při odškrtnutí cíle
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'water') {
        // Zvuk bublinky / vody
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'complete') {
        // Triumfální akord při 100% splnění
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.12, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 0.4);
        });
      }
    } catch (err) {
      // Tichý fallback v případě omezení zvuku
    }
  }

  // =========================================================================
  // 4. Konfety Efekt (HTML5 Canvas)
  // =========================================================================

  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let particles = [];
  let confettiAnimationId = null;

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  function triggerConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    particles = [];
    const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 12,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravitace
      p.rotation += p.rotSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        alive = true;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        confettiCtx.restore();
      }
    });

    if (alive) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // =========================================================================
  // 5. Toast Notifikace
  // =========================================================================

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // 6. Výpočty BMI & Tělesných Metrik
  // =========================================================================

  function calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
  }

  function getBMICategory(bmi) {
    if (bmi < 18.5) {
      return {
        label: 'Podváha',
        desc: 'Vaše hmotnost je nižší, než je doporučeno pro vaši výšku.',
        color: 'var(--bmi-under)',
        classKey: 'underweight'
      };
    } else if (bmi <= 24.9) {
      return {
        label: 'Normální váha',
        desc: 'Skvělá práce! Vaše váha spadá do optimálního zdravého rozmezí.',
        color: 'var(--bmi-normal)',
        classKey: 'normal'
      };
    } else if (bmi <= 29.9) {
      return {
        label: 'Nadváha',
        desc: 'Vaše hmotnost je mírně zvýšená. Úprava stravy a pohyb pomohou.',
        color: 'var(--bmi-over)',
        classKey: 'overweight'
      };
    } else if (bmi <= 34.9) {
      return {
        label: 'Obezita I. stupně',
        desc: 'Zvýšené zdravotní riziko. Doporučujeme postupné a trvalé změny životního stylu.',
        color: 'var(--bmi-obese1)',
        classKey: 'obese1'
      };
    } else if (bmi <= 39.9) {
      return {
        label: 'Obezita II. stupně',
        desc: 'Vysoké riziko kardiovaskulárních onemocnění. Vhodná je konzultace s lékařem.',
        color: 'var(--bmi-obese2)',
        classKey: 'obese2'
      };
    } else {
      return {
        label: 'Těžká obezita (III. stupeň)',
        desc: 'Velmi vysoké zdravotní riziko. Vyžaduje odborný lékařský a nutriční dohled.',
        color: 'var(--bmi-obese3)',
        classKey: 'obese3'
      };
    }
  }

  function calculateIdealWeight(heightCm) {
    const heightM = heightCm / 100;
    const minWeight = Math.round(18.5 * (heightM * heightM) * 10) / 10;
    const maxWeight = Math.round(24.9 * (heightM * heightM) * 10) / 10;
    return { min: minWeight, max: maxWeight };
  }

  function calculateMetabolism(weightKg, heightCm, age, gender, activityMultiplier) {
    // Mifflin-St Jeor vzorec
    let bmr;
    if (gender === 'female') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    }
    bmr = Math.round(bmr);
    const tdee = Math.round(bmr * activityMultiplier);
    const lossCal = Math.max(1200, tdee - 500);
    const waterMin = (weightKg * 0.035).toFixed(1);
    const waterMax = (weightKg * 0.040).toFixed(1);

    return {
      bmr,
      tdee,
      lossCal,
      waterRange: `${waterMin} – ${waterMax} l`
    };
  }

  // =========================================================================
  // 7. Renderování a Logika BMI Panelu
  // =========================================================================

  function updateBMICalculation() {
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    const ageInput = document.getElementById('bmi-age');
    const activitySelect = document.getElementById('bmi-activity');
    const genderRadio = document.querySelector('input[name="gender"]:checked');

    if (!heightInput || !weightInput) return;

    const height = parseFloat(heightInput.value) || 175;
    const weight = parseFloat(weightInput.value) || 70;
    const age = parseInt(ageInput.value, 10) || 28;
    const gender = genderRadio ? genderRadio.value : 'male';
    const activity = parseFloat(activitySelect.value) || 1.55;

    // Uložit průběžně do profilu uživatele
    state.user = { height, weight, age, gender, activity };
    saveState();

    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    const ideal = calculateIdealWeight(height);
    const meta = calculateMetabolism(weight, height, age, gender, activity);

    // Zobrazení hodnot v UI
    const bmiValEl = document.getElementById('bmi-value-display');
    const bmiCatEl = document.getElementById('bmi-category-badge');
    const bmiDescEl = document.getElementById('bmi-summary-text');
    const idealRangeEl = document.getElementById('ideal-weight-range-display');
    const idealDiffEl = document.getElementById('ideal-diff-display');
    const needleEl = document.getElementById('bmi-gauge-needle');
    const needleTagEl = document.getElementById('needle-value-tag');
    const quickBmiEl = document.getElementById('quick-bmi-display');

    if (bmiValEl) bmiValEl.textContent = bmi.toFixed(1);
    if (quickBmiEl) quickBmiEl.textContent = bmi.toFixed(1);
    if (bmiCatEl) {
      bmiCatEl.textContent = category.label;
      bmiCatEl.style.backgroundColor = `${category.color}22`;
      bmiCatEl.style.color = category.color;
      bmiCatEl.style.borderColor = category.color;
    }
    if (bmiDescEl) bmiDescEl.textContent = category.desc;
    if (idealRangeEl) idealRangeEl.textContent = `${ideal.min} – ${ideal.max} kg`;

    if (idealDiffEl) {
      if (weight > ideal.max) {
        const diff = (weight - ideal.max).toFixed(1);
        idealDiffEl.textContent = `+${diff} kg k normálnímu pásmu`;
        idealDiffEl.style.color = 'var(--bmi-over)';
      } else if (weight < ideal.min) {
        const diff = (ideal.min - weight).toFixed(1);
        idealDiffEl.textContent = `-${diff} kg k normálnímu pásmu`;
        idealDiffEl.style.color = 'var(--bmi-under)';
      } else {
        idealDiffEl.textContent = 'Jste v ideálním pásmu 🎉';
        idealDiffEl.style.color = 'var(--bmi-normal)';
      }
    }

    // Pozice ukazatele (Needle)
    // Mapujeme BMI 15 až 45 na 0% až 100%
    if (needleEl) {
      const clampedBMI = Math.max(15, Math.min(45, bmi));
      const percentage = ((clampedBMI - 15) / (45 - 15)) * 100;
      needleEl.style.left = `${percentage}%`;
      if (needleTagEl) needleTagEl.textContent = bmi.toFixed(1);
    }

    // Metabolické hodnoty
    const bmrEl = document.getElementById('bmr-value-display');
    const tdeeEl = document.getElementById('tdee-value-display');
    const lossCalEl = document.getElementById('loss-cal-display');
    const waterRecEl = document.getElementById('water-rec-display');

    if (bmrEl) bmrEl.textContent = `${meta.bmr.toLocaleString('cs-CZ')} kcal`;
    if (tdeeEl) tdeeEl.textContent = `${meta.tdee.toLocaleString('cs-CZ')} kcal`;
    if (lossCalEl) lossCalEl.textContent = `${meta.lossCal.toLocaleString('cs-CZ')} kcal`;
    if (waterRecEl) waterRecEl.textContent = meta.waterRange;

    checkBadges();
  }

  function handleSaveMeasurement() {
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    const noteInput = document.getElementById('bmi-note');

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const note = noteInput ? noteInput.value.trim() : '';

    if (!weight || !height) {
      showToast('Zadejte prosím platnou výšku a váhu', 'warning');
      return;
    }

    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi).label;

    const record = {
      id: 'h-' + Date.now(),
      date: new Date().toISOString(),
      weight,
      height,
      bmi,
      category,
      note: note || 'Pravidelné měření'
    };

    state.history.unshift(record);
    saveState();

    if (noteInput) noteInput.value = '';
    showToast(`Měření (${weight} kg, BMI ${bmi}) bylo uloženo do historie!`, 'success');
    playSound('check');

    renderHistory();
    renderStatsOverview();
    checkBadges();
  }

  // =========================================================================
  // 8. Renderování a Logika Denních Cílů (Dashboard)
  // =========================================================================

  let currentGoalFilter = 'all';

  function renderGoalsList() {
    const container = document.getElementById('goals-list-container');
    if (!container) return;

    const today = getTodayKey();
    const todayLog = state.dailyLogs[today] || { completedGoalIds: [], waterCount: 0 };
    const completedSet = new Set(todayLog.completedGoalIds);

    const filteredGoals = state.goals.filter(g => {
      if (currentGoalFilter === 'all') return true;
      return g.category === currentGoalFilter;
    });

    if (filteredGoals.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <p>V této kategorii zatím nemáte žádné cíle.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredGoals.map(goal => {
      const isCompleted = completedSet.has(goal.id);
      return `
        <div class="goal-item ${isCompleted ? 'completed' : ''}" data-id="${goal.id}">
          <div class="goal-main" onclick="window.fitpulse.toggleGoal('${goal.id}')">
            <div class="goal-checkbox" aria-label="Označit cíl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="goal-icon-badge">${goal.emoji || '🎯'}</div>
            <div class="goal-info">
              <span class="goal-title">${escapeHTML(goal.title)}</span>
              ${goal.desc ? `<span class="goal-desc">${escapeHTML(goal.desc)}</span>` : ''}
            </div>
          </div>
          <div class="goal-meta">
            ${!goal.isDefault ? `
              <button class="goal-delete-btn" onclick="window.fitpulse.deleteGoal('${goal.id}')" title="Smazat cíl" aria-label="Smazat">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    updateDailyProgress();
  }

  function toggleGoal(goalId) {
    const today = getTodayKey();
    if (!state.dailyLogs[today]) {
      state.dailyLogs[today] = { completedGoalIds: [], waterCount: 0 };
    }

    const log = state.dailyLogs[today];
    const index = log.completedGoalIds.indexOf(goalId);

    if (index === -1) {
      log.completedGoalIds.push(goalId);
      playSound('check');
    } else {
      log.completedGoalIds.splice(index, 1);
    }

    saveState();
    renderGoalsList();
    checkBadges();
  }

  function deleteGoal(goalId) {
    if (!confirm('Opravdu chcete tento cíl smazat?')) return;
    state.goals = state.goals.filter(g => g.id !== goalId);
    saveState();
    renderGoalsList();
    showToast('Cíl byl odebrán', 'info');
  }

  function updateDailyProgress() {
    const today = getTodayKey();
    const log = state.dailyLogs[today] || { completedGoalIds: [], waterCount: 0 };
    const totalGoals = state.goals.length;
    const completedCount = log.completedGoalIds.length;

    const percent = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;

    // Kruhový progress bar (SVG dashoffset)
    const ringEl = document.getElementById('daily-progress-ring');
    const percentLabel = document.getElementById('daily-percentage-label');
    const descEl = document.getElementById('hero-progress-desc');

    const circumference = 2 * Math.PI * 50; // r=50 -> ~314.16
    if (ringEl) {
      const offset = circumference - (percent / 100) * circumference;
      ringEl.style.strokeDasharray = `${circumference}`;
      ringEl.style.strokeDashoffset = `${offset}`;
      if (percent === 100) {
        ringEl.style.stroke = 'var(--primary)';
      }
    }

    if (percentLabel) percentLabel.textContent = `${percent}%`;
    if (descEl) {
      if (percent === 100) {
        descEl.textContent = `Gratulujeme! Všechny dnešní cíle (${completedCount}/${totalGoals}) jsou splněny! 🏆`;
      } else {
        descEl.textContent = `Dnes máte splněno ${completedCount} z ${totalGoals} cílů.`;
      }
    }

    // Šňůra dnů (Streak)
    const streak = calculateStreak();
    const streakEl = document.getElementById('streak-count-display');
    if (streakEl) streakEl.textContent = `${streak} ${getDaysPlural(streak)}`;

    // Oslava při dosažení 100%
    if (percent === 100 && totalGoals > 0) {
      if (!window._celebratedToday) {
        window._celebratedToday = true;
        playSound('complete');
        triggerConfetti();
        showToast('Fantastické! Splnili jste 100 % dnešních cílů!', 'success');
      }
    }
  }

  function calculateStreak() {
    let streak = 0;
    const today = new Date();
    
    // Procházíme dny zpětně
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      
      const log = state.dailyLogs[key];
      if (log && log.completedGoalIds && log.completedGoalIds.length >= Math.ceil(state.goals.length * 0.5)) {
        streak++;
      } else {
        // Pokud je to dnešní den a ještě není splněno, šňůru zatím nepřerušujeme
        if (i === 0) continue;
        break;
      }
    }
    return streak;
  }

  function getDaysPlural(n) {
    if (n === 1) return 'den';
    if (n >= 2 && n <= 4) return 'dny';
    return 'dnů';
  }

  // =========================================================================
  // 9. Tracker Pitného Režimu (Voda)
  // =========================================================================

  function renderWaterTracker() {
    const today = getTodayKey();
    if (!state.dailyLogs[today]) {
      state.dailyLogs[today] = { completedGoalIds: [], waterCount: 0 };
    }
    const currentCount = state.dailyLogs[today].waterCount || 0;
    const maxGlasses = 8; // 8 * 250ml = 2000ml

    const container = document.getElementById('water-glasses-container');
    const displayEl = document.getElementById('water-ml-display');
    const badgeEl = document.getElementById('water-percent-badge');

    const totalMl = currentCount * 250;
    const percent = Math.min(100, Math.round((currentCount / maxGlasses) * 100));

    if (displayEl) displayEl.textContent = `${totalMl} z 2000 ml (${currentCount}/${maxGlasses} sklenic)`;
    if (badgeEl) badgeEl.textContent = `${percent}%`;

    if (container) {
      container.innerHTML = '';
      for (let i = 1; i <= maxGlasses; i++) {
        const isFilled = i <= currentCount;
        const btn = document.createElement('button');
        btn.className = `water-glass-btn ${isFilled ? 'filled' : ''}`;
        btn.title = `${i * 250} ml`;
        btn.setAttribute('aria-label', `Sklenice ${i}`);
        btn.textContent = isFilled ? '💧' : '🥛';
        btn.addEventListener('click', () => {
          setWaterCount(isFilled && i === currentCount ? i - 1 : i);
        });
        container.appendChild(btn);
      }
    }
  }

  function setWaterCount(count) {
    const today = getTodayKey();
    if (!state.dailyLogs[today]) {
      state.dailyLogs[today] = { completedGoalIds: [], waterCount: 0 };
    }
    const previous = state.dailyLogs[today].waterCount;
    state.dailyLogs[today].waterCount = Math.max(0, Math.min(12, count));
    saveState();

    if (count > previous) {
      playSound('water');
    }

    renderWaterTracker();
    checkBadges();
  }

  // =========================================================================
  // 10. Historie & Interaktivní Canvas Graf
  // =========================================================================

  function renderStatsOverview() {
    const startWeightEl = document.getElementById('stat-start-weight');
    const startDateEl = document.getElementById('stat-start-date');
    const currentWeightEl = document.getElementById('stat-current-weight');
    const currentBmiEl = document.getElementById('stat-current-bmi');
    const diffWeightEl = document.getElementById('stat-diff-weight');
    const diffDescEl = document.getElementById('stat-diff-desc');
    const totalRecordsEl = document.getElementById('stat-total-records');

    const history = state.history || [];
    if (totalRecordsEl) totalRecordsEl.textContent = history.length;

    if (history.length === 0) {
      if (startWeightEl) startWeightEl.textContent = '-- kg';
      if (currentWeightEl) currentWeightEl.textContent = `${state.user.weight} kg`;
      if (diffWeightEl) diffWeightEl.textContent = '0.0 kg';
      return;
    }

    const latest = history[0];
    const oldest = history[history.length - 1];

    if (currentWeightEl) currentWeightEl.textContent = `${latest.weight} kg`;
    if (currentBmiEl) currentBmiEl.textContent = `BMI: ${latest.bmi}`;
    if (startWeightEl) startWeightEl.textContent = `${oldest.weight} kg`;
    if (startDateEl) startDateEl.textContent = formatDate(oldest.date);

    const diff = Math.round((latest.weight - oldest.weight) * 10) / 10;
    if (diffWeightEl) {
      diffWeightEl.textContent = `${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg`;
      diffWeightEl.className = `stat-num ${diff < 0 ? 'text-success' : diff > 0 ? 'text-danger' : ''}`;
    }
    if (diffDescEl) {
      if (diff < 0) diffDescEl.textContent = 'úbytek hmotnosti 👍';
      else if (diff > 0) diffDescEl.textContent = 'přírůstek hmotnosti';
      else diffDescEl.textContent = 'hmotnost je stabilní';
    }
  }

  function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;

    if (!state.history || state.history.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">
            Zatím nemáte žádné záznamy měření. Spočtěte a uložte své první měření v záložce BMI.
          </td>
        </tr>
      `;
      drawChart();
      return;
    }

    tbody.innerHTML = state.history.map(item => {
      const catObj = getBMICategory(item.bmi);
      return `
        <tr>
          <td><strong>${formatDateTime(item.date)}</strong></td>
          <td>${item.weight.toFixed(1)} kg</td>
          <td>${item.height} cm</td>
          <td><span style="font-weight: 700; color: ${catObj.color};">${item.bmi.toFixed(1)}</span></td>
          <td>
            <span class="badge" style="background: ${catObj.color}22; color: ${catObj.color}; border-color: ${catObj.color};">
              ${escapeHTML(item.category)}
            </span>
          </td>
          <td style="color: var(--text-muted);">${escapeHTML(item.note || '–')}</td>
          <td class="text-right">
            <button class="table-delete-btn" onclick="window.fitpulse.deleteHistoryItem('${item.id}')" title="Smazat záznam">
              ✕ Smazat
            </button>
          </td>
        </tr>
      `;
    }).join('');

    drawChart();
  }

  function deleteHistoryItem(id) {
    if (!confirm('Opravdu chcete tento záznam smazat?')) return;
    state.history = state.history.filter(h => h.id !== id);
    saveState();
    renderHistory();
    renderStatsOverview();
    showToast('Záznam byl odstraněn', 'info');
  }

  // Vykreslení grafu na Canvas
  function drawChart() {
    const canvas = document.getElementById('weight-history-chart');
    const placeholder = document.getElementById('chart-empty-placeholder');
    if (!canvas) return;

    const history = [...(state.history || [])].reverse(); // Chronologicky zleva doprava
    if (history.length < 2) {
      if (placeholder) placeholder.classList.remove('hidden');
      return;
    } else {
      if (placeholder) placeholder.classList.add('hidden');
    }

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, right: 35, bottom: 45, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    // Najdeme min a max váhu
    const weights = history.map(h => h.weight);
    let minW = Math.min(...weights);
    let maxW = Math.max(...weights);
    if (minW === maxW) {
      minW -= 2;
      maxW += 2;
    } else {
      minW = Math.floor(minW - 1);
      maxW = Math.ceil(maxW + 1);
    }

    // 1. Mřížka a popisky osy Y
    ctx.strokeStyle = state.settings.theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.fillStyle = state.settings.theme === 'light' ? '#64748b' : '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const val = minW + ((maxW - minW) / ySteps) * i;
      const y = padding.top + chartH - (i / ySteps) * chartH;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      ctx.fillText(`${val.toFixed(1)} kg`, padding.left - 10, y);
    }

    // 2. Křivka váhy
    const points = history.map((h, i) => {
      const x = padding.left + (i / (history.length - 1)) * chartW;
      const y = padding.top + chartH - ((h.weight - minW) / (maxW - minW)) * chartH;
      return { x, y, data: h };
    });

    // Gradient pod křivkou
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.lineTo(points[0].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Hlavní čára
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Body (kroužky s popisky)
    points.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hodnota nad bodem
      ctx.fillStyle = state.settings.theme === 'light' ? '#0f172a' : '#f1f5f9';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${p.data.weight} kg`, p.x, p.y - 12);

      // Datum pod osou X
      ctx.fillStyle = state.settings.theme === 'light' ? '#64748b' : '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(formatDateShort(p.data.date), p.x, padding.top + chartH + 18);
    });
  }

  window.addEventListener('resize', () => {
    drawChart();
  });

  // =========================================================================
  // 11. Úspěchy (Odznaky) & Tipy
  // =========================================================================

  function renderAchievements() {
    const container = document.getElementById('achievements-container');
    const summaryEl = document.getElementById('badges-unlocked-summary');
    if (!container) return;

    const unlockedSet = new Set(state.unlockedBadges || []);
    if (summaryEl) {
      summaryEl.textContent = `Odemčeno ${unlockedSet.size} z ${BADGES_CONFIG.length} odznaků`;
    }

    container.innerHTML = BADGES_CONFIG.map(badge => {
      const isUnlocked = unlockedSet.has(badge.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
          <div class="ach-icon">${badge.icon}</div>
          <div class="ach-info">
            <h4>${escapeHTML(badge.title)} ${isUnlocked ? '✓' : ''}</h4>
            <p>${escapeHTML(badge.desc)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  function checkBadges() {
    if (!state.unlockedBadges) state.unlockedBadges = [];
    const prevCount = state.unlockedBadges.length;

    // Kontrola podmínek
    // 1. První BMI
    if (state.history.length >= 1 && !state.unlockedBadges.includes('first_bmi')) {
      state.unlockedBadges.push('first_bmi');
    }
    // 2. Hydratační šampion
    const today = getTodayKey();
    const water = (state.dailyLogs[today] && state.dailyLogs[today].waterCount) || 0;
    if (water >= 8 && !state.unlockedBadges.includes('water_master')) {
      state.unlockedBadges.push('water_master');
    }
    // 3. Perfektní den
    const completed = (state.dailyLogs[today] && state.dailyLogs[today].completedGoalIds.length) || 0;
    if (completed >= state.goals.length && state.goals.length > 0 && !state.unlockedBadges.includes('perfect_day')) {
      state.unlockedBadges.push('perfect_day');
    }
    // 4. Streak 3 dny
    const streak = calculateStreak();
    if (streak >= 3 && !state.unlockedBadges.includes('streak_3')) {
      state.unlockedBadges.push('streak_3');
    }
    // 5. Streak 7 dní
    if (streak >= 7 && !state.unlockedBadges.includes('streak_7')) {
      state.unlockedBadges.push('streak_7');
    }
    // 6. Vlastní cíl
    const hasCustom = state.goals.some(g => !g.isDefault);
    if (hasCustom && !state.unlockedBadges.includes('custom_goal')) {
      state.unlockedBadges.push('custom_goal');
    }
    // 7. Normální BMI
    const currentBMI = calculateBMI(state.user.weight, state.user.height);
    if (currentBMI >= 18.5 && currentBMI <= 24.9 && !state.unlockedBadges.includes('healthy_bmi')) {
      state.unlockedBadges.push('healthy_bmi');
    }
    // 8. 5 záznamů
    if (state.history.length >= 5 && !state.unlockedBadges.includes('tracker_pro')) {
      state.unlockedBadges.push('tracker_pro');
    }

    if (state.unlockedBadges.length > prevCount) {
      saveState();
      renderAchievements();
      showToast('Odemkli jste nový odznak! 🏆 Podívejte se do Úspěchů.', 'success');
      playSound('complete');
    }
  }

  function setRandomDailyQuote() {
    const quote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
    const titleEl = document.getElementById('daily-quote-title');
    const textEl = document.getElementById('daily-quote-text');
    if (titleEl) titleEl.textContent = quote.title;
    if (textEl) textEl.textContent = quote.text;
  }

  // =========================================================================
  // 12. Záloha, Export a Import Dat
  // =========================================================================

  function exportBackup() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fitpulse_backup_${getTodayKey()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Záloha byla úspěšně stažena!', 'success');
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.user || !imported.goals) {
          throw new Error('Neplatný formát souboru.');
        }
        state = imported;
        saveState();
        initUI();
        showToast('Data byla úspěšně načtena ze zálohy!', 'success');
      } catch (err) {
        showToast('Chyba: Soubor není platnou zálohou FitPulse.', 'warning');
      }
    };
    reader.readAsText(file);
  }

  function resetAllData() {
    if (!confirm('Opravdu chcete smazat všechna svá data a začít znovu? Tato akce je nevratná.')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = getInitialState();
    saveState();
    initUI();
    showToast('Aplikace byla resetována do výchozího stavu.', 'info');
  }

  // =========================================================================
  // 13. Pomocné funkce (Formatters & Escaping)
  // =========================================================================

  function formatDate(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
  }

  function formatDateShort(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return `${d.getDate()}.${d.getMonth() + 1}.`;
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatCurrentDate() {
    const d = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatted = d.toLocaleDateString('cs-CZ', options);
    // První písmeno velké
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 14. Inicializace Uživatelského Rozhraní (Event Listeners)
  // =========================================================================

  function initUI() {
    // 1. Nastavení motivu
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('data-theme', state.settings.theme || 'dark');
    updateThemeIcons();

    // 2. Datum v hlavičce
    const dateStrEl = document.getElementById('date-string');
    if (dateStrEl) dateStrEl.textContent = formatCurrentDate();

    // 3. Nastavení vstupů BMI z uloženého stavu
    const hInput = document.getElementById('bmi-height');
    const hRange = document.getElementById('bmi-height-range');
    const wInput = document.getElementById('bmi-weight');
    const wRange = document.getElementById('bmi-weight-range');
    const ageInput = document.getElementById('bmi-age');
    const actSelect = document.getElementById('bmi-activity');

    if (hInput && state.user.height) {
      hInput.value = state.user.height;
      if (hRange) hRange.value = state.user.height;
    }
    if (wInput && state.user.weight) {
      wInput.value = state.user.weight;
      if (wRange) wRange.value = state.user.weight;
    }
    if (ageInput && state.user.age) ageInput.value = state.user.age;
    if (actSelect && state.user.activity) actSelect.value = state.user.activity;

    const genderRadio = document.querySelector(`input[name="gender"][value="${state.user.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

    // 4. Propojení sliderů s numerickými vstupy
    if (hInput && hRange) {
      hInput.addEventListener('input', () => { hRange.value = hInput.value; updateBMICalculation(); });
      hRange.addEventListener('input', () => { hInput.value = hRange.value; updateBMICalculation(); });
    }
    if (wInput && wRange) {
      wInput.addEventListener('input', () => { wRange.value = wInput.value; updateBMICalculation(); });
      wRange.addEventListener('input', () => { wInput.value = wRange.value; updateBMICalculation(); });
    }
    if (ageInput) ageInput.addEventListener('input', updateBMICalculation);
    if (actSelect) actSelect.addEventListener('change', updateBMICalculation);
    document.querySelectorAll('input[name="gender"]').forEach(r => {
      r.addEventListener('change', updateBMICalculation);
    });

    // 5. Záložky (Tabs navigation)
    document.querySelectorAll('.nav-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        tabBtn.classList.add('active');
        tabBtn.setAttribute('aria-selected', 'true');
        const targetId = tabBtn.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
          if (targetId === 'tab-history') {
            setTimeout(drawChart, 60);
          }
        }
      });
    });

    // 6. Filtry cílů
    document.querySelectorAll('#goals-filter-group .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#goals-filter-group .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGoalFilter = btn.getAttribute('data-filter') || 'all';
        renderGoalsList();
      });
    });

    // 7. Voda ovladače
    const btnWaterPlus = document.getElementById('btn-water-plus');
    const btnWaterMinus = document.getElementById('btn-water-minus');
    if (btnWaterPlus) {
      btnWaterPlus.addEventListener('click', () => {
        const today = getTodayKey();
        const current = (state.dailyLogs[today] && state.dailyLogs[today].waterCount) || 0;
        setWaterCount(current + 1);
      });
    }
    if (btnWaterMinus) {
      btnWaterMinus.addEventListener('click', () => {
        const today = getTodayKey();
        const current = (state.dailyLogs[today] && state.dailyLogs[today].waterCount) || 0;
        setWaterCount(current - 1);
      });
    }

    // 8. Tlačítko uložit měření
    const btnSaveM = document.getElementById('btn-save-measurement');
    if (btnSaveM) btnSaveM.addEventListener('click', handleSaveMeasurement);

    // 9. Modální okno pro nový cíl
    setupModal();

    // 10. Tlačítka pro přepnutí zvuku a tématu
    setupToggles();

    // 11. Záloha a reset
    const btnExport = document.getElementById('btn-export-data');
    const btnExportBackup = document.getElementById('btn-export-backup');
    const importInput = document.getElementById('import-file-input');
    const btnReset = document.getElementById('btn-reset-data');

    if (btnExport) btnExport.addEventListener('click', exportBackup);
    if (btnExportBackup) btnExportBackup.addEventListener('click', exportBackup);
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          importBackup(e.target.files[0]);
        }
      });
    }
    if (btnReset) btnReset.addEventListener('click', resetAllData);

    // 12. Prvotní vykreslení
    updateBMICalculation();
    renderGoalsList();
    renderWaterTracker();
    renderStatsOverview();
    renderHistory();
    renderAchievements();
    setRandomDailyQuote();
  }

  function setupModal() {
    const modal = document.getElementById('add-goal-modal');
    const openBtn = document.getElementById('open-add-goal-modal-btn');
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel-modal');
    const confirmBtn = document.getElementById('btn-confirm-add-goal');

    function openModal() {
      if (modal) modal.classList.remove('hidden');
      const titleInput = document.getElementById('new-goal-title');
      if (titleInput) {
        titleInput.value = '';
        setTimeout(() => titleInput.focus(), 100);
      }
      const descInput = document.getElementById('new-goal-desc');
      if (descInput) descInput.value = '';
    }

    function closeModal() {
      if (modal) modal.classList.add('hidden');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('new-goal-title');
        const descInput = document.getElementById('new-goal-desc');
        const catSelect = document.getElementById('new-goal-category');
        const emojiRadio = document.querySelector('input[name="goal-emoji"]:checked');

        const title = titleInput ? titleInput.value.trim() : '';
        if (!title) {
          showToast('Zadejte prosím název cíle', 'warning');
          return;
        }

        const newGoal = {
          id: 'g-user-' + Date.now(),
          title,
          desc: descInput ? descInput.value.trim() : '',
          category: catSelect ? catSelect.value : 'fitness',
          emoji: emojiRadio ? emojiRadio.value : '🎯',
          isDefault: false
        };

        state.goals.push(newGoal);
        saveState();
        closeModal();
        renderGoalsList();
        showToast('Nový denní cíl byl přidán!', 'success');
        playSound('check');
        checkBadges();
      });
    }
  }

  function setupToggles() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const soundBtn = document.getElementById('sound-toggle-btn');

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.settings.theme);
        saveState();
        updateThemeIcons();
        drawChart();
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.settings.sound = !state.settings.sound;
        saveState();
        updateSoundIcons();
        showToast(`Zvukové efekty: ${state.settings.sound ? 'Zapnuto' : 'Vypnuto'}`, 'info');
      });
    }

    updateSoundIcons();
  }

  function updateThemeIcons() {
    const isDark = state.settings.theme === 'dark';
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }

  function updateSoundIcons() {
    const isSound = !!state.settings.sound;
    const soundOn = document.getElementById('sound-icon-on');
    const soundOff = document.getElementById('sound-icon-off');
    if (soundOn && soundOff) {
      if (isSound) {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
      } else {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
      }
    }
  }

  // =========================================================================
  // 15. Globální API pro inline Handlery v HTML
  // =========================================================================

  window.fitpulse = {
    toggleGoal,
    deleteGoal,
    deleteHistoryItem
  };

  // Spuštění po načtení DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

})();
