import React from 'react';
import PropTypes from 'prop-types';
import './PlaylistItems.scss';

const PlaylistItems = ({
  items,
  onClick
}) => {
  return (
    <ul>
      {
        items.map((item, i) => {
          const onItemClick = (e) => {
            e.stopPropagation();
            onClick(item);
          };
          return (<li onClick={onItemClick} key={i}>{item.label}</li>);
        })
      }
    </ul>
  );
};

PlaylistItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ),
  onClick: PropTypes.func
};

export default PlaylistItems;
