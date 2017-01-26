import React, { Component, PropTypes } from 'react';
import MenuPickerFilter from '../filters/MenuPickerFilter';
import MenuPickerGlobalList from '../lists/MenuPickerGlobalList';

const propTypes = {
  getMenuList: PropTypes.func,
  hideItems: PropTypes.arrayOf(String),
};

const defaultProps = {
  hideItems: [],
};

class MenuPickerGlobal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        name: '',
        gte: 0,
        lte: Number.POSITIVE_INFINITY,
      },
      limiter: 30,
    };
  }

  setFilter = (filter) => {
    const filterObject = _.defaults(filter, {
      name: '',
      gte: 0,
      lte: Number.POSITIVE_INFINITY,
    });

    this.setState({ filter: filterObject });
  };

  render() {
    return (<div className="m-auto mb--30">
      <MenuPickerFilter changeCallback={(filter) => { this.setFilter(filter); }} />
      <MenuPickerGlobalList
        getMenuList={(value) => { this.props.getMenuList(value); }}
        hideItems={this.props.hideItems}
        filter={this.state.filter}
        limiter={this.state.limiter}
        updateLimiter={(value) => { this.setState({ limiter: value }); }}
      />
    </div>);
  }
}

MenuPickerGlobal.propTypes = propTypes;
MenuPickerGlobal.defaultProps = defaultProps;

export default MenuPickerGlobal;
