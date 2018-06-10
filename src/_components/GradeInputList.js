import React, { Component } from "react";

import KeyDValueInput from "./KeyDValueInput";

class GradeInputList extends Component {
  constructor(props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(index, name, value, e) {
    this.props.handleUpdate(this.props.groupIndex, index, name, value, e);
  }

  render() {
    return this.props.grades.map((grade, index) => (
      <KeyDValueInput
        key={index}
        index={index}
        dItem={[grade.name, grade.raw]}
        handleUpdate={this.handleUpdate}
      />
    ));
  }
}

export default GradeInputList;
