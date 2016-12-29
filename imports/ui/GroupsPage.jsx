import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Groups from '../api/groups/collection';

const propTypes = {
  list: PropTypes.arrayOf(Object),
};

const defaultProps = {
  list: [],
};

function GroupsPage({ list }) {
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

GroupsPage.propTypes = propTypes;
GroupsPage.defaultProps = defaultProps;

const GroupsPageContainer = createContainer(() => {
  Meteor.subscribe('Groups');
  const list = Groups.find().fetch();

  return {
    list,
  };
}, GroupsPage);

export default GroupsPageContainer;
