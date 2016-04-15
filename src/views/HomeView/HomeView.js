/* @flow */
import React from 'react';
import Playground from 'containers/Playground';

export class HomeView extends React.Component {
  render () {
    return (
      <div>
        <h1>Try neodoc</h1>
        <Playground/>
      </div>
    );
  }
}

export default HomeView;
