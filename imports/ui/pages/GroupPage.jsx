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
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor={props.name}>
              <i className="material-icons">edit</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
              <input
                type="text"
                ref={(name) => {
                  this.groupName = name;
                }}
                id={props.name}
                onKeyPress={enterData(() => {
                  updateData({ name: this.groupName.value });
                })}
                className="mdl-textfield__input"
              />
              <label className="mdl-textfield__label" htmlFor={props.name}>New name</label>
            </div>
          </div> }
        </h2>
      </div>
      <div className="mdl-layout-spacer" />
      { editable &&
        <div className="controls">
          <Controls
            controls={{ menu: true, users: true, avatar: true }}
            members={props.members}
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
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor={props.description}>
            <i className="material-icons">edit</i>
          </label>
          <div className="mdl-textfield__expandable-holder">
            <label className="mdl-textfield__label" htmlFor={props.description}>Description</label>
            <input
              type="text"
              ref={(description) => {
                this.description = description;
              }}
              id={props.description}
              onKeyPress={enterData(() => {
                updateData({ description: this.description.value });
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
          key={props.members.length}
          id={props.id}
          editable={editable}
          itemClick={(id) => {
            removeMember(id);
          }}
        />
      </div>

      <div className="">
        <h3 className="ta-c">Menu</h3>
        <GroupMenuList
          key={props.menu.length}
          id={props.id}
        />
      </div>
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
