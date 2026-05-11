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

  const resultsContainer = el("div", {
    class: "rooms-grid",
    style: { marginTop: "20px" },
  });

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
    el(
      "div",
      { class: "form-row" },
      formField("Data Inicial", dateStart),
      formField("Data Final", dateEnd),
    ),
    el(
      "div",
      { class: "form-row" },
      formField("Horário Inicial", timeStart),
      formField("Horário Final", timeEnd),
    ),
    formField("Tipo de Espaço", roomTypeSelect),
    formField("Finalidade", purposeInput),
    el(
      "div",
      { style: { display: "flex", justifyContent: "flex-end" } },
      btnSearch,
    ),
  );

  const content = el("div", { class: "content" }, formWrap, resultsContainer);
  render(page, topbar, content);
}

function formField(label, input) {
  return el(
    "div",
    { class: "form-group", style: { flex: 1 } },
    el(
      "label",
      {
        class: "form-label",
        style: {
          display: "block",
          marginBottom: "8px",
          fontSize: "13px",
          fontWeight: "500",
          color: "var(--text-secondary)",
        },
      },
      label,
    ),
    input,
  );
}