import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setSmartOptions, setSource, setArgv, setOptionsFirst
       } from 'redux/modules/neodoc';
import Codemirror from 'react-codemirror';

type Props = {

}
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
      <div>
        <div>
          <h4>Write your help text</h4>
          <Codemirror
            ref='editor'
            value={this.props.source}
            onChange={this.props.setSource}
          />
        </div>
        <div>
          <h4>Options:</h4>

          <ul>
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

          <h4>Command line:</h4>
          <input type='text'
            value={this.props.argv}
            onChange={this.props.setArgv}/>
        </div>
        <div>
        {
          (this.props.error)
            ? <div className='error' style={{whiteSpace: 'pre'}}>
                <pre> {
                  this.props.error.message
                } </pre>
              </div>
            : <div className='output'> {
                  JSON.stringify(this.props.output)
              } </div>
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
  setSource: _.debounce((s) => dispatch(setSource(s)), 100),
  setArgv: (event) => dispatch(setArgv(event.target.value)),
  setOptionsFirst: (event) => dispatch(setOptionsFirst(event.target.checked)),
  setSmartOptions: (event) => dispatch(setSmartOptions(event.target.checked))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground);
