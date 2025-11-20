// Basisconfiguratie voor de BiNaS viewer.
const PDF_URL = 'https://drive.google.com/uc?export=download&id=1PvuI4LDnkbfIyujRxe74Urau2quj1hk-';
const DEFAULT_SPREAD = true;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.15;

// Voorbeeldindex, makkelijk uitbreidbaar zodra de echte pagina's bekend zijn.
const BINAS_INDEX = [
  { category: 'Algemeen', code: '1', title: 'Grieks alfabet', pageStart: 7, pageEnd: 7 },
  { category: 'Algemeen', code: '3', title: 'Grootheden en eenheden in het SI', pageStart: 9, pageEnd: 11 },
  { category: 'Algemeen', code: '7', title: 'Omrekenfactoren van eenheden', pageStart: 15, pageEnd: 16 },
  { category: 'Natuurkunde', code: '10', title: 'Waarden van enkele constanten', pageStart: 25, pageEnd: 26 },
  { category: 'Natuurkunde', code: '14A', title: 'Kook- en smeltpunten', pageStart: 33, pageEnd: 34 },
  { category: 'Natuurkunde', code: '15', title: 'Dichtheden van vaste stoffen', pageStart: 35, pageEnd: 35 },
  { category: 'Wiskunde', code: '24', title: 'Standaardafwijking', pageStart: 47, pageEnd: 47 },
  { category: 'Scheikunde', code: '40', title: 'Naamgeving binair', pageStart: 65, pageEnd: 66 },
  { category: 'Biologie', code: '78', title: 'Samenstelling bloedplasma en serum', pageStart: 96, pageEnd: 97 },
  { category: 'Biologie', code: '87', title: 'Hormoonsystemen', pageStart: 110, pageEnd: 112 },
  { category: 'Biologie', code: '93', title: 'Afweer en immuniteit', pageStart: 122, pageEnd: 125 },
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
function groupByCategory(items) {
  return items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
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
      item.code.toLowerCase().includes(query)
    );
  });

  topicList.innerHTML = '';
  const grouped = groupByCategory(filtered);
  Object.entries(grouped).forEach(([category, items]) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'category-group';

    const header = document.createElement('h3');
    header.className = 'category-header';
    header.textContent = category;
    groupEl.appendChild(header);

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

  // schaal berekenen op basis van gekozen modus of laatste fit.
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
  const containerWidth = viewerContainer.clientWidth - 40; // marge voor padding
  const containerHeight = viewerContainer.clientHeight - 40;
  if (lastFitMode === 'fit-page') {
    return Math.min(
      containerWidth / (pageWidth * pagesShown + 12 * (pagesShown - 1)),
      containerHeight / pageHeight
    );
  }
  if (lastFitMode === 'fit-width') {
    return containerWidth / (pageWidth * pagesShown + 12 * (pagesShown - 1));
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

// PDF laden
async function loadPdf() {
  setStatus('PDF laden…');
  clearError();
  try {
    const loadingTask = pdfjsLib.getDocument({ url: PDF_URL, withCredentials: false });
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;
    pageInput.max = totalPages;
    toggleViewBtn.textContent = spreadMode ? 'Spread' : 'Enkele pagina';
    await renderPages();
  } catch (err) {
    console.error(err);
    showError('Kon de PDF niet laden. Controleer de internetverbinding of CORS-instellingen.');
    setStatus('Laden mislukt');
  }
}

function init() {
  renderIndex();
  loadPdf();
}

init();
