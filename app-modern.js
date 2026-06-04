(function () {
  const app = document.querySelector("#app");
  const state = {
    cups: [],
    teams: [],
    players: [],
    goalies: [],
    teamLogoIndex: new Map(),
    playerImageIndex: new Map(),
    view: "overview",
    query: "",
    activeCupId: "",
    activeCupSection: "",
    activeCupTeamFilter: "",
    activeTeam: "",
    activePlayer: "",
    activeGoalie: ""
  };

  const routes = new Set(["overview", "cups", "teams", "players", "goalies", "matches", "about"]);

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
    state.view = routes.has(parts[0]) ? parts[0] : "overview";
    state.activeCupId = state.view === "cups" ? decodeURIComponent(parts[1] || "") : "";
    state.activeCupSection = state.view === "cups" ? decodeURIComponent(parts[2] || "") : "";
    state.activeCupTeamFilter = state.view === "cups" && state.activeCupSection === "matches" ? params.get("team") || "" : "";
    state.activeTeam = state.view === "teams" ? decodeURIComponent(parts[1] || "") : "";
    state.activePlayer = state.view === "players" ? decodeURIComponent(parts[1] || "") : "";
    state.activeGoalie = state.view === "goalies" ? decodeURIComponent(parts[1] || "") : "";
  }

  function render() {
    const model = buildModel();
    app.innerHTML = `
      <div class="shell">
        ${renderArenaHeader(model)}
        <main class="stage">
          ${renderTopbar(model)}
          <div class="view" data-view="${state.view}">
            ${renderView(model)}
          </div>
        </main>
      </div>
    `;
    bindInteractions();
  }

  function renderArenaHeader(model) {
    return `
      <header class="arena">
        <a class="mark" href="#/overview" aria-label="SEC start">
          <img src="./SECLOGGA.png" alt="">
          <span>SEC</span>
          <b>Live</b>
        </a>
        <nav class="railnav" aria-label="SEC meny">
          ${navItem("overview", "Översikt", "⌂")}
          ${navItem("cups", "Cuper", "◆")}
          ${navItem("teams", "Lag", "▦")}
          ${navItem("players", "Spelare", "●")}
          ${navItem("matches", "Matcher", "↯")}
          ${navItem("goalies", "Målvakter", "▣")}
          ${navItem("about", "Live", "i")}
        </nav>
        <div class="railcard">
          <span>Live</span>
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
    return `
      <header class="top">
        <div>
          <p>${model.latestCup ? model.latestCup.code : "SEC"}</p>
          <h1>${getViewTitle()}</h1>
        </div>
        <label class="command">
          <span>Sök</span>
          <input data-global-search value="${escapeHtml(state.query)}" placeholder="Lag, spelare, cup eller match" autocomplete="off">
        </label>
      </header>
      ${state.query ? renderSearchResults(model) : ""}
    `;
  }

  function getViewTitle() {
    if (state.view === "cups" && state.activeCupId) {
      const cup = state.cups.find(function (entry) { return entry.id === state.activeCupId; });
      if (!cup) return "Cup";
      if (state.activeCupSection === "tables") return cup.name + " - tabeller";
      if (state.activeCupSection === "teams") return cup.name + " - lag";
      if (state.activeCupSection === "bracket") return cup.name + " - slutspel";
      if (state.activeCupSection === "players") return cup.name + " - spelare";
      if (state.activeCupSection === "goalies") return cup.name + " - målvakter";
      if (state.activeCupSection === "stats") return cup.name + " - statistik";
      if (state.activeCupSection === "info") return cup.name + " - cupinfo";
      if (state.activeCupSection === "matches") return cup.name + " - matcher";
      return cup.name;
    }
    if (state.view === "teams" && state.activeTeam) return state.activeTeam;
    if (state.view === "players" && state.activePlayer) return state.activePlayer;
    if (state.view === "goalies" && state.activeGoalie) return state.activeGoalie;
    return {
      overview: "Liveöversikt",
      cups: "Cuper",
      teams: "Lagkartan",
      players: "Spelarhubben",
      goalies: "Målvaktshubben",
      matches: "Matchflöde",
      about: "SEC Live"
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
    const playerHits = state.players.filter(function (player) {
      return fold(player.name + " " + player.team).includes(query);
    }).slice(0, 4);
    const goalieHits = state.goalies.filter(function (goalie) {
      return fold(goalie.name + " " + goalie.team).includes(query);
    }).slice(0, 4);
    const matchHits = model.allMatches.filter(function (entry) {
      return fold(entry.cup.code + " " + entry.match.awayTeam + " " + entry.match.homeTeam).includes(query);
    }).slice(0, 4);
    const hits = []
      .concat(cupHits.map(function (cup) { return searchLink("#/cups/" + encodeURIComponent(cup.id), "Cup", cup.name, cup.matchCount + " matcher"); }))
      .concat(teamHits.map(function (team) { return searchLink("#/teams/" + encodeURIComponent(team.name), "Lag", team.name, team.matches + " matcher"); }))
      .concat(playerHits.map(function (player) { return searchLink("#/players/" + encodeURIComponent(player.name), "Spelare", player.name, player.pts + " poäng"); }))
      .concat(goalieHits.map(function (goalie) { return searchLink("#/goalies/" + encodeURIComponent(goalie.name), "Målvakt", goalie.name, formatPercent(goalie.svp) + " SV%"); }))
      .concat(matchHits.map(function (entry) { return searchLink("#/matches", entry.cup.code, entry.match.awayTeam + " - " + entry.match.homeTeam, score(entry.match)); }));

    return `
      <section class="searchdrop">
        ${hits.length ? hits.join("") : `<div class="empty">Inga träffar för "${escapeHtml(state.query)}".</div>`}
      </section>
    `;
  }

  function searchLink(href, type, title, meta) {
    return `<a href="${href}"><span>${escapeHtml(type)}</span><strong>${escapeHtml(title)}</strong><em>${escapeHtml(meta)}</em></a>`;
  }

  function renderView(model) {
    if (state.view === "cups" && state.activeCupId) {
      const cup = state.cups.find(function (entry) { return entry.id === state.activeCupId; });
      if (state.activeCupSection === "tables") return renderCupTablesPage(cup);
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
          <span class="tag liveTag">Live</span>
          <h2>SEC Live</h2>
          <p>Följ cuper, tabeller, slutspel, lag, spelare, målvakter och senaste matcherna från hela SEC.</p>
          <div class="liveStrip">
            <span>Uppdaterad ${escapeHtml(formatLiveClock())}</span>
            <span>${model.latestMatches[0] ? escapeHtml(model.latestMatches[0].cup.code + " · " + formatDate(model.latestMatches[0].match.date)) : "Väntar på matchdata"}</span>
          </div>
          <div class="actions">
            <a href="#/matches">Liveflöde</a>
            <a href="#/cups">Cuper</a>
          </div>
        </div>
        <div class="rink">
          <div class="rinkLine"></div>
          <div class="puck"></div>
          <strong>${model.latestCup ? escapeHtml(model.latestCup.code) : "SEC"}</strong>
          <span>${model.totalGoals} mål registrerade</span>
        </div>
      </section>
      <section class="metricGrid">
        ${metric("Cuper", state.cups.length, "turneringar")}
        ${metric("Matcher", model.totalMatches, "i arkivet")}
        ${metric("Lag", state.teams.length, "unika namn")}
        ${metric("Spelare", state.players.length, "statistikrader")}
        ${metric("Målvakter", state.goalies.length, "registrerade")}
        ${metric("Mål", model.totalGoals, "totalt")}
        ${metric("Snitt", model.avgGoals, "mål per match")}
      </section>
      <section class="dashGrid">
        ${panel("Senaste matcher", renderMatchRows(model.latestMatches, 7))}
        ${panel("Poängtoppen", renderLeaderRows(model.topPlayers))}
        ${panel("Målvaktstoppen", renderGoalieRows(model.topGoalies))}
      </section>
    `;
  }

  function renderCups(model) {
    return `
      <p class="viewIntro">Välj en cup för tabeller, slutspel, matcher, lag och toppspelare.</p>
      <section class="cupMatrix">
        ${state.cups.map(renderCupCard).join("")}
      </section>
    `;
  }

  function renderCupCard(cup) {
    return `
      <a class="cupTile ${isSummer(cup) ? "summer" : ""}" href="#/cups/${encodeURIComponent(cup.id)}">
        <span>${escapeHtml(cup.code)}</span>
        <strong>${escapeHtml(cup.name)}</strong>
        <div>
          <b>${cup.matchCount}</b><em>matcher</em>
          <b>${cup.teams.length}</b><em>lag</em>
        </div>
        <p>${escapeHtml(formatCupDateRange(cup))}</p>
        <p>Vinnare: ${escapeHtml(cup.winner || "Ej klar")}</p>
      </a>
    `;
  }

  function renderCupHero(cup, options) {
    const opts = options || {};
    const full = opts.full !== false;
    const groupMatches = cup.matches.filter(function (match) { return !isPlayoffMatch(match); }).length;
    const playoffMatches = cup.matches.filter(isPlayoffMatch).length;
    return `
      <section class="cupHero ${full ? "full" : "compact"} ${isSummer(cup) ? "summer" : ""}">
        <div class="cupHeroCopy">
          <nav class="crumbs" aria-label="Brödsmulor">
            <a href="#/overview">Start</a>
            <span>/</span>
            <a href="#/cups">Cuper</a>
            <span>/</span>
            <strong>${escapeHtml(cup.code)}</strong>
          </nav>
          <p class="cupKicker">${escapeHtml(cup.code)}</p>
          <h2>${escapeHtml(opts.title || cup.name)}</h2>
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

  function renderCupSpotlight(cup) {
    const topPlayer = cup.topPlayers[0];
    const topGoalie = cup.topGoalies[0];
    return `
      <section class="cupSpotlight">
        ${topPlayer ? `
          <a class="spotlightCard" href="#/players/${encodeURIComponent(topPlayer.name)}">
            ${renderPlayerPortrait(topPlayer, "spotlightPortrait")}
            <div>
              <span>Poängkung</span>
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
              <span>Målvaktskung</span>
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
        description: "Cupsidan visar översikt, tabeller, lag, topplistor och matcher för den valda turneringen.",
        full: true
      })}
      ${renderCupSectionNav(cup)}
      <section class="sportGrid">
        ${panelWithAction("Tabeller", "Fullständig tabell", "#/cups/" + encodeURIComponent(cup.id) + "/tables", renderStandingsPreview(standings, cup.settings))}
        ${panelWithAction("Slutspelsträd", "Fullständigt träd", "#/cups/" + encodeURIComponent(cup.id) + "/bracket", renderBracketPreview(bracket, cup.settings))}
      </section>
      <section class="dashGrid two">
        ${panelWithAction("Cupinfo", "Fullständiga regler", "#/cups/" + encodeURIComponent(cup.id) + "/info", renderCupSettings(cup.settings, { preview: true }))}
        ${panelWithAction("Matcher", "Alla matcher", "#/cups/" + encodeURIComponent(cup.id) + "/matches", renderCupMatchPreview(rows))}
        ${panelWithAction("Toppspelare", "All statistik", "#/cups/" + encodeURIComponent(cup.id) + "/stats", renderCupTopPlayerPreview(cup.topPlayers))}
        ${panelWithAction("Toppmålvakter", "All statistik", "#/cups/" + encodeURIComponent(cup.id) + "/stats", renderCupTopGoaliePreview(cup.topGoalies))}
        ${panel("Lag i cupen", renderMiniTags(cup.teams, "teams"))}
      </section>
    `;
  }

  function renderCupTablesPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    const standings = buildStandings(cup);
    return `
      ${renderCupHero(cup, {
        title: "Fullständig tabell",
        description: cup.name + " · " + formatCupDateRange(cup) + " · streck enligt cupinfo."
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
        title: "Fullständigt slutspelsträd",
        description: cup.name + " · " + bracket.reduce(function (sum, round) { return sum + ((round.series && round.series.length) || 0); }, 0) + " serier."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderBracket(bracket, cup.settings, { full: true })}
      </section>
    `;
  }

  function renderCupSectionNav(cup) {
    const base = "#/cups/" + encodeURIComponent(cup.id);
    const current = state.activeCupSection || "";
    const items = [
      ["", "Översikt"],
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
        title: "Lag",
        description: cup.name + " · " + rows.length + " lag med matcher, mål och resultat i cupen."
      })}
      ${renderCupSectionNav(cup)}
      <section class="cupTeamGrid">
        ${rows.map(function (team) {
          return `
            <a class="teamTile cupTeamTile" href="#/teams/${encodeURIComponent(team.name)}">
              ${renderTeamLogo(team.name, "teamLogoTile")}
              <strong>${escapeHtml(team.name)}</strong>
              <em>${team.matches} matcher · ${team.wins} vinster · ${team.goalsFor}-${team.goalsAgainst}</em>
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
        title: "Toppspelare",
        description: cup.name + " · all spelarstatistik från gruppspel och slutspel."
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
        title: "Målvakter",
        description: cup.name + " · räddningsprocent, GAA, räddningar och nollor."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupGoalieStatsTable(cup.goalieRows)}
      </section>
    `;
  }

  function renderCupStatsPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    return `
      ${renderCupHero(cup, {
        title: "Statistik",
        description: cup.name + " · spelare och målvakter uppdelat på gruppspel och slutspel."
      })}
      ${renderCupSectionNav(cup)}
      <section class="statPageGrid">
        ${panel("Spelare - gruppspel", renderCupPlayerStatsTable(cup.playerStageRows.group))}
        ${panel("Spelare - slutspel", renderCupPlayerStatsTable(cup.playerStageRows.playoffs))}
        ${panel("Målvakter - gruppspel", renderCupGoalieStatsTable(cup.goalieStageRows.group))}
        ${panel("Målvakter - slutspel", renderCupGoalieStatsTable(cup.goalieStageRows.playoffs))}
      </section>
    `;
  }

  function renderCupInfoPage(cup) {
    if (!cup) return `<section class="emptyPage">Cupen hittades inte.</section>`;
    return `
      ${renderCupHero(cup, {
        title: "Fullständiga regler",
        description: cup.name + " · cupinfo, behörighet, BO-format och spelargränser."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupSettings(cup.settings, { full: true })}
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
        title: "Alla matcher",
        description: cup.name + " · " + rows.length + " av " + cup.matches.length + " matcher" + (selectedTeam ? " för " + selectedTeam : "") + "."
      })}
      ${renderCupSectionNav(cup)}
      <section class="fullPagePanel">
        ${renderCupMatchFilter(cup, teams, selectedTeam)}
        ${renderMatchRows(rows, rows.length)}
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

  function renderTeams() {
    return `
      <p class="viewIntro">Alla lag samlade som scanbara brickor. Klicka ett lag för snabb historik.</p>
      <section class="teamGrid">
        ${state.teams.slice(0, 240).map(function (team) {
          return `
            <a class="teamTile" href="#/teams/${encodeURIComponent(team.name)}">
              ${renderTeamLogo(team.name, "teamLogoTile")}
              <strong>${escapeHtml(team.name)}</strong>
              <em>${team.matches} matcher · ${team.wins} vinster</em>
            </a>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderTeamDetail(model, team) {
    if (!team) return `<section class="emptyPage">Laget hittades inte.</section>`;
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
        <p>${team.cups} cuper, ${team.matches} matcher, ${team.wins} vinster och ${team.goalsFor} mål framåt.</p>
      </section>
      <section class="metricGrid compact">
        ${metric("Cuper", team.cups, "deltaganden")}
        ${metric("Matcher", team.matches, "totalt")}
        ${metric("Vinster", team.wins, "registrerade")}
        ${metric("Mål", team.goalsFor, "gjorda")}
      </section>
      <section class="sportGrid">
        ${panel("Lagets SEC-säsonger", renderTeamCupTable(cupRows))}
        ${panel("Profiler i laget", renderLeaderRows(roster.slice(0, 12)))}
        ${panel("Målvakter i laget", renderGoalieRows(buildTeamGoalies(team.name).slice(0, 8)))}
      </section>
      ${panel("Senaste matcher", renderMatchRows(matches, 16))}
    `;
  }

  function renderPlayers() {
    return `
      <p class="viewIntro">En kompakt leaderboard över spelare från all cupdata.</p>
      <section class="playerBoard">
        ${state.players.slice(0, 160).map(function (player, index) {
          return `
            <a class="playerRow" href="#/players/${encodeURIComponent(player.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(player.name)}</strong>
              <em>${escapeHtml(player.team || "Okänt lag")}</em>
              <b>${player.pts}p</b>
            </a>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderGoalies() {
    return `
      <p class="viewIntro">Räddningsprocent, räddningar, GAA och historik för målvakter från båda datakällorna.</p>
      <section class="playerBoard">
        ${state.goalies.slice(0, 160).map(function (goalie, index) {
          return `
            <a class="playerRow" href="#/goalies/${encodeURIComponent(goalie.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(goalie.name)}</strong>
              <em>${escapeHtml(goalie.team || "Okänt lag")} · ${goalie.gp} GP</em>
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
        <p>${escapeHtml(player.team || "Okänt lag")} · ${player.cups.size} cuper · ${player.gp} GP · ${player.pts} poäng.</p>
      </section>
      <section class="metricGrid compact">
        ${metric("Poäng", player.pts, "totalt")}
        ${metric("Mål", player.g, "gjorda")}
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
    if (!goalie) return `<section class="emptyPage">Målvakten hittades inte.</section>`;
    return `
      <section class="detailHero">
        <a href="#/goalies">Tillbaka till målvakter</a>
        <h2>${renderPersonName(goalie.name)}</h2>
        <p>${escapeHtml(goalie.team || "Okänt lag")} · ${goalie.cups.size} cuper · ${goalie.gp} GP · ${formatPercent(goalie.svp)} SV%.</p>
      </section>
      <section class="metricGrid compact">
        ${metric("SV%", formatPercent(goalie.svp), "räddningsprocent")}
        ${metric("GAA", formatDecimal(goalie.gaa), "mål emot/match")}
        ${metric("SV", goalie.sv, "räddningar")}
        ${metric("SO", goalie.so, "hållna nollor")}
      </section>
      <section class="sportGrid">
        ${panel("Cuphistorik", renderGoalieCupTable(goalie))}
        ${panel("Lagresa", renderMiniTags(Array.from(goalie.teams), "teams"))}
      </section>
    `;
  }

  function renderMatches(model) {
    return `
      <p class="viewIntro">Senaste registrerade matcher från hela datan, oavsett cup.</p>
      ${panel("Matcher", renderMatchRows(model.allMatches.slice(0, 90), 90))}
    `;
  }

  function renderAbout(model) {
    return `
      <section class="manifest">
        <span>Live</span>
        <h2>SEC Live</h2>
        <p>Sidan samlar aktuell cupdata, historik, matchflöde, tabeller, slutspel, lag, spelare och målvakter på ett ställe.</p>
        <p>Senaste registrerade match: <strong>${model.latestMatches[0] ? escapeHtml(model.latestMatches[0].cup.code + " · " + model.latestMatches[0].match.awayTeam + " - " + model.latestMatches[0].match.homeTeam + " " + score(model.latestMatches[0].match)) : "Ingen match hittad"}</strong>.</p>
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

  function renderMatchRows(entries, limit) {
    const rows = entries.slice(0, limit).map(function (entry) {
      return `
        <div class="matchRow">
          <span>${escapeHtml(entry.cup.code)}</span>
          <strong class="matchTeams">
            ${renderTeamIdentity(entry.match.awayTeam, "teamLogoInline")}
            <b>${score(entry.match)}</b>
            ${renderTeamIdentity(entry.match.homeTeam, "teamLogoInline")}
          </strong>
          <em>${escapeHtml(formatDate(entry.match.date))} · ${escapeHtml(entry.match.group || entry.match.stage || "Match")}</em>
        </div>
      `;
    }).join("");
    return `<div class="matchList">${rows || `<div class="empty">Inga matcher hittades.</div>`}</div>`;
  }

  function renderCupMatchPreview(entries) {
    const rows = entries.slice(0, 10).map(function (entry) {
      return `
        <div class="matchPreviewRow">
          ${renderTeamLogo(entry.match.awayTeam, "teamLogoInline")}
          <span>${escapeHtml(entry.match.awayTeam)}</span>
          <b>${score(entry.match)}</b>
          ${renderTeamLogo(entry.match.homeTeam, "teamLogoInline")}
          <span>${escapeHtml(entry.match.homeTeam)}</span>
          <em>${escapeHtml(entry.match.group || entry.match.stage || "Match")}</em>
        </div>
      `;
    }).join("");
    return `<div class="matchPreviewList">${rows || `<div class="empty">Inga matcher hittades.</div>`}</div>`;
  }

  function renderLeaderRows(players) {
    return `
      <div class="leaderList">
        ${players.map(function (player, index) {
          return `
            <a class="leader" href="#/players/${encodeURIComponent(player.name)}">
              <span>${index + 1}</span>
              <strong>${renderPersonName(player.name)}</strong>
              <em>${escapeHtml(player.team || "Okänt lag")}</em>
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
              <em>${escapeHtml(goalie.team || "Okänt lag")} · ${goalie.gp} GP</em>
              <b>${formatPercent(goalie.svp)}</b>
            </a>
          `;
        }).join("") || `<div class="empty">Ingen målvaktsstatistik hittades.</div>`}
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
              <em>${renderTeamIdentityStatic(goalie.team, "teamLogoChip")} · ${goalie.gp} GP</em>
              <b>${formatPercent(goalie.svp)}</b>
            </a>
          `;
        }).join("") || `<div class="empty">Ingen målvaktsstatistik hittades.</div>`}
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
    if (!sorted.length) return `<div class="empty">Ingen målvaktsstatistik hittades.</div>`;
    return `
      <div class="dataTable fullStatsTable">
        <table>
          <thead><tr><th>#</th><th>Målvakt</th><th>Lag</th><th>GP</th><th>SA</th><th>GA</th><th>SV</th><th>SV%</th><th>GAA</th><th>SO</th></tr></thead>
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
          return `<a href="${hrefBase}${encodeURIComponent(item)}">${type === "teams" ? renderTeamLogo(item, "teamLogoChip") : ""}<span>${escapeHtml(item)}</span></a>`;
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

  function renderBracketPreview(rounds, settings) {
    return renderBracket(rounds, settings, { preview: true });
  }

  function renderBracket(rounds, settings, options) {
    if (!rounds.length) return `<div class="empty">Inget slutspelsträd hittades för cupen.</div>`;
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
                    <span class="${winner === series.awayTeam ? "winner" : ""}">${renderTeamIdentity(series.awayTeam, "teamLogoTiny")} <b>${series.awayWins}</b></span>
                    <span class="${winner === series.homeTeam ? "winner" : ""}">${renderTeamIdentity(series.homeTeam, "teamLogoTiny")} <b>${series.homeWins}</b></span>
                    ${renderSeriesResults(series)}
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

  function renderSeriesResults(series) {
    const rows = (series.matches || []).slice().sort(function (a, b) {
      return parseDate(a.date, a.time) - parseDate(b.date, b.time);
    });
    if (!rows.length) return `<em>Inga matchresultat</em>`;
    return `
      <div class="seriesResults">
        ${rows.map(function (match) {
          return `<b>${escapeHtml(seriesScore(match, series.awayTeam, series.homeTeam))}</b>`;
        }).join("")}
      </div>
    `;
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
      ["BO åtton", formatSettingValue(safeSettings.bestOf.roundOf16)],
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
        ${safeSettings.eligibility ? `<p><span>Behörighet</span>${escapeHtml(stripRuleLabel(safeSettings.eligibility, "Behörighet"))}</p>` : ""}
        ${shownInfo.map(function (info) {
          return `<p><span>Info</span>${escapeHtml(info)}</p>`;
        }).join("")}
        ${opts.preview && infoItems.length > shownInfo.length ? `<div class="previewMore">+${infoItems.length - shownInfo.length} infodelar till</div>` : ""}
      </div>
    `;
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
      { count: 8, round: "Åttondelsfinal" },
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
    ["Semifinal", "Kvartsfinal", "Åttondelsfinal"].forEach(function (roundName) {
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
        const effectiveRoundName = roundName === "Åttondelsfinal" && previous.length < current.length * 2 ? "Play in" : roundName;
        previous.sort(function (a, b) { return a.firstTimestamp - b.firstTimestamp; });
        rounds.push({ round: effectiveRoundName, series: previous, matches: previous.flatMap(function (item) { return item.matches; }) });
        current = previous;
      }
    });

    const leftovers = series.filter(function (candidate) {
      return !assigned.has(candidate);
    });
    if (leftovers.length) {
      const earliestName = rounds.some(function (round) { return round.round === "Åttondelsfinal" || round.round === "Play in"; }) ? "Slutspel" : "Play in";
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
        roundOf16: nullableNumber(bestOf.roundOf16 ?? source.boAtton ?? source["bo åtton"] ?? source["bo atton"]),
        quarter: nullableNumber(bestOf.quarter ?? source.boQuarter ?? source["bo kvart"]),
        semi: nullableNumber(bestOf.semi ?? source.boSemi ?? source["bo semi"]),
        final: nullableNumber(bestOf.final ?? source.boFinal ?? source["bo final"])
      },
      minPlayers: nullableNumber(source.minPlayers ?? source["Minst antal spelare"] ?? source["Min antal spelare"]),
      maxPlayers: nullableNumber(source.maxPlayers ?? source["Max antal spelare"] ?? source["Max antal"]),
      eligibility: text(source.eligibility ?? source["Behörighet:"] ?? source["Behörighet"] ?? source.Behorighet ?? ""),
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
          <thead><tr><th>Cup</th><th>Matcher</th><th>Vinster</th><th>Mål</th><th>Spelare</th></tr></thead>
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
      return compareCupRowsByDate(a, b);
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
    if (!rows.length) return `<div class="empty">Ingen målvaktshistorik hittades.</div>`;
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
      return compareCupRowsByDate(a, b);
    });
    if (!rows.length) return `<div class="empty">Ingen cuphistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Datum</th><th>Lag</th><th>GP</th><th>G</th><th>A</th><th>PTS</th><th>PIM</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cupId)}">${escapeHtml(row.cupCode)}</a></td><td>${escapeHtml(formatCupDateRange(row))}</td><td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td><td>${row.gp}</td><td>${row.g}</td><td>${row.a}</td><td><strong>${row.pts}</strong></td><td>${row.pim}</td></tr>`;
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
    if (!rows.length) return `<div class="empty">Ingen malvaktshistorik hittades.</div>`;
    return `
      <div class="dataTable">
        <table>
          <thead><tr><th>Cup</th><th>Datum</th><th>Lag</th><th>GP</th><th>SA</th><th>GA</th><th>SV</th><th>SV%</th><th>GAA</th><th>SO</th></tr></thead>
          <tbody>
            ${rows.map(function (row) {
              return `<tr><td><a href="#/cups/${encodeURIComponent(row.cupId)}">${escapeHtml(row.cupCode)}</a></td><td>${escapeHtml(formatCupDateRange(row))}</td><td>${renderTeamIdentity(row.team, "teamLogoTiny")}</td><td>${row.gp}</td><td>${row.sa}</td><td>${row.ga}</td><td>${row.sv}</td><td><strong>${formatPercent(row.svp)}</strong></td><td>${formatDecimal(row.gaa)}</td><td>${row.so}</td></tr>`;
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

  function renderTeamIdentity(teamName, logoClass) {
    const safeName = text(teamName || "Okänt lag");
    return `
      <a class="teamIdentity" href="#/teams/${encodeURIComponent(safeName)}">
        ${renderTeamLogo(safeName, logoClass || "teamLogoTiny")}
        <span>${escapeHtml(safeName)}</span>
      </a>
    `;
  }

  function renderTeamIdentityStatic(teamName, logoClass) {
    const safeName = text(teamName || "Okänt lag");
    return `
      <span class="teamIdentity teamIdentityStatic">
        ${renderTeamLogo(safeName, logoClass || "teamLogoTiny")}
        <span>${escapeHtml(safeName)}</span>
      </span>
    `;
  }

  function renderPersonName(name) {
    const parsed = parsePersonCountry(name);
    const flag = countryFlag(parsed.country);
    return `<span class="personName">${flag ? `<span class="countryFlag" title="${escapeHtml(parsed.country)}">${flag}</span>` : ""}<span>${escapeHtml(parsed.name)}</span></span>`;
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
      SWE: "🇸🇪",
      FIN: "🇫🇮",
      NOR: "🇳🇴",
      DEN: "🇩🇰",
      DNK: "🇩🇰",
      ISL: "🇮🇸",
      USA: "🇺🇸",
      CAN: "🇨🇦",
      GBR: "🇬🇧",
      GER: "🇩🇪",
      DEU: "🇩🇪",
      FRA: "🇫🇷",
      ESP: "🇪🇸",
      ITA: "🇮🇹",
      CZE: "🇨🇿",
      SVK: "🇸🇰",
      POL: "🇵🇱",
      AUT: "🇦🇹",
      SUI: "🇨🇭",
      CHE: "🇨🇭",
      NED: "🇳🇱",
      NLD: "🇳🇱",
      BEL: "🇧🇪",
      LAT: "🇱🇻",
      LVA: "🇱🇻",
      EST: "🇪🇪",
      LTU: "🇱🇹",
      RUS: "🇷🇺",
      UKR: "🇺🇦",
      UNK: "🌐"
    };
    return countries[code] || "";
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

  function renderPlayerDetail(_model, player) {
    if (!player) return `<section class="emptyPage">Spelaren hittades inte.</section>`;
    return `
      <section class="detailHero playerProfileHero">
        <div class="profileMedia">
          ${renderPlayerPortrait(player, "playerPortraitHero")}
        </div>
        <div class="profileCopy">
          <a href="#/players">Tillbaka till spelare</a>
          <h2>${renderPersonName(player.name)}</h2>
          <p>${renderTeamIdentity(player.team || "Okant lag", "teamLogoInline")} <span>${player.cups.size} cuper · ${player.gp} GP · ${player.pts} poang.</span></p>
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
  }

  function renderGoalieDetail(_model, goalie) {
    if (!goalie) return `<section class="emptyPage">Malvakten hittades inte.</section>`;
    return `
      <section class="detailHero playerProfileHero">
        <div class="profileMedia">
          ${renderPlayerPortrait(goalie, "playerPortraitHero")}
        </div>
        <div class="profileCopy">
          <a href="#/goalies">Tillbaka till malvakter</a>
          <h2>${renderPersonName(goalie.name)}</h2>
          <p>${renderTeamIdentity(goalie.team || "Okant lag", "teamLogoInline")} <span>${goalie.cups.size} cuper · ${goalie.gp} GP · ${formatPercent(goalie.svp)} SV%.</span></p>
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
          awayTeam: text(match.awayTeam || "Okänt lag"),
          awayScore: nullableNumber(match.awayScore),
          awayShots: nullableNumber(match.awayShots),
          homeScore: nullableNumber(match.homeScore),
          homeShots: nullableNumber(match.homeShots),
          homeTeam: text(match.homeTeam || "Okänt lag"),
          group: text(match.group),
          stage: text(match.stage || "group"),
          overtime: Boolean(match.overtime)
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
      const name = text(row.displayName || row.player || "Okänd spelare");
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
      const name = text(row.displayName || row.player || "Okänd målvakt");
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
      const rows = cup.playerRows && cup.playerRows.length ? cup.playerRows : collectCupPlayers(cup);
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
      const rows = cup.goalieRows && cup.goalieRows.length ? cup.goalieRows : collectCupGoalies(cup);
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

  function formatDate(value) {
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) return value || "Datum saknas";
    return new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "short", day: "numeric" }).format(parsed);
  }

  function formatLiveClock() {
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
    if (folded.includes("atton") || folded.includes("åtton") || folded.includes("16")) return "Åttondelsfinal";
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
    return value
      .replace(/Ã¥/g, "å").replace(/Ã¤/g, "ä").replace(/Ã¶/g, "ö")
      .replace(/Ã…/g, "Å").replace(/Ã„/g, "Ä").replace(/Ã–/g, "Ö")
      .replace(/MÃ¥/g, "Må").replace(/mÃ¥/g, "må")
      .replace(/Ã©/g, "é").replace(/Ã¨/g, "è")
      .replace(/â€“/g, "-").replace(/â€”/g, "-").replace(/Â/g, "");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
