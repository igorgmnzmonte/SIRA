// src/modules/novaReserva.js
import { el, render, btn, toast } from "../utils/dom.js";
import { createModal, openModal, closeModal } from "../components/modal.js";
import {
  getRooms,
  saveRooms,
  getReservations,
  saveReservations,
  getApprovals,
  saveApprovals,
  genId,
  CURRENT_USER,
} from "../data/store.js";

export function renderNovaReserva(page) {
  const topbar = el(
    "div",
    { class: "topbar" },
    el("span", { class: "topbar-title" }, "Nova Reserva"),
  );

  const dateStart = el("input", { type: "date", class: "form-input" });
  const dateEnd = el("input", { type: "date", class: "form-input" });
  const timeStart = el("input", { type: "time", class: "form-input" });
  const timeEnd = el("input", { type: "time", class: "form-input" });

  const recurSim = el("input", { type: "radio", name: "recurrence", value: "sim" });
  const recurNao = el("input", { type: "radio", name: "recurrence", value: "nao", checked: true });

  const weekDaysContainer = el("div", { style: { display: "none", gap: "8px", marginTop: "10px" } });

  const roomTypeSelect = el(
    "select",
    { class: "form-input" },
    el("option", { value: "" }, "Todos os tipos"),
    el("option", { value: "Sala" }, "Sala"),
    el("option", { value: "Laboratório" }, "Laboratório"),
    el("option", { value: "Auditório" }, "Auditório"),
  );

  const purposeInput = el("textarea", {
    class: "form-input",
    rows: "2",
    placeholder: "Ex: Aula Magna...",
  });

  const resultsContainer = el("div", { class: "rooms-grid", style: { marginTop: "20px" } });

  const btnSearch = btn("Buscar Salas", "btn-primary", (e) => {
    e.preventDefault();
    searchRooms(roomTypeSelect.value, resultsContainer, {
      dateStart: dateStart.value,
      timeStart: timeStart.value,
      timeEnd: timeEnd.value,
      purpose: purposeInput.value,
    });
  });

  const formWrap = el(
    "div",
    {
      class: "card",
      style: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "800px",
        margin: "0 auto",
      },
    },
    el("div", { class: "form-row" },
      formField("Data Inicial", dateStart),
      formField("Data Final", dateEnd),
    ),
    el("div", { class: "form-row" },
      formField("Horário Inicial", timeStart),
      formField("Horário Final", timeEnd),
    ),
    formField(
      "Deseja recorrência?",
      el("div", { style: { display: "flex", gap: "16px" } },
        el("label", { style: { display: "flex", alignItems: "center", gap: "4px" } }, recurSim, "Sim"),
        el("label", { style: { display: "flex", alignItems: "center", gap: "4px" } }, recurNao, "Não"),
      ),
    ),
    weekDaysContainer,
    formField("Tipo de Espaço", roomTypeSelect),
    formField("Finalidade", purposeInput),
    el("div", { style: { display: "flex", justifyContent: "flex-end" } }, btnSearch),
  );

  const content = el("div", { class: "content" }, formWrap, resultsContainer);
  render(page, topbar, content);
}

function formField(label, input) {
  return el(
    "div",
    { class: "form-group", style: { flex: 1 } },
    el("label", {
      class: "form-label",
      style: {
        display: "block",
        marginBottom: "8px",
        fontSize: "13px",
        fontWeight: "500",
        color: "var(--text-secondary)",
      },
    }, label),
    input,
  );
}

function parseTimeStr(tStr) {
  let clean = tStr.trim().toLowerCase();
  if (clean.includes("h")) {
    clean = clean.replace("h", ":");
    if (clean.endsWith(":")) clean += "00";
  }
  const [h, m] = clean.split(":");
  return parseInt(h || 0) * 60 + parseInt(m || 0);
}

function searchRooms(type, container, formData) {
  render(container, "");
  let rooms = getRooms();
  if (type) {
    rooms = rooms.filter((r) => r.type === type);
  }

  if (formData.dateStart && formData.timeStart && formData.timeEnd) {
    const [y, m, d] = formData.dateStart.split("-");
    const formattedDate = `${d}/${m}`;
    const startMins = parseTimeStr(formData.timeStart);
    const endMins = parseTimeStr(formData.timeEnd);

    if (startMins >= endMins) {
      toast("O horário final deve ser maior que o inicial.", "error");
      return;
    }

    const allRes = getReservations();
    rooms = rooms.filter((room) => {
      const roomRes = allRes.filter(
        (res) =>
          res.room === room.name &&
          res.date === formattedDate &&
          res.status !== "rejected",
      );
      const hasOverlap = roomRes.some((res) => {
        let tStr = res.time;
        tStr = tStr.replace("–", "-");
        const [t1, t2] = tStr.split("-");
        const resStart = parseTimeStr(t1);
        const resEnd = parseTimeStr(t2);
        return startMins < resEnd && endMins > resStart;
      });
      return !hasOverlap;
    });
  }

  if (rooms.length === 0) {
    container.appendChild(el("div", {}, "Nenhuma sala encontrada para este tipo."));
    return;
  }

  rooms.forEach((r) => {
    const card = el(
      "div",
      {
        class: "room-card",
        style: {
          padding: "16px",
          border: "1px solid var(--border-light)",
          borderRadius: "8px",
          background: "var(--bg-primary)",
          cursor: "pointer",
        },
        onClick: () => showRoomDetailsModal(r, formData),
      },
      el("div", { style: { fontSize: "15px", fontWeight: "600", marginBottom: "8px" } }, r.name),
      el("div", { style: { fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "12px" } },
        `Capacidade: ${r.capacity} · Bloco: ${r.block}`,
      ),
      btn("Reservar", "btn-primary btn-sm", (e) => {
        e.stopPropagation();
        performReservation(r, formData);
      }),
    );
    container.appendChild(card);
  });
}

function showRoomDetailsModal(room, formData) {
  const hasTime = formData.dateStart && formData.timeStart && formData.timeEnd;
  const statusBadgeInfo = hasTime
    ? { bg: "#E6F4EA", col: "#166534", text: "Disponível no horário solicitado" }
    : { bg: "#E2E8F0", col: "#475569", text: "Preencha o horário para confirmar disponibilidade" };

  const statusBadge = el("span", {
    style: {
      display: "inline-block",
      background: statusBadgeInfo.bg,
      color: statusBadgeInfo.col,
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
    },
  }, statusBadgeInfo.text);

  const body = el("div", {
    style: { display: "flex", flexDirection: "column", gap: "12px", padding: "8px 0" },
  },
    statusBadge,
    el("div", { style: { fontSize: "14px" } }, el("strong", {}, "Tipo: "), room.type),
    el("div", { style: { fontSize: "14px" } }, el("strong", {}, "Capacidade: "), `${room.capacity} pessoas`),
    el("div", { style: { fontSize: "14px" } }, el("strong", {}, "Localização: "), room.block),
    el("div", { style: { fontSize: "14px" } }, el("strong", {}, "Recursos: "), room.resources ? room.resources.join(", ") : "Nenhum"),
  );

  createModal({
    id: "modal-room-details",
    title: `Detalhes: ${room.name}`,
    body,
    actions: [
      { label: "Fechar", onClick: () => closeModal("modal-room-details") },
      {
        label: "Reservar",
        primary: true,
        onClick: () => {
          closeModal("modal-room-details");
          performReservation(room, formData);
        },
      },
    ],
  });

  openModal("modal-room-details");
}

function performReservation(room, formData) {
  if (!formData.dateStart || !formData.timeStart || !formData.timeEnd || !formData.purpose) {
    toast("Preencha data, horários e finalidade antes de reservar.", "error");
    return;
  }

  const [y, m, d] = formData.dateStart.split("-");
  const formattedDate = `${d}/${m}`;
  const startMins = parseTimeStr(formData.timeStart);
  const endMins = parseTimeStr(formData.timeEnd);

  if (startMins >= endMins) {
    toast("O horário final deve ser maior que o inicial.", "error");
    return;
  }

  const allRes = getReservations();
  const roomRes = allRes.filter(
    (res) =>
      res.room === room.name &&
      res.date === formattedDate &&
      res.status !== "rejected",
  );

  const hasOverlap = roomRes.some((res) => {
    let tStr = res.time.replace("–", "-");
    const [t1, t2] = tStr.split("-");
    const resStart = parseTimeStr(t1);
    const resEnd = parseTimeStr(t2);
    return startMins < resEnd && endMins > resStart;
  });

  if (hasOverlap) {
    toast("A sala já possui uma reserva nesse horário. Por favor atualize a busca.", "error");
    return;
  }

  const formattedTime = `${formData.timeStart}–${formData.timeEnd}`;
  const genResId = genId("res");

  saveReservations([
    ...getReservations(),
    {
      id: genResId,
      room: room.name,
      date: formattedDate,
      time: formattedTime,
      purpose: formData.purpose,
      requester: CURRENT_USER.name,
      requesterEmail: CURRENT_USER.email,
      status: "pending",
      read: true,
    },
  ]);

  const allRooms = getRooms();
  saveRooms(allRooms.map((r) => r.name === room.name ? { ...r, status: "reserved" } : r));

  saveApprovals([
    ...getApprovals(),
    {
      id: "ap_" + genResId,
      room: room.name,
      date: formattedDate,
      time: formattedTime,
      purpose: formData.purpose,
      requester: CURRENT_USER.name,
      requesterEmail: CURRENT_USER.email,
      level: "1º nível",
      read: false,
    },
  ]);

  toast("Sucesso! Sua reserva foi enviada para aprovação.", "success");
  if (window.updateSidebarBadges) window.updateSidebarBadges();
  window.navigatePage("reservas");
}

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const dayButtons = days.map((d) => {
  const b = el("button", { class: "btn btn-sm", style: { minWidth: "40px" } }, d);
  b.dataset.selected = "false";
  b.addEventListener("click", (e) => {
    e.preventDefault();
    const isSel = b.dataset.selected === "true";
    b.dataset.selected = isSel ? "false" : "true";
    b.style.backgroundColor = isSel ? "" : "var(--accent)";
    b.style.color = isSel ? "" : "#fff";
  });
  return b;
});
dayButtons.forEach((b) => weekDaysContainer.appendChild(b));

recurSim.addEventListener("change", () => (weekDaysContainer.style.display = "flex"));
recurNao.addEventListener("change", () => (weekDaysContainer.style.display = "none"));