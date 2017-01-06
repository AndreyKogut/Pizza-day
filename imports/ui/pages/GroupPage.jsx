import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Groups from '../../api/groups/collection';
import { GroupMenuList } from '../components/MenuList';
import { GroupEventsList } from '../components/EventsList';
import { GroupUsersList } from '../components/UsersList';
import Controls from '../components/Controls';

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  creator: PropTypes.string,
  groupLoading: PropTypes.bool,
};

const defaultProps = {
  events: [],
};

class GroupPage extends Component {
  checkCreator() {
    return this.props.creator === Meteor.userId();
  }

  render() {
    if (this.props.groupLoading) {
      return <div>Loading..</div>;
    }

    return (<div className="group">
      <div className="groups__controls">
        <Controls />
      </div>
      <div className="group__info">
        <p><img src={this.props.avatar} className="avatar" alt="" /></p>
        <p>Name: { this.props.name }</p>
        <p>Description: { this.props.description }</p>
      </div>
      <h3 className="group__h">Events</h3>
      <div className="group__events">
        <GroupEventsList id={this.props.id} />
        { this.checkCreator() ?
          <a href={FlowRouter.path('/groups/:id/create-event', { id: this.props.id })}>Create</a>
          : '' }
      </div>
      <h3 className="group__h">Members</h3>
      <div className="group__members">
        <GroupUsersList id={this.props.id} />
      </div>
      <h3 className="group__h">Menu</h3>
      <div className="group__menu">
        <GroupMenuList id={this.props.id} />
      </div>
    </div>);
  }
}

GroupPage.propTypes = propTypes;
Event.defaultProps = defaultProps;

const GroupPageContainer = createContainer(({ id }) => {
  const handleGroup = Meteor.subscribe('Group', id);

  const groupData = Groups.findOne() || {};

  return {
    id,
    ...groupData,
    groupLoading: !handleGroup.ready(),
  };
}, GroupPage);

export default GroupPageContainer;
