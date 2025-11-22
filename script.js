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

const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomInput = document.getElementById('zoom-input');
const fitModeBtn = document.getElementById('fit-mode');
const rotateViewBtn = document.getElementById('rotate-view');
const downloadPagesBtn = document.getElementById('download-pages');
const toggleViewBtn = document.getElementById('toggle-view');
const pageStatus = document.getElementById('page-status');
const pageInput = document.getElementById('page-input');
const pageTotal = document.getElementById('page-total');
const viewerArea = document.querySelector('.viewer-area');
const layout = document.querySelector('.layout');
const sidebar = document.querySelector('.sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
const sidebarResizer = document.getElementById('sidebar-resizer');
const sidebarMaximizeBtn = document.getElementById('sidebar-maximize');
const drawingToggleButton = document.getElementById('drawing-toggle-button');
const annotationPanel = document.getElementById('annotation-panel');
const closeAnnotationBtn = document.getElementById('close-annotation');
const strokeSizeInput = document.getElementById('stroke-size');
const toolButtons = Array.from(document.querySelectorAll('.tool-button[data-tool]'));
const undoButton = document.getElementById('tool-undo');
const redoButton = document.getElementById('tool-redo');
const clearButton = document.getElementById('tool-clear');
const clearAllButton = document.getElementById('tool-clear-all');
const colorSwatches = Array.from(document.querySelectorAll('.color-swatch'));
const sidebarOverlay = document.getElementById('sidebar-overlay');

let pdfDoc = null;
let currentPage = 1;
let scale = 1;
let isSpread = false;
let fitMode = null;
let rotation = 0;
let navigationData = [];
let userProvidedDocument = false;
let docKey = 'default';
const minScale = 0.2;
const maxScale = 4;
const scaleStep = 0.15;
const annotations = new Map();
const redoStacks = new Map();
let isAnnotationEnabled = false;
let currentTool = 'pen';
let currentColor = '#e11d48';
let currentStrokeSize = Number.parseInt(strokeSizeInput?.value || '6', 10);
const sidebarMinWidth = 220;
const sidebarMaxWidth = 1200;
const annotationWidth = 360;
const pageStorageKey = 'binas:last-page';
const sidebarWidthKey = 'binas:sidebar-width';
const sidebarCollapsedKey = 'binas:sidebar-collapsed';
const annotationStoragePrefix = 'binas:annotations:';
let defaultSidebarWidth = 0;
let previousSidebarWidth = null;

document.documentElement.style.setProperty('--annotation-width', `${annotationWidth}px`);

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

const fitCombinedIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
    <path d="M8 12H6.75" />
    <path d="M17.25 12H16" />
    <path d="M12 8V6.75" />
    <path d="M12 17.25V16" />
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
  const viewport = page.getViewport({ scale: 1, rotation });
  const { paddingX, gap } = getGridMetrics();
  const columns = isSpread ? 2 : 1;
  const availableWidth = Math.max(120, viewerArea.clientWidth - paddingX - gap * (columns - 1));
  const targetWidth = availableWidth / columns;
  return clampZoom(targetWidth / viewport.width);
}

async function calculateFitHeightScale() {
  if (!pdfDoc || !viewerArea) return scale;
  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale: 1, rotation });
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
  if (!zoomInput) return;
  zoomInput.value = (scale * 100).toFixed(0);
  zoomInput.disabled = !pdfDoc;
}

function updateToggleButtonVisual() {
  if (!toggleViewBtn) return;
  toggleViewBtn.classList.toggle('primary', isSpread);
  const label = isSpread ? "Schakel naar enkele pagina" : 'Schakel naar dubbele pagina';
  toggleViewBtn.innerHTML = isSpread ? spreadIcon : singlePageIcon;
  toggleViewBtn.setAttribute('aria-label', label);
}

function updateButtons() {
  const hasDoc = Boolean(pdfDoc);
  prevBtn.disabled = !hasDoc || currentPage <= 1;
  const maxForNext = isSpread && pdfDoc ? pdfDoc.numPages - 1 : pdfDoc?.numPages ?? 0;
  nextBtn.disabled = !hasDoc || currentPage >= maxForNext;
  zoomInBtn.disabled = !hasDoc || scale >= maxScale;
  zoomOutBtn.disabled = !hasDoc || scale <= minScale;
  zoomInput?.toggleAttribute('disabled', !hasDoc);
  fitModeBtn?.toggleAttribute('disabled', !hasDoc);
  rotateViewBtn?.toggleAttribute('disabled', !hasDoc);
  downloadPagesBtn?.toggleAttribute('disabled', !hasDoc);
  toggleViewBtn.disabled = !hasDoc;
  drawingToggleButton?.toggleAttribute('disabled', !hasDoc);
  updateToggleButtonVisual();
}

function normalizeRotation(value) {
  const normalized = ((value % 360) + 360) % 360;
  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270) {
    return normalized;
  }
  return Math.round(normalized / 90) * 90;
}

function convertViewPointToCanonical(point) {
  const currentRotation = normalizeRotation(rotation);
  if (currentRotation === 90) {
    return { x: point.y, y: 1 - point.x };
  }
  if (currentRotation === 180) {
    return { x: 1 - point.x, y: 1 - point.y };
  }
  if (currentRotation === 270) {
    return { x: 1 - point.y, y: point.x };
  }
  return point;
}

function convertCanonicalToView(point) {
  const currentRotation = normalizeRotation(rotation);
  if (currentRotation === 90) {
    return { x: 1 - point.y, y: point.x };
  }
  if (currentRotation === 180) {
    return { x: 1 - point.x, y: 1 - point.y };
  }
  if (currentRotation === 270) {
    return { x: point.y, y: 1 - point.x };
  }
  return point;
}

function projectPointToCanvas(point, canvas) {
  const viewPoint = convertCanonicalToView(point);
  return { x: viewPoint.x * canvas.width, y: viewPoint.y * canvas.height };
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

let renderCycle = 0;

async function renderPages() {
  if (!pdfDoc) return;

  const cycleId = ++renderCycle;

  if (fitMode === 'width') {
    const nextScale = await calculateFitWidthScale();
    if (cycleId !== renderCycle) return;
    scale = nextScale;
  } else if (fitMode === 'height') {
    const nextScale = await calculateFitHeightScale();
    if (cycleId !== renderCycle) return;
    scale = nextScale;
  }

  const fragment = document.createDocumentFragment();
  const pagesToRender = isSpread
    ? [currentPage, currentPage + 1].filter((pageNumber) => pageNumber && pageNumber <= pdfDoc.numPages)
    : [currentPage];

  const shouldSpread = isSpread && pagesToRender.length > 1;

  for (const pageNumber of pagesToRender) {
    const page = await pdfDoc.getPage(pageNumber);
    if (cycleId !== renderCycle) return;
    const viewport = page.getViewport({ scale, rotation });
    const outputScale = window.devicePixelRatio || 1;
    const displayWidth = viewport.width;
    const displayHeight = viewport.height;

    const canvas = document.createElement('canvas');
    canvas.className = 'page-canvas';
    canvas.width = displayWidth * outputScale;
    canvas.height = displayHeight * outputScale;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const context = canvas.getContext('2d');
    context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

    const renderContext = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;

    const wrapper = document.createElement('div');
    wrapper.className = 'page-wrapper';
    wrapper.appendChild(canvas);
    attachAnnotationLayer(wrapper, pageNumber, displayWidth, displayHeight, outputScale);
    fragment.appendChild(wrapper);
  }

  if (cycleId !== renderCycle) return;

  pageGrid.classList.add('rendering');
  requestAnimationFrame(() => {
    pageGrid.classList.toggle('spread', shouldSpread);
    pageGrid.replaceChildren(...fragment.childNodes);
    pageGrid.classList.remove('rendering');
    updatePageStatus();
    updateZoomStatus();
    updateFitModeButton();
    updateButtons();
    persistCurrentPage();
    refreshAnnotationInteractivity();
  });
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

function updateFitModeButton() {
  if (!fitModeBtn) return;
  const badge = fitMode === 'width' ? 'B' : fitMode === 'height' ? 'H' : '–';
  const label =
    fitMode === 'width'
      ? 'Pas weergave aan op breedte'
      : fitMode === 'height'
      ? 'Pas weergave aan op hoogte'
      : 'Geen automatische aanpassing';
  fitModeBtn.innerHTML = `${fitCombinedIcon}<span class="fit-badge">${badge}</span>`;
  fitModeBtn.classList.toggle('primary', Boolean(fitMode));
  fitModeBtn.setAttribute('data-mode', fitMode || 'none');
  fitModeBtn.setAttribute('aria-label', label);
}

async function applyFitMode(mode) {
  if (!pdfDoc || !viewerArea) {
    fitMode = mode;
    updateFitModeButton();
    return;
  }
  fitMode = mode;
  if (mode === 'width') {
    scale = await calculateFitWidthScale();
  } else if (mode === 'height') {
    scale = await calculateFitHeightScale();
  }
  renderPages();
}

async function setZoomToFitWidth() {
  await applyFitMode('width');
}

async function setZoomToFitHeight() {
  await applyFitMode('height');
}

function cycleFitMode() {
  const nextMode = fitMode === 'width' ? 'height' : fitMode === 'height' ? null : 'width';
  applyFitMode(nextMode);
}

function rotateView() {
  if (!pdfDoc) return;
  rotation = normalizeRotation(rotation + 90);
  renderPages();
}

function downloadVisiblePages() {
  if (!pdfDoc || !pageGrid) return;
  const wrappers = Array.from(pageGrid.querySelectorAll('.page-wrapper'));
  const canvases = wrappers
    .map((wrapper) => ({
      page: wrapper.querySelector('.page-canvas'),
      annotations: wrapper.querySelector('.annotation-layer'),
    }))
    .filter((entry) => entry.page);

  if (!canvases.length) return;

  const gap = canvases.length > 1 ? 24 : 0;
  const totalWidth = canvases.reduce(
    (acc, entry, index) => acc + entry.page.width + (index === canvases.length - 1 ? 0 : gap),
    0
  );
  const maxHeight = Math.max(...canvases.map((entry) => entry.page.height));
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = totalWidth;
  exportCanvas.height = maxHeight;
  const ctx = exportCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  let offsetX = 0;
  canvases.forEach((entry, index) => {
    ctx.drawImage(entry.page, offsetX, 0, entry.page.width, entry.page.height);
    if (entry.annotations) {
      ctx.drawImage(entry.annotations, offsetX, 0, entry.annotations.width, entry.annotations.height);
    }
    offsetX += entry.page.width + (index === canvases.length - 1 ? 0 : gap);
  });

  const endPage = Math.min(currentPage + (isSpread ? canvases.length - 1 : 0), pdfDoc.numPages);
  const rangeLabel = endPage === currentPage ? `${currentPage}` : `${currentPage}-${endPage}`;
  const link = document.createElement('a');
  link.href = exportCanvas.toDataURL('image/png');
  link.download = `binas-pagina-${rangeLabel}.png`;
  link.click();
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
  sidebar?.classList.toggle('wide', clamped >= 640);
  localStorage.setItem(sidebarWidthKey, clamped);
  if (!defaultSidebarWidth) {
    defaultSidebarWidth = clamped;
  }
  updateSidebarSizeButton();
}

function loadSidebarPreferences() {
  const storedWidth = Number(localStorage.getItem(sidebarWidthKey));
  if (!Number.isNaN(storedWidth) && storedWidth >= sidebarMinWidth) {
    setSidebarWidth(storedWidth);
  }
  const currentWidth = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'),
    10
  );
  if (!defaultSidebarWidth) {
    defaultSidebarWidth = currentWidth;
  }
  sidebar?.classList.toggle('wide', currentWidth >= 640);
  const collapsed = localStorage.getItem(sidebarCollapsedKey) === 'true';
  layout?.classList.toggle('sidebar-collapsed', collapsed);
  updateSidebarToggleLabel();
  updateSidebarOverlay();
  updateSidebarSizeButton();
}

const expandSidebarIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 9V5h4" />
    <path d="M19 15v4h-4" />
    <path d="M15 5h4v4" />
    <path d="M9 19H5v-4" />
    <path d="M9 9 5 5" />
    <path d="m15 15 4 4" />
    <path d="M19 5 15 9" />
    <path d="M5 19l4-4" />
  </svg>
`;

const collapseSidebarIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 9V5H5" />
    <path d="M15 15v4h4" />
    <path d="M19 9V5h-4" />
    <path d="M5 15v4h4" />
    <path d="M9 5 5 9" />
    <path d="m15 19 4-4" />
    <path d="M19 9 15 5" />
    <path d="M5 15l4 4" />
  </svg>
`;

function updateSidebarSizeButton() {
  if (!sidebarMaximizeBtn) return;
  const isWide = sidebar?.classList.contains('wide');
  sidebarMaximizeBtn.innerHTML = isWide ? collapseSidebarIcon : expandSidebarIcon;
  sidebarMaximizeBtn.setAttribute('aria-label', isWide ? 'Maak navigatie smaller' : 'Vergroot navigatie');
}

function toggleSidebarSize() {
  const currentWidth = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'),
    10
  );
  const isWide = sidebar?.classList.contains('wide');
  if (isWide) {
    const target = previousSidebarWidth || defaultSidebarWidth || sidebarMinWidth;
    setSidebarWidth(target);
  } else {
    previousSidebarWidth = currentWidth;
    const targetWidth = Math.min(sidebarMaxWidth, Math.max(sidebarMinWidth, window.innerWidth - 80));
    setSidebarWidth(targetWidth);
    toggleSidebar(false);
  }
  updateSidebarSizeButton();
}

function toggleSidebar(forceState) {
  const nextState = typeof forceState === 'boolean' ? forceState : !layout?.classList.contains('sidebar-collapsed');
  layout?.classList.toggle('sidebar-collapsed', nextState);
  localStorage.setItem(sidebarCollapsedKey, nextState);
  updateSidebarToggleLabel();
  updateSidebarOverlay();
}

function updateSidebarToggleLabel() {
  if (!sidebarToggleBtn) return;
  const collapsed = layout?.classList.contains('sidebar-collapsed');
  sidebarToggleBtn.setAttribute('aria-label', collapsed ? 'Open navigatie' : 'Klap navigatie in');
}

function updateSidebarOverlay() {
  if (!sidebarOverlay) return;
  const collapsed = layout?.classList.contains('sidebar-collapsed');
  const active = !collapsed && window.innerWidth < 900;
  sidebarOverlay.classList.toggle('visible', active);
  sidebarOverlay.setAttribute('aria-hidden', active ? 'false' : 'true');
  document.body.classList.toggle('sidebar-open', active);
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

function getRedoStack(pageNumber) {
  if (!redoStacks.has(pageNumber)) {
    redoStacks.set(pageNumber, []);
  }
  return redoStacks.get(pageNumber);
}

function clearRedoStack(pageNumber) {
  redoStacks.set(pageNumber, []);
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
  redoStacks.clear();
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
  const points = stroke.points.map((point) => projectPointToCanvas(point, canvas));
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
  const last = projectPointToCanvas(stroke.points[stroke.points.length - 1], canvas);
  const prev = projectPointToCanvas(stroke.points[stroke.points.length - 2], canvas);
  applyStrokeStyle(ctx, stroke);
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(last.x, last.y);
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

function attachAnnotationLayer(wrapper, pageNumber, width, height, outputScale = 1) {
  const layer = document.createElement('canvas');
  layer.className = 'annotation-layer';
  layer.width = width * outputScale;
  layer.height = height * outputScale;
  layer.style.width = `${width}px`;
  layer.style.height = `${height}px`;
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
    const normalizedPoint = { x: x / layer.width, y: y / layer.height };
    const canonicalPoint = convertViewPointToCanonical(normalizedPoint);
    activeStroke.points.push(canonicalPoint);
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
      clearRedoStack(pageNumber);
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

function updateDrawingUiState() {
  drawingToggleButton?.classList.toggle('active', isAnnotationEnabled);
  drawingToggleButton?.classList.toggle('primary', isAnnotationEnabled);
  drawingToggleButton?.setAttribute('aria-pressed', isAnnotationEnabled ? 'true' : 'false');
  drawingToggleButton?.setAttribute('aria-label', isAnnotationEnabled ? 'Tekenen actief' : 'Schakel tekenen');
  if (annotationPanel) {
    annotationPanel.hidden = !isAnnotationEnabled;
  }
  layout?.classList.toggle('annotation-open', isAnnotationEnabled);
}

function setDrawingEnabled(enabled) {
  isAnnotationEnabled = Boolean(enabled);
  refreshAnnotationInteractivity();
  updateDrawingUiState();
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
  const stroke = pageAnnotations.pop();
  if (stroke) {
    getRedoStack(pageNumber).push(stroke);
  }
  saveAnnotationsForDoc();
  redrawVisibleAnnotations();
}

function redoAnnotation(pageNumber = currentPage) {
  const redoStack = getRedoStack(pageNumber);
  const stroke = redoStack.pop();
  if (stroke) {
    getPageAnnotations(pageNumber).push(stroke);
    saveAnnotationsForDoc();
    redrawVisibleAnnotations();
  }
}

function clearPageAnnotations(pageNumber = currentPage) {
  annotations.set(pageNumber, []);
  clearRedoStack(pageNumber);
  saveAnnotationsForDoc();
  redrawVisibleAnnotations();
}

function clearAllAnnotations() {
  annotations.clear();
  redoStacks.clear();
  try {
    localStorage.removeItem(`${annotationStoragePrefix}${getDocKey()}`);
  } catch (error) {
    console.error('Kon aantekeningen niet wissen', error);
  }
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
  fitMode = 'width';
  rotation = 0;
  setDrawingEnabled(false);
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

  try {
    const response = await fetch('navigation-data.json');
    if (!response.ok) {
      throw new Error(`Kon navigatie niet laden: ${response.status}`);
    }

    navigationData = await response.json();
    renderNavigation(navSearch?.value || '', navList);
  } catch (error) {
    console.error(error);
    navList.innerHTML = '';
    const errorItem = document.createElement('li');
    errorItem.textContent = 'Navigatie kon niet worden geladen.';
    errorItem.style.padding = '12px';
    errorItem.style.color = 'var(--muted)';
    navList.appendChild(errorItem);
  }
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
zoomInput?.addEventListener('change', (event) => {
  if (!pdfDoc) return;
  const value = Number.parseFloat(event.target.value);
  if (Number.isNaN(value)) {
    updateZoomStatus();
    return;
  }
  const nextScale = clampZoom(value / 100);
  fitMode = null;
  scale = nextScale;
  renderPages();
});

zoomInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    zoomInput.dispatchEvent(new Event('change'));
  }
});
fitModeBtn.addEventListener('click', cycleFitMode);
rotateViewBtn.addEventListener('click', rotateView);
downloadPagesBtn.addEventListener('click', downloadVisiblePages);
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
});

sidebarToggleBtn?.addEventListener('click', () => toggleSidebar());
sidebarMaximizeBtn?.addEventListener('click', () => toggleSidebarSize());
sidebarResizer?.addEventListener('pointerdown', startSidebarResize);
sidebarOverlay?.addEventListener('click', () => toggleSidebar(true));

drawingToggleButton?.addEventListener('click', () => setDrawingEnabled(!isAnnotationEnabled));
closeAnnotationBtn?.addEventListener('click', () => setDrawingEnabled(false));

toolButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveTool(button.dataset.tool);
    if (!isAnnotationEnabled) {
      setDrawingEnabled(true);
    }
  });
});

colorSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => setActiveColor(swatch.dataset.color));
});

strokeSizeInput?.addEventListener('input', (event) => {
  currentStrokeSize = Number.parseInt(event.target.value, 10) || currentStrokeSize;
});

undoButton?.addEventListener('click', () => undoAnnotation());
redoButton?.addEventListener('click', () => redoAnnotation());
clearButton?.addEventListener('click', () => clearPageAnnotations());
clearAllButton?.addEventListener('click', () => clearAllAnnotations());

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isAnnotationEnabled) {
    setDrawingEnabled(false);
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

pageInput?.addEventListener('change', (event) => {
  if (!pdfDoc) return;
  const target = Number.parseInt(event.target.value, 10);
  if (!Number.isNaN(target)) {
    goToPage(target);
  }
});

window.addEventListener('resize', () => {
  updateSidebarOverlay();
  if (!pdfDoc || !fitMode) return;
  renderPages();
});

loadSidebarPreferences();
if (window.innerWidth < 900 && localStorage.getItem(sidebarCollapsedKey) === null) {
  toggleSidebar(true);
}
setDrawingEnabled(false);
setActiveTool(currentTool);
setActiveColor(currentColor);

loadDefaultPdf();
loadNavigationData();

updatePageStatus();
updateZoomStatus();
updateFitModeButton();
updateButtons();
