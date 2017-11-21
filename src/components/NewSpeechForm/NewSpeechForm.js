import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './NewSpeechForm.scss';

class NewSpeechForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      content: '',
      lang: 'en'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleCancel(e) {
    const {onCancel} = this.props;
    onCancel();
  }
  handleSubmit(e) {
    const {onSave} = this.props;
    onSave(this.state);
    e.preventDefault();
  }
  render() {
    const {label, content, lang} = this.state;
    const translate = this.context.t;
    return (
      <form className="aort-Form" onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="label">{translate('speech-title')}</label>
          <div className="control">
            <input type="text" className="input" name="label" value={label} onChange={this.handleChange} />
          </div>
        </div>
        <div className="field">
          <label className="label">{translate('speech-content')}</label>
          <div className="control">
            <textarea className="textarea" name="content" value={content} onChange={this.handleChange}></textarea>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <label className="label">{translate('speech-lang')}</label>
            <select value={lang} name="lang" onChange={this.handleChange}>
              <option value="en">en</option>
              <option value="fr">fr</option>
            </select>
          </div>
        </div>
        <div className="levels">
          <div className="level-right">
            <div className="field is-grouped">
              <div className="control">
                <button className="button" onClick={this.handleCancel}>{translate('cancel')}</button>
              </div>
              <div className="control">
                <button type="submit" className="button is-primary">{translate('save')}</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

NewSpeechForm.contextTypes = {
  t: PropTypes.func.isRequired
};
NewSpeechForm.propTypes = {};

export default NewSpeechForm;
