import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Scrollchor from 'react-scrollchor';

import './NavBar.scss';
import LanguageSwitch from '../../components/LanguageSwitch/LanguageSwitch';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.setState({
      scrollTop: window.scrollY
    });
  }

  render() {
    return (
      <div className={'navbar-wrapper ' + (this.state.scrollTop > 300 ? 'show' : 'hide')}>
        <div className="container">
          <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
              <div className="navbar-start">
                <Scrollchor className="navbar-item" to="#intro">
                  <strong>Art oratoire</strong>
                </Scrollchor>
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <LanguageSwitch className={'is-light'} lang={this.props.lang} setLanguage={this.props.setLanguage} />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
};

NavBar.contextTypes = {
  t: PropTypes.func.isRequired
};
NavBar.propTypes = {};

export default NavBar;
