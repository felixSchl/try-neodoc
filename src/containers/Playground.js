import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSource, setArgv, setOptionsFirst } from 'redux/modules/neodoc';
import Codemirror from 'react-codemirror';

type Props = {

}
export class Playground extends React.Component {
  props: Props;

  render() {
    return (
      <div>
        <div>
          <h4>Write your help text</h4>
          <Codemirror
            ref="editor"
            value={this.props.source}
            onChange={this.props.setSource}
          />
        </div>
        <div>
          <h4>Options:</h4>

          <input name="options-first"
                 type="checkbox"
                 checked={this.props.optionsFirst}
                 defaultChecked={this.props.optionsFirst}
                 onChange={this.props.setOptionsFirst}/>
          <label for="options-first">Enable options-first</label>

          <h4>Command line:</h4>
          <input type="text"
                 value={this.props.argv}
                 onChange={this.props.setArgv}/>
        </div>
        <div>
        {
          (this.props.error)
            ? (<div class="error" style={{whiteSpace: 'pre'}}>
                <pre>
                  { this.props.error.message }
                </pre>

              </div>)
            : (<div class="output">
                { JSON.stringify(this.props.output) }
              </div>)
        }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  source: state.neodoc.source,
  argv:   state.neodoc.argv,
  output: state.neodoc.output,
  error:  state.neodoc.error
})

const mapDispatchToProps = (dispatch) => ({
  setSource:       _.debounce(s => dispatch(setSource(s)), 100),
  setArgv:         (event) => dispatch(setArgv(event.target.value)),
  setOptionsFirst: (event) => dispatch(setOptionsFirst(event.target.checked))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground)
