import React, { PropTypes } from 'react';

const propTypes = {
  changeCallback: PropTypes.func,
};

const MenuPickerFilter = ({ changeCallback }) => {
  const changeFields = () => {
    const name = this.itemName.value;
    const gte = this.gte.value ? Number(this.gte.value) : undefined;
    const lte = this.lte.value ? Number(this.lte.value) : undefined;

    changeCallback({ name, gte, lte });
  };

  const validateNumber = (event) => {
    if (!Number(event.key) && event.key !== '0' && event.key) {
      event.preventDefault();
    }
  };

  return (<div className="mdl-grid">
    <div className="ta-c mdl-cell mdl-cell--4-col">
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label
          htmlFor="name"
          className="mdl-textfield__label"
        >Name:</label>
        <input
          type="text"
          ref={(item) => { this.itemName = item; }}
          onChange={changeFields}
          className="mdl-textfield__input"
          id="name"
        />
      </div>
    </div>
    <div className="ta-c mdl-cell mdl-cell--4-col">
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label
          htmlFor="gte"
          className="mdl-textfield__label"
        >Price greater:</label>
        <input
          type="number"
          min="1"
          defaultValue={null}
          ref={(item) => { this.gte = item; }}
          onKeyPress={validateNumber}
          onChange={changeFields}
          className="mdl-textfield__input"
          id="gte"
        />
      </div>
    </div>
    <div className="ta-c mdl-cell mdl-cell--4-col">
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label
          htmlFor="lte"
          className="mdl-textfield__label"
        >Price less:</label>
        <input
          type="number"
          min="1"
          defaultValue={null}
          ref={(item) => { this.lte = item; }}
          onKeyPress={validateNumber}
          onChange={changeFields}
          className="mdl-textfield__input"
          id="lte"
        />
      </div>
    </div>
  </div>);
};

MenuPickerFilter.propTypes = propTypes;

export default MenuPickerFilter;
