class Favorites {
  constructor() {
    this.tickets = {};
  }

  addTicketToFavoritesList(id, ticket) {
    this.tickets[id] = ticket;
  }

  deleteTicketFromFavorites(id) {
    delete this.tickets[id];
  }
}

const favorites = new Favorites();

export default favorites;
