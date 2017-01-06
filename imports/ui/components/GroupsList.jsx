import React, { PropTypes } from 'react';

const propTypes = {
  list: PropTypes.arrayOf(Object),
};

const defaultProps = {
  list: [],
};

const GroupsList = ({ list }) =>
  (<ul className="groups">
    { list.map(group => (<li key={group._id} className="groups__item">
      <a href={`groups/${group._id}`}>{ group.name }</a>
    </li>)) }
  </ul>);

GroupsList.propTypes = propTypes;
GroupsList.defaultProps = defaultProps;

export default GroupsList;
