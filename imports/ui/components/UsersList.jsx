import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const propTypes = {
  items: PropTypes.arrayOf(Object),
};

const defaultProps = {
  items: [{}],
};

function UsersList({ items }) {
  const getList = () =>
    items.map((item) => {
      _.defaults(item, {
        emails: [{
          address: '',
        }],
        profile: {
          avatar: '',
          name: '',
        },
      });

      return (<li className="users-list__item" key={item._id}>
        <a href={FlowRouter.path('/users/:id', { id: item._id })} className="users-list__link">
          <img src={item.profile.avatar} alt={item.profile.name} className="users-list__image" />
          <span className="users-list__description">
            { item.profile.name ? item.profile.name : item.emails[0].address }
          </span>
        </a>
      </li>);
    });

  return (<ul className="users-list">
    { getList() }
  </ul>);
}

UsersList.propTypes = propTypes;
UsersList.defaultProps = defaultProps;
export default UsersList;
