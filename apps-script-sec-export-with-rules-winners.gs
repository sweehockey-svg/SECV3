function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify(buildSecExport(), null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildSecExport() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = getRequiredSheets_(spreadsheet);
  const cups = new Map();

  ingestWinnerRows_(getRows_(sheets.winners), cups);
  ingestSettingsRows_(getRows_(sheets.rules), cups);
  ingestMatchRows_(getRows_(sheets.matches), cups);
  ingestPlayerRows_(getRows_(sheets.playerStats), cups);
  ingestGoalieRows_(getRows_(sheets.goalieStats), cups);

  return {
    generatedAt: new Date().toISOString(),
    source: {
      type: "google-sheet",
      spreadsheetId: spreadsheet.getId(),
      spreadsheetName: spreadsheet.getName(),
      embeddedSheets: ["vinnare", "regler"]
    },
    cups: Array.from(cups.values()).sort(sortCups_)
  };
}

function getRequiredSheets_(spreadsheet) {
  return {
    playerStats: getSheetByNames_(spreadsheet, ["utestatsall", "utesatsall"]),
    goalieStats: getSheetByNames_(spreadsheet, ["målvaktsstatsall", "malvaktsstatsall"]),
    matches: getSheetByNames_(spreadsheet, ["matcherSEC"]),
    winners: getSheetByNames_(spreadsheet, ["vinnare"]),
    rules: getSheetByNames_(spreadsheet, ["regler"])
  };
}

function getSheetByNames_(spreadsheet, names) {
  const allSheets = spreadsheet.getSheets();
  const targetNames = names.map(normalizeName_);

  for (let sheetIndex = 0; sheetIndex < allSheets.length; sheetIndex += 1) {
    const sheet = allSheets[sheetIndex];
    const normalizedSheetName = normalizeName_(sheet.getName());

    for (let nameIndex = 0; nameIndex < targetNames.length; nameIndex += 1) {
      if (normalizedSheetName === targetNames[nameIndex]) {
        return sheet;
      }
    }
  }

  throw new Error("Kunde inte hitta fliken: " + names.join(" / "));
}

function getRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];

  const headerRowIndex = findHeaderRowIndex_(values);
  if (headerRowIndex === -1) return [];

  const headers = values[headerRowIndex].map(normalizeHeader_);
  const rows = [];

  for (let rowIndex = headerRowIndex + 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    if (isRowEmpty_(row)) continue;

    const record = {};
    for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
      const header = headers[columnIndex];
      if (!header) continue;
      record[header] = row[columnIndex];
    }
    rows.push(record);
  }

  return rows;
}

function findHeaderRowIndex_(values) {
  for (let rowIndex = 0; rowIndex < values.length; rowIndex += 1) {
    const normalizedCells = values[rowIndex]
      .map(function(value) { return normalizeHeader_(value); })
      .filter(function(value) { return value !== ""; });

    const joined = normalizedCells.join("|");
    const hasWinnerHeaders =
      normalizedCells.indexOf("cup") !== -1 &&
      normalizedCells.indexOf("1a") !== -1 &&
      normalizedCells.indexOf("2a") !== -1;
    const hasRulesHeaders =
      normalizedCells.indexOf("cup") !== -1 &&
      (
        normalizedCells.indexOf("info") !== -1 ||
        normalizedCells.indexOf("slutspelsstreck_1") !== -1 ||
        normalizedCells.indexOf("behorighet") !== -1
      );

    if (
      joined.indexOf("players") !== -1 ||
      joined.indexOf("goalies") !== -1 ||
      joined.indexOf("date") !== -1 ||
      hasWinnerHeaders ||
      hasRulesHeaders
    ) {
      return rowIndex;
    }
  }

  return -1;
}

function normalizeHeader_(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/\./g, "")
    .replace(/:/g, "")
    .replace(/\s+/g, "_");
}

function normalizeName_(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "");
}

function isRowEmpty_(row) {
  return row.every(function(cell) {
    return String(cell || "").trim() === "";
  });
}

function ingestWinnerRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = parseCupBase_(row.cup);
    if (!cupInfo) return;

    const cup = getOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.placements.first = cleanString_(row["1a"]);
    cup.placements.second = cleanString_(row["2a"]);
  });
}

function ingestSettingsRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = parseCupBase_(row.cup);
    if (!cupInfo) return;

    const cup = getOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.settings = {
      playoffCut1: toNullableNumber_(row.slutspelsstreck_1),
      playoffCut2: toNullableNumber_(row.slutspelsstreck_2),
      bestOf: {
        roundOf16: toNullableNumber_(row.bo_atton),
        quarter: toNullableNumber_(row.bo_kvart),
        semi: toNullableNumber_(row.bo_semi),
        final: toNullableNumber_(row.bo_final)
      },
      minPlayers: toNullableNumber_(row.minst_antal_spelare),
      maxPlayers: toNullableNumber_(row.max_antal_spelare),
      eligibility: cleanString_(row.behorighet),
      info: cleanString_(row.info)
    };
  });
}

function ingestMatchRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = parseMatchCup_(row.cup);
    if (!cupInfo) return;

    const cup = getOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.matches.push({
      date: toIsoDate_(row.date),
      time: cleanString_(row.time),
      awayTeam: cleanString_(row.away_team),
      awayScore: toNullableNumber_(row.away_score),
      homeScore: toNullableNumber_(row.home_score),
      homeTeam: cleanString_(row.home_team),
      overtime: toBoolean_(row.ot),
      stage: parseStage_(row.stage),
      group: cleanString_(row.grupp),
      goalsSummary: cleanString_(row.goalssummary),
      statsSummary: cleanString_(row.stats)
    });
  });
}

function ingestPlayerRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = parseCupStage_(row.cup);
    if (!cupInfo) return;

    const cup = getOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.playerStats[cupInfo.stage].push({
      player: cleanString_(row.players),
      team: cleanString_(row.team),
      gp: toNullableNumber_(row.gp),
      g: toNullableNumber_(row.g),
      a: toNullableNumber_(row.a),
      pts: toNullableNumber_(row.pts),
      pim: toNullableNumber_(row.pim),
      playerId: cleanString_(row.playerid)
    });
  });
}

function ingestGoalieRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = parseCupStage_(row.cup);
    if (!cupInfo) return;

    const cup = getOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.goalieStats[cupInfo.stage].push({
      player: cleanString_(row.goalies),
      team: cleanString_(row.team),
      gp: toNullableNumber_(row.gp),
      sa: toNullableNumber_(row.sa),
      ga: toNullableNumber_(row.ga),
      sv: toNullableNumber_(row.sv),
      gaa: toNullableNumber_(row.gaa),
      svp: toNullableNumber_(row.svp),
      so: toNullableNumber_(row.so),
      playerId: cleanString_(row.playerid)
    });
  });
}

function parseCupStage_(value) {
  const text = normalizeCupLabel_(value);

  let match = text.match(/^SEC\s+Sommar\s+([0-9.]+)\s+([GS])$/i);
  if (match) {
    return {
      cupId: "sommar-" + match[1],
      code: "SEC Sommar " + match[1],
      name: "SEC Sommar " + match[1],
      badge: "Sommar",
      stage: match[2].toUpperCase() === "G" ? "group" : "playoffs",
      sortOrder: 1000 + Number(match[1])
    };
  }

  match = text.match(/^SEC\s+([0-9.]+)\s+DIV\s+([0-9]+)\s+([GS])$/i);
  if (match) {
    const code = "SEC " + match[1] + " DIV " + match[2];
    return {
      cupId: match[1] + "-div-" + match[2],
      code: code,
      name: code,
      badge: "",
      stage: match[3].toUpperCase() === "G" ? "group" : "playoffs",
      sortOrder: Number(match[1]) + Number(match[2]) / 10
    };
  }

  match = text.match(/^SEC\s+([0-9.]+(?:\s+challenger)?)\s+([GS])$/i);
  if (match) {
    const rawId = match[1].trim();
    const isChallenger = /challenger/i.test(rawId);
    const num = rawId.replace(/\s+challenger/i, "");
    return {
      cupId: isChallenger ? num + "-challenger" : num,
      code: "SEC " + rawId,
      name: isChallenger ? "Svenska eHockey Cupen " + num + " Challenger" : "Svenska eHockey Cupen " + rawId,
      badge: isChallenger ? "Challenger" : "",
      stage: match[2].toUpperCase() === "G" ? "group" : "playoffs",
      sortOrder: Number(num) + (isChallenger ? 0.05 : 0)
    };
  }

  return null;
}

function parseMatchCup_(value) {
  return parseCupBase_(value);
}

function parseCupBase_(value) {
  const text = normalizeCupLabel_(value);

  let match = text.match(/^SEC\s+Sommar\s+([0-9.]+)$/i);
  if (match) {
    return {
      cupId: "sommar-" + match[1],
      code: "SEC Sommar " + match[1],
      name: "SEC Sommar " + match[1],
      badge: "Sommar",
      sortOrder: 1000 + Number(match[1])
    };
  }

  match = text.match(/^SEC\s+([0-9.]+)\s+DIV\s+([0-9]+)$/i);
  if (match) {
    const code = "SEC " + match[1] + " DIV " + match[2];
    return {
      cupId: match[1] + "-div-" + match[2],
      code: code,
      name: code,
      badge: "",
      sortOrder: Number(match[1]) + Number(match[2]) / 10
    };
  }

  match = text.match(/^SEC\s+([0-9.]+)\s+challenger$/i);
  if (match) {
    return {
      cupId: match[1] + "-challenger",
      code: "SEC " + match[1] + " challenger",
      name: "Svenska eHockey Cupen " + match[1] + " Challenger",
      badge: "Challenger",
      sortOrder: Number(match[1]) + 0.05
    };
  }

  match = text.match(/^SEC\s+([0-9.]+)$/i);
  if (match) {
    return {
      cupId: match[1],
      code: "SEC " + match[1],
      name: "Svenska eHockey Cupen " + match[1],
      badge: "",
      sortOrder: Number(match[1])
    };
  }

  const numeric = toNumber_(value);
  if (numeric) {
    return {
      cupId: String(numeric),
      code: "SEC " + numeric,
      name: "Svenska eHockey Cupen " + numeric,
      badge: "",
      sortOrder: numeric
    };
  }

  return null;
}

function normalizeCupLabel_(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^Sommar cupen\s+/i, "SEC Sommar ")
    .replace(/^SEC\s+Challenger$/i, "SEC 17 challenger");
}

function parseStage_(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (!normalized) return null;
  if (normalized.indexOf("grupp") !== -1) return "group";
  if (
    normalized.indexOf("slut") !== -1 ||
    normalized.indexOf("final") !== -1 ||
    normalized.indexOf("semi") !== -1 ||
    normalized.indexOf("kvart") !== -1 ||
    normalized.indexOf("round") !== -1
  ) return "playoffs";

  return normalized;
}

function getOrCreateCup_(cups, cupId, cupInfo) {
  if (!cups.has(cupId)) {
    const info = cupInfo || {};
    cups.set(cupId, {
      id: cupId,
      sortOrder: info.sortOrder || getCupSortValue_(cupId),
      code: info.code || "SEC " + cupId,
      name: info.name || "Svenska eHockey Cupen " + cupId,
      badge: info.badge || "",
      placements: {
        first: null,
        second: null
      },
      settings: null,
      matches: [],
      playerStats: {
        group: [],
        playoffs: []
      },
      goalieStats: {
        group: [],
        playoffs: []
      }
    });
  }

  return cups.get(cupId);
}

function sortCups_(a, b) {
  return getCupSortValue_(a.id) - getCupSortValue_(b.id);
}

function getCupSortValue_(cupId) {
  const text = String(cupId || "");
  const sommarMatch = text.match(/^sommar-([0-9.]+)/i);
  if (sommarMatch) return 1000 + Number(sommarMatch[1]);

  const divMatch = text.match(/^([0-9.]+)-div-([0-9]+)$/i);
  if (divMatch) return Number(divMatch[1]) + Number(divMatch[2]) / 10;

  const challengerMatch = text.match(/^([0-9.]+)-challenger$/i);
  if (challengerMatch) return Number(challengerMatch[1]) + 0.05;

  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : 9999;
}

function cleanString_(value) {
  const stringValue = String(value || "").trim();
  return stringValue === "" ? null : stringValue;
}

function toNumber_(value) {
  const normalized = String(value || "")
    .trim()
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNullableNumber_(value) {
  if (value === "" || value === null || typeof value === "undefined") return null;
  return toNumber_(value);
}

function toBoolean_(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return false;
  return ["1", "true", "ja", "yes", "ot"].indexOf(normalized) !== -1;
}

function toIsoDate_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  return cleanString_(value);
}
