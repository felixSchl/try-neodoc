/* @flow */
import React from 'react';
import Playground from 'containers/Playground';

export class HomeView extends React.Component {
  render () {
    /* eslint-disable max-len */
    var forkmeImg = 'https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67';
    var forkmeCanonical = 'https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png';
    /* eslint-enable */

    return (
      <div id='container'>
        <div id='inner-container'>
          <a href='https://github.com/felixschl/neodoc'>
            <img style={{
              position: 'absolute',
              top: 0,
              left: 0,
              border: 0 }}
              src={forkmeImg}
              alt='Fork me on GitHub'
              data-canonical-src={forkmeCanonical} />
          </a>
          <div id='topsection'>
            <h1 className='title'>&lt;neodoc&gt;</h1>
            <h5 className='subtitle'>
              Beautiful, handcrafted commandlines <sub>v0.10.1</sub>
            </h5>
            <div className='github'>
              <ul>
                <li>
                  <a className='github-button'
                    href='https://github.com/felixschl/neodoc'
                    data-icon='octicon-star'
                    data-count-href='/felixschl/neodoc/stargazers'
                    data-count-api='/repos/felixschl/neodoc#stargazers_count'
                    data-count-aria-label='# stargazers on GitHub'
                    aria-label='Star felixschl/neodoc on GitHub'
                    >Star</a>
                  <a className='github-button'
                    href='https://github.com/felixschl/neodoc/issues'
                    data-icon='octicon-issue-opened'
                    data-count-api='/repos/felixschl/neodoc#open_issues_count'
                    data-count-aria-label='# issues on GitHub'
                    aria-label='Issue felixschl/neodoc on GitHub'
                    >Issue</a>
                  <a className='github-button'
                    href='https://github.com/felixschl'
                    data-count-href='/felixschl/followers'
                    data-count-api='/users/felixschl#followers'
                    data-count-aria-label='# followers on GitHub'
                    aria-label='Follow @felixschl on GitHub'
                    >Follow @felixschl</a>
                </li>
              </ul>
            </div>
          </div>
          <Playground />
        </div>
      </div>
    );
  }
}

export default HomeView;
