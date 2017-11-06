import React from 'react';
import PropTypes from 'prop-types';
import './Footer.scss';

const Footer = ({}, context) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="content has-text-centered">
        </div>
      </div>
    </footer>
  );
};

Footer.contextTypes = {
  t: PropTypes.func.isRequired
};
Footer.propTypes = {};

export default Footer;
