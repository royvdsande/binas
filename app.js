// Basisconfiguratie voor de BiNaS viewer.
const PDF_URL = 'https://drive.google.com/uc?export=download&id=1PvuI4LDnkbfIyujRxe74Urau2quj1hk-';
// Alternatieve CORS-vriendelijke proxy als Google Drive weigert: puur client-side fallback.
const PDF_FALLBACK_URL = `https://cors.isomorphic-git.org/${PDF_URL}`;
const DEFAULT_SPREAD = true;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.15;

// Index op basis van de zichtbare inhoudsopgave uit de bijgevoegde afbeeldingen.
// Pagina's zijn initieel uit de TOC overgenomen; pas ze gerust aan als je met een andere editie werkt.
const BINAS_INDEX = [
  // Algemeen
  { category: 'Algemeen', code: '1', title: 'Alfabetten', pageStart: 4, pageEnd: 5 },
  { category: 'Algemeen', code: '2', title: 'Vermenigvuldigingsfactoren', pageStart: 5, pageEnd: 5 },
  { category: 'Algemeen', code: '3', title: 'Grootheden en eenheden in het SI', pageStart: 6, pageEnd: 7 },
  { category: 'Algemeen', code: '4', title: 'Grootheden en eenheden buiten SI', pageStart: 8, pageEnd: 9 },
  { category: 'Algemeen', code: '5', title: 'Omrekenfactoren van eenheden', pageStart: 10, pageEnd: 10 },
  { category: 'Algemeen', code: '6', title: 'Afkortingen', pageStart: 11, pageEnd: 11 },

  // Natuurkunde
  { category: 'Natuurkunde', code: '7', section: 'Constanten', title: 'Waarden van enkele constanten', pageStart: 12, pageEnd: 13 },
  { category: 'Natuurkunde', code: '8', section: 'Constanten', title: 'Natuurconstanten', pageStart: 14, pageEnd: 15 },
  { category: 'Natuurkunde', code: '9A', section: 'Deeltjes en atomen', title: 'Basis- en omzettingseenheden', pageStart: 16, pageEnd: 16 },
  { category: 'Natuurkunde', code: '9B', section: 'Deeltjes en atomen', title: 'Deeltjes', pageStart: 17, pageEnd: 17 },
  { category: 'Natuurkunde', code: '9C', section: 'Deeltjes en atomen', title: 'Structuur van materie', pageStart: 18, pageEnd: 19 },
  { category: 'Natuurkunde', code: '10', section: 'Materiaaleigenschappen', title: 'Gegevens van enkele metalen', pageStart: 20, pageEnd: 21 },
  { category: 'Natuurkunde', code: '11A', section: 'Materiaaleigenschappen', title: 'Atomen en ionen', pageStart: 22, pageEnd: 22 },
  { category: 'Natuurkunde', code: '11B', section: 'Materiaaleigenschappen', title: 'Materiaalgegevens vaste stoffen', pageStart: 23, pageEnd: 23 },
  { category: 'Natuurkunde', code: '12A', section: 'Materiaaleigenschappen', title: 'Dichtheden vloeistoffen', pageStart: 24, pageEnd: 24 },
  { category: 'Natuurkunde', code: '12B', section: 'Materiaaleigenschappen', title: 'Materiaalgegevens vloeistoffen', pageStart: 25, pageEnd: 25 },
  { category: 'Natuurkunde', code: '13A', section: 'Gassen en dampen', title: 'Gegevens van gassen en dampen', pageStart: 26, pageEnd: 26 },
  { category: 'Natuurkunde', code: '13B', section: 'Gassen en dampen', title: 'Verzadigingsdrukken', pageStart: 27, pageEnd: 27 },
  { category: 'Natuurkunde', code: '14A', section: 'Water', title: 'Verwarmen, smelten en stollen', pageStart: 28, pageEnd: 29 },
  { category: 'Natuurkunde', code: '14B', section: 'Water', title: 'Dichtheden en volumieke massa', pageStart: 30, pageEnd: 30 },
  { category: 'Natuurkunde', code: '14C', section: 'Water', title: 'Water en stoomtabellen', pageStart: 31, pageEnd: 32 },
  { category: 'Natuurkunde', code: '15', section: 'Dichtheden', title: 'Dichtheden van vaste stoffen', pageStart: 33, pageEnd: 33 },
  { category: 'Natuurkunde', code: '16', section: 'Warmte', title: 'Warmte en soortelijke warmte', pageStart: 34, pageEnd: 35 },
  { category: 'Natuurkunde', code: '17', section: 'Elektriciteit', title: 'Elektrische eigenschappen', pageStart: 36, pageEnd: 37 },
  { category: 'Natuurkunde', code: '18', section: 'Magnetisme', title: 'Magnetische gegevens', pageStart: 38, pageEnd: 38 },
  { category: 'Natuurkunde', code: '19', section: 'Licht en geluid', title: 'Optica, breking en golven', pageStart: 39, pageEnd: 40 },
  { category: 'Natuurkunde', code: '20', section: 'Straling', title: 'Straling en spectra', pageStart: 41, pageEnd: 42 },
  { category: 'Natuurkunde', code: '21', section: 'Kernfysica', title: 'Kernfysica', pageStart: 43, pageEnd: 43 },
  { category: 'Natuurkunde', code: '22', section: 'Astrofysica', title: 'Astrofysica', pageStart: 44, pageEnd: 44 },
  { category: 'Natuurkunde', code: '23', section: 'Quantum', title: 'Quantummechanica', pageStart: 45, pageEnd: 45 },

  // Wiskunde
  { category: 'Wiskunde', code: '24', title: 'Standaardafwijking', pageStart: 46, pageEnd: 46 },
  { category: 'Wiskunde', code: '25', title: 'Regressieanalyse', pageStart: 47, pageEnd: 47 },
  { category: 'Wiskunde', code: '26', title: 'Interpolatie', pageStart: 48, pageEnd: 48 },
  { category: 'Wiskunde', code: '27', title: 'Distributie', pageStart: 49, pageEnd: 49 },
  { category: 'Wiskunde', code: '28', title: 'Trigonometrie en tabellen', pageStart: 50, pageEnd: 51 },
  { category: 'Wiskunde', code: '29', title: 'Statistiek en kansen', pageStart: 52, pageEnd: 53 },

  // Scheikunde
  { category: 'Scheikunde', code: '30', section: 'Eigenschappen stoffen', title: 'Eigenschappen vaste stoffen', pageStart: 54, pageEnd: 55 },
  { category: 'Scheikunde', code: '31', section: 'Eigenschappen stoffen', title: 'Eigenschappen vloeistoffen', pageStart: 56, pageEnd: 57 },
  { category: 'Scheikunde', code: '32', section: 'Eigenschappen stoffen', title: 'Eigenschappen gassen', pageStart: 58, pageEnd: 58 },
  { category: 'Scheikunde', code: '33', section: 'Chemische evenwichten', title: 'Evenwichtsconstanten', pageStart: 59, pageEnd: 60 },
  { category: 'Scheikunde', code: '34', section: 'Zuren en basen', title: 'Zuurconstanten', pageStart: 61, pageEnd: 61 },
  { category: 'Scheikunde', code: '35', section: 'Redox', title: 'Redoxreacties', pageStart: 62, pageEnd: 62 },
  { category: 'Scheikunde', code: '36', section: 'Kinetiek', title: 'Reactiesnelheden', pageStart: 63, pageEnd: 63 },
  { category: 'Scheikunde', code: '37', section: 'Thermodynamica', title: 'Enthalpieën', pageStart: 64, pageEnd: 65 },
  { category: 'Scheikunde', code: '38', section: 'Elektrochemie', title: 'Standaardelektrodepotentialen', pageStart: 66, pageEnd: 67 },
  { category: 'Scheikunde', code: '39', section: 'Organische chemie', title: 'Structuur en eigenschappen', pageStart: 68, pageEnd: 69 },
  { category: 'Scheikunde', code: '40', section: 'Organische chemie', title: 'Naamgeving', pageStart: 70, pageEnd: 71 },
  { category: 'Scheikunde', code: '41', section: 'Analytische chemie', title: 'Analyse en meetmethoden', pageStart: 72, pageEnd: 73 },
  { category: 'Scheikunde', code: '42', section: 'Biochemie', title: 'Biomoleculen', pageStart: 74, pageEnd: 75 },
  { category: 'Scheikunde', code: '43', section: 'Polymeren', title: 'Kunststoffen', pageStart: 76, pageEnd: 77 },
  { category: 'Scheikunde', code: '44', section: 'Milieu', title: 'Milieukunde', pageStart: 78, pageEnd: 79 },
  { category: 'Scheikunde', code: '45', section: 'Veiligheid', title: 'Veiligheidsinformatie', pageStart: 80, pageEnd: 81 },
  { category: 'Scheikunde', code: '46', section: 'Gasdata', title: 'Gasconstanten en toestanden', pageStart: 82, pageEnd: 83 },
  { category: 'Scheikunde', code: '47', section: 'Oplossingen', title: 'Oplosbaarheid en molariteit', pageStart: 84, pageEnd: 85 },
  { category: 'Scheikunde', code: '48', section: 'Kristalstructuren', title: 'Roosterstructuren', pageStart: 86, pageEnd: 87 },
  { category: 'Scheikunde', code: '49', section: 'Zouten en zuren', title: 'pH en buffers', pageStart: 88, pageEnd: 89 },
  { category: 'Scheikunde', code: '50', section: 'Organische reactiemechanismen', title: 'Reactiemechanismen', pageStart: 90, pageEnd: 91 },
  { category: 'Scheikunde', code: '51', section: 'Chemische rekenhulpen', title: 'Rekenhulpen', pageStart: 92, pageEnd: 93 },
  { category: 'Scheikunde', code: '52', section: 'Energietabellen', title: 'Verbrandingswarmten', pageStart: 94, pageEnd: 95 },
  { category: 'Scheikunde', code: '53', section: 'Thermodynamica', title: 'Vrije energie', pageStart: 96, pageEnd: 96 },
  { category: 'Scheikunde', code: '54', section: 'Faseovergangen', title: 'Fasediagrammen', pageStart: 97, pageEnd: 97 },
  { category: 'Scheikunde', code: '55', section: 'Isotopen', title: 'Stabiele isotopen', pageStart: 98, pageEnd: 98 },
  { category: 'Scheikunde', code: '56', section: 'Periodiek systeem', title: 'Periodiek systeem', pageStart: 99, pageEnd: 101 },
  { category: 'Scheikunde', code: '57', section: 'Elementeigenschappen', title: 'Atomaire eigenschappen', pageStart: 102, pageEnd: 103 },
  { category: 'Scheikunde', code: '58', section: 'Chemische processen', title: 'Procesoverzichten', pageStart: 104, pageEnd: 105 },

  // Biologie
  { category: 'Biologie', code: '59A', section: 'Cel', title: 'Celtypen', pageStart: 108, pageEnd: 109 },
  { category: 'Biologie', code: '59B', section: 'Cel', title: 'Celorganellen', pageStart: 110, pageEnd: 110 },
  { category: 'Biologie', code: '59C', section: 'Cel', title: 'Celmembranen', pageStart: 111, pageEnd: 111 },
  { category: 'Biologie', code: '60A', section: 'DNA en replicatie', title: 'DNA-structuur', pageStart: 112, pageEnd: 112 },
  { category: 'Biologie', code: '60B', section: 'DNA en replicatie', title: 'DNA-replicatie', pageStart: 113, pageEnd: 113 },
  { category: 'Biologie', code: '61A', section: 'Eiwitsynthese', title: 'Transcriptie', pageStart: 114, pageEnd: 114 },
  { category: 'Biologie', code: '61B', section: 'Eiwitsynthese', title: 'Translatie', pageStart: 115, pageEnd: 115 },
  { category: 'Biologie', code: '61C', section: 'Eiwitsynthese', title: 'Genexpressie', pageStart: 116, pageEnd: 116 },
  { category: 'Biologie', code: '62', section: 'Celdeling', title: 'Mitose en meiose', pageStart: 117, pageEnd: 118 },
  { category: 'Biologie', code: '63', section: 'Evolutie', title: 'Evolutie', pageStart: 119, pageEnd: 120 },
  { category: 'Biologie', code: '64A', section: 'Erfelijkheid', title: 'Erfelijke eigenschappen', pageStart: 121, pageEnd: 122 },
  { category: 'Biologie', code: '64B', section: 'Erfelijkheid', title: 'Geslachtsgebonden en stamboom', pageStart: 123, pageEnd: 124 },
  { category: 'Biologie', code: '64C', section: 'Erfelijkheid', title: 'Chromosomen en mutaties', pageStart: 125, pageEnd: 126 },
  { category: 'Biologie', code: '65A', section: 'Verbranding en ademhaling', title: 'Gaswisseling longen', pageStart: 127, pageEnd: 128 },
  { category: 'Biologie', code: '65B', section: 'Verbranding en ademhaling', title: 'Gaswisseling weefsels', pageStart: 129, pageEnd: 130 },
  { category: 'Biologie', code: '65C', section: 'Verbranding en ademhaling', title: 'Ademhalingsorganen', pageStart: 131, pageEnd: 132 },
  { category: 'Biologie', code: '66A', section: 'Transport', title: 'Hart en bloedvaten', pageStart: 133, pageEnd: 134 },
  { category: 'Biologie', code: '66B', section: 'Transport', title: 'Bouw van het hart', pageStart: 135, pageEnd: 136 },
  { category: 'Biologie', code: '66C', section: 'Transport', title: 'Samenstelling bloedplasma en serum', pageStart: 137, pageEnd: 138 },
  { category: 'Biologie', code: '67A', section: 'Uitscheiding', title: 'Nieren', pageStart: 139, pageEnd: 140 },
  { category: 'Biologie', code: '67B', section: 'Uitscheiding', title: 'Samenstelling bloedplasma en urine', pageStart: 141, pageEnd: 142 },
  { category: 'Biologie', code: '67C', section: 'Uitscheiding', title: 'Concentratieverschillen in nefron', pageStart: 143, pageEnd: 144 },
  { category: 'Biologie', code: '67D', section: 'Uitscheiding', title: 'Osmoregulatie', pageStart: 145, pageEnd: 146 },
  { category: 'Biologie', code: '68A', section: 'Voeding', title: 'Bouwstoffen', pageStart: 147, pageEnd: 148 },
  { category: 'Biologie', code: '68B', section: 'Voeding', title: 'Gebruiksstoffen', pageStart: 149, pageEnd: 150 },
  { category: 'Biologie', code: '68C', section: 'Voeding', title: 'Macronutriënten en vertering', pageStart: 151, pageEnd: 152 },
  { category: 'Biologie', code: '68D', section: 'Voeding', title: 'Organen en spijsvertering', pageStart: 153, pageEnd: 154 },
  { category: 'Biologie', code: '69A', section: 'Voortplanting', title: 'Geboorteregulatie vrouw', pageStart: 155, pageEnd: 156 },
  { category: 'Biologie', code: '69B', section: 'Voortplanting', title: 'Geboorteregulatie man', pageStart: 157, pageEnd: 158 },
  { category: 'Biologie', code: '69C', section: 'Voortplanting', title: 'Menstruatiecyclus', pageStart: 159, pageEnd: 160 },
  { category: 'Biologie', code: '69D', section: 'Voortplanting', title: 'Ontwikkeling embryo en zwangerschap', pageStart: 161, pageEnd: 162 },
  { category: 'Biologie', code: '70A', section: 'Hormoonstelsel', title: 'Hormoonklieren', pageStart: 163, pageEnd: 164 },
  { category: 'Biologie', code: '70B', section: 'Hormoonstelsel', title: 'Hormonenstelsel mens', pageStart: 165, pageEnd: 166 },
  { category: 'Biologie', code: '70C', section: 'Hormoonstelsel', title: 'Hormonen en hun werking', pageStart: 167, pageEnd: 168 },
  { category: 'Biologie', code: '70D', section: 'Hormoonstelsel', title: 'Feedback en regulatie', pageStart: 169, pageEnd: 170 },
  { category: 'Biologie', code: '71A', section: 'Afweer', title: 'Wat is afweer?', pageStart: 171, pageEnd: 171 },
  { category: 'Biologie', code: '71B', section: 'Afweer', title: 'Immuniteit', pageStart: 172, pageEnd: 173 },
  { category: 'Biologie', code: '71C', section: 'Afweer', title: 'Afweer door lymfocyten', pageStart: 174, pageEnd: 174 },
  { category: 'Biologie', code: '71D', section: 'Afweer', title: 'Immuniteit, entstoffen', pageStart: 175, pageEnd: 176 },
  { category: 'Biologie', code: '71E', section: 'Afweer', title: 'HIV en afweer', pageStart: 177, pageEnd: 177 },
  { category: 'Biologie', code: '72A', section: 'Zenuwstelsel', title: 'Bouw en werking van neuronen', pageStart: 178, pageEnd: 178 },
  { category: 'Biologie', code: '72B', section: 'Zenuwstelsel', title: 'Zenuwstelsel en impulsgeleiding', pageStart: 179, pageEnd: 180 },
  { category: 'Biologie', code: '72C', section: 'Zenuwstelsel', title: 'Zintuigcellen', pageStart: 181, pageEnd: 182 },
  { category: 'Biologie', code: '73A', section: 'Zintuigen', title: 'Zien', pageStart: 183, pageEnd: 184 },
  { category: 'Biologie', code: '73B', section: 'Zintuigen', title: 'Horen', pageStart: 185, pageEnd: 186 },
  { category: 'Biologie', code: '73C', section: 'Zintuigen', title: 'Reuk en smaak', pageStart: 187, pageEnd: 187 },
  { category: 'Biologie', code: '73D', section: 'Zintuigen', title: 'Evenwicht', pageStart: 188, pageEnd: 188 },
  { category: 'Biologie', code: '74', section: 'Waarneming', title: 'Waarneming en reflexen', pageStart: 189, pageEnd: 190 },
  { category: 'Biologie', code: '75A', section: 'Beweging', title: 'Opbouw van skelet', pageStart: 191, pageEnd: 191 },
  { category: 'Biologie', code: '75B', section: 'Beweging', title: 'Spieren', pageStart: 192, pageEnd: 193 },
  { category: 'Biologie', code: '75C', section: 'Beweging', title: 'Beweging en coördinatie', pageStart: 194, pageEnd: 195 },
  { category: 'Biologie', code: '76', section: 'Homeostase', title: 'Temperatuurregeling', pageStart: 196, pageEnd: 196 },
  { category: 'Biologie', code: '77', section: 'Homeostase', title: 'Vocht- en glucosehuishouding', pageStart: 197, pageEnd: 198 },
  { category: 'Biologie', code: '78', section: 'Bloedsomloop', title: 'Bloedgroepen en transfusie', pageStart: 199, pageEnd: 199 },
  { category: 'Biologie', code: '79', section: 'Micro-organismen', title: 'Bacteriën en virussen', pageStart: 200, pageEnd: 201 },
  { category: 'Biologie', code: '80', section: 'Ecologie', title: 'Ecosystemen', pageStart: 202, pageEnd: 203 },
  { category: 'Biologie', code: '81', section: 'Gedrag', title: 'Gedrag en prikkels', pageStart: 204, pageEnd: 205 },
  { category: 'Biologie', code: '82', section: 'Planten', title: 'Fotosynthese', pageStart: 206, pageEnd: 207 },
  { category: 'Biologie', code: '83', section: 'Planten', title: 'Transport bij planten', pageStart: 208, pageEnd: 209 },
  { category: 'Biologie', code: '84', section: 'Planten', title: 'Voortplanting planten', pageStart: 210, pageEnd: 211 },
  { category: 'Biologie', code: '85', section: 'Microbiologie', title: 'Micro-organismen en toepassingen', pageStart: 212, pageEnd: 213 },
  { category: 'Biologie', code: '86', section: 'Biotechnologie', title: 'Technieken', pageStart: 214, pageEnd: 215 },
  { category: 'Biologie', code: '87', section: 'Zintuigen', title: 'Overzicht zintuigen', pageStart: 216, pageEnd: 216 },
  { category: 'Biologie', code: '88', section: 'Overig', title: 'Overzicht samengestelde onderwerpen', pageStart: 217, pageEnd: 218 },
  { category: 'Biologie', code: '89', section: 'Overig', title: 'Systematiek', pageStart: 219, pageEnd: 220 },
  { category: 'Biologie', code: '90', section: 'Overig', title: 'Zelfregulatie', pageStart: 221, pageEnd: 221 },
  { category: 'Biologie', code: '91', section: 'Overig', title: 'Voortplanting bij planten en dieren', pageStart: 222, pageEnd: 223 },
  { category: 'Biologie', code: '92', section: 'Overig', title: 'Bouw van organismen', pageStart: 224, pageEnd: 225 },
  { category: 'Biologie', code: '93', section: 'Overig', title: 'Stofwisseling', pageStart: 226, pageEnd: 227 },
  { category: 'Biologie', code: '94', section: 'Overig', title: 'Trillingen en geluid bij organismen', pageStart: 228, pageEnd: 228 },
  { category: 'Biologie', code: '95', section: 'Overig', title: 'Meten en onderzoeken', pageStart: 229, pageEnd: 230 },
  { category: 'Biologie', code: '96', section: 'Overig', title: 'Bouw van het oog en oor', pageStart: 231, pageEnd: 232 },
  { category: 'Biologie', code: '97', section: 'Overig', title: 'Bouw van spieren en botten', pageStart: 233, pageEnd: 234 },
  { category: 'Biologie', code: '98', section: 'Overig', title: 'Bouw van huid en haren', pageStart: 235, pageEnd: 236 },
  { category: 'Biologie', code: '99', section: 'Overig', title: 'Indices en trefwoorden', pageStart: 237, pageEnd: 240 },
];

// DOM referenties
const searchInput = document.getElementById('search-input');
const topicList = document.getElementById('topic-list');
const statusEl = document.getElementById('status');
const errorBanner = document.getElementById('error-banner');
const canvasWrapper = document.getElementById('canvas-wrapper');
const viewerContainer = document.getElementById('viewer-container');
const toggleViewBtn = document.getElementById('toggle-view');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const fitWidthBtn = document.getElementById('fit-width');
const fitPageBtn = document.getElementById('fit-page');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const firstBtn = document.getElementById('first-page');
const lastBtn = document.getElementById('last-page');
const pageInput = document.getElementById('page-input');
const goToPageBtn = document.getElementById('go-to-page');
const pageInfo = document.getElementById('page-info');

// PDF variabelen
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let spreadMode = DEFAULT_SPREAD;
let currentScale = 1;
let lastFitMode = 'fit-width'; // 'fit-width' | 'fit-page' | null

// Basale panning ondersteuning
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let scrollStart = { left: 0, top: 0 };

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';

// Utility: toon status of fouten
function setStatus(message) {
  statusEl.textContent = message;
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}

function clearError() {
  errorBanner.hidden = true;
  errorBanner.textContent = '';
}

// Index rendering + filtering
function groupByCategoryAndSection(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = {};
    const sectionKey = item.section || 'Algemeen';
    if (!acc[item.category][sectionKey]) acc[item.category][sectionKey] = [];
    acc[item.category][sectionKey].push(item);
    return acc;
  }, {});
}

function renderIndex(filterValue = '') {
  const query = filterValue.trim().toLowerCase();
  const filtered = BINAS_INDEX.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.section && item.section.toLowerCase().includes(query)) ||
      item.code.toLowerCase().includes(query)
    );
  });

  topicList.innerHTML = '';
  const grouped = groupByCategoryAndSection(filtered);
  Object.entries(grouped).forEach(([category, sections]) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'category-group';

    const header = document.createElement('h3');
    header.className = 'category-header';
    header.innerHTML = `${category} <span class="pill">${Object.values(sections).reduce((c, arr) => c + arr.length, 0)} tabellen</span>`;
    groupEl.appendChild(header);

    Object.entries(sections).forEach(([sectionName, items]) => {
      const sectionEl = document.createElement('p');
      sectionEl.className = 'section-label';
      sectionEl.textContent = sectionName;
      groupEl.appendChild(sectionEl);

      items.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'topic-item';
        button.setAttribute('data-page', item.pageStart);
        button.innerHTML = `
          <div class="topic-meta">
            <p class="topic-title">${item.title}</p>
            <span class="topic-code">Tabel ${item.code}</span>
          </div>
          <p class="topic-pages">Pagina's ${item.pageStart}–${item.pageEnd}</p>
        `;
        button.addEventListener('click', () => {
          goToPage(item.pageStart);
        });
        groupEl.appendChild(button);
      });
    });

    topicList.appendChild(groupEl);
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Geen resultaten gevonden.';
    empty.style.color = '#5f6368';
    empty.style.padding = '4px 8px';
    topicList.appendChild(empty);
  }
}

// PDF helpers
function clampPage(page) {
  if (!pdfDoc) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

function getSpreadPages(page) {
  if (!spreadMode) return [clampPage(page)];
  const target = clampPage(page);
  const first = target % 2 === 0 ? target - 1 : target;
  const pages = [first];
  if (first + 1 <= totalPages) pages.push(first + 1);
  return pages;
}

async function renderPages() {
  if (!pdfDoc) return;
  clearError();
  setStatus('Bezig met renderen…');
  canvasWrapper.innerHTML = '';

  const pagesToRender = getSpreadPages(currentPage);
  const firstPage = await pdfDoc.getPage(pagesToRender[0]);
  const viewport = firstPage.getViewport({ scale: 1 });

  const scale = computeScale(viewport.width, viewport.height, pagesToRender.length);
  currentScale = scale;

  for (const pageNum of pagesToRender) {
    const page = pageNum === pagesToRender[0] ? firstPage : await pdfDoc.getPage(pageNum);
    const vp = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width;
    canvas.height = vp.height;
    canvas.setAttribute('data-page-number', pageNum);
    canvasWrapper.appendChild(canvas);

    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport: vp }).promise;
  }

  pageInfo.textContent = spreadMode && pagesToRender.length === 2
    ? `Pagina ${pagesToRender[0]}–${pagesToRender[1]} / ${totalPages}`
    : `Pagina ${pagesToRender[0]} / ${totalPages}`;
  pageInput.value = pagesToRender[0];
  setStatus('Gereed');
}

function computeScale(pageWidth, pageHeight, pagesShown) {
  const containerWidth = viewerContainer.clientWidth - 40;
  const containerHeight = viewerContainer.clientHeight - 40;
  if (lastFitMode === 'fit-page') {
    return Math.min(
      containerWidth / (pageWidth * pagesShown + 16 * (pagesShown - 1)),
      containerHeight / pageHeight
    );
  }
  if (lastFitMode === 'fit-width') {
    return containerWidth / (pageWidth * pagesShown + 16 * (pagesShown - 1));
  }
  return currentScale;
}

function goToPage(target) {
  currentPage = clampPage(target);
  renderPages();
}

function toggleSpread() {
  spreadMode = !spreadMode;
  toggleViewBtn.textContent = spreadMode ? 'Spread' : 'Enkele pagina';
  renderPages();
}

function zoom(delta) {
  lastFitMode = null;
  currentScale = Math.min(Math.max(currentScale + delta, MIN_SCALE), MAX_SCALE);
  renderPages();
}

function fitWidth() {
  lastFitMode = 'fit-width';
  renderPages();
}

function fitPage() {
  lastFitMode = 'fit-page';
  renderPages();
}

function goNext() {
  const step = spreadMode ? 2 : 1;
  goToPage(currentPage + step);
}

function goPrev() {
  const step = spreadMode ? 2 : 1;
  goToPage(currentPage - step);
}

function goFirst() {
  goToPage(1);
}

function goLast() {
  goToPage(totalPages);
}

// Event binding
searchInput.addEventListener('input', (e) => renderIndex(e.target.value));
toggleViewBtn.addEventListener('click', toggleSpread);
zoomInBtn.addEventListener('click', () => zoom(SCALE_STEP));
zoomOutBtn.addEventListener('click', () => zoom(-SCALE_STEP));
fitWidthBtn.addEventListener('click', fitWidth);
fitPageBtn.addEventListener('click', fitPage);
nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);
firstBtn.addEventListener('click', goFirst);
lastBtn.addEventListener('click', goLast);
goToPageBtn.addEventListener('click', () => {
  const target = Number(pageInput.value);
  if (Number.isFinite(target)) goToPage(target);
});

pageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const target = Number(pageInput.value);
    if (Number.isFinite(target)) goToPage(target);
  }
});

// Panning (muis slepen)
canvasWrapper.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  scrollStart = { left: canvasWrapper.scrollLeft, top: canvasWrapper.scrollTop };
  canvasWrapper.classList.add('dragging');
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - dragStart.x;
  const dy = e.clientY - dragStart.y;
  canvasWrapper.scrollLeft = scrollStart.left - dx;
  canvasWrapper.scrollTop = scrollStart.top - dy;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  canvasWrapper.classList.remove('dragging');
});

canvasWrapper.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
    zoom(e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP);
  }
});

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  switch (e.key) {
    case 'ArrowRight':
      goNext();
      break;
    case 'ArrowLeft':
      goPrev();
      break;
    case '+':
    case '=':
      zoom(SCALE_STEP);
      break;
    case '-':
      zoom(-SCALE_STEP);
      break;
    default:
      break;
  }
});

// Rescale bij resize
window.addEventListener('resize', () => {
  if (lastFitMode) renderPages();
});

// PDF laden met fallback
async function loadPdf() {
  setStatus('PDF laden…');
  clearError();

  const sources = [PDF_URL, PDF_FALLBACK_URL];
  for (const source of sources) {
    try {
      const loadingTask = pdfjsLib.getDocument({ url: source, withCredentials: false });
      pdfDoc = await loadingTask.promise;
      totalPages = pdfDoc.numPages;
      pageInput.max = totalPages;
      toggleViewBtn.textContent = spreadMode ? 'Spread' : 'Enkele pagina';
      await renderPages();
      if (source === PDF_FALLBACK_URL) {
        showError('De directe Google Drive link blokkeerde CORS. De viewer gebruikt nu een veilige proxy.');
      }
      return;
    } catch (err) {
      console.error('PDF laden mislukt voor', source, err);
      clearError();
    }
  }

  showError('Kon de PDF niet laden. Controleer internet of probeer de PDF lokaal te openen.');
  setStatus('Laden mislukt');
}

function init() {
  renderIndex();
  loadPdf();
}

init();
