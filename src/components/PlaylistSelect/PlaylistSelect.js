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
}, context) => {
  const onSelectChange = (e) => onChange(e);
  const translate = context.t;
  const translateOptions = options.map(d => {
    return {
      label: translate(d.label),
      value: d.value,
      list: d.list
    };
  });
  return (
    <div className="aort-PlaylistSelect">
      <Select
        name="form-field-name"
        value={selectedOption}
        openOnFocus
        clearable={false}
        options={translateOptions}
        placeholder={placeholder}
        onChange={onSelectChange} />
    </div>
  );
};
PlaylistSelect.contextTypes = {
  t: PropTypes.func.isRequired
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
