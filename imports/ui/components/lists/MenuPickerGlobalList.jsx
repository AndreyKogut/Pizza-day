import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { menuSubsManager } from '../../../lib/subsManager';
import Menu from '../../../api/menu/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  menuLoading: PropTypes.bool,
  getMenuList: PropTypes.func,
  updateLimiter: PropTypes.func,
  notLoaded: PropTypes.bool,
  limiter: PropTypes.number,
};

const defaultProps = {
  items: [],
  updateLimiter: () => {},
};

const MenuPickerGlobalList = (props) => {
  const pickedItems = new Set();

  function addRemoveItem(id) {
    if (pickedItems.has(id)) {
      pickedItems.delete(id);
    } else {
      pickedItems.add(id);
    }

    props.getMenuList([...pickedItems.keys()]);
  }

  function getMenuItems() {
    return props.items.map(
      ({ _id: id, ...itemInfo }) => (<tr key={id} className="menu__item">
        <td>
          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={id}>
            <input
              defaultChecked={false}
              onChange={() => { addRemoveItem(id); }}
              type="checkbox"
              id={id}
              className="mdl-checkbox__input"
            />
          </label>
        </td>
        <td className="menu__name">{ itemInfo.name }.</td>
        <td className="menu__description">{ itemInfo.description }</td>
        <td className="menu__mass">{ itemInfo.mass }</td>
        <td className="menu__price">{ itemInfo.price }</td>
      </tr>));
  }

  function scrollBottom(event) {
    if (props.notLoaded) {
      const scrollPosition = event.target.scrollTop;
      const maxScrollHeight = event.target.scrollHeight - event.target.offsetHeight;
      if (scrollPosition >= maxScrollHeight) {
        props.updateLimiter(props.limiter + 20);
      }
    }
  }

  return (<div className="mdl-grid">
    <div className="table-container menu-static" onScroll={scrollBottom}>
      <table className="table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th>Pick</th>
            <th className="mdl-data-table__cell--non-numeric">Name</th>
            <th>Description</th>
            <th>Weight</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          { getMenuItems() }
        </tbody>
      </table>
      { props.menuLoading && <div className="spinner mdl-spinner mdl-js-spinner is-active" /> }
    </div>
  </div>);
};

MenuPickerGlobalList.propTypes = propTypes;
MenuPickerGlobalList.defaultProps = defaultProps;

const MenuPickerGlobalListContainer =
  createContainer(({ hideItems = [], getMenuList, filter, limiter, ...props }) => {
    const handleMenu = menuSubsManager.subscribe('MenuFiltered', { hideItems, filter, limiter });
    const menuItems = Menu.find({
      _id: { $nin: hideItems },
      name: { $regex: `.*${filter.name}.*` },
      price: { $gte: filter.gte, $lte: filter.lte },
    }).fetch();

    return {
      ...props,
      limiter,
      notLoaded: menuItems.length >= limiter,
      items: menuItems,
      getMenuList,
      menuLoading: !handleMenu.ready(),
    };
  }, MenuPickerGlobalList);

export default MenuPickerGlobalListContainer;
