/**
 * ECOSISTEMA DIGITAL MERCADO LA HERMELINDA
 * Prototipo de Interfaces Móviles de Alta Fidelidad
 * Grupo 4 - UPAO | Taller de Creatividad, Innovación y Emprendimiento
 */

// Global State
let currentRole = 'mayorista'; // 'mayorista' | 'minorista'
let currentScreenIndex = 0;
let isHighContrast = false;

// Mock Inventory Data for interactive live demo
let inventoryState = {
  canchan: { disponible: 180, reservado: 40, total: 220, precio: 72 },
  amarilla: { disponible: 65, reservado: 10, total: 75, precio: 94 },
  camote: { disponible: 110, reservado: 0, total: 110, precio: 45 }
};

const productLabels = {
  canchan: 'Papa Canchán',
  amarilla: 'Papa Amarilla',
  camote: 'Camote Amarillo'
};

// Estado de la venta rápida (M-3) y la calificación (C-4)
let selectedQuickProductKey = 'canchan';
let quickSaleQty = 2;
let stallRating = 5;

// SVG QR Generator for offline ticket & scanner
function generateSVGQR(text) {
  return `<svg class="ticket-qr-img" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Código QR ${text}">
    <rect x="5" y="5" width="28" height="28" rx="4" fill="#000" />
    <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
    <rect x="13" y="13" width="12" height="12" rx="2" fill="#047857" />
    <rect x="67" y="5" width="28" height="28" rx="4" fill="#000" />
    <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
    <rect x="75" y="13" width="12" height="12" rx="2" fill="#047857" />
    <rect x="5" y="67" width="28" height="28" rx="4" fill="#000" />
    <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
    <rect x="13" y="75" width="12" height="12" rx="2" fill="#047857" />
    <rect x="38" y="10" width="6" height="6" fill="#000" />
    <rect x="48" y="8" width="8" height="6" fill="#000" />
    <rect x="40" y="22" width="6" height="8" fill="#000" />
    <rect x="52" y="20" width="6" height="6" fill="#000" />
    <rect x="10" y="38" width="6" height="6" fill="#000" />
    <rect x="22" y="42" width="8" height="6" fill="#000" />
    <rect x="38" y="38" width="12" height="12" rx="3" fill="#047857" />
    <rect x="54" y="36" width="6" height="10" fill="#000" />
    <rect x="68" y="40" width="8" height="6" fill="#000" />
    <rect x="82" y="42" width="6" height="6" fill="#000" />
    <rect x="40" y="56" width="8" height="6" fill="#000" />
    <rect x="54" y="52" width="8" height="8" fill="#000" />
    <rect x="70" y="56" width="6" height="6" fill="#000" />
    <rect x="84" y="54" width="8" height="6" fill="#000" />
    <rect x="38" y="72" width="6" height="8" fill="#000" />
    <rect x="48" y="68" width="10" height="6" fill="#000" />
    <rect x="64" y="72" width="8" height="6" fill="#000" />
    <rect x="78" y="70" width="6" height="10" fill="#000" />
    <rect x="42" y="84" width="8" height="6" fill="#000" />
    <rect x="56" y="82" width="6" height="8" fill="#000" />
    <rect x="72" y="86" width="8" height="6" fill="#000" />
    <rect x="86" y="82" width="6" height="8" fill="#000" />
  </svg>`;
}

// Barra de estado del celular (reutilizada en galería y modal de captura)
function statusBarHTML() {
  return `
    <div class="phone-status-bar">
      <span class="status-time">04:30</span>
      <div class="status-icons">
        <span class="offline-dot" title="Red local del galpón (funciona sin internet)"><i class="fa-solid fa-tower-broadcast"></i></span>
        <i class="fa-solid fa-signal"></i>
        <i class="fa-solid fa-wifi"></i>
        <i class="fa-solid fa-battery-three-quarters"></i>
      </div>
    </div>`;
}

// Tarjeta de producto del inventario (M-2)
function stockCardHTML(key, emoji, name, meta, steps) {
  const item = inventoryState[key];
  const buttons = steps.map(step => {
    const sign = step > 0 ? '+' : '−';
    const verb = step > 0 ? 'Sumar' : 'Restar';
    return `<button class="step-btn ${step < 0 ? 'minus' : ''}" onclick="adjustStock('${key}', ${step})" aria-label="${verb} ${Math.abs(step)} sacos de ${name}">${sign}${Math.abs(step)}</button>`;
  }).join('');

  return `
    <div class="ph-card stock-card">
      <div class="stock-card-top">
        <span class="stock-emoji" aria-hidden="true">${emoji}</span>
        <div>
          <div class="stock-name">${name}</div>
          <div class="stock-category">${meta}</div>
        </div>
      </div>
      <div class="stock-figures">
        <div class="stat-item">
          <span class="stat-sub">Libres</span>
          <span class="stat-val disponible" id="val-${key}-disp">${item.disponible}</span>
        </div>
        <div class="stat-item">
          <span class="stat-sub">En turnos</span>
          <span class="stat-val reservado">${item.reservado}</span>
        </div>
      </div>
      <div class="stock-stepper-row">${buttons}</div>
    </div>`;
}

function totalLibres() {
  return Object.values(inventoryState).reduce((acc, it) => acc + it.disponible, 0);
}

function totalReservados() {
  return Object.values(inventoryState).reduce((acc, it) => acc + it.reservado, 0);
}

function quickChipHTML(key) {
  const selected = selectedQuickProductKey === key;
  return `
    <button class="chip-btn ${selected ? 'selected' : ''}" id="chip-${key}" onclick="selectQuickProduct('${key}')" aria-pressed="${selected}">
      <span class="chip-check"><i class="fa-solid fa-check"></i></span>
      <span class="chip-name">${productLabels[key]}</span>
      <small>${inventoryState[key].disponible} sacos libres</small>
    </button>`;
}

function starsHTML() {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<button class="star-btn ${i <= stallRating ? 'on' : 'off'}" onclick="rateStall(${i})" aria-label="Calificar con ${i} estrella${i > 1 ? 's' : ''}"><i class="fa-solid fa-star"></i></button>`;
  }
  return html;
}

// SCREENS DATABASE
const screensData = {
  mayorista: [
    {
      id: 'm1',
      title: 'Semáforo y Turnos de Despacho',
      tag: 'Principal',
      code: 'H-01 / H-06',
      rationale: 'Funciona exclusivamente como un "semáforo logístico" de rampa. Muestra el estado del pasillo frente al puesto (Verde/Libre) y organiza los camiones por turno sin colisiones vehiculares.',
      quote: '"Acomoda tu camioneta más allá que no dejas pasar al resto... Necesitamos turnos claros para que el pasadizo fluya."',
      author: 'Mayorista de Tubérculos, Galpón 1 (Informe Pág. 16)',
      kpis: ['< 5 min', '< 10 seg', '0%', '100%'],
      labels: ['Tiempo de Despacho', 'Venta Rápida', 'Comisiones (Sin SUNAT)', 'QR Offline'],
      tags: ['H-01 Caos Vehicular', 'Semáforo Rampa', 'Cola Virtual'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon"><i class="fa-solid fa-store"></i></div>
            <div class="m-header-text">
              <strong>Distribuidora Don Pepe</strong>
              <span>Puesto 104 &bull; Pasaje 12</span>
            </div>
            <span class="m-header-badge"><i class="fa-solid fa-door-open"></i> Puerta 8</span>
          </header>

          <div class="semaforo-banner" role="status">
            <span class="semaforo-light" aria-hidden="true"></span>
            <div class="semaforo-content">
              <strong>RAMPA LIBRE</strong>
              <span>Pasaje 12 despejado &bull; Turno 05:00 – 05:20 AM</span>
            </div>
          </div>

          <section class="ph-card">
            <div class="ph-row">
              <span class="ph-chip warn"><i class="fa-solid fa-truck-ramp-box"></i> En rampa</span>
              <span class="ph-timer"><i class="fa-regular fa-clock"></i> Faltan 8 min</span>
            </div>
            <div class="truck-meta">
              <div class="truck-icon"><i class="fa-solid fa-truck-pickup"></i></div>
              <div class="truck-text">
                <h4>Minimarket El Sol</h4>
                <p>Carlos Mendoza <span class="plate-badge">T4B-821</span></p>
              </div>
            </div>
            <ul class="ph-list">
              <li><span>Papa Canchán</span><strong>30 sacos</strong></li>
              <li><span>Papa Amarilla</span><strong>10 sacos</strong></li>
            </ul>
            <button class="m-btn-primary" onclick="jumpToScreen('mayorista', 3)">
              <i class="fa-solid fa-qrcode"></i> Escanear QR y despachar
            </button>
          </section>

          <div class="m-section-title">
            <span>Próximos turnos</span>
            <span class="ph-chip info">2 en espera</span>
          </div>

          <div class="turn-queue-list">
            <div class="queue-item">
              <span class="queue-time">05:20<small>AM</small></span>
              <div class="queue-buyer">
                <strong>Bodega El Porvenir</strong>
                <small>Fuso Canter &bull; M3E-914</small>
              </div>
              <span class="queue-qty">60<small>sacos</small></span>
            </div>
            <div class="queue-item">
              <span class="queue-time">05:40<small>AM</small></span>
              <div class="queue-buyer">
                <strong>Minimarket San Andrés</strong>
                <small>Hyundai H100 &bull; P2X-451</small>
              </div>
              <span class="queue-qty">25<small>sacos</small></span>
            </div>
          </div>

          <div class="wholesaler-quick-bar">
            <button class="quick-sale-pill" onclick="jumpToScreen('mayorista', 2)">
              <i class="fa-solid fa-bolt-lightning"></i> Venta rápida <small>(&lt; 10 s)</small>
            </button>
            <button class="m-icon-btn is-lg" onclick="jumpToScreen('mayorista', 1)" title="Ver stock" aria-label="Ver stock del puesto">
              <i class="fa-solid fa-boxes-stacked"></i>
            </button>
          </div>
        </div>
      `
    },
    {
      id: 'm2',
      title: 'Control Rápido de Stock',
      tag: 'Inventario',
      code: 'H-02 / H-03',
      rationale: 'Elimina el cuaderno con tachaduras de las madrugadas. Botones gigantes táctiles (>48px) pensados para manos con guantes o sucias en el galpón. Separa stock disponible vs reservado.',
      quote: '"El cuaderno se me mancha y con la prisa de las 4 AM no sé cuántos sacos me quedan en la trastienda."',
      author: 'Comerciante Mayorista (Informe Pág. 17)',
      kpis: ['355 sacos', '0 descuadres', '2 toques', '100% offline'],
      labels: ['Stock Total Puesto', 'Margen de Error', 'Ajuste de Carga', 'Sincronización Local'],
      tags: ['H-02 Cuadernos Fuera', 'H-03 Manos Ocupadas', 'Botones Gigantes'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
            <div class="m-header-text">
              <strong>Inventario del puesto</strong>
              <span>Puesto 104 &bull; Actualizado 04:32 AM</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('mayorista', 0)" title="Volver" aria-label="Volver al semáforo">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </header>

          <div class="stock-summary">
            <div class="summary-tile ok">
              <span>Sacos libres</span>
              <strong id="val-total-libres">${totalLibres()}</strong>
            </div>
            <div class="summary-tile warn">
              <span>Reservados</span>
              <strong>${totalReservados()}</strong>
            </div>
          </div>

          <div class="stock-grid">
            ${stockCardHTML('canchan', '🥔', 'Papa Canchán Seleccionada', 'Saco de 50 kg', [-10, -1, 10, 50])}
            ${stockCardHTML('amarilla', '🥔', 'Papa Amarilla Tumbay', 'Saco de 45 kg &bull; Primera calidad', [-5, -1, 5, 20])}
            ${stockCardHTML('camote', '🍠', 'Camote Amarillo Dulce', 'Saco de 50 kg', [-10, -1, 10, 50])}
          </div>

          <button class="m-btn-primary push-bottom" onclick="showToast('✅ Entrada de camión proveedor registrada: +120 sacos');">
            <i class="fa-solid fa-truck-moving"></i> Registrar descarga de proveedor
          </button>
        </div>
      `
    },
    {
      id: 'm3',
      title: 'Modal de Venta Rápida (< 10s)',
      tag: 'Venta de Mostrador',
      code: 'H-03 / H-06',
      rationale: 'Resuelve la necesidad crítica del mayorista de atender al cliente de a pie que compra 1 o 2 sacos en efectivo o Yape sin interrumpir el turno del camión grande ni pedir datos tributarios.',
      quote: '"Si viene un casero a pie por dos sacos no puedo abrir un formulario de 10 campos. En dos toques tiene que salir."',
      author: 'Guía de Entrevistas a Mayoristas (Informe Pág. 31)',
      kpis: ['3.2 seg', '2 toques', 'S/. Efectivo/Yape', 'Cero SUNAT'],
      labels: ['Tiempo Promedio', 'Pasos Requeridos', 'Cobro Físico', 'Libertad Financiera'],
      tags: ['H-06 Venta Rápida', 'Sin Pasarela', 'Ultra Veloz'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon is-warn"><i class="fa-solid fa-bolt-lightning"></i></div>
            <div class="m-header-text">
              <strong>Venta rápida al paso</strong>
              <span>Cliente de mostrador &bull; Cobro directo</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('mayorista', 0)" title="Cerrar" aria-label="Cerrar venta rápida">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div class="quick-timer-card">
            <div>
              <strong><i class="fa-solid fa-stopwatch"></i> Tiempo de registro</strong>
              <small>Meta: menos de 10 segundos</small>
            </div>
            <span class="speed-timer" id="quick-sale-clock">00:03.4</span>
          </div>

          <div class="m-section-title"><span>1 &bull; Producto</span></div>
          <div class="quick-select-chips">
            ${quickChipHTML('canchan')}
            ${quickChipHTML('amarilla')}
          </div>

          <div class="m-section-title"><span>2 &bull; Cantidad de sacos</span></div>
          <div class="quick-qty-selector">
            <button class="step-btn minus" onclick="changeQuickQty(-1)" aria-label="Quitar un saco">−1</button>
            <div class="qty-center">
              <span class="qty-display" id="quick-qty-num">${quickSaleQty}</span>
              <span class="qty-unit">sacos</span>
            </div>
            <button class="step-btn" onclick="changeQuickQty(1)" aria-label="Agregar un saco">+1</button>
          </div>

          <div class="ph-note warn">
            <i class="fa-solid fa-shield-halved"></i>
            <p><strong>Sin cobros en la app.</strong> Cobra en efectivo o Yape como siempre; aquí solo se descuenta el stock. No se emiten comprobantes.</p>
          </div>

          <button class="m-btn-warning push-bottom" onclick="executeQuickSale()">
            <i class="fa-solid fa-check"></i> <span>Confirmar salida (−<span id="quick-confirm-qty">${quickSaleQty}</span> sacos)</span>
          </button>
        </div>
      `
    },
    {
      id: 'm4',
      title: 'Escáner QR de Turno en Rampa',
      tag: 'Operación en Rampa',
      code: 'H-03 / H-05',
      rationale: 'Permite al mayorista o estibador validar la identidad y carga del minorista en menos de 5 segundos, incluso sin conexión a internet en el galpón.',
      quote: '"El estibador no sabe a quién entregarle cuando hay 10 camionetas parecidas. El escáner le confirma exactamente la carga y placa."',
      author: 'Entrevista a Estibadores y Choferes (Informe Pág. 32)',
      kpis: ['1.8 seg', 'Offline', 'Firma QR', '0 Errores'],
      labels: ['Tiempo de Escaneo', 'Conectividad Requerida', 'Seguridad de Turno', 'Errores de Carga'],
      tags: ['H-05 Offline', 'Escáner Ultrarrápido', 'Validación Camión'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon"><i class="fa-solid fa-qrcode"></i></div>
            <div class="m-header-text">
              <strong>Escáner de despacho</strong>
              <span>Cámara activa &bull; Funciona sin internet</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('mayorista', 0)" title="Volver" aria-label="Volver al semáforo">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </header>

          <div class="camera-scanner-view">
            <div class="scan-frame">
              <span class="scan-corner tl"></span>
              <span class="scan-corner tr"></span>
              <span class="scan-corner bl"></span>
              <span class="scan-corner br"></span>
              <div class="scan-mock-qr">${generateSVGQR('TURNO-402-CARLOS-MENDOZA')}</div>
              <div class="scan-laser"></div>
            </div>
            <span class="scan-hint"><i class="fa-solid fa-camera"></i> Apunta al QR del comprador</span>
          </div>

          <section class="ph-card scan-detected-card">
            <div class="ph-row">
              <span class="ph-chip ok"><i class="fa-solid fa-circle-check"></i> Turno válido #402</span>
              <span class="plate-badge">T4B-821</span>
            </div>
            <div>
              <strong class="scan-buyer">Carlos Mendoza</strong>
              <span class="scan-sub">Minimarket El Sol &bull; Toyota Hilux</span>
            </div>
            <ul class="ph-list">
              <li><span>Papa Canchán</span><strong>30 sacos</strong></li>
              <li><span>Papa Amarilla</span><strong>10 sacos</strong></li>
            </ul>
            <button class="m-btn-primary" onclick="jumpToScreen('mayorista', 4)">
              <i class="fa-solid fa-check-double"></i> Confirmar despacho (−40 sacos)
            </button>
          </section>
        </div>
      `
    },
    {
      id: 'm5',
      title: 'Confirmación y Descuento Automático',
      tag: 'Cierre de Despacho',
      code: 'H-01 / H-02',
      rationale: 'Cierra el ciclo del despacho en 3m 42s (meta del MVP: < 5 min). Descuenta automáticamente el stock del puesto y cambia el semáforo para el siguiente camión.',
      quote: '"La meta de despacho en rampa es menos de 5 minutos desde que muestra el QR hasta que el vehículo queda cargado."',
      author: 'Indicadores de Impacto Proyectado (Informe Pág. 23)',
      kpis: ['3m 42s', '-40 sacos', 'Rampa Libre', 'Siguiente Turno'],
      labels: ['Tiempo Total Despacho', 'Descuento Inventario', 'Semáforo Actualizado', '05:20 AM Fuso'],
      tags: ['Meta < 5 min', 'Descuento Automático', 'Rampa Liberada'],
      render: () => `
        <div class="m-screen">
          <div class="success-screen-box">
            <div class="success-icon-ring"><i class="fa-solid fa-check"></i></div>
            <h3 class="success-title">¡Despacho completado!</h3>
            <span class="ph-chip ok"><i class="fa-solid fa-stopwatch"></i> 3 min 42 s &bull; Meta &lt; 5 min</span>
          </div>

          <section class="ph-card success-receipt">
            <div class="receipt-line">
              <span>Comprador</span>
              <strong>Carlos Mendoza<small>Minimarket El Sol</small></strong>
            </div>
            <div class="receipt-line">
              <span>Vehículo</span>
              <strong>Toyota Hilux &bull; T4B-821</strong>
            </div>
            <div class="receipt-line">
              <span>Despachado</span>
              <strong>40 sacos</strong>
            </div>
            <div class="receipt-line">
              <span>Descuento de stock</span>
              <strong class="ok">−30 Canchán<br>−10 Amarilla</strong>
            </div>
          </section>

          <div class="semaforo-banner compact" role="status">
            <span class="semaforo-light" aria-hidden="true"></span>
            <div class="semaforo-content">
              <strong>RAMPA LIBERADA</strong>
              <span>Siguiente: 05:20 AM &bull; Bodega El Porvenir</span>
            </div>
          </div>

          <p class="ph-caption">El comprador ya tiene pase de salida por Puerta 8.</p>

          <button class="m-btn-primary push-bottom" onclick="jumpToScreen('mayorista', 0)">
            <i class="fa-solid fa-arrow-left"></i> Volver al semáforo
          </button>
        </div>
      `
    }
  ],

  minorista: [
    {
      id: 'c1',
      title: 'Catálogo Mayorista y Stock en Tiempo Real',
      tag: 'Búsqueda de Stock',
      code: 'H-01 / H-02',
      rationale: 'Permite al comprador bodeguero (Carlos Mendoza) consultar la disponibilidad y precios de sacos de antemano a las 4:00 AM, sin tener que caminar a tientas en el barro o perder tiempo buscando.',
      quote: '"Llegar al mercado a las 4:30 AM y descubrir que el mayorista ya no tiene stock después de hacer cola es lo que más me frustra."',
      author: 'Carlos Mendoza, Comprador Minorista (Customer Journey, Pág. 20)',
      kpis: ['180 sacos', '04:00 AM', 'Puerta 8', 'S/. 72/saco'],
      labels: ['Stock Papa Canchán', 'Última Actualización', 'Acceso Óptimo', 'Precio Referencial'],
      tags: ['Fase 2 Journey', 'Stock Real', 'Cero Quiebres'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon is-info"><i class="fa-solid fa-basket-shopping"></i></div>
            <div class="m-header-text">
              <strong>Mercado La Hermelinda</strong>
              <span>Modo comprador &bull; Sector Tubérculos</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('minorista', 3)" title="Mis ahorros" aria-label="Ver mis ahorros">
              <i class="fa-solid fa-user"></i>
            </button>
          </header>

          <label class="search-bar-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" value="Papa Canchán / Amarilla" placeholder="Buscar producto o puesto" aria-label="Buscar producto o puesto">
            <i class="fa-solid fa-sliders"></i>
          </label>

          <div class="filter-pills-row">
            <button class="filter-pill active">🥔 Tubérculos</button>
            <button class="filter-pill">🧅 Hortalizas</button>
            <button class="filter-pill">🍎 Frutas</button>
          </div>

          <p class="ph-caption left"><i class="fa-solid fa-circle-check"></i> Stock confirmado por los puestos a las 04:00 AM</p>

          <section class="ph-card is-selected">
            <div class="catalog-card-header">
              <div>
                <div class="catalog-stall-name">Distribuidora Don Pepe</div>
                <div class="catalog-location">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>Puesto 104 &bull; Pasaje 12 &bull; Ingreso por Puerta 8</span>
                </div>
              </div>
              <span class="ph-chip ok">Rampa libre</span>
            </div>

            <div class="product-item-row">
              <div class="product-name">
                <strong>🥔 Papa Canchán</strong>
                <small>Saco de 50 kg</small>
              </div>
              <div class="product-stock">
                <strong>${inventoryState.canchan.disponible} sacos</strong>
                <small>S/ 72.00 c/u</small>
              </div>
            </div>

            <div class="product-item-row">
              <div class="product-name">
                <strong>🥔 Papa Amarilla Tumbay</strong>
                <small>Saco de 45 kg</small>
              </div>
              <div class="product-stock">
                <strong>${inventoryState.amarilla.disponible} sacos</strong>
                <small>S/ 94.00 c/u</small>
              </div>
            </div>

            <button class="m-btn-primary" onclick="jumpToScreen('minorista', 1)">
              <i class="fa-solid fa-calendar-check"></i> Reservar y elegir turno
            </button>
          </section>

          <section class="ph-card">
            <div class="catalog-card-header">
              <div>
                <div class="catalog-stall-name">Comercial Los Andes</div>
                <div class="catalog-location">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>Puesto 118 &bull; Pasaje 14 &bull; Ingreso por Puerta 6</span>
                </div>
              </div>
              <span class="ph-chip warn">Rampa ocupada</span>
            </div>
            <div class="product-item-row">
              <div class="product-name">
                <strong>🥔 Papa Canchán</strong>
                <small>Saco de 50 kg</small>
              </div>
              <div class="product-stock">
                <strong>45 sacos</strong>
                <small>S/ 70.00 c/u</small>
              </div>
            </div>
          </section>
        </div>
      `
    },
    {
      id: 'c2',
      title: 'Reserva de Carga y Slot Horario de Recojo',
      tag: 'Turno Virtual',
      code: 'H-01 / H-04',
      rationale: 'Asigna al vehículo una ventana de 20 minutos (05:00 - 05:20 AM) para evitar colapsar los pasillos. Excluye deliberadamente pasarelas de pago para respetar los cobros tradicionales en efectivo/Yape.',
      quote: '"Si hubiera una forma de asegurar mi turno para recoger las cosas sin hacer cola de 2 horas con la camioneta, me ahorraría medio día de trabajo."',
      author: 'Entrevista a Minoristas (Informe Pág. 32)',
      kpis: ['05:00 AM', '20 min', 'T4B-821', 'S/. 0 Comisiones'],
      labels: ['Franja Horaria', 'Ventana de Rampa', 'Placa Registrada', 'Cero Costo Extra'],
      tags: ['H-01 Turnos Virtuales', 'H-04 Sin Comisiones', 'Slot 20 Min'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon"><i class="fa-solid fa-calendar-days"></i></div>
            <div class="m-header-text">
              <strong>Reserva de turno</strong>
              <span>Distribuidora Don Pepe &bull; Puesto 104</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('minorista', 0)" title="Volver" aria-label="Volver al catálogo">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </header>

          <section class="ph-card">
            <div class="ph-row">
              <span class="ph-card-title">Mercadería a recoger</span>
              <span class="ph-chip ok">40 sacos</span>
            </div>
            <ul class="ph-list">
              <li><span>Papa Canchán<small>Saco de 50 kg</small></span><strong>30</strong></li>
              <li><span>Papa Amarilla<small>Saco de 45 kg</small></span><strong>10</strong></li>
            </ul>
            <div class="ph-divider"></div>
            <div class="vehicle-row">
              <div class="truck-icon"><i class="fa-solid fa-truck-pickup"></i></div>
              <div class="vehicle-row-text">
                <small>Vehículo declarado</small>
                <strong>Toyota Hilux blanca</strong>
              </div>
              <span class="plate-badge">T4B-821</span>
            </div>
          </section>

          <div class="m-section-title">
            <span>Franja de ingreso</span>
            <span class="hint">Ventanas de 20 min</span>
          </div>

          <div class="slot-grid" role="radiogroup" aria-label="Franja horaria de ingreso">
            <div class="slot-card" onclick="selectSlot(this)" role="radio" aria-checked="false" tabindex="0">
              <div class="slot-info">
                <div class="slot-time-row"><span class="slot-time">04:40 – 05:00 AM</span></div>
                <span class="slot-congestion warn"><i class="fa-solid fa-triangle-exclamation"></i> Congestión moderada en Puerta 8</span>
              </div>
              <span class="slot-radio"></span>
            </div>

            <div class="slot-card selected" onclick="selectSlot(this)" role="radio" aria-checked="true" tabindex="0">
              <div class="slot-info">
                <div class="slot-time-row">
                  <span class="slot-time">05:00 – 05:20 AM</span>
                  <span class="ph-chip ok">Recomendado</span>
                </div>
                <span class="slot-congestion ok"><i class="fa-solid fa-circle-check"></i> Rampa libre y pasillo despejado</span>
              </div>
              <span class="slot-radio"></span>
            </div>

            <div class="slot-card" onclick="selectSlot(this)" role="radio" aria-checked="false" tabindex="0">
              <div class="slot-info">
                <div class="slot-time-row"><span class="slot-time">05:20 – 05:40 AM</span></div>
                <span class="slot-congestion info"><i class="fa-solid fa-clock"></i> 2 camionetas en cola</span>
              </div>
              <span class="slot-radio"></span>
            </div>
          </div>

          <div class="ph-note ok">
            <i class="fa-solid fa-handshake"></i>
            <p><strong>Pago al recoger:</strong> pagas a Don Pepe en efectivo o Yape al recibir tus sacos. Sin comisiones.</p>
          </div>

          <button class="m-btn-primary push-bottom" onclick="jumpToScreen('minorista', 2)">
            <i class="fa-solid fa-qrcode"></i> Generar pase con QR
          </button>
        </div>
      `
    },
    {
      id: 'c3',
      title: 'Pase Logístico Digital con Código QR (Offline)',
      tag: 'Ticket de Despacho',
      code: 'H-05 / H-06',
      rationale: 'El ticket opera 100% sin conexión a internet mediante firma local. Sirve como pase de entrada en Puerta 8 para vigilancia y orden de despacho para el estibador.',
      quote: '"En los galpones con techo de calamina se corta la señal de Entel y Claro. El código debe abrirse aunque el celular esté sin saldo o sin internet."',
      author: 'Hallazgo H-05 y Recomendaciones (Informe Pág. 27)',
      kpis: ['Turno #402', '100% Offline', 'Puerta 8', 'Pasaje 12'],
      labels: ['Número de Turno', 'Disponibilidad sin Red', 'Puerta de Acceso', 'Ubicación Puesto'],
      tags: ['H-05 Cero Internet Requerido', 'Boarding Pass Logístico', 'QR Encriptado'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon"><i class="fa-solid fa-ticket"></i></div>
            <div class="m-header-text">
              <strong>Pase logístico</strong>
              <span>Válido para ingreso y despacho</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('minorista', 1)" title="Volver" aria-label="Volver a la reserva">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </header>

          <section class="ticket-card">
            <div class="ticket-header">
              <div>
                <span class="ticket-label">Turno asignado</span>
                <div class="ticket-turn-num">PASE #402</div>
              </div>
              <span class="plate-badge lg">T4B-821</span>
            </div>

            <div class="ticket-qr-container">${generateSVGQR('HERMELINDA-TURNO-402-CARLOS-MENDOZA')}</div>

            <span class="ph-chip ok center"><i class="fa-solid fa-circle-check"></i> Funciona sin internet</span>

            <div class="ticket-meta-grid">
              <div class="ticket-meta-item">
                <small>Horario de ingreso</small>
                <strong>05:00 – 05:20 AM</strong>
              </div>
              <div class="ticket-meta-item">
                <small>Carga</small>
                <strong>40 sacos de papa</strong>
              </div>
            </div>

            <div class="ticket-route" aria-label="Ruta: Puerta 8, Pasaje 12, Puesto 104">
              <span>Puerta 8</span>
              <i class="fa-solid fa-arrow-right"></i>
              <span>Pasaje 12</span>
              <i class="fa-solid fa-arrow-right"></i>
              <span class="is-goal">Puesto 104</span>
            </div>
          </section>

          <p class="ph-caption">Muestra este código en vigilancia (Puerta 8) y al estibador del puesto 104.</p>

          <button class="m-btn-secondary push-bottom" onclick="jumpToScreen('minorista', 3)">
            <i class="fa-solid fa-chart-line"></i> Ver mis ahorros
          </button>
        </div>
      `
    },
    {
      id: 'c4',
      title: 'Métricas de Ahorro y Calificación de Experiencia',
      tag: 'Fase 6 Journey',
      code: 'Fase 6 / KPI',
      rationale: 'Fase de Fidelización del Customer Journey. Demuestra al minorista el valor tangible del ecosistema en horas ahorradas de tráfico y promueve la adopción continua.',
      quote: '"Ahora entro y salgo en 18 minutos; antes me quedaba atrapado dos horas respirando humo de camiones viejos."',
      author: 'Carlos Mendoza, Validación de Propuesta (Informe Pág. 21)',
      kpis: ['14.5 hrs', '18 min', '12', '4.9 ★'],
      labels: ['Ahorradas este mes', 'Permanencia Promedio', 'Despachos Completados', 'Satisfacción NPS'],
      tags: ['Fase 6 Evaluación', 'Horas Ahorradas', 'NPS Alto'],
      render: () => `
        <div class="m-screen">
          <header class="m-header">
            <div class="m-header-icon is-purple"><i class="fa-solid fa-award"></i></div>
            <div class="m-header-text">
              <strong>Mis ahorros</strong>
              <span>Carlos Mendoza &bull; Minimarket El Sol</span>
            </div>
            <button class="m-icon-btn" onclick="jumpToScreen('minorista', 0)" title="Inicio" aria-label="Ir al inicio">
              <i class="fa-solid fa-house"></i>
            </button>
          </header>

          <section class="savings-hero">
            <span class="savings-kicker">Tiempo ahorrado este mes</span>
            <span class="savings-num">14.5 h</span>
            <span class="savings-label">menos atrapado en el tráfico de La Hermelinda</span>
          </section>

          <div class="compare-grid">
            <div class="ph-card compare-card">
              <span class="compare-num is-ok">18 min</span>
              <span class="compare-label">Permanencia hoy<br>(meta &lt; 20 min)</span>
            </div>
            <div class="ph-card compare-card">
              <span class="compare-num is-old">2 h 15 min</span>
              <span class="compare-label">Antes, con cola presencial</span>
            </div>
          </div>

          <div class="ph-stat-line">
            <span><i class="fa-solid fa-qrcode"></i> Despachos con QR este mes</span>
            <strong>12</strong>
          </div>

          <section class="ph-card rating-card">
            <strong>¿Qué tan ágil fue el puesto 104 hoy?</strong>
            <div class="rating-stars" id="rating-stars">${starsHTML()}</div>
            <p class="rating-quote">"El estibador ya tenía los sacos listos al escanear el QR."</p>
          </section>

          <button class="m-btn-primary push-bottom" onclick="jumpToScreen('minorista', 0)">
            <i class="fa-solid fa-magnifying-glass"></i> Nueva búsqueda
          </button>
        </div>
      `
    }
  ]
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderScreenList();
  renderCurrentScreen();
  buildGallery();
});

// Switch Role (Mayorista / Minorista)
function setRole(role) {
  currentRole = role;
  currentScreenIndex = 0;
  
  document.getElementById('role-mayorista').classList.toggle('active', role === 'mayorista');
  document.getElementById('role-minorista').classList.toggle('active', role === 'minorista');
  
  renderScreenList();
  renderCurrentScreen();
  showToast(`Cambiado a perfil: ${role === 'mayorista' ? 'Mayorista (Puesto 104)' : 'Minorista (Carlos Mendoza)'}`);
}

// Render Screen List in Sidebar
function renderScreenList() {
  const container = document.getElementById('screen-list-container');
  const screens = screensData[currentRole];
  
  let html = '';
  screens.forEach((scr, idx) => {
    html += `
      <button class="screen-item-btn ${idx === currentScreenIndex ? 'active' : ''}" onclick="selectScreenIndex(${idx})">
        <span>${idx + 1}. ${scr.title}</span>
        <span class="item-tag">${scr.tag}</span>
      </button>
    `;
  });
  container.innerHTML = html;
}

// Render Current Screen inside Phone Mockup
function renderCurrentScreen() {
  const screens = screensData[currentRole];
  const screen = screens[currentScreenIndex];
  
  // Update Phone Viewport
  const viewport = document.getElementById('phone-viewport');
  viewport.innerHTML = screen.render();
  viewport.scrollTop = 0;

  // Update Toolbar & Header Indicators
  document.getElementById('current-screen-name').innerText = `${currentRole === 'mayorista' ? 'M' : 'C'}-${currentScreenIndex + 1}: ${screen.title}`;
  document.getElementById('screen-index-display').innerText = `${currentScreenIndex + 1} / ${screens.length}`;

  // Update Left Sidebar Rationale & Tags
  document.getElementById('screen-rationale-text').innerText = screen.rationale;
  const tagsContainer = document.getElementById('screen-tags-container');
  tagsContainer.innerHTML = screen.tags.map(t => `<span class="badge badge-emerald">${t}</span>`).join('');

  // Update Right Sidebar Details
  document.getElementById('detail-code').innerText = screen.code;
  document.getElementById('detail-title').innerText = screen.title;
  document.getElementById('detail-description').innerText = screen.rationale;
  document.getElementById('detail-quote').innerText = screen.quote;
  document.getElementById('detail-author').innerText = `• ${screen.author}`;

  // Update KPIs in Right Sidebar
  document.getElementById('kpi-1-val').innerText = screen.kpis[0];
  document.getElementById('kpi-1-label').innerText = screen.labels[0];
  document.getElementById('kpi-2-val').innerText = screen.kpis[1];
  document.getElementById('kpi-2-label').innerText = screen.labels[1];
  document.getElementById('kpi-3-val').innerText = screen.kpis[2];
  document.getElementById('kpi-3-label').innerText = screen.labels[2];
  document.getElementById('kpi-4-val').innerText = screen.kpis[3];
  document.getElementById('kpi-4-label').innerText = screen.labels[3];

  // Update Floating Zen Bar (when in Solo Celular mode)
  const zenNum = document.getElementById('zen-num-display');
  if (zenNum) {
    zenNum.innerText = `${currentRole === 'mayorista' ? 'M' : 'C'}-${currentScreenIndex + 1}`;
  }
  const zenName = document.getElementById('zen-name-display');
  if (zenName) {
    zenName.innerText = screen.title;
  }
  const zenMayorista = document.getElementById('zen-role-mayorista');
  const zenMinorista = document.getElementById('zen-role-minorista');
  if (zenMayorista && zenMinorista) {
    zenMayorista.classList.toggle('active', currentRole === 'mayorista');
    zenMinorista.classList.toggle('active', currentRole === 'minorista');
  }
  renderZenDots();

  renderScreenList();
}

// Select Screen by Index
function selectScreenIndex(idx) {
  currentScreenIndex = idx;
  renderCurrentScreen();
}

function nextScreen() {
  const screens = screensData[currentRole];
  if (currentScreenIndex < screens.length - 1) {
    currentScreenIndex++;
    renderCurrentScreen();
  } else {
    currentScreenIndex = 0;
    renderCurrentScreen();
  }
}

function prevScreen() {
  const screens = screensData[currentRole];
  if (currentScreenIndex > 0) {
    currentScreenIndex--;
    renderCurrentScreen();
  } else {
    currentScreenIndex = screens.length - 1;
    renderCurrentScreen();
  }
}

function jumpToScreen(role, index) {
  if (currentRole !== role) {
    currentRole = role;
    document.getElementById('role-mayorista').classList.toggle('active', role === 'mayorista');
    document.getElementById('role-minorista').classList.toggle('active', role === 'minorista');
  }
  currentScreenIndex = index;
  renderScreenList();
  renderCurrentScreen();
  switchView('interactive');
}

// Adjust Stock Live in M-2
function adjustStock(productKey, amount) {
  const item = inventoryState[productKey];
  if (!item) return;

  const label = productLabels[productKey] || productKey;
  if (item.disponible + amount < 0) {
    showToast(`⚠️ No hay suficiente stock disponible de ${label}`);
    return;
  }

  item.disponible += amount;
  item.total = item.disponible + item.reservado;

  const dispElem = document.getElementById(`val-${productKey}-disp`);
  if (dispElem) {
    dispElem.innerText = item.disponible;
    dispElem.style.transform = 'scale(1.2)';
    setTimeout(() => { dispElem.style.transform = 'scale(1)'; }, 200);
  }

  const totalElem = document.getElementById('val-total-libres');
  if (totalElem) totalElem.innerText = totalLibres();

  showToast(`${amount > 0 ? '+' : ''}${amount} sacos de ${label} actualizados en inventario`);
}

// Quick Sale Logic (M-3)
function selectQuickProduct(key) {
  selectedQuickProductKey = key;
  ['canchan', 'amarilla'].forEach(k => {
    const chip = document.getElementById(`chip-${k}`);
    if (!chip) return;
    chip.classList.toggle('selected', k === key);
    chip.setAttribute('aria-pressed', k === key);
  });
}

function changeQuickQty(delta) {
  quickSaleQty = Math.max(1, Math.min(20, quickSaleQty + delta));
  const qtyElem = document.getElementById('quick-qty-num');
  if (qtyElem) qtyElem.innerText = quickSaleQty;
  const confirmElem = document.getElementById('quick-confirm-qty');
  if (confirmElem) confirmElem.innerText = quickSaleQty;
}

function executeQuickSale() {
  if (inventoryState[selectedQuickProductKey].disponible >= quickSaleQty) {
    inventoryState[selectedQuickProductKey].disponible -= quickSaleQty;
    showToast(`⚡ Venta rápida: ${quickSaleQty} sacos de ${productLabels[selectedQuickProductKey]} descontados en 3.4 s.`);
    jumpToScreen('mayorista', 0);
  } else {
    showToast('⚠️ Stock insuficiente para venta rápida.');
  }
}

// Slot Selection in C-2
function selectSlot(cardElem) {
  const cards = document.querySelectorAll('.slot-card');
  cards.forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });
  cardElem.classList.add('selected');
  cardElem.setAttribute('aria-checked', 'true');
}

// Calificación del puesto (C-4)
function rateStall(value) {
  stallRating = value;
  const container = document.getElementById('rating-stars');
  if (container) container.innerHTML = starsHTML();
  showToast(`⭐ Calificaste al puesto 104 con ${value} de 5`);
}

// Interactive Demo Triggers
function triggerQuickSaleDemo() {
  jumpToScreen('mayorista', 2);
  showToast('⏱️ Demostración interactiva: Venta de mostrador en < 10 segundos');
}

function triggerScanDemo() {
  jumpToScreen('mayorista', 3);
  showToast('📷 Demostración interactiva: Escáner QR de rampa');
}

// =====================================================================
// THEME MANAGEMENT: 'dark' | 'light' | 'high-contrast'
// =====================================================================
let currentTheme = 'dark';

function setAppTheme(theme) {
  currentTheme = theme;
  document.body.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast');
  document.body.classList.add(`theme-${theme}`);

  // Update theme pill buttons in header
  const darkBtn = document.getElementById('btn-theme-dark');
  const lightBtn = document.getElementById('btn-theme-light');
  const contrastBtn = document.getElementById('btn-theme-contrast');
  if (darkBtn) darkBtn.classList.toggle('active', theme === 'dark');
  if (lightBtn) lightBtn.classList.toggle('active', theme === 'light');
  if (contrastBtn) contrastBtn.classList.toggle('active', theme === 'high-contrast');

  const names = {
    'dark': '🌙 Modo Oscuro Activado',
    'light': '☀️ Modo Claro Activado (Ideal para Proyector)',
    'high-contrast': '⚡ Modo Alto Contraste (Madrugada Galpón)'
  };
  showToast(names[theme] || 'Tema actualizado');
}

function cycleAppTheme() {
  if (currentTheme === 'dark') setAppTheme('light');
  else if (currentTheme === 'light') setAppTheme('high-contrast');
  else setAppTheme('dark');
}

function toggleHighContrast() {
  if (currentTheme === 'high-contrast') setAppTheme('dark');
  else setAppTheme('high-contrast');
}

// =====================================================================
// ZEN MODE MANAGEMENT (MODO SOLO CELULAR PARA EXPOSICIÓN)
// =====================================================================
let isZenMode = false;

function toggleZenMode() {
  isZenMode = !isZenMode;
  document.body.classList.toggle('zen-mode', isZenMode);

  const zenBtn = document.getElementById('btn-zen-mode');
  if (zenBtn) zenBtn.classList.toggle('active', isZenMode);

  if (isZenMode) {
    renderZenDots();
    showToast('📺 Modo Solo Celular Activado. Presiona Esc para salir.');
  } else {
    showToast('Modo estándar restaurado.');
  }
}

function renderZenDots() {
  const container = document.getElementById('zen-dots');
  if (!container) return;
  const screens = screensData[currentRole];
  let html = '';
  screens.forEach((_, idx) => {
    html += `<button class="zen-dot ${idx === currentScreenIndex ? 'active' : ''}" onclick="selectScreenIndex(${idx})" title="Ir a pantalla ${idx + 1}">${idx + 1}</button>`;
  });
  container.innerHTML = html;
}

function toggleNativeFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log('Error intentando entrar a pantalla completa:', err.message);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Global Keyboard Shortcuts (Esc para salir, Flechas para navegar)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isZenMode) {
      toggleZenMode();
    }
    const modal = document.getElementById('screenshot-modal');
    if (modal && modal.classList.contains('active')) {
      closeScreenshotModal();
    }
  } else if (e.key === 'ArrowRight') {
    nextScreen();
  } else if (e.key === 'ArrowLeft') {
    prevScreen();
  }
});

// Switch between Main Tabs
function switchView(viewName) {
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`view-${viewName}`).classList.add('active');
  document.getElementById(`tab-${viewName}`).classList.add('active');
}

// BUILD GALLERY FOR SCREENSHOTS & PRESENTATION
function buildGallery() {
  const container = document.getElementById('gallery-cards-grid');
  let html = '';

  const allScreens = [
    ...screensData.mayorista.map((s, idx) => ({ ...s, role: 'mayorista', screenCode: `M-${idx + 1}` })),
    ...screensData.minorista.map((s, idx) => ({ ...s, role: 'minorista', screenCode: `C-${idx + 1}` }))
  ];

  allScreens.forEach(item => {
    html += `
      <div class="gallery-card" data-role="${item.role}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="badge ${item.role === 'mayorista' ? 'badge-amber' : 'badge-blue'}">
            ${item.screenCode} &bull; ${item.role === 'mayorista' ? 'Mayorista' : 'Minorista'}
          </span>
          <span class="badge badge-purple">${item.code}</span>
        </div>

        <!-- Phone screen preview -->
        <div class="gallery-screen-preview">
          ${statusBarHTML()}
          <div class="phone-viewport">
            ${item.render()}
          </div>
        </div>

        <div class="gallery-info">
          <h4>${item.title}</h4>
          <p>${item.rationale}</p>
        </div>

        <div class="gallery-actions">
          <button class="gallery-btn" onclick="jumpToScreen('${item.role}', ${parseInt(item.screenCode.split('-')[1]) - 1})">
            <i class="fa-solid fa-expand"></i> Interactuar en Grande
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Filter Gallery Cards
function filterGallery(role) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    if (role === 'all' || card.getAttribute('data-role') === role) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Toast Notifications Helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-bell" style="color: var(--accent-emerald);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Clean Screenshot Modal Handler (For Exposición & PPT)
function openScreenshotModal() {
  const screens = screensData[currentRole];
  const screen = screens[currentScreenIndex];
  const modal = document.getElementById('screenshot-modal');
  const target = document.getElementById('modal-phone-target');

  document.getElementById('modal-screen-badge').innerText = `${currentRole === 'mayorista' ? 'M' : 'C'}-${currentScreenIndex + 1}`;
  document.getElementById('modal-screen-title').innerText = screen.title;

  target.innerHTML = `
    <div class="phone-mockup" style="max-height: 80vh; transform: scale(0.95); margin: 0 auto;">
      <div class="phone-speaker-bar">
        <div class="dynamic-island"><span class="island-camera"></span></div>
      </div>
      ${statusBarHTML()}
      <div class="phone-viewport">
        ${screen.render()}
      </div>
      <div class="phone-home-indicator"></div>
    </div>
  `;

  modal.classList.add('active');
  showToast('📸 Modo Captura Limpia Activado. Presiona Win + Shift + S');
}

function closeScreenshotModal(e) {
  const modal = document.getElementById('screenshot-modal');
  modal.classList.remove('active');
}

