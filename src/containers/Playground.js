import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSmartOptions, setSource, setArgv, setOptionsFirst
       } from 'redux/modules/neodoc';
import Codemirror from 'react-codemirror';

export class Playground extends React.Component {
  props: Props;

  static propTypes = {
    source: PropTypes.string.isRequired,
    argv: PropTypes.string.isRequired,
    setSource: PropTypes.func.isRequired,
    setArgv: PropTypes.func.isRequired,
    setOptionsFirst: PropTypes.func.isRequired,
    setSmartOptions: PropTypes.func.isRequired,
    optionsFirst: PropTypes.bool,
    smartOptions: PropTypes.bool,
    error: PropTypes.object,
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
            onChange={this.props.setArgv}/>
        </div>

        <div>
          <ul className='options'>
            <li>
              <input name='options-first'
                type='checkbox'
                checked={this.props.optionsFirst}
                defaultChecked={this.props.optionsFirst}
                onChange={this.props.setOptionsFirst}/>
              <label htmlFor='options-first'>Enable options-first</label>
            </li>

            <li>
              <input name='smart-options'
                type='checkbox'
                checked={this.props.smartOptions}
                defaultChecked={this.props.smartOptions}
                onChange={this.props.setSmartOptions}/>
              <label htmlFor='smart-options'>Enable smart-options</label>
            </li>
          </ul>
        </div>
        <div>
        {
          (this.props.error)
            ? <div className='error' style={{whiteSpace: 'pre'}}>
                <pre> {
                  this.props.error.message
                } </pre>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  source: state.neodoc.source,
  argv: state.neodoc.argv,
  output: state.neodoc.output,
  error: state.neodoc.error,
  optionsFirst: state.neodoc.optionsFirst,
  smartOptions: state.neodoc.smartOptions
});

const mapDispatchToProps = (dispatch) => ({
  setSource: (s) => dispatch(setSource(s)),
  setArgv: (event) => dispatch(setArgv(event.target.value)),
  setOptionsFirst: (event) => dispatch(setOptionsFirst(event.target.checked)),
  setSmartOptions: (event) => dispatch(setSmartOptions(event.target.checked))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
