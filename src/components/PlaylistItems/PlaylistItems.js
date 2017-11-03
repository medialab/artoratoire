import React from 'react';
import PropTypes from 'prop-types';
import './PlaylistItems.scss';

const PlaylistItems = ({
  items,
  selectedItem,
  onClick
}) => {
  return (
    <ol className="aort-PlaylistItems">
      {
        items.map((item, i) => {
          item = {...item, playing: false};
          const onItemClick = (e) => {
            e.stopPropagation();
            item.playing = !item.playing;
            onClick(item);
          };

          return (
            <li className={selectedItem === item.label ? 'active' : ''} onClick={onItemClick} key={i}>
              <span>{item.label}</span>
            </li>
          );
        })
      }
    </ol>
  );
};

PlaylistItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ),
  onClick: PropTypes.func
};

export default PlaylistItems;
