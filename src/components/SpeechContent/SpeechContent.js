import React from 'react';
import PropTypes from 'prop-types';
import './SpeechContent.scss';

const SpeechContent = ({speech}) => {
  const syllablesTotal = speech.syllables
                        .map((d) => d.count)
                        .reduce((a, b) => a + b, 0);

  return (
    <div className="aort-SpeechContent content">
      {speech.content ?
        <div className="content-container">
          <blockquote>
            <p className="content-body">{speech.content}</p>
            <div className="columns content-footer">
              <div className="column is-one-quarter">
                <table className="table is-narrow">
                  <thead>
                    <tr>
                      <th>Word</th>
                      <th>Syllables</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="has-text-centered">{speech.wordCount}</td>
                      <td className="has-text-centered">{syllablesTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="column is-three-quarters">
                <small><a href={speech.url} target="blank">{speech.source}</a></small>
              </div>
            </div>
          </blockquote>
        </div>
      : null}
    </div>
  );
};

SpeechContent.propTypes = {
  text: PropTypes.string
};

export default SpeechContent;
