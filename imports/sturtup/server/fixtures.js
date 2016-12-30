class MenuItem {
  constructor() {
    this.name = `Name ${Math.floor(Math.random() * 50) + 1}`;
    this.description = `Name ${Math.floor(Math.random() * 50) + 1}`;
    this.mass = `${Math.floor((Math.random() * 2000) + 1)}g`;
    this.price = Math.floor((Math.random() * 100) + 1);
  }
}

export default MenuItem;
