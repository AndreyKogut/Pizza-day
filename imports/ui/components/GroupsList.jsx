import React, { PropTypes } from 'react';

const propTypes = {
  list: PropTypes.arrayOf(Object),
};

const defaultProps = {
  list: [],
};

function GroupsList({ list }) {
  function getGroups() {
    return list.map(group => (<li key={group._id} className="groups__item">
      <a href={`groups/${group._id}`}>{ group.name }</a>
    </li>),
    );
  }

  return (<ul className="groups">
    { getGroups() }
  </ul>);
}

GroupsList.propTypes = propTypes;
GroupsList.defaultProps = defaultProps;

export default GroupsList;
