import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import MenuListItem from '../../ui/components/MenuListItem';
import MenuPickerFilter from '../../ui/components/MenuPickerFilter';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  getMenuList: PropTypes.func,
  withCounters: PropTypes.bool,
  selectedItems: PropTypes.instanceOf(Map),
};

const defaultProps = {
  getMenuList: () => {},
  selectedItems: new Map(),
};

class MenuPicker extends Component {
  constructor(props) {
    super(props);
    this.menu = this.props.selectedItems;
    this.state = {
      filteredList: null,
    };
  }

  getMenuItems = () => {
    let filteredData;

    if (!this.state.filteredList) {
      filteredData = this.props.items;
    } else {
      filteredData = this.state.filteredList;
    }

    return filteredData.map(
      ({ _id: id, ...itemInfo }) => (<li key={id} className="menu__item">
        <input
          type="checkbox"
          className="menu__checkbox"
          defaultChecked={this.props.selectedItems.has(id)}
          onChange={() => { this.addRemoveItem(id); }}
        />
        <MenuListItem
          name={itemInfo.name}
          description={itemInfo.description}
          mass={itemInfo.mass}
          price={itemInfo.price}
        />
        { this.props.withCounters ? <input
          type="number"
          className="menu__counter"
          ref={(val) => { this[id] = val; }}
          defaultValue={this.props.selectedItems.get(id) || 1}
          min="1"
          onChange={() => { this.changeCounter(id); }}
          max="10"
        /> : ''}
      </li>));
  };

  filterItems = ({ name = '', gte = 0, lte = Number.POSITIVE_INFINITY }) => {
    const filteredList = this.props.items.filter(
      item =>
        item.name.includes(name) &&
        item.price >= gte &&
        item.price <= lte,
    );

    this.setState({
      filteredList,
    });
  };

  changeCounter = (id) => {
    if (this.menu.has(id)) {
      this.menu.delete(id);
      this.menu.set(id, this[id] ? this[id].value : 1);

      if (this.props.withCounters) {
        const list = [];

        this.menu.forEach((value, key) => {
          list.push({ _id: key, count: Number(value) });
        });

        this.props.getMenuList(list);
      } else {
        this.props.getMenuList([...this.menu.keys()]);
      }
    }
  };

  addRemoveItem = (id) => {
    if (this.menu.has(id)) {
      this.menu.delete(id);
    } else {
      this.menu.set(id, this[id] ? this[id].value : 1);
    }

    if (this.props.withCounters) {
      const list = [];

      this.menu.forEach((value, key) => {
        list.push({ _id: key, count: Number(value) });
      });

      this.props.getMenuList(list);
    } else {
      this.props.getMenuList([...this.menu.keys()]);
    }
  };

  render() {
    return (<div className="menu">
      <MenuPickerFilter changeCallback={(filter) => { this.filterItems(filter); }} />
      <ul className="menu__list">
        { this.getMenuItems() }
      </ul>
    </div>);
  }
}

MenuPicker.propTypes = propTypes;
MenuPicker.defaultProps = defaultProps;

const MenuPickerContainer = createContainer(({ defaultValue = [], ...props }) => {
  const itemsMap = new Map();

  defaultValue.forEach((value) => {
    if (_.isObject(value)) {
      itemsMap.set(..._.values(value));
    } else {
      itemsMap.set(value, 1);
    }
  });

  return {
    selectedItems: itemsMap,
    ...props,
  };
}, MenuPicker);

export default MenuPickerContainer;
