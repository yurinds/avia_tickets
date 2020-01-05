import "../css/style.css";
import "./plugins";
import locations from "./store/locations";
import favorites from "./store/favorites";
import formUI from "./views/form";
import ticketsUI from "./views/tickets";
import currencyUI from "./views/currency";
import favoritesUI from "./views/favorites";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  const form = formUI.form;
  const ticketsContainer = ticketsUI.container;
  const favoritesContainer = favoritesUI.favoritesContainer;

  // Events
  form.addEventListener("submit", event => {
    event.preventDefault();

    onFormSubmit();
  });

  ticketsContainer.addEventListener("click", onAddTicketToFavorite);

  favoritesContainer.addEventListener("click", onDeleteFromFavorites);

  // Handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  async function onFormSubmit() {
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency
    });

    ticketsUI.renderTickets(locations.lastSearch);
  }

  function onAddTicketToFavorite({ target }) {
    if (target.tagName !== "A") return;

    const ticketIdField = target.closest("[data-ticket-id]");
    if (!ticketIdField) return;

    const ticketId = ticketIdField.dataset.ticketId;
    const ticket = locations.getTicketByToken(ticketId);

    favorites.addTicketToFavoritesList(ticketId, ticket);

    favoritesUI.renderFavorites(favorites.tickets);
  }

  function onDeleteFromFavorites({ target }) {
    if (target.tagName !== "A") return;

    const ticketIdField = target.closest("[data-ticket-id]");
    if (!ticketIdField) return;

    const ticketId = ticketIdField.dataset.ticketId;

    favorites.deleteTicketFromFavorites(ticketId);

    favoritesUI.renderFavorites(favorites.tickets);
  }
});
