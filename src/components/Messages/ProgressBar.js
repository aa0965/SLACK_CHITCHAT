import React from 'react';
import {Progress} from 'semantic-ui-react';
const ProgressBar = ({uploadState, percentUploaded}) => {
    return (
  uploadState==='loading' && (
      <Progress 
        className = 'progress__bar'
        inverted
        indicating
        progresssize='small'
        percent={percentUploaded}
      />
  ))
  }

export default ProgressBar;