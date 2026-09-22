(function () {
  const state = {
    grade: "g3",
    sem: "s1",
    progressMode: false,
  };

  const PROGRESS_KEY = "sci115-progress";

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveProgress(p) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    } catch (e) { /* ignore */ }
  }

  // ---------- Tabs ----------
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById("view-" + view).classList.add("active");
    });
  });

  // ---------- Grade buttons ----------
  const gradeOrder = ["g3", "g4", "g5", "g6", "g7", "g8", "g9"];
  const gradeButtonsEl = document.getElementById("gradeButtons");
  gradeOrder.forEach((g) => {
    const meta = CURRICULUM.gradeMeta[g];
    const btn = document.createElement("button");
    btn.className = "grade-btn" + (g === state.grade ? " active" : "");
    btn.dataset.grade = g;
    btn.dataset.stage = meta.stage;
    btn.textContent = meta.label;
    btn.addEventListener("click", () => {
      state.grade = g;
      document.querySelectorAll(".grade-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
    gradeButtonsEl.appendChild(btn);
  });

  // ---------- Semester buttons ----------
  document.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.sem = btn.dataset.sem;
      render();
    });
  });

  // ---------- Progress mode toggle ----------
  const progressToggle = document.getElementById("progressMode");
  progressToggle.addEventListener("change", () => {
    state.progressMode = progressToggle.checked;
    document.getElementById("compareGrid").classList.toggle("progress-mode", state.progressMode);
  });

  // ---------- Render compare grid ----------
  function render() {
    const gradeData = CURRICULUM.data[state.grade];
    const semData = gradeData ? gradeData[state.sem] : null;
    const grid = document.getElementById("compareGrid");
    grid.innerHTML = "";

    const banner = document.getElementById("editionBanner");
    if (semData && (semData.edition || semData.note)) {
      banner.classList.add("show");
      banner.innerHTML =
        (semData.edition ? "<strong>資料版次：</strong>" + semData.edition + "　" : "") +
        (semData.note ? semData.note : "");
    } else {
      banner.classList.remove("show");
      banner.innerHTML = "";
    }

    if (!semData) return;

    const progress = loadProgress();

    CURRICULUM.meta.publishers.forEach((pub) => {
      const units = (semData.units && semData.units[pub]) || [];
      const card = document.createElement("div");
      card.className = "pub-card";
      card.dataset.pub = pub;

      const head = document.createElement("div");
      head.className = "pub-card-head";
      head.textContent = pub;
      card.appendChild(head);

      const body = document.createElement("div");
      body.className = "pub-card-body";

      units.forEach((unit, idx) => {
        const key = [state.grade, state.sem, pub, idx].join("|");
        const block = document.createElement("div");
        block.className = "unit-block";

        const nameEl = document.createElement("div");
        nameEl.className = "unit-name" + (progress[key] ? " done" : "");

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!progress[key];
        cb.addEventListener("change", () => {
          const p = loadProgress();
          p[key] = cb.checked;
          saveProgress(p);
          nameEl.classList.toggle("done", cb.checked);
        });

        const label = document.createElement("span");
        label.textContent = unit.name;

        nameEl.appendChild(cb);
        nameEl.appendChild(label);
        block.appendChild(nameEl);

        if (unit.sub && unit.sub.length) {
          const ul = document.createElement("ul");
          ul.className = "sub-list";
          unit.sub.forEach((s) => {
            const li = document.createElement("li");
            li.textContent = s;
            ul.appendChild(li);
          });
          block.appendChild(ul);
        }

        body.appendChild(block);
      });

      if (!units.length) {
        const empty = document.createElement("p");
        empty.style.color = "#9ca3af";
        empty.textContent = "（無資料）";
        body.appendChild(empty);
      }

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // ---------- Render bridge / threads ----------
  function renderThreads() {
    const container = document.getElementById("threadList");
    container.innerHTML = "";
    THREADS.forEach((thread) => {
      const card = document.createElement("div");
      card.className = "thread-card";

      const h4 = document.createElement("h4");
      h4.textContent = (thread.icon ? thread.icon + " " : "") + thread.theme;
      card.appendChild(h4);

      const track = document.createElement("div");
      track.className = "thread-track";
      thread.track.forEach((step) => {
        const el = document.createElement("div");
        el.className = "thread-step";
        const g = document.createElement("span");
        g.className = "g";
        g.textContent = CURRICULUM.gradeMeta[step.grade].label;
        const t = document.createElement("span");
        t.textContent = step.text;
        el.appendChild(g);
        el.appendChild(t);
        track.appendChild(el);
      });
      card.appendChild(track);
      container.appendChild(card);
    });
  }

  render();
  renderThreads();
})();
