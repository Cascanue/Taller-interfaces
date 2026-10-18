# Ecosistema Digital de Trazabilidad Comercial y Gestión Logística para Mercados Mayoristas
## Interfaces Móviles de Alta Fidelidad para Demostración y Capturas (Mercado La Hermelinda, Trujillo)

**Universidad Privada Antenor Orrego (UPAO) — Facultad de Ingeniería**  
**Escuela de Ingeniería de Sistemas e Inteligencia Artificial**  
*Curso:* Taller de Creatividad, Innovación y Emprendimiento (2026-20)  
*Docente:* Chávez Fernández, Edilberto Cesar  
*Autores (Grupo 4):*  
- Chavez Romero, Diego Carlo Jaren  
- Morales Linares, Victor Manuel  
- Vasquez Marquina, Yair Asael  

---

## 🎯 Objetivo de este Entregable

Este entorno web interactivo fue desarrollado para generar las **interfaces móviles del Producto Mínimo Viable (MVP)** fundamentadas rigurosamente en el informe de investigación del Grupo 4. 

Las pantallas han sido diseñadas con un nivel de realismo y fidelidad visual listo para:
1. **Capturas de pantalla directas en alta resolución** para insertar en diapositivas (PowerPoint, Canva, etc.).
2. **Demostración interactiva en vivo** durante la exposición ante el docente y el jurado, simulando el comportamiento real de la aplicación a las 4:30 AM en La Hermelinda.

---

## 📱 Pantallas Diseñadas y su Fundamentación UX

El ecosistema se divide en dos perfiles clave que interactúan sinérgicamente:

### 1. Perfil Mayorista (Vendedor de Puesto — Puesto 104, Galpón Tubérculos)
*Contexto:* 4:30 AM, ruido intenso, iluminación tenue, manos sucias por manipulación de sacos y prisa operativa.

* **M-1: Semáforo Logístico y Turnos de Rampa (Home Principal)**
  * *Hallazgo:* **H-01** (Caos vehicular y bloqueo de pasillos) y **H-06** (Falta de sincronización).
  * *Diseño:* Semáforo visual en tiempo real (**🟢 RAMPA LIBRE / PASAJE DESPEJADO**). Muestra el vehículo en rampa actual (Toyota Hilux `T4B-821` de Carlos Mendoza) con tiempo restante, y la cola virtual de los siguientes vehículos (05:20 y 05:40 AM) para evitar atascos en Pasaje 12.
* **M-2: Control Rápido de Stock en Rampa (Manos Ocupadas)**
  * *Hallazgo:* **H-02** (Descuadre por cuadernos manchados) y **H-03** (Fricción por interfaces complejas).
  * *Diseño:* Tarjetas de alto contraste con botones táctiles gigantes (`[-10]`, `[-1]`, `[+10]`, `[+50]`) de más de 48px de altura. Diferenciación visual clara entre *Stock Libre* y *Stock Reservado en Turnos*.
* **M-3: Modal de Venta Rápida de Mostrador (< 10 segundos)**
  * *Hallazgo:* **H-03** y **H-06** (Atención simultánea a clientes a pie).
  * *Diseño:* Permite descontar 1 o 2 sacos a caseros presenciales en solo 2 toques y menos de 4 segundos con cronómetro en pantalla. **Aviso explícito:** Cero pasarela financiera, sin datos tributarios de SUNAT, respetando el pago en efectivo o Yape directo.
* **M-4: Escáner QR de Turno en Rampa (< 5 segundos)**
  * *Hallazgo:* **H-03** y **H-05** (Pérdida de señal de internet en galpones con calamina).
  * *Diseño:* Visor de cámara con mira láser que detecta el código QR offline del comprador y asocia de inmediato la placa de la camioneta y la cantidad de sacos a entregar.
* **M-5: Confirmación de Despacho y Descuento Automático**
  * *Hallazgo:* **H-01** y **H-02** (Meta de despacho en menos de 5 minutos).
  * *Diseño:* Confirmación visual con tiempo cronometrado (3m 42s), descuento automático de inventario (-40 sacos) y cambio automático del semáforo a libre para el siguiente turno.

---

### 2. Perfil Minorista / Bodeguero (Carlos Mendoza, 45 años, Minimarket El Sol)
*Contexto:* Sale de madrugada en su camioneta; busca asegurar mercadería sin esperar 2 horas atrapado en el tráfico interno.

* **C-1: Catálogo y Disponibilidad de Stock en Tiempo Real**
  * *Hallazgo:* Fase 2 del Customer Journey (Búsqueda y Reserva).
  * *Diseño:* Vista de puestos verificados a las 04:00 AM, precios referenciales por saco de 50kg y puerta de acceso recomendada (Puerta 8).
* **C-2: Reserva de Mercadería y Selección de Franja Horaria (Slot Vehicular)**
  * *Hallazgo:* **H-01** (Turnos virtuales) y **H-04** (Rechazo a comisiones financieras).
  * *Diseño:* Selección de franjas horarias de 20 minutos (`05:00 - 05:20 AM`) con semáforo de congestión y registro de placa vehicular. Cero cobro de comisiones en la app (el pago se hace al recoger).
* **C-3: Pase Logístico Digital con Código QR Offline (Boarding Pass)**
  * *Hallazgo:* **H-05** (Operación 100% offline dentro de galpones).
  * *Diseño:* Boleto digital de alto contraste con código QR encriptado, indicaciones de ruta interna (*Puerta 8 -> Pasaje 12 -> Puesto 104*). Válido ante vigilancia y estibadores.
* **C-4: Dashboard de Ahorro y Calificación de Agilidad**
  * *Hallazgo:* Fase 6 del Customer Journey (Fidelización y Métricas).
  * *Diseño:* Muestra el impacto acumulado del minorista: **14.5 horas de tráfico ahorradas al mes** y reducción de permanencia de 2h 15m a 18 minutos.

---

## 🚀 Cómo Ejecutar y Usar el Prototipo

El servidor local ya se encuentra corriendo en segundo plano en el puerto `5173`.

### 1. Abrir en tu Navegador
Abre cualquier navegador (Chrome, Edge, Brave, etc.) e ingresa a:
```
http://localhost:5173
```
*(Si en algún momento cierras la terminal, simplemente ejecuta `node server.js` en esta carpeta).*

### 2. Controles de Pantalla y Temas:
* **📺 Modo Solo Celular (Presentación Limpia):**  
  Presiona el botón **"Solo Celular"** en el encabezado o en los controles de navegación (o presiona la tecla **`Esc`**). Se ocultan de inmediato la barra superior, la columna izquierda y la derecha. En el centro queda exclusivamente el teléfono celular con una **barra flotante superior** para cambiar de perfil (Mayorista/Minorista), avanzar de pantalla (1, 2, 3, 4, 5) o alternar temas sin distracciones.
* **☀️ Modo Claro vs 🌙 Modo Oscuro vs ⚡ Alto Contraste:**  
  En el encabezado puedes elegir entre:
  * **Oscuro:** Estilo nocturno moderno con tonos slate y acentos esmeralda.
  * **Claro:** Fondo blanco nítido, tipografía oscura y sombras suaves, perfecto para proyectar con luz de día en el aula.
  * **Alto Contraste:** Fondo negro absoluto con verde neón y amarillo brillante, derivado directamente del **informe UPAO (Tablas 7 y 8)** para operar a oscuras en los galpones a las 4:30 AM.

### 3. Modo Captura Limpia (Para Diapositivas):
1. En el simulador, presiona el botón **"Modo Captura Limpia (PPT)"** o entra a **"Solo Celular"**.
2. Presiona el atajo de Windows: **`Win + Shift + S`** y recorta el teléfono para pegarlo directamente en tu presentación de PowerPoint o Canva.
3. Puedes alternar a **Modo Claro** si tu plantilla de diapositivas tiene fondo blanco, o a **Modo Oscuro** si tus diapositivas son oscuras.

---

## 🔍 ¿Para Qué Sirve la Pantalla Número 5 (M-5 y C-4)?

Durante la exposición, es fundamental que expliques por qué existen estas pantallas de cierre:

### 1. Pantalla M-5 (Mayorista): "Confirmación de Despacho y Descuento Automático"
* **¿Qué representa en la vida real?:**  
  Es la pantalla que aparece en el celular de Don Pepe en el instante en que el estibador termina de subir los 40 sacos a la camioneta de Carlos Mendoza.
* **Las 3 funciones vitales que cumple:**
  1. **Descuenta el inventario automáticamente:** Resta -30 sacos de Papa Canchán y -10 de Papa Amarilla en tiempo real, eliminando el uso de cuadernos manchados de madrugada (**Hallazgo H-02**).
  2. **Libera el semáforo de rampa:** Cambia el estado a 🟢 *Rampa Libre* para habilitar el ingreso del siguiente camión programado para las **05:20 AM** (Bodega El Porvenir, placa `M3E-914`), evitando que los vehículos se solapen en el pasillo (**Hallazgo H-01**).
  3. **Comprueba el KPI del informe (Tabla 19):** Muestra el cronómetro en **3m 42s**, demostrando que el despacho se realizó en **menos de 5 minutos** (meta fijada en el informe del proyecto).

### 2. Pantalla C-4 (Minorista): "Métricas de Ahorro y Calificación de Experiencia"
* **¿Qué representa en la vida real?:**  
  Corresponde a la **Fase 6 del Customer Journey Map (Evaluación y Fidelización)** del informe (Tabla 11, pág. 20 y Tabla 23, pág. 39).
* **Las 2 funciones que cumple:**
  1. **Evidencia el ahorro de tiempo:** Muestra a Carlos Mendoza el beneficio tangible del sistema: **14.5 horas de tráfico ahorradas al mes** y una permanencia de solo **18 minutos** (frente a las 2 horas y 15 minutos que solía perder atascado con el motor encendido).
  2. **Calificación de agilidad (NPS):** Permite calificar con 5 estrellas la rapidez del puesto mayorista para mantener la calidad del servicio logístico en el mercado.

---

## 🏆 Consejos Clave para la Exposición ante el Docente

1. **Destaca el giro estratégico del Doble Diamante:**  
   Recuérdale al profesor que el equipo no empezó proponiendo "una app con pagos", sino que al aplicar el **Mapa de Empatía** descubrieron el temor a la fiscalización (SUNAT) y a las comisiones. Por eso, el sistema se acotó estrictamente a un **Semáforo Logístico** (reservas y pases), dejando el cobro tradicional intacto.
2. **Explica la causa raíz de los 5 Porqués:**  
   El embotellamiento vehicular en La Hermelinda no se debe únicamente a falta de espacio físico, sino a la falta de sincronización del despacho (los camiones llegan juntos y los estibadores buscan a los compradores a pie).
3. **Muestra el botón de Venta Rápida (< 10s):**  
   Durante la demo, dale clic a *"Simular Venta Rápida"* para demostrar que la aplicación no interrumpe el flujo normal del comerciante cuando un cliente al paso le pide 2 sacos en efectivo.

