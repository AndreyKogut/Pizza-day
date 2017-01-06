import React, { PropTypes } from 'react';

const propTypes = {
  changeCallback: PropTypes.func,
};

const MenuPickerFilter = ({ changeCallback }) => {
  const changeFields = () => {
    const name = this.itemName.value;
    const gte = this.gte.value ? this.gte.value : undefined;
    const lte = this.lte.value ? this.lte.value : undefined;

    changeCallback({ name, gte, lte });
  };

  const validateNumber = (event) => {
    if (!Number(event.key) && event.key !== '0' && event.key) {
      event.preventDefault();
    }
  };

  return (<div className="user-picker__filter">
    <label
      htmlFor="name"
      className="user-picker__label"
    >Name:</label>
    <input
      type="text"
      ref={(item) => { this.itemName = item; }}
      onChange={changeFields}
      className="user-picker__input clear-defaults"
      id="name"
    />
    <label
      htmlFor="gte"
      className="user-picker__label"
    >Price greater:</label>
    <input
      type="number"
      min="1"
      defaultValue={null}
      ref={(item) => { this.gte = item; }}
      onKeyPress={validateNumber}
      onChange={changeFields}
      className="user-picker__input clear-defaults"
      id="gte"
    />
    <label
      htmlFor="lte"
      className="user-picker__label"
    >Price less:</label>
    <input
      type="number"
      min="1"
      defaultValue={null}
      ref={(item) => { this.lte = item; }}
      onKeyPress={validateNumber}
      onChange={changeFields}
      className="user-picker__input clear-defaults"
      id="lte"
    />
  </div>);
};

MenuPickerFilter.propTypes = propTypes;

export default MenuPickerFilter;
