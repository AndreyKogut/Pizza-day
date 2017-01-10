import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const propTypes = {
  list: PropTypes.arrayOf(Object),
};

const defaultProps = {
  list: [],
};

const GroupsList = ({ list }) =>
  (<div className="mdl-grid">
    { list.map(group => (<div key={group._id} className="mdl-cell mdl-cell--4-col">
      <div className="group-card mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <img className="avatar" src={group.avatar} alt="" />
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <a
            href={FlowRouter.path('/groups/:id', { id: group._id })}
            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
          >
            { group.name }
          </a>
        </div>
      </div>
    </div>)) }
  </div>);

GroupsList.propTypes = propTypes;
GroupsList.defaultProps = defaultProps;

export default GroupsList;
