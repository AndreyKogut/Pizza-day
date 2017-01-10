import React from 'react';
import HeaderContainer from './components/Header';
import Footer from './components/Footer';

const propTypes = {
  content: React.PropTypes.func,
};

function App({ content = () => {} }) {
  return (<div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <HeaderContainer />

    <main className="mdl-layout__content">
      { content() }
    </main>

    <Footer />
  </div>);
}

App.propTypes = propTypes;

export default App;
