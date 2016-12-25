import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Groups from '../api/collections/groupsCollection';

class GroupsPage extends Component {

  getGroups() {
    return this.props.groups.map(group => (<li key={group._id} className="groups__item">
      <a href={`groups/${group._id}`}>{ group.name }</a>
    </li>),
    );
  }

  render() {
    return (<ul className="groups">
      { this.getGroups() }
    </ul>);
  }
}

GroupsPage.propTypes = {
  groups: PropTypes.arrayOf(Object),
};

const GroupsPageContainer = createContainer(() => {
  Meteor.subscribe('Groups');
  const groups = Groups.find().fetch();

  return {
    groups,
  };
}, GroupsPage);

export default GroupsPageContainer;
