import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
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
    return <div>Loading...</div>;
  }

  return (<div className="content page-content">
    <GroupsList list={groups} />
  </div>);
};

GroupsPage.propTypes = propTypes;
GroupsPage.defaultProps = defaultProps;

const GroupsPageContainer = createContainer(() => {
  const handleGroups = Meteor.subscribe('Groups');

  return {
    groups: Groups.find().fetch(),
    groupsLoading: !handleGroups.ready(),
  };
}, GroupsPage);

export default GroupsPageContainer;
