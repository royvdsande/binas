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
const layout = document.querySelector('.layout');
const sidebar = document.querySelector('.sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
const sidebarResizer = document.getElementById('sidebar-resizer');
const annotationToggle = document.getElementById('annotation-toggle');
const annotationMenuToggle = document.getElementById('annotation-menu-toggle');
const annotationMenu = document.getElementById('annotation-menu');
const strokeSizeInput = document.getElementById('stroke-size');
const toolButtons = Array.from(document.querySelectorAll('.tool-button[data-tool]'));
const undoButton = document.getElementById('tool-undo');
const clearButton = document.getElementById('tool-clear');
const colorSwatches = Array.from(document.querySelectorAll('.color-swatch'));

let pdfDoc = null;
let currentPage = 1;
let scale = 1;
let isSpread = false;
let fitMode = null;
let navigationData = [];
let userProvidedDocument = false;
let docKey = 'default';
const minScale = 0.2;
const maxScale = 6;
const scaleStep = 0.15;
const annotations = new Map();
let isAnnotationEnabled = true;
let currentTool = 'pen';
let currentColor = '#e11d48';
let currentStrokeSize = Number.parseInt(strokeSizeInput?.value || '6', 10);
const sidebarMinWidth = 220;
const sidebarMaxWidth = 520;
const pageStorageKey = 'binas:last-page';
const sidebarWidthKey = 'binas:sidebar-width';
const sidebarCollapsedKey = 'binas:sidebar-collapsed';
const annotationStoragePrefix = 'binas:annotations:';

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

function getDocKey() {
  return pdfDoc?.fingerprint || docKey || 'default';
}

function persistCurrentPage() {
  if (!pdfDoc) return;
  const stored = JSON.parse(localStorage.getItem(pageStorageKey) || '{}');
  stored[getDocKey()] = currentPage;
  localStorage.setItem(pageStorageKey, JSON.stringify(stored));
}

function restoreLastPageForDoc() {
  if (!pdfDoc) return;
  const stored = JSON.parse(localStorage.getItem(pageStorageKey) || '{}');
  const savedPage = stored[getDocKey()];
  if (typeof savedPage === 'number' && savedPage >= 1 && savedPage <= pdfDoc.numPages) {
    currentPage = isSpread && savedPage % 2 === 0 ? savedPage - 1 : savedPage;
  }
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
    attachAnnotationLayer(wrapper, pageNumber, viewport.width, viewport.height);
    wrapper.appendChild(label);
    pageGrid.appendChild(wrapper);
  }

  updatePageStatus();
  updateZoomStatus();
  updateButtons();
  persistCurrentPage();
  refreshAnnotationInteractivity();
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

function setSidebarWidth(width) {
  const clamped = Math.min(sidebarMaxWidth, Math.max(sidebarMinWidth, width));
  document.documentElement.style.setProperty('--sidebar-width', `${clamped}px`);
  localStorage.setItem(sidebarWidthKey, clamped);
}

function loadSidebarPreferences() {
  const storedWidth = Number(localStorage.getItem(sidebarWidthKey));
  if (!Number.isNaN(storedWidth) && storedWidth >= sidebarMinWidth) {
    setSidebarWidth(storedWidth);
  }
  const collapsed = localStorage.getItem(sidebarCollapsedKey) === 'true';
  layout?.classList.toggle('sidebar-collapsed', collapsed);
  updateSidebarToggleLabel();
}

function toggleSidebar(forceState) {
  const nextState = typeof forceState === 'boolean' ? forceState : !layout?.classList.contains('sidebar-collapsed');
  layout?.classList.toggle('sidebar-collapsed', nextState);
  localStorage.setItem(sidebarCollapsedKey, nextState);
  updateSidebarToggleLabel();
}

function updateSidebarToggleLabel() {
  if (!sidebarToggleBtn) return;
  const collapsed = layout?.classList.contains('sidebar-collapsed');
  sidebarToggleBtn.setAttribute('aria-label', collapsed ? 'Open navigatie' : 'Klap navigatie in');
}

function startSidebarResize(event) {
  if (layout?.classList.contains('sidebar-collapsed')) return;
  event.preventDefault();
  const startX = event.clientX;
  const currentWidth = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'), 10);

  function onMove(moveEvent) {
    const delta = moveEvent.clientX - startX;
    setSidebarWidth(currentWidth + delta);
  }

  function onUp() {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
  }

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

function getPageAnnotations(pageNumber) {
  if (!annotations.has(pageNumber)) {
    annotations.set(pageNumber, []);
  }
  return annotations.get(pageNumber);
}

function saveAnnotationsForDoc() {
  if (!pdfDoc) return;
  const payload = Object.fromEntries([...annotations.entries()]);
  try {
    localStorage.setItem(`${annotationStoragePrefix}${getDocKey()}`, JSON.stringify(payload));
  } catch (error) {
    console.error('Opslaan van aantekeningen mislukt', error);
  }
}

function loadAnnotationsForDoc() {
  annotations.clear();
  if (!pdfDoc) return;
  try {
    const stored = localStorage.getItem(`${annotationStoragePrefix}${getDocKey()}`);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([page, strokes]) => {
      annotations.set(Number(page), strokes);
    });
  } catch (error) {
    console.error('Kan aantekeningen niet lezen', error);
  }
}

function applyStrokeStyle(ctx, stroke) {
  ctx.lineWidth = stroke.size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke.color;
  ctx.globalAlpha = stroke.tool === 'highlighter' ? 0.45 : 1;
  ctx.globalCompositeOperation = stroke.mode === 'erase' ? 'destination-out' : 'source-over';
}

function drawStroke(ctx, stroke, canvas) {
  if (!stroke?.points?.length) return;
  applyStrokeStyle(ctx, stroke);
  const points = stroke.points.map((point) => ({
    x: point.x * canvas.width,
    y: point.y * canvas.height,
  }));
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  if (points.length === 1) {
    ctx.lineTo(points[0].x + 0.1, points[0].y + 0.1);
  }
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

function drawStrokeSegment(ctx, stroke, canvas) {
  if (!stroke?.points || stroke.points.length < 2) return;
  const last = stroke.points[stroke.points.length - 1];
  const prev = stroke.points[stroke.points.length - 2];
  applyStrokeStyle(ctx, stroke);
  ctx.beginPath();
  ctx.moveTo(prev.x * canvas.width, prev.y * canvas.height);
  ctx.lineTo(last.x * canvas.width, last.y * canvas.height);
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

function redrawPageAnnotations(pageNumber, canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const strokes = annotations.get(pageNumber) || [];
  strokes.forEach((stroke) => drawStroke(ctx, stroke, canvas));
}

function redrawVisibleAnnotations() {
  document.querySelectorAll('.annotation-layer').forEach((layer) => {
    const page = Number(layer.dataset.page);
    redrawPageAnnotations(page, layer);
  });
}

function attachAnnotationLayer(wrapper, pageNumber, width, height) {
  const layer = document.createElement('canvas');
  layer.className = 'annotation-layer';
  layer.width = width;
  layer.height = height;
  layer.dataset.page = pageNumber;
  wrapper.appendChild(layer);
  redrawPageAnnotations(pageNumber, layer);

  let drawing = false;
  let activeStroke = null;

  const getPoint = (event) => {
    const rect = layer.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * layer.width) / rect.width;
    const y = ((event.clientY - rect.top) * layer.height) / rect.height;
    return { x, y };
  };

  function addPoint(event) {
    if (!drawing || !activeStroke) return;
    const { x, y } = getPoint(event);
    activeStroke.points.push({ x: x / layer.width, y: y / layer.height });
    const ctx = layer.getContext('2d');
    if (activeStroke.points.length === 1) {
      drawStroke(ctx, activeStroke, layer);
    } else {
      drawStrokeSegment(ctx, activeStroke, layer);
    }
  }

  layer.addEventListener('pointerdown', (event) => {
    if (!isAnnotationEnabled) return;
    drawing = true;
    activeStroke = {
      tool: currentTool,
      mode: currentTool === 'eraser' ? 'erase' : 'draw',
      color: currentColor,
      size: currentStrokeSize,
      points: [],
    };
    addPoint(event);
    layer.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  layer.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    addPoint(event);
    event.preventDefault();
  });

  layer.addEventListener('pointerup', (event) => {
    if (drawing && activeStroke?.points?.length) {
      const pageAnnotations = getPageAnnotations(pageNumber);
      pageAnnotations.push(activeStroke);
      saveAnnotationsForDoc();
    }
    if (layer.hasPointerCapture(event.pointerId)) {
      layer.releasePointerCapture(event.pointerId);
    }
    drawing = false;
    activeStroke = null;
  });

  layer.addEventListener('pointercancel', (event) => {
    if (layer.hasPointerCapture(event.pointerId)) {
      layer.releasePointerCapture(event.pointerId);
    }
    drawing = false;
    activeStroke = null;
  });
}

function refreshAnnotationInteractivity() {
  document.body.classList.toggle('annotations-disabled', !isAnnotationEnabled);
  document.querySelectorAll('.annotation-layer').forEach((layer) => {
    layer.style.pointerEvents = isAnnotationEnabled ? 'auto' : 'none';
    layer.style.touchAction = isAnnotationEnabled ? 'none' : 'auto';
  });
}

function closeAnnotationMenu() {
  if (!annotationMenu || !annotationMenuToggle) return;
  annotationMenu.hidden = true;
  annotationMenu.classList.remove('open');
  annotationMenuToggle.setAttribute('aria-expanded', 'false');
}

function toggleAnnotationMenu() {
  if (!annotationMenu || !annotationMenuToggle) return;
  const willOpen = annotationMenu.hidden;
  annotationMenu.hidden = !willOpen;
  annotationMenu.classList.toggle('open', willOpen);
  annotationMenuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

function setActiveTool(tool) {
  currentTool = tool;
  toolButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tool === tool);
  });
}

function setActiveColor(color) {
  currentColor = color;
  colorSwatches.forEach((swatch) => {
    swatch.classList.toggle('active', swatch.dataset.color === color);
  });
}

function undoAnnotation(pageNumber = currentPage) {
  const pageAnnotations = getPageAnnotations(pageNumber);
  pageAnnotations.pop();
  saveAnnotationsForDoc();
  redrawVisibleAnnotations();
}

function clearPageAnnotations(pageNumber = currentPage) {
  annotations.set(pageNumber, []);
  saveAnnotationsForDoc();
  redrawVisibleAnnotations();
}

async function openPdf(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  pdfDoc = await loadingTask.promise;
  docKey = getDocKey();
  loadAnnotationsForDoc();
  currentPage = 1;
  restoreLastPageForDoc();
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

sidebarToggleBtn?.addEventListener('click', () => toggleSidebar());
sidebarResizer?.addEventListener('pointerdown', startSidebarResize);

annotationMenuToggle?.addEventListener('click', () => toggleAnnotationMenu());

document.addEventListener('click', (event) => {
  if (!annotationMenu || !annotationMenuToggle) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (annotationMenu.hidden) return;
  if (annotationMenu.contains(target) || annotationMenuToggle.contains(target)) return;
  closeAnnotationMenu();
});

annotationToggle?.addEventListener('change', (event) => {
  isAnnotationEnabled = event.target.checked;
  refreshAnnotationInteractivity();
});

toolButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveTool(button.dataset.tool));
});

colorSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => setActiveColor(swatch.dataset.color));
});

strokeSizeInput?.addEventListener('input', (event) => {
  currentStrokeSize = Number.parseInt(event.target.value, 10) || currentStrokeSize;
});

undoButton?.addEventListener('click', () => undoAnnotation());
clearButton?.addEventListener('click', () => clearPageAnnotations());

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (tocOverlay?.classList.contains('visible')) {
      closeTocOverlay();
    }
    if (!annotationMenu?.hidden) {
      closeAnnotationMenu();
    }
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

loadSidebarPreferences();
if (window.innerWidth < 900 && localStorage.getItem(sidebarCollapsedKey) === null) {
  toggleSidebar(true);
}
setActiveTool(currentTool);
setActiveColor(currentColor);
if (annotationToggle) {
  annotationToggle.checked = isAnnotationEnabled;
}
refreshAnnotationInteractivity();

loadDefaultPdf();
loadNavigationData();

updatePageStatus();
updateZoomStatus();
updateButtons();
