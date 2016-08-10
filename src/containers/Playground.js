import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSmartOptions, setSource, setArgv, setOptionsFirst, setStopAt,
         setRequireFlags, setLaxPlacement
       } from 'redux/modules/neodoc';
import { setKeybindings } from 'redux/modules/editor';
import Codemirror from 'react-codemirror';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
require('codemirror/addon/display/rulers');
require('codemirror/keymap/vim');
require('codemirror/keymap/emacs');

export class Playground extends React.Component {
  props: Props;

  static propTypes = {
    source: PropTypes.string.isRequired,
    argv: PropTypes.string.isRequired,
    stopAt: PropTypes.array.isRequired,
    setSource: PropTypes.func.isRequired,
    setArgv: PropTypes.func.isRequired,
    setOptionsFirst: PropTypes.func.isRequired,
    setSmartOptions: PropTypes.func.isRequired,
    setRequireFlags: PropTypes.func.isRequired,
    setLaxPlacement: PropTypes.func.isRequired,
    setStopAt: PropTypes.func.isRequired,
    optionsFirst: PropTypes.bool,
    smartOptions: PropTypes.bool,
    requireFlags: PropTypes.bool,
    laxPlacement: PropTypes.bool,
    parseTime: PropTypes.number,
    runTime: PropTypes.number,
    spec: PropTypes.object,
    userError: PropTypes.object,
    specError: PropTypes.object,
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
          <div>
            <Codemirror
              value={this.props.source}
              onChange={this.props.setSource}
              options={{
                readOnly: false,
                // theme: 'tomorrow-night-eighties',
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
          </div>

          <div id='argv'>
            <div>
              <ReactCSSTransitionGroup
                transitionName='fade'
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
              >
                {
                  (this.props.userError || this.props.specError)
                    ? <div id='error' style={{whiteSpace: 'pre'}} key='neodoc-error'>
                      <pre>
                        {
                          (this.props.userError || this.props.specError).message
                        }
                      </pre>
                    </div>
                    : null
                }
              </ReactCSSTransitionGroup>
            </div>
            <div className='command-line'>
              <span>$ prog</span>
              <input type='text'
                value={this.props.argv}
                onChange={this.props.setArgv} />
            </div>
          </div>
        </div>

        <div id='right'>
          <div id='options'>
            <h3>options</h3>
            <ul>
              <li className='option important'>
                <input id='options-first'
                  type='checkbox'
                  checked={this.props.optionsFirst}
                  defaultChecked={this.props.optionsFirst}
                  onChange={this.props.setOptionsFirst} />
                <label htmlFor='options-first' className='right'>
                  Enable options-first
                </label>
              </li>

              <li className='option important'>
                <input id='smart-options'
                  type='checkbox'
                  checked={this.props.smartOptions}
                  defaultChecked={this.props.smartOptions}
                  onChange={this.props.setSmartOptions} />
                <label htmlFor='smart-options' className='right'>
                  Enable smart-options
                </label>
              </li>

              <li className='option important'>
                <input id='require-flags'
                  type='checkbox'
                  checked={this.props.requireFlags}
                  defaultChecked={this.props.requireFlags}
                  onChange={this.props.setRequireFlags} />
                <label htmlFor='require-flags' className='right'>
                  Require flags be matched explicitly
                </label>
              </li>

              <li className='option important'>
                <input id='lax-placement'
                  type='checkbox'
                  checked={this.props.laxPlacement}
                  defaultChecked={this.props.laxPlacement}
                  onChange={this.props.setLaxPlacement} />
                <label htmlFor='lax-placement' className='right'>
                  Positions do not matter (lax placement)
                  <sub>&mdash; new in v0.9.0</sub>
                </label>
              </li>

              <li className='option complex'>
                <label htmlFor='stop-at' className='above'>
                  Stop at these options:
                </label>
                <input id='stop-at'
                  type='text'
                  value={this.props.stopAt && this.props.stopAt.join(' ')}
                  onChange={this.props.setStopAt} />
                <label htmlFor='stop-at' className='below explanation'>
                  space separated, e.g.: "-n -f"
                </label>
              </li>
            </ul>
          </div>

          <div id='editor-settings'>
            <h4>editor settings</h4>
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
            <h4>timing</h4>
            <ul>
              <li>parsed spec in <span className='ms'>{
                this.props.parseTime
              }ms</span></li>

              <li>parsed argv in <span className='ms argv'>{
                this.props.runTime
              }ms</span></li>
            </ul>
            <div className='subtitle'>
              <p>
                <b>Important Note:</b> Since the neodoc parse output is just
                JSON, it can cached or even shipped with the cli, reducing the
                total time to the latter of these two numbers (rather than the
                sum).
              </p>
            </div>
          </div>

          <div id='output'>
            <h4>output</h4>
            <div className='success'>
              {
                (() => {
                  const keys = this.props.output && _.keys(this.props.output);
                  return keys
                    ? keys.length === 0
                      ? <span className='empty'>empty</span>
                      : <table>
                        <tbody>
                          {_.map(keys, (k, i) => (
                            <tr key={k} className={i % 2 === 0 ? 'even' : 'odd'}>
                              <td>{k}</td>
                              <td>&rarr;</td>
                              <td>{JSON.stringify(this.props.output[k])}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    : 'N/A';
                })()
              }
            </div>
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
  stopAt: state.neodoc.stopAt,
  spec: state.neodoc.spec,
  parseTime: state.neodoc.parseTime,
  runTime: state.neodoc.runTime,
  keybindings: state.editor.keybindings
});

const mapDispatchToProps = (dispatch) => ({
  setSource: (s) => dispatch(setSource(s)),
  setArgv: (event) => dispatch(setArgv(event.target.value)),
  setOptionsFirst: (event) => dispatch(setOptionsFirst(event.target.checked)),
  setSmartOptions: (event) => dispatch(setSmartOptions(event.target.checked)),
  setRequireFlags: (event) => dispatch(setRequireFlags(event.target.checked)),
  setLaxPlacement: (event) => dispatch(setLaxPlacement(event.target.checked)),
  setKeybindings: (event) => dispatch(setKeybindings(event.target.value)),
  setStopAt: (event) => dispatch(setStopAt(event.target.value.split(' ')))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
