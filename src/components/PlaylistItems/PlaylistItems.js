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
            <li className={'level ' + (selectedItem === item.label ? 'active' : '')} onClick={onItemClick} key={i}>
              <span className="level-left">{item.label}</span>
              {/*<a className="level-right">
                <span className="icon is-small">
                  <i className="fa fa-play"></i>
                </span>
              </a>*/}
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
