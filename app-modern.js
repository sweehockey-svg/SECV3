(function () {
  const app = document.querySelector("#app");
  const state = {
    cups: [],
    teams: [],
    players: [],
    goalies: [],
    teamLogoIndex: new Map(),
    playerImageIndex: new Map(),
    view: "cups",
    query: "",
    activeCupId: "",
    activeCupSection: "",
    activeCupTeamFilter: "",
    activeCupStatsMode: "all",
    activeCupGoalieEligibleOnly: false,
    activeTeam: "",
    activePlayer: "",
    activeGoalie: "",
    activeMatchCupId: "",
    activeMatchId: "",
    activeCupTeamName: "",
    activeTeamTab: "roster"
  };

  const routes = new Set(["overview", "cups", "teams", "players", "goalies", "matches", "match", "about"]);

  window.SEC_LOGO_FALLBACK = function (image) {
    const parent = image.closest(".teamLogo");
    let fallbacks = [];
    try {
      fallbacks = JSON.parse(image.dataset.fallbackSrcs || "[]");
    } catch (_error) {
      fallbacks = [];
    }
    if (fallbacks.length) {
      image.dataset.fallbackSrcs = JSON.stringify(fallbacks.slice(1));
      image.src = fallbacks[0];
      return;
    }
    if (parent) parent.classList.add("missing");
    image.remove();
  };

  window.SEC_PLAYER_IMAGE_FALLBACK = function (image) {
    const parent = image.closest(".playerPortrait");
    let fallbacks = [];
    try {
      fallbacks = JSON.parse(image.dataset.fallbackSrcs || "[]");
    } catch (_error) {
      fallbacks = [];
    }
    if (fallbacks.length) {
      image.dataset.fallbackSrcs = JSON.stringify(fallbacks.slice(1));
      image.src = fallbacks[0];
      return;
    }
    if (parent) parent.classList.add("missing");
    image.remove();
  };

  init();

  async function init() {
    try {
      const rawCups = await loadAllCupSources();
      state.cups = normalizeCups(rawCups);
      state.teams = buildTeams(state.cups);
      state.players = buildPlayers(state.cups);
      state.goalies = buildGoalies(state.cups);
      readRoute();
      render();
      loadTeamLogoIndex().then(function (index) {
        if (index.size) {
          state.teamLogoIndex = index;
          render();
        }
      });
      loadPlayerImageIndex().then(function (index) {
        if (index.size) {
          state.playerImageIndex = index;
          render();
        }
      });
      window.addEventListener("hashchange", function () {
        readRoute();
        render();
      });
    } catch (error) {
      app.innerHTML = `
        <main class="fail">
          <h1>Kunde inte ladda SEC</h1>
          <p>${escapeHtml(error.message || String(error))}</p>
        </main>
      `;
    }
  }

  async function loadJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Datakallan svarade inte: " + response.status);
    }
    return response.json();
  }

  async function loadAllCupSources() {
    const urls = [
      window.SEC_CONFIG?.sheetUrl || "./database-cups-extra.json",
      window.SEC_CONFIG?.databaseUrl || "./database-cups.json"
    ].filter(Boolean);
    const payloads = await Promise.all(urls.map(function (url) {
      return loadJson(url).catch(function () { return { cups: [] }; });
    }));
    return mergeRawCups(payloads.flatMap(function (payload) {
      return payload.cups || payload.data || [];
    }));
  }

  async function loadTeamLogoIndex() {
    const url = window.SEC_CONFIG?.teamLogoManifestUrl || "";
    if (!url) return new Map();
    try {
      const payload = await loadJson(url);
      const files = (Array.isArray(payload) ? payload : []).map(function (item) {
        return item?.name || "";
      }).filter(function (name) {
        return /\.(png|jpe?g|webp|svg)$/i.test(name);
      });
      const index = new Map();
      files.forEach(function (filename) {
        const base = filename.replace(/\.[^.]+$/, "");
        const keys = uniqueStrings([
          fold(base),
          normalizeLogoKey(base)
        ]);
        keys.forEach(function (key) {
          if (key && !index.has(key)) index.set(key, filename);
        });
      });
      return index;
    } catch (_error) {
      return new Map();
    }
  }

  async function loadPlayerImageIndex() {
    const url = window.SEC_CONFIG?.playerImageManifestUrl || "";
    if (!url) return new Map();
    try {
      const payload = await loadJson(url);
      const files = (Array.isArray(payload) ? payload : []).map(function (item) {
        return item?.name || "";
      }).filter(function (name) {
        return /\.(png|jpe?g|webp)$/i.test(name);
      });
      const index = new Map();
      files.forEach(function (filename) {
        const base = filename.replace(/\.[^.]+$/, "");
        getPlayerAssetKeys(base).forEach(function (key) {
          if (key && !index.has(key)) index.set(key, filename);
        });
      });
      return index;
    } catch (_error) {
      return new Map();
    }
  }

  function mergeRawCups(cups) {
    const map = new Map();
    cups.forEach(function (cup) {
      const key = fold(cup.code || cup.name || cup.id);
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, cup);
        return;
      }
      const existing = map.get(key);
      map.set(key, preferRicherCup(existing, cup));
    });
    return Array.from(map.values());
  }

  function preferRicherCup(left, right) {
    const leftScore = dataRichness(left);
    const rightScore = dataRichness(right);
    return rightScore > leftScore ? Object.assign({}, left, right) : Object.assign({}, right, left);
  }

  function dataRichness(cup) {
    return (cup.matches?.length || 0)
      + getStatRows(cup.playerStats, "group").length
      + getStatRows(cup.playerStats, "playoffs").length
      + getStatRows(cup.goalieStats, "group").length
      + getStatRows(cup.goalieStats, "playoffs").length;
  }

  function readRoute() {
    const hash = location.hash.replace(/^#\/?/, "");
    const routeAndQuery = hash.split("?");
    const parts = routeAndQuery[0].split("/").filter(Boolean);
    const params = new URLSearchParams(routeAndQuery[1] || "");
    state.view = routes.has(parts[0]) ? parts[0] : "cups";
    state.activeCupId = state.view === "cups" ? decodeURIComponent(parts[1] || "") : "";
    state.activeCupSection = state.view === "cups" ? decodeURIComponent(parts[2] || "") : "";
    state.activeCupTeamName = state.view === "cups" && state.activeCupSection === "teams" ? decodeURIComponent(parts[3] || "") : "";
    state.activeCupTeamFilter = state.view === "cups" && state.activeCupSection === "matches" ? params.get("team") || "" : "";
    state.activeCupStatsMode = state.view === "cups" && state.activeCupSection === "stats" ? normalizeStatsMode(params.get("mode")) : "all";
    state.activeCupGoalieEligibleOnly = state.view === "cups" && state.activeCupSection === "stats" && params.get("eligible") === "1";
    state.activeTeam = state.view === "teams" ? decodeURIComponent(parts[1] || "") : "";
    state.activeTeamTab = normalizeTeamTab(params.get("tab"));
    state.activePlayer = state.view === "players" ? decodeURIComponent(parts[1] || "") : "";
    state.activeGoalie = state.view === "goalies" ? decodeURIComponent(parts[1] || "") : "";
    state.activeMatchCupId = state.view === "match" ? decodeURIComponent(parts[1] || "") : "";
    state.activeMatchId = state.view === "match" ? decodeURIComponent(parts[2] || "") : "";
  }

  function normalizeStatsMode(value) {
    return value === "group" || value === "playoffs" || value === "all" ? value : "all";
  }

  function normalizeTeamTab(value) {
    return value === "matches" || value === "stats" || value === "history" || value === "roster" ? value : "roster";
  }

  function render() {
    const model = buildModel();
    app.innerHTML = `
      <div class="shell">
        <main class="stage">
          ${renderTopbar(model)}
          <div class="view" data-view="${state.view}">
            ${renderView(model)}
          </div>
        </main>
        ${renderFooter()}
      </div>
    `;
    repairRenderedText(app);
    bindInteractions();
  }

  function renderFooter() {
    return `
      <footer class="siteFooter">
        <div>
          <strong>SEC</strong>
          <span>Copyright Ã‚Â© ${new Date().getFullYear()} Svenska eHockey Cupen. Designad av SEC.</span>
        </div>
        <nav aria-label="Kontakt">
          <a href="mailto:svenskehockey@gmail.com">E-post: svenskehockey@gmail.com</a>
          <a href="https://discord.gg/B9TYMEjpj6" target="_blank" rel="noopener">GÃƒÂ¥ med i Discord</a>
        </nav>
      </footer>
    `;
  }

  function renderArenaHeader(model) {
    return `
      <header class="arena">
        <a class="mark" href="#/overview" aria-label="SEC start">
          <img src="./SECLOGGA.png" alt="">
          <span>SEC</span>
          <b>Cup</b>
        </a>
        <nav class="railnav" aria-label="SEC meny">
          ${navItem("overview", "Ãƒâ€“versikt", "Ã¢Å’â€š")}
          ${navItem("cups", "Cuper", "Ã¢â€”â€ ")}
          ${navItem("teams", "Lag", "Ã¢â€“Â¦")}
          ${navItem("players", "Spelare", "Ã¢â€”Â")}
          ${navItem("matches", "Matcher", "Ã¢â€ Â¯")}
          ${navItem("goalies", "MÃƒÂ¥lvakter", "Ã¢â€“Â£")}
          ${navItem("about", "Info", "i")}
        </nav>
        <div class="railcard">
          <span>SEC</span>
          <strong>${model.totalMatches}</strong>
          <em>matcher</em>
        </div>
      </header>
    `;
  }

  function navItem(view, label, icon) {
    return `
      <a class="${state.view === view ? "active" : ""}" href="#/${view}">
        <span>${icon}</span>
        ${label}
      </a>
    `;
  }

  function renderTopbar(model) {
    const compact = state.view === "cups" && state.activeCupId;
    return `
      <header class="top ${compact ? "compactTop" : ""}">
        <div>
          <p>${compact ? getCupSectionLabel() : getViewKicker(model)}</p>
          ${compact ? "" : `<h1>${getViewTitle()}</h1>`}
        </div>
        <label class="command">
          <span>SÃƒÂ¶k</span>
          <input data-global-search value="${escapeHtml(state.query)}" placeholder="Lag, spelare, cup eller match" autocomplete="off">
        </label>
      </header>
      ${state.query ? renderSearchResults(model) : ""}
    `;
  }

  function getViewKicker(model) {
    if (state.view === "players" && state.activePlayer) return "Spelare";
    if (state.view === "goalies" && state.activeGoalie) return "Spelare";
    if (state.view === "teams" && state.activeTeam) return "Lag";
    if (state.view === "match") return "Match";
    return model.latestCup ? model.latestCup.code : "SEC";
  }

  function getCupSectionLabel() {
    return {
      tables: "Tabell",
      teams: "Lag",
      bracket: "Slutspel",
      players: "Spelare",
      goalies: "MÃƒÂ¥lvakter",
      stats: "Statistik",
      info: "Regler",
      matches: "Matcher"
    }[state.activeCupSection] || "Ãƒâ€“versikt";
  }

  function getViewTitle() {
    if (state.view === "match") return "Match";
    if (state.view === "cups" && state.activeCupId) {
      const cup = state.cups.find(function (entry) { return entry.id === state.activeCupId; });
      if (!cup) return "Cup";
      if (state.activeCupSection === "tables") return cup.name + " - tabeller";
      if (state.activeCupSection === "teams") return cup.name + " - lag";
      if (state.activeCupSection === "bracket") return cup.name + " - slutspel";
      if (state.activeCupSection === "players") return cup.name + " - spelare";
      if (state.activeCupSection === "goalies") return cup.name + " - mÃƒÂ¥lvakter";
      if (state.activeCupSection === "stats") return cup.name + " - statistik";
      if (state.activeCupSection === "info") return cup.name + " - cupinfo";
      if (state.activeCupSection === "matches") return cup.name + " - matcher";
      return cup.name;
    }
    if (state.view === "teams" && state.activeTeam) return state.activeTeam;
    if (state.view === "players" && state.activePlayer) return getPersonDisplayName(state.activePlayer);
    if (state.view === "goalies" && state.activeGoalie) return getPersonDisplayName(state.activeGoalie);
    return {
      overview: "Ãƒâ€“versikt",
      cups: "Cuper",
      teams: "Lagkartan",
      players: "Spelarhubben",
      goalies: "MÃƒÂ¥lvaktshubben",
      matches: "MatchflÃƒÂ¶de",
      about: "SEC"
    }[state.view] || "SEC";
  }

  function renderSearchResults(model) {
    const query = fold(state.query);
    const cupHits = state.cups.filter(function (cup) {
      return fold(cup.name + " " + cup.code + " " + cup.winner).includes(query);
    }).slice(0, 4);
    const teamHits = state.teams.filter(function (team) {
      return fold(team.name).includes(query);
    }).slice(0, 4);
    const personHits = buildPersonSearchHits(query).slice(0, 4);
    const matchHits = model.allMatches.filter(function (entry) {
      return fold(entry.cup.code + " " + entry.match.awayTeam + " " + entry.match.homeTeam).includes(query);
    }).slice(0, 4);
    const hits = []
      .concat(cupHits.map(function (cup) { return searchLink("#/cups/" + encodeURIComponent(cup.id), "Cup", cup.name, cup.matchCount + " matcher"); }))
      .concat(teamHits.map(function (team) { return searchLink("#/teams/" + encodeURIComponent(team.name), "Lag", team.name, team.matches + " matcher"); }))
      .concat(personHits.map(function (person) { return searchLink(person.href, person.type, person.name, person.meta); }))
      .concat(matchHits.map(function (entry) { return searchLink(getMatchUrl(entry.cup, entry.match), entry.cup.code, entry.match.awayTeam + " - " + entry.match.homeTeam, score(entry.match)); }));

    return `
      <section class="searchdrop">
        ${hits.length ? hits.join("") : `<div class="empty">Inga trÃƒÂ¤ffar fÃƒÂ¶r "${escapeHtml(state.query)}".</div>`}
      </section>
    `;
  }

  function searchLink(href, type, title, meta) {
    return `<a href="${href}"><span>${escapeHtml(type)}</span><strong>${escapeHtml(title)}</strong><em>${escapeHtml(meta)}</em></a>`;
  }

  function buildPersonSearchHits(query) {
    const map = new Map();
    state.players.forEach(function (player) {
      if (!fold(player.name + " " + player.team).includes(query)) return;
      const key = getPersonProfileKey(player.name);
      if (!map.has(key)) map.set(key, { player: null, goalie: null });
      map.get(key).player = player;
    });
    state.goalies.forEach(function (goalie) {
      if (!fold(goalie.name + " " + goalie.team).includes(query)) return;
      const key = getPersonProfileKey(goalie.name);
      if (!map.has(key)) map.set(key, { player: null, goalie: null });
      map.get(key).goalie = goalie;
    });
    return Array.from(map.values()).map(function (entry) {
      const player = entry.player;
      const goalie = entry.goalie;
      const person = player || goalie;
      const parts = [];
      if (player) parts.push(player.pts + " poÃ¤ng");
      if (goalie) parts.push(formatPercent(goalie.svp) + " SV%");
      return {
        href: player ? "#/players/" + encodeURIComponent(player.name) : "#/goalies/" + encodeURIComponent(goalie.name),
        type: player && goalie ? "Spelare/MÃ¥lvakt" : player ? "Spelare" : "MÃ¥lvakt",
        name: person.name,
        meta: parts.join(" Â· ")
      };
    });
  }

  function renderView(model) {
    if (state.view === "cups" && state.activeCupId) {
      const cup = state.cups.find(function (entry) { return entry.id === state.activeCupId; });
      if (state.activeCupSection === "tables") return renderCupTablesPage(cup);
      if (state.activeCupSection === "teams" && state.activeCupTeamName) {
        const team = state.teams.find(function (entry) { return entry.name === state.activeCupTeamName; }) || { name: state.activeCupTeamName };
        return renderTeamDetail(model, team, cup);
      }
      if (state.activeCupSection === "teams") return renderCupTeamsPage(cup);
      if (state.activeCupSection === "bracket") return renderCupBracketPage(cup);
      if (state.activeCupSection === "players") return renderCupPlayersPage(cup);
      if (state.activeCupSection === "goalies") return renderCupGoaliesPage(cup);
      if (state.activeCupSection === "stats") return renderCupStatsPage(cup);
      if (state.activeCupSection === "info") return renderCupInfoPage(cup);
      if (state.activeCupSection === "matches") return renderCupMatchesPage(cup);
      return renderCupDetail(model, cup);
    }
    if (state.view === "teams" && state.activeTeam) {
      return renderTeamDetail(model, state.teams.find(function (team) { return team.name === state.activeTeam; }));
    }
    if (state.view === "players" && state.activePlayer) {
      return renderPlayerDetail(model, state.players.find(function (player) { return player.name === state.activePlayer; }));
    }
    if (state.view === "goalies" && state.activeGoalie) {
      return renderGoalieDetail(model, state.goalies.find(function (goalie) { return goalie.name === state.activeGoalie; }));
    }
    if (state.view === "match") {
      const cup = state.cups.find(function (entry) { return entry.id === state.activeMatchCupId; });
      const match = cup?.matches.find(function (entry) { return entry.id === state.activeMatchId; });
      return cup && match ? renderMatchDetail(cup, match) : `<section class="emptyPage">Matchen hittades inte.</section>`;
    }

    return {
      overview: renderOverview,
      cups: renderCups,
      teams: renderTeams,
      players: renderPlayers,
      goalies: renderGoalies,
      matches: renderMatches,
      about: renderAbout
    }[state.view](model);
  }

  function renderOverview(model) {
    return `
      <section class="hero">
        <div class="heroCopy">
          <span class="tag">SEC</span>
          <h2>Svenska eHockey Cupen</h2>
          <p>FÃƒÂ¶lj cuper, tabeller, slutspel, lag, spelare, mÃƒÂ¥lvakter och senaste matcherna frÃƒÂ¥n hela SEC.</p>
          <div class="updateStrip">
            <span>Uppdaterad ${escapeHtml(formatClock())}</span>
            <span>${model.latestMatches[0] ? escapeHtml(model.latestMatches[0].cup.code + " Ã‚Â· " + formatDate(model.latestMatches[0].match.date)) : "VÃƒÂ¤ntar pÃƒÂ¥ matchdata"}</span>
          </div>
          <div class="actions">
            <a href="#/matches">Matcher</a>
            <a href="#/cups">Cuper</a>
          </div>
        </div>
        <div class="rink">
          <div class="rinkLine"></div>
          <div class="puck"></div>
          <strong>${model.latestCup ? escapeHtml(model.latestCup.code) : "SEC"}</strong>
          <span>${model.totalGoals} mÃƒÂ¥l registrerade</span>
        </div>
      </section>
      <section class="metricGrid">
        ${metric("Cuper", state.cups.length, "turneringar")}
        ${metric("Matcher", model.totalMatches, "i arkivet")}
        ${metric("Lag", state.teams.length, "unika namn")}
        ${metric("Spelare", state.players.length, "statistikrader")}
        ${metric("MÃƒÂ¥lvakter", state.goalies.length, "registrerade")}
        ${metric("MÃƒÂ¥l", model.totalGoals, "totalt")}
        ${metric("Snitt", model.avgGoals, "mÃƒÂ¥l per match")}
      </section>
      <section class="dashGrid">
        ${panel("Senaste matcher", renderMatchRows(model.latestMatches, 7))}
        ${panel("PoÃƒÂ¤ngtoppen", renderLeaderRows(model.topPlayers))}
        ${panel("MÃƒÂ¥lvaktstoppen", renderGoalieRows(model.topGoalies))}
      </section>
    `;
  }

  function renderCups(model) {
    return `
      <section class="cupMatrix">
        ${state.cups.map(renderCupCard).join("")}
      </section>
    `;
  }

  function renderCupCard(cup) {
    const cupLogo = isSummer(cup) ? "./sommarcuplogga.png" : "./SECLOGGA.png";
    const hasWinner = Boolean(cup.winner);
    return `
      <a class="cupTile ${isSummer(cup) ? "summer" : ""}" href="#/cups/${encodeURIComponent(cup.id)}">
        <img class="cupTileLogo" src="${cupLogo}" alt="" loading="lazy" decoding="async">
        <span class="cupTileCode">${escapeHtml(cup.code)}</span>
        <strong>${escapeHtml(cup.name)}</strong>
        <div class="cupTileStats">
          <b>${cup.matchCount}</b><em>matcher</em>
          <b>${cup.teams.length}</b><em>lag</em>
        </div>
        <p class="cupTileDate">${escapeHtml(formatCupDateRange(cup))}</p>
        <div class="cupTileWinner">
          ${hasWinner ? renderTeamLogo(cup.winner, "cupWinnerLogo") : ""}
          <span>
            <em>Vinnare</em>
            <b>${escapeHtml(cup.winner || "Ej klar")}</b>
          </span>
        </div>
      </a>
    `;
  }

  function renderCupHero(cup, options) {
    const opts = options || {};
    const full = opts.full !== false;
    const groupMatches = cup.matches.filter(function (match) { return !isPlayoffMatch(match); }).length;
    const playoffMatches = cup.matches.filter(isPlayoffMatch).length;
    const titleParts = splitCupTitle(opts.title || cup.name);
    return `
      <section class="cupHero ${full ? "full" : "compact"} ${isSummer(cup) ? "summer" : ""}">
        <div class="cupHeroCopy">
          <nav class="crumbs" aria-label="BrÃƒÂ¶dsmulor">
            <a href="#/overview">Start</a>
            <span>/</span>
            <a href="#/cups">Cuper</a>
            <span>/</span>
            <strong>${escapeHtml(cup.code)}</strong>
          </nav>
          ${opts.kicker === true ? `<p class="cupKicker">${escapeHtml(cup.code)}</p>` : ""}
          <h2>${escapeHtml(titleParts.main)}${titleParts.edition ? ` <span>${escapeHtml(titleParts.edition)}</span>` : ""}</h2>
          ${titleParts.sub ? `<p class="cupHeroSub">${escapeHtml(titleParts.sub)}</p>` : ""}
          <p>${escapeHtml(opts.description || cup.name)}</p>
          ${full ? `
            <div class="cupHeroStats">
              ${cupHeroStat(cup.teams.length, "Lag")}
              ${cupHeroStat(groupMatches, "Gruppmatcher")}
              ${cupHeroStat(playoffMatches, "Slutspelsmatcher")}
            </div>
          ` : ""}
        </div>
        ${full ? `
          <div class="cupHeroLogo">
            <img src="./SECLOGGA.png" alt="">
          </div>
        ` : ""}
      </section>
      ${opts.spotlight === false ? "" : renderCupSpotlight(cup)}
    `;
  }

  function cupHeroStat(value, label) {
    return `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
  }

  function splitCupTitle(title) {
    const clean = text(title);
    const match = clean.match(/^(Svenska eHockey Cupen)\s+(\d+(?:\.\d+)?)(?:\s+(.+))?$/i);
    if (match) return { main: match[1], edition: match[2], sub: match[3] || "" };
    return { main: clean, edition: "", sub: "" };
  }

  function renderCupSpotlight(cup) {
    const topPlayer = cup.topPlayers[0];
    const topGoalie = cup.topGoalies[0];
    return `
      <section class="cupSpotlight">
        ${topPlayer ? `
          <a class="spotlightCard" href="#/players/${encodeURIComponent(topPlayer.name)}">
            ${renderPlayerPortrait(topPlayer, "spotlightPortrait")}
            <div>
              <span>PoÃƒÂ¤ngkung</span>
              <strong>${renderPersonName(topPlayer.name)}</strong>
              <em>${renderTeamIdentityStatic(topPlayer.team, "teamLogoChip")}</em>
              <b>${topPlayer.pts} p</b>
            </div>
          </a>
        ` : ""}
        <div class="spotlightCard">
          ${cup.winner ? renderTeamLogo(cup.winner, "spotlightLogo") : `<img src="./SECLOGGA.png" alt="">`}
          <div>
            <span>Vinnare</span>
            <strong>${escapeHtml(cup.winner || "Ej klar")}</strong>
            <em>Finalist: ${escapeHtml(cup.runnerUp || "Ej klar")}</em>
          </div>
        </div>
        ${topGoalie ? `
          <a class="spotlightCard" href="#/goalies/${encodeURIComponent(topGoalie.name)}">
            ${renderPlayerPortrait(topGoalie, "spotlightPortrait")}
            <div>
              <span>MÃƒÂ¥lvaktskung</span>
              <strong>${renderPersonName(topGoalie.name)}</strong>
              <em>${renderTeamIdentityStatic(topGoalie.team, "teamLogoChip")}</em>
              <b>${formatPercent(topGoalie.svp)}</b>
            </div>
          </a>
        ` : ""}
      </section>
    `;
  }

  function renderCupDetail(model, cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const rows = cup.matches.slice().sort(compareMatches).slice(0, 10).map(function (match) {
      return { cup: cup, match: match };
    });
    const standings = buildStandings(cup);
    const bracket = buildBracket(cup);
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: "Cupsidan visar ÃƒÂ¶versikt, tabeller, lag, topplistor och matcher fÃƒÂ¶r den valda turneringen.",
        full: true
      })}
      ${renderCupSectionNav(cup)}
      <section class="sportGrid">
        ${panelWithAction("Tabeller", "FullstÃƒÂ¤ndig tabell", "#/cups/" + encodeURIComponent(cup.id) + "/tables", renderStandingsPreview(standings, cup.settings))}
        ${panelWithAction("SlutspelstrÃƒÂ¤d", "FullstÃƒÂ¤ndigt trÃƒÂ¤d", "#/cups/" + encodeURIComponent(cup.id) + "/bracket", renderBracketPreview(bracket, cup.settings, cup))}
      </section>
      <section class="dashGrid two">
        ${panelWithAction("Cupinfo", "FullstÃƒÂ¤ndiga regler", "#/cups/" + encodeURIComponent(cup.id) + "/info", renderCupSettings(cup.settings, { preview: true }))}
        ${panelWithAction("Matcher", "Alla matcher", "#/cups/" + encodeURIComponent(cup.id) + "/matches", renderCupMatchPreview(rows))}
        ${panelWithAction("Toppspelare", "All statistik", "#/cups/" + encodeURIComponent(cup.id) + "/stats", renderCupTopPlayerPreview(cup.topPlayers))}
        ${panelWithAction("ToppmÃƒÂ¥lvakter", "All statistik", "#/cups/" + encodeURIComponent(cup.id) + "/stats", renderCupTopGoaliePreview(cup.topGoalies))}
        ${panel("Lag i cupen", renderMiniTags(cup.teams, "teams"))}
      </section>
    `;
  }

  function renderCupTablesPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const standings = buildStandings(cup);
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· " + formatCupDateRange(cup) + " Ã‚Â· streck enligt cupinfo."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderStandings(standings, cup.settings, { full: true })}
      </section>
    `;
  }

  function renderCupBracketPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const bracket = buildBracket(cup);
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· " + bracket.reduce(function (sum, round) { return sum + ((round.series && round.series.length) || 0); }, 0) + " serier."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderBracket(bracket, cup.settings, { full: true, cup: cup })}
      </section>
    `;
  }

  function renderCupSectionNav(cup) {
    const base = "#/cups/" + encodeURIComponent(cup.id);
    const current = state.activeCupSection || "";
    const items = [
      ["", "Ãƒâ€“versikt"],
      ["teams", "Lag"],
      ["tables", "Tabell"],
      ["bracket", "Slutspel"],
      ["matches", "Matcher"],
      ["stats", "Statistik"],
      ["info", "Regler"]
    ];
    return `
      <nav class="cupSectionNav" aria-label="Cupmeny">
        ${items.map(function (item) {
          return `<a class="${current === item[0] ? "active" : ""}" href="${item[0] ? base + "/" + item[0] : base}">${escapeHtml(item[1])}</a>`;
        }).join("")}
      </nav>
    `;
  }

  function renderCupTeamsPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const rows = buildCupTeamRows(cup);
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· " + rows.length + " lag med matcher, mÃƒÂ¥l och resultat i cupen."
      })}
      ${renderCupSectionNav(cup)}
      <section class="cupTeamGrid">
        ${rows.map(function (team) {
          return `
            <a class="teamTile cupTeamTile" href="#/cups/${encodeURIComponent(cup.id)}/teams/${encodeURIComponent(team.name)}">
              ${renderTeamLogo(team.name, "teamLogoTile")}
              <strong>${escapeHtml(team.name)}</strong>
              <em>${team.matches} matcher Ã‚Â· ${team.wins} vinster Ã‚Â· ${team.goalsFor}-${team.goalsAgainst}</em>
              <span>${team.points} pts</span>
            </a>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderCupPlayersPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· all spelarstatistik frÃƒÂ¥n gruppspel och slutspel."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupPlayerStatsTable(cup.playerRows)}
      </section>
    `;
  }

  function renderCupGoaliesPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· rÃƒÂ¤ddningsprocent, GAA, rÃƒÂ¤ddningar och nollor."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupGoalieStatsTable(cup.goalieRows)}
      </section>
    `;
  }

  function renderCupStatsPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const mode = state.activeCupStatsMode || "all";
    const playerRows = mode === "group" ? cup.playerStageRows.group : mode === "playoffs" ? cup.playerStageRows.playoffs : cup.playerRows;
    const rawGoalieRows = mode === "group" ? cup.goalieStageRows.group : mode === "playoffs" ? cup.goalieStageRows.playoffs : cup.goalieRows;
    const goalieRows = state.activeCupGoalieEligibleOnly ? filterEligibleCupGoalies(rawGoalieRows, getMatchesForStatsMode(cup, mode)) : rawGoalieRows;
    const modeLabel = mode === "group" ? "Gruppspel" : mode === "playoffs" ? "Slutspel" : "All statistik";
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· spelare och mÃƒÂ¥lvakter uppdelat pÃƒÂ¥ gruppspel och slutspel."
      })}
      ${renderCupSectionNav(cup)}
      <section class="statPageGrid">
        ${panelWithTools("Spelare - " + modeLabel, renderCupStatsModeTabs(cup, mode), renderCupPlayerStatsTable(playerRows))}
        ${panelWithTools("M\u00e5lvakter - " + modeLabel, renderCupGoalieEligibilityToggle(cup, mode), renderCupGoalieStatsTable(goalieRows))}
      </section>
    `;
  }

  function getMatchesForStatsMode(cup, mode) {
    if (mode === "group") return cup.matches.filter(function (match) { return !isPlayoffMatch(match); });
    if (mode === "playoffs") return cup.matches.filter(isPlayoffMatch);
    return cup.matches;
  }

  function renderCupStatsModeTabs(cup, activeMode) {
    const modes = [
      ["all", "Allt"],
      ["group", "Gruppspel"],
      ["playoffs", "Slutspel"]
    ];
    return `
      <nav class="subTabs" aria-label="StatistiklÃƒÂ¤ge">
        ${modes.map(function (mode) {
          const href = "#/cups/" + encodeURIComponent(cup.id) + "/stats?mode=" + encodeURIComponent(mode[0]) + (state.activeCupGoalieEligibleOnly ? "&eligible=1" : "");
          return `<a class="${activeMode === mode[0] ? "active" : ""}" href="${href}">${mode[1]}</a>`;
        }).join("")}
      </nav>
    `;
  }

  function renderCupGoalieEligibilityToggle(cup, mode) {
    const href = "#/cups/" + encodeURIComponent(cup.id) + "/stats?mode=" + encodeURIComponent(mode) + (state.activeCupGoalieEligibleOnly ? "" : "&eligible=1");
    return `
      <a class="toggleChip ${state.activeCupGoalieEligibleOnly ? "active" : ""}" href="${href}">
        <span class="toggleBox">${state.activeCupGoalieEligibleOnly ? "✓" : ""}</span>
        <span>Minst 50% av lagets matcher</span>
      </a>
    `;
  }

  function renderCupInfoPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· cupinfo, behÃƒÂ¶righet, BO-format och spelargrÃƒÂ¤nser."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupSettings(cup.settings, { full: true })}
      </section>
      <section class="fullPagePanel">
        ${renderSharedSecRules()}
      </section>
    `;
  }

  function renderCupMatchesPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const teams = cup.teams.slice().sort(function (a, b) {
      return a.localeCompare(b, "sv");
    });
    const selectedTeam = teams.includes(state.activeCupTeamFilter) ? state.activeCupTeamFilter : "";
    const filteredMatches = selectedTeam
      ? cup.matches.filter(function (match) {
        return match.awayTeam === selectedTeam || match.homeTeam === selectedTeam;
      })
      : cup.matches;
    const rows = filteredMatches.slice().sort(compareMatches).map(function (match) {
      return { cup: cup, match: match };
    });
    return `
      ${renderCupHero(cup, {
        title: cup.name,
        description: cup.name + " Ã‚Â· " + rows.length + " av " + cup.matches.length + " matcher" + (selectedTeam ? " fÃƒÂ¶r " + selectedTeam : "") + "."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupMatchFilter(cup, teams, selectedTeam)}
        ${renderCupMatchSchedule(rows)}
      </section>
    `;
  }

  function renderCupMatchFilter(cup, teams, selectedTeam) {
    return `
      <div class="matchFilter">
        <label>
          <span>Lag</span>
          <select data-cup-team-filter data-cup-id="${escapeHtml(cup.id)}">
            <option value="">Alla lag</option>
            ${teams.map(function (team) {
              return `<option value="${escapeHtml(team)}" ${team === selectedTeam ? "selected" : ""}>${escapeHtml(team)}</option>`;
            }).join("")}
          </select>
        </label>
      </div>
    `;
  }

  function renderMatchDetail(cup, match) {
    const parsed = parseMatchStatsSummary(match.statsSummary, match);
    const playerStats = hasMatchStats(match.playerStats) ? match.playerStats : parsed.playerStats;
    const goalieStats = hasMatchStats(match.goalieStats) ? match.goalieStats : parsed.goalieStats;
    const events = parseMatchEvents(match.goalsSummary);
    return `
      <section class="matchDetailHero">
        <a class="backLink" href="#/cups/${encodeURIComponent(cup.id)}/matches">Tillbaka till matcher</a>
        <div class="crumbs">
          <a href="#/overview">Start</a>
          <span>/</span>
          <a href="#/cups/${encodeURIComponent(cup.id)}">${escapeHtml(cup.code)}</a>
          <span>/</span>
          <strong>Match</strong>
        </div>
        <div class="matchDetailScoreboard">
          ${renderMatchDetailTeam(cup, match.awayTeam)}
          <div class="matchDetailCenter">
            <span>${escapeHtml(match.group || (isPlayoffMatch(match) ? "Slutspel" : "Gruppspel"))}</span>
            <strong>${score(match)}</strong>
            <em>${escapeHtml(formatDate(match.date))}${match.time ? " Ã‚Â· " + escapeHtml(match.time) : ""}</em>
          </div>
          ${renderMatchDetailTeam(cup, match.homeTeam)}
        </div>
      </section>
      <section class="matchDetailGrid">
        ${panel("MatchÃƒÂ¶versikt", renderMatchStatBoard(match, playerStats, goalieStats))}
        ${panel("HÃƒÂ¤ndelser", renderMatchTimeline(events))}
      </section>
      <section class="matchTeamStatsGrid">
        ${renderMatchPlayerSide(match.awayTeam, playerStats.away)}
        ${renderMatchPlayerSide(match.homeTeam, playerStats.home)}
      </section>
      <section class="matchTeamStatsGrid">
        ${renderMatchGoalieSide(match.awayTeam, goalieStats.away)}
        ${renderMatchGoalieSide(match.homeTeam, goalieStats.home)}
      </section>
    `;
  }

  function renderMatchDetailTeam(cup, teamName) {
    return `
      <a class="matchDetailTeam" href="#/cups/${encodeURIComponent(cup.id)}/teams/${encodeURIComponent(teamName)}">
        ${renderTeamLogo(teamName, "teamLogoHero")}
        <strong>${escapeHtml(teamName)}</strong>
      </a>
    `;
  }

  function renderMatchStatBoard(match, playerStats, goalieStats) {
    const shots = getMatchShots(match, goalieStats);
    const awayPim = sumMatchRows(playerStats.away, "pim");
    const homePim = sumMatchRows(playerStats.home, "pim");
    const rows = [
      shots ? { label: "Skott", away: shots.away, home: shots.home } : null,
      { label: "MÃƒÂ¥l", away: match.awayScore, home: match.homeScore },
      { label: "PIM", away: awayPim, home: homePim },
      { label: "MÃƒÂ¥lvaktsrÃƒÂ¤ddningar", away: sumMatchRows(goalieStats.away, "sv"), home: sumMatchRows(goalieStats.home, "sv") },
      { label: "SV%", away: goalieStats.away[0] ? formatPercent(goalieStats.away[0].svp) : "-", home: goalieStats.home[0] ? formatPercent(goalieStats.home[0].svp) : "-" }
    ].filter(Boolean);
    return `
      <div class="matchStatBoard">
        <div class="matchStatHead"><span>${escapeHtml(match.awayTeam)}</span><span></span><span>${escapeHtml(match.homeTeam)}</span></div>
        ${rows.map(function (row) {
          return `<div class="matchStatRow"><strong>${escapeHtml(formatMatchValue(row.away))}</strong><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(formatMatchValue(row.home))}</strong></div>`;
        }).join("")}
      </div>
    `;
  }

  function renderMatchTimeline(events) {
    if (!events.length) return `<div class="empty">Ingen matchsummering finns registrerad.</div>`;
    return `
      <div class="matchTimeline">
        ${events.map(function (event) {
          const typeLabel = event.type === "penalty" ? "Utvisning" : event.type === "goal" ? "MÃƒÂ¥l" : "Info";
          const description = event.type === "goal"
            ? event.player + (event.assists.length ? " (" + event.assists.join(", ") + ")" : "") + (event.tags.length ? " Ã‚Â· " + event.tags.join(", ") : "")
            : event.type === "penalty"
              ? event.player + (event.penalty ? " - " + event.penalty : "") + (event.pim ? " (" + event.pim + " min)" : "")
              : event.body;
          return `
            <div class="matchEvent is-${escapeHtml(event.type)}">
              <span>${escapeHtml(event.time || "-")}</span>
              <b>${escapeHtml(typeLabel)}</b>
              <strong>${escapeHtml(event.team || "")}</strong>
              <em>${escapeHtml(description)}</em>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderMatchPlayerSide(teamName, rows) {
    const sorted = (rows || []).slice().sort(function (a, b) {
      return number(b.pts) - number(a.pts) || number(b.g) - number(a.g) || number(b.a) - number(a.a) || a.name.localeCompare(b.name, "sv");
    });
    return panel(teamName + " - spelare", sorted.length ? `
      <div class="dataTable matchStatsTable">
        <table>
          <thead><tr><th>Spelare</th><th>G</th><th>A</th><th>PTS</th><th>PIM</th></tr></thead>
          <tbody>${sorted.map(function (row) {
            return `<tr><td><a href="#/players/${encodeURIComponent(row.name)}">${renderPersonName(row.name)}</a></td><td>${row.g}</td><td>${row.a}</td><td><strong>${row.pts}</strong></td><td>${row.pim}</td></tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    ` : `<div class="empty">Ingen spelarstatistik finns registrerad.</div>`);
  }

  function renderMatchGoalieSide(teamName, rows) {
    const sorted = (rows || []).slice().sort(sortGoalies);
    return panel(teamName + " - mÃƒÂ¥lvakter", sorted.length ? `
      <div class="dataTable matchStatsTable">
        <table>
          <thead><tr><th>MÃƒÂ¥lvakt</th><th>SA</th><th>GA</th><th>SV</th><th>SV%</th></tr></thead>
          <tbody>${sorted.map(function (row) {
            return `<tr><td><a href="#/goalies/${encodeURIComponent(row.name)}">${renderPersonName(row.name)}</a></td><td>${row.sa}</td><td>${row.ga}</td><td>${row.sv}</td><td><strong>${formatPercent(row.svp)}</strong></td></tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    ` : `<div class="empty">Ingen mÃƒÂ¥lvaktsstatistik finns registrerad.</div>`);
  }

  function normalizeMatchStatSides(stats, normalizer) {
    const empty = { away: [], home: [] };
    if (!stats) return empty;
    if (Array.isArray(stats.away) || Array.isArray(stats.home)) {
      return {
        away: normalizer(stats.away || []),
        home: normalizer(stats.home || [])
      };
    }
    return empty;
  }

  function normalizePlayerRowsForMatch(rows) {
    return (rows || []).map(function (row) {
      return {
        name: text(row.displayName || row.player || row.name || "OkÃƒÂ¤nd spelare"),
        team: text(row.team),
        gp: number(row.gp) || 1,
        g: number(row.g),
        a: number(row.a),
        pts: number(row.pts),
        pim: number(row.pim)
      };
    });
  }

  function normalizeGoalieRowsForMatch(rows) {
    return (rows || []).map(function (row) {
      const ga = number(row.ga);
      const sv = number(row.sv);
      const sa = number(row.sa) || ga + sv;
      return finalizeGoalie({
        name: text(row.displayName || row.player || row.name || "OkÃƒÂ¤nd mÃƒÂ¥lvakt"),
        team: text(row.team),
        gp: number(row.gp) || 1,
        sa: sa,
        ga: ga,
        sv: sv,
        svp: number(row.svp),
        gaa: number(row.gaa) || ga,
        so: number(row.so)
      });
    });
  }

  function hasMatchStats(stats) {
    return Boolean(stats && ((stats.away && stats.away.length) || (stats.home && stats.home.length)));
  }

  function parseMatchStatsSummary(summary, match) {
    const result = { playerStats: { away: [], home: [] }, goalieStats: { away: [], home: [] } };
    let currentTeam = "";
    text(summary).split("|").map(text).filter(Boolean).forEach(function (part) {
      const header = part.match(/^([^:]+):\s*(.*)$/);
      if (header && !/^mÃƒÂ¥lvakt$/i.test(text(header[1]))) {
        currentTeam = text(header[1]);
        part = text(header[2]);
        if (!part) return;
      }
      const side = getMatchStatSide(currentTeam, match);
      if (!side) return;
      const goalie = parseMatchGoalieStatLine(part, currentTeam);
      if (goalie) {
        result.goalieStats[side].push(goalie);
        return;
      }
      const player = parseMatchPlayerStatLine(part, currentTeam);
      if (player) result.playerStats[side].push(player);
    });
    return result;
  }

  function parseMatchPlayerStatLine(line, teamName) {
    const match = text(line).match(/^(.*?)\s+(-?\d+)G\s+(-?\d+)A\s+(-?\d+)PTS\s+(-?\d+)PIM$/i);
    if (!match) return null;
    return {
      name: text(match[1]),
      team: teamName,
      gp: 1,
      g: number(match[2]),
      a: number(match[3]),
      pts: number(match[4]),
      pim: number(match[5])
    };
  }

  function parseMatchGoalieStatLine(line, teamName) {
    const match = text(line).match(/^MÃƒÂ¥lvakt:\s*(.*?)\s+(-|\d+)SA\s+(\d+)GA\s+(\d+)SV\s+(-|[.\d,]+)SV%$/i);
    if (!match) return null;
    const ga = number(match[3]);
    const sv = number(match[4]);
    const sa = match[2] === "-" ? ga + sv : number(match[2]);
    return finalizeGoalie({
      name: text(match[1]),
      team: teamName,
      gp: 1,
      sa: sa,
      ga: ga,
      sv: sv,
      svp: sa ? sv / sa : 0,
      gaa: ga,
      so: ga === 0 ? 1 : 0
    });
  }

  function getMatchStatSide(teamName, match) {
    const teamKey = fold(teamName);
    if (teamKey === fold(match.awayTeam)) return "away";
    if (teamKey === fold(match.homeTeam)) return "home";
    return "";
  }

  function parseMatchEvents(summary) {
    return text(summary).split("|").map(text).filter(Boolean).map(function (line) {
      const match = line.match(/^(\d{1,2}:\d{2})\s+(.+)$/);
      const time = match ? match[1] : "";
      const body = match ? text(match[2]) : line;
      const penalty = body.match(/^UTV\s+(.+?)\s+-\s+(.+?)(?:\s+([A-Za-zÃƒâ€¦Ãƒâ€žÃƒâ€“ÃƒÂ¥ÃƒÂ¤ÃƒÂ¶ -]+))?\s+(\d+)\s+min$/i);
      if (penalty) {
        return {
          type: "penalty",
          time: time,
          team: text(penalty[1]),
          player: text(penalty[2]),
          penalty: text(penalty[3] || ""),
          pim: number(penalty[4]),
          body: body
        };
      }
      const goal = body.match(/^(.+?)\s+-\s+(.+)$/);
      if (goal) {
        const detail = text(goal[2]);
        const assistsMatch = detail.match(/^(.*?)\s*\((.*?)\)\s*(.*)$/);
        const tags = [];
        let player = detail;
        let assists = [];
        let rest = "";
        if (assistsMatch) {
          player = text(assistsMatch[1]);
          assists = assistsMatch[2].split(",").map(text).filter(Boolean);
          rest = text(assistsMatch[3]);
        }
        (rest.match(/\(([^)]+)\)/g) || []).forEach(function (tag) {
          tags.push(tag.replace(/[()]/g, ""));
        });
        return {
          type: "goal",
          time: time,
          team: text(goal[1]),
          player: text(player.replace(/\s*\([^)]*\)\s*$/, "")),
          assists: assists,
          tags: tags,
          body: body
        };
      }
      return { type: "info", time: time, team: "", player: "", assists: [], tags: [], body: body };
    });
  }

  function getMatchShots(match, goalieStats) {
    if (match.awayShots !== null || match.homeShots !== null) {
      return { away: match.awayShots, home: match.homeShots };
    }
    const awayGoalieSa = sumMatchRows(goalieStats.away, "sa");
    const homeGoalieSa = sumMatchRows(goalieStats.home, "sa");
    if (!awayGoalieSa && !homeGoalieSa) return null;
    return { away: homeGoalieSa, home: awayGoalieSa };
  }

  function sumMatchRows(rows, key) {
    return (rows || []).reduce(function (sum, row) {
      return sum + number(row[key]);
    }, 0);
  }

  function formatMatchValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  }

  function renderTeams() {
    return `
      <p class="viewIntro">Alla lag samlade som scanbara brickor. Klicka ett lag fÃƒÂ¶r snabb historik.</p>
      <section class="teamGrid">
        ${state.teams.slice(0, 240).map(function (team) {
          return `
            <a class="teamTile" href="#/teams/${encodeURIComponent(team.name)}">
              ${renderTeamLogo(team.name, "teamLogoTile")}
              <strong>${escapeHtml(team.name)}</strong>
              <em>${team.matches} matcher Ã‚Â· ${team.wins} vinster</em>
            </a>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderTeamDetail(model, team, cup) {
    if (!team) return `<section class="emptyPage">Laget hittades inte.</section>`;
    return renderTeamDetailModern(model, team, cup);
    const matches = model.allMatches.filter(function (entry) {
      return entry.match.awayTeam === team.name || entry.match.homeTeam === team.name;
    }).slice(0, 16);
    const roster = buildTeamRoster(team.name);
    const cupRows = buildTeamCupRows(team.name);
    return `
      <section class="detailHero">
        <a href="#/teams">Tillbaka till lag</a>
        ${renderTeamLogo(team.name, "teamLogoHero")}
        <h2>${escapeHtml(team.name)}</h2>
        <p>${team.cups} cuper, ${team.matches} matcher, ${team.wins} vinster och ${team.goalsFor} mÃƒÂ¥l framÃƒÂ¥t.</p>
      </section>
      <section class="metricGrid compact">
        ${metric("Cuper", team.cups, "deltaganden")}
        ${metric("Matcher", team.matches, "totalt")}
        ${metric("Vinster", team.wins, "registrerade")}
        ${metric("MÃƒÂ¥l", team.goalsFor, "gjorda")}
      </section>
      <section class="sportGrid">
        ${panel("Lagets SEC-sÃƒÂ¤songer", renderTeamCupTable(cupRows))}
        ${panel("Profiler i laget", renderLeaderRows(roster.slice(0, 12)))}
        ${panel("MÃƒÂ¥lvakter i laget", renderGoalieRows(buildTeamGoalies(team.name).slice(0, 8)))}
      </section>
      ${panel("Senaste matcher", renderMatchRows(matches, 16))}
    `;
  }

  function renderTeamDetailModern(model, team, cup) {
    const scopedMatches = (cup ? cup.matches.map(function (match) { return { cup: cup, match: match }; }) : model.allMatches)
      .filter(function (entry) {
        return entry.match.awayTeam === team.name || entry.match.homeTeam === team.name;
      })
      .sort(function (a, b) { return compareMatches(a.match, b.match); });
    const playerRows = getTeamPlayerRows(team.name, cup);
    const goalieRows = getTeamGoalieRows(team.name, cup);
    const roster = buildTeamRosterRows(playerRows, goalieRows);
    const goalsFor = scopedMatches.reduce(function (sum, entry) {
      return sum + number(entry.match.awayTeam === team.name ? entry.match.awayScore : entry.match.homeScore);
    }, 0);
    const goalsAgainst = scopedMatches.reduce(function (sum, entry) {
      return sum + number(entry.match.awayTeam === team.name ? entry.match.homeScore : entry.match.awayScore);
    }, 0);
    const wins = scopedMatches.filter(function (entry) {
      const gf = number(entry.match.awayTeam === team.name ? entry.match.awayScore : entry.match.homeScore);
      const ga = number(entry.match.awayTeam === team.name ? entry.match.homeScore : entry.match.awayScore);
      return gf > ga;
    }).length;
    const base = cup ? "#/cups/" + encodeURIComponent(cup.id) + "/teams/" + encodeURIComponent(team.name) : "#/teams/" + encodeURIComponent(team.name);
    const activeTab = state.activeTeamTab;
    const crumbCup = cup || getLatestTeamCup(team.name);
    return `
      <section class="detailHero teamDetailHero">
        ${renderTeamBreadcrumb(team.name, crumbCup)}
        <div class="teamHeroMain">
          ${renderTeamLogo(team.name, "teamLogoHero teamHeroLogoLarge")}
          <div>
            <span class="teamHeroKicker">${escapeHtml((cup || crumbCup)?.code || "SEC")}</span>
            <h2>${escapeHtml(team.name)}</h2>
            <p>${cup ? "Spelare och matcher fr\u00e5n just den h\u00e4r cupen." : `${scopedMatches.length} matcher, ${wins} vinster och ${goalsFor}-${goalsAgainst} i m\u00e5l.`}</p>
          </div>
        </div>
      </section>      <section class="metricGrid compact">
        ${metric(cup ? "Cup" : "Cuper", cup ? cup.code : String(team.cups || 0), cup ? "vald turnering" : "deltaganden")}
        ${metric("Matcher", scopedMatches.length, "totalt")}
        ${metric("Vinster", wins, "registrerade")}
        ${metric("MÃƒÂ¥l", goalsFor, "gjorda")}
      </section>
      ${renderTeamTabs(base, activeTab)}
      <section class="fullPagePanel teamTabPanel">
        ${activeTab === "matches" ? renderTeamAllMatches(scopedMatches) : ""}
        ${activeTab === "stats" ? renderTeamCurrentStats(playerRows, goalieRows) : ""}
        ${activeTab === "history" ? renderTeamHistoricalStats(team.name) : ""}
        ${activeTab === "roster" ? renderTeamRosterPanel(team.name, roster) : ""}
      </section>
    `;
  }

  function renderTeamBreadcrumb(teamName, cup) {
    return `
      <nav class="crumbs profileCrumbs" aria-label="Br\u00f6dsmulor">
        <a href="#/cups">Start</a>
        <span>/</span>
        <a href="#/cups">Cuper</a>
        ${cup ? `<span>/</span><a href="#/cups/${encodeURIComponent(cup.id)}">${escapeHtml(cup.code)}</a>` : ""}
        <span>/</span>
        <strong>${escapeHtml(teamName)}</strong>
      </nav>
    `;
  }

  function getLatestTeamCup(teamName) {
    return state.cups.find(function (cup) {
      return cup.matches.some(function (match) {
        return match.awayTeam === teamName || match.homeTeam === teamName;
      }) || cup.playerRows.some(function (row) {
        return row.team === teamName;
      }) || cup.goalieRows.some(function (row) {
        return row.team === teamName;
      });
    }) || null;
  }

  function renderTeamTabs(base, activeTab) {
    const tabs = [
      ["roster", "LaguppstÃƒÂ¤llning"],
      ["matches", "Alla matcher"],
      ["stats", "Statistik"],
      ["history", "Historisk statistik"]
    ];
    return `
      <nav class="subTabs teamTabs" aria-label="Lagflikar">
        ${tabs.map(function (tab) {
          return `<a class="${activeTab === tab[0] ? "active" : ""}" href="${base}${tab[0] === "roster" ? "" : "?tab=" + tab[0]}">${escapeHtml(tab[1])}</a>`;
        }).join("")}
      </nav>
    `;
  }

  function renderTeamRosterPanel(teamName, roster, title) {
    return `
      <div class="panelHead"><h3>LaguppstÃƒÂ¤llning</h3></div>
      <div class="teamRosterGrid">
        ${roster.length ? roster.map(renderTeamRosterCard).join("") : `<div class="empty">Inga spelare hittades fÃƒÂ¶r ${escapeHtml(teamName)}.</div>`}
      </div>
    `;
  }

  function renderTeamRosterCard(row) {
    const href = row.role === "MÃƒÂ¥lvakt" && !row.gp ? "#/goalies/" + encodeURIComponent(row.name) : "#/players/" + encodeURIComponent(row.name);
    const statLine = [
      row.gp ? row.gp + " GP" : "",
      row.pts ? row.pts + " PTS" : "",
      row.goalieGp ? row.goalieGp + " GP mÃƒÂ¥lvakt" : "",
      row.sa ? formatPercent(row.svp) + " SV%" : ""
    ].filter(Boolean).join(" Ã‚Â· ");
    return `
      <a class="teamRosterCard" href="${href}">
        ${renderPlayerPortrait(row, "previewPortrait")}
        <span>
          <strong>${renderPersonName(row.name)}</strong>
          <em>${escapeHtml(row.role)}</em>
          <b>${escapeHtml(statLine || "Registrerad")}</b>
        </span>
      </a>
    `;
  }

  function renderTeamAllMatches(entries) {
    return `
      <div class="panelHead"><h3>Alla matcher</h3></div>
      ${renderMatchRows(entries, entries.length)}
    `;
  }

  function renderTeamCurrentStats(playerRows, goalieRows) {
    return `
      <div class="teamStatsGrid">
        ${panel("Utespelare", renderCupPlayerStatsTable(playerRows))}
        ${panel("MÃƒÂ¥lvakter", renderCupGoalieStatsTable(goalieRows))}
      </div>
    `;
  }

  function renderTeamHistoricalStats(teamName) {
    const playerRows = getTeamPlayerRows(teamName, null);
    const goalieRows = getTeamGoalieRows(teamName, null);
    const cupRows = buildTeamCupRows(teamName);
    const roster = buildTeamRosterRows(playerRows, goalieRows);
    return `
      ${renderTeamRosterPanel(teamName, roster)}
      <div class="teamStatsGrid">
        ${panel("Cuphistorik", renderTeamCupTable(cupRows))}
        ${panel("Historiska utespelare", renderCupPlayerStatsTable(playerRows))}
        ${panel("Historiska mÃƒÂ¥lvakter", renderCupGoalieStatsTable(goalieRows))}
      </div>
    `;
  }

  function getTeamPlayerRows(teamName, cup) {
    const rows = (cup ? cup.playerRows : state.cups.flatMap(function (entry) { return entry.playerRows || []; }))
      .filter(function (row) { return row.team === teamName; });
    return aggregateTeamPlayerRows(rows);
  }

  function getTeamGoalieRows(teamName, cup) {
    const rows = (cup ? cup.goalieRows : state.cups.flatMap(function (entry) { return entry.goalieRows || []; }))
      .filter(function (row) { return row.team === teamName; });
    return aggregateTeamGoalieRows(rows);
  }

  function aggregateTeamPlayerRows(rows) {
    const map = new Map();
    rows.forEach(function (row) {
      const key = getRosterPersonKey(row);
      if (!map.has(key)) {
        map.set(key, { name: row.name, team: row.team, playerId: row.playerId || "", gp: 0, g: 0, a: 0, pts: 0, pim: 0 });
      }
      const target = map.get(key);
      target.gp += number(row.gp);
      target.g += number(row.g);
      target.a += number(row.a);
      target.pts += number(row.pts);
      target.pim += number(row.pim);
    });
    return Array.from(map.values()).sort(sortPlayers);
  }

  function aggregateTeamGoalieRows(rows) {
    const map = new Map();
    rows.forEach(function (row) {
      const key = getRosterPersonKey(row);
      if (!map.has(key)) {
        map.set(key, { name: row.name, team: row.team, playerId: row.playerId || "", gp: 0, sa: 0, ga: 0, sv: 0, svp: 0, gaa: 0, so: 0 });
      }
      const target = map.get(key);
      target.gp += number(row.gp);
      target.sa += number(row.sa);
      target.ga += number(row.ga);
      target.sv += number(row.sv);
      target.so += number(row.so);
    });
    return Array.from(map.values()).map(finalizeGoalie).sort(sortGoalies);
  }

  function buildTeamRosterRows(playerRows, goalieRows) {
    const map = new Map();
    playerRows.forEach(function (row) {
      const key = getRosterPersonKey(row);
      map.set(key, Object.assign({}, row, { role: "Utespelare", goalieGp: 0, sa: 0, sv: 0, ga: 0, svp: 0 }));
    });
    goalieRows.forEach(function (row) {
      const key = getRosterPersonKey(row);
      if (!map.has(key)) {
        map.set(key, { name: row.name, team: row.team, gp: 0, g: 0, a: 0, pts: 0, pim: 0, role: "MÃƒÂ¥lvakt", goalieGp: row.gp, sa: row.sa, sv: row.sv, ga: row.ga, svp: row.svp });
      } else {
        const target = map.get(key);
        target.role = "Utespelare/MÃƒÂ¥lvakt";
        target.goalieGp = row.gp;
        target.sa = row.sa;
        target.sv = row.sv;
        target.ga = row.ga;
        target.svp = row.svp;
      }
    });
    return Array.from(map.values()).sort(function (a, b) {
      return number(b.pts) - number(a.pts) || number(b.goalieGp) - number(a.goalieGp) || a.name.localeCompare(b.name, "sv");
    });
  }

  function getRosterPersonKey(row) {
    const parsed = parsePersonCountry(row?.name || row?.player || "");
    return fold(parsed.name || row?.name || row?.player || "");
  }

  function renderPlayers() {
    return `
      <p class="viewIntro">En kompakt leaderboard ÃƒÂ¶ver spelare frÃƒÂ¥n all cupdata.</p>
      <section class="playerBoard">
        ${state.players.slice(0, 160).map(function (player, index) {
          return `
            <a class="playerRow" href="#/players/${encodeURIComponent(player.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(player.name)}</strong>
              <em>${escapeHtml(player.team || "OkÃƒÂ¤nt lag")}</em>
              <b>${player.pts}p</b>
            </a>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderGoalies() {
    return `
      <p class="viewIntro">RÃƒÂ¤ddningsprocent, rÃƒÂ¤ddningar, GAA och historik fÃƒÂ¶r mÃƒÂ¥lvakter frÃƒÂ¥n bÃƒÂ¥da datakÃƒÂ¤llorna.</p>
      <section class="playerBoard">
        ${state.goalies.slice(0, 160).map(function (goalie, index) {
          return `
            <a class="playerRow" href="#/goalies/${encodeURIComponent(goalie.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(goalie.name)}</strong>
              <em>${escapeHtml(goalie.team || "OkÃƒÂ¤nt lag")} Ã‚Â· ${goalie.gp} GP</em>
              <b>${formatPercent(goalie.svp)}</b>
            </a>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderPlayerDetail(model, player) {
    if (!player) return `<section class="emptyPage">Spelaren hittades inte.</section>`;
    return `
      <section class="detailHero">
        <a href="#/players">Tillbaka till spelare</a>
        <h2>${renderPersonName(player.name)}</h2>
        <p>${escapeHtml(player.team || "OkÃƒÂ¤nt lag")} Ã‚Â· ${player.cups.size} cuper Ã‚Â· ${player.gp} GP Ã‚Â· ${player.pts} poÃƒÂ¤ng.</p>
      </section>
      <section class="metricGrid compact">
        ${metric("PoÃƒÂ¤ng", player.pts, "totalt")}
        ${metric("MÃƒÂ¥l", player.g, "gjorda")}
        ${metric("Assist", player.a, "passningar")}
        ${metric("Matcher", player.gp, "GP")}
      </section>
      <section class="sportGrid">
        ${panel("Cuphistorik", renderPlayerCupTable(player))}
        ${panel("Lagresa", renderMiniTags(Array.from(player.teams), "teams"))}
      </section>
    `;
  }

  function renderGoalieDetail(model, goalie) {
    if (!goalie) return `<section class="emptyPage">MÃƒÂ¥lvakten hittades inte.</section>`;
    return `
      <section class="detailHero">
        <a href="#/goalies">Tillbaka till mÃƒÂ¥lvakter</a>
        <h2>${renderPersonName(goalie.name)}</h2>
        <p>${escapeHtml(goalie.team || "OkÃƒÂ¤nt lag")} Ã‚Â· ${goalie.cups.size} cuper Ã‚Â· ${goalie.gp} GP Ã‚Â· ${formatPercent(goalie.svp)} SV%.</p>
      </section>
      <section class="metricGrid compact">
        ${metric("SV%", formatPercent(goalie.svp), "rÃƒÂ¤ddningsprocent")}
        ${metric("GAA", formatDecimal(goalie.gaa), "mÃƒÂ¥l emot/match")}
        ${metric("SV", goalie.sv, "rÃƒÂ¤ddningar")}
        ${metric("SO", goalie.so, "hÃƒÂ¥llna nollor")}
      </section>
      <section class="sportGrid">
        ${panel("Cuphistorik", renderGoalieCupTable(goalie))}
        ${panel("Lagresa", renderMiniTags(Array.from(goalie.teams), "teams"))}
      </section>
    `;
  }

  function renderMatches(model) {
    return `
      <p class="viewIntro">Senaste registrerade matcher frÃƒÂ¥n hela datan, oavsett cup.</p>
      ${panel("Matcher", renderMatchRows(model.allMatches.slice(0, 90), 90))}
    `;
  }

  function renderAbout(model) {
    return `
      <section class="manifest">
        <span>SEC</span>
        <h2>Svenska eHockey Cupen</h2>
        <p>Sidan samlar aktuell cupdata, historik, matchflÃƒÂ¶de, tabeller, slutspel, lag, spelare och mÃƒÂ¥lvakter pÃƒÂ¥ ett stÃƒÂ¤lle.</p>
        <p>Senaste registrerade match: <strong>${model.latestMatches[0] ? escapeHtml(model.latestMatches[0].cup.code + " Ã‚Â· " + model.latestMatches[0].match.awayTeam + " - " + model.latestMatches[0].match.homeTeam + " " + score(model.latestMatches[0].match)) : "Ingen match hittad"}</strong>.</p>
      </section>
    `;
  }

  function metric(label, value, meta) {
    return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(meta)}</em></article>`;
  }

  function panel(title, body) {
    return `<section class="panel"><h3>${escapeHtml(title)}</h3>${body}</section>`;
  }

  function panelWithAction(title, actionLabel, href, body) {
    return `
      <section class="panel">
        <div class="panelHead">
          <h3>${escapeHtml(title)}</h3>
          <a href="${href}">${escapeHtml(actionLabel)}</a>
        </div>
        ${body}
      </section>
    `;
  }

  function panelWithTools(title, tools, body) {
    return `
      <section class="panel">
        <div class="panelHead panelHeadTools">
          <h3>${escapeHtml(title)}</h3>
          ${tools}
        </div>
        ${body}
      </section>
    `;
  }

  function renderMatchRows(entries, limit) {
    const rows = entries.slice(0, limit).map(function (entry) {
      return `
        <a class="matchRow" href="${getMatchUrl(entry.cup, entry.match)}">
          <span>${escapeHtml(entry.cup.code)}</span>
          <strong class="matchTeams">
            ${renderTeamIdentityStatic(entry.match.awayTeam, "teamLogoInline")}
            <b>${score(entry.match)}</b>
            ${renderTeamIdentityStatic(entry.match.homeTeam, "teamLogoInline")}
          </strong>
          <em>${escapeHtml(formatDate(entry.match.date))} Ã‚Â· ${escapeHtml(entry.match.group || entry.match.stage || "Match")}</em>
        </a>
      `;
    }).join("");
    return `<div class="matchList">${rows || `<div class="empty">Inga matcher hittades.</div>`}</div>`;
  }

  function renderCupMatchSchedule(entries) {
    if (!entries.length) return `<div class="empty">Inga matcher hittades.</div>`;
    const groups = [];
    const byDate = {};
    entries.forEach(function (entry) {
      const key = entry.match.date || "Datum saknas";
      if (!byDate[key]) {
        byDate[key] = {
          label: formatDate(entry.match.date),
          rows: []
        };
        groups.push(byDate[key]);
      }
      byDate[key].rows.push(entry);
    });
    return `
      <div class="matchSchedule">
        ${groups.map(function (group) {
          return `
            <section class="matchDay">
              <header class="matchDayHead">
                <span>Borta</span>
                <strong>${escapeHtml(group.label)}</strong>
                <span>Hemma</span>
              </header>
              <div class="matchDayRows">
                ${group.rows.map(function (entry) {
                  const label = entry.match.group || entry.match.stage || "Match";
                  return `
                    <a class="matchScheduleRow" href="${getMatchUrl(entry.cup, entry.match)}">
                      <div class="matchScheduleTeam away">${renderTeamIdentityStatic(entry.match.awayTeam, "teamLogoInline")}</div>
                      <div class="matchScheduleScore">
                        <b>${score(entry.match)}</b>
                        <span>${escapeHtml(label)}</span>
                      </div>
                      <div class="matchScheduleTeam home">${renderTeamIdentityStatic(entry.match.homeTeam, "teamLogoInline")}</div>
                    </a>
                  `;
                }).join("")}
              </div>
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderCupMatchPreview(entries) {
    const rows = entries.slice(0, 10).map(function (entry) {
      return `
        <a class="matchPreviewRow" href="${getMatchUrl(entry.cup, entry.match)}">
          ${renderTeamLogo(entry.match.awayTeam, "teamLogoInline")}
          <span>${escapeHtml(entry.match.awayTeam)}</span>
          <b>${score(entry.match)}</b>
          ${renderTeamLogo(entry.match.homeTeam, "teamLogoInline")}
          <span>${escapeHtml(entry.match.homeTeam)}</span>
          <em>${escapeHtml(entry.match.group || entry.match.stage || "Match")}</em>
        </a>
      `;
    }).join("");
    return `<div class="matchPreviewList">${rows || `<div class="empty">Inga matcher hittades.</div>`}</div>`;
  }

  function getMatchUrl(cup, match) {
    return "#/match/" + encodeURIComponent(cup.id) + "/" + encodeURIComponent(match.id);
  }

  function renderLeaderRows(players) {
    return `
      <div class="leaderList">
        ${players.map(function (player, index) {
          return `
            <a class="leader" href="#/players/${encodeURIComponent(player.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(player.name)}</strong>
              <em>${escapeHtml(player.team || "OkÃƒÂ¤nt lag")}</em>
              <b>${player.pts}p</b>
            </a>
          `;
        }).join("") || `<div class="empty">Ingen spelarstatistik hittades.</div>`}
      </div>
    `;
  }

  function renderGoalieRows(goalies) {
    return `
      <div class="leaderList">
        ${goalies.map(function (goalie, index) {
          return `
            <a class="leader" href="#/goalies/${encodeURIComponent(goalie.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(goalie.name)}</strong>
              <em>${escapeHtml(goalie.team || "OkÃƒÂ¤nt lag")} Ã‚Â· ${goalie.gp} GP</em>
              <b>${formatPercent(goalie.svp)}</b>
            </a>
          `;
        }).join("") || `<div class="empty">Ingen mÃƒÂ¥lvaktsstatistik hittades.</div>`}
      </div>
    `;
  }

  function renderCupTopPlayerPreview(players) {
    const rows = (players || []).slice(0, 5);
    return `
      <div class="previewLeaders">
        ${rows.map(function (player, index) {
          return `
            <a class="previewLeader" href="#/players/${encodeURIComponent(player.name)}">
              <span class="previewRank">${index + 1}</span>
              ${renderPlayerPortrait(player, "previewPortrait")}
              <strong>${renderPersonName(player.name)}</strong>
              <em>${renderTeamIdentityStatic(player.team, "teamLogoChip")}</em>
              <b>${player.pts}p</b>
            </a>
          `;
        }).join("") || `<div class="empty">Ingen spelarstatistik hittades.</div>`}
      </div>
    `;
  }

  function renderCupTopGoaliePreview(goalies) {
    const rows = (goalies || []).slice(0, 5);
    return `
      <div class="previewLeaders">
        ${rows.map(function (goalie, index) {
          return `
            <a class="previewLeader" href="#/goalies/${encodeURIComponent(goalie.name)}">
              <span class="previewRank">${index + 1}</span>
              ${renderPlayerPortrait(goalie, "previewPortrait")}
              <strong>${renderPersonName(goalie.name)}</strong>
              <em>${renderTeamIdentityStatic(goalie.team, "teamLogoChip")} Ã‚Â· ${goalie.gp} GP</em>
              <b>${formatPercent(goalie.svp)}</b>
            </a>
          `;
        }).join("") || `<div class="empty">Ingen mÃƒÂ¥lvaktsstatistik hittades.</div>`}
      </div>
    `;
  }

  function renderCupPlayerStatsTable(rows) {
    const sorted = rows.slice().sort(function (a, b) {
      return b.pts - a.pts || b.g - a.g || b.a - a.a || b.gp - a.gp || a.name.localeCompare(b.name, "sv");
    });
    if (!sorted.length) return `<div class="empty">Ingen spelarstatistik hittades.</div>`;
    return `
      <div class="dataTable fullStatsTable">
        <table>
          <thead><tr><th>#</th><th>Spelare</th><th>Lag</th><th>GP</th><th>G</th><th>A</th><th>PTS</th><th>PIM</th></tr></thead>
          <tbody>
            ${sorted.map(function (row, index) {
              return `<tr><td>${index + 1}</td><td><a href="#/players/${encodeURIComponent(row.name)}">${renderPersonName(row.name)}</a></td><td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td><td>${row.gp}</td><td>${row.g}</td><td>${row.a}</td><td><strong>${row.pts}</strong></td><td>${row.pim}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderCupGoalieStatsTable(rows) {
    const sorted = rows.slice().sort(function (a, b) {
      return number(b.svp) - number(a.svp) || number(a.gaa) - number(b.gaa) || number(b.sv) - number(a.sv) || b.gp - a.gp || a.name.localeCompare(b.name, "sv");
    });
    if (!sorted.length) return `<div class="empty">Ingen mÃƒÂ¥lvaktsstatistik hittades.</div>`;
    return `
      <div class="dataTable fullStatsTable">
        <table>
          <thead><tr><th>#</th><th>MÃƒÂ¥lvakt</th><th>Lag</th><th>GP</th><th>SA</th><th>GA</th><th>SV</th><th>SV%</th><th>GAA</th><th>SO</th></tr></thead>
          <tbody>
            ${sorted.map(function (row, index) {
              return `<tr><td>${index + 1}</td><td><a href="#/goalies/${encodeURIComponent(row.name)}">${renderPersonName(row.name)}</a></td><td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td><td>${row.gp}</td><td>${row.sa}</td><td>${row.ga}</td><td>${row.sv}</td><td><strong>${formatPercent(row.svp)}</strong></td><td>${formatDecimal(row.gaa)}</td><td>${row.so}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderCupStack(cups) {
    return `
      <div class="cupStack">
        ${cups.map(function (cup) {
          return `
            <a href="#/cups/${encodeURIComponent(cup.id)}">
              <span>${escapeHtml(cup.code)}</span>
              <strong>${escapeHtml(cup.winner || "Ej klar")}</strong>
              <em>${cup.matchCount} matcher</em>
            </a>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderMiniTags(items, type) {
    const hrefBase = type === "teams" ? "#/teams/" : "#/cups/";
    return `
      <div class="tagCloud">
        ${items.slice(0, 80).map(function (item) {
          const value = typeof item === "object" ? text(item.name) : text(item);
          const href = type === "teams" && item && typeof item === "object" && item.cupId
            ? "#/cups/" + encodeURIComponent(item.cupId) + "/teams/" + encodeURIComponent(value)
            : hrefBase + encodeURIComponent(value);
          return `<a href="${href}">${type === "teams" ? renderTeamLogo(value, "teamLogoChip") : ""}<span>${escapeHtml(value)}</span></a>`;
        }).join("")}
      </div>
    `;
  }

  function buildCupTeamRows(cup) {
    const map = new Map();
    cup.teams.forEach(function (team) {
      map.set(team, { name: team, matches: 0, wins: 0, losses: 0, otl: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    });
    cup.matches.forEach(function (match) {
      ingestCupTeamRow(map, match.awayTeam, match.awayScore, match.homeScore, match.overtime);
      ingestCupTeamRow(map, match.homeTeam, match.homeScore, match.awayScore, match.overtime);
    });
    return Array.from(map.values()).sort(function (a, b) {
      return b.points - a.points
        || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
        || b.goalsFor - a.goalsFor
        || a.name.localeCompare(b.name, "sv");
    });
  }

  function ingestCupTeamRow(map, team, gf, ga, overtime) {
    if (!map.has(team)) map.set(team, { name: team, matches: 0, wins: 0, losses: 0, otl: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    if (gf === null || ga === null) return;
    const row = map.get(team);
    const goalsFor = number(gf);
    const goalsAgainst = number(ga);
    row.matches += 1;
    row.goalsFor += goalsFor;
    row.goalsAgainst += goalsAgainst;
    if (goalsFor > goalsAgainst) {
      row.wins += 1;
      row.points += 3;
    } else if (overtime) {
      row.otl += 1;
      row.points += 1;
    } else {
      row.losses += 1;
    }
  }

  function buildStandings(cup) {
    const groups = new Map();
    cup.matches.filter(function (match) {
      return !isPlayoffMatch(match);
    }).forEach(function (match) {
      const groupName = match.group || "Gruppspel";
      if (!groups.has(groupName)) groups.set(groupName, new Map());
      ingestStanding(groups.get(groupName), match.awayTeam, match.awayScore, match.homeScore, match.overtime, match.awayShots, match.homeShots);
      ingestStanding(groups.get(groupName), match.homeTeam, match.homeScore, match.awayScore, match.overtime, match.homeShots, match.awayShots);
    });

    return Array.from(groups.entries()).sort(function (a, b) {
      return compareGroupNames(a[0], b[0]);
    }).map(function (entry) {
      return {
        name: entry[0],
        rows: Array.from(entry[1].values()).sort(function (a, b) {
          return b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.team.localeCompare(b.team, "sv");
        })
      };
    });
  }

  function ingestStanding(map, team, gf, ga, overtime, sf, sa) {
    if (gf === null || ga === null) return;
    if (!map.has(team)) {
      map.set(team, { team: team, gp: 0, w: 0, otw: 0, l: 0, otl: 0, gf: 0, ga: 0, sf: 0, sa: 0, pts: 0 });
    }
    const row = map.get(team);
    const goalsFor = number(gf);
    const goalsAgainst = number(ga);
    row.gp += 1;
    row.gf += goalsFor;
    row.ga += goalsAgainst;
    row.sf += nullableNumber(sf) ?? 0;
    row.sa += nullableNumber(sa) ?? 0;
    if (goalsFor > goalsAgainst) {
      row.w += 1;
      if (overtime) row.otw += 1;
      row.pts += 3;
    } else if (overtime) {
      row.otl += 1;
      row.pts += 1;
    } else {
      row.l += 1;
    }
  }

  function renderStandingsPreview(groups, settings) {
    return renderStandings(groups, settings, { preview: true });
  }

  function compareGroupNames(a, b) {
    const left = groupSortParts(a);
    const right = groupSortParts(b);
    if (left.prefix !== right.prefix) return left.prefix.localeCompare(right.prefix, "sv");
    if (left.number !== right.number) return left.number - right.number;
    return text(a).localeCompare(text(b), "sv", { numeric: true });
  }

  function groupSortParts(value) {
    const name = text(value);
    const match = name.match(/^(.*?)(\d+)\s*$/);
    return {
      prefix: fold(match ? match[1].trim() : name),
      number: match ? number(match[2]) : Number.MAX_SAFE_INTEGER
    };
  }

  function renderStandings(groups, settings, options) {
    if (!groups.length) return `<div class="empty">Ingen gruppstatistik hittades.</div>`;
    const opts = options || {};
    const isFull = Boolean(opts.full);
    const cut1 = settings?.playoffCut1 || null;
    const cut2 = settings?.playoffCut2 || null;
    const displayGroups = groups;
    const fullHead = [
      ["rank", "#"],
      ["team", "Lag", "text"],
      ["gp", "GP"],
      ["w", "W"],
      ["otw", "OTW"],
      ["l", "L"],
      ["otl", "OTL"],
      ["gf", "GF"],
      ["ga", "GA"],
      ["diff", "+/-"],
      ["sf", "SF"],
      ["sa", "SA"],
      ["shotdiff", "S+/-"],
      ["pts", "PTS"]
    ];
    return `
      <div class="standingsDeck ${isFull ? "fullStandings" : ""}">
        ${displayGroups.map(function (group) {
          const rows = group.rows;
          return `
            <section class="standing">
              <h4>${escapeHtml(group.name)}</h4>
              <table class="${isFull ? "sortableStanding" : "previewStanding"}">
                <colgroup>
                  ${isFull ? `<col class="standingRankCol">` : ""}
                  <col class="standingTeamCol">
                  <col span="${isFull ? 12 : 4}">
                </colgroup>
                <thead><tr>${isFull ? fullHead.map(function (head) {
                  return `<th><button type="button" data-standing-sort="${head[0]}" data-sort-type="${head[2] || "number"}">${head[1]}</button></th>`;
                }).join("") : "<th>Lag</th><th>GP</th><th>W</th><th>L</th><th>PTS</th>"}</tr></thead>
                <tbody>
                  ${rows.map(function (row, index) {
                    const rank = index + 1;
                    const cutClass = rank === cut1 ? " playoffCutLine cutOne" : rank === cut2 ? " playoffCutLine cutTwo" : "";
                    const diff = row.gf - row.ga;
                    const shotDiff = row.sf - row.sa;
                    return `
                      <tr class="${cutClass}" data-rank="${rank}" data-team="${escapeHtml(fold(row.team))}" data-gp="${row.gp}" data-w="${row.w}" data-otw="${row.otw}" data-l="${row.l}" data-otl="${row.otl}" data-gf="${row.gf}" data-ga="${row.ga}" data-diff="${diff}" data-sf="${row.sf}" data-sa="${row.sa}" data-shotdiff="${shotDiff}" data-pts="${row.pts}">
                        ${isFull ? `<td class="rankCell">${rank}</td>` : ""}
                        <td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td>
                        <td>${row.gp}</td><td>${row.w}</td>${isFull ? `<td>${row.otw}</td>` : ""}<td>${isFull ? row.l : row.l + row.otl}</td>${isFull ? `<td>${row.otl}</td><td>${row.gf}</td><td>${row.ga}</td><td>${diff}</td><td>${row.sf}</td><td>${row.sa}</td><td>${shotDiff}</td>` : ""}
                        <td><strong>${row.pts}</strong></td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
              ${opts.preview && group.rows.length > rows.length ? `<div class="previewMore">+${group.rows.length - rows.length} lag till</div>` : ""}
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function buildBracket(cup) {
    const playoffMatches = cup.matches.filter(isPlayoffMatch);
    const explicitRounds = new Map();
    playoffMatches.forEach(function (match) {
      const round = normalizeRound(match.group || match.stage || "Slutspel");
      if (!explicitRounds.has(round)) explicitRounds.set(round, []);
      explicitRounds.get(round).push(match);
    });

    if (explicitRounds.size === 1 && explicitRounds.has("Slutspel")) {
      return inferPlayoffRounds(playoffMatches);
    }

    return Array.from(explicitRounds.entries()).sort(function (a, b) {
      return roundRank(a[0]) - roundRank(b[0]);
    }).map(function (entry) {
      return { round: entry[0], series: buildPlayoffSeries(entry[1]), matches: entry[1].sort(compareMatches) };
    });
  }

  function renderBracketPreview(rounds, settings, cup) {
    return renderBracket(rounds, settings, { preview: true, cup: cup });
  }

  function renderBracket(rounds, settings, options) {
    if (!rounds.length) return `<div class="empty">Inget slutspelstrÃƒÂ¤d hittades fÃƒÂ¶r cupen.</div>`;
    const opts = options || {};
    const displayRounds = rounds;
    return `
      <div class="bracket ${opts.full ? "fullBracket" : ""} ${opts.preview ? "previewBracket" : ""}">
        ${displayRounds.map(function (round) {
          const bestOf = getBestOfForRound(round.round, settings);
          const seriesRows = round.series && round.series.length ? round.series : buildPlayoffSeries(round.matches);
          const displaySeries = seriesRows;
          return `
            <section class="bracketRound">
              <h4>${escapeHtml(round.round)}${bestOf ? ` <span class="boBadge">BO${escapeHtml(bestOf)}</span>` : ""}</h4>
              ${displaySeries.map(function (series) {
                const winner = getSeriesWinner(series);
                return `
                  <div class="series">
                    <div class="seriesTeam ${winner === series.awayTeam ? "winner" : ""}">${renderTeamIdentity(series.awayTeam, "teamLogoTiny", opts.cup?.id)} <b>${series.awayWins}</b></div>
                    <div class="seriesTeam ${winner === series.homeTeam ? "winner" : ""}">${renderTeamIdentity(series.homeTeam, "teamLogoTiny", opts.cup?.id)} <b>${series.homeWins}</b></div>
                    ${renderSeriesResults(series, opts.cup)}
                  </div>
                `;
              }).join("")}
              ${opts.preview && seriesRows.length > displaySeries.length ? `<div class="previewMore">+${seriesRows.length - displaySeries.length} serier till</div>` : ""}
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSeriesResults(series, cup) {
    const rows = (series.matches || []).slice().sort(function (a, b) {
      return parseDate(a.date, a.time) - parseDate(b.date, b.time);
    });
    if (!rows.length) return `<em>Inga matchresultat</em>`;
    return `
      <div class="seriesResults">
        ${rows.map(function (match) {
          return `<a href="${getSeriesMatchUrl(match, cup)}">${escapeHtml(seriesScore(match, series.awayTeam, series.homeTeam))}</a>`;
        }).join("")}
      </div>
    `;
  }

  function getSeriesMatchUrl(match, cup) {
    const cupId = cup?.id || match.cupId || state.activeCupId || "";
    return "#/match/" + encodeURIComponent(cupId) + "/" + encodeURIComponent(match.id);
  }

  function seriesScore(match, firstTeam, secondTeam) {
    const firstScore = match.awayTeam === firstTeam ? match.awayScore : match.homeTeam === firstTeam ? match.homeScore : null;
    const secondScore = match.awayTeam === secondTeam ? match.awayScore : match.homeTeam === secondTeam ? match.homeScore : null;
    const suffix = match.overtime ? " OT" : "";
    return display(firstScore) + "-" + display(secondScore) + suffix;
  }

  function renderCupSettings(settings, options) {
    const safeSettings = settings || normalizeCupSettings({});
    const opts = options || {};
    const items = [
      ["Slutspelsstreck 1", formatSettingValue(safeSettings.playoffCut1)],
      ["Slutspelsstreck 2", formatSettingValue(safeSettings.playoffCut2)],
      ["BO ÃƒÂ¥tton", formatSettingValue(safeSettings.bestOf.roundOf16)],
      ["BO kvart", formatSettingValue(safeSettings.bestOf.quarter)],
      ["BO semi", formatSettingValue(safeSettings.bestOf.semi)],
      ["BO final", formatSettingValue(safeSettings.bestOf.final)],
      ["Minst antal spelare", formatSettingValue(safeSettings.minPlayers)],
      ["Max antal spelare", formatSettingValue(safeSettings.maxPlayers)]
    ];
    const hasAny = items.some(function (item) { return item[1] !== "Ej angivet"; })
      || safeSettings.eligibility
      || safeSettings.info;
    if (!hasAny) return `<div class="empty">Ingen extra cupinfo hittades.</div>`;
    const infoItems = splitSettingsInfo(safeSettings.info);
    const shownInfo = opts.preview ? infoItems.slice(0, 1) : infoItems;
    return `
      <div class="cupInfoGrid">
        ${items.map(function (item) {
          return `<div><span>${escapeHtml(item[0])}</span><strong>${escapeHtml(item[1])}</strong></div>`;
        }).join("")}
      </div>
      <div class="cupInfoText">
        ${safeSettings.eligibility ? `<p><span>BehÃƒÂ¶righet</span>${escapeHtml(stripRuleLabel(safeSettings.eligibility, "BehÃƒÂ¶righet"))}</p>` : ""}
        ${shownInfo.map(function (info) {
          return `<p><span>Info</span>${escapeHtml(info)}</p>`;
        }).join("")}
        ${opts.preview && infoItems.length > shownInfo.length ? `<div class="previewMore">+${infoItems.length - shownInfo.length} infodelar till</div>` : ""}
      </div>
    `;
  }

  function renderSharedSecRules() {
    const sections = getSharedSecRuleSections();
    return `
      <div class="panelHead">
        <h3>Gemensamma SEC-regler</h3>
      </div>
      <div class="sharedRules">
        ${sections.map(function (section, index) {
          return `
            <details class="sharedRuleSection" ${index === 0 ? "open" : ""}>
              <summary>${escapeHtml(section.title)}</summary>
              <div>
                ${section.items.map(function (item) {
                  return `
                    <article>
                      <h4>${escapeHtml(item.heading)}</h4>
                      <p>${escapeHtml(item.text)}</p>
                      ${item.bullets ? `<ul>${item.bullets.map(function (bullet) {
                        return `<li>${escapeHtml(bullet)}</li>`;
                      }).join("")}</ul>` : ""}
                    </article>
                  `;
                }).join("")}
              </div>
            </details>
          `;
        }).join("")}
      </div>
    `;
  }

  function getSharedSecRuleSections() {
    return [
      {
        title: "Medlemsregistrering",
        items: [
          { heading: "AllmÃƒÂ¤nt", text: "Alla spelare som deltar i SEC mÃƒÂ¥ste ha ett registrerat konto pÃƒÂ¥ SportsGamer.gg med sitt PSN-ID eller Gamertag tillagt i sin profil." },
          { heading: "Kontodetaljer", text: "SportsGamer-kontonamn, PSN-ID, Gamertag och spelarnamn fÃƒÂ¥r inte vara stÃƒÂ¶tande, fÃƒÂ¶rolÃƒÂ¤mpande, rÃƒÂ¥a eller vulgÃƒÂ¤ra. SportsGamers personal kan begÃƒÂ¤ra att uppgifter ÃƒÂ¤ndras om de anses olÃƒÂ¤mpliga." },
          { heading: "Acceptera regler", text: "Genom att gÃƒÂ¥ med i ett lag som ÃƒÂ¤r registrerat fÃƒÂ¶r en cup accepterar spelaren dessa regler." },
          { heading: "Antal konton", text: "Ingen spelare fÃƒÂ¥r ha mer ÃƒÂ¤n ett konto pÃƒÂ¥ SportsGamer.gg. Kontot kan anvÃƒÂ¤ndas pÃƒÂ¥ olika konsoler och i olika ligor eller turneringar sÃƒÂ¥ lÃƒÂ¤nge spelarens PSN-ID eller Gamertag finns pÃƒÂ¥ profilen." },
          { heading: "Konto i samma hushÃƒÂ¥ll", text: "Om flera spelare anvÃƒÂ¤nder konton frÃƒÂ¥n samma IP-adress, till exempel syskon i samma hem, ska administratÃƒÂ¶r informeras om detta." },
          { heading: "Playercard", text: "Namn och nummer pÃƒÂ¥ SportsGamer-playercard ska stÃƒÂ¤mma med spelet. Alla spelare i ett lag ska ha unika nummer, och korrekt nationalitet och stad ska vara synliga. Ãƒâ€¦lder ÃƒÂ¤r frivilligt." }
        ]
      },
      {
        title: "Lagregistrering",
        items: [
          { heading: "AllmÃƒÂ¤nt", text: "Registrerade svenska, norska och danska medlemmar fÃƒÂ¥r registrera lag fÃƒÂ¶r SEC. Lagets registrant blir kapten som standard. Lagregistrering ÃƒÂ¤r endast mÃƒÂ¶jlig under registreringsperioden." },
          { heading: "Registrering", text: "Registreringar ÃƒÂ¤r slutgiltiga nÃƒÂ¤r anmÃƒÂ¤lningstiden har passerat. SportsGamers personal har sista ordet kring placering i divisioner eller grupper." },
          { heading: "Dra tillbaka en registrering", text: "FÃƒÂ¶r att dra tillbaka en registrering ska kaptenen ta bort anmÃƒÂ¤lan och meddela att laget inte lÃƒÂ¤ngre avser delta. Om laget redan placerats i division ska support kontaktas. Detta kan bara gÃƒÂ¶ras innan anmÃƒÂ¤lningstiden gÃƒÂ¥tt ut." },
          { heading: "Logotyper", text: "Genom anmÃƒÂ¤lan samtycker laget till att SportsGamer, SportsGamers dotterbolag och motstÃƒÂ¥ndare fÃƒÂ¥r anvÃƒÂ¤nda lagets logotyp fÃƒÂ¶r sÃƒÂ¤ndnings- och reklamÃƒÂ¤ndamÃƒÂ¥l." },
          { heading: "SÃƒÂ¤ndningsbilder", text: "Genom anmÃƒÂ¤lan samtycker spelare och lag till att inskickade bilder fÃƒÂ¥r anvÃƒÂ¤ndas fÃƒÂ¶r sÃƒÂ¤ndnings- och reklamÃƒÂ¤ndamÃƒÂ¥l." },
          { heading: "Sponsring", text: "Lag fÃƒÂ¥r ha sponsorer, men sponsorer fÃƒÂ¥r inte stÃƒÂ¥ i konflikt med SportsGamers vÃƒÂ¤rderingar, turneringens huvudsponsor eller cupens arrangÃƒÂ¶r. Alkohol, tobak, spel och vuxenunderhÃƒÂ¥llning ÃƒÂ¤r inte tillÃƒÂ¥tet." }
        ]
      },
      {
        title: "UppfÃƒÂ¶randekod",
        items: [
          { heading: "AllmÃƒÂ¤nt", text: "Medlemmar fÃƒÂ¶rvÃƒÂ¤ntas behandla varandra med respekt och undvika krÃƒÂ¤nkande sprÃƒÂ¥kbruk i cupens konversationer pÃƒÂ¥ SportsGamer.gg och i extern kommunikation dÃƒÂ¤r bevis och kontext kan lÃƒÂ¤mnas." },
          { heading: "FÃƒÂ¶rsÃƒÂ¶k att kringgÃƒÂ¥ regler", text: "Medlemmar fÃƒÂ¥r inte kringgÃƒÂ¥ reglerna, fÃƒÂ¶rsÃƒÂ¶ka gÃƒÂ¶ra det, eller lura SportsGamers personal och Cup Administration." }
        ]
      },
      {
        title: "Lagledningens ansvar",
        items: [
          { heading: "AllmÃƒÂ¤nt", text: "Lagledare ÃƒÂ¤r representanter fÃƒÂ¶r hela laget och ansvarar fÃƒÂ¶r lagets agerande.", bullets: [
            "SchemalÃƒÂ¤gga matcher.",
            "Se till att laget alltid fÃƒÂ¶ljer cupens och turneringens regler.",
            "SkÃƒÂ¶ta kommunikation med managers och cupadministration i lagets namn.",
            "Se till att laget slutfÃƒÂ¶r sina matcher."
          ] }
        ]
      },
      {
        title: "Cupens administration",
        items: [
          { heading: "Ansvar", text: "Cupens administration ansvarar fÃƒÂ¶r att anordna cupen, upprÃƒÂ¤tthÃƒÂ¥lla reglerna, undersÃƒÂ¶ka ÃƒÂ¶vertrÃƒÂ¤delser och lÃƒÂ¶sa tvister mellan spelare och lag." },
          { heading: "RegelÃƒÂ¤ndringar", text: "Cupens administration kan lÃƒÂ¤gga till fÃƒÂ¶rtydliganden eller nya regler om ett fall inte tÃƒÂ¤cks av befintliga regler. Efter beslut ska berÃƒÂ¶rda parter fÃƒÂ¥ en fÃƒÂ¶rklaring kring vilka regler som ÃƒÂ¥beropats." },
          { heading: "Definition av bestraffning", text: "Spelar- och lagbestraffningar definieras efter allvarlighetsgrad och tidigare beslut kan anvÃƒÂ¤ndas som prejudikat." },
          { heading: "Majoritetsbeslut", text: "Cupadministrationen beslutar med majoritet och agerar som en enhet efter beslut. Enskilda rÃƒÂ¶ster avslÃƒÂ¶jas inte." },
          { heading: "Kontakt", text: "Kontakt med cupadministrationen ska ske via supportfunktionen och SEC Support. AnvÃƒÂ¤nd inte privata meddelanden till enskilda CA-medlemmar fÃƒÂ¶r CA-frÃƒÂ¥gor." }
        ]
      },
      {
        title: "Lagregler",
        items: [
          { heading: "Spelare", text: "Lag fÃƒÂ¥r endast anvÃƒÂ¤nda spelare som ÃƒÂ¤r listade i den officiella laguppstÃƒÂ¤llningen pÃƒÂ¥ SportsGamer.gg." },
          { heading: "WO-matcher", text: "Lag fÃƒÂ¥r lÃƒÂ¤mna WO, men varje fall avgÃƒÂ¶rs av CA. MotstÃƒÂ¥ndarlaget fÃƒÂ¥r walkover-vinst." },
          { heading: "Annullera matcher", text: "Om en match spelas med en eller flera otillÃƒÂ¥tna spelare kan CA annullera matcher och tilldela WO-segrar till laget som inte brutit mot reglerna." }
        ]
      },
      {
        title: "Fair Play",
        items: [
          { heading: "AllmÃƒÂ¤nt", text: "Fair Play ÃƒÂ¤r grundregeln i alla matcher pÃƒÂ¥ SportsGamer.gg. Behandla motstÃƒÂ¥ndaren som du sjÃƒÂ¤lv vill bli behandlad.", bullets: [
            "Utnyttja inte spelmekanik eller buggar fÃƒÂ¶r att ge motstÃƒÂ¥ndaren nackdel.",
            "Distrahera inte motstÃƒÂ¥ndaren frÃƒÂ¥n spelet genom spam, samtal under match eller liknande."
          ] }
        ]
      },
      {
        title: "Buggar",
        items: [
          { heading: "Spelare fastnar i animationer", text: "Om spelare eller mÃƒÂ¥lvakter fastnar i oavsiktliga animationer ska laget rensa pucken sÃƒÂ¥ snart felet upptÃƒÂ¤cks. Vid oenighet kan videobevis skickas till CA." },
          { heading: "SlagsmÃƒÂ¥l vid tekning", text: "Spelare fÃƒÂ¥r inte initiera slagsmÃƒÂ¥l innan pucken slÃƒÂ¤pps vid tekning." },
          { heading: "MÃƒÂ¥lvakter lÃƒÂ¤mnar mÃƒÂ¥lgÃƒÂ¥rden", text: "MÃƒÂ¥lvakter fÃƒÂ¥r inte lÃƒÂ¤mna mÃƒÂ¥lgÃƒÂ¥rden i syfte att stÃƒÂ¶ra motstÃƒÂ¥ndarens skridskoÃƒÂ¥kare." },
          { heading: "Hindra spelare utan puck", text: "SkridskoÃƒÂ¥kare fÃƒÂ¥r inte slÃƒÂ¥, stÃƒÂ¶ta eller aktivt ÃƒÂ¥ka i vÃƒÂ¤gen fÃƒÂ¶r spelare som inte har pucken." },
          { heading: "FÃƒÂ¥nga spelare i mÃƒÂ¥let", text: "MÃƒÂ¥lvakten fÃƒÂ¥r inte fÃƒÂ¶rsÃƒÂ¶ka hindra en motstÃƒÂ¥ndare bakom mÃƒÂ¥let eller i sarghÃƒÂ¶rnet genom att stÃƒÂ¥ i vÃƒÂ¤gen sÃƒÂ¥ spelaren inte kan ÃƒÂ¥ka dÃƒÂ¤rifrÃƒÂ¥n." }
        ]
      },
      {
        title: "SchemalÃƒÂ¤ggning",
        items: [
          { heading: "SchemalÃƒÂ¤ggning", text: "Varje match har en officiell speldag. Lag fÃƒÂ¥r flytta matcher om de inte sÃƒÂ¤nds eller ÃƒÂ¤r utvalda matcher, men ska kommunicera med motstÃƒÂ¥ndare fÃƒÂ¶re speldagen och skicka ÃƒÂ¶verenskomna ÃƒÂ¤ndringar via rescheduling-verktyget." }
        ]
      },
      {
        title: "Diskvalificering och fÃƒÂ¶rbjudna spelare",
        items: [
          { heading: "Diskvalificering av lag", text: "Om ett lag diskvalificeras stÃƒÂ¤ngs lagkaptener och assisterande kaptener av frÃƒÂ¥n cupen. Ãƒâ€“vriga spelare kan byta lag om de inte var inblandade i diskvalificeringen." },
          { heading: "FÃƒÂ¶rvÃƒÂ¤rv av fÃƒÂ¶rbjudna spelare", text: "Lag som plockar upp spelare som ÃƒÂ¤r fÃƒÂ¶rbjudna att spela pÃƒÂ¥ SportsGamer fÃƒÂ¥r allvarliga pÃƒÂ¥fÃƒÂ¶ljder. Lagkaptenerna kan stÃƒÂ¤ngas av och laget diskvalificeras." }
        ]
      }
    ];
  }

  function isPlayoffMatch(match) {
    const marker = fold([match?.stage, match?.group].filter(Boolean).join(" "));
    return marker.includes("playoff")
      || marker.includes("slutspel")
      || marker.includes("final")
      || marker.includes("semi")
      || marker.includes("kvart")
      || marker.includes("atton");
  }

  function inferPlayoffRounds(matches) {
    const series = buildPlayoffSeries(matches).sort(function (a, b) {
      return a.firstTimestamp - b.firstTimestamp;
    });
    const bracketRounds = inferPlayoffRoundsFromWinners(series);
    if (bracketRounds.length >= 2) return bracketRounds;

    const rounds = [];
    let remaining = series.slice();
    const pattern = [
      { count: 8, round: "Ãƒâ€¦ttondelsfinal" },
      { count: 4, round: "Kvartsfinal" },
      { count: 2, round: "Semifinal" },
      { count: 1, round: "Final" }
    ];

    pattern.forEach(function (entry) {
      if (remaining.length >= entry.count && (remaining.length - entry.count === 0 || remaining.length - entry.count < entry.count)) {
        rounds.push({ round: entry.round, series: remaining.slice(0, entry.count), matches: remaining.slice(0, entry.count).flatMap(function (item) { return item.matches; }) });
        remaining = remaining.slice(entry.count);
      }
    });

    if (remaining.length) {
      rounds.push({ round: "Slutspel", series: remaining, matches: remaining.flatMap(function (item) { return item.matches; }) });
    }

    return rounds.sort(function (a, b) {
      return roundRank(a.round) - roundRank(b.round);
    });
  }

  function inferPlayoffRoundsFromWinners(series) {
    if (!series.length) return [];
    const assigned = new Set();
    const finalSeries = series.slice().sort(function (a, b) {
      return b.firstTimestamp - a.firstTimestamp;
    })[0];
    const rounds = [{ round: "Final", series: [finalSeries], matches: finalSeries.matches }];
    assigned.add(finalSeries);

    let current = [finalSeries];
    ["Semifinal", "Kvartsfinal", "Ãƒâ€¦ttondelsfinal"].forEach(function (roundName) {
      const previous = [];
      current.forEach(function (targetSeries) {
        [targetSeries.awayTeam, targetSeries.homeTeam].forEach(function (team) {
          const predecessor = series
            .filter(function (candidate) {
              return !assigned.has(candidate)
                && candidate.firstTimestamp < targetSeries.firstTimestamp
                && getSeriesWinner(candidate) === team;
            })
            .sort(function (a, b) {
              return b.firstTimestamp - a.firstTimestamp;
            })[0];
          if (predecessor && !previous.includes(predecessor)) {
            previous.push(predecessor);
            assigned.add(predecessor);
          }
        });
      });
      if (previous.length) {
        const effectiveRoundName = roundName === "Ãƒâ€¦ttondelsfinal" && previous.length < current.length * 2 ? "Play in" : roundName;
        previous.sort(function (a, b) { return a.firstTimestamp - b.firstTimestamp; });
        rounds.push({ round: effectiveRoundName, series: previous, matches: previous.flatMap(function (item) { return item.matches; }) });
        current = previous;
      }
    });

    const leftovers = series.filter(function (candidate) {
      return !assigned.has(candidate);
    });
    if (leftovers.length) {
      const earliestName = rounds.some(function (round) { return round.round === "Ãƒâ€¦ttondelsfinal" || round.round === "Play in"; }) ? "Slutspel" : "Play in";
      leftovers.sort(function (a, b) { return a.firstTimestamp - b.firstTimestamp; });
      rounds.push({ round: earliestName, series: leftovers, matches: leftovers.flatMap(function (item) { return item.matches; }) });
    }

    return rounds.sort(function (a, b) {
      return roundRank(a.round) - roundRank(b.round);
    });
  }

  function buildPlayoffSeries(matches) {
    const map = new Map();
    (matches || []).forEach(function (match) {
      const teams = [match.awayTeam, match.homeTeam].sort(function (a, b) {
        return a.localeCompare(b, "sv");
      });
      const key = teams.join(" | ");
      if (!map.has(key)) {
        map.set(key, {
          awayTeam: teams[0],
          homeTeam: teams[1],
          awayWins: 0,
          homeWins: 0,
          firstTimestamp: parseDate(match.date, match.time) || 0,
          matches: []
        });
      }
      const series = map.get(key);
      series.firstTimestamp = Math.min(series.firstTimestamp || Infinity, parseDate(match.date, match.time) || Infinity);
      series.matches.push(match);
      const awayScore = number(match.awayScore);
      const homeScore = number(match.homeScore);
      if (awayScore === homeScore) return;
      const winner = awayScore > homeScore ? match.awayTeam : match.homeTeam;
      if (winner === series.awayTeam) {
        series.awayWins += 1;
      } else if (winner === series.homeTeam) {
        series.homeWins += 1;
      }
    });
    return Array.from(map.values()).map(function (series) {
      series.matches.sort(compareMatches);
      return series;
    });
  }

  function getSeriesWinner(series) {
    if (series.awayWins === series.homeWins) return "";
    return series.awayWins > series.homeWins ? series.awayTeam : series.homeTeam;
  }

  function inferCupPlacement(cup) {
    const rounds = buildBracket(cup);
    if (!rounds.length) return { winner: "", runnerUp: "" };
    const sortedRounds = rounds.slice().sort(function (a, b) {
      return roundRank(b.round) - roundRank(a.round);
    });
    const finalRound = sortedRounds.find(function (round) {
      return fold(round.round).includes("final") && !fold(round.round).includes("semi") && (round.series || []).length === 1;
    }) || sortedRounds.find(function (round) {
      return (round.series || []).length === 1;
    });
    const finalSeries = finalRound?.series?.[0];
    if (!finalSeries) return { winner: "", runnerUp: "" };
    const winner = getSeriesWinner(finalSeries);
    if (!winner) return { winner: "", runnerUp: "" };
    return {
      winner: winner,
      runnerUp: winner === finalSeries.awayTeam ? finalSeries.homeTeam : finalSeries.awayTeam
    };
  }

  function normalizeCupSettings(cup) {
    const source = cup?.settings || cup || {};
    const bestOf = source.bestOf || {};
    return {
      playoffCut1: nullableNumber(source.playoffCut1 ?? source["slutspelsstreck  1"] ?? source["slutspelsstreck 1"]),
      playoffCut2: nullableNumber(source.playoffCut2 ?? source["slutspelsstreck  2"] ?? source["slutspelsstreck 2"]),
      bestOf: {
        roundOf16: nullableNumber(bestOf.roundOf16 ?? source.boAtton ?? source["bo ÃƒÂ¥tton"] ?? source["bo atton"]),
        quarter: nullableNumber(bestOf.quarter ?? source.boQuarter ?? source["bo kvart"]),
        semi: nullableNumber(bestOf.semi ?? source.boSemi ?? source["bo semi"]),
        final: nullableNumber(bestOf.final ?? source.boFinal ?? source["bo final"])
      },
      minPlayers: nullableNumber(source.minPlayers ?? source["Minst antal spelare"] ?? source["Min antal spelare"]),
      maxPlayers: nullableNumber(source.maxPlayers ?? source["Max antal spelare"] ?? source["Max antal"]),
      eligibility: text(source.eligibility ?? source["BehÃƒÂ¶righet:"] ?? source["BehÃƒÂ¶righet"] ?? source.Behorighet ?? ""),
      info: text(source.info ?? source.Info ?? "")
    };
  }

  function getBestOfForRound(roundName, settings) {
    const bestOf = settings?.bestOf || {};
    const folded = fold(roundName);
    if (folded.includes("play in") || folded.includes("playin")) return null;
    if (folded.includes("atton") || folded.includes("16")) return bestOf.roundOf16;
    if (folded.includes("kvart")) return bestOf.quarter;
    if (folded.includes("semi")) return bestOf.semi;
    if (folded.includes("final")) return bestOf.final;
    return [bestOf.roundOf16, bestOf.quarter, bestOf.semi, bestOf.final].find(Boolean) || null;
  }

  function formatSettingValue(value) {
    return value === null || value === undefined || value === "" ? "Ej angivet" : String(value);
  }

  function stripRuleLabel(value, label) {
    const clean = text(value);
    const labels = uniqueStrings([label, removeDiacritics(label)]).map(function (entry) {
      return entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/:$/, "");
    });
    for (let index = 0; index < labels.length; index += 1) {
      const stripped = clean.replace(new RegExp("^\\s*" + labels[index] + "\\s*:?\\s*", "i"), "").trim();
      if (stripped && stripped !== clean) return stripped;
    }
    return clean;
  }

  function splitSettingsInfo(value) {
    return text(value).replace(/<br\s*\/?>/gi, "\n").split(/\r?\n|(?:\s*\|\s*)/).map(function (part) {
      return part.trim();
    }).filter(Boolean);
  }

  function buildTeamRoster(teamName) {
    const map = new Map();
    state.cups.forEach(function (cup) {
      cup.playerRows.filter(function (row) {
        return row.team === teamName;
      }).forEach(function (row) {
        const key = fold(row.name);
        if (!map.has(key)) {
          map.set(key, { name: row.name, team: teamName, gp: 0, g: 0, a: 0, pts: 0, cups: new Set() });
        }
        const target = map.get(key);
        target.gp += row.gp;
        target.g += row.g;
        target.a += row.a;
        target.pts += row.pts;
        target.cups.add(cup.code);
      });
    });
    return Array.from(map.values()).sort(sortPlayers);
  }

  function buildTeamCupRows(teamName) {
    return state.cups.map(function (cup) {
      const rows = cup.playerRows.filter(function (row) { return row.team === teamName; });
      const matches = cup.matches.filter(function (match) {
        return match.awayTeam === teamName || match.homeTeam === teamName;
      });
      const goalsFor = matches.reduce(function (sum, match) {
        return sum + number(match.awayTeam === teamName ? match.awayScore : match.homeScore);
      }, 0);
      const wins = matches.filter(function (match) {
        const gf = number(match.awayTeam === teamName ? match.awayScore : match.homeScore);
        const ga = number(match.awayTeam === teamName ? match.homeScore : match.awayScore);
        return gf > ga;
      }).length;
      return { cup: cup, players: rows.length, matches: matches.length, wins: wins, goalsFor: goalsFor };
    }).filter(function (row) {
      return row.players || row.matches;
    }).sort(function (a, b) {
      return compareCupsByDate(a.cup, b.cup);
    });
  }

  function renderTeamCupTable(rows) {
    if (!rows.length) return `<div class="empty">Ingen laghistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Matcher</th><th>Vinster</th><th>MÃƒÂ¥l</th><th>Spelare</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cup.id)}">${escapeHtml(row.cup.code)}</a></td><td>${row.matches}</td><td>${row.wins}</td><td>${row.goalsFor}</td><td>${row.players}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderPlayerCupTable(player) {
    const rows = player.rows.slice().sort(function (a, b) {
      return compareProfileRowsByDate(a, b);
    });
    if (!rows.length) return `<div class="empty">Ingen cuphistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Lag</th><th>GP</th><th>G</th><th>A</th><th>PTS</th><th>PIM</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cupId)}">${escapeHtml(row.cupCode)}</a></td><td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td><td>${row.gp}</td><td>${row.g}</td><td>${row.a}</td><td><strong>${row.pts}</strong></td><td>${row.pim}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderGoalieCupTable(goalie) {
    const rows = goalie.rows.slice().sort(function (a, b) {
      return compareCupRowsByDate(a, b);
    });
    if (!rows.length) return `<div class="empty">Ingen mÃƒÂ¥lvaktshistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Lag</th><th>GP</th><th>SA</th><th>GA</th><th>SV</th><th>SV%</th><th>GAA</th><th>SO</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cupId)}">${escapeHtml(row.cupCode)}</a></td><td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td><td>${row.gp}</td><td>${row.sa}</td><td>${row.ga}</td><td>${row.sv}</td><td><strong>${formatPercent(row.svp)}</strong></td><td>${formatDecimal(row.gaa)}</td><td>${row.so}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderTeamCupTable(rows) {
    if (!rows.length) return `<div class="empty">Ingen laghistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Datum</th><th>Matcher</th><th>Vinster</th><th>Mal</th><th>Spelare</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cup.id)}">${escapeHtml(row.cup.code)}</a></td><td>${escapeHtml(formatCupDateRange(row.cup))}</td><td>${row.matches}</td><td>${row.wins}</td><td>${row.goalsFor}</td><td>${row.players}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderPlayerCupTable(player) {
    const rows = player.rows.slice().sort(function (a, b) {
      return compareProfileRowsByDate(a, b);
    });
    if (!rows.length) return `<div class="empty">Ingen cuphistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Del</th><th>Lag</th><th>GP</th><th>G</th><th>A</th><th>PTS</th><th>PIM</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cupId)}">${escapeHtml(row.cupCode)}</a></td><td>${escapeHtml(formatStageLabel(row.stage))}</td><td>${renderTeamIdentity(row.team, "teamLogoTiny", row.cupId)}</td><td>${row.gp}</td><td>${row.g}</td><td>${row.a}</td><td><strong>${row.pts}</strong></td><td>${row.pim}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderGoalieCupTable(goalie) {
    const rows = goalie.rows.slice().sort(function (a, b) {
      return compareProfileRowsByDate(a, b);
    });
    if (!rows.length) return `<div class="empty">Ingen malvaktshistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Del</th><th>Lag</th><th>GP</th><th>SA</th><th>GA</th><th>SV</th><th>SV%</th><th>GAA</th><th>SO</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cupId)}">${escapeHtml(row.cupCode)}</a></td><td>${escapeHtml(formatStageLabel(row.stage))}</td><td>${renderTeamIdentity(row.team, "teamLogoTiny", row.cupId)}</td><td>${row.gp}</td><td>${row.sa}</td><td>${row.ga}</td><td>${row.sv}</td><td><strong>${formatPercent(row.svp)}</strong></td><td>${formatDecimal(row.gaa)}</td><td>${row.so}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderTeamLogo(teamName, className) {
    const safeName = text(teamName);
    const urls = getTeamLogoCandidates(safeName);
    const first = urls[0] || "";
    const fallbacks = urls.slice(1);
    return `
      <span class="teamLogo ${className || ""}" data-initials="${escapeHtml(getTeamInitials(safeName))}">
        ${first ? `<img src="${escapeHtml(first)}" data-fallback-srcs="${escapeHtml(JSON.stringify(fallbacks))}" onerror="window.SEC_LOGO_FALLBACK(this)" alt="${escapeHtml(safeName)} logga" loading="eager" decoding="async">` : ""}
      </span>
    `;
  }

  function renderTeamIdentity(teamName, logoClass, cupId) {
    const safeName = text(teamName || "OkÃƒÂ¤nt lag");
    return `
      <a class="teamIdentity" href="${getTeamHref(safeName, cupId)}">
        ${renderTeamLogo(safeName, logoClass || "teamLogoTiny")}
        <span>${escapeHtml(safeName)}</span>
      </a>
    `;
  }

  function renderTeamIdentityStatic(teamName, logoClass) {
    const safeName = text(teamName || "OkÃƒÂ¤nt lag");
    return `
      <span class="teamIdentity teamIdentityStatic">
        ${renderTeamLogo(safeName, logoClass || "teamLogoTiny")}
        <span>${escapeHtml(safeName)}</span>
      </span>
    `;
  }

  function getTeamHref(teamName, cupId) {
    const safeName = text(teamName || "OkÃƒÂ¤nt lag");
    if (cupId) {
      return "#/cups/" + encodeURIComponent(cupId) + "/teams/" + encodeURIComponent(safeName);
    }
    if (state.view === "cups" && state.activeCupId) {
      return "#/cups/" + encodeURIComponent(state.activeCupId) + "/teams/" + encodeURIComponent(safeName);
    }
    if (state.view === "match" && state.activeMatchCupId) {
      return "#/cups/" + encodeURIComponent(state.activeMatchCupId) + "/teams/" + encodeURIComponent(safeName);
    }
    return "#/teams/" + encodeURIComponent(safeName);
  }

  function renderPersonName(name) {
    const parsed = parsePersonCountry(name);
    const flag = countryFlag(parsed.country);
    return `<span class="personName">${flag ? `<span class="countryFlag" title="${escapeHtml(parsed.country)}">${flag}</span>` : ""}<span>${escapeHtml(parsed.name)}</span></span>`;
  }

  function getPersonDisplayName(name) {
    return parsePersonCountry(name).name;
  }

  function parsePersonCountry(name) {
    const safeName = text(name);
    const match = safeName.match(/,\s*([A-Z]{3})$/i);
    if (!match) return { name: safeName, country: "" };
    return {
      name: safeName.slice(0, match.index).trim(),
      country: match[1].toUpperCase()
    };
  }

  function countryFlag(code) {
    const countries = {
      SWE: "SE",
      FIN: "FI",
      NOR: "NO",
      DEN: "DK",
      DNK: "DK",
      ISL: "IS",
      USA: "US",
      CAN: "CA",
      GBR: "GB",
      GER: "DE",
      DEU: "DE",
      FRA: "FR",
      ESP: "ES",
      ITA: "IT",
      CZE: "CZ",
      SVK: "SK",
      POL: "PL",
      AUT: "AT",
      SUI: "CH",
      CHE: "CH",
      NED: "NL",
      NLD: "NL",
      BEL: "BE",
      LAT: "LV",
      LVA: "LV",
      EST: "EE",
      LTU: "LT",
      RUS: "RU",
      UKR: "UA"
    };
    const iso2 = countries[code];
    if (!iso2) return "";
    return iso2.split("").map(function (letter) {
      return String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65);
    }).join("");
  }
  function renderPlayerPortrait(player, className) {
    const safeName = text(player?.name || player?.player || "Spelare");
    const urls = getPlayerImageCandidates(player);
    const first = urls[0] || getDefaultPlayerImageUrl();
    const fallbacks = urls.slice(1).concat(getDefaultPlayerImageUrl());
    return `
      <span class="playerPortrait ${className || ""}" data-initials="${escapeHtml(getPlayerInitials(safeName))}">
        <img src="${escapeHtml(first)}" data-fallback-srcs="${escapeHtml(JSON.stringify(uniqueStrings(fallbacks)))}" onerror="window.SEC_PLAYER_IMAGE_FALLBACK(this)" alt="${escapeHtml(safeName)} spelarfoto" loading="eager" decoding="async">
      </span>
    `;
  }

  function getPlayerImageCandidates(player) {
    const base = getPlayerImageBaseUrl();
    const matched = resolvePlayerImageFilename(player);
    const names = getPlayerAssetNameCandidates(player);
    const guessed = uniqueStrings(names.flatMap(function (name) {
      return ["jpg", "jpeg", "png", "webp"].map(function (ext) {
        return base + "/" + encodeURIComponent(name + "." + ext);
      });
    })).slice(0, 28);
    return uniqueStrings((matched ? [base + "/" + encodeURIComponent(matched)] : []).concat(guessed));
  }

  function resolvePlayerImageFilename(player) {
    const keys = getPlayerAssetKeysForPlayer(player);
    for (let index = 0; index < keys.length; index += 1) {
      const match = state.playerImageIndex.get(keys[index]);
      if (match) return match;
    }
    return "";
  }

  function getPlayerAssetNameCandidates(player) {
    const name = text(player?.name || player?.player);
    const nameWithoutCountry = name.replace(/,\s*[A-Z]{2,3}$/i, "");
    const id = text(player?.playerId || player?.id);
    const baseNames = uniqueStrings([
      nameWithoutCountry,
      removeDiacritics(nameWithoutCountry),
      nameWithoutCountry.replace(/[_-]+/g, " "),
      nameWithoutCountry.replace(/\s+/g, "_"),
      nameWithoutCountry.replace(/\s+/g, "-"),
      nameWithoutCountry.replace(/[._-]+/g, ""),
      removeDiacritics(nameWithoutCountry).replace(/\s+/g, "_"),
      removeDiacritics(nameWithoutCountry).replace(/\s+/g, "-"),
      removeDiacritics(nameWithoutCountry).replace(/[._-]+/g, ""),
      name,
      removeDiacritics(name),
      name.replace(/[_-]+/g, " "),
      name.replace(/\s+/g, "_"),
      name.replace(/\s+/g, "-"),
      name.replace(/[._-]+/g, ""),
      removeDiacritics(name).replace(/\s+/g, "_"),
      removeDiacritics(name).replace(/\s+/g, "-"),
      removeDiacritics(name).replace(/[._-]+/g, ""),
      id
    ].map(function (value) { return text(value).trim(); }).filter(Boolean));
    return uniqueStrings(baseNames.flatMap(function (value) {
      return [value, value.toLowerCase(), toTitleCase(value)];
    }));
  }

  function getPlayerAssetKeysForPlayer(player) {
    return uniqueStrings(getPlayerAssetNameCandidates(player).flatMap(getPlayerAssetKeys));
  }

  function getPlayerAssetKeys(value) {
    const clean = text(value).replace(/\.[^.]+$/, "");
    return uniqueStrings([
      fold(clean),
      normalizeLogoKey(clean),
      fold(removeDiacritics(clean)),
      normalizeLogoKey(removeDiacritics(clean))
    ]);
  }

  function getPlayerImageBaseUrl() {
    return String(window.SEC_CONFIG?.playerImageBaseUrl || "https://sweehockey-svg.github.io/players").replace(/\/+$/, "");
  }

  function getDefaultPlayerImageUrl() {
    return getPlayerImageBaseUrl() + "/1DEFAULTBILDID.jpg";
  }

  function getPlayerInitials(playerName) {
    const parts = text(playerName).split(/[\s._-]+/).filter(Boolean);
    return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
  }

  function renderPersonDetail(player, goalie, source) {
    const person = player || goalie;
    if (!person) return `<section class="emptyPage">Spelaren hittades inte.</section>`;
    const parsedPerson = parsePersonCountry(person.name);
    const profileBio = buildPersonBio(player, goalie);
    const teams = uniqueStrings([]
      .concat(player ? Array.from(player.teams || []) : [])
      .concat(goalie ? Array.from(goalie.teams || []) : [])
      .filter(Boolean));
    const teamJourney = buildPersonTeamJourney(player, goalie);
    const currentEditionTeams = getPersonCurrentEditionTeams(player, goalie);
    const cups = new Set([]
      .concat(player ? Array.from(player.cups || []) : [])
      .concat(goalie ? Array.from(goalie.cups || []) : []));
    const roleText = player && goalie ? "Utespelare / m\u00e5lvakt" : player ? "Utespelare" : "M\u00e5lvakt";
    const meta = [
      cups.size + " cuper",
      player ? player.gp + " GP ute" : "",
      player ? player.pts + " po\u00e4ng" : "",
      goalie ? goalie.gp + " GP m\u00e5l" : "",
      goalie ? formatPercent(goalie.svp) + " SV%" : ""
    ].filter(Boolean).join(" \u00b7 ");
    return `
      <section class="detailHero playerProfileHero">
        ${renderPersonBreadcrumb(parsedPerson.name)}
        <div class="profileMedia">
          ${renderPlayerPortrait(person, "playerPortraitHero")}
        </div>
        <div class="profileCopy">
          <p class="profileLabel">${parsedPerson.country ? `<span class="countryFlag">${countryFlag(parsedPerson.country)}</span>` : ""}<span>Spelarprofil</span></p>
          <h2>${escapeHtml(parsedPerson.name)}</h2>
          <p class="profileMeta">
            <span class="profileCurrentTeams">${renderProfileCurrentTeams(currentEditionTeams)}</span>
            <span>${escapeHtml(roleText)} \u00b7 ${escapeHtml(meta)}.</span>
          </p>
        </div>
        ${renderPersonBioPanel(profileBio)}
      </section>
      ${renderPersonMeritsPanel(profileBio)}
      <section class="metricGrid compact">
        ${player ? metric("Po\u00e4ng", player.pts, "utespelare") : ""}
        ${player ? metric("M\u00e5l", player.g, "gjorda") : ""}
        ${player ? metric("Assist", player.a, "passningar") : ""}
        ${goalie ? metric("SV%", formatPercent(goalie.svp), "m\u00e5lvakt") : ""}
        ${goalie ? metric("GAA", formatDecimal(goalie.gaa), "m\u00e5l emot/match") : ""}
        ${goalie ? metric("SV", goalie.sv, "r\u00e4ddningar") : ""}
      </section>
      <section class="personDetailGrid">
        <div class="personHistoryStack">
          ${player ? panel("Utespelare - cuphistorik", renderPlayerCupTable(player)) : ""}
          ${goalie ? panel("M\u00e5lvakt - cuphistorik", renderGoalieCupTable(goalie)) : ""}
        </div>
        <aside class="personTravelSide">
          ${panel("Lagresa", renderMiniTags(teamJourney, "teams"))}
        </aside>
      </section>
    `;
  }


  function renderProfileCurrentTeams(items) {
    if (!items.length) return `<span class="freeAgentPill">Free agent</span>`;
    return items.map(function (item) {
      return renderTeamIdentity(item.name, "profileTeamLogo", item.cupId);
    }).join("");
  }

  function getPersonCurrentEditionTeams(player, goalie) {
    const latestKey = getLatestCupEditionKey();
    if (!latestKey) return [];
    const seen = new Set();
    return []
      .concat(player ? player.rows : [])
      .concat(goalie ? goalie.rows : [])
      .filter(function (row) {
        return getCupEditionKey(row) === latestKey && row.team;
      })
      .sort(compareCupRowsByDate)
      .map(function (row) {
        return { name: row.team, cupId: row.cupId };
      })
      .filter(function (item) {
        const key = fold(item.name) + "::" + text(item.cupId);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function getLatestCupEditionKey() {
    return getCupEditionKey(state.cups[0]);
  }

  function getCupEditionKey(source) {
    if (!source) return "";
    const cup = source.id ? source : state.cups.find(function (entry) { return entry.id === source.cupId; });
    const label = text((cup && (cup.code + " " + cup.name + " " + cup.id)) || (source.cupCode + " " + source.cupId));
    const family = /sommar/i.test(label) ? "summer" : "sec";
    const variant = /challenger/i.test(label) ? "challenger" : "";
    const match = label.match(/(?:SEC|Sommar)\s*(?:Sommar\s*)?(\d+(?:[.,]\d+)?)/i) || label.match(/(\d+(?:[.,]\d+)?)/);
    const edition = match ? match[1].replace(",", ".") : fold(label);
    return [family, edition, variant].filter(Boolean).join(":");
  }


  function buildPersonTeamJourney(player, goalie) {
    const seen = new Set();
    return []
      .concat(player ? player.rows : [])
      .concat(goalie ? goalie.rows : [])
      .sort(compareCupRowsByDate)
      .map(function (row) {
        return { name: row.team, cupId: row.cupId };
      })
      .filter(function (item) {
        const key = fold(item.name);
        if (!item.name || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }
  function renderPersonBreadcrumb(playerName) {
    return `
      <nav class="crumbs profileCrumbs" aria-label="Br\u00f6dsmulor">
        <a href="#/cups">Start</a>
        <span>/</span>
        <a href="#/cups">Cuper</a>
        <span>/</span>
        <strong>${escapeHtml(playerName)}</strong>
      </nav>
    `;
  }

  function getCupByCode(code) {
    const key = fold(code);
    return state.cups.find(function (cup) {
      return fold(cup.code) === key;
    }) || null;
  }

  function buildPersonBio(player, goalie) {
    const person = player || goalie;
    const parsed = parsePersonCountry(person.name);
    const allRows = []
      .concat(player ? player.rows.map(function (row) { return Object.assign({ role: "skater" }, row); }) : [])
      .concat(goalie ? goalie.rows.map(function (row) { return Object.assign({ role: "goalie" }, row); }) : [])
      .sort(compareCupRowsByDate);
    const chronological = allRows.slice().sort(function (a, b) { return compareCupRowsByDate(b, a); });
    const regularRows = chronological.filter(function (row) { return !isSummerCupRow(row); });
    const bioRows = regularRows.length ? regularRows : chronological;
    const firstRow = bioRows[0] || chronological[0] || null;
    const lastRow = bioRows[bioRows.length - 1] || chronological[chronological.length - 1] || null;
    const teams = uniqueStrings(allRows.map(function (row) { return row.team; }).filter(Boolean));
    const cups = uniqueStrings(allRows.map(function (row) { return row.cupCode; }).filter(Boolean));
    const bestSkater = player ? player.rows.slice().sort(function (a, b) {
      return b.pts - a.pts || b.g - a.g || b.gp - a.gp;
    })[0] : null;
    const bestGoalie = goalie ? goalie.rows.slice().sort(function (a, b) {
      return number(b.svp) - number(a.svp) || number(b.sv) - number(a.sv) || number(b.gp) - number(a.gp);
    })[0] : null;
    return {
      name: parsed.name,
      country: parsed.country,
      nationality: translateNationality(parsed.country),
      firstCup: firstRow?.cupCode || "",
      firstTeam: firstRow?.team || "",
      lastCup: lastRow?.cupCode || "",
      lastTeam: lastRow?.team || "",
      cupsCount: cups.length,
      teamsCount: teams.length,
      totalGames: (player ? player.gp : 0) + (goalie ? goalie.gp : 0),
      bestSkater: bestSkater,
      bestGoalie: bestGoalie,
      teamMerits: getPersonTeamMerits(player, goalie),
      personalMerits: getPersonPersonalMerits(player, goalie)
    };
  }

  function renderPersonBioPanel(bio) {
    return `
      <aside class="personBioPanel" aria-label="Spelarbio och meriter">
        <p><strong>${escapeHtml(bio.name)}</strong> ${bio.nationality ? "\u00e4r en <strong>" + escapeHtml(bio.nationality) + "</strong>" : "\u00e4r en"} eHockey-spelare som gjorde sitt f\u00f6rsta framtr\u00e4dande i <strong>${escapeHtml(bio.firstCup || "SEC")}</strong>${bio.firstTeam ? " f\u00f6r <strong>" + escapeHtml(bio.firstTeam) + "</strong>" : ""}.</p>
        <p>Totalt har han deltagit i <strong>${bio.cupsCount}</strong> upplagor av <strong>Svenska eHockey Cupen</strong> och representerat <strong>${bio.teamsCount}</strong> olika lag. Senast spelade han i <strong>${escapeHtml(bio.lastCup || "SEC")}</strong>${bio.lastTeam ? " f\u00f6r <strong>" + escapeHtml(bio.lastTeam) + "</strong>" : ""}.</p>
        <p>Sammanlagt st\u00e5r han p\u00e5 <strong>${bio.totalGames}</strong> matcher i SEC.</p>
        ${bio.bestSkater ? `<p>Hans b\u00e4sta turnering som utespelare kom i <strong>${escapeHtml(bio.bestSkater.cupCode)}</strong>, d\u00e4r han gjorde <strong>${bio.bestSkater.pts}</strong> po\u00e4ng f\u00f6r <strong>${escapeHtml(bio.bestSkater.team)}</strong>.</p>` : ""}
        ${bio.bestGoalie ? `<p>Hans b\u00e4sta turnering som m\u00e5lvakt kom i <strong>${escapeHtml(bio.bestGoalie.cupCode)}</strong>, med <strong>${formatPercent(bio.bestGoalie.svp)}</strong> i SV% f\u00f6r <strong>${escapeHtml(bio.bestGoalie.team)}</strong>.</p>` : ""}
      </aside>
    `;
  }

  function renderPersonMeritsPanel(bio) {
    if (!bio.teamMerits.length && !bio.personalMerits.length) return "";
    return `
      <section class="personMeritsPanel">
        ${renderPersonMeritSection("Meriter", bio.teamMerits)}
        ${renderPersonMeritSection("Personliga meriter", bio.personalMerits)}
      </section>
    `;
  }

  function renderPersonMeritSection(title, items) {
    if (!items.length) return "";
    return `
      <div class="personMeritSection">
        <h3>${escapeHtml(title)}</h3>
        <div class="personMeritList">
          ${items.map(function (item) {
            return `<div><span>${escapeHtml(item.icon)}</span><strong>${escapeHtml(item.text)}</strong></div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function getPersonTeamMerits(player, goalie) {
    const rows = [].concat(player ? player.rows : []).concat(goalie ? goalie.rows : []);
    const output = [];
    const seen = new Set();
    state.cups.forEach(function (cup) {
      uniqueStrings(rows.filter(function (row) {
        return row.cupId === cup.id && row.team;
      }).map(function (row) { return row.team; })).forEach(function (team) {
        const teamKey = fold(team);
        if (cup.winner && fold(cup.winner) === teamKey) {
          const key = "gold-" + cup.id + "-" + teamKey;
          if (!seen.has(key)) {
            seen.add(key);
            output.push({ icon: trophyIcon(1), text: "M\u00e4stare i " + cup.code + " med " + team + "." });
          }
        }
        if (cup.runnerUp && fold(cup.runnerUp) === teamKey) {
          const key = "silver-" + cup.id + "-" + teamKey;
          if (!seen.has(key)) {
            seen.add(key);
            output.push({ icon: trophyIcon(2), text: "2:a i " + cup.code + " med " + team + "." });
          }
        }
      });
    });
    return output.sort(function (a, b) { return a.text.localeCompare(b.text, "sv"); });
  }

  function getPersonPersonalMerits(player, goalie) {
    return []
      .concat(player ? getSkaterPointMerits(player) : [])
      .concat(player ? getSkaterGoalMerits(player) : [])
      .concat(goalie ? getGoaliePersonalMerits(goalie) : []);
  }

  function getSkaterPointMerits(player) {
    return getRankMerits(player.rows, "pts", function (row, index) {
      return { icon: targetIcon(index), text: (index + 1) + ":a i po\u00e4ngligan i " + getStageCupLabel(row) + " (" + row.pts + "p)." };
    }, function (a, b) {
      return b.pts - a.pts || b.g - a.g || a.name.localeCompare(b.name, "sv");
    });
  }

  function getSkaterGoalMerits(player) {
    return getRankMerits(player.rows, "g", function (row, index) {
      return { icon: targetIcon(index), text: (index + 1) + ":a i skytteligan i " + getStageCupLabel(row) + " (" + row.g + " m\u00e5l)." };
    }, function (a, b) {
      return b.g - a.g || b.pts - a.pts || a.name.localeCompare(b.name, "sv");
    });
  }

  function getGoaliePersonalMerits(goalie) {
    return getRankMerits(goalie.rows, "svp", function (row, index) {
      return { icon: targetIcon(index), text: (index + 1) + ":a i m\u00e5lvaktsligan i " + getStageCupLabel(row) + " (" + formatPercent(row.svp) + ")." };
    }, function (a, b) {
      return number(b.svp) - number(a.svp) || number(b.sv) - number(a.sv) || a.name.localeCompare(b.name, "sv");
    });
  }

  function getRankMerits(rows, statKey, makeItem, sorter) {
    const output = [];
    rows.forEach(function (row) {
      if (!number(row[statKey])) return;
      const cup = state.cups.find(function (entry) { return entry.id === row.cupId; });
      if (!cup) return;
      const peers = getCupStageRows(cup, row, row.sa !== undefined ? "goalie" : "player").slice().sort(sorter);
      const index = peers.findIndex(function (candidate) {
        return getPersonProfileKey(candidate.name) === getPersonProfileKey(row.name) && fold(candidate.team) === fold(row.team);
      });
      if (index >= 0 && index < 3) output.push(makeItem(row, index));
    });
    return output;
  }

  function getCupStageRows(cup, row, type) {
    const rows = type === "goalie" ? cup.goalieRows : cup.playerRows;
    return rows.filter(function (candidate) {
      return normalizeStage(candidate.stage) === normalizeStage(row.stage);
    });
  }

  function getStageCupLabel(row) {
    return row.cupCode + (normalizeStage(row.stage) === "playoffs" ? " S" : " G");
  }

  function normalizeStage(value) {
    return value === "playoffs" || /slut|playoff/i.test(String(value || "")) ? "playoffs" : "group";
  }

  function isSummerCupRow(row) {
    return /sommar/i.test(String(row?.cupId || row?.cupCode || ""));
  }

  function translateNationality(code) {
    const map = {
      SWE: "svensk",
      SE: "svensk",
      FIN: "finsk",
      FI: "finsk",
      NOR: "norsk",
      NO: "norsk",
      DEN: "dansk",
      DNK: "dansk",
      DK: "dansk",
      GER: "tysk",
      DEU: "tysk",
      DE: "tysk",
      CZE: "tjeckisk",
      SVK: "slovakisk",
      CAN: "kanadensisk",
      USA: "amerikansk"
    };
    return map[String(code || "").trim().toUpperCase()] || "";
  }

  function trophyIcon(place) {
    return place === 1 ? String.fromCodePoint(0x1f3c6) : place === 2 ? String.fromCodePoint(0x1f948) : String.fromCodePoint(0x1f949);
  }

  function targetIcon(index) {
    return index === 0 ? String.fromCodePoint(0x1f3af) : trophyIcon(index + 1);
  }

  function findPlayerByPersonName(name) {
    const key = getPersonProfileKey(name);
    return state.players.find(function (player) {
      return getPersonProfileKey(player.name) === key;
    }) || null;
  }

  function findGoalieByPersonName(name) {
    const key = getPersonProfileKey(name);
    return state.goalies.find(function (goalie) {
      return getPersonProfileKey(goalie.name) === key;
    }) || null;
  }

  function getPersonProfileKey(name) {
    const parsed = parsePersonCountry(name);
    return fold(parsed.name || name);
  }

  function renderPlayerDetail(_model, player) {
    if (!player) return `<section class="emptyPage">Spelaren hittades inte.</section>`;
    return renderPersonDetail(player, findGoalieByPersonName(player.name), "players");
    /*
    return `
      <section class="detailHero playerProfileHero">
        <div class="profileMedia">
          ${renderPlayerPortrait(player, "playerPortraitHero")}
        </div>
        <div class="profileCopy">
          <a href="#/players">Tillbaka till spelare</a>
          <h2>${renderPersonName(player.name)}</h2>
          <p>${renderTeamIdentity(player.team || "Okant lag", "teamLogoInline")} <span>${player.cups.size} cuper Ã‚Â· ${player.gp} GP Ã‚Â· ${player.pts} poang.</span></p>
        </div>
      </section>
      <section class="metricGrid compact">
        ${metric("Poang", player.pts, "totalt")}
        ${metric("Mal", player.g, "gjorda")}
        ${metric("Assist", player.a, "passningar")}
        ${metric("Matcher", player.gp, "GP")}
      </section>
      <section class="sportGrid">
        ${panel("Cuphistorik", renderPlayerCupTable(player))}
        ${panel("Lagresa", renderMiniTags(Array.from(player.teams), "teams"))}
      </section>
    `;
    */
  }

  function renderGoalieDetail(_model, goalie) {
    if (!goalie) return `<section class="emptyPage">Malvakten hittades inte.</section>`;
    return renderPersonDetail(findPlayerByPersonName(goalie.name), goalie, "goalies");
    /*
    return `
      <section class="detailHero playerProfileHero">
        <div class="profileMedia">
          ${renderPlayerPortrait(goalie, "playerPortraitHero")}
        </div>
        <div class="profileCopy">
          <a href="#/goalies">Tillbaka till malvakter</a>
          <h2>${renderPersonName(goalie.name)}</h2>
          <p>${renderTeamIdentity(goalie.team || "Okant lag", "teamLogoInline")} <span>${goalie.cups.size} cuper Ã‚Â· ${goalie.gp} GP Ã‚Â· ${formatPercent(goalie.svp)} SV%.</span></p>
        </div>
      </section>
      <section class="metricGrid compact">
        ${metric("SV%", formatPercent(goalie.svp), "raddningsprocent")}
        ${metric("GAA", formatDecimal(goalie.gaa), "mal emot/match")}
        ${metric("SV", goalie.sv, "raddningar")}
        ${metric("SO", goalie.so, "hallna nollor")}
      </section>
      <section class="sportGrid">
        ${panel("Cuphistorik", renderGoalieCupTable(goalie))}
        ${panel("Lagresa", renderMiniTags(Array.from(goalie.teams), "teams"))}
      </section>
    `;
    */
  }

  function getTeamLogoCandidates(teamName) {
    if (!teamName || teamName === "Ej klar") return [];
    const base = String(window.SEC_CONFIG?.teamLogoBaseUrl || "https://sweehockey-svg.github.io/teamlogos").replace(/\/+$/, "");
    const matched = resolveTeamLogoFilename(teamName);
    const names = uniqueStrings([
      teamName,
      removeDiacritics(teamName),
      teamName.replace(/\s+/g, "_"),
      removeDiacritics(teamName).replace(/\s+/g, "_"),
      teamName.replace(/\s+/g, "-"),
      removeDiacritics(teamName).replace(/\s+/g, "-"),
      teamName.replace(/[^a-z0-9]+/gi, ""),
      removeDiacritics(teamName).replace(/[^a-z0-9]+/gi, "")
    ].map(function (name) { return name.trim(); }).filter(Boolean));
    const guessed = uniqueStrings(names.flatMap(function (name) {
      return ["png", "jpg", "jpeg", "webp", "svg"].map(function (ext) {
        return base + "/" + encodeURIComponent(name + "." + ext);
      });
    })).slice(0, 20);
    return uniqueStrings((matched ? [base + "/" + encodeURIComponent(matched)] : []).concat(guessed));
  }

  function resolveTeamLogoFilename(teamName) {
    const keys = uniqueStrings([
      fold(teamName),
      normalizeLogoKey(teamName),
      fold(removeDiacritics(teamName)),
      normalizeLogoKey(removeDiacritics(teamName))
    ]);
    for (let index = 0; index < keys.length; index += 1) {
      const match = state.teamLogoIndex.get(keys[index]);
      if (match) return match;
    }
    return "";
  }

  function getTeamInitials(teamName) {
    const clean = removeDiacritics(teamName).replace(/[^a-z0-9\s]/gi, " ").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (!parts.length) return "SEC";
    return parts.slice(0, 3).map(function (part) { return part[0]; }).join("").toUpperCase();
  }

  function buildModel() {
    const allMatches = [];
    let totalGoals = 0;
    state.cups.forEach(function (cup) {
      cup.matches.forEach(function (match) {
        allMatches.push({ cup: cup, match: match });
        totalGoals += number(match.awayScore) + number(match.homeScore);
      });
    });
    allMatches.sort(function (left, right) {
      return compareMatches(left.match, right.match);
    });
    const completed = allMatches.filter(function (entry) {
      return entry.match.awayScore !== null && entry.match.homeScore !== null;
    }).length;
    return {
      allMatches: allMatches,
      latestMatches: allMatches.slice(0, 8),
      latestCup: state.cups[0] || null,
      featuredCups: state.cups.slice(0, 6),
      totalMatches: allMatches.length,
      totalGoals: totalGoals,
      avgGoals: completed ? (totalGoals / completed).toFixed(1) : "0.0",
      topPlayers: state.players.slice(0, 8),
      topGoalies: state.goalies.slice(0, 8)
    };
  }

  function normalizeCups(cups) {
    return cups.map(function (cup, index) {
      const matches = (cup.matches || []).map(function (match, matchIndex) {
        return {
          id: String(match.id || cup.id + "-" + matchIndex),
          date: text(match.date),
          time: text(match.time),
          awayTeam: text(match.awayTeam || "OkÃƒÂ¤nt lag"),
          awayScore: nullableNumber(match.awayScore),
          awayShots: nullableNumber(match.awayShots),
          homeScore: nullableNumber(match.homeScore),
          homeShots: nullableNumber(match.homeShots),
          homeTeam: text(match.homeTeam || "OkÃƒÂ¤nt lag"),
          group: text(match.group),
          stage: text(match.stage || "group"),
          overtime: Boolean(match.overtime),
          goalsSummary: text(match.goalsSummary || ""),
          statsSummary: text(match.statsSummary || match.Stats || match.stats || ""),
          playerStats: normalizeMatchStatSides(match.playerStats, normalizePlayerRowsForMatch),
          goalieStats: normalizeMatchStatSides(match.goalieStats, normalizeGoalieRowsForMatch)
        };
      });
      const cupDateMeta = getCupDateMeta(matches, cup, index);
      const teams = Array.from(new Set(matches.flatMap(function (match) {
        return [match.awayTeam, match.homeTeam];
      }).filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, "sv"); });
      const settings = normalizeCupSettings(cup);
      const topPlayers = collectCupPlayers(cup).slice(0, 10);
      const playerStageRows = {
        group: collectCupPlayersForStage(cup, "group"),
        playoffs: collectCupPlayersForStage(cup, "playoffs")
      };
      const playerRows = collectCupPlayers(cup).map(function (row) {
        return Object.assign({}, row, {
          cupId: String(cup.id || index + 1),
          cupCode: text(cup.code || "SEC " + (index + 1)),
          sortOrder: typeof cup.sortOrder === "number" ? cup.sortOrder : index,
          cupStartTimestamp: cupDateMeta.startTimestamp,
          cupEndTimestamp: cupDateMeta.endTimestamp,
          cupSortTimestamp: cupDateMeta.sortTimestamp
        });
      });
      const cupGoalies = collectCupGoalies(cup);
      const topGoalies = filterEligibleCupGoalies(cupGoalies, matches).slice(0, 10);
      const goalieStageRows = {
        group: collectCupGoaliesForStage(cup, "group"),
        playoffs: collectCupGoaliesForStage(cup, "playoffs")
      };
      const goalieRows = cupGoalies.map(function (row) {
        return Object.assign({}, row, {
          cupId: String(cup.id || index + 1),
          cupCode: text(cup.code || "SEC " + (index + 1)),
          sortOrder: typeof cup.sortOrder === "number" ? cup.sortOrder : index,
          cupStartTimestamp: cupDateMeta.startTimestamp,
          cupEndTimestamp: cupDateMeta.endTimestamp,
          cupSortTimestamp: cupDateMeta.sortTimestamp
        });
      });
      const inferredPlacement = inferCupPlacement({ matches: matches });
      return {
        id: String(cup.id || index + 1),
        sortOrder: typeof cup.sortOrder === "number" ? cup.sortOrder : index,
        cupStartTimestamp: cupDateMeta.startTimestamp,
        cupEndTimestamp: cupDateMeta.endTimestamp,
        cupSortTimestamp: cupDateMeta.sortTimestamp,
        code: text(cup.code || "SEC " + (index + 1)),
        name: text(cup.name || cup.code || "SEC"),
        winner: text(cup.placements?.first || cup.winner || inferredPlacement.winner || ""),
        runnerUp: text(cup.placements?.second || cup.runnerUp || inferredPlacement.runnerUp || ""),
        settings: settings,
        matches: matches,
        matchCount: matches.length,
        teams: teams,
        goals: matches.reduce(function (sum, match) { return sum + number(match.awayScore) + number(match.homeScore); }, 0),
        topPlayers: topPlayers,
        playerRows: playerRows,
        playerStageRows: playerStageRows,
        topGoalies: topGoalies,
        goalieRows: goalieRows,
        goalieStageRows: goalieStageRows
      };
    }).sort(compareCupsByDate);
  }

  function collectCupPlayers(cup) {
    const rows = getStatRows(cup.playerStats, "group")
      .concat(getStatRows(cup.playerStats, "playoffs"));
    return aggregateCupPlayerRows(rows, cup);
  }

  function collectCupPlayersForStage(cup, stage) {
    return aggregateCupPlayerRows(getStatRows(cup.playerStats, stage), cup);
  }

  function aggregateCupPlayerRows(rows, cup) {
    const map = new Map();
    rows.forEach(function (row) {
      const name = text(row.displayName || row.player || "OkÃƒÂ¤nd spelare");
      const key = fold(name);
        if (!map.has(key)) {
          map.set(key, { name: name, team: text(row.team), playerId: text(row.playerId), gp: 0, g: 0, a: 0, pts: 0, pim: 0, cups: new Set([text(cup.code)]) });
        }
      const target = map.get(key);
      target.gp += number(row.gp);
      target.g += number(row.g);
      target.a += number(row.a);
      target.pts += number(row.pts);
      target.pim += number(row.pim);
    });
    return Array.from(map.values()).sort(sortPlayers);
  }

  function collectCupGoalies(cup) {
    const rows = getStatRows(cup.goalieStats, "group")
      .concat(getStatRows(cup.goalieStats, "playoffs"));
    return aggregateCupGoalieRows(rows, cup);
  }

  function collectCupGoaliesForStage(cup, stage) {
    return aggregateCupGoalieRows(getStatRows(cup.goalieStats, stage), cup);
  }

  function filterEligibleCupGoalies(goalies, matches) {
    return goalies.filter(function (goalie) {
      const teamGames = countTeamMatches(matches, goalie.team);
      return teamGames > 0 && number(goalie.gp) >= teamGames * 0.5;
    });
  }

  function countTeamMatches(matches, teamName) {
    return (matches || []).filter(function (match) {
      return match.awayTeam === teamName || match.homeTeam === teamName;
    }).length;
  }

  function aggregateCupGoalieRows(rows, cup) {
    const map = new Map();
    rows.forEach(function (row) {
      const name = text(row.displayName || row.player || "OkÃƒÂ¤nd mÃƒÂ¥lvakt");
      const key = fold(name);
        if (!map.has(key)) {
          map.set(key, { name: name, team: text(row.team), playerId: text(row.playerId), gp: 0, sa: 0, ga: 0, sv: 0, svp: 0, gaa: 0, so: 0, cups: new Set([text(cup.code)]) });
        }
      const target = map.get(key);
      const sa = number(row.sa);
      const ga = number(row.ga);
      const sv = number(row.sv);
      target.gp += number(row.gp);
      target.sa += sa || ga + sv;
      target.ga += ga;
      target.sv += sv;
      target.so += number(row.so);
    });
    return Array.from(map.values()).map(finalizeGoalie).sort(sortGoalies);
  }

  function getStatRows(source, key) {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (Array.isArray(source[key])) return source[key];
    if (Array.isArray(source[key + "Stats"])) return source[key + "Stats"];
    return Object.values(source).filter(Array.isArray).flat();
  }

  function buildTeams(cups) {
    const map = new Map();
    cups.forEach(function (cup) {
      cup.matches.forEach(function (match) {
        ingestTeam(map, match.awayTeam, cup, match, true);
        ingestTeam(map, match.homeTeam, cup, match, false);
      });
    });
    return Array.from(map.values()).sort(function (a, b) {
      return b.matches - a.matches || a.name.localeCompare(b.name, "sv");
    });
  }

  function ingestTeam(map, name, cup, match, away) {
    if (!map.has(name)) {
      map.set(name, { name: name, cupsSet: new Set(), cups: 0, matches: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 });
    }
    const team = map.get(name);
    const goalsFor = number(away ? match.awayScore : match.homeScore);
    const goalsAgainst = number(away ? match.homeScore : match.awayScore);
    team.cupsSet.add(cup.id);
    team.cups = team.cupsSet.size;
    team.matches += 1;
    team.goalsFor += goalsFor;
    team.goalsAgainst += goalsAgainst;
    if (goalsFor > goalsAgainst) team.wins += 1;
  }

  function buildPlayers(cups) {
    const map = new Map();
    cups.forEach(function (cup) {
      const rows = getCupProfilePlayerRows(cup);
      rows.forEach(function (row) {
        const key = fold(row.name);
        if (!map.has(key)) {
          map.set(key, { name: row.name, team: row.team, gp: 0, g: 0, a: 0, pts: 0, pim: 0, cups: new Set(), teams: new Set(), rows: [] });
        }
        const player = map.get(key);
        player.playerId = player.playerId || row.playerId || "";
        player.team = row.team || player.team;
        player.gp += row.gp;
        player.g += row.g;
        player.a += row.a;
        player.pts += row.pts;
        player.pim += row.pim;
        player.cups.add(cup.code);
        player.teams.add(row.team);
        player.rows.push(Object.assign({}, row, {
          cupId: cup.id,
          cupCode: cup.code,
          sortOrder: cup.sortOrder,
          cupStartTimestamp: cup.cupStartTimestamp,
          cupEndTimestamp: cup.cupEndTimestamp,
          cupSortTimestamp: cup.cupSortTimestamp
        }));
      });
    });
    return Array.from(map.values()).sort(sortPlayers);
  }

  function buildGoalies(cups) {
    const map = new Map();
    cups.forEach(function (cup) {
      const rows = getCupProfileGoalieRows(cup);
      rows.forEach(function (row) {
        const key = fold(row.name);
        if (!map.has(key)) {
          map.set(key, { name: row.name, team: row.team, gp: 0, sa: 0, ga: 0, sv: 0, svp: 0, gaa: 0, so: 0, cups: new Set(), teams: new Set(), rows: [] });
        }
        const goalie = map.get(key);
        goalie.playerId = goalie.playerId || row.playerId || "";
        goalie.team = row.team || goalie.team;
        goalie.gp += number(row.gp);
        goalie.sa += number(row.sa);
        goalie.ga += number(row.ga);
        goalie.sv += number(row.sv);
        goalie.so += number(row.so);
        goalie.cups.add(cup.code);
        goalie.teams.add(row.team);
        goalie.rows.push(Object.assign({}, row, {
          cupId: cup.id,
          cupCode: cup.code,
          sortOrder: cup.sortOrder,
          cupStartTimestamp: cup.cupStartTimestamp,
          cupEndTimestamp: cup.cupEndTimestamp,
          cupSortTimestamp: cup.cupSortTimestamp
        }));
      });
    });
    return Array.from(map.values()).map(finalizeGoalie).sort(sortGoalies);
  }

  function getCupProfilePlayerRows(cup) {
    const staged = []
      .concat((cup.playerStageRows?.group || []).map(function (row) { return Object.assign({}, row, { stage: "group" }); }))
      .concat((cup.playerStageRows?.playoffs || []).map(function (row) { return Object.assign({}, row, { stage: "playoffs" }); }));
    return (staged.length ? staged : (cup.playerRows && cup.playerRows.length ? cup.playerRows : collectCupPlayers(cup))).map(function (row) {
      return enrichProfileCupRow(row, cup);
    });
  }

  function getCupProfileGoalieRows(cup) {
    const staged = []
      .concat((cup.goalieStageRows?.group || []).map(function (row) { return Object.assign({}, row, { stage: "group" }); }))
      .concat((cup.goalieStageRows?.playoffs || []).map(function (row) { return Object.assign({}, row, { stage: "playoffs" }); }));
    return (staged.length ? staged : (cup.goalieRows && cup.goalieRows.length ? cup.goalieRows : collectCupGoalies(cup))).map(function (row) {
      return enrichProfileCupRow(row, cup);
    });
  }

  function enrichProfileCupRow(row, cup) {
    return Object.assign({}, row, {
      cupId: cup.id,
      cupCode: cup.code,
      sortOrder: cup.sortOrder,
      cupStartTimestamp: cup.cupStartTimestamp,
      cupEndTimestamp: cup.cupEndTimestamp,
      cupSortTimestamp: cup.cupSortTimestamp
    });
  }

  function buildTeamGoalies(teamName) {
    const map = new Map();
    state.cups.forEach(function (cup) {
      cup.goalieRows.filter(function (row) {
        return row.team === teamName;
      }).forEach(function (row) {
        const key = fold(row.name);
        if (!map.has(key)) {
          map.set(key, { name: row.name, team: teamName, gp: 0, sa: 0, ga: 0, sv: 0, so: 0, cups: new Set() });
        }
        const target = map.get(key);
        target.gp += row.gp;
        target.sa += row.sa;
        target.ga += row.ga;
        target.sv += row.sv;
        target.so += row.so;
        target.cups.add(cup.code);
      });
    });
    return Array.from(map.values()).map(finalizeGoalie).sort(sortGoalies);
  }

  function bindInteractions() {
    const input = document.querySelector("[data-global-search]");
    if (input) {
      input.addEventListener("input", function () {
        state.query = input.value;
        render();
        const nextInput = document.querySelector("[data-global-search]");
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
        }
      });
    }
    const teamFilter = document.querySelector("[data-cup-team-filter]");
    if (teamFilter) {
      teamFilter.addEventListener("change", function () {
        const cupId = teamFilter.dataset.cupId || state.activeCupId;
        const team = teamFilter.value;
        location.hash = "#/cups/" + encodeURIComponent(cupId) + "/matches" + (team ? "?team=" + encodeURIComponent(team) : "");
      });
    }
    document.querySelectorAll("[data-standing-sort]").forEach(function (button) {
      button.addEventListener("click", function () {
        sortStandingTable(button);
      });
    });
  }

  function sortStandingTable(button) {
    const table = button.closest("table");
    const tbody = table?.querySelector("tbody");
    if (!table || !tbody) return;
    const key = button.dataset.standingSort || "rank";
    const type = button.dataset.sortType || "number";
    const currentKey = table.dataset.sortKey || "rank";
    const currentDir = table.dataset.sortDir || "asc";
    const defaultDir = type === "text" || key === "rank" ? "asc" : "desc";
    const direction = currentKey === key ? (currentDir === "desc" ? "asc" : "desc") : defaultDir;
    table.dataset.sortKey = key;
    table.dataset.sortDir = direction;
    table.querySelectorAll("[data-standing-sort]").forEach(function (sortButton) {
      sortButton.classList.toggle("active", sortButton === button);
      sortButton.dataset.sortDir = sortButton === button ? direction : "";
    });
    const rows = Array.from(tbody.querySelectorAll("tr")).sort(function (left, right) {
      const leftValue = left.dataset[key] || "";
      const rightValue = right.dataset[key] || "";
      if (type === "text") {
        return direction === "asc"
          ? leftValue.localeCompare(rightValue, "sv")
          : rightValue.localeCompare(leftValue, "sv");
      }
      const diff = number(leftValue) - number(rightValue);
      return direction === "asc" ? diff : -diff;
    });
    rows.forEach(function (row, index) {
      const rankCell = row.querySelector(".rankCell");
      if (rankCell) rankCell.textContent = String(index + 1);
      tbody.appendChild(row);
    });
  }

  function sortPlayers(a, b) {
    return b.pts - a.pts || b.g - a.g || a.name.localeCompare(b.name, "sv");
  }

  function finalizeGoalie(goalie) {
    const sa = number(goalie.sa);
    const sv = number(goalie.sv);
    const ga = number(goalie.ga);
    const gp = number(goalie.gp);
    goalie.svp = sa ? sv / sa : 0;
    goalie.gaa = gp ? ga / gp : 0;
    return goalie;
  }

  function sortGoalies(a, b) {
    return b.svp - a.svp || b.sv - a.sv || b.gp - a.gp || a.name.localeCompare(b.name, "sv");
  }

  function compareMatches(a, b) {
    return parseDate(b.date, b.time) - parseDate(a.date, a.time);
  }

  function parseDate(date, time) {
    const value = Date.parse([date, time].filter(Boolean).join(" "));
    return Number.isFinite(value) ? value : 0;
  }

  function getCupDateMeta(matches, cup, index) {
    const timestamps = (matches || []).map(function (match) {
      return parseDate(match.date, match.time);
    }).filter(function (value) {
      return value > 0;
    });
    const fallback = typeof cup.sortOrder === "number" ? cup.sortOrder : index;
    if (!timestamps.length) {
      return {
        startTimestamp: 0,
        endTimestamp: 0,
        sortTimestamp: 0,
        fallbackSort: fallback
      };
    }
    return {
      startTimestamp: Math.min.apply(Math, timestamps),
      endTimestamp: Math.max.apply(Math, timestamps),
      sortTimestamp: Math.max.apply(Math, timestamps),
      fallbackSort: fallback
    };
  }

  function compareCupsByDate(a, b) {
    const dateDiff = number(b.cupSortTimestamp) - number(a.cupSortTimestamp);
    if (dateDiff) return dateDiff;
    return number(b.sortOrder) - number(a.sortOrder);
  }

  function compareCupRowsByDate(a, b) {
    const dateDiff = number(b.cupSortTimestamp) - number(a.cupSortTimestamp);
    if (dateDiff) return dateDiff;
    return number(b.sortOrder) - number(a.sortOrder);
  }

  function compareProfileRowsByDate(a, b) {
    const cupDiff = compareCupRowsByDate(a, b);
    if (cupDiff) return cupDiff;
    return stageSortValue(a.stage) - stageSortValue(b.stage);
  }

  function stageSortValue(stage) {
    return normalizeStage(stage) === "playoffs" ? 1 : 0;
  }

  function formatStageLabel(stage) {
    return normalizeStage(stage) === "playoffs" ? "Slutspel" : "Gruppspel";
  }

  function formatDate(value) {
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) return value || "Datum saknas";
    return new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "short", day: "numeric" }).format(parsed);
  }

  function formatClock() {
    return new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  }

  function formatCupDateRange(cup) {
    const start = number(cup.cupStartTimestamp);
    const end = number(cup.cupEndTimestamp);
    if (!start && !end) return "Datum saknas";
    if (!start || start === end) return formatTimestampDate(end || start);
    return formatTimestampDate(start) + " - " + formatTimestampDate(end);
  }

  function formatTimestampDate(timestamp) {
    return new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "short", day: "numeric" }).format(new Date(timestamp));
  }

  function score(match) {
    const suffix = match.overtime ? " OT" : "";
    return display(match.awayScore) + "-" + display(match.homeScore) + suffix;
  }

  function formatPercent(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return "0.0";
    return (parsed * 100).toFixed(1);
  }

  function formatDecimal(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
  }

  function display(value) {
    return value === null || value === undefined ? "?" : String(value);
  }

  function isSummer(cup) {
    return fold(cup.name + " " + cup.code).includes("sommar");
  }

  function normalizeRound(value) {
    const folded = fold(value);
    if (folded.includes("final") && !folded.includes("semi")) return "Final";
    if (folded.includes("semi")) return "Semifinal";
    if (folded.includes("kvart")) return "Kvartsfinal";
    if (folded.includes("atton") || folded.includes("ÃƒÂ¥tton") || folded.includes("16")) return "Ãƒâ€¦ttondelsfinal";
    if (folded.includes("playoff") || folded.includes("slutspel")) return "Slutspel";
    return value || "Slutspel";
  }

  function roundRank(round) {
    const folded = fold(round);
    if (folded.includes("play in") || folded.includes("playin")) return 0;
    if (folded.includes("atton")) return 1;
    if (folded.includes("kvart")) return 2;
    if (folded.includes("semi")) return 3;
    if (folded.includes("final")) return 4;
    return 9;
  }

  function nullableNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function text(value) {
    return fixEncoding(String(value || "").trim());
  }

  function fold(value) {
    return text(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function removeDiacritics(value) {
    return text(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeLogoKey(value) {
    return removeDiacritics(value).toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function toTitleCase(value) {
    return String(value || "").replace(/[^\s_-]+/g, function (part) {
      return part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase();
    });
  }

  function uniqueStrings(values) {
    const seen = new Set();
    const output = [];
    (values || []).forEach(function (value) {
      const clean = String(value || "").trim();
      if (!clean || seen.has(clean)) return;
      seen.add(clean);
      output.push(clean);
    });
    return output;
  }

  function fixEncoding(value) {
    let output = String(value || "");
    for (let pass = 0; pass < 3 && /[\u00c3\u00c2\u00e2]/.test(output); pass += 1) {
      try {
        const encoded = Array.from(output).map(function (char) {
          const code = cp1252Byte(char);
          if (code !== null) return "%" + code.toString(16).padStart(2, "0");
          return encodeURIComponent(char);
        }).join("");
        const decoded = decodeURIComponent(encoded);
        if (decoded === output) break;
        output = decoded;
      } catch (_error) {
        break;
      }
    }
    return output
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\u00a0/g, " ")
      .replace(/[\u2302\u25c6\u25a6\u25cf\u21af\u25a3]/g, "");
  }

  function cp1252Byte(char) {
    const code = char.charCodeAt(0);
    if (code <= 255) return code;
    const map = {
      0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84,
      0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88,
      0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c,
      0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93,
      0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
      0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b,
      0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f
    };
    return Object.prototype.hasOwnProperty.call(map, code) ? map[code] : null;
  }

  function escapeHtml(value) {
    return fixEncoding(String(value ?? ""))
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function repairRenderedText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(function (node) {
      const fixed = fixEncoding(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    });
    root.querySelectorAll("[placeholder], [aria-label], [title], [alt]").forEach(function (node) {
      ["placeholder", "aria-label", "title", "alt"].forEach(function (attribute) {
        if (!node.hasAttribute(attribute)) return;
        const value = node.getAttribute(attribute);
        const fixed = fixEncoding(value);
        if (fixed !== value) node.setAttribute(attribute, fixed);
      });
    });
  }
})();
