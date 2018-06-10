import React, { Component } from "react";

class KeyDValueInput extends Component {
  validateProps() {
    if (typeof this.props.index !== 'undefined' && this.props.dItem && this.props.handleUpdate) return true;
    else return false;
  }

  // handleUpdate(index, name, value, e) {
  //   e.target
  // }

  render() {
    return this.validateProps() ? (
      <div key={this.props.index} className="row" style={{ marginTop: "10px" }}>
        <div className="col-sm-8">
          <input
            type="text"
            placeholder="Name"
            value={this.props.dItem[0]}
            className={`form-control`}
            onChange={e =>
              this.props.handleUpdate(
                this.props.index,
                e.target.value || this.props.dItem[0],
                this.props.dItem[1],
                e
              )
            }
          />
        </div>
        <div className="col-sm-4">
          <input
            type={this.props.type || 'text'}
            className={`form-control`}
            placeholder="Value"
            value={this.props.dItem[1]}
            onChange={e =>
              this.props.handleUpdate(
                this.props.index,
                this.props.dItem[0],
                e.target.value || this.props.dItem[1],
                e
              )
            }
          />
        </div>
      </div>
    ) : (
      <p>
        <b>Error:</b> ./_components/KeyDValueInput requires props: index, dItem,
        and handleUpdate
      </p>
    );
  }
}

export default KeyDValueInput;
