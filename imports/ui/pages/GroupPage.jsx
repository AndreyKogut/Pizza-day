import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Groups from '../../api/groups/collection';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import Controls from '../components/Controls';
import { GroupMenuList } from '../components/MenuList';
import { GroupEventsList } from '../components/EventsList';
import { GroupUsersList } from '../components/UsersList';

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  creator: PropTypes.string,
  members: PropTypes.arrayOf(Object),
  menu: PropTypes.arrayOf(String),
  groupLoading: PropTypes.bool,
};

const defaultProps = {
  events: [],
};

const GroupPage = (props) => {
  const editable = props.creator === Meteor.userId();

  function updateData(obj) {
    Meteor.call('groups.update',
      { id: props.id, ...obj },
      handleMethodsCallbacks,
    );
  }

  function addMembers(items) {
    Meteor.call('groups.addMembers',
      { id: props.id, items },
      handleMethodsCallbacks,
    );
  }

  function addMenuItems(items) {
    Meteor.call('groups.addMenuItems',
      { id: props.id, items },
      handleMethodsCallbacks,
    );
  }

  function removeMember(id) {
    Meteor.call('groups.removeMember', {
      groupId: props.id,
      userId: id,
    });
  }

  if (props.groupLoading) {
    return <div>Loading..</div>;
  }

  return (<div className="group">
    { editable ?
      <div className="groups__controls">
        <Controls
          members={props.members}
          menu={props.menu}
          addMembers={(items) => {
            addMembers(items);
          }}
          addMenuItems={(items) => {
            addMenuItems(items);
          }}
          updateImage={(url) => {
            updateData({ avatar: url });
          }}
        />
      </div> : '' }
    <div className="group__info">
      <p><img src={props.avatar} className="avatar" alt="" /></p>
      <div>
        <label htmlFor={props.name}>Name : </label>
        <input
          type="text"
          ref={(name) => {
            this.groupName = name;
          }}
          defaultValue={props.name}
          placeholder="No name"
          readOnly={!editable}
          id={props.name}
          onChange={() => {
            updateData({ name: this.groupName.value });
          }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </div>
      <div>
        <label htmlFor={props.description}>Description : </label>
        <input
          type="text"
          ref={(description) => {
            this.description = description;
          }}
          defaultValue={props.description}
          placeholder="No name"
          readOnly={!editable}
          id={props.description}
          onChange={() => {
            updateData({ description: this.description.value });
          }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </div>
    </div>
    <h3 className="group__h">Events</h3>
    <div className="group__events">
      <GroupEventsList id={props.id} />
      { editable ?
        <a href={FlowRouter.path('/groups/:id/create-event', { id: props.id })}>Create</a>
        : '' }
    </div>
    <h3 className="group__h">Members</h3>
    <div className="group__members">
      <GroupUsersList
        key={props.members.length}
        id={props.id}
        editable={editable}
        itemClick={(id) => {
          removeMember(id);
        }}
      />
    </div>
    <h3 className="group__h">Menu</h3>
    <div className="group__menu">
      <GroupMenuList
        key={props.menu.length}
        id={props.id}
      />
    </div>
  </div>);
};


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
