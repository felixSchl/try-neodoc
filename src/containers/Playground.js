import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSmartOptions, setSource, setArgv, setOptionsFirst, setStopAt,
         setRequireFlags
       } from 'redux/modules/neodoc';
import Codemirror from 'react-codemirror';

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
    setStopAt: PropTypes.func.isRequired,
    optionsFirst: PropTypes.bool,
    smartOptions: PropTypes.bool,
    requireFlags: PropTypes.bool,
    parseTime: PropTypes.number,
    runTime: PropTypes.number,
    spec: PropTypes.object,
    userError: PropTypes.object,
    specError: PropTypes.object,
    output: PropTypes.object
  };

  render () {
    return (
      <div className='playground'>
        <div id='main'>
          <div>
            <Codemirror
              value={this.props.source}
              onChange={this.props.setSource}
              options={{
                readOnly: false,
                theme: 'neo',
                extraKeys: {
                  'Tab': (cm) => {
                    cm.execCommand('insertSoftTab');
                  }
                }
              }}
            />
          </div>

          <div id='argv'>
            <div>
              <div>
              {
                (this.props.userError || this.props.specError)
                  ? <div className='error' style={{whiteSpace: 'pre'}}>
                    <pre>
                      {
                        (this.props.userError || this.props.specError).message
                      }
                    </pre>
                  </div>
                  : null
              }
              </div>
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
          <div>
            <h4>options</h4>
            <ul className='options'>
              <li>
                <input id='options-first'
                  type='checkbox'
                  checked={this.props.optionsFirst}
                  defaultChecked={this.props.optionsFirst}
                  onChange={this.props.setOptionsFirst} />
                <label htmlFor='options-first' className='right'>
                  Enable options-first
                </label>
              </li>

              <li>
                <input id='smart-options'
                  type='checkbox'
                  checked={this.props.smartOptions}
                  defaultChecked={this.props.smartOptions}
                  onChange={this.props.setSmartOptions} />
                <label htmlFor='smart-options' className='right'>
                  Enable smart-options
                </label>
              </li>

              <li>
                <input id='require-flags'
                  type='checkbox'
                  checked={this.props.requireFlags}
                  defaultChecked={this.props.requireFlags}
                  onChange={this.props.setRequireFlags} />
                <label htmlFor='require-flags' className='right'>
                  Require flags be matched explicitly
                </label>
              </li>

              <li>
                <label htmlFor='stop-at'>
                  Stop at these options:
                </label>
                <input id='stop-at'
                  type='text'
                  value={this.props.stopAt && this.props.stopAt.join(' ')}
                  onChange={this.props.setStopAt} />
                <label htmlFor='stop-at'>
                  (space separated, e.g.: "-n -f")
                </label>
              </li>
            </ul>
          </div>

          <div>
            <h4>timing</h4>
            <ul>
              <li>parsed spec in {this.props.parseTime}ms</li>
              <li>parsed argv in {this.props.runTime}ms</li>
            </ul>
          </div>

          <div>
            <h4>output</h4>
            <div className='output'>
              {
                (this.props.output)
                  ? <table>
                    <tbody>
                    {_.map(_.keys(this.props.output), (k, i) => (
                      <tr key={k} className={i % 2 === 0 ? 'even' : 'odd'}>
                        <td>{k}</td>
                        <td>&rarr;</td>
                        <td>{JSON.stringify(this.props.output[k])}</td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                  : 'N/A'
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
  stopAt: state.neodoc.stopAt,
  spec: state.neodoc.spec,
  parseTime: state.neodoc.parseTime,
  runTime: state.neodoc.runTime
});

const mapDispatchToProps = (dispatch) => ({
  setSource: (s) => dispatch(setSource(s)),
  setArgv: (event) => dispatch(setArgv(event.target.value)),
  setOptionsFirst: (event) => dispatch(setOptionsFirst(event.target.checked)),
  setSmartOptions: (event) => dispatch(setSmartOptions(event.target.checked)),
  setRequireFlags: (event) => dispatch(setRequireFlags(event.target.checked)),
  setStopAt: (event) => dispatch(setStopAt(event.target.value.split(' ')))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
