(() => {
  const root = document.documentElement;

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* sem storage */ } },
  };

  // Tamanho da fonte
  const FONT_STEPS = [100, 112.5, 125, 137.5];
  let fontIdx = Math.max(0, FONT_STEPS.indexOf(Number(store.get("fs"))));
  const applyFont = () => {
    root.style.setProperty("--fs", FONT_STEPS[fontIdx] + "%");
    store.set("fs", FONT_STEPS[fontIdx]);
  };
  applyFont();
  document.querySelectorAll("[data-font]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.font;
      if (action === "up") fontIdx = Math.min(FONT_STEPS.length - 1, fontIdx + 1);
      else if (action === "down") fontIdx = Math.max(0, fontIdx - 1);
      else fontIdx = 0;
      applyFont();
    });
  });

  // Alto contraste
  const contrastBtn = document.getElementById("contrast-toggle");
  const applyContrast = (on) => {
    root.classList.toggle("hc", on);
    contrastBtn.setAttribute("aria-pressed", String(on));
    store.set("hc", on ? "1" : "0");
  };
  applyContrast(store.get("hc") === "1");
  contrastBtn.addEventListener("click", () => applyContrast(!root.classList.contains("hc")));

  // Tabs (padrão WAI-ARIA, setas do teclado)
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const triggers = [...tabs.querySelectorAll('[role="tab"]')];
    const select = (tab, focus = true) => {
      triggers.forEach((t) => {
        const active = t === tab;
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
      });
      if (focus) tab.focus();
    };
    triggers.forEach((t, i) => {
      t.addEventListener("click", () => select(t, false));
      t.addEventListener("keydown", (e) => {
        const n = triggers.length;
        if (e.key === "ArrowRight") select(triggers[(i + 1) % n]);
        else if (e.key === "ArrowLeft") select(triggers[(i - 1 + n) % n]);
        else if (e.key === "Home") select(triggers[0]);
        else if (e.key === "End") select(triggers[n - 1]);
        else return;
        e.preventDefault();
      });
    });
  });
})();
