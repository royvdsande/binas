const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const fileInput = document.getElementById('file-input');
const pageGrid = document.getElementById('page-grid');
const emptyState = document.getElementById('empty-state');
const loadingSpinner = document.getElementById('loading-spinner');
const loadingMessage = document.getElementById('loading-message');
const manualImportButton = document.getElementById('manual-import');
const navList = document.getElementById('nav-list');
const navSearch = document.getElementById('nav-search');
const tocToggleBtn = document.getElementById('toc-toggle');
const tocOverlay = document.getElementById('toc-overlay');
const tocCloseBtn = document.getElementById('toc-close');
const tocList = document.getElementById('toc-list');

const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const fitHeightBtn = document.getElementById('fit-height');
const fitWidthBtn = document.getElementById('fit-width');
const resetZoomBtn = document.getElementById('reset-zoom');
const toggleViewBtn = document.getElementById('toggle-view');
const pageStatus = document.getElementById('page-status');
const pageInput = document.getElementById('page-input');
const pageTotal = document.getElementById('page-total');
const zoomStatus = document.getElementById('zoom-status');
const viewerArea = document.querySelector('.viewer-area');

let pdfDoc = null;
let currentPage = 1;
let scale = 1;
let isSpread = false;
let fitMode = null;
let navigationData = [];
let userProvidedDocument = false;
const minScale = 0.2;
const maxScale = 4;
const scaleStep = 0.15;

const singlePageIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="4" width="12" height="16" rx="2.5" />
    <path d="M9.5 9.5h5" />
    <path d="M9.5 13h5" />
  </svg>
`;

const spreadIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3.5" y="4" width="7.5" height="16" rx="2.25" />
    <rect x="13" y="4" width="7.5" height="16" rx="2.25" />
    <path d="M6.25 9.5h5" />
    <path d="M15.75 13h-5" />
  </svg>
`;
function getGridMetrics() {
  const styles = getComputedStyle(pageGrid);
  const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const gap = parseFloat(styles.columnGap || styles.gap || '0');
  return { paddingX, paddingY, gap };
}

async function calculateFitWidthScale() {
  if (!pdfDoc || !viewerArea) return scale;
  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale: 1 });
  const { paddingX, gap } = getGridMetrics();
  const columns = isSpread ? 2 : 1;
  const availableWidth = Math.max(120, viewerArea.clientWidth - paddingX - gap * (columns - 1));
  const targetWidth = availableWidth / columns;
  return clampZoom(targetWidth / viewport.width);
}

async function calculateFitHeightScale() {
  if (!pdfDoc || !viewerArea) return scale;
  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale: 1 });
  const { paddingY } = getGridMetrics();
  const availableHeight = Math.max(120, viewerArea.clientHeight - paddingY);
  return clampZoom(availableHeight / viewport.height);
}

function updatePageStatus() {
  if (!pdfDoc) {
    if (pageStatus) {
      pageStatus.textContent = 'Pagina – / –';
    }
    if (pageInput) {
      pageInput.value = '';
      pageInput.disabled = true;
    }
    if (pageTotal) {
      pageTotal.textContent = '/ –';
    }
    return;
  }
  if (isSpread) {
    const secondPage = Math.min(currentPage + 1, pdfDoc.numPages);
    const range = secondPage !== currentPage ? `${currentPage}–${secondPage}` : `${currentPage}`;
    if (pageStatus) {
      pageStatus.textContent = `Pagina ${range} / ${pdfDoc.numPages}`;
    }
    if (pageInput) {
      pageInput.value = currentPage;
      pageInput.disabled = false;
    }
    if (pageTotal) {
      pageTotal.textContent = `/ ${pdfDoc.numPages}`;
    }
    return;
  }
  if (pageStatus) {
    pageStatus.textContent = `Pagina ${currentPage} / ${pdfDoc.numPages}`;
  }
  if (pageInput) {
    pageInput.value = currentPage;
    pageInput.disabled = false;
  }
  if (pageTotal) {
    pageTotal.textContent = `/ ${pdfDoc.numPages}`;
  }
}

function updateZoomStatus() {
  zoomStatus.textContent = `Zoom: ${(scale * 100).toFixed(0)}%`;
}

function updateToggleButtonVisual() {
  if (!toggleViewBtn) return;
  toggleViewBtn.classList.toggle('primary', isSpread);
  const label = isSpread ? "2 pagina's" : '1 pagina';
  toggleViewBtn.innerHTML = `${isSpread ? spreadIcon : singlePageIcon}<span>${label}</span>`;
}

function updateButtons() {
  const hasDoc = Boolean(pdfDoc);
  prevBtn.disabled = !hasDoc || currentPage <= 1;
  const maxForNext = isSpread && pdfDoc ? pdfDoc.numPages - 1 : pdfDoc?.numPages ?? 0;
  nextBtn.disabled = !hasDoc || currentPage >= maxForNext;
  zoomInBtn.disabled = !hasDoc || scale >= maxScale;
  zoomOutBtn.disabled = !hasDoc || scale <= minScale;
  fitHeightBtn.disabled = !hasDoc;
  fitWidthBtn.disabled = !hasDoc;
  resetZoomBtn.disabled = !hasDoc || (!fitMode && scale === 1);
  toggleViewBtn.disabled = !hasDoc;
  updateToggleButtonVisual();
}

async function renderPages() {
  if (!pdfDoc) return;

  if (fitMode === 'width') {
    scale = await calculateFitWidthScale();
  } else if (fitMode === 'height') {
    scale = await calculateFitHeightScale();
  }

  pageGrid.innerHTML = '';
  const pagesToRender = isSpread
    ? [currentPage, currentPage + 1].filter((pageNumber) => pageNumber && pageNumber <= pdfDoc.numPages)
    : [currentPage];

  pageGrid.classList.toggle('spread', isSpread && pagesToRender.length > 1);

  for (const pageNumber of pagesToRender) {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.className = 'page-canvas';
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: canvas.getContext('2d'),
      viewport,
    };

    await page.render(renderContext).promise;

    const wrapper = document.createElement('div');
    wrapper.className = 'page-wrapper';
    const label = document.createElement('span');
    label.className = 'page-label';
    label.textContent = `Pagina ${pageNumber}`;
    wrapper.appendChild(canvas);
    wrapper.appendChild(label);
    pageGrid.appendChild(wrapper);
  }

  updatePageStatus();
  updateZoomStatus();
  updateButtons();
}

function clampZoom(newScale) {
  return Math.min(maxScale, Math.max(minScale, newScale));
}

function changeZoom(delta) {
  if (!pdfDoc) return;
  fitMode = null;
  scale = clampZoom(scale + delta);
  renderPages();
}

async function setZoomToFitWidth() {
  if (!pdfDoc || !viewerArea) return;
  fitMode = 'width';
  scale = await calculateFitWidthScale();
  renderPages();
}

async function setZoomToFitHeight() {
  if (!pdfDoc || !viewerArea) return;
  fitMode = 'height';
  scale = await calculateFitHeightScale();
  renderPages();
}

function resetZoom() {
  if (!pdfDoc) return;
  fitMode = null;
  scale = 1;
  renderPages();
}

function changePage(direction) {
  if (!pdfDoc) return;
  const step = isSpread ? 2 : 1;
  let target = currentPage + direction * step;
  if (target < 1) target = 1;
  const upperBound = isSpread && pdfDoc.numPages > 1 ? pdfDoc.numPages - 1 : pdfDoc.numPages;
  if (target > upperBound) target = upperBound;
  currentPage = target;
  renderPages();
}

function goToPage(targetPage) {
  if (!pdfDoc) return;
  let normalized = Math.min(pdfDoc.numPages, Math.max(1, targetPage));
  if (isSpread && normalized % 2 === 0) {
    normalized = Math.max(1, normalized - 1);
  }
  currentPage = normalized;
  renderPages();
}

async function openPdf(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  pdfDoc = await loadingTask.promise;
  currentPage = 1;
  scale = 1;
  fitMode = null;
  emptyState?.remove();
  renderPages();
}

function setLoadingState(message, { showSpinner = true } = {}) {
  if (loadingMessage) {
    loadingMessage.textContent = message;
  }
  if (loadingSpinner) {
    loadingSpinner.classList.toggle('hidden', !showSpinner);
  }
  emptyState?.classList.remove('hidden');
}

async function loadDefaultPdf() {
  setLoadingState('Binas.pdf wordt automatisch geladen...', { showSpinner: true });

  try {
    const response = await fetch('Binas.pdf');
    if (!response.ok) {
      throw new Error(`Kon Binas.pdf niet laden (${response.status})`);
    }

    const buffer = await response.arrayBuffer();
    if (!userProvidedDocument) {
      await openPdf(buffer);
    }
  } catch (error) {
    console.error(error);
    setLoadingState('Automatisch laden mislukt. Importeer zelf een PDF.', { showSpinner: false });
  }
}

function toggleView() {
  isSpread = !isSpread;
  if (isSpread && currentPage % 2 === 0) {
    currentPage = Math.max(1, currentPage - 1);
  }
  if (pdfDoc) {
    renderPages();
  }
}

function normalizeText(value) {
  return value
    ?.toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function itemMatchesQuery(item, query, compactQuery, ancestors = []) {
  if (!query) return true;

  const labels = ancestors.map((ancestor) => ancestor.label).filter(Boolean);
  if (item.label) {
    labels.push(item.label);
  }

  const labelWithSpaces = normalizeText(labels.join(' '));
  const labelCompact = labelWithSpaces?.replace(/\s+/g, '');
  const titles = normalizeText([...ancestors.map((ancestor) => ancestor.title || ''), item.title || ''].join(' '));
  const combinedLabelTitle = normalizeText(`${labels.join(' ')} ${item.title || ''}`);
  const pageText = normalizeText(item.page || '');

  const haystack = [labelWithSpaces, labelCompact, titles, combinedLabelTitle, pageText]
    .filter(Boolean)
    .flatMap((entry) => [entry, entry.replace(/\s+/g, '')]);

  return haystack.some((entry) => entry.includes(query) || entry.includes(compactQuery));
}

function filterItems(items, query, compactQuery, ancestors = []) {
  return items
    .map((item) => {
      const currentAncestors = [...ancestors, { label: item.label, title: item.title }];
      const matches = itemMatchesQuery(item, query, compactQuery, ancestors);
      const children = item.children ? filterItems(item.children, query, compactQuery, currentAncestors) : [];
      if (matches || children.length) {
        return { ...item, children };
      }
      return null;
    })
    .filter(Boolean);
}

function renderEntries(items, container, theme, onSelect) {
  items.forEach((item) => {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'nav-item';
    if (theme) {
      button.dataset.theme = theme;
    }

    const content = document.createElement('div');
    content.className = 'nav-item-content';

    const label = document.createElement('span');
    label.className = 'entry-label';
    label.textContent = item.label || '';

    const title = document.createElement('span');
    title.className = 'entry-title';
    if (item.isSubtable) {
      title.classList.add('subtable-title');
    }
    title.textContent = item.title;

    content.appendChild(label);
    content.appendChild(title);

    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = `p. ${item.page}`;

    button.appendChild(content);
    button.appendChild(meta);
    button.addEventListener('click', () => {
      goToPage(item.page);
      if (typeof onSelect === 'function') {
        onSelect();
      }
    });
    listItem.appendChild(button);
    container.appendChild(listItem);

    if (item.children?.length) {
      const subList = document.createElement('ul');
      subList.className = 'nav-sublist';
      renderEntries(item.children, subList, theme, onSelect);
      container.appendChild(subList);
    }
  });
}

function renderNavigation(query = '', targetList = navList, { onSelect } = {}) {
  if (!targetList) return;
  targetList.innerHTML = '';
  const normalizedQuery = normalizeText(query);
  const compactQuery = normalizedQuery?.replace(/\s+/g, '') || '';

  navigationData.forEach((group) => {
    const filteredItems = filterItems(group.items, normalizedQuery, compactQuery);
    if (!filteredItems.length) return;

    const groupItem = document.createElement('li');
    groupItem.className = 'nav-group';

    const header = document.createElement('div');
    header.className = 'nav-group-header';
    if (group.theme) {
      header.classList.add(`theme-${group.theme}`);
    }
    header.textContent = group.section;
    groupItem.appendChild(header);

    const groupList = document.createElement('ul');
    renderEntries(filteredItems, groupList, group.theme, onSelect);
    groupItem.appendChild(groupList);

    targetList.appendChild(groupItem);
  });

  if (!targetList.children.length) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = navigationData.length
      ? 'Geen resultaten gevonden.'
      : 'Navigatie wordt geladen...';
    emptyItem.style.padding = '12px';
    emptyItem.style.color = 'var(--muted)';
    targetList.appendChild(emptyItem);
  }
}

async function loadNavigationData() {
  if (!navList) return;

  renderNavigation('', navList);
  renderNavigation('', tocList, { onSelect: closeTocOverlay });

  try {
    const response = await fetch('navigation-data.json');
    if (!response.ok) {
      throw new Error(`Kon navigatie niet laden: ${response.status}`);
    }

    navigationData = await response.json();
    renderNavigation(navSearch?.value || '', navList);
    renderNavigation(navSearch?.value || '', tocList, { onSelect: closeTocOverlay });
  } catch (error) {
    console.error(error);
    navList.innerHTML = '';
    tocList.innerHTML = '';
    const errorItem = document.createElement('li');
    errorItem.textContent = 'Navigatie kon niet worden geladen.';
    errorItem.style.padding = '12px';
    errorItem.style.color = 'var(--muted)';
    navList.appendChild(errorItem);
    const errorItemOverlay = errorItem.cloneNode(true);
    tocList.appendChild(errorItemOverlay);
  }
}

function openTocOverlay() {
  if (!tocOverlay) return;
  tocOverlay.classList.add('visible');
  tocOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('toc-open');
  renderNavigation(navSearch?.value || '', tocList, { onSelect: closeTocOverlay });
}

function closeTocOverlay() {
  if (!tocOverlay) return;
  tocOverlay.classList.remove('visible');
  tocOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('toc-open');
}

fileInput.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  userProvidedDocument = true;
  setLoadingState('Eigen document wordt geladen...', { showSpinner: true });
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    openPdf(arrayBuffer);
  };
  reader.readAsArrayBuffer(file);
});

manualImportButton?.addEventListener('click', () => {
  fileInput?.click();
});

prevBtn.addEventListener('click', () => changePage(-1));
nextBtn.addEventListener('click', () => changePage(1));
zoomInBtn.addEventListener('click', () => changeZoom(scaleStep));
zoomOutBtn.addEventListener('click', () => changeZoom(-scaleStep));
fitHeightBtn.addEventListener('click', setZoomToFitHeight);
fitWidthBtn.addEventListener('click', setZoomToFitWidth);
resetZoomBtn.addEventListener('click', resetZoom);
toggleViewBtn.addEventListener('click', toggleView);

viewerArea?.addEventListener(
  'wheel',
  (event) => {
    if (!pdfDoc) return;
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -scaleStep : scaleStep;
      changeZoom(delta);
    }
  },
  { passive: false }
);

navSearch?.addEventListener('input', (event) => {
  renderNavigation(event.target.value, navList);
  renderNavigation(event.target.value, tocList, { onSelect: closeTocOverlay });
});

tocToggleBtn?.addEventListener('click', openTocOverlay);
tocCloseBtn?.addEventListener('click', closeTocOverlay);

tocOverlay?.addEventListener('click', (event) => {
  if (event.target === tocOverlay) {
    closeTocOverlay();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && tocOverlay?.classList.contains('visible')) {
    closeTocOverlay();
  }
});

pageInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && pdfDoc) {
    const target = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(target)) {
      goToPage(target);
    }
  }
});

window.addEventListener('resize', () => {
  if (!pdfDoc || !fitMode) return;
  renderPages();
});

loadDefaultPdf();
loadNavigationData();

updatePageStatus();
updateZoomStatus();
updateButtons();
