import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { groupsSubsManager } from '../../lib/subsManager';
import Groups from '../../api/groups/collection';
import GroupsList from '../components/GroupsList';

const propTypes = {
  groups: PropTypes.arrayOf(Object),
  groupsLoading: PropTypes.bool,
};

const defaultProps = {
  groups: [{}],
};

const GroupsPage = ({ groups, groupsLoading }) => {
  if (groupsLoading) {
    return <div className="spinner mdl-spinner mdl-js-spinner is-active" />;
  }

  if (!groups.length) {
    return <div className="empty-list empty-list--big" />;
  }

  return (<div className="content page-content">
    <GroupsList list={groups} />
  </div>);
};

GroupsPage.propTypes = propTypes;
GroupsPage.defaultProps = defaultProps;

const GroupsPageContainer = createContainer(() => {
  const handleGroups = groupsSubsManager.subscribe('Groups');

  return {
    groups: Groups.find({ $or: [
      { 'members._id': Meteor.userId() },
      { creator: Meteor.userId() },
    ] }).fetch(),
    groupsLoading: !handleGroups.ready(),
  };
}, GroupsPage);

export default GroupsPageContainer;
