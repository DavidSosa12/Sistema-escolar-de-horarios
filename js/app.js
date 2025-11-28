/* app.js: lógica completa (conflictos, charlas cards, editar, eliminar) */

/* DOM */
const listaGruposEl = document.getElementById("listaGrupos");
const panelHorario = document.getElementById("panelHorario");
const tituloGrupo = document.getElementById("tituloGrupo");
const fechaInput = document.getElementById("fecha");
const cuerpoTabla = document.getElementById("cuerpoTabla");

const grupoEditar = document.getElementById("grupoEditar");
const fechaEditar = document.getElementById("fechaEditar");
const listaActividades = document.getElementById("listaActividades");
const btnAgregarActividad = document.getElementById("btnAgregarActividad");
const nuevaHoraEl = document.getElementById("nuevaHora");
const nuevoEventoEl = document.getElementById("nuevoEvento");
const nuevoLugarEl = document.getElementById("nuevoLugar");
const selectCharlas = document.getElementById("selectCharlas");

const charlasDisponiblesEl = document.getElementById("charlasDisponibles");
const charlasImpartidasEl = document.getElementById("charlasImpartidas");

let grupoSeleccionado = null;

/* ---------- Init ---------- */
function init(){
  Object.keys(horarios).forEach(g => { if(!charlasImpartidas[g]) charlasImpartidas[g] = []; });
  renderGrupos();
  renderSelectCharlas();
  renderGruposEditor();
}
init();

/* ---------- Render grupos (panel) ---------- */
function renderGrupos(){
  listaGruposEl.innerHTML = "";
  Object.keys(horarios).forEach(g => {
    const btn = document.createElement("button");
    btn.textContent = g;
    btn.onclick = () => seleccionarGrupo(g);
    listaGruposEl.appendChild(btn);
  });
}

/* ---------- Seleccionar grupo (ver horario) ---------- */
function seleccionarGrupo(g){
  grupoSeleccionado = g;
  tituloGrupo.textContent = `Horario del grupo ${g}`;
  panelHorario.classList.remove("oculto");
  fechaInput.value = "";
  cuerpoTabla.innerHTML = "";
  grupoEditar.value = g;
  mostrarHistorialCharlasCards(g);
}

/* ---------- Mostrar horario por fecha ---------- */
fechaInput.addEventListener("change", () => {
  if(!grupoSeleccionado){ alert("Selecciona primero un grupo"); fechaInput.value = ""; return; }
  mostrarHorario(grupoSeleccionado, fechaInput.value);
});

function mostrarHorario(grupo, fecha){
  cuerpoTabla.innerHTML = "";
  if(!horarios[grupo] || !horarios[grupo][fecha]){
    cuerpoTabla.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#666;">No hay actividades programadas</td></tr>`;
    return;
  }
  const datos = horarios[grupo][fecha];
  datos.forEach(item => {
    const tr = document.createElement("tr");
    const charlaObj = detectarCharlaPorNombreExacto(item.evento);
    let eventoHtml = escapeHtml(item.evento);
    if(charlaObj){
      const hist = (charlasImpartidas[grupo] || []).find(c => c.id === charlaObj.id && c.fecha === fecha && c.hora === item.hora && c.lugar === item.lugar);
      if(hist){
        eventoHtml += `<br/><small style="color:#2b7be4">[Charla impartida]</small>`;
      } else {
        eventoHtml += `<br/><small style="color:#e14b4b">[Charla global — pendiente registro]</small>`;
      }
    }
    tr.innerHTML = `<td>${escapeHtml(item.hora)}</td><td>${eventoHtml}</td><td>${escapeHtml(item.lugar)}</td>`;
    cuerpoTabla.appendChild(tr);
  });
}

/* ---------- Select charlas ---------- */
function renderSelectCharlas(){
  selectCharlas.innerHTML = `<option value="">-- No usar charla --</option>`;
  actividadesGlobales.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nombre;
    selectCharlas.appendChild(opt);
  });
}

/* ---------- Editor: cargar grupos en select ---------- */
function renderGruposEditor(){
  grupoEditar.innerHTML = "";
  Object.keys(horarios).forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    grupoEditar.appendChild(opt);
  });
  mostrarActividadesEditar();
  mostrarHistorialCharlasCards(grupoEditar.value);
}

/* ---------- Mostrar actividades editables (día) ---------- */
fechaEditar.addEventListener("change", mostrarActividadesEditar);
grupoEditar.addEventListener("change", () => {
  mostrarActividadesEditar();
  mostrarHistorialCharlasCards(grupoEditar.value);
});

function mostrarActividadesEditar(){
  const grupo = grupoEditar.value;
  const fecha = fechaEditar.value;
  listaActividades.innerHTML = "";
  if(!grupo || !fecha){ listaActividades.innerHTML = `<p style="color:#666">Selecciona grupo y fecha</p>`; return; }
  const actividades = (horarios[grupo] && horarios[grupo][fecha]) ? horarios[grupo][fecha] : [];
  if(actividades.length === 0){ listaActividades.innerHTML = `<p style="color:#666">No hay actividades programadas para esta fecha.</p>`; return; }
  actividades.forEach((act, idx) => {
    const div = document.createElement("div");
    div.className = "actividad-item";
    const charlaObj = detectarCharlaPorNombreExacto(act.evento);
    const etiqueta = charlaObj ? `<small style="color:#2b7be4">Charla global</small>` : "";
    div.innerHTML = `
      <div class="meta"><strong>${escapeHtml(act.hora)}</strong> — ${etiqueta}</div>
      <div><label>Evento:</label><input id="evt_${idx}" value="${escapeHtml(act.evento)}"></div>
      <div><label>Lugar:</label><input id="lug_${idx}" value="${escapeHtml(act.lugar)}"></div>
      <div class="acciones">
        <button class="btn btn--primary btn--small" onclick="guardarEdicion(${idx})">Guardar</button>
        <button class="btn btn--danger btn--small" onclick="eliminarActividad(${idx})">Eliminar</button>
      </div>
    `;
    listaActividades.appendChild(div);
  });
}

/* ---------- Agregar actividad (con comprobaciones) ---------- */
btnAgregarActividad.addEventListener("click", () => {
  const grupo = grupoEditar.value;
  const fecha = fechaEditar.value;
  if(!grupo || !fecha){ alert("Selecciona grupo y fecha antes de agregar."); return; }

  const hora = nuevaHoraEl.value.trim();
  const eventoInput = nuevoEventoEl.value.trim();
  const lugar = nuevoLugarEl.value.trim();
  if(!hora || !eventoInput || !lugar){ alert("Rellena hora, evento y lugar."); return; }

  // determinar charla seleccionada (select o texto exacto)
  let actividadEvento = eventoInput;
  const charlaId = selectCharlas.value;
  let charlaObj = null;
  if(charlaId){
    charlaObj = actividadesGlobales.find(c => c.id === charlaId);
    if(charlaObj) actividadEvento = charlaObj.nombre;
  } else {
    const det = detectarCharlaPorNombreExacto(eventoInput);
    if(det) { charlaObj = det; actividadEvento = det.nombre; }
  }

  // si es charla y ya está impartida para el grupo: bloquear
  if(charlaObj){
    const ya = (charlasImpartidas[grupo] || []).find(c => c.id === charlaObj.id);
    if(ya){
      alert(`⚠️ La charla "${charlaObj.nombre}" ya fue impartida al grupo ${grupo}.\nFecha: ${ya.fecha}\nHora: ${ya.hora}\nLugar: ${ya.lugar}`);
      return;
    }
  }

  const nueva = { hora, evento: actividadEvento, lugar };

  // asegurar estructura
  if(!horarios[grupo]) horarios[grupo] = {};
  if(!horarios[grupo][fecha]) horarios[grupo][fecha] = [];

  // comprobar conflicto de hora
  const conflicto = horarios[grupo][fecha].find(a => a.hora === nueva.hora);
  if(conflicto){
    const reemplazar = confirm(
      `⚠ Ya hay una actividad en este horario:\n\n` +
      `🕒 ${conflicto.hora}\n📘 ${conflicto.evento}\n📍 ${conflicto.lugar}\n\n` +
      `¿Deseas reemplazarla por:\n\n` +
      `🕒 ${nueva.hora}\n📘 ${nueva.evento}\n📍 ${nueva.lugar}?`
    );
    if(!reemplazar){ alert("Operación cancelada."); return; }

    // si la actividad antigua era charla, eliminar registro en charlasImpartidas
    const charAnt = detectarCharlaPorNombreExacto(conflicto.evento);
    if(charAnt){
      const pos = (charlasImpartidas[grupo] || []).findIndex(c => c.id === charAnt.id && c.fecha === fecha && c.hora === conflicto.hora && c.lugar === conflicto.lugar);
      if(pos !== -1) charlasImpartidas[grupo].splice(pos,1);
    }

    const idx = horarios[grupo][fecha].indexOf(conflicto);
    horarios[grupo][fecha][idx] = nueva;
  } else {
    horarios[grupo][fecha].push(nueva);
  }

  // si la nueva es charla: registrar en charlasImpartidas
  const charlaDetectada = detectarCharlaPorNombreExacto(nueva.evento);
  if(charlaDetectada){
    charlasImpartidas[grupo] = charlasImpartidas[grupo] || [];
    charlasImpartidas[grupo].push({
      id: charlaDetectada.id,
      nombre: charlaDetectada.nombre,
      fecha: fecha,
      hora: nueva.hora,
      lugar: nueva.lugar,
      evento: nueva.evento
    });
  }

  // limpiar campos
  nuevaHoraEl.value = "";
  nuevoEventoEl.value = "";
  nuevoLugarEl.value = "";
  selectCharlas.value = "";

  alert("Actividad agregada/actualizada correctamente.");
  mostrarActividadesEditar();
  mostrarHistorialCharlasCards(grupo);
  if(grupoSeleccionado === grupo && fechaInput.value === fecha) mostrarHorario(grupo,fecha);
});

/* ---------- Guardar edición (actividad existente) ---------- */
function guardarEdicion(index){
  const grupo = grupoEditar.value;
  const fecha = fechaEditar.value;
  if(!grupo || !fecha) return;

  const evt = document.getElementById(`evt_${index}`).value.trim();
  const lug = document.getElementById(`lug_${index}`).value.trim();
  if(!evt || !lug){ alert("Evento y lugar no pueden quedar vacíos."); return; }

  const actividades = horarios[grupo][fecha];
  const antes = actividades[index];
  const antesChar = detectarCharlaPorNombreExacto(antes.evento);
  const despuesChar = detectarCharlaPorNombreExacto(evt);

  // si se convierte a charla: comprobar duplicado en historial
  if(!antesChar && despuesChar){
    const ya = (charlasImpartidas[grupo] || []).find(c => c.id === despuesChar.id);
    if(ya){
      alert(`No se puede convertir a "${despuesChar.nombre}" porque ya fue impartida anteriormente a este grupo.\nFecha: ${ya.fecha}`);
      return;
    }
    charlasImpartidas[grupo].push({
      id: despuesChar.id,
      nombre: despuesChar.nombre,
      fecha: fecha,
      hora: antes.hora,
      lugar: lug,
      evento: evt
    });
  }

  // si antes era charla y ahora no -> eliminar historial
  if(antesChar && !despuesChar){
    const pos = (charlasImpartidas[grupo] || []).findIndex(c => c.id === antesChar.id && c.fecha === fecha && c.hora === antes.hora && c.lugar === antes.lugar);
    if(pos !== -1) charlasImpartidas[grupo].splice(pos,1);
  }

  // si misma charla -> actualizar meta en historial
  if(antesChar && despuesChar && antesChar.id === despuesChar.id){
    const hist = (charlasImpartidas[grupo] || []).find(c => c.id === antesChar.id && c.fecha === fecha && c.hora === antes.hora && c.lugar === antes.lugar);
    if(hist){ hist.lugar = lug; hist.evento = evt; }
  }

  horarios[grupo][fecha][index].evento = evt;
  horarios[grupo][fecha][index].lugar = lug;

  alert("Cambios guardados.");
  mostrarActividadesEditar();
  mostrarHistorialCharlasCards(grupo);
  if(grupoSeleccionado === grupo && fechaInput.value === fecha) mostrarHorario(grupo,fecha);
}

/* ---------- Eliminar actividad ---------- */
function eliminarActividad(index){
  const grupo = grupoEditar.value;
  const fecha = fechaEditar.value;
  if(!grupo || !fecha) return;
  const actividades = horarios[grupo][fecha];
  const act = actividades[index];
  const charla = detectarCharlaPorNombreExacto(act.evento);

  if(charla){
    const pos = (charlasImpartidas[grupo] || []).findIndex(c => c.id === charla.id && c.fecha === fecha && c.hora === act.hora && c.lugar === act.lugar);
    if(pos !== -1) charlasImpartidas[grupo].splice(pos,1);
  }

  actividades.splice(index,1);
  if(actividades.length === 0) delete horarios[grupo][fecha];

  alert("Actividad eliminada.");
  mostrarActividadesEditar();
  mostrarHistorialCharlasCards(grupo);
  if(grupoSeleccionado === grupo && fechaInput.value === fecha) mostrarHorario(grupo,fecha);
}

/* ---------- Detectar charla por nombre exacto ---------- */
function detectarCharlaPorNombreExacto(text){
  if(!text) return null;
  return actividadesGlobales.find(c => c.nombre.toLowerCase() === text.trim().toLowerCase()) || null;
}

/* ---------- Mostrar charlas como cards (disponibles / impartidas) ---------- */
function mostrarHistorialCharlasCards(grupo){
  // disponibles = actividadesGlobales menos las que figuran en charlasImpartidas[grupo]
  const impartidasArr = (charlasImpartidas[grupo] || []);
  const impartidasIds = impartidasArr.map(c => c.id);
  const disponibles = actividadesGlobales.filter(c => !impartidasIds.includes(c.id));
  // Render disponibles
  charlasDisponiblesEl.innerHTML = "";
  if(disponibles.length === 0){
    charlasDisponiblesEl.innerHTML = `<div style="color:#666;padding:8px">No hay charlas disponibles para este grupo.</div>`;
  } else {
    disponibles.forEach(c => {
      const div = document.createElement("div");
      div.className = "charla-card disponible";
      div.innerHTML = `<div class="title">${escapeHtml(c.nombre)}</div><div class="meta">Pendiente</div>`;
      charlasDisponiblesEl.appendChild(div);
    });
  }
  // Render impartidas (en orden de registro)
  charlasImpartidasEl.innerHTML = "";
  if(impartidasArr.length === 0){
    charlasImpartidasEl.innerHTML = `<div style="color:#666;padding:8px">No se han registrado charlas impartidas para este grupo.</div>`;
  } else {
    impartidasArr.forEach(item => {
      const div = document.createElement("div");
      div.className = "charla-card impartida";
      div.innerHTML = `<div class="title">${escapeHtml(item.nombre)}</div><div class="meta">Fecha: ${escapeHtml(item.fecha)} — Hora: ${escapeHtml(item.hora)} — Lugar: ${escapeHtml(item.lugar)}</div>`;
      charlasImpartidasEl.appendChild(div);
    });
  }
}

/* ---------- Util ---------- */
function escapeHtml(str){
  if(!str) return "";
  return (""+str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
