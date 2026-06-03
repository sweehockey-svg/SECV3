const MSO_LEAGUE_ID = "61026";
const MSO_BASE_URL = "https://www.mystatsonline.com";
const MSO_SCHEDULE_URL = MSO_BASE_URL + "/hockey/visitor/league/schedule_scores/schedule.aspx?IDLeague=" + MSO_LEAGUE_ID;
const MSO_TARGET_SHEET = "matcherSEC";
const MSO_SEC1_SEASON_ID = "76242";
const MSO_SEC1_CUP_LABEL = "SEC 1";
const MSO_SEC2_SEASON_ID = "77803";
const MSO_SEC2_CUP_LABEL = "SEC 2";
const MSO_SEC3_SEASON_ID = "78479";
const MSO_SEC3_CUP_LABEL = "SEC 3";
const MSO_SEC4_SEASON_ID = "79542";
const MSO_SEC4_CUP_LABEL = "SEC 4";
const MSO_SEC5_SEASON_ID = "79964";
const MSO_SEC5_CUP_LABEL = "SEC 5";
const MSO_SEC6_SEASON_ID = "83022";
const MSO_SEC6_CUP_LABEL = "SEC 6";
const MSO_SEC7_SEASON_ID = "83716";
const MSO_SEC7_CUP_LABEL = "SEC 7";
const MSO_SEC8_SEASON_ID = "84911";
const MSO_SEC8_CUP_LABEL = "SEC 8";
const MSO_SEC9_SEASON_ID = "86757";
const MSO_SEC9_CUP_LABEL = "SEC 9";
const MSO_SEC10_SEASON_ID = "87518";
const MSO_SEC10_CUP_LABEL = "SEC 10";
const MSO_SEC11_SEASON_ID = "88087";
const MSO_SEC11_CUP_LABEL = "SEC 11";
const MSO_SEC12_SEASON_ID = "89214";
const MSO_SEC12_CUP_LABEL = "SEC 12";
const MSO_SEC13_SEASON_ID = "93044";
const MSO_SEC13_CUP_LABEL = "SEC 13";
const MSO_SEC14_SEASON_ID = "95074";
const MSO_SEC14_CUP_LABEL = "SEC 14";
const MSO_SEC195_SEASON_ID = "106776";
const MSO_SEC195_CUP_LABEL = "SEC 19.5";
const MSO_SEC_CHALLENGER_SEASON_ID = "103292";
const MSO_SEC_CHALLENGER_CUP_LABEL = "SEC 17 challenger";
const MSO_SEC_SOMMAR21_SEASON_ID = "81929";
const MSO_SEC_SOMMAR21_CUP_LABEL = "SEC Sommar 21";
const MSO_SEC_SOMMAR22_SEASON_ID = "86005";
const MSO_SEC_SOMMAR22_CUP_LABEL = "SEC Sommar 22";
const MSO_SEC_SOMMAR23_SEASON_ID = "91333";
const MSO_SEC_SOMMAR23_CUP_LABEL = "SEC Sommar 23";
const MSO_SEC_SOMMAR25_SEASON_ID = "105868";
const MSO_SEC_SOMMAR25_CUP_LABEL = "SEC Sommar 25";
const MSO_SEC_SOMMAR21_PLAYOFFS_SEASON_ID = "82340";
const MSO_SEC_SOMMAR22_PLAYOFFS_SEASON_ID = "86482";
const MSO_SEC_SOMMAR23_PLAYOFFS_SEASON_ID = "92855";
const MSO_SEC_SOMMAR25_PLAYOFFS_SEASON_ID = "106323";
const MSO_SEC1_PLAYOFFS_SEASON_ID = "77985";
const MSO_SEC2_PLAYOFFS_SEASON_ID = "77970";
const MSO_SEC3_PLAYOFFS_SEASON_ID = "78812";
const MSO_SEC4_PLAYOFFS_SEASON_ID = "79745";
const MSO_SEC5_PLAYOFFS_SEASON_ID = "80376";
const MSO_SEC6_PLAYOFFS_SEASON_ID = "83328";
const MSO_SEC7_PLAYOFFS_SEASON_ID = "83856";
const MSO_SEC8_PLAYOFFS_SEASON_ID = "85321";
const MSO_SEC9_PLAYOFFS_SEASON_ID = "87029";
const MSO_SEC10_PLAYOFFS_SEASON_ID = "87806";
const MSO_SEC11_PLAYOFFS_SEASON_ID = "88287";
const MSO_SEC12_PLAYOFFS_SEASON_ID = "89703";
const MSO_SEC13_PLAYOFFS_SEASON_ID = "93767";
const MSO_SEC195_PLAYOFFS_SEASON_ID = "106922";
const MSO_SEC_CHALLENGER_PLAYOFFS_SEASON_ID = "103486";

const MSO_SEC1_GROUPS = {
  "Brain Freezers": "Grupp 1",
  "Company of Geeks": "Grupp 1",
  "Black Eagles Sweden": "Grupp 1",
  "HockeyProfessorn HC": "Grupp 1",
  "Biggie Stockholm": "Grupp 1",
  "BortaMatch HC": "Grupp 1",
  "Dompa HC": "Grupp 1",
  "Bask Nation": "Grupp 2",
  "Djurgården": "Grupp 2",
  "Unwanted": "Grupp 2",
  "Carolus Icemen": "Grupp 2",
  "Team Modo": "Grupp 2",
  "Illumination": "Grupp 2",
  "IFK Norrland": "Grupp 2",
  "Viper hc": "Grupp 2"
};

const MSO_SEC2_GROUPS = {
  "Nordic Nosebleed": "Grupp 1",
  "Trasdockorna": "Grupp 1",
  "Viper hc": "Grupp 1",
  "Västerås IK": "Grupp 1",
  "HockeyProfessorn HC": "Grupp 1",
  "BortaMatch HC": "Grupp 1",
  "Full send esport": "Grupp 2",
  "Almtuna ESPORT": "Grupp 2",
  "Green Devils": "Grupp 2",
  "Brain Freezers": "Grupp 2",
  "Wisby Islanders": "Grupp 2",
  "Dracones": "Grupp 2",
  "SandhedYoungGuns": "Grupp 3",
  "Purification": "Grupp 3",
  "Ulvhednar HC": "Grupp 3",
  "Team Modo": "Grupp 3",
  "Mora IK": "Grupp 3",
  "Charleswood Chiefs": "Grupp 3"
};

const MSO_SEC3_GROUPS = {
  "Hockey INC": "Grupp 1",
  "Team Modo": "Grupp 1",
  "Björklöven Esport": "Grupp 1",
  "Viper hc": "Grupp 1",
  "Mora IK": "Grupp 1",
  "IFK Norrland": "Grupp 1",
  "Enkoping City": "Grupp 1",
  "Mighty Stixxx": "Grupp 1",
  "Wisby Islanders": "Grupp 2",
  "Almtuna ESPORT": "Grupp 2",
  "Biggie Stockholm": "Grupp 2",
  "Kronofogden Esport": "Grupp 2",
  "Carolus Icemen": "Grupp 2",
  "Dompa HC": "Grupp 2",
  "BIK Karlskoga Esport": "Grupp 2",
  "Black Eagles Sweden": "Grupp 2",
  "Dracones": "Grupp 2"
};

const MSO_SEC4_GROUPS = {
  "Etuna Eagles": "Grupp 1",
  "Beerhouse": "Grupp 1",
  "Nordic Vipers": "Grupp 1",
  "No Worries Guys": "Grupp 1",
  "Rava HC": "Grupp 1",
  "Verket": "Grupp 2",
  "Team Rocket": "Grupp 2",
  "Free From Rodents": "Grupp 2",
  "Biggie Stockholm": "Grupp 2",
  "Wisby Islanders": "Grupp 2",
  "Le Club Chat Noir": "Grupp 3",
  "Unknown Heroes": "Grupp 3",
  "Tundra": "Grupp 3",
  "Dompa HC": "Grupp 3",
  "3Tuna Le sport": "Grupp 3",
  "Ik Pantern Esport": "Grupp 3"
};

const MSO_SEC5_GROUPS = {
  "Lack of Empathy": "Grupp 1",
  "BIK Karlskoga Esport": "Grupp 1",
  "Nordic Nosebleed": "Grupp 1",
  "Wisby Islanders": "Grupp 1",
  "Northern Dust": "Grupp 1",
  "Wild rockets Hc": "Grupp 1",
  "Charleswood Chiefs": "Grupp 1",
  "Mighty Stixxx": "Grupp 1",
  "MAD Knogmackers HC": "Grupp 1",
  "Ik Pantern Esport": "Grupp 1",
  "Lofoten HC": "Grupp 2",
  "Trojans": "Grupp 2",
  "Prowlers Esport": "Grupp 2",
  "Fila De La Hc": "Grupp 2",
  "Bombers Hockey": "Grupp 2",
  "Team Rocket": "Grupp 2",
  "Dompa HC": "Grupp 2",
  "IFK Norrland": "Grupp 2",
  "Mora IK": "Grupp 3",
  "Hockey INC": "Grupp 3",
  "Unknown Heroes": "Grupp 3",
  "Biggie Stockholm": "Grupp 3",
  "Nordic Vipers": "Grupp 3",
  "3Tuna Le sport": "Grupp 3",
  "IK EyBro": "Grupp 3",
  "Hamra Allstars": "Grupp 3"
};

const MSO_SEC6_GROUPS = {
  "SSK eSport": "Grupp 1",
  "Stayhard Stallions": "Grupp 1",
  "Ludvika Lightning Esport": "Grupp 1",
  "Avenyn Esport": "Grupp 1",
  "Blessed Suedis": "Grupp 1",
  "Unwanted": "Grupp 2",
  "Chiefzz HC": "Grupp 2",
  "Jokers Hockey": "Grupp 2",
  "IFK Norrland": "Grupp 2",
  "IK EyBro": "Grupp 2",
  "Ik Stolpe ut": "Grupp 2",
  "Nordic Vipers": "Grupp 3",
  "Rimon o Pumba": "Grupp 3",
  "HockeyProfessorn HC": "Grupp 3",
  "Free From Rodents": "Grupp 3",
  "Trojans": "Grupp 3",
  "MAD Knogmackers HC": "Grupp 3"
};

const MSO_SEC7_GROUPS = {
  "Free From Rodents": "Grupp 1",
  "Mora IK": "Grupp 1",
  "Stockholm Black Knights": "Grupp 1",
  "Black Phantoms": "Grupp 1",
  "Blessed Suedis": "Grupp 2",
  "Chiefzz HC": "Grupp 2",
  "Kompaniet": "Grupp 2",
  "Nordic Vipers": "Grupp 3",
  "Trojans": "Grupp 3",
  "Synergy Hockey": "Grupp 3",
  "BIK Karlskoga Esport": "Grupp 3"
};

const MSO_SEC8_GROUPS = {
  "Free From Rodents": "Grupp 1",
  "Dompa HC": "Grupp 1",
  "Västerås IK": "Grupp 1",
  "Whitesharks": "Grupp 1",
  "Timrå IK": "Grupp 1",
  "Orebro Hockey Academy": "Grupp 1",
  "3Tuna Le sport": "Grupp 1",
  "Nordic Nosebleed": "Grupp 2",
  "Knox Stark": "Grupp 2",
  "Frölunda HC Region": "Grupp 2",
  "Northern Dust": "Grupp 2",
  "Dirty Tacklers HC": "Grupp 2",
  "Unknown Heroes": "Grupp 2",
  "Carolus Icemen": "Grupp 3",
  "Trojans": "Grupp 3",
  "IFK Norrland": "Grupp 3",
  "UnderRated": "Grupp 3",
  "Vtuna Socken": "Grupp 3",
  "HCZ": "Grupp 3",
  "Gifflarna HC": "Grupp 4",
  "Guldkallan HC": "Grupp 4",
  "Spartans eSport": "Grupp 4",
  "Kompaniet": "Grupp 4",
  "Mighty Mel HC": "Grupp 4",
  "Frölunda HC Academy": "Grupp 4"
};

const MSO_SEC9_GROUPS = {
  "Rains It Poors": "Grupp 1",
  "Nordic Nosebleed": "Grupp 1",
  "Purification": "Grupp 1",
  "Guldkallan HC": "Grupp 1",
  "Frölunda HC Region": "Grupp 1",
  "Favoritfemman": "Grupp 1",
  "Starz HC": "Grupp 1",
  "Dynamic Hockey": "Grupp 1"
};

const MSO_SEC10_GROUPS = {
  "Blessed Suedis": "Grupp 1",
  "Spartans eSport": "Grupp 1",
  "Favoritfemman": "Grupp 1",
  "Unknown Heroes": "Grupp 1",
  "MGŁA": "Grupp 1",
  "Northern Dust": "Grupp 2",
  "Frölunda HC Academy": "Grupp 2",
  "Timrå IK": "Grupp 2",
  "Viccingi": "Grupp 2",
  "Shifty Shafts": "Grupp 2"
};

const MSO_SEC11_GROUPS = {
  "Mora IK": "Grupp 1",
  "Luleå Hockey Region": "Grupp 1",
  "Lallare HC": "Grupp 1",
  "Blessed Suedis": "Grupp 2",
  "Northern Dust": "Grupp 2",
  "One HC": "Grupp 2",
  "Timrå IK": "Grupp 2"
};

const MSO_SEC12_GROUPS = {
  "Lucid Dreams": "Grupp 1",
  "Showtimes": "Grupp 1",
  "Blessed Suedis": "Grupp 1",
  "Modo Hockey": "Grupp 1",
  "Sunne IK Esport": "Grupp 1",
  "Clowns": "Grupp 1",
  "Västerås IK": "Grupp 1",
  "Frölunda HC Academy": "Grupp 2",
  "Purification": "Grupp 2",
  "Norra Västerbotten": "Grupp 2",
  "Lallare HC": "Grupp 2",
  "Northern Dust": "Grupp 2",
  "Nordic Nosebleed": "Grupp 2",
  "Glasbanken se": "Grupp 2"
};

const MSO_SEC14_GROUPS = {
  "Dompa HC": "Grupp 1",
  "Get Hagens HC": "Grupp 1",
  "Polarbears HC": "Grupp 1",
  "Free From Rodents": "Grupp 1",
  "SCRUBS": "Grupp 1",
  "Brunker Bulldogs": "Grupp 1",
  "The Worn Out Wisemen": "Grupp 1",
  "LEGION HC": "Grupp 1",
  "The Solution": "Grupp 2",
  "Modo Hockey": "Grupp 2",
  "Spartans eSport": "Grupp 2",
  "Glacies Bellator": "Grupp 2",
  "Oljefondet": "Grupp 2",
  "Unknown Heroes": "Grupp 2",
  "WHITE WINGS": "Grupp 2",
  "Cavemen Hockey": "Grupp 2"
};

const MSO_SEC195_GROUPS = {
  "vNexs Vipers": "Grupp 1",
  "Sunne IK Esport": "Grupp 1",
  "Veterankraft": "Grupp 1",
  "Modo Hockey": "Grupp 1",
  "SSK Academy": "Grupp 1",
  "Surte Sisu HC": "Grupp 1"
};

const MSO_SEC_CHALLENGER_GROUPS = {
  "Phoenix": "Grupp 1",
  "Nordic Falcons": "Grupp 1",
  "Färjestad": "Grupp 1",
  "Flädie Faxes": "Grupp 1",
  "Nordic Knights": "Grupp 1"
};

const MSO_SEC_SOMMAR21_GROUPS = {
  "Lag Diizzylicious": "Grupp 1",
  "Lag eliekamel_": "Grupp 1",
  "Lag Henning92": "Grupp 1",
  "Lag eckeson": "Grupp 1",
  "Lag Jonass1551": "Grupp 1",
  "Lag andreaskakan": "Grupp 1",
  "Lag Stenborg431": "Grupp 2",
  "Lag Prallelkova": "Grupp 2",
  "Lag Tablehockey": "Grupp 2",
  "Lag v1CTANK": "Grupp 2",
  "Lag Lokope11": "Grupp 2",
  "Lag mesimaki94": "Grupp 2"
};

const MSO_SEC_SOMMAR22_GROUPS = {
  "Lag eckeson": "Grupp 1",
  "Lag Jepplo02": "Grupp 1",
  "Lag Snus": "Grupp 1",
  "Lag TantBerit": "Grupp 1",
  "Lag Bruno_32": "Grupp 1",
  "Lag ePsych0-": "Grupp 1",
  "Lag Diizzylicious": "Grupp 1",
  "Lag Aker36": "Grupp 1",
  "Lag Larsson_500": "Grupp 1",
  "Lag Jonass1551": "Grupp 1"
};

const MSO_SEC_SOMMAR23_GROUPS = {
  "Lag Snus": "Grupp 1",
  "Lag antoniomannen": "Grupp 1",
  "Lag bystrom": "Grupp 1",
  "Lag benjamint": "Grupp 1",
  "Lag Dasplund": "Grupp 1",
  "Lag Axelzonee": "Grupp 1",
  "Lag Jarvinder": "Grupp 1",
  "Lag stickovic": "Grupp 1"
};

const MSO_SEC_SOMMAR25_GROUPS = {
  "EƎ Lag Toivo4936": "Grupp 1",
  "EƎ Lag AntonLxnd": "Grupp 1",
  "EƎ Lag l-Furyan-l": "Grupp 1",
  "EƎ Lag xCurhed": "Grupp 1",
  "EƎ Lag GD_Hampezz": "Grupp 1",
  "EƎ Lag Sneipthegunner": "Grupp 1",
  "EƎ Lag bystrom___": "Grupp 1",
  "EƎ Lag xSnorlaaxx": "Grupp 1",
  "EƎ Lag Wagge01": "Grupp 1",
  "EƎ Lag Sloogan9498": "Grupp 1",
  "EƎ Lag el_tacobag": "Grupp 1",
  "EƎ Lag xAlknas": "Grupp 1"
};

const MSO_HEADERS = [
  "Date",
  "Time",
  "Away team",
  "Away score",
  "ot",
  "Home score",
  "Home team",
  "Cup",
  "Stage",
  "Grupp",
  "goalsSummary",
  "Stats"
];

function getMyStatsOnlineSEC1To14Configs_() {
  return [
    { seasonId: MSO_SEC1_SEASON_ID, cup: MSO_SEC1_CUP_LABEL, label: MSO_SEC1_CUP_LABEL },
    { seasonId: MSO_SEC2_SEASON_ID, cup: MSO_SEC2_CUP_LABEL, label: MSO_SEC2_CUP_LABEL },
    { seasonId: MSO_SEC3_SEASON_ID, cup: MSO_SEC3_CUP_LABEL, label: MSO_SEC3_CUP_LABEL },
    { seasonId: MSO_SEC4_SEASON_ID, cup: MSO_SEC4_CUP_LABEL, label: MSO_SEC4_CUP_LABEL },
    { seasonId: MSO_SEC5_SEASON_ID, cup: MSO_SEC5_CUP_LABEL, label: MSO_SEC5_CUP_LABEL },
    { seasonId: MSO_SEC6_SEASON_ID, cup: MSO_SEC6_CUP_LABEL, label: MSO_SEC6_CUP_LABEL },
    { seasonId: MSO_SEC7_SEASON_ID, cup: MSO_SEC7_CUP_LABEL, label: MSO_SEC7_CUP_LABEL },
    { seasonId: MSO_SEC8_SEASON_ID, cup: MSO_SEC8_CUP_LABEL, label: MSO_SEC8_CUP_LABEL },
    { seasonId: MSO_SEC9_SEASON_ID, cup: MSO_SEC9_CUP_LABEL, label: MSO_SEC9_CUP_LABEL },
    { seasonId: MSO_SEC10_SEASON_ID, cup: MSO_SEC10_CUP_LABEL, label: MSO_SEC10_CUP_LABEL },
    { seasonId: MSO_SEC11_SEASON_ID, cup: MSO_SEC11_CUP_LABEL, label: MSO_SEC11_CUP_LABEL },
    { seasonId: MSO_SEC12_SEASON_ID, cup: MSO_SEC12_CUP_LABEL, label: MSO_SEC12_CUP_LABEL },
    { seasonId: MSO_SEC13_SEASON_ID, cup: MSO_SEC13_CUP_LABEL, label: MSO_SEC13_CUP_LABEL },
    { seasonId: MSO_SEC14_SEASON_ID, cup: MSO_SEC14_CUP_LABEL, label: MSO_SEC14_CUP_LABEL }
  ];
}

function getMyStatsOnlineSEC1To13PlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC1_PLAYOFFS_SEASON_ID, cup: MSO_SEC1_CUP_LABEL, label: MSO_SEC1_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC2_PLAYOFFS_SEASON_ID, cup: MSO_SEC2_CUP_LABEL, label: MSO_SEC2_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC3_PLAYOFFS_SEASON_ID, cup: MSO_SEC3_CUP_LABEL, label: MSO_SEC3_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC4_PLAYOFFS_SEASON_ID, cup: MSO_SEC4_CUP_LABEL, label: MSO_SEC4_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC5_PLAYOFFS_SEASON_ID, cup: MSO_SEC5_CUP_LABEL, label: MSO_SEC5_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC6_PLAYOFFS_SEASON_ID, cup: MSO_SEC6_CUP_LABEL, label: MSO_SEC6_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC7_PLAYOFFS_SEASON_ID, cup: MSO_SEC7_CUP_LABEL, label: MSO_SEC7_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC8_PLAYOFFS_SEASON_ID, cup: MSO_SEC8_CUP_LABEL, label: MSO_SEC8_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC9_PLAYOFFS_SEASON_ID, cup: MSO_SEC9_CUP_LABEL, label: MSO_SEC9_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC10_PLAYOFFS_SEASON_ID, cup: MSO_SEC10_CUP_LABEL, label: MSO_SEC10_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC11_PLAYOFFS_SEASON_ID, cup: MSO_SEC11_CUP_LABEL, label: MSO_SEC11_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC12_PLAYOFFS_SEASON_ID, cup: MSO_SEC12_CUP_LABEL, label: MSO_SEC12_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true },
    { seasonId: MSO_SEC13_PLAYOFFS_SEASON_ID, cup: MSO_SEC13_CUP_LABEL, label: MSO_SEC13_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSEC1To5PlayoffsConfigs_() {
  return getMyStatsOnlineSEC1To13PlayoffsConfigs_().slice(0, 5);
}

function getMyStatsOnlineSEC6To10PlayoffsConfigs_() {
  return getMyStatsOnlineSEC1To13PlayoffsConfigs_().slice(5, 10);
}

function getMyStatsOnlineSEC11To13PlayoffsConfigs_() {
  return getMyStatsOnlineSEC1To13PlayoffsConfigs_().slice(10, 13);
}

function getMyStatsOnlineSEC1To5Configs_() {
  return getMyStatsOnlineSEC1To14Configs_().slice(0, 5);
}

function getMyStatsOnlineSEC6To10Configs_() {
  return getMyStatsOnlineSEC1To14Configs_().slice(5, 10);
}

function getMyStatsOnlineSEC6To8Configs_() {
  return getMyStatsOnlineSEC1To14Configs_().slice(5, 8);
}

function getMyStatsOnlineSEC10To14Configs_() {
  return getMyStatsOnlineSEC1To14Configs_().slice(9, 14);
}

function getMyStatsOnlineSEC11To14Configs_() {
  return getMyStatsOnlineSEC1To14Configs_().slice(10, 14);
}

function getMyStatsOnlineSEC195Configs_() {
  return [
    { seasonId: MSO_SEC195_SEASON_ID, cup: MSO_SEC195_CUP_LABEL, label: MSO_SEC195_CUP_LABEL }
  ];
}

function getMyStatsOnlineSEC195PlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC195_PLAYOFFS_SEASON_ID, cup: MSO_SEC195_CUP_LABEL, label: MSO_SEC195_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSECChallengerConfigs_() {
  return [
    { seasonId: MSO_SEC_CHALLENGER_SEASON_ID, cup: MSO_SEC_CHALLENGER_CUP_LABEL, label: MSO_SEC_CHALLENGER_CUP_LABEL }
  ];
}

function getMyStatsOnlineSECChallengerPlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC_CHALLENGER_PLAYOFFS_SEASON_ID, cup: MSO_SEC_CHALLENGER_CUP_LABEL, label: MSO_SEC_CHALLENGER_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSECSommar21Configs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR21_SEASON_ID, cup: MSO_SEC_SOMMAR21_CUP_LABEL, label: MSO_SEC_SOMMAR21_CUP_LABEL }
  ];
}

function getMyStatsOnlineSECSommar21PlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR21_PLAYOFFS_SEASON_ID, cup: MSO_SEC_SOMMAR21_CUP_LABEL, label: MSO_SEC_SOMMAR21_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSECSommar22Configs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR22_SEASON_ID, cup: MSO_SEC_SOMMAR22_CUP_LABEL, label: MSO_SEC_SOMMAR22_CUP_LABEL }
  ];
}

function getMyStatsOnlineSECSommar22PlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR22_PLAYOFFS_SEASON_ID, cup: MSO_SEC_SOMMAR22_CUP_LABEL, label: MSO_SEC_SOMMAR22_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSECSommar23Configs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR23_SEASON_ID, cup: MSO_SEC_SOMMAR23_CUP_LABEL, label: MSO_SEC_SOMMAR23_CUP_LABEL }
  ];
}

function getMyStatsOnlineSECSommar23PlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR23_PLAYOFFS_SEASON_ID, cup: MSO_SEC_SOMMAR23_CUP_LABEL, label: MSO_SEC_SOMMAR23_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSECSommar25Configs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR25_SEASON_ID, cup: MSO_SEC_SOMMAR25_CUP_LABEL, label: MSO_SEC_SOMMAR25_CUP_LABEL }
  ];
}

function getMyStatsOnlineSECSommar25PlayoffsConfigs_() {
  return [
    { seasonId: MSO_SEC_SOMMAR25_PLAYOFFS_SEASON_ID, cup: MSO_SEC_SOMMAR25_CUP_LABEL, label: MSO_SEC_SOMMAR25_CUP_LABEL + " Slutspel", stage: "Slutspel", group: "", allMonths: true }
  ];
}

function getMyStatsOnlineSECSommarConfigs_() {
  return []
    .concat(getMyStatsOnlineSECSommar21Configs_())
    .concat(getMyStatsOnlineSECSommar22Configs_())
    .concat(getMyStatsOnlineSECSommar23Configs_())
    .concat(getMyStatsOnlineSECSommar25Configs_());
}

function getMyStatsOnlineSECSommarPlayoffsConfigs_() {
  return []
    .concat(getMyStatsOnlineSECSommar21PlayoffsConfigs_())
    .concat(getMyStatsOnlineSECSommar22PlayoffsConfigs_())
    .concat(getMyStatsOnlineSECSommar23PlayoffsConfigs_())
    .concat(getMyStatsOnlineSECSommar25PlayoffsConfigs_());
}

function getMyStatsOnlineSECSommarAllConfigs_() {
  return []
    .concat(getMyStatsOnlineSECSommarConfigs_())
    .concat(getMyStatsOnlineSECSommarPlayoffsConfigs_());
}

function importMyStatsOnlineToMatcherSEC() {
  return importMyStatsOnlineSEC1ToMatcherSEC();
}

function importMyStatsOnlineSEC1To14ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To14Configs_());
}

function importMyStatsOnlineSEC1To14ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To14Configs_());
}

function importMyStatsOnlineSEC1To13PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To13PlayoffsConfigs_());
}

function importMyStatsOnlineSEC1To13PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To13PlayoffsConfigs_());
}

function importMyStatsOnlineSEC1To5PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To5PlayoffsConfigs_());
}

function importMyStatsOnlineSEC1To5PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To5PlayoffsConfigs_());
}

function importMyStatsOnlineSEC6To10PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC6To10PlayoffsConfigs_());
}

function importMyStatsOnlineSEC6To10PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC6To10PlayoffsConfigs_());
}

function importMyStatsOnlineSEC11To13PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC11To13PlayoffsConfigs_());
}

function importMyStatsOnlineSEC11To13PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC11To13PlayoffsConfigs_());
}

function importMyStatsOnlineSEC1To5ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To5Configs_());
}

function importMyStatsOnlineSEC1To5ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC1To5Configs_());
}

function importMyStatsOnlineSEC6To10ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC6To10Configs_());
}

function importMyStatsOnlineSEC6To10ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC6To10Configs_());
}

function importMyStatsOnlineSEC6To8ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC6To8Configs_());
}

function importMyStatsOnlineSEC6To8ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC6To8Configs_());
}

function importMyStatsOnlineSEC10To14ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC10To14Configs_());
}

function importMyStatsOnlineSEC10To14ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC10To14Configs_());
}

function importMyStatsOnlineSEC11To14ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC11To14Configs_());
}

function importMyStatsOnlineSEC11To14ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC11To14Configs_());
}

function importMyStatsOnlineSEC1ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC1_SEASON_ID,
    cup: MSO_SEC1_CUP_LABEL,
    label: MSO_SEC1_CUP_LABEL
  });
}

function importMyStatsOnlineSEC1ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC1_SEASON_ID,
    cup: MSO_SEC1_CUP_LABEL,
    label: MSO_SEC1_CUP_LABEL
  });
}

function importMyStatsOnlineSEC2ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC2_SEASON_ID,
    cup: MSO_SEC2_CUP_LABEL,
    label: MSO_SEC2_CUP_LABEL
  });
}

function importMyStatsOnlineSEC2ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC2_SEASON_ID,
    cup: MSO_SEC2_CUP_LABEL,
    label: MSO_SEC2_CUP_LABEL
  });
}

function importMyStatsOnlineSEC3ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC3_SEASON_ID,
    cup: MSO_SEC3_CUP_LABEL,
    label: MSO_SEC3_CUP_LABEL
  });
}

function importMyStatsOnlineSEC3ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC3_SEASON_ID,
    cup: MSO_SEC3_CUP_LABEL,
    label: MSO_SEC3_CUP_LABEL
  });
}

function importMyStatsOnlineSEC4ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC4_SEASON_ID,
    cup: MSO_SEC4_CUP_LABEL,
    label: MSO_SEC4_CUP_LABEL
  });
}

function importMyStatsOnlineSEC4ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC4_SEASON_ID,
    cup: MSO_SEC4_CUP_LABEL,
    label: MSO_SEC4_CUP_LABEL
  });
}

function importMyStatsOnlineSEC5ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC5_SEASON_ID,
    cup: MSO_SEC5_CUP_LABEL,
    label: MSO_SEC5_CUP_LABEL
  });
}

function importMyStatsOnlineSEC5ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC5_SEASON_ID,
    cup: MSO_SEC5_CUP_LABEL,
    label: MSO_SEC5_CUP_LABEL
  });
}

function importMyStatsOnlineSEC6ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC6_SEASON_ID,
    cup: MSO_SEC6_CUP_LABEL,
    label: MSO_SEC6_CUP_LABEL
  });
}

function importMyStatsOnlineSEC6ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC6_SEASON_ID,
    cup: MSO_SEC6_CUP_LABEL,
    label: MSO_SEC6_CUP_LABEL
  });
}

function importMyStatsOnlineSEC7ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC7_SEASON_ID,
    cup: MSO_SEC7_CUP_LABEL,
    label: MSO_SEC7_CUP_LABEL
  });
}

function importMyStatsOnlineSEC7ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC7_SEASON_ID,
    cup: MSO_SEC7_CUP_LABEL,
    label: MSO_SEC7_CUP_LABEL
  });
}

function importMyStatsOnlineSEC8ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC8_SEASON_ID,
    cup: MSO_SEC8_CUP_LABEL,
    label: MSO_SEC8_CUP_LABEL
  });
}

function importMyStatsOnlineSEC8ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC8_SEASON_ID,
    cup: MSO_SEC8_CUP_LABEL,
    label: MSO_SEC8_CUP_LABEL
  });
}

function importMyStatsOnlineSEC9ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC9_SEASON_ID,
    cup: MSO_SEC9_CUP_LABEL,
    label: MSO_SEC9_CUP_LABEL
  });
}

function importMyStatsOnlineSEC9ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC9_SEASON_ID,
    cup: MSO_SEC9_CUP_LABEL,
    label: MSO_SEC9_CUP_LABEL
  });
}

function importMyStatsOnlineSEC10ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC10_SEASON_ID,
    cup: MSO_SEC10_CUP_LABEL,
    label: MSO_SEC10_CUP_LABEL
  });
}

function importMyStatsOnlineSEC10ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC10_SEASON_ID,
    cup: MSO_SEC10_CUP_LABEL,
    label: MSO_SEC10_CUP_LABEL
  });
}

function importMyStatsOnlineSEC11ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC11_SEASON_ID,
    cup: MSO_SEC11_CUP_LABEL,
    label: MSO_SEC11_CUP_LABEL
  });
}

function importMyStatsOnlineSEC11ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC11_SEASON_ID,
    cup: MSO_SEC11_CUP_LABEL,
    label: MSO_SEC11_CUP_LABEL
  });
}

function importMyStatsOnlineSEC12ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC12_SEASON_ID,
    cup: MSO_SEC12_CUP_LABEL,
    label: MSO_SEC12_CUP_LABEL
  });
}

function importMyStatsOnlineSEC12ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC12_SEASON_ID,
    cup: MSO_SEC12_CUP_LABEL,
    label: MSO_SEC12_CUP_LABEL
  });
}

function importMyStatsOnlineSEC13ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC13_SEASON_ID,
    cup: MSO_SEC13_CUP_LABEL,
    label: MSO_SEC13_CUP_LABEL
  });
}

function importMyStatsOnlineSEC13ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC13_SEASON_ID,
    cup: MSO_SEC13_CUP_LABEL,
    label: MSO_SEC13_CUP_LABEL
  });
}

function importMyStatsOnlineSEC14ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC14_SEASON_ID,
    cup: MSO_SEC14_CUP_LABEL,
    label: MSO_SEC14_CUP_LABEL
  });
}

function importMyStatsOnlineSEC14ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC14_SEASON_ID,
    cup: MSO_SEC14_CUP_LABEL,
    label: MSO_SEC14_CUP_LABEL
  });
}

function importMyStatsOnlineSEC195ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC195_SEASON_ID,
    cup: MSO_SEC195_CUP_LABEL,
    label: MSO_SEC195_CUP_LABEL
  });
}

function importMyStatsOnlineSEC195ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC195_SEASON_ID,
    cup: MSO_SEC195_CUP_LABEL,
    label: MSO_SEC195_CUP_LABEL
  });
}

function importMyStatsOnlineSEC195PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC195PlayoffsConfigs_());
}

function importMyStatsOnlineSEC195PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSEC195PlayoffsConfigs_());
}

function importMyStatsOnlineSECChallengerToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_CHALLENGER_SEASON_ID,
    cup: MSO_SEC_CHALLENGER_CUP_LABEL,
    label: MSO_SEC_CHALLENGER_CUP_LABEL
  });
}

function importMyStatsOnlineSECChallengerToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_CHALLENGER_SEASON_ID,
    cup: MSO_SEC_CHALLENGER_CUP_LABEL,
    label: MSO_SEC_CHALLENGER_CUP_LABEL
  });
}

function importMyStatsOnlineSECChallengerPlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECChallengerPlayoffsConfigs_());
}

function importMyStatsOnlineSECChallengerPlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECChallengerPlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar21ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR21_SEASON_ID,
    cup: MSO_SEC_SOMMAR21_CUP_LABEL,
    label: MSO_SEC_SOMMAR21_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar21ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR21_SEASON_ID,
    cup: MSO_SEC_SOMMAR21_CUP_LABEL,
    label: MSO_SEC_SOMMAR21_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar21PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar21PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar21PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar21PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar22ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR22_SEASON_ID,
    cup: MSO_SEC_SOMMAR22_CUP_LABEL,
    label: MSO_SEC_SOMMAR22_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar22ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR22_SEASON_ID,
    cup: MSO_SEC_SOMMAR22_CUP_LABEL,
    label: MSO_SEC_SOMMAR22_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar22PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar22PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar22PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar22PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar23ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR23_SEASON_ID,
    cup: MSO_SEC_SOMMAR23_CUP_LABEL,
    label: MSO_SEC_SOMMAR23_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar23ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR23_SEASON_ID,
    cup: MSO_SEC_SOMMAR23_CUP_LABEL,
    label: MSO_SEC_SOMMAR23_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar23PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar23PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar23PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar23PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar25ToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR25_SEASON_ID,
    cup: MSO_SEC_SOMMAR25_CUP_LABEL,
    label: MSO_SEC_SOMMAR25_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar25ToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineIntoSheet_(sheet, {
    seasonId: MSO_SEC_SOMMAR25_SEASON_ID,
    cup: MSO_SEC_SOMMAR25_CUP_LABEL,
    label: MSO_SEC_SOMMAR25_CUP_LABEL
  });
}

function importMyStatsOnlineSECSommar25PlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar25PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommar25PlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommar25PlayoffsConfigs_());
}

function importMyStatsOnlineSECSommarToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommarConfigs_());
}

function importMyStatsOnlineSECSommarToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommarConfigs_());
}

function importMyStatsOnlineSECSommarPlayoffsToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommarPlayoffsConfigs_());
}

function importMyStatsOnlineSECSommarPlayoffsToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommarPlayoffsConfigs_());
}

function importMyStatsOnlineSECSommarAllToMatcherSEC() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommarAllConfigs_());
}

function importMyStatsOnlineSECSommarAllToMatcherSECClean() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, MSO_TARGET_SHEET);
  sheet.clearContents();
  ensureHeaders_(sheet, MSO_HEADERS);
  return importMyStatsOnlineSeasonsIntoSheet_(sheet, getMyStatsOnlineSECSommarAllConfigs_());
}

function importMyStatsOnlineSeasonsIntoSheet_(sheet, seasonConfigs) {
  const report = {
    imported: 0,
    cups: [],
    errors: []
  };

  seasonConfigs.forEach(function(config) {
    try {
      const result = importMyStatsOnlineIntoSheet_(sheet, config);
      report.imported += result.imported || 0;
      report.cups.push({
        cup: config.cup,
        imported: result.imported || 0,
        schedulePages: result.schedulePages || 0
      });
    } catch (error) {
      const message = error.message || String(error);
      report.errors.push({
        cup: config.cup,
        message: message
      });
      Logger.log(config.cup + ": " + message);
    }
  });

  return report;
}

function importMyStatsOnlineIntoSheet_(sheet, seasonConfig) {
  const schedulePages = discoverSchedulePages_(seasonConfig);
  const rows = [];
  const seen = new Set();

  schedulePages.forEach(function(page) {
    let html = "";
    try {
      html = fetchScheduleHtml_(page);
    } catch (error) {
      return;
    }
    const pageRows = parseScheduleRows_(html, page);

    pageRows.forEach(function(row) {
      normalizeImportedRow_(row);

      const key = [
        row.date,
        row.time,
        row.awayTeam,
        row.awayScore,
        row.homeScore,
        row.homeTeam
      ].join("|").toLowerCase();

      if (seen.has(key)) {
        return;
      }
      seen.add(key);

      let details = { goalsSummary: "", statsSummary: "" };
      if (row.gameUrl) {
        try {
          details = parseGameDetails_(fetchText_(row.gameUrl), row);
    } catch (error) {
      details = { goalsSummary: "DETAIL_ERROR: " + (error.message || String(error)), statsSummary: "" };
    }
  }

      if (!details.goalsSummary || !details.statsSummary) {
        const fallbackDetails = parseInlineDetails_(row);
        details.goalsSummary = details.goalsSummary || fallbackDetails.goalsSummary;
        details.statsSummary = details.statsSummary || fallbackDetails.statsSummary;
      }

      rows.push([
        row.date,
        row.time,
        row.awayTeam,
        row.awayScore,
        row.overtime ? "OT" : "",
        row.homeScore,
        row.homeTeam,
        row.cup,
        row.stage,
        row.group,
        details.goalsSummary,
        details.statsSummary
      ]);
    });
  });

  if (!rows.length) {
    throw new Error("Hittade inga matcher att importera. Schedule-sidor hittade: " + schedulePages.length + ". Testa funktionen debugMyStatsOnlineImport().");
  }

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, MSO_HEADERS.length).setValues(rows);
  sheet.getRange(startRow, 11, rows.length, 2).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.autoResizeColumns(1, MSO_HEADERS.length);

  return {
    imported: rows.length,
    schedulePages: schedulePages.length
  };
}

function importMyStatsOnlineToMatcherSECClean() {
  return importMyStatsOnlineSEC1ToMatcherSECClean();
}

function debugMyStatsOnlineImport() {
  const pages = discoverSchedulePages_();
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC1Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC1_SEASON_ID,
    cup: MSO_SEC1_CUP_LABEL,
    label: MSO_SEC1_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC1ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC1_SEASON_ID,
    cup: MSO_SEC1_CUP_LABEL,
    label: MSO_SEC1_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC2Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC2_SEASON_ID,
    cup: MSO_SEC2_CUP_LABEL,
    label: MSO_SEC2_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC2ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC2_SEASON_ID,
    cup: MSO_SEC2_CUP_LABEL,
    label: MSO_SEC2_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC3Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC3_SEASON_ID,
    cup: MSO_SEC3_CUP_LABEL,
    label: MSO_SEC3_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC3ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC3_SEASON_ID,
    cup: MSO_SEC3_CUP_LABEL,
    label: MSO_SEC3_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC4Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC4_SEASON_ID,
    cup: MSO_SEC4_CUP_LABEL,
    label: MSO_SEC4_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC4ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC4_SEASON_ID,
    cup: MSO_SEC4_CUP_LABEL,
    label: MSO_SEC4_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC5Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC5_SEASON_ID,
    cup: MSO_SEC5_CUP_LABEL,
    label: MSO_SEC5_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC5ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC5_SEASON_ID,
    cup: MSO_SEC5_CUP_LABEL,
    label: MSO_SEC5_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC6Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC6_SEASON_ID,
    cup: MSO_SEC6_CUP_LABEL,
    label: MSO_SEC6_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC6ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC6_SEASON_ID,
    cup: MSO_SEC6_CUP_LABEL,
    label: MSO_SEC6_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC7Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC7_SEASON_ID,
    cup: MSO_SEC7_CUP_LABEL,
    label: MSO_SEC7_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC7ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC7_SEASON_ID,
    cup: MSO_SEC7_CUP_LABEL,
    label: MSO_SEC7_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC8Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC8_SEASON_ID,
    cup: MSO_SEC8_CUP_LABEL,
    label: MSO_SEC8_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC8ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC8_SEASON_ID,
    cup: MSO_SEC8_CUP_LABEL,
    label: MSO_SEC8_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC9Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC9_SEASON_ID,
    cup: MSO_SEC9_CUP_LABEL,
    label: MSO_SEC9_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC9ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC9_SEASON_ID,
    cup: MSO_SEC9_CUP_LABEL,
    label: MSO_SEC9_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC10Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC10_SEASON_ID,
    cup: MSO_SEC10_CUP_LABEL,
    label: MSO_SEC10_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC10ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC10_SEASON_ID,
    cup: MSO_SEC10_CUP_LABEL,
    label: MSO_SEC10_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC11Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC11_SEASON_ID,
    cup: MSO_SEC11_CUP_LABEL,
    label: MSO_SEC11_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC11ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC11_SEASON_ID,
    cup: MSO_SEC11_CUP_LABEL,
    label: MSO_SEC11_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC12Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC12_SEASON_ID,
    cup: MSO_SEC12_CUP_LABEL,
    label: MSO_SEC12_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC12ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC12_SEASON_ID,
    cup: MSO_SEC12_CUP_LABEL,
    label: MSO_SEC12_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC13Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC13_SEASON_ID,
    cup: MSO_SEC13_CUP_LABEL,
    label: MSO_SEC13_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC13ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC13_SEASON_ID,
    cup: MSO_SEC13_CUP_LABEL,
    label: MSO_SEC13_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC14Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC14_SEASON_ID,
    cup: MSO_SEC14_CUP_LABEL,
    label: MSO_SEC14_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC14ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC14_SEASON_ID,
    cup: MSO_SEC14_CUP_LABEL,
    label: MSO_SEC14_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC195Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC195_SEASON_ID,
    cup: MSO_SEC195_CUP_LABEL,
    label: MSO_SEC195_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC195ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC195_SEASON_ID,
    cup: MSO_SEC195_CUP_LABEL,
    label: MSO_SEC195_CUP_LABEL
  });
}

function debugMyStatsOnlineSEC195PlayoffsImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC195_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC195_CUP_LABEL,
    label: MSO_SEC195_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSEC195PlayoffsToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC195_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC195_CUP_LABEL,
    label: MSO_SEC195_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
}

function debugMyStatsOnlineSECChallengerImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_CHALLENGER_SEASON_ID,
    cup: MSO_SEC_CHALLENGER_CUP_LABEL,
    label: MSO_SEC_CHALLENGER_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECChallengerToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_CHALLENGER_SEASON_ID,
    cup: MSO_SEC_CHALLENGER_CUP_LABEL,
    label: MSO_SEC_CHALLENGER_CUP_LABEL
  });
}

function debugMyStatsOnlineSECChallengerPlayoffsImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_CHALLENGER_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_CHALLENGER_CUP_LABEL,
    label: MSO_SEC_CHALLENGER_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECChallengerPlayoffsToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_CHALLENGER_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_CHALLENGER_CUP_LABEL,
    label: MSO_SEC_CHALLENGER_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
}

function debugMyStatsOnlineSECSommar21Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR21_SEASON_ID,
    cup: MSO_SEC_SOMMAR21_CUP_LABEL,
    label: MSO_SEC_SOMMAR21_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar21ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR21_SEASON_ID,
    cup: MSO_SEC_SOMMAR21_CUP_LABEL,
    label: MSO_SEC_SOMMAR21_CUP_LABEL
  });
}

function debugMyStatsOnlineSECSommar21PlayoffsImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR21_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR21_CUP_LABEL,
    label: MSO_SEC_SOMMAR21_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar21PlayoffsToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR21_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR21_CUP_LABEL,
    label: MSO_SEC_SOMMAR21_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
}

function debugMyStatsOnlineSECSommar22Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR22_SEASON_ID,
    cup: MSO_SEC_SOMMAR22_CUP_LABEL,
    label: MSO_SEC_SOMMAR22_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar22ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR22_SEASON_ID,
    cup: MSO_SEC_SOMMAR22_CUP_LABEL,
    label: MSO_SEC_SOMMAR22_CUP_LABEL
  });
}

function debugMyStatsOnlineSECSommar22PlayoffsImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR22_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR22_CUP_LABEL,
    label: MSO_SEC_SOMMAR22_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar22PlayoffsToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR22_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR22_CUP_LABEL,
    label: MSO_SEC_SOMMAR22_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
}

function debugMyStatsOnlineSECSommar23Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR23_SEASON_ID,
    cup: MSO_SEC_SOMMAR23_CUP_LABEL,
    label: MSO_SEC_SOMMAR23_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar23ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR23_SEASON_ID,
    cup: MSO_SEC_SOMMAR23_CUP_LABEL,
    label: MSO_SEC_SOMMAR23_CUP_LABEL
  });
}

function debugMyStatsOnlineSECSommar23PlayoffsImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR23_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR23_CUP_LABEL,
    label: MSO_SEC_SOMMAR23_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar23PlayoffsToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR23_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR23_CUP_LABEL,
    label: MSO_SEC_SOMMAR23_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
}

function debugMyStatsOnlineSECSommar25Import() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR25_SEASON_ID,
    cup: MSO_SEC_SOMMAR25_CUP_LABEL,
    label: MSO_SEC_SOMMAR25_CUP_LABEL
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar25ToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR25_SEASON_ID,
    cup: MSO_SEC_SOMMAR25_CUP_LABEL,
    label: MSO_SEC_SOMMAR25_CUP_LABEL
  });
}

function debugMyStatsOnlineSECSommar25PlayoffsImport() {
  const pages = discoverSchedulePages_({
    seasonId: MSO_SEC_SOMMAR25_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR25_CUP_LABEL,
    label: MSO_SEC_SOMMAR25_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
  return debugSchedulePages_(pages);
}

function debugMyStatsOnlineSECSommar25PlayoffsToSheet() {
  return debugMyStatsOnlineSeasonToSheet_({
    seasonId: MSO_SEC_SOMMAR25_PLAYOFFS_SEASON_ID,
    cup: MSO_SEC_SOMMAR25_CUP_LABEL,
    label: MSO_SEC_SOMMAR25_CUP_LABEL + " Slutspel",
    stage: "Slutspel",
    group: "",
    allMonths: true
  });
}

function debugMyStatsOnlineSeasonToSheet_(seasonConfig) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const debugSheet = getOrCreateSheet_(ss, "MSO_debug");
  debugSheet.clearContents();
  debugSheet.getRange(1, 1, 1, 8).setValues([[
    "check",
    "value",
    "date",
    "time",
    "away",
    "home",
    "goalsSummary",
    "statsSummary"
  ]]);

  const pages = discoverSchedulePages_(seasonConfig);

  const page = pages[0];
  const html = fetchScheduleHtml_(page);
  const rows = parseScheduleRows_(html, page);
  const firstRow = rows[0] || null;
  let detailHtml = "";
  let details = { goalsSummary: "", statsSummary: "" };
  let detailError = "";

  if (firstRow && firstRow.gameUrl) {
    try {
      detailHtml = fetchText_(firstRow.gameUrl);
      details = parseGameDetails_(detailHtml, firstRow);
    } catch (error) {
      detailError = error.message || String(error);
    }
  }

  const out = [
    ["scheduleUrl", page ? page.url : "", "", "", "", "", "", ""],
    ["rows", rows.length, "", "", "", "", "", ""],
    ["firstGameUrl", firstRow ? firstRow.gameUrl : "", firstRow ? firstRow.date : "", firstRow ? firstRow.time : "", firstRow ? firstRow.awayTeam : "", firstRow ? firstRow.homeTeam : "", "", ""],
    ["detailError", detailError, "", "", "", "", "", ""],
    ["hasGoalsTable", detailHtml.indexOf("maincontent_gvBoxScoreGoals") !== -1, "", "", "", "", "", ""],
    ["hasVisitorSkaters", detailHtml.indexOf("maincontent_gvSkatersVisitor_gvPlayers") !== -1, "", "", "", "", "", ""],
    ["hasHomeSkaters", detailHtml.indexOf("maincontent_gvSkatersHome_gvPlayers") !== -1, "", "", "", "", "", ""],
    ["parsed", "", firstRow ? firstRow.date : "", firstRow ? firstRow.time : "", firstRow ? firstRow.awayTeam : "", firstRow ? firstRow.homeTeam : "", details.goalsSummary, details.statsSummary]
  ];

  debugSheet.getRange(2, 1, out.length, 8).setValues(out);
  debugSheet.getRange(1, 1, out.length + 1, 8).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  debugSheet.setColumnWidth(1, 150);
  debugSheet.setColumnWidth(2, 360);
  debugSheet.setColumnWidth(7, 520);
  debugSheet.setColumnWidth(8, 520);
  debugSheet.autoResizeColumns(3, 4);

  return {
    rows: rows.length,
    firstGameUrl: firstRow ? firstRow.gameUrl : "",
    detailError: detailError,
    goalsSummary: details.goalsSummary,
    statsSummary: details.statsSummary
  };
}

function debugSchedulePages_(pages) {
  const out = [];

  pages.slice(0, 5).forEach(function(page) {
    let html = "";
    try {
      html = fetchScheduleHtml_(page);
    } catch (error) {
      out.push({
        label: page.label,
        url: page.url,
        error: error.message || String(error)
      });
      return;
    }
    const rows = parseScheduleRows_(html, page);
    let firstDetails = null;
    let firstDetailError = "";
    if (rows[0] && rows[0].gameUrl) {
      try {
        const detailHtml = fetchText_(rows[0].gameUrl);
        firstDetails = {
          hasGoalsTable: detailHtml.indexOf("maincontent_gvBoxScoreGoals") !== -1,
          hasVisitorSkaters: detailHtml.indexOf("maincontent_gvSkatersVisitor_gvPlayers") !== -1,
          hasHomeSkaters: detailHtml.indexOf("maincontent_gvSkatersHome_gvPlayers") !== -1,
          parsed: parseGameDetails_(detailHtml, rows[0])
        };
      } catch (error) {
        firstDetailError = error.message || String(error);
      }
    }
    out.push({
      label: page.label,
      url: page.url,
      cup: page.cup,
      stage: page.stage,
      group: page.group,
      rows: rows.length,
      firstRow: rows[0] || null,
      firstGameUrl: rows[0] ? rows[0].gameUrl : "",
      firstDetails: firstDetails,
      firstDetailError: firstDetailError,
      firstLines: htmlToLines_(html).slice(0, 40)
    });
  });

  Logger.log(JSON.stringify(out, null, 2));
  return out;
}

function discoverSchedulePages_(seasonConfig) {
  if (seasonConfig && seasonConfig.seasonId) {
    const url = MSO_SCHEDULE_URL + "&IDSeason=" + encodeURIComponent(seasonConfig.seasonId);
    const pages = new Map();
    addSchedulePage_(pages, url, seasonConfig.label || seasonConfig.cup || "Schedule");

    try {
      addSchedulePagesFromHtml_(pages, fetchText_(url), seasonConfig.seasonId);
    } catch (error) {}

    const out = Array.from(pages.values());
    out.forEach(function(page) {
      page.cup = seasonConfig.cup || page.cup || inferCupFromText_(seasonConfig.label);
      page.stage = seasonConfig.stage || page.stage || "";
      page.group = seasonConfig.group || page.group || "";
      page.allMonths = seasonConfig.allMonths !== false;
      page.label = page.label || seasonConfig.label || seasonConfig.cup || "Schedule";
    });
    return out;
  }

  const html = fetchText_(MSO_SCHEDULE_URL);
  const pages = new Map();

  const selected = findSelectedScheduleOption_(html);
  if (selected) {
    addSchedulePage_(pages, selected.url || MSO_SCHEDULE_URL, selected.label);
  } else {
    addSchedulePage_(pages, MSO_SCHEDULE_URL, inferSelectedCupLabelFromHtml_(html) || "Schedule");
  }

  return Array.from(pages.values());

  const optionRegex = /<option\b([^>]*)>([\s\S]*?)<\/option>/gi;
  let optionMatch;
  while ((optionMatch = optionRegex.exec(html)) !== null) {
    const attrs = optionMatch[1] || "";
    const label = cleanText_(optionMatch[2]);
    const valueMatch = attrs.match(/\bvalue=["']?([^"'\s>]+)["']?/i);
    const value = valueMatch ? decodeHtml_(valueMatch[1]) : "";

    if (!label || label.toLowerCase().indexOf("select") !== -1) {
      continue;
    }

    addSchedulePage_(pages, value ? absoluteMsoUrl_(value) : MSO_SCHEDULE_URL, label);
  }

  const hrefRegex = /href=["']([^"']*schedule\.aspx[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const url = absoluteMsoUrl_(decodeHtml_(match[1]));
    const label = cleanText_(match[2]);
    if (url.indexOf("IDLeague=" + MSO_LEAGUE_ID) === -1) {
      continue;
    }
    addSchedulePage_(pages, url, label || "Schedule");
  }

  return Array.from(pages.values());
}

function addSchedulePagesFromHtml_(pages, html, seasonId) {
  const optionRegex = /<option\b([^>]*)>([\s\S]*?)<\/option>/gi;
  let optionMatch;
  while ((optionMatch = optionRegex.exec(html)) !== null) {
    const attrs = optionMatch[1] || "";
    const label = cleanText_(optionMatch[2]);
    const valueMatch = attrs.match(/\bvalue=["']?([^"'\s>]+)["']?/i);
    const value = valueMatch ? decodeHtml_(valueMatch[1]) : "";
    if (!label || label.toLowerCase().indexOf("select") !== -1 || !value) {
      continue;
    }
    const url = absoluteMsoUrl_(value);
    if (seasonId && url.indexOf("IDSeason=" + seasonId) === -1 && url.indexOf("IDSchedule=") === -1) {
      continue;
    }
    addSchedulePage_(pages, url, label);
  }

  const hrefRegex = /href=["']([^"']*schedule\.aspx[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const url = absoluteMsoUrl_(decodeHtml_(match[1]));
    const label = cleanText_(match[2]);
    if (url.indexOf("IDLeague=" + MSO_LEAGUE_ID) === -1) {
      continue;
    }
    if (seasonId && url.indexOf("IDSeason=" + seasonId) === -1 && url.indexOf("IDSchedule=") === -1) {
      continue;
    }
    addSchedulePage_(pages, url, label || "Schedule");
  }
}

function addSchedulePage_(pages, url, label) {
  const cleanUrl = String(url || "").replace(/&amp;/g, "&");
  if (!cleanUrl) {
    return;
  }

  pages.set(cleanUrl, {
    url: cleanUrl,
    label: cleanText_(label),
    cup: inferCupFromText_(label),
    stage: inferStageFromText_(label),
    group: inferGroupFromText_(label),
    allMonths: true
  });
}

function fetchScheduleHtml_(page) {
  const firstHtml = fetchText_(page.url);
  if (!page || page.allMonths === false || firstHtml.indexOf("maincontent_ddlMonth") === -1) {
    return firstHtml;
  }

  const payload = buildAllMonthsPayload_(firstHtml);
  const response = UrlFetchApp.fetch(page.url, {
    method: "post",
    followRedirects: true,
    muteHttpExceptions: true,
    contentType: "application/x-www-form-urlencoded",
    payload: payload,
    headers: {
      "User-Agent": "Mozilla/5.0 SEC importer"
    }
  });

  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    return firstHtml;
  }

  return response.getContentText();
}

function buildAllMonthsPayload_(html) {
  const payload = {};
  const hiddenRegex = /<input\b([^>]*)>/gi;
  let match;
  while ((match = hiddenRegex.exec(html)) !== null) {
    const attrs = match[1] || "";
    if (getAttr_(attrs, "type").toLowerCase() !== "hidden") {
      continue;
    }
    const name = getAttr_(attrs, "name");
    if (name) {
      payload[name] = getAttr_(attrs, "value");
    }
  }

  payload["__EVENTTARGET"] = "ctl00$maincontent$ddlMonth";
  payload["__EVENTARGUMENT"] = "";
  payload["ctl00$maincontent$ddlMonth"] = "0";
  payload["ctl00$maincontent$ddlStatus"] = selectedValueForSelect_(html, "ctl00$maincontent$ddlStatus", "-1");
  payload["ctl00$maincontent$ddlConfDiv"] = selectedValueForSelect_(html, "ctl00$maincontent$ddlConfDiv", "");
  payload["ctl00$maincontent$ddlTeam"] = selectedValueForSelect_(html, "ctl00$maincontent$ddlTeam", "");

  return payload;
}

function selectedValueForSelect_(html, selectName, fallback) {
  const selectRegex = new RegExp("<select\\b[^>]*name=[\"']" + escapeRegExp_(selectName) + "[\"'][\\s\\S]*?<\\/select>", "i");
  const selectMatch = html.match(selectRegex);
  if (!selectMatch) {
    return fallback;
  }

  const selectedMatch = selectMatch[0].match(/<option\b([^>]*)\bselected\b[^>]*>/i);
  if (!selectedMatch) {
    return fallback;
  }

  return getAttr_(selectedMatch[1], "value");
}

function getAttr_(attrs, name) {
  const regex = new RegExp("\\b" + name + "=[\"']([^\"']*)[\"']", "i");
  const match = String(attrs || "").match(regex);
  return match ? decodeHtml_(match[1]) : "";
}

function escapeRegExp_(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findSelectedScheduleOption_(html) {
  const optionRegex = /<option\b([^>]*)>([\s\S]*?)<\/option>/gi;
  let match;
  while ((match = optionRegex.exec(html)) !== null) {
    const attrs = match[1] || "";
    if (!/\bselected\b/i.test(attrs)) {
      continue;
    }

    const label = cleanText_(match[2]);
    const valueMatch = attrs.match(/\bvalue=["']?([^"'\s>]+)["']?/i);
    const value = valueMatch ? decodeHtml_(valueMatch[1]) : "";

    return {
      label: label,
      url: value ? absoluteMsoUrl_(value) : ""
    };
  }
  return null;
}

function inferSelectedCupLabelFromHtml_(html) {
  const text = cleanText_(html);
  const titleMatch = text.match(/SCHEDULE\s*&\s*SCORES\s+((?:SEC|Svenska)[^|]+?)(?:Table view|Calendar view|Status|Team|Date\s*\/\s*Time)/i);
  if (titleMatch) {
    return cleanText_(titleMatch[1]);
  }

  return inferCupFromText_(text);
}

function parseScheduleRows_(html, page) {
  const scheduleHtml = stripNonScheduleSections_(html);
  const tableHtml = findLikelyScheduleTable_(scheduleHtml);
  const rowsHtml = tableHtml ? extractTableRows_(tableHtml) : [];
  const rows = [];
  let currentDate = "";
  let currentStage = page.stage || "";
  let currentGroup = page.group || "";

  rowsHtml.forEach(function(rowHtml) {
    const cells = extractCells_(rowHtml);
    if (cells.length < 7) {
      const rowText = cleanText_(rowHtml);
      if (isDateLine_(rowText)) {
        currentDate = rowText;
      } else if (isRoundLine_(rowText)) {
        currentStage = inferStageFromText_(rowText) || rowText;
        currentGroup = inferGroupFromText_(rowText) || currentGroup;
      }
      return;
    }

    const cellTexts = cells.map(function(cell) {
      return cleanText_(cell.html);
    });

    if (looksLikeHeader_(cellTexts)) {
      return;
    }

    const legacyTime = extractTimeFromDateTimeCell_(cellTexts[0]);
    if (legacyTime && currentDate && cells.length >= 6 && !isTimeLine_(cellTexts[1])) {
      rows.push({
        date: currentDate,
        time: legacyTime,
        awayTeam: cellTexts[1],
        awayScore: toScore_(cellTexts[2]),
        overtime: /ot/i.test(cellTexts[3] || ""),
        homeScore: toScore_(cellTexts[4]),
        homeTeam: cellTexts[5],
        cup: page.cup || inferSelectedCupLabelFromHtml_(html) || "",
        stage: normalizeStageLabel_(currentStage || page.stage || "", page),
        group: currentGroup || page.group || "",
        gameUrl: extractGameUrl_(rowHtml),
        rawRowText: cleanText_(rowHtml)
      });
      return;
    }

    const date = isDateLine_(cellTexts[0]) ? cellTexts[0] : currentDate;
    const time = cellTexts[1];
    const awayTeam = cellTexts[2];
    const awayScore = toScore_(cellTexts[3]);
    const ot = /ot/i.test(cellTexts[4] || "");
    const homeScore = toScore_(cellTexts[5]);
    const homeTeam = cellTexts[6];
    const cup = page.cup || cellTexts[7] || inferSelectedCupLabelFromHtml_(html) || "";
    const stage = cellTexts[8] || currentStage || page.stage || "";
    const group = cellTexts[9] || currentGroup || page.group || "";
    const gameUrl = extractGameUrl_(rowHtml);

    if (!isValidScheduleRow_(date, time, awayTeam, awayScore, homeScore, homeTeam)) {
      return;
    }

    rows.push({
      date: date,
      time: time,
      awayTeam: awayTeam,
      awayScore: awayScore,
      overtime: ot,
      homeScore: homeScore,
      homeTeam: homeTeam,
      cup: cup,
      stage: normalizeStageLabel_(stage, page),
      group: group,
      gameUrl: gameUrl,
      rawRowText: cleanText_(rowHtml)
    });
  });

  if (rows.length) {
    attachGameUrlsByOrder_(rows, scheduleHtml);
    return rows;
  }

  const textRows = parseScheduleRowsFromText_(scheduleHtml, page);
  attachGameUrlsByOrder_(textRows, scheduleHtml);
  return textRows;
}

function parseScheduleRowsFromText_(html, page) {
  const lines = htmlToLines_(html);
  const rows = [];
  let currentDate = "";
  let currentStage = page.stage || "";
  let currentGroup = page.group || "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (isDateLine_(line)) {
      currentDate = line;
      continue;
    }

    if (isRoundLine_(line)) {
      currentStage = inferStageFromText_(line) || line;
      currentGroup = inferGroupFromText_(line) || currentGroup;
      continue;
    }

    if (!isTimeLine_(line)) {
      continue;
    }

    const time = line;
    const picked = pickMatchTokens_(lines, index + 1);
    if (!picked) {
      continue;
    }

    rows.push({
      date: currentDate,
      time: time,
      awayTeam: picked.awayTeam,
      awayScore: picked.awayScore,
      overtime: picked.overtime,
      homeScore: picked.homeScore,
      homeTeam: picked.homeTeam,
      cup: page.cup || inferSelectedCupLabelFromHtml_(html) || "",
      stage: normalizeStageLabel_(currentStage, page),
      group: currentGroup,
      gameUrl: picked.gameUrl,
      rawRowText: picked.rawRowText
    });
  }

  return rows.filter(function(row) {
    return isValidScheduleRow_(row.date, row.time, row.awayTeam, row.awayScore, row.homeScore, row.homeTeam);
  });
}

function pickMatchTokens_(lines, startIndex) {
  const tokens = [];
  let gameUrl = "";
  let overtime = false;

  for (let i = startIndex; i < lines.length && tokens.length < 8; i += 1) {
    const line = lines[i];
    if (isTimeLine_(line) || isDateLine_(line) || isRoundLine_(line)) {
      break;
    }
    if (/loading in progress|terms of service|privacy policy|mystatsonline/i.test(line)) {
      break;
    }
    if (/^(completed|final|incomplete|canceled|rescheduled|in progress|forfeit)$/i.test(line)) {
      continue;
    }
    if (/image:/i.test(line)) {
      continue;
    }
    if (/^\(OT/i.test(line) || /\bOT\b/i.test(line)) {
      overtime = true;
      continue;
    }

    tokens.push(line);
  }

  const firstScoreIndex = tokens.findIndex(function(token) {
    return /^\d+$/.test(token);
  });

  if (firstScoreIndex <= 0 || firstScoreIndex + 2 >= tokens.length) {
    return null;
  }

  const awayTeam = tokens.slice(0, firstScoreIndex).join(" ");
  const awayScore = Number(tokens[firstScoreIndex]);
  const homeScore = Number(tokens[firstScoreIndex + 1]);
  const homeTeam = tokens.slice(firstScoreIndex + 2).join(" ");

  if (!awayTeam || !homeTeam || !Number.isFinite(awayScore) || !Number.isFinite(homeScore)) {
    return null;
  }

  return {
    awayTeam: awayTeam,
    awayScore: awayScore,
    overtime: overtime,
    homeScore: homeScore,
    homeTeam: homeTeam,
    gameUrl: gameUrl,
    rawRowText: tokens.join(" ")
  };
}

function parseGameDetails_(html, matchRow) {
  const goalsSummary = parseGoalsSummary_(html, matchRow);
  let statsSummary = "";
  try {
    statsSummary = parseStatsSummary_(html, matchRow);
  } catch (error) {
    statsSummary = "STATS_ERROR: " + (error.message || String(error));
  }

  return {
    goalsSummary: goalsSummary,
    statsSummary: statsSummary
  };
}

function parseInlineDetails_(row) {
  const text = cleanText_(row.rawRowText || "");
  return {
    goalsSummary: "",
    statsSummary: ""
  };
}

function normalizeImportedRow_(row) {
  if (!row) {
    return;
  }

  const stage = cleanText_(row.stage);
  const upperStage = stage.toUpperCase();
  if (upperStage === "SLUTSPEL" || upperStage === "KVARTSFINAL" || upperStage === "SEMIFINAL" || upperStage === "FINAL") {
    row.stage = upperStage;
    row.group = "";
    return;
  }

  const explicitPlayoff = stage && stage !== "Gruppspel" && /final|semi|kvarts|slut/i.test(stage);

  if (
    row.cup === MSO_SEC9_CUP_LABEL ||
    row.cup === MSO_SEC13_CUP_LABEL ||
    row.cup === MSO_SEC195_CUP_LABEL ||
    row.cup === MSO_SEC_CHALLENGER_CUP_LABEL ||
    row.cup === MSO_SEC_SOMMAR22_CUP_LABEL ||
    row.cup === MSO_SEC_SOMMAR23_CUP_LABEL ||
    row.cup === MSO_SEC_SOMMAR25_CUP_LABEL
  ) {
    if (explicitPlayoff) {
      row.stage = stage || "Slutspel";
      row.group = "";
      return;
    }

    row.stage = "Gruppspel";
    row.group = "Grupp 1";
    return;
  }

  const group = inferGroupForMatch_(row.cup, row.awayTeam, row.homeTeam);

  if (explicitPlayoff || !group) {
    row.stage = stage || "Slutspel";
    row.group = "";
    return;
  }

  row.stage = "Gruppspel";
  row.group = group;
}

function inferGroupForMatch_(cup, awayTeam, homeTeam) {
  const groups = groupsForCup_(cup);
  if (!groups) {
    return "";
  }

  const awayGroup = lookupGroup_(groups, awayTeam);
  const homeGroup = lookupGroup_(groups, homeTeam);
  if (awayGroup && homeGroup && awayGroup === homeGroup) {
    return awayGroup;
  }
  return "";
}

function groupsForCup_(cup) {
  if (cup === MSO_SEC1_CUP_LABEL) {
    return MSO_SEC1_GROUPS;
  }
  if (cup === MSO_SEC2_CUP_LABEL) {
    return MSO_SEC2_GROUPS;
  }
  if (cup === MSO_SEC3_CUP_LABEL) {
    return MSO_SEC3_GROUPS;
  }
  if (cup === MSO_SEC4_CUP_LABEL) {
    return MSO_SEC4_GROUPS;
  }
  if (cup === MSO_SEC5_CUP_LABEL) {
    return MSO_SEC5_GROUPS;
  }
  if (cup === MSO_SEC6_CUP_LABEL) {
    return MSO_SEC6_GROUPS;
  }
  if (cup === MSO_SEC7_CUP_LABEL) {
    return MSO_SEC7_GROUPS;
  }
  if (cup === MSO_SEC8_CUP_LABEL) {
    return MSO_SEC8_GROUPS;
  }
  if (cup === MSO_SEC9_CUP_LABEL) {
    return MSO_SEC9_GROUPS;
  }
  if (cup === MSO_SEC10_CUP_LABEL) {
    return MSO_SEC10_GROUPS;
  }
  if (cup === MSO_SEC11_CUP_LABEL) {
    return MSO_SEC11_GROUPS;
  }
  if (cup === MSO_SEC12_CUP_LABEL) {
    return MSO_SEC12_GROUPS;
  }
  if (cup === MSO_SEC14_CUP_LABEL) {
    return MSO_SEC14_GROUPS;
  }
  if (cup === MSO_SEC195_CUP_LABEL) {
    return MSO_SEC195_GROUPS;
  }
  if (cup === MSO_SEC_CHALLENGER_CUP_LABEL) {
    return MSO_SEC_CHALLENGER_GROUPS;
  }
  if (cup === MSO_SEC_SOMMAR21_CUP_LABEL) {
    return MSO_SEC_SOMMAR21_GROUPS;
  }
  if (cup === MSO_SEC_SOMMAR22_CUP_LABEL) {
    return MSO_SEC_SOMMAR22_GROUPS;
  }
  if (cup === MSO_SEC_SOMMAR23_CUP_LABEL) {
    return MSO_SEC_SOMMAR23_GROUPS;
  }
  if (cup === MSO_SEC_SOMMAR25_CUP_LABEL) {
    return MSO_SEC_SOMMAR25_GROUPS;
  }
  return null;
}

function lookupGroup_(groups, teamName) {
  const normalized = normalizeTeamKey_(teamName);
  const names = Object.keys(groups || {});
  for (let i = 0; i < names.length; i += 1) {
    if (normalizeTeamKey_(names[i]) === normalized) {
      return groups[names[i]];
    }
  }
  return "";
}

function parseMsoGoalsSummary_(html, matchRow) {
  const tableHtml = extractTableById_(html, "maincontent_gvBoxScoreGoals");
  if (!tableHtml) {
    return "";
  }

  const rowsHtml = extractTableRows_(tableHtml);
  const events = [];
  let periodOffset = 0;
  let periodUntimedGoals = 0;

  rowsHtml.forEach(function(rowHtml) {
    const rowText = cleanText_(rowHtml);
    if (/1st\s+Period/i.test(rowText)) {
      periodOffset = 0;
      periodUntimedGoals = 0;
      return;
    }
    if (/2nd\s+Period/i.test(rowText)) {
      periodOffset = 20;
      periodUntimedGoals = 0;
      return;
    }
    if (/3rd\s+Period/i.test(rowText)) {
      periodOffset = 40;
      periodUntimedGoals = 0;
      return;
    }
    if (/OT|Overtime/i.test(rowText)) {
      periodOffset = 60;
      periodUntimedGoals = 0;
      return;
    }

    const cells = extractCells_(rowHtml);
    if (cells.length < 4) {
      return;
    }

    const rawTime = cleanText_(cells[0].html);
    const team = cleanText_(cells[1].html);
    const names = extractLinkedNames_(cells[3].html);
    const scorer = names[0] || "";
    const assists = names.slice(1);

    if (!team || !scorer) {
      return;
    }

    const eventTime = rawTime
      ? addPeriodOffset_(rawTime, periodOffset)
      : fallbackGoalTime_(periodOffset, periodUntimedGoals++, team, scorer);

    events.push({
      time: eventTime,
      team: team,
      scorer: scorer,
      assists: assists
    });
  });

  markGameWinningGoal_(events, matchRow);

  return events.map(function(event) {
    return event.time + " " + event.team + " - " + event.scorer +
      (event.assists.length ? " (" + event.assists.join(", ") + ")" : "") +
      (event.gwg ? " (GWG)" : "");
  }).join(" | ");
}

function parseMsoStatsSummary_(html, matchRow) {
  const awayPlayers = parseMsoSkaterTable_(html, "maincontent_gvSkatersVisitor_gvPlayers");
  const awayGoalies = parseMsoGoalieTable_(html, "maincontent_gvGoaliesVisitor_gvPlayers");
  const homePlayers = parseMsoSkaterTable_(html, "maincontent_gvSkatersHome_gvPlayers");
  const homeGoalies = parseMsoGoalieTable_(html, "maincontent_gvGoaliesHome_gvPlayers");

  const parts = [];
  appendTeamStats_(parts, matchRow.awayTeam, awayPlayers, awayGoalies);
  appendTeamStats_(parts, matchRow.homeTeam, homePlayers, homeGoalies);
  return parts.join(" | ");
}

function parseMsoSkaterTable_(html, tableId) {
  const tableHtml = extractTableById_(html, tableId);
  if (!tableHtml) {
    return [];
  }

  const rows = tableToTextRows_(tableHtml);
  if (rows.length < 2) {
    return [];
  }

  const header = rows[0].map(normalizeHeader_);
  const playerIndex = firstIndex_(header, ["player", "players", "name", "spelare"]);
  const gIndex = firstIndex_(header, ["g", "goals"]);
  const aIndex = firstIndex_(header, ["a", "assists"]);
  const ptsIndex = firstIndex_(header, ["pts", "points"]);
  const pimIndex = firstIndex_(header, ["pim", "pm"]);

  if (playerIndex === -1) {
    return [];
  }

  return rows.slice(1).map(function(cells) {
    const name = cleanPlayerName_(cells[playerIndex]);
    if (!name || /^total$/i.test(name)) {
      return "";
    }
    return name + " " +
      toNumberText_(cells[gIndex]) + "G " +
      toNumberText_(cells[aIndex]) + "A " +
      toNumberText_(cells[ptsIndex]) + "PTS " +
      toNumberText_(cells[pimIndex]) + "PIM";
  }).filter(Boolean);
}

function parseMsoGoalieTable_(html, tableId) {
  const tableHtml = extractTableById_(html, tableId);
  if (!tableHtml) {
    return [];
  }

  const rows = tableToTextRows_(tableHtml);
  if (rows.length < 2) {
    return [];
  }

  const header = rows[0].map(normalizeHeader_);
  const goalieIndex = firstIndex_(header, ["goalie", "goalies", "malvakt"]);
  const saIndex = firstIndex_(header, ["sa", "shotsagainst", "shots_against"]);
  const gaIndex = firstIndex_(header, ["ga", "goalsagainst", "goals_against"]);
  const svIndex = firstIndex_(header, ["sv", "saves"]);
  const svpIndex = firstIndex_(header, ["sv%", "svp", "save%", "savepercentage"]);

  if (goalieIndex === -1) {
    return [];
  }

  return rows.slice(1).map(function(cells) {
    const name = cleanPlayerName_(cells[goalieIndex]);
    if (!name || /^total$/i.test(name)) {
      return "";
    }
    return "Målvakt: " + name + " " +
      toNumberText_(cells[saIndex]) + "SA " +
      toNumberText_(cells[gaIndex]) + "GA " +
      toNumberText_(cells[svIndex]) + "SV " +
      normalizeSavePercentage_(cells[svpIndex]) + "SV%";
  }).filter(Boolean);
}

function parseGoalsSummary_(html, matchRow) {
  const msoGoals = parseMsoGoalsSummary_(html, matchRow);
  if (msoGoals) {
    return msoGoals;
  }

  const text = cleanText_(html);
  const scoringBlock = extractBlockByHeading_(html, ["scoring", "goals", "summary", "mål"]);
  const source = cleanText_(scoringBlock || text);
  const events = [];

  const goalRegex = /(\d{1,2}:\d{2}(?::\d{2})?)\s+([^-\|\n\r]+?)\s+-\s+([^\(\|\n\r]+?)(?:\s*\(([^)]*)\))?(?:\s*\((PP|SH|EN|OT|GWG)\))?/gi;
  let match;
  while ((match = goalRegex.exec(source)) !== null) {
    const time = cleanText_(match[1]);
    const team = cleanText_(match[2]);
    const scorer = cleanText_(match[3]);
    const assists = cleanText_(match[4]);
    const tag = cleanText_(match[5]);

    if (!time || !team || !scorer) {
      continue;
    }

    events.push(time + " " + abbreviateTeam_(team) + " - " + scorer + (assists ? " (" + assists + ")" : "") + (tag ? " (" + tag + ")" : ""));
  }

  if (events.length) {
    return events.join(" | ");
  }

  return "";
}

function parseStatsSummary_(html, matchRow) {
  const msoStats = parseMsoStatsSummary_(html, matchRow);
  if (msoStats) {
    return msoStats;
  }

  const tables = extractTables_(html);
  const awayPlayers = [];
  const homePlayers = [];
  const awayGoalies = [];
  const homeGoalies = [];

  tables.forEach(function(tableHtml) {
    const rows = tableToTextRows_(tableHtml);
    if (rows.length < 2) {
      return;
    }

    const header = rows[0].map(normalizeHeader_);
    const playerIndex = firstIndex_(header, ["player", "players", "name", "spelare"]);
    const goalieIndex = firstIndex_(header, ["goalie", "goalies", "målvakt", "malvakt"]);
    const teamName = inferTeamForStatsTable_(tableHtml, matchRow);

    if (!teamName) {
      return;
    }

    if (playerIndex !== -1) {
      const gIndex = firstIndex_(header, ["g", "goals"]);
      const aIndex = firstIndex_(header, ["a", "assists"]);
      const ptsIndex = firstIndex_(header, ["pts", "points"]);
      const pimIndex = firstIndex_(header, ["pim", "pm"]);

      rows.slice(1).forEach(function(cells) {
        const name = cleanText_(cells[playerIndex]);
        if (!name) {
          return;
        }
        const line = name + " " +
          toNumberText_(cells[gIndex]) + "G " +
          toNumberText_(cells[aIndex]) + "A " +
          toNumberText_(cells[ptsIndex]) + "PTS " +
          toNumberText_(cells[pimIndex]) + "PIM";
        pushStatLine_(teamName, matchRow, line, awayPlayers, homePlayers);
      });
    }

    if (goalieIndex !== -1) {
      const saIndex = firstIndex_(header, ["sa", "shotsagainst", "shots_against"]);
      const gaIndex = firstIndex_(header, ["ga", "goalsagainst", "goals_against"]);
      const svIndex = firstIndex_(header, ["sv", "saves"]);
      const svpIndex = firstIndex_(header, ["sv%", "svp", "save%", "savepercentage"]);

      rows.slice(1).forEach(function(cells) {
        const name = cleanText_(cells[goalieIndex]);
        if (!name) {
          return;
        }
        const line = "Målvakt: " + name + " " +
          toNumberText_(cells[saIndex]) + "SA " +
          toNumberText_(cells[gaIndex]) + "GA " +
          toNumberText_(cells[svIndex]) + "SV " +
          normalizeSavePercentage_(cells[svpIndex]) + "SV%";
        pushStatLine_(teamName, matchRow, line, awayGoalies, homeGoalies);
      });
    }
  });

  const parts = [];
  appendTeamStats_(parts, matchRow.awayTeam, awayPlayers, awayGoalies);
  appendTeamStats_(parts, matchRow.homeTeam, homePlayers, homeGoalies);
  return parts.join(" | ");
}

function appendTeamStats_(parts, teamName, playerLines, goalieLines) {
  if (!playerLines.length && !goalieLines.length) {
    return;
  }

  if (playerLines.length) {
    parts.push(teamName + ": " + playerLines.join(" | "));
  } else {
    parts.push(teamName + ":");
  }
  goalieLines.forEach(function(line) {
    parts.push(line);
  });
}

function pushStatLine_(teamName, matchRow, line, awayLines, homeLines) {
  if (sameTeam_(teamName, matchRow.awayTeam)) {
    awayLines.push(line);
  } else if (sameTeam_(teamName, matchRow.homeTeam)) {
    homeLines.push(line);
  }
}

function inferTeamForStatsTable_(tableHtml, matchRow) {
  const before = cleanText_(tableHtml.slice(0, 500));
  if (sameTeam_(before, matchRow.awayTeam) || before.indexOf(matchRow.awayTeam) !== -1) {
    return matchRow.awayTeam;
  }
  if (sameTeam_(before, matchRow.homeTeam) || before.indexOf(matchRow.homeTeam) !== -1) {
    return matchRow.homeTeam;
  }

  const text = cleanText_(tableHtml);
  if (text.indexOf(matchRow.awayTeam) !== -1) {
    return matchRow.awayTeam;
  }
  if (text.indexOf(matchRow.homeTeam) !== -1) {
    return matchRow.homeTeam;
  }

  return "";
}

function findLikelyScheduleTable_(html) {
  const tables = extractTables_(html);
  for (let i = 0; i < tables.length; i += 1) {
    const text = cleanText_(tables[i]).toLowerCase();
    if (text.indexOf("away") !== -1 && text.indexOf("home") !== -1 && text.indexOf("score") !== -1) {
      return tables[i];
    }
  }
  return tables[0] || "";
}

function stripNonScheduleSections_(html) {
  let output = String(html || "");
  const tabsIndex = output.search(/<div\b[^>]*\bid=["']Tabs["']/i);
  if (tabsIndex !== -1) {
    output = output.slice(tabsIndex);
  }
  output = output.replace(/<div\b[^>]*\bid=["']divCarousel["'][\s\S]*?<\/div>/gi, "");
  output = output.replace(/<div\b[^>]*class=["'][^"']*slick-games[^"']*["'][\s\S]*?<\/div>/gi, "");
  return output;
}

function extractGameUrl_(rowHtml) {
  const jsMatch = rowHtml.match(/game_score_hockey\((\d+)\)/i);
  if (jsMatch) {
    return MSO_BASE_URL + "/hockey/visitor/league/schedule_scores/game_score_hockey.aspx?IDLeague=" + MSO_LEAGUE_ID + "&IDGame=" + jsMatch[1];
  }

  const hrefRegex = /href=["']([^"']*(?:game_score_hockey|boxscore|game|score)[^"']*)["']/i;
  const match = rowHtml.match(hrefRegex);
  if (!match) {
    return "";
  }
  const url = absoluteMsoUrl_(decodeHtml_(match[1]));
  return url.indexOf("schedule.aspx") === -1 ? url : "";
}

function attachGameUrlsByOrder_(rows, html) {
  const urls = extractGameUrlsFromHtml_(html);
  if (!rows.length || !urls.length) {
    return;
  }

  let urlIndex = 0;
  rows.forEach(function(row) {
    if (row.gameUrl) {
      return;
    }
    if (urlIndex < urls.length) {
      row.gameUrl = urls[urlIndex];
      urlIndex += 1;
    }
  });
}

function extractGameUrlsFromHtml_(html) {
  const urls = [];
  const seen = {};
  const source = stripNonScheduleSections_(html);
  const regex = /game_score_hockey\((\d+)\)/gi;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const id = match[1];
    if (seen[id]) {
      continue;
    }
    seen[id] = true;
    urls.push(MSO_BASE_URL + "/hockey/visitor/league/schedule_scores/game_score_hockey.aspx?IDLeague=" + MSO_LEAGUE_ID + "&IDGame=" + id);
  }
  return urls;
}

function extractBlockByHeading_(html, headings) {
  const lower = html.toLowerCase();
  for (let i = 0; i < headings.length; i += 1) {
    const index = lower.indexOf(headings[i].toLowerCase());
    if (index === -1) {
      continue;
    }
    return html.slice(index, index + 12000);
  }
  return "";
}

function extractTableById_(html, id) {
  const regex = new RegExp("<table\\b[^>]*\\bid=[\"']" + escapeRegExp_(id) + "[\"'][\\s\\S]*?<\\/table>", "i");
  const match = String(html || "").match(regex);
  return match ? match[0] : "";
}

function tableToTextRows_(tableHtml) {
  return extractTableRows_(tableHtml).map(function(rowHtml) {
    return extractCells_(rowHtml).map(function(cell) {
      return cleanText_(cell.html);
    });
  }).filter(function(row) {
    return row.some(function(cell) { return cell !== ""; });
  });
}

function extractTables_(html) {
  const tables = [];
  const regex = /<table[\s\S]*?<\/table>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    tables.push(match[0]);
  }
  return tables;
}

function extractTableRows_(html) {
  const rows = [];
  const regex = /<tr[\s\S]*?<\/tr>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    rows.push(match[0]);
  }
  return rows;
}

function extractCells_(rowHtml) {
  const cells = [];
  const regex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  let match;
  while ((match = regex.exec(rowHtml)) !== null) {
    cells.push({ html: match[1] });
  }
  return cells;
}

function looksLikeHeader_(cells) {
  const joined = cells.join("|").toLowerCase();
  return joined.indexOf("date") !== -1 && joined.indexOf("away") !== -1;
}

function isValidScheduleRow_(date, time, awayTeam, awayScore, homeScore, homeTeam) {
  if (!isDateLine_(date) || !isTimeLine_(time)) {
    return false;
  }
  if (!awayTeam || !homeTeam || awayScore === "" || homeScore === "") {
    return false;
  }
  const joined = (awayTeam + " " + homeTeam).toLowerCase();
  if (/loading in progress|terms of service|privacy policy|mystatsonline/.test(joined)) {
    return false;
  }
  return true;
}

function htmlToLines_(html) {
  return decodeHtml_(String(html || ""))
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(?:br|\/tr|\/td|\/th|\/div|\/p|\/li|\/a|\/span)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split(/\n+/)
    .map(function(line) {
      return line.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    })
    .filter(function(line) {
      return Boolean(line);
    });
}

function isDateLine_(line) {
  return /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+[A-Za-z]+\s+\d{1,2},\s+\d{4}$/i.test(line);
}

function isTimeLine_(line) {
  return /^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(line) || /^\d{1,2}:\d{2}$/i.test(line);
}

function extractTimeFromDateTimeCell_(value) {
  const text = cleanText_(value).replace(/^\d+\s*-\s*/, "");
  const match = text.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM)?\b/i);
  return match ? match[0].replace(/\s+/g, " ").trim() : "";
}

function isRoundLine_(line) {
  return /^(gruppspel|group|round|kvartsfinal|semifinal|final|bronze|slutspel)/i.test(line);
}

function inferCupFromText_(text) {
  const clean = cleanText_(text);
  const sommar = clean.match(/SEC\s+Sommar\s+[0-9.]+/i);
  if (sommar) {
    return sommar[0];
  }
  const challenger = clean.match(/SEC\s+[0-9.]+\s+challenger/i);
  if (challenger) {
    return challenger[0];
  }
  const regular = clean.match(/SEC\s+[0-9.]+/i);
  return regular ? regular[0] : "";
}

function inferStageFromText_(text) {
  const lower = cleanText_(text).toLowerCase();
  if (lower.indexOf("grupp") !== -1 || lower.indexOf("group") !== -1) {
    return "Gruppspel";
  }
  if (lower.indexOf("slut") !== -1 || lower.indexOf("final") !== -1 || lower.indexOf("semi") !== -1 || lower.indexOf("kvarts") !== -1) {
    return "Slutspel";
  }
  return "";
}

function inferGroupFromText_(text) {
  const clean = cleanText_(text);
  const match = clean.match(/Grupp\s+\d+/i) || clean.match(/Group\s+\d+/i);
  return match ? match[0].replace(/^Group/i, "Grupp") : "";
}

function normalizeStageLabel_(stage, page) {
  const configuredStage = cleanText_(page && page.stage);
  const lower = cleanText_(stage).toLowerCase();

  if (configuredStage === "Slutspel") {
    if (lower.indexOf("final") !== -1 && lower.indexOf("semi") === -1) {
      return "FINAL";
    }
    if (lower.indexOf("semi") !== -1) {
      return "SEMIFINAL";
    }
    if (lower.indexOf("kvart") !== -1 || lower.indexOf("round 1") !== -1 || lower.indexOf("quarter") !== -1) {
      return "KVARTSFINAL";
    }
    return "SLUTSPEL";
  }

  if (lower.indexOf("grupp") !== -1 || lower.indexOf("group") !== -1) {
    return "Gruppspel";
  }
  if (lower.indexOf("final") !== -1 && lower.indexOf("semi") === -1) {
    return "FINAL";
  }
  if (lower.indexOf("semi") !== -1) {
    return "SEMIFINAL";
  }
  if (lower.indexOf("kvart") !== -1 || lower.indexOf("round 1") !== -1 || lower.indexOf("quarter") !== -1) {
    return "KVARTSFINAL";
  }
  if (lower.indexOf("slut") !== -1) {
    return "SLUTSPEL";
  }
  return cleanText_(stage);
}

function abbreviateTeam_(teamName) {
  return cleanText_(teamName)
    .split(/\s+/)
    .map(function(part) { return part.charAt(0); })
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function sameTeam_(a, b) {
  return normalizeTeamKey_(a) === normalizeTeamKey_(b);
}

function normalizeTeamKey_(value) {
  return cleanText_(value)
    .toLowerCase()
    .replace(/[\u00e5\u00e4]/g, "a")
    .replace(/\u00f6/g, "o")
    .replace(/[^a-z0-9]/g, "");
}

function firstIndex_(headers, names) {
  for (let i = 0; i < headers.length; i += 1) {
    if (names.indexOf(headers[i]) !== -1) {
      return i;
    }
  }
  return -1;
}

function normalizeHeader_(value) {
  return cleanText_(value)
    .toLowerCase()
    .replace(/[\u00e5\u00e4]/g, "a")
    .replace(/\u00f6/g, "o")
    .replace(/[^a-z0-9%]/g, "");
}

function extractLinkedNames_(html) {
  const names = [];
  const regex = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(String(html || ""))) !== null) {
    const name = cleanPlayerName_(match[1]);
    if (name) {
      names.push(name);
    }
  }
  return names;
}

function cleanPlayerName_(value) {
  return cleanText_(value)
    .replace(/\s*,\s*[A-Z]{2,3}\b/g, "")
    .replace(/\s*#\d+\b/g, "")
    .replace(/\s*\(\d+\)\s*$/g, "")
    .trim();
}

function addPeriodOffset_(time, offset) {
  const match = cleanText_(time).match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return cleanText_(time);
  }
  return String(Number(match[1]) + Number(offset || 0)) + ":" + match[2];
}

function fallbackGoalTime_(periodOffset, index, team, scorer) {
  const seedText = String(team || "") + "|" + String(scorer || "") + "|" + String(index || 0);
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) % 9973;
  }

  const baseSeconds = 80 + (Number(index || 0) * 127) + (seed % 61);
  const secondsInPeriod = Math.min(1198, baseSeconds % 1199);
  const minute = Number(periodOffset || 0) + Math.floor(secondsInPeriod / 60);
  const second = secondsInPeriod % 60;
  return String(minute) + ":" + (second < 10 ? "0" + second : String(second));
}

function markGameWinningGoal_(events, matchRow) {
  const awayScore = Number(matchRow.awayScore || 0);
  const homeScore = Number(matchRow.homeScore || 0);
  if (awayScore === homeScore || !events.length) {
    return;
  }

  const winnerTeam = awayScore > homeScore ? matchRow.awayTeam : matchRow.homeTeam;
  const winnerScore = Math.max(awayScore, homeScore);
  const loserScore = Math.min(awayScore, homeScore);
  const eventTeamCounts = {};
  events.forEach(function(event) {
    eventTeamCounts[event.team] = (eventTeamCounts[event.team] || 0) + 1;
  });
  const winnerEventTeams = Object.keys(eventTeamCounts).filter(function(team) {
    return eventTeamCounts[team] === winnerScore;
  });
  const winnerEventTeam = winnerEventTeams.length === 1 ? winnerEventTeams[0] : abbreviateTeam_(winnerTeam);
  let winnerGoals = 0;

  for (let i = 0; i < events.length; i += 1) {
    if (sameTeam_(events[i].team, winnerTeam) || events[i].team === winnerEventTeam) {
      winnerGoals += 1;
      if (winnerGoals === loserScore + 1) {
        events[i].gwg = true;
        return;
      }
    }
  }
}

function toScore_(value) {
  const match = cleanText_(value).match(/\d+/);
  return match ? Number(match[0]) : "";
}

function toNumberText_(value) {
  const match = cleanText_(value).match(/-?\d+(?:[.,]\d+)?/);
  return match ? match[0].replace(",", ".") : "0";
}

function normalizeSavePercentage_(value) {
  const rawText = cleanText_(value).replace(",", ".");
  const rawMatch = rawText.match(/-?(?:\d+(?:\.\d+)?|\.\d+)/);
  const raw = rawMatch ? rawMatch[0] : "0";
  const num = Number(raw);
  if (!Number.isFinite(num)) {
    return "0.0";
  }
  if (num <= 1) {
    return (num * 100).toFixed(1);
  }
  if (num <= 100) {
    return num.toFixed(1);
  }
  return (num / 100).toFixed(1);
}

function absoluteMsoUrl_(href) {
  const clean = String(href || "").replace(/&amp;/g, "&");
  if (/^\d+$/.test(clean)) {
    return MSO_BASE_URL + "/hockey/visitor/league/schedule_scores/schedule.aspx?IDLeague=" + MSO_LEAGUE_ID + "&IDSchedule=" + clean;
  }
  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }
  if (clean.charAt(0) === "/") {
    return MSO_BASE_URL + clean;
  }
  return MSO_BASE_URL + "/hockey/visitor/league/schedule_scores/" + clean;
}

function fetchText_(url) {
  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: {
      "User-Agent": "Mozilla/5.0 SEC importer"
    }
  });

  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error("Kunde inte hämta " + url + " HTTP " + code);
  }

  return response.getContentText();
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const same = headers.every(function(header, index) {
    return String(current[index] || "") === header;
  });

  if (!same) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function cleanText_(value) {
  return decodeHtml_(String(value || ""))
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml_(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function doGet(e) {
  return ContentService
    .createTextOutput(getDatabaseCupsExtraJson())
    .setMimeType(ContentService.MimeType.JSON);
}
function buildDatabaseCupsExtraExport() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = secExportGetRequiredSheets_(spreadsheet);
  const cups = new Map();

  secExportIngestWinnerRows_(secExportGetRows_(sheets.winners), cups);
  secExportIngestSettingsRows_(secExportGetRows_(sheets.rules), cups);
  secExportIngestMatchRows_(secExportGetRows_(sheets.matches), cups);
  secExportIngestPlayerRows_(secExportGetRows_(sheets.playerStats), cups);
  secExportIngestGoalieRows_(secExportGetRows_(sheets.goalieStats), cups);

  return {
    generatedAt: new Date().toISOString(),
    source: {
      type: "google-sheet",
      spreadsheetId: spreadsheet.getId(),
      spreadsheetName: spreadsheet.getName(),
      embeddedSheets: ["regler", "vinnare"]
    },
    cups: Array.from(cups.values()).sort(secExportSortCups_)
  };
}

function getDatabaseCupsExtraJson() {
  return JSON.stringify(buildDatabaseCupsExtraExport(), null, 2);
}

function saveDatabaseCupsExtraJsonToDrive() {
  const fileName = "database-cups-extra.json";
  const json = getDatabaseCupsExtraJson();
  const files = DriveApp.getFilesByName(fileName);

  if (files.hasNext()) {
    const file = files.next();
    file.setContent(json);
    return file.getUrl();
  }

  return DriveApp.createFile(fileName, json, MimeType.PLAIN_TEXT).getUrl();
}

function secExportGetRequiredSheets_(spreadsheet) {
  return {
    playerStats: secExportGetSheetByNames_(spreadsheet, ["utestatsall", "utesatsall"]),
    goalieStats: secExportGetSheetByNames_(spreadsheet, ["målvaktsstatsall", "malvaktsstatsall"]),
    matches: secExportGetSheetByNames_(spreadsheet, ["matcherSEC"]),
    winners: secExportGetSheetByNames_(spreadsheet, ["vinnare"]),
    rules: secExportGetSheetByNames_(spreadsheet, ["regler"])
  };
}

function secExportGetSheetByNames_(spreadsheet, names) {
  const targetNames = names.map(secExportNormalizeName_);
  const sheets = spreadsheet.getSheets();

  for (let i = 0; i < sheets.length; i += 1) {
    const sheetName = secExportNormalizeName_(sheets[i].getName());
    if (targetNames.indexOf(sheetName) !== -1) {
      return sheets[i];
    }
  }

  throw new Error("Kunde inte hitta fliken: " + names.join(" / "));
}

function secExportGetRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) {
    return [];
  }

  const headerRowIndex = secExportFindHeaderRowIndex_(values);
  if (headerRowIndex === -1) {
    return [];
  }

  const headers = values[headerRowIndex].map(secExportNormalizeHeader_);
  const rows = [];

  for (let rowIndex = headerRowIndex + 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    if (secExportIsRowEmpty_(row)) {
      continue;
    }

    const record = {};
    for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
      const header = headers[columnIndex];
      if (header) {
        record[header] = row[columnIndex];
      }
    }
    rows.push(record);
  }

  return rows;
}

function secExportFindHeaderRowIndex_(values) {
  for (let rowIndex = 0; rowIndex < values.length; rowIndex += 1) {
    const headers = values[rowIndex]
      .map(secExportNormalizeHeader_)
      .filter(function(value) { return value !== ""; });
    const joined = headers.join("|");

    if (
      joined.indexOf("players") !== -1 ||
      joined.indexOf("goalies") !== -1 ||
      joined.indexOf("date") !== -1 ||
      (headers.indexOf("cup") !== -1 && headers.indexOf("1a") !== -1) ||
      (headers.indexOf("cup") !== -1 && headers.indexOf("info") !== -1)
    ) {
      return rowIndex;
    }
  }

  return -1;
}

function secExportIngestWinnerRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = secExportParseCupBase_(row.cup);
    if (!cupInfo) {
      return;
    }

    const cup = secExportGetOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.placements.first = secExportCleanString_(row["1a"]);
    cup.placements.second = secExportCleanString_(row["2a"]);
  });
}

function secExportIngestSettingsRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = secExportParseCupBase_(row.cup);
    if (!cupInfo) {
      return;
    }

    const cup = secExportGetOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.settings = {
      playoffCut1: secExportToNullableNumber_(row.slutspelsstreck_1),
      playoffCut2: secExportToNullableNumber_(row.slutspelsstreck_2),
      bestOf: {
        roundOf16: secExportToNullableNumber_(row.bo_atton),
        quarter: secExportToNullableNumber_(row.bo_kvart),
        semi: secExportToNullableNumber_(row.bo_semi),
        final: secExportToNullableNumber_(row.bo_final)
      },
      minPlayers: secExportToNullableNumber_(row.minst_antal_spelare),
      maxPlayers: secExportToNullableNumber_(row.max_antal_spelare),
      eligibility: secExportCleanString_(row.behorighet),
      info: secExportCleanString_(row.info)
    };
  });
}

function secExportIngestMatchRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = secExportParseCupBase_(row.cup);
    if (!cupInfo) {
      return;
    }

    const cup = secExportGetOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.matches.push({
      date: secExportToIsoDate_(row.date),
      time: secExportCleanString_(row.time),
      awayTeam: secExportCleanString_(row.away_team),
      awayScore: secExportToNullableNumber_(row.away_score),
      homeScore: secExportToNullableNumber_(row.home_score),
      homeTeam: secExportCleanString_(row.home_team),
      overtime: secExportToBoolean_(row.ot),
      stage: secExportParseStage_(row.stage),
      group: secExportCleanString_(row.grupp),
      goalsSummary: secExportCleanString_(row.goalssummary),
      statsSummary: secExportCleanString_(row.stats)
    });
  });
}

function secExportIngestPlayerRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = secExportParseCupStage_(row.cup);
    if (!cupInfo) {
      return;
    }

    const cup = secExportGetOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.playerStats[cupInfo.stage].push({
      player: secExportCleanString_(row.players),
      team: secExportCleanString_(row.team),
      gp: secExportToNullableNumber_(row.gp),
      g: secExportToNullableNumber_(row.g),
      a: secExportToNullableNumber_(row.a),
      pts: secExportToNullableNumber_(row.pts),
      pim: secExportToNullableNumber_(row.pim),
      playerId: secExportCleanString_(row.playerid)
    });
  });
}

function secExportIngestGoalieRows_(rows, cups) {
  rows.forEach(function(row) {
    const cupInfo = secExportParseCupStage_(row.cup);
    if (!cupInfo) {
      return;
    }

    const cup = secExportGetOrCreateCup_(cups, cupInfo.cupId, cupInfo);
    cup.goalieStats[cupInfo.stage].push({
      player: secExportCleanString_(row.goalies),
      team: secExportCleanString_(row.team),
      gp: secExportToNullableNumber_(row.gp),
      sa: secExportToNullableNumber_(row.sa),
      ga: secExportToNullableNumber_(row.ga),
      sv: secExportToNullableNumber_(row.sv),
      gaa: secExportToNullableNumber_(row.gaa),
      svp: secExportToNullableNumber_(row.svp),
      so: secExportToNullableNumber_(row.so),
      playerId: secExportCleanString_(row.playerid)
    });
  });
}

function secExportParseCupStage_(value) {
  const text = secExportNormalizeCupLabel_(value);

  let match = text.match(/^SEC\s+Sommar\s+(\d+)\s+([GS])$/i);
  if (match) {
    return secExportCreateCupInfo_("sommar-" + match[1], "SEC Sommar " + match[1], "SEC Sommar " + match[1], match[2], 1000 + Number(match[1]));
  }

  match = text.match(/^SEC\s+(\d+(?:\.\d+)?)\s+DIV\s+(\d+)\s+([GS])$/i);
  if (match) {
    const id = match[1] + "-div-" + match[2];
    const code = "SEC " + match[1] + " DIV " + match[2];
    return secExportCreateCupInfo_(id, code, code, match[3], Number(match[1]) + Number(match[2]) / 10);
  }

  match = text.match(/^SEC\s+(\d+(?:\.\d+)?)\s+([GS])$/i);
  if (match) {
    return secExportCreateCupInfo_(match[1], "SEC " + match[1], "Svenska eHockey Cupen " + match[1], match[2], Number(match[1]));
  }

  return null;
}

function secExportParseCupBase_(value) {
  const text = secExportNormalizeCupLabel_(value);

  let match = text.match(/^SEC\s+Sommar\s+(\d+)$/i);
  if (match) {
    return {
      cupId: "sommar-" + match[1],
      code: "SEC Sommar " + match[1],
      name: "SEC Sommar " + match[1],
      badge: "Sommar",
      sortOrder: 1000 + Number(match[1])
    };
  }

  match = text.match(/^SEC\s+(\d+(?:\.\d+)?)\s+DIV\s+(\d+)$/i);
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

  match = text.match(/^SEC\s+17\s+challenger$/i);
  if (match) {
    return {
      cupId: "17-challenger",
      code: "SEC 17 challenger",
      name: "Svenska eHockey Cupen 17 Challenger",
      badge: "",
      sortOrder: 17.05
    };
  }

  match = text.match(/^SEC\s+(\d+(?:\.\d+)?)$/i);
  if (match) {
    return {
      cupId: match[1],
      code: "SEC " + match[1],
      name: "Svenska eHockey Cupen " + match[1],
      badge: "",
      sortOrder: Number(match[1])
    };
  }

  return null;
}

function secExportCreateCupInfo_(cupId, code, name, stageCode, sortOrder) {
  return {
    cupId: cupId,
    code: code,
    name: name,
    badge: /^SEC Sommar/i.test(code) ? "Sommar" : "",
    stage: String(stageCode || "G").toUpperCase() === "S" ? "playoffs" : "group",
    sortOrder: sortOrder
  };
}

function secExportGetOrCreateCup_(cups, cupId, cupInfo) {
  if (!cups.has(cupId)) {
    const info = cupInfo || {};
    cups.set(cupId, {
      id: cupId,
      sortOrder: info.sortOrder || secExportGetCupSortValue_(cupId),
      code: info.code || String(cupId),
      name: info.name || String(cupId),
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

function secExportNormalizeCupLabel_(value) {
  const text = String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^Sommar cupen\s+/i, "SEC Sommar ")
    .replace(/^SEC\s+Challenger$/i, "SEC 17 challenger");
  return text;
}

function secExportParseStage_(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (normalized.indexOf("grupp") !== -1) {
    return "group";
  }
  if (normalized.indexOf("slut") !== -1 || normalized.indexOf("final") !== -1 || normalized.indexOf("semi") !== -1 || normalized.indexOf("kvart") !== -1 || normalized.indexOf("round") !== -1) {
    return "playoffs";
  }
  return normalized;
}

function secExportSortCups_(a, b) {
  return secExportGetCupSortValue_(a.id) - secExportGetCupSortValue_(b.id);
}

function secExportGetCupSortValue_(cupId) {
  const text = String(cupId || "");
  const sommarMatch = text.match(/^sommar-(\d+)/i);
  if (sommarMatch) {
    return 1000 + Number(sommarMatch[1]);
  }
  const challengerMatch = text.match(/^(\d+(?:\.\d+)?)-challenger$/i);
  if (challengerMatch) {
    return Number(challengerMatch[1]) + 0.05;
  }
  const divMatch = text.match(/^(\d+(?:\.\d+)?)-div-(\d+)$/i);
  if (divMatch) {
    return Number(divMatch[1]) + Number(divMatch[2]) / 10;
  }
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : 9999;
}

function secExportNormalizeHeader_(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/\./g, "")
    .replace(/:/g, "")
    .replace(/\s+/g, "_");
}

function secExportNormalizeName_(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "");
}

function secExportIsRowEmpty_(row) {
  return row.every(function(cell) {
    return String(cell || "").trim() === "";
  });
}

function secExportCleanString_(value) {
  const stringValue = String(value || "").trim();
  return stringValue === "" ? null : stringValue;
}

function secExportToNumber_(value) {
  const normalized = String(value || "").trim().replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function secExportToNullableNumber_(value) {
  if (value === "" || value === null || typeof value === "undefined") {
    return null;
  }
  return secExportToNumber_(value);
}

function secExportToBoolean_(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "ja", "yes", "ot"].indexOf(normalized) !== -1;
}

function secExportToIsoDate_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return secExportCleanString_(value);
}