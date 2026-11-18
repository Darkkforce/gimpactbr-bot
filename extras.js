// extras.js — comum a todas as páginas do hub (fica na RAIZ do site, ao lado do index.html).
// Cada página inclui uma linha:  <script src="extras.js" data-home></script>  (hub)
//                                <script src="../extras.js"></script>          (vel/, acerto/, materiais/)
// Faz 3 coisas:
//   1. botão "← Voltar" fixo no topo à direita (some no hub, que é a tela inicial)
//   2. botão "↑ Voltar ao topo" no fim da página, à direita
//   3. tag "Vanguarda do Presságio" com link pro canal (se a página já tiver a sua, #vg, não duplica)
(function () {
  const CANAL = "https://t.me/StarRailBR";
  const me = document.currentScript;
  const home = me.hasAttribute("data-home");
  const raiz = new URL(".", me.src).href;            // endereço do hub, venha a página de onde vier
  const tg = window.Telegram && Telegram.WebApp;

  const css = document.createElement("style");
  css.textContent =
    ".gx-back{position:fixed;z-index:50;top:calc(env(safe-area-inset-top,0px) + 8px);right:10px;display:inline-flex;align-items:center;gap:4px;padding:7px 14px;border-radius:999px;border:0;font:500 14px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-decoration:none;cursor:pointer;" +
    "background:var(--tg-theme-secondary-bg-color,rgba(128,128,128,.22));color:var(--tg-theme-text-color,inherit);box-shadow:0 1px 6px rgba(0,0,0,.25);-webkit-tap-highlight-color:transparent}" +
    ".gx-top{display:flex;justify-content:flex-end;margin:20px 0 0}" +
    ".gx-top button{padding:8px 14px;border-radius:999px;border:0;font:500 14px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;cursor:pointer;" +
    "background:var(--tg-theme-secondary-bg-color,rgba(128,128,128,.22));color:var(--tg-theme-text-color,inherit)}" +
    ".gx-back:focus-visible,.gx-top button:focus-visible,.vg:focus-visible{outline:2px solid var(--tg-theme-button-color,#8b7cf6);outline-offset:2px}" +
    /* mesma tag que já existe no vel/ */
    ".vg{display:inline-flex;align-items:center;gap:8px;margin:0 0 10px;padding:6px 16px 6px 12px;border-radius:999px;background:#0f2a5f;border:1px solid #3d6fd6;color:#fff;font-weight:500;font-size:14px;text-decoration:none;box-shadow:0 0 8px rgba(61,111,214,.45)}" +
    ".vg svg{width:16px;height:16px;filter:drop-shadow(0 0 3px #fff)}";
  document.head.appendChild(css);

  // links t.me abrem dentro do Telegram, sem passar pelo navegador
  function abrirCanal(e) {
    if (tg && tg.openTelegramLink) { e.preventDefault(); tg.openTelegramLink(CANAL); }
  }

  function montar() {
    const raizConteudo = document.querySelector("main") || document.body;

    // 3. tag do canal
    let tag = document.getElementById("vg");
    if (!tag) {
      tag = document.createElement("a");
      tag.id = "vg"; tag.className = "vg"; tag.href = CANAL; tag.target = "_blank"; tag.rel = "noopener";
      tag.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 1l2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4z"/></svg>Vanguarda do Presságio';
      raizConteudo.insertBefore(tag, raizConteudo.firstChild);
    }
    tag.addEventListener("click", abrirCanal);

    // 1. voltar (topo, direita)
    if (!home) {
      const b = document.createElement("a");
      b.className = "gx-back"; b.href = raiz; b.setAttribute("aria-label", "Voltar para as ferramentas");
      b.textContent = "← Voltar";
      document.body.appendChild(b);
      if (tg && tg.BackButton) { tg.BackButton.show(); tg.BackButton.onClick(() => { location.href = raiz; }); }
    }

    // 2. voltar ao topo (fim da página, direita)
    const t = document.createElement("div");
    t.className = "gx-top";
    t.innerHTML = '<button type="button">↑ Voltar ao topo</button>';
    t.firstChild.addEventListener("click", () => {
      const reduz = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduz ? "auto" : "smooth" });
    });
    raizConteudo.appendChild(t);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar); else montar();
})();
