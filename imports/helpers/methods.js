function handleMethodsCallbacks(handledFunction = () => {}) {
  return (err, res) => {
    if (err) {
      switch (err.error) {
        case 500: {
          console.log('Service unavailable');
          break;
        }
        default: {
          console.log(err);
        }
      }
    } else {
      handledFunction(res);
    }
  };
}

export default handleMethodsCallbacks;
