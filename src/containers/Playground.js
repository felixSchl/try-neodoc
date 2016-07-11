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
    spec: PropTypes.object,
    userError: PropTypes.object,
    specError: PropTypes.object,
    output: PropTypes.object
  };

  render () {
    return (
      <div className='playground'>
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

        <div className='command-line'>
          <span>$ prog</span>
          <input type='text'
            value={this.props.argv}
            onChange={this.props.setArgv} />
        </div>

        <div>
          <ul className='options'>
            <li>
              <input name='options-first'
                type='checkbox'
                checked={this.props.optionsFirst}
                defaultChecked={this.props.optionsFirst}
                onChange={this.props.setOptionsFirst} />
              <label htmlFor='options-first'>Enable options-first</label>
            </li>

            <li>
              <input name='smart-options'
                type='checkbox'
                checked={this.props.smartOptions}
                defaultChecked={this.props.smartOptions}
                onChange={this.props.setSmartOptions} />
              <label htmlFor='smart-options'>Enable smart-options</label>
            </li>

            <li>
              <input name='require-flags'
                type='checkbox'
                checked={this.props.requireFlags}
                defaultChecked={this.props.requireFlags}
                onChange={this.props.setRequireFlags} />
              <label htmlFor='require-flags'>Require flags be matched explicitly</label>
            </li>

            <li>
              <input name='stop-at'
                type='text'
                value={this.props.stopAt && this.props.stopAt.join(' ')}
                onChange={this.props.setStopAt} />
              <label htmlFor='stop-at'>
                Stop at these options (space separated, e.g.: "-n -f")
              </label>
            </li>
          </ul>
        </div>
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
            : <div className='output'>
              <table>
                <tbody>
                {_.map(this.props.output, (v, k, i) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>&rarr;</td>
                    <td>{JSON.stringify(v)}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
        }
        </div>
        <div>
        {/*
          (this.props.spec)
            ? <div className='output'>
              <Codemirror
                value={JSON.stringify(this.props.spec, null, 2)}
                options={{
                  readOnly: true,
                  mode: 'json',
                  theme: 'neo'
                }} />
            </div>
            : <div>N/A</div>
        */}
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
  spec: state.neodoc.spec
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
