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

// SVG QR Generator for offline ticket & scanner
function generateSVGQR(text) {
  return `<svg class="ticket-qr-img" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- QR Corner 1 -->
    <rect x="5" y="5" width="28" height="28" rx="4" fill="#000" />
    <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
    <rect x="13" y="13" width="12" height="12" rx="2" fill="#10b981" />
    
    <!-- QR Corner 2 -->
    <rect x="67" y="5" width="28" height="28" rx="4" fill="#000" />
    <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
    <rect x="75" y="13" width="12" height="12" rx="2" fill="#10b981" />

    <!-- QR Corner 3 -->
    <rect x="5" y="67" width="28" height="28" rx="4" fill="#000" />
    <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
    <rect x="13" y="75" width="12" height="12" rx="2" fill="#10b981" />

    <!-- Data Pattern Elements -->
    <rect x="38" y="10" width="6" height="6" fill="#000" />
    <rect x="48" y="8" width="8" height="6" fill="#000" />
    <rect x="40" y="22" width="6" height="8" fill="#000" />
    <rect x="52" y="20" width="6" height="6" fill="#000" />
    <rect x="10" y="38" width="6" height="6" fill="#000" />
    <rect x="22" y="42" width="8" height="6" fill="#000" />
    <rect x="38" y="38" width="12" height="12" rx="3" fill="#10b981" />
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
          <!-- Market Header -->
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon"><i class="fa-solid fa-store"></i></div>
              <div class="m-header-text">
                <strong>Distribuidora Don Pepe</strong>
                <span>Puesto 104 &bull; Pasaje 12 &bull; Galpón Tubérculos</span>
              </div>
            </div>
            <span class="m-badge-puesto">Puerta 8</span>
          </div>

          <!-- Semáforo Logístico Banner -->
          <div class="semaforo-banner verde">
            <div class="semaforo-light semaforo-verde"></div>
            <div class="semaforo-content">
              <strong>🟢 RAMPA LIBRE &bull; PASAJE DESPEJADO</strong>
              <span>Turno actual en ventana de atención (05:00 - 05:20 AM)</span>
            </div>
          </div>

          <!-- Camión en Rampa -->
          <div class="rampa-card">
            <span class="rampa-tag"><i class="fa-solid fa-clock"></i> EN RAMPA (FALTAN 8 MIN)</span>
            <div class="truck-meta">
              <i class="fa-solid fa-truck-pickup truck-icon"></i>
              <div class="truck-text">
                <h4>Minimarket El Sol</h4>
                <p>Carlos Mendoza &bull; <span class="plate-badge">T4B-821</span></p>
              </div>
            </div>

            <div class="order-pills-row">
              <div class="order-pill">
                <span>Papa Canchán</span>
                <strong>30 sacos</strong>
              </div>
              <div class="order-pill">
                <span>Papa Amarilla</span>
                <strong>10 sacos</strong>
              </div>
            </div>

            <button class="m-btn-primary" onclick="jumpToScreen('mayorista', 3)">
              <i class="fa-solid fa-qrcode"></i> ESCANEAR QR Y DESPACHAR
            </button>
          </div>

          <!-- Próximos Camiones en Cola Virtual -->
          <div class="m-section-title">
            <span>Próximos Turnos Programados</span>
            <span class="badge badge-blue">3 en espera</span>
          </div>

          <div class="turn-queue-list">
            <div class="queue-item">
              <div class="queue-left">
                <span class="queue-time">05:20 AM</span>
                <div class="queue-buyer">
                  Bodega El Porvenir
                  <small>Fuso Canter &bull; Placa M3E-914</small>
                </div>
              </div>
              <span class="queue-qty">60 sacos</span>
            </div>
            <div class="queue-item">
              <div class="queue-left">
                <span class="queue-time">05:40 AM</span>
                <div class="queue-buyer">
                  Minimarket San Andrés
                  <small>Hyundai H100 &bull; Placa P2X-451</small>
                </div>
              </div>
              <span class="queue-qty">25 sacos</span>
            </div>
          </div>

          <!-- Bottom Floating Bar for Wholesaler -->
          <div class="wholesaler-quick-bar">
            <button class="quick-sale-pill" onclick="jumpToScreen('mayorista', 2)">
              <i class="fa-solid fa-bolt-lightning"></i> VENTA RÁPIDA MOSTRADOR (&lt;10s)
            </button>
            <button class="stage-nav-btn" style="flex: 0 0 48px; border-radius: var(--radius-md);" onclick="jumpToScreen('mayorista', 1)" title="Ver Stock">
              <i class="fa-solid fa-boxes-stacked" style="color: var(--accent-emerald);"></i>
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
              <div class="m-header-text">
                <strong>Inventario en Rampa</strong>
                <span>Puesto 104 &bull; Actualizado 04:32 AM</span>
              </div>
            </div>
            <button class="stage-nav-btn" onclick="jumpToScreen('mayorista', 0)">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>

          <div class="stock-grid">
            <!-- Papa Canchán Card -->
            <div class="stock-card">
              <div class="stock-card-top">
                <div>
                  <div class="stock-name">🥔 Papa Canchán Seleccionada</div>
                  <div class="stock-category">Saco de 50 kg &bull; Galpón Tubérculos</div>
                </div>
                <div class="stock-figures">
                  <div class="stat-item">
                    <span class="stat-val disponible" id="val-canchan-disp">${inventoryState.canchan.disponible}</span>
                    <span class="stat-sub">Libres</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-val reservado">${inventoryState.canchan.reservado}</span>
                    <span class="stat-sub">En Turnos</span>
                  </div>
                </div>
              </div>
              <div class="stock-stepper-row">
                <button class="step-btn minus" onclick="adjustStock('canchan', -10)">-10</button>
                <button class="step-btn minus" onclick="adjustStock('canchan', -1)">-1</button>
                <button class="step-btn" onclick="adjustStock('canchan', 10)">+10</button>
                <button class="step-btn" onclick="adjustStock('canchan', 50)">+50</button>
              </div>
            </div>

            <!-- Papa Amarilla Card -->
            <div class="stock-card">
              <div class="stock-card-top">
                <div>
                  <div class="stock-name">🥔 Papa Amarilla Tumbay</div>
                  <div class="stock-category">Saco de 45 kg &bull; Primera Calidad</div>
                </div>
                <div class="stock-figures">
                  <div class="stat-item">
                    <span class="stat-val disponible" id="val-amarilla-disp">${inventoryState.amarilla.disponible}</span>
                    <span class="stat-sub">Libres</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-val reservado">${inventoryState.amarilla.reservado}</span>
                    <span class="stat-sub">En Turnos</span>
                  </div>
                </div>
              </div>
              <div class="stock-stepper-row">
                <button class="step-btn minus" onclick="adjustStock('amarilla', -5)">-5</button>
                <button class="step-btn minus" onclick="adjustStock('amarilla', -1)">-1</button>
                <button class="step-btn" onclick="adjustStock('amarilla', 5)">+5</button>
                <button class="step-btn" onclick="adjustStock('amarilla', 20)">+20</button>
              </div>
            </div>

            <!-- Camote Amarillo Card -->
            <div class="stock-card">
              <div class="stock-card-top">
                <div>
                  <div class="stock-name">🍠 Camote Amarillo Dulce</div>
                  <div class="stock-category">Saco de 50 kg</div>
                </div>
                <div class="stock-figures">
                  <div class="stat-item">
                    <span class="stat-val disponible" id="val-camote-disp">${inventoryState.camote.disponible}</span>
                    <span class="stat-sub">Libres</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-val reservado">${inventoryState.camote.reservado}</span>
                    <span class="stat-sub">En Turnos</span>
                  </div>
                </div>
              </div>
              <div class="stock-stepper-row">
                <button class="step-btn minus" onclick="adjustStock('camote', -10)">-10</button>
                <button class="step-btn minus" onclick="adjustStock('camote', -1)">-1</button>
                <button class="step-btn" onclick="adjustStock('camote', 10)">+10</button>
                <button class="step-btn" onclick="adjustStock('camote', 50)">+50</button>
              </div>
            </div>
          </div>

          <button class="m-btn-primary" style="margin-top: auto;" onclick="showToast('✅ Entrada de camión proveedor registrada: +120 sacos');">
            <i class="fa-solid fa-truck-moving"></i> + REGISTRAR DESCARGA PROVEEDOR
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon" style="background: var(--accent-amber);"><i class="fa-solid fa-bolt-lightning" style="color: #000;"></i></div>
              <div class="m-header-text">
                <strong>Venta Rápida al Paso</strong>
                <span>Mostrador &bull; Cobro Directo en Puesto</span>
              </div>
            </div>
            <button class="stage-nav-btn" onclick="jumpToScreen('mayorista', 0)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="quick-sale-container">
            <div class="speed-badge">
              <i class="fa-solid fa-stopwatch"></i> CRONÓMETRO DE PRUEBA DE CAMPO
            </div>
            <div class="speed-timer" id="quick-sale-clock">00:03.4</div>

            <div class="m-section-title">
              <span>1. Seleccionar Producto:</span>
            </div>
            <div class="quick-select-chips">
              <button class="chip-btn selected" id="chip-canchan" onclick="selectQuickProduct('canchan')">
                <i class="fa-solid fa-circle-dot"></i>
                <span>Papa Canchán</span>
                <small>${inventoryState.canchan.disponible} sacos disp.</small>
              </button>
              <button class="chip-btn" id="chip-amarilla" onclick="selectQuickProduct('amarilla')">
                <i class="fa-regular fa-circle"></i>
                <span>Papa Amarilla</span>
                <small>${inventoryState.amarilla.disponible} sacos disp.</small>
              </button>
            </div>

            <div class="m-section-title">
              <span>2. Cantidad de Sacos:</span>
            </div>
            <div class="quick-qty-selector">
              <button class="step-btn minus" style="width: 50px; height: 50px;" onclick="changeQuickQty(-1)">-1</button>
              <div style="text-align: center;">
                <span class="qty-display" id="quick-qty-num">2</span>
                <span class="qty-unit">sacos de 50kg</span>
              </div>
              <button class="step-btn" style="width: 50px; height: 50px;" onclick="changeQuickQty(1)">+1</button>
            </div>

            <div class="tip-box" style="background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3);">
              <p style="color: var(--accent-amber); font-size: 0.75rem;">
                <i class="fa-solid fa-shield-halved"></i> <strong>Aviso de Privacidad:</strong> Cobro en efectivo o Yape directo. La app no procesa dinero ni emite comprobantes ante SUNAT.
              </p>
            </div>

            <button class="m-btn-warning" onclick="executeQuickSale()">
              <i class="fa-solid fa-check"></i> CONFIRMAR SALIDA (-2 SACOS)
            </button>
          </div>
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon"><i class="fa-solid fa-qrcode"></i></div>
              <div class="m-header-text">
                <strong>Escáner de Despacho</strong>
                <span>Cámara Activa &bull; Modo Rápido</span>
              </div>
            </div>
            <button class="stage-nav-btn" onclick="jumpToScreen('mayorista', 0)">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>

          <!-- Simulated Camera Viewfinder -->
          <div class="camera-scanner-view">
            <div class="scan-laser"></div>
            <div class="scan-crosshair">
              <div class="scan-mock-qr">
                ${generateSVGQR('TURNO-402-CARLOS-MENDOZA')}
              </div>
            </div>
            <span style="color: rgba(255,255,255,0.7); font-size: 0.72rem; margin-top: 10px;">
              <i class="fa-solid fa-camera"></i> Apunte al código QR del comprador
            </span>
          </div>

          <!-- Detected Ticket Card -->
          <div class="scan-detected-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="badge badge-emerald"><i class="fa-solid fa-circle-check"></i> TURNO VÁLIDO #402</span>
              <span class="plate-badge">T4B-821</span>
            </div>
            <div>
              <strong style="color: #fff; font-size: 0.95rem;">Carlos Mendoza &bull; Minimarket El Sol</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                Carga programada: <strong>30 sacos Canchán + 10 sacos Amarilla</strong>
              </div>
            </div>

            <button class="m-btn-primary" onclick="jumpToScreen('mayorista', 4)">
              <i class="fa-solid fa-check-double"></i> CONFIRMAR DESPACHO (-40 SACOS)
            </button>
          </div>
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
          <!-- Banner explicativo para la exposición -->
          <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px dashed var(--accent-emerald); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 4px; text-align: left;">
            <strong style="color: var(--accent-emerald); font-size: 0.75rem; display: block; margin-bottom: 2px;">
              <i class="fa-solid fa-flag-checkered"></i> CIERRE DE DESPACHO Y META MVP (TABLA 19):
            </strong>
            <span style="color: var(--text-muted); font-size: 0.72rem; line-height: 1.35; display: block;">
              Se activa al terminar de cargar los sacos. Descuenta el inventario automáticamente sin tocar cuaderno, verifica la meta de despacho en menos de 5 min (3m 42s) y libera la rampa para el siguiente camión.
            </span>
          </div>

          <div class="success-screen-box" style="padding: 10px 14px;">
            <div class="success-icon-ring">
              <i class="fa-solid fa-check"></i>
            </div>
            <div>
              <h3 style="color: #fff; font-size: 1.2rem;">¡Despacho Completado!</h3>
              <p style="color: var(--accent-emerald); font-size: 0.82rem; font-weight: 700; margin-top: 4px;">
                <i class="fa-solid fa-stopwatch"></i> Tiempo de atención: 3m 42s (Meta cumplida)
              </p>
            </div>

            <div class="success-receipt">
              <div class="receipt-line">
                <span>Comprador:</span>
                <strong>Carlos Mendoza (Minimarket El Sol)</strong>
              </div>
              <div class="receipt-line">
                <span>Vehículo:</span>
                <strong>Toyota Hilux (T4B-821)</strong>
              </div>
              <div class="receipt-line">
                <span>Mercadería despachada:</span>
                <strong>40 sacos totales</strong>
              </div>
              <div class="receipt-line">
                <span>Descuento de inventario:</span>
                <strong style="color: var(--accent-emerald);">-30 Canchán / -10 Amarilla</strong>
              </div>
              <div class="receipt-line">
                <span>Estado de rampa:</span>
                <strong style="color: var(--accent-emerald);">🟢 LIBERADA PARA TURNO 05:20</strong>
              </div>
            </div>

            <p style="font-size: 0.72rem; color: var(--text-subtle);">
              El minorista ya cuenta con pase verde de salida por Puerta 8.
            </p>

            <button class="m-btn-primary" onclick="jumpToScreen('mayorista', 0)">
              <i class="fa-solid fa-arrow-left"></i> REGRESAR AL SEMÁFORO DE TURNOS
            </button>
          </div>
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon" style="background: var(--accent-blue);"><i class="fa-solid fa-basket-shopping"></i></div>
              <div class="m-header-text">
                <strong>Mercado La Hermelinda</strong>
                <span>Sector Tubérculos &bull; Trujillo</span>
              </div>
            </div>
            <span class="m-badge-puesto" style="color: var(--accent-blue); border-color: rgba(59, 130, 246, 0.3);">
              <i class="fa-solid fa-truck-fast"></i> Modo Comprador
            </span>
          </div>

          <!-- Search Box -->
          <div class="search-bar-box">
            <i class="fa-solid fa-magnifying-glass" style="color: var(--text-subtle);"></i>
            <input type="text" value="Papa Canchán / Amarilla" placeholder="Buscar tubérculo o puesto...">
            <i class="fa-solid fa-sliders" style="color: var(--accent-emerald);"></i>
          </div>

          <!-- Category filter pills -->
          <div class="filter-pills-row">
            <span class="filter-pill active">🥔 Tubérculos (Galpón 1)</span>
            <span class="filter-pill">🧅 Hortalizas</span>
            <span class="filter-pill">🍎 Frutas</span>
          </div>

          <!-- Wholesaler Cards in Market -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Card 1 (Don Pepe - Selected) -->
            <div class="catalog-card" style="border-color: var(--accent-emerald);">
              <div class="catalog-card-header">
                <div>
                  <div class="catalog-stall-name">Distribuidora Don Pepe &bull; Puesto 104</div>
                  <div class="catalog-location">
                    <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> Pasaje 12 (Ingreso sugerido: Puerta 8)
                  </div>
                </div>
                <span class="badge badge-emerald">Stock Confirmado</span>
              </div>

              <div class="product-item-row">
                <span>🥔 Papa Canchán (Saco 50kg)</span>
                <div>
                  <strong style="color: var(--accent-emerald);">${inventoryState.canchan.disponible} sacos</strong>
                  <small style="color: var(--text-muted); margin-left: 6px;">S/. 72.00</small>
                </div>
              </div>

              <div class="product-item-row">
                <span>🥔 Papa Amarilla Tumbay (Saco 45kg)</span>
                <div>
                  <strong style="color: var(--accent-emerald);">${inventoryState.amarilla.disponible} sacos</strong>
                  <small style="color: var(--text-muted); margin-left: 6px;">S/. 94.00</small>
                </div>
              </div>

              <button class="m-btn-primary" onclick="jumpToScreen('minorista', 1)">
                <i class="fa-solid fa-calendar-check"></i> RESERVAR Y ELEGIR TURNO VEHICULAR
              </button>
            </div>

            <!-- Card 2 -->
            <div class="catalog-card" style="opacity: 0.85;">
              <div class="catalog-card-header">
                <div>
                  <div class="catalog-stall-name">Comercial Los Andes &bull; Puesto 118</div>
                  <div class="catalog-location">Pasaje 14 (Puerta 6)</div>
                </div>
                <span class="badge badge-amber">Rampa Ocupada</span>
              </div>
              <div class="product-item-row">
                <span>🥔 Papa Canchán</span>
                <strong>45 sacos disp.</strong>
              </div>
            </div>
          </div>
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon"><i class="fa-solid fa-calendar-days"></i></div>
              <div class="m-header-text">
                <strong>Reserva de Turno Logístico</strong>
                <span>Puesto 104 &bull; Carlos Mendoza</span>
              </div>
            </div>
            <button class="stage-nav-btn" onclick="jumpToScreen('minorista', 0)">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>

          <!-- Selected Order Summary -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
            <div class="m-section-title" style="margin-bottom: 8px;">
              <span>Mercadería a Recoger:</span>
              <span style="color: var(--accent-emerald);">40 sacos en total</span>
            </div>
            <div style="font-size: 0.8rem; display: flex; justify-content: space-between; color: #fff;">
              <span>&bull; 30 sacos Papa Canchán (50kg)</span>
              <span>&bull; 10 sacos Papa Amarilla (45kg)</span>
            </div>
          </div>

          <!-- Vehicle Data -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <small style="color: var(--text-subtle); display: block; font-size: 0.7rem;">VEHÍCULO DECLARADO:</small>
              <strong style="color: #fff; font-size: 0.85rem;">Toyota Hilux Blanca</strong>
            </div>
            <span class="plate-badge" style="font-size: 0.82rem;">T4B-821</span>
          </div>

          <!-- Slot Selector -->
          <div class="m-section-title">
            <span>Seleccionar Franja Horaria de Ingreso:</span>
          </div>

          <div class="slot-grid">
            <div class="slot-card" onclick="selectSlot(this)">
              <div>
                <span class="slot-time">04:40 - 05:00 AM</span>
                <span class="slot-congestion" style="color: var(--accent-amber);">
                  <i class="fa-solid fa-triangle-exclamation"></i> Congestión moderada en Puerta 8
                </span>
              </div>
              <i class="fa-regular fa-circle" style="color: var(--text-subtle);"></i>
            </div>

            <div class="slot-card recommended selected" onclick="selectSlot(this)">
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="slot-time">05:00 - 05:20 AM</span>
                  <span class="badge badge-emerald">Recomendado</span>
                </div>
                <span class="slot-congestion">
                  <i class="fa-solid fa-circle-check"></i> Rampa libre y pasillo despejado
                </span>
              </div>
              <i class="fa-solid fa-circle-dot" style="color: var(--accent-emerald);"></i>
            </div>

            <div class="slot-card" onclick="selectSlot(this)">
              <div>
                <span class="slot-time">05:20 - 05:40 AM</span>
                <span class="slot-congestion" style="color: var(--accent-blue);">
                  <i class="fa-solid fa-clock"></i> 2 camionetas en cola
                </span>
              </div>
              <i class="fa-regular fa-circle" style="color: var(--text-subtle);"></i>
            </div>
          </div>

          <div class="tip-box" style="margin-top: 4px; padding: 10px;">
            <p style="font-size: 0.72rem; color: var(--text-muted);">
              <i class="fa-solid fa-handshake" style="color: var(--accent-emerald);"></i> <strong>Pago en Rampa:</strong> Cancelarás directamente a Don Pepe en efectivo o Yape al recibir tus sacos.
            </p>
          </div>

          <button class="m-btn-primary" onclick="jumpToScreen('minorista', 2)">
            <i class="fa-solid fa-qrcode"></i> GENERAR PASE DE ACCESO CON QR
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon"><i class="fa-solid fa-ticket"></i></div>
              <div class="m-header-text">
                <strong>Pase Logístico Activo</strong>
                <span>Entrada y Despacho en La Hermelinda</span>
              </div>
            </div>
            <button class="stage-nav-btn" onclick="jumpToScreen('minorista', 1)">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>

          <!-- Ticket Card Container -->
          <div class="ticket-card">
            <div class="ticket-header">
              <div>
                <small style="color: var(--text-subtle); font-size: 0.65rem;">TURNO ASIGNADO</small>
                <div class="ticket-turn-num">PASE #402</div>
              </div>
              <span class="plate-badge" style="font-size: 0.85rem;">T4B-821</span>
            </div>

            <!-- Big QR Image -->
            <div class="ticket-qr-container">
              ${generateSVGQR('HERMELINDA-TURNO-402-CARLOS-MENDOZA')}
            </div>

            <div class="offline-notice">
              <i class="fa-solid fa-circle-check"></i> DISPONIBLE SIN CONEXIÓN A INTERNET
            </div>

            <!-- Access Meta Grid -->
            <div class="ticket-meta-grid">
              <div class="ticket-meta-item">
                <small>HORARIO DE INGRESO</small>
                <strong>05:00 - 05:20 AM</strong>
              </div>
              <div class="ticket-meta-item">
                <small>PUERTA DE ACCESO</small>
                <strong style="color: var(--accent-emerald);">PUERTA 8</strong>
              </div>
              <div class="ticket-meta-item">
                <small>PASAJE / PUESTO</small>
                <strong>Pasaje 12 &bull; Puesto 104</strong>
              </div>
              <div class="ticket-meta-item">
                <small>CARGA</small>
                <strong>40 sacos (Papas)</strong>
              </div>
            </div>
          </div>

          <p style="font-size: 0.72rem; color: var(--text-muted); text-align: center;">
            Muestre este código al control de vigilancia en Puerta 8 y al estibador en el puesto 104.
          </p>

          <button class="m-btn-primary" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color);" onclick="jumpToScreen('minorista', 3)">
            <i class="fa-solid fa-chart-line"></i> VER MIS AHORROS Y EVALUACIÓN
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
          <div class="m-header">
            <div class="m-header-title">
              <div class="m-header-icon" style="background: var(--accent-purple);"><i class="fa-solid fa-award"></i></div>
              <div class="m-header-text">
                <strong>Resumen de Rendimiento</strong>
                <span>Carlos Mendoza &bull; Minimarket El Sol</span>
              </div>
            </div>
            <button class="stage-nav-btn" onclick="jumpToScreen('minorista', 0)">
              <i class="fa-solid fa-house"></i>
            </button>
          </div>

          <!-- Banner explicativo para la exposición -->
          <div style="background: rgba(139, 92, 246, 0.12); border: 1.5px dashed var(--accent-purple); border-radius: var(--radius-sm); padding: 10px 12px; text-align: left;">
            <strong style="color: var(--accent-purple); font-size: 0.75rem; display: block; margin-bottom: 2px;">
              <i class="fa-solid fa-chart-line"></i> FASE 6 DEL JOURNEY (FIDELIZACIÓN):
            </strong>
            <span style="color: var(--text-muted); font-size: 0.72rem; line-height: 1.35; display: block;">
              Demuestra a Carlos Mendoza el ahorro real de tiempo al no hacer cola presencial (18 min de permanencia vs 2h 15m anteriores) y permite calificar la satisfacción (NPS) del servicio.
            </span>
          </div>

          <!-- Big Savings Hero -->
          <div class="savings-hero">
            <small style="color: var(--text-muted); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px;">
              IMPACTO LOGÍSTICO ACUMULADO
            </small>
            <span class="savings-num">14.5 hrs</span>
            <span class="savings-label">de tráfico ahorradas este mes en La Hermelinda</span>
          </div>

          <!-- Comparison Grid -->
          <div class="kpi-mini-grid">
            <div class="kpi-card">
              <span class="kpi-num" style="color: var(--accent-emerald);">18 min</span>
              <span class="kpi-label">Tiempo promedio hoy (Meta &lt; 20 min)</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-num" style="color: var(--accent-red); text-decoration: line-through;">2h 15m</span>
              <span class="kpi-label">Tiempo anterior con cola presencial</span>
            </div>
          </div>

          <!-- Feedback Stars -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <strong style="color: #fff; font-size: 0.85rem; display: block; margin-bottom: 6px;">
              ¿Cómo fue la agilidad del puesto 104 hoy?
            </strong>
            <div style="color: #facc15; font-size: 1.4rem; display: flex; justify-content: center; gap: 8px; margin-bottom: 8px;">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <p style="font-size: 0.72rem; color: var(--text-muted);">
              "El estibador ya tenía los sacos listos en la carretilla al escanear el QR."
            </p>
          </div>

          <button class="m-btn-primary" onclick="jumpToScreen('minorista', 0)">
            <i class="fa-solid fa-magnifying-glass"></i> NUEVA BÚSQUEDA DE MERCADERÍA
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
  document.getElementById('detail-author').innerText = `&bull; ${screen.author}`;

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

  if (item.disponible + amount < 0) {
    showToast(`⚠️ No hay suficiente stock disponible de ${productKey}`);
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

  showToast(`${amount > 0 ? '+' : ''}${amount} sacos de ${productKey} actualizados en inventario`);
}

// Quick Sale Logic (M-3)
let selectedQuickProductKey = 'canchan';
let quickSaleQty = 2;

function selectQuickProduct(key) {
  selectedQuickProductKey = key;
  document.getElementById('chip-canchan').classList.toggle('selected', key === 'canchan');
  document.getElementById('chip-amarilla').classList.toggle('selected', key === 'amarilla');
}

function changeQuickQty(delta) {
  quickSaleQty = Math.max(1, Math.min(20, quickSaleQty + delta));
  const qtyElem = document.getElementById('quick-qty-num');
  if (qtyElem) qtyElem.innerText = quickSaleQty;
}

function executeQuickSale() {
  if (inventoryState[selectedQuickProductKey].disponible >= quickSaleQty) {
    inventoryState[selectedQuickProductKey].disponible -= quickSaleQty;
    showToast(`⚡ ¡Venta rápida de ${quickSaleQty} sacos completada en 3.4 segundos! Stock sincronizado.`);
    jumpToScreen('mayorista', 0);
  } else {
    showToast('⚠️ Stock insuficiente para venta rápida.');
  }
}

// Slot Selection in C-2
function selectSlot(cardElem) {
  const cards = document.querySelectorAll('.slot-card');
  cards.forEach(c => c.classList.remove('selected'));
  cardElem.classList.add('selected');
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
          <div class="phone-status-bar" style="background: #000; padding: 6px 14px 0 14px;">
            <span>04:30 AM</span>
            <span style="font-size: 0.65rem; color: #10b981;"><i class="fa-solid fa-signal"></i> Galpón Local</span>
          </div>
          <div class="phone-viewport" style="height: calc(100% - 28px);">
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
      <div class="phone-status-bar">
        <span class="status-time">04:30</span>
        <div class="status-icons">
          <span class="offline-badge"><i class="fa-solid fa-satellite-dish"></i> Red Local Galpón</span>
          <i class="fa-solid fa-signal"></i>
          <i class="fa-solid fa-wifi"></i>
          <i class="fa-solid fa-battery-three-quarters"></i>
        </div>
      </div>
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

