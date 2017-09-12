import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './PlaylistSelect.scss';


const PlaylistSelect = ({
  selectedOption,
  options,
  placeholder,
  onChange
}) => {
  const onSelectChange = (e) => {
    if (e) onChange(e);
  };

  return (
    <div className="aort-PlaylistSelect">
      <Select
        name="form-field-name"
        value={selectedOption}
        options={options}
        placeholder={placeholder}
        onChange={onSelectChange} />
    </div>
  );
};

PlaylistSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.object
  ),
  selectedOption: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default PlaylistSelect;
