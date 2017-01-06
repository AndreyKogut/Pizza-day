function MenuItem() {
  return {
    name: `Name ${Math.floor(Math.random() * 50) + 1}`,
    description: `Name ${Math.floor(Math.random() * 50) + 1}`,
    mass: `${Math.floor((Math.random() * 2000) + 1)}g`,
    price: Math.floor((Math.random() * 100) + 1),
  };
}

export default MenuItem;
