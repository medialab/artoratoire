import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaybackItems.scss';

import PlaybackWave from '../PlaybackWave/PlaybackWave';
import SilenceRatio from '../../components/SilenceRatio/SilenceRatio';
import durationFormat from '../../utils/durationFormat';
import {BAR_WIDTH, BAR_GUTTER} from '../../constants/CanvasConstants';
import {SAMPLE_RATE} from '../../constants/AudioConstants';

class PlaybackItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolling: false,
      isPlaying: false,
      isEnded: false
    };
    this.handleEnded = this.handleEnded.bind(this);
    this.setScroll = this.setScroll.bind(this);
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handleToggleSpeechWave = this.handleToggleSpeechWave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {selectedItem} = nextProps;
    if (selectedItem && this.props.selectedItem && selectedItem.label !== this.props.selectedItem.label) {
      this.container.scrollLeft = 0;
      this.setState({
        isPlaying: false
      });
    }
    // if (nextProps.isPlaying && nextProps.isPlaying !== this.props.isPlaying) {
    //   if (this.props.isEnded) {
    //     this.container.scrollLeft = 0;
    //   }
    // }
    // if (!isPlaying) {
    //   this.setState({
    //     isScrolling: false
    //   });
    // }
  }

  scrollTo(element, to, duration) {
    const start = element.scrollLeft;
    const change = to - start;
    const increment = 40;
    let currentTime = 0;
    const val = Math.ceil(change * increment / duration);
    const animateScroll = () => {
      currentTime += increment;
      element.scrollLeft = element.scrollLeft + val;
      if (currentTime < duration && this.state.isPlaying) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }


  setScroll (currentTime) {
    const {selectedItem} = this.props;
    if (!this.state.isScrolling) {
      const item = selectedItem;

      const currentBars = Math.ceil(currentTime * 48000 / SAMPLE_RATE);
      const progressWidth = currentBars * (BAR_WIDTH + BAR_GUTTER);
      const offsetWidth = this.container.offsetWidth;
      const data = item.buffer.getChannelData(0);
      const canvasWidth = Math.ceil((data.length / SAMPLE_RATE) * (BAR_WIDTH + BAR_GUTTER));
      if (progressWidth > offsetWidth / 2 && canvasWidth > offsetWidth) {
        const timeLeft = (item.buffer.duration - currentTime) * 1000;
        this.scrollTo(this.container, canvasWidth - offsetWidth, timeLeft * 0.75);
        this.setState({
          isScrolling: true
        });
      }
    }
  }
  handleToggleSpeechWave () {
    const showWave = !this.props.showWave;
    this.props.onToggleSpeechWave(showWave);
  }
  handleTogglePlay(e) {
    e.stopPropagation();
    if (!this.state.isPlaying && this.state.isEnded) {
      this.container.scrollLeft = 0;
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
      isEnded: false,
      isScrolling: this.state.isPlaying
    });
  }
  handleEnded () {
    this.setState({
      isPlaying: false,
      isEnded: true,
      isScrolling: false
    });
  }

  render() {
    const {items, selectedItem, selectedSpeech, category, type, showWave} = this.props;
    const {isPlaying, isEnded} = this.state;
    return (
      <div className="aort-PlaybackItems container">
        {
          type === 'trials' && selectedItem ?
            <div className="wave-container in-transition" ref={node => this.container = node}>
              <PlaybackWave src={selectedItem.blobURL} buffer={selectedItem.buffer} isPlaying={isPlaying} isEnded={isEnded} onEnded={this.handleEnded} onTimeProgress={this.setScroll} />
            </div> : null
        }
        <ul>
          {
            items
            .sort((a, b) => {
              return b.startTime - a.startTime;
            })
            .map((item, i) => {
              const isSelected = (type === 'speech') || (selectedItem && selectedItem.id === item.id);
              const duration = item.buffer.duration * 1000;
              const formatedDuration = durationFormat(duration);
                const handleSelectItem = () => {
                  if (this.props.onSelectTrial) {
                    this.props.onToggleSpeechWave(true);
                    this.props.onSelectTrial(item);
                  }
                };
                const handleSelectRef = (e) => {
                  e.stopPropagation();
                  this.props.onSelectRef(item);
                };
                const handleDeleteItem = (e) => {
                  e.stopPropagation();
                  this.props.onDeleteTrial(item);
                };
                const handleDownLoad = (e) => {
                  e.stopPropagation();
                };
              return (
                <li key={i} onClick={handleSelectItem} className="container">
                  <div className={'columns player-control ' + (isSelected ? 'active' : '')} >
                    <div className="column is-one-third level">
                      <div className="level-left">
                        <div className="level-item">
                          {
                            isSelected ?
                              <button className="button circle-button is-medium" onClick={this.handleTogglePlay}>
                                <span className="icon">
                                  {
                                    isPlaying ?
                                      <i className="fa fa-pause"></i> : <i className="fa fa-play offset-icon"></i>
                                  }
                                </span>
                              </button> : null
                          }
                        </div>
                        <div className="level-item">
                          <div>
                            <p>{item.label}</p>
                            <small>{formatedDuration}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={'column ' + (type === 'trials' ? 'is-one-third' : 'is-half')}>
                      <SilenceRatio buffer={item.buffer} type={type} />
                    </div>
                    {
                      type === 'speech' ?
                        <div className="column level">
                          <div className="level-left"></div>
                          <div className="level-right">
                            <a className="button is-light" onClick={this.handleToggleSpeechWave}>
                              <span className="icon is-small">
                                <i className={'fa ' + (this.props.showWave ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                              </span>
                            </a>
                          </div>
                        </div> : null
                    }
                    {
                      type === 'trials' ?
                        <div className="column level">
                          <div className="level-left"></div>
                          <div className="level-right">
                            <div className="level-item buttons has-addons">
                              {
                                category.value === 'mySpeeches' ?
                                  <button className={'button ' + (selectedSpeech.trialId === item.id ? 'is-selected is-primary' : '')} disabled={selectedSpeech && item.id === selectedSpeech.id} onClick={handleSelectRef} >Select as reference</button> : null
                              }
                              <button className={'button'} onClick={handleDeleteItem}>Delete</button>
                              {/*<button className={'button'} disabled={(speech.trialId && speech.trialId === item.id) || (selectedItem && item.id === selectedItem.id)} onClick={onDeleteTrial}>delete</button>*/}
                              <a href={item.blobURL} onClick={handleDownLoad} download={`${item.label}-${selectedSpeech.label}.mp3`} className="button">Download</a>
                            </div>
                          </div>
                        </div> : null
                    }
                  </div>
                </li>
              );
            })
          }
        </ul>
        {
          type === 'speech' && showWave ?
            <div className="wave-container" ref={node => this.container = node}>
              <PlaybackWave src={items[0].source} buffer={items[0].buffer} isPlaying={isPlaying} isEnded={isEnded} onEnded={this.handleEnded} onTimeProgress={this.setScroll} />
            </div> : null
        }
      </div>
    );
  }
}

PlaybackItems.contextTypes = {
  t: PropTypes.func.isRequired
};
PlaybackItems.propTypes = {};

export default PlaybackItems;
