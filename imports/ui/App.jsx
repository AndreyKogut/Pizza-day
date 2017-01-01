import React from 'react';
import HeaderContainer from './components/Header';
import Footer from './components/Footer';

const propTypes = {
  content: React.PropTypes.func,
};

function App({ content = () => {} }) {
  return (<div className="app-container">
    <HeaderContainer />

    <div className="content">
      { content() }
    </div>

    <Footer />
  </div>);
}

App.propTypes = propTypes;

export default App;
