#!/bin/sh
## usage e
# ./create_component.sh MyComponent

name=$1

mkdir src/components/$name

echo "import React from 'react';
import PropTypes from 'prop-types';
import './"${name}".scss';

const "${name}" = ({}, context) => {
  return;
};

"${name}".contextTypes = {
  t: PropTypes.func.isRequired
};
"${name}".propTypes = {};

export default "${name}";" > src/components/$name/$name.js

touch src/components/$name/$name.scss
