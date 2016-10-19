import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSmartOptions, setSource, setArgv, setOptionsFirst, setStopAt,
         setRequireFlags, setLaxPlacement, setRepeatableOptions, setEnv,
         setAllowUnknown
       } from 'redux/modules/neodoc';
import { setKeybindings } from 'redux/modules/editor';
import Codemirror from 'react-codemirror';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
require('codemirror/addon/display/rulers');
require('codemirror/addon/display/placeholder');
require('codemirror/keymap/vim');
require('codemirror/keymap/emacs');

class Asterix extends React.Component {
  render () {
    return <span className='asterix'>*</span>;
  }
}

class NewFeature extends React.Component {
  props: Props;
  static propTypes = {
    version: PropTypes.string.isRequired
  }

  render () {
    return <sub className='new-feature'>{
      this.props.version === 'preview'
        ? this.props.version
        : `v${this.props.version}`
    }</sub>;
  }
}

export class Playground extends React.Component {
  props: Props;

  static propTypes = {
    source: PropTypes.string.isRequired,
    argv: PropTypes.string.isRequired,
    env: PropTypes.string.isRequired,
    stopAt: PropTypes.array.isRequired,
    setSource: PropTypes.func.isRequired,
    setArgv: PropTypes.func.isRequired,
    setEnv: PropTypes.func.isRequired,
    setOptionsFirst: PropTypes.func.isRequired,
    setSmartOptions: PropTypes.func.isRequired,
    setRequireFlags: PropTypes.func.isRequired,
    setLaxPlacement: PropTypes.func.isRequired,
    setRepeatableOptions: PropTypes.func.isRequired,
    setAllowUnknown: PropTypes.func.isRequired,
    setStopAt: PropTypes.func.isRequired,
    optionsFirst: PropTypes.bool,
    smartOptions: PropTypes.bool,
    requireFlags: PropTypes.bool,
    laxPlacement: PropTypes.bool,
    repeatableOptions: PropTypes.bool,
    allowUnknown: PropTypes.bool,
    parseTime: PropTypes.number,
    runTime: PropTypes.number,
    spec: PropTypes.object,
    userError: PropTypes.string,
    specError: PropTypes.string,
    output: PropTypes.object,
    setKeybindings: PropTypes.func,
    keybindings: PropTypes.string
  };

  constructor (...args) {
    super(...args);

    this.state = {
      lineNumbers: false
    };
  }

  componentDidMount () {
    // note: this is a hack to get around line numbers not showing correctly
    // when set to 'true' intially. It's unclear why, but the CodeMirror gutter
    // would assume a very large width (1000+ px) if 'lineNumbers' is set to
    // 'true' on startup.
    if (!this.state.lineNumbers) {
      this.setState({
        lineNumbers: true
      });
    }
  }

  render () {
    return (
      <div id='playground'>
        <div id='main'>
          <div id='editor'>
            <Codemirror
              value={this.props.source}
              onChange={this.props.setSource}
              options={{
                readOnly: false,
                theme: 'dracula',
                extraKeys: {
                  'Tab': (cm) => {
                    cm.execCommand('insertSoftTab');
                  }
                },
                lineNumbers: this.state.lineNumbers,
                rulers: [
                  {
                    column: 80
                  }
                ],
                keyMap: this.props.keybindings
              }}
            />
            <div>
              <ReactCSSTransitionGroup
                transitionName='fade'
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
              >
                {
                  (this.props.userError || this.props.specError)
                    ? <div id='error'
                      className='popup-box'
                      style={{whiteSpace: 'pre'}}
                      key='neodoc-error'>
                      <pre>{this.props.userError || this.props.specError}</pre>
                    </div>
                    : (typeof this.props.output === 'string')
                      ? <div id='txt-output'
                        className='popup-box'
                        style={{whitespace: 'pre'}}
                        key='neodoc-txt-output'>
                        <pre>{this.props.output}</pre>
                      </div>
                      : null
                }
              </ReactCSSTransitionGroup>
            </div>
          </div>

          <div id='command-line'>
            <ul>
              <li>
                <div className='predefined'>[neodoc:~]$</div>
              </li>
              <li>
                <Codemirror
                  id='env'
                  value={this.props.env}
                  onChange={this.props.setEnv}
                  options={{
                    readOnly: false,
                    theme: 'dracula',
                    keyMap: this.props.keybindings,
                    placeholder: 'ENV_VAR=value'
                  }}
                />
              </li>
              <li>
                <div className='predefined'>prog</div>
              </li>
              <li className='argv'>
                <Codemirror
                  id='argv'
                  value={this.props.argv}
                  onChange={this.props.setArgv}
                  options={{
                    readOnly: false,
                    theme: 'dracula',
                    keyMap: this.props.keybindings,
                    placeholder: '--foo=bar'
                  }}
                />
              </li>
            </ul>
          </div>
        </div>

        <div id='right'>
          <div id='options'>
            <h3>options</h3>
            <ul>
              <li className='option important even'>
                <input id='options-first'
                  type='checkbox'
                  checked={this.props.optionsFirst}
                  defaultChecked={this.props.optionsFirst}
                  onChange={this.props.setOptionsFirst} />
                <label htmlFor='options-first' className='right'>
                  options-first
                </label>
              </li>

              <li className='option important odd'>
                <input id='smart-options'
                  type='checkbox'
                  checked={this.props.smartOptions}
                  defaultChecked={this.props.smartOptions}
                  onChange={this.props.setSmartOptions} />
                <label htmlFor='smart-options' className='right'>
                  smart-options<Asterix />
                </label>
              </li>

              <li className='option important even'>
                <input id='require-flags'
                  type='checkbox'
                  checked={this.props.requireFlags}
                  defaultChecked={this.props.requireFlags}
                  onChange={this.props.setRequireFlags} />
                <label htmlFor='require-flags' className='right'>
                  require-flags
                  <NewFeature version='0.8.0' />
                </label>
              </li>

              <li className='option important odd'>
                <input id='lax-placement'
                  type='checkbox'
                  checked={this.props.laxPlacement}
                  defaultChecked={this.props.laxPlacement}
                  onChange={this.props.setLaxPlacement} />
                <label htmlFor='lax-placement' className='right'>
                  lax-placement
                  <NewFeature version='0.9.0' />
                </label>
              </li>

              <li className='option important even'>
                <input id='repeatable-options'
                  type='checkbox'
                  checked={this.props.repeatableOptions}
                  defaultChecked={this.props.repeatableOptions}
                  onChange={this.props.setRepeatableOptions} />
                <label htmlFor='repeatable-options' className='right'>
                  repeatable-options
                  <NewFeature version='1.0.0' />
                </label>
              </li>

              <li className='option important even'>
                <input id='allow-unknown'
                  type='checkbox'
                  checked={this.props.allowUnknown}
                  defaultChecked={this.props.allowUnknown}
                  onChange={this.props.setAllowUnknown} />
                <label htmlFor='allow-unknown' className='right'>
                  allow-unknown
                  <NewFeature version='preview' />
                </label>
              </li>

              <li className='option complex odd'>
                <label htmlFor='stop-at' className='left'>
                  stop-at:
                </label>
                <input id='stop-at'
                  type='text'
                  value={this.props.stopAt && this.props.stopAt.join(' ')}
                  placeholder='-a --foo'
                  onChange={this.props.setStopAt} />
              </li>

              <li>
                <sub className='subtitle'>
                  <Asterix />this setting requires a re-parse.
                </sub>
              </li>
            </ul>
          </div>

          <div id='editor-settings'>
            <h3>editor settings</h3>
            <ul className='options'>
              <li className='option'>
                <label htmlFor='keybindings' className='left'>key bindings:</label>
                <select name='keybindings'
                  value={this.props.keybindings}
                  onChange={this.props.setKeybindings}
                  >
                  <option value='default'>default</option>
                  <option value='vim'>vim</option>
                  <option value='emacs'>emacs</option>
                </select>
              </li>
            </ul>
          </div>

          <div id='timing'>
            <h3>timing</h3>
            <ul>
              <li className='parse-spec-time'>parsed spec in <span className='ms'>{
                this.props.parseTime
              }ms</span></li>

              <li className='parse-argv-time'>parsed argv in <span className='ms argv'>{
                this.props.runTime
              }ms</span></li>
            </ul>
          </div>

          <div id='output'>
            <h3>output</h3>
            <div className='success'>
              {
                (() => {
                  if (typeof this.props.output !== 'string') {
                    const keys = this.props.output && _.keys(this.props.output);
                    return keys
                      ? keys.length === 0
                        ? <span className='empty'>empty</span>
                        : <table>
                          <tbody>
                            {_.map(keys, (k, i) => (
                              <tr key={k} className={i % 2 === 0 ? 'even' : 'odd'}>
                                <td className='key'>{k}</td>
                                <td className='arrow'>&rarr;</td>
                                <td className='value'>{JSON.stringify(this.props.output[k])}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      : 'N/A';
                  }
                })()
              }
            </div>
          </div>

          <div id='rubber'>
          </div>

        </div>
        <div className='clear-fix'>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  source: state.neodoc.source,
  argv: state.neodoc.argv,
  output: state.neodoc.output,
  userError: state.neodoc.userError,
  specError: state.neodoc.specError,
  optionsFirst: state.neodoc.optionsFirst,
  smartOptions: state.neodoc.smartOptions,
  requireFlags: state.neodoc.requireFlags,
  laxPlacement: state.neodoc.laxPlacement,
  repeatableOptions: state.neodoc.repeatableOptions,
  allowUnknown: state.neodoc.allowUnknown,
  stopAt: state.neodoc.stopAt,
  spec: state.neodoc.spec,
  parseTime: state.neodoc.parseTime,
  runTime: state.neodoc.runTime,
  keybindings: state.editor.keybindings,
  env: state.neodoc.env
});

const mapDispatchToProps = (dispatch) => ({
  setSource: (s) => dispatch(setSource(s)),
  setArgv: (s) => dispatch(setArgv(s)),
  setOptionsFirst: (event) => dispatch(setOptionsFirst(event.target.checked)),
  setSmartOptions: (event) => dispatch(setSmartOptions(event.target.checked)),
  setRequireFlags: (event) => dispatch(setRequireFlags(event.target.checked)),
  setLaxPlacement: (event) => dispatch(setLaxPlacement(event.target.checked)),
  setRepeatableOptions: (event) => dispatch(setRepeatableOptions(event.target.checked)),
  setAllowUnknown: (event) => dispatch(setAllowUnknown(event.target.checked)),
  setKeybindings: (event) => dispatch(setKeybindings(event.target.value)),
  setStopAt: (event) => dispatch(setStopAt(event.target.value.split(' '))),
  setEnv: (s) => dispatch(setEnv(s))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
