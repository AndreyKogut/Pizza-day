import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { groupsSubsManager } from '../../lib/subsManager';
import Groups from '../../api/groups/collection';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import Controls from '../components/Controls';
import { GroupMenuList } from '../components/MenuList';
import { GroupEventsList } from '../components/EventsList';
import { GroupUsersList } from '../components/UsersList';

const propTypes = {
  id: PropTypes.string,
  isMember: PropTypes.bool,
  isInvited: PropTypes.bool,
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  creator: PropTypes.string,
  membersIds: PropTypes.arrayOf(String),
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
      handleMethodsCallbacks(),
    );
  }

  function addMembers(items) {
    Meteor.call('groups.addMembers',
      { id: props.id, items },
      handleMethodsCallbacks(),
    );
  }

  function addMenuItems(items) {
    Meteor.call('groups.addMenuItems',
      { id: props.id, items },
      handleMethodsCallbacks(),
    );
  }

  function joinGroup() {
    Meteor.call('groups.join',
      props.id,
      handleMethodsCallbacks(),
    );
  }

  function leaveGroup() {
    Meteor.call('groups.leave',
      props.id,
      handleMethodsCallbacks(),
    );
  }

  function removeMember(id) {
    Meteor.call('groups.removeMember', {
      groupId: props.id,
      userId: id,
    },
    handleMethodsCallbacks());
  }

  function enterData(func) {
    return (event) => {
      if (event.key.toLowerCase() === 'enter') {
        func();
      }

      return true;
    };
  }

  if (props.groupLoading) {
    return <div>Loading..</div>;
  }

  return (<div className="content page-content">
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--6-col">
        <h2>{ props.name }
          { editable && <div className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="name">
              <i className="material-icons">edit</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
              <input
                type="text"
                ref={(name) => {
                  this.groupName = name;
                }}
                id="name"
                onKeyPress={enterData(() => {
                  updateData({ name: this.groupName.value });
                  this.groupName.value = '';
                })}
                className="mdl-textfield__input"
              />
              <label className="mdl-textfield__label" htmlFor="name">New name</label>
            </div>
          </div> }
        </h2>
      </div>
      <div className="mdl-layout-spacer" />
      { editable &&
        <div className="controls">
          { props.isInvited && <button
            type="button"
            id="join-group"
            className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--accent"
            onClick={joinGroup}
          >
            <i className="material-icons">add_circle_outline</i>
            <div className="mdl-tooltip" data-mdl-for="join-group">
              Join group
            </div>
          </button> }
          { props.isMember && <button
            type="button"
            id="leave-group"
            className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--accent"
            onClick={leaveGroup}
          >
            <i className="material-icons">not_interested</i>
            <div className="mdl-tooltip" data-mdl-for="leave-group">
              Leave group
            </div>
          </button> }
          <Controls
            controls={{ menu: true, users: true, avatar: true }}
            members={props.membersIds}
            menu={props.menu}
            addMembers={(items) => { addMembers(items); }}
            addMenuItems={(items) => { addMenuItems(items); }}
            updateImage={(url) => { updateData({ avatar: url }); }}
          />
        </div> }
    </div>
    <div className="mdl-grid">
      <img src={props.avatar} className="avatar--big m-auto" alt="" />
    </div>
    <div className="mdl-grid">
      <div className="m-auto ta-c mdl-cell mdl-cell--6-col">
        <p>{ props.description }</p>
        { editable && <div className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="description">
            <i className="material-icons">edit</i>
          </label>
          <div className="mdl-textfield__expandable-holder">
            <label className="mdl-textfield__label" htmlFor="description">Description</label>
            <input
              type="text"
              ref={(description) => {
                this.description = description;
              }}
              id="description"
              onKeyPress={enterData(() => {
                updateData({ description: this.description.value });
                this.description.value = '';
              })}
              className="mdl-textfield__input"
            />
          </div>
        </div> }
      </div>
    </div>
    <div className="mdl-grid">
      <h3 className="group__h">Events</h3>
      <div className="mdl-layout-spacer" />
      { editable &&
        <a
          id="create-event"
          className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored"
          href={FlowRouter.path('/groups/:id/create-event', { id: props.id })}
        ><i className="material-icons">add</i>
          <div className="mdl-tooltip" data-mdl-for="create-event">
            Create event
          </div>
        </a> }
    </div>
    <GroupEventsList id={props.id} />
    <div className="just-around mdl-grid">
      <div className="">
        <h3 className="ta-c">Members</h3>
        <GroupUsersList
          key={`members${props.membersIds && props.membersIds.length}`}
          id={props.id}
          showItems={props.membersIds}
          editable={editable}
          itemClick={(id) => {
            removeMember(id);
          }}
        />
      </div>

      <div>
        <h3 className="ta-c">Menu</h3>
        <GroupMenuList
          key={`members${props.menu && props.menu.length}`}
          id={props.id}
          showItems={props.menu}
        />
      </div>
    </div>
  </div>);
};

GroupPage.propTypes = propTypes;
Event.defaultProps = defaultProps;

const GroupPageContainer = createContainer(({ id }) => {
  const handleGroup = groupsSubsManager.subscribe('Group', id);

  const { members, ...groupData } = Groups.findOne(id) || {};
  const membersIds = _.pluck(members, '_id');
  const isInvited = _.some(members, member => _.isEqual(member, {
    _id: Meteor.userId(),
    verified: false,
  }));
  const isMember = _.some(members, member => _.isEqual(member, {
    _id: Meteor.userId(),
    verified: true,
  }));

  return {
    id,
    membersIds,
    ...groupData,
    isMember,
    isInvited,
    groupLoading: !handleGroup.ready(),
  };
}, GroupPage);

export default GroupPageContainer;
