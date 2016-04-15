import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSource, setArgv } from 'redux/modules/neodoc';
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
            value={this.props.source}
            onChange={this.props.setSource}
          />
        </div>
        <div>
          <h4>ARGV:</h4>
          <input type="text" value={this.props.argv} onChange={this.props.setArgv}/>
        </div>
        <div>
        {
          (this.props.error)
            ? (<div class="error" style={{whiteSpace: 'pre'}}>
                { this.props.error.message }
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

const mapDispatchToProps = {
  setSource,
  setArgv: (event) => setArgv(event.target.value)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playground)
