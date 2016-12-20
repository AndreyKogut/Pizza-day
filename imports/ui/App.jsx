import React from 'react';
import HeaderContainer from '../ui/Header';
import Footer from '../ui/Footer';

const App = ({ content = () => null }) => (
  <div className="app-container">
    { <HeaderContainer /> }

    <div className="content">
      { content() }
    </div>

    { <Footer /> }
  </div>);

App.propTypes = {
  content: React.PropTypes.func,
};

export default App;
