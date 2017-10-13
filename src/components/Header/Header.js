import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0
    };
    // this.handleScroll = this.handleScroll.bind(this);
  }

  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll);
  // }
  // componentUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll);
  // }

  // handleScroll() {
  //   this.setState({
  //     scrollTop: window.scrollY
  //   });
  // }

  render() {
    const translate = this.context.t;
    return (
      <div className="aort-Header">
        <div className="columns is-centered">
          <div className="column is-half has-text-centered">
            <p className="title is-2">Artoratoire</p>
            <p className="subtitle is-4">{translate('subtitle')}</p>
            <LanguageSwitch lang={this.props.lang} setLanguage={this.props.setLanguage} />
          </div>
        </div>
      </div>
    );
  }
}

Header.contextTypes = {
  t: PropTypes.func.isRequired
};

Header.propTypes = {};

export default Header;
