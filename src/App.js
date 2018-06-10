import React, { Component } from "react";

import KeyDValueInput from "./_components/KeyDValueInput";
import GradeInputList from "./_components/GradeInputList";

import "./_styles/index.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.schemaGrade = {
      name: "",
      raw: "",
      score: "",
      total: ""
    };

    this.schemaGroup = {
      name: "",
      weighting: 0,
      score: 0,
      grades: [window.$.extend(true, {}, this.schemaGrade)]
    };

    this.state = {
      groups: [window.$.extend(true, {}, this.schemaGroup)],
      grade: 0
    };

    this.handleAppendGroup = this.handleAppendGroup.bind(this);
    this.handleUpdateGroup = this.handleUpdateGroup.bind(this);
    this.handleAppendGrade = this.handleAppendGrade.bind(this);
    this.handleUpdateGrade = this.handleUpdateGrade.bind(this);
  }

  getLetterGrade(grade) {
    if (grade >= 90) return "A+";
    else if (grade >= 85) return "A";
    else if (grade >= 80) return "A-";
    else if (grade >= 75) return "B+";
    else if (grade >= 70) return "B";
    else if (grade >= 65) return "B-";
    else if (grade >= 60) return "C+";
    else if (grade >= 55) return "C";
    else if (grade >= 50) return "C-";
    else if (grade >= 45) return "D+";
    else if (grade >= 40) return "D";
    else if (grade >= 0) return "D-";
  }

  handleAppendGroup() {
    this.state.groups.push(window.$.extend(true, {}, this.schemaGroup));

    this.setState(prevState => ({
      groups: prevState.groups
    }));
  }

  handleUpdateGroup(index, name, weighting) {
    let array = this.state.groups;
    array[index]["name"] = name;
    array[index]["weighting"] = parseInt(weighting, 10);

    this.setState({ groups: array });
  }

  handleAppendGrade(group) {
    this.state.groups[group]["grades"].push(
      window.$.extend(true, {}, this.schemaGrade)
    );

    this.setState(prevState => ({
      groups: prevState.groups
    }));
  }

  handleUpdateGrade(group, index, name, raw, e) {
    let score = 0.0;
    let total = 0.0;
    if (raw) {
      if (raw.indexOf("/") !== -1) {
        let split = raw.split("/").map(item => item.trim());

        if (
          typeof split[0] !== "undefined" &&
          typeof split[1] !== "undefined"
        ) {
          if (split[0].indexOf("%") !== -1 && split[1].indexOf("%") !== -1) {
            // format: grade% / total%
            score = parseFloat(split[0].replace("%", "").trim());
            total = 100.0;
          } else if (
            split[0].indexOf("%") !== -1 &&
            split[1].indexOf("%") === -1
          ) {
            // format: grade% / total
            split[0] = split[0].replace("%", "").trim();
            score = (parseFloat(split[0]) / 100) * parseFloat(split[1]);
            total = parseFloat(split[1]);
          } else if (
            split[0].indexOf("%") === -1 &&
            split[1].indexOf("%") !== -1
          ) {
            // to hard to calc, fk it tbh
          } else {
            // format grade / total
            split = split.map(item => parseFloat(item));
            score = split[0];
            total = split[1];
          }
        }
      } else {
        // assume a percentage
        if (raw.indexOf("%") !== -1) {
          score = parseFloat(raw.replace("%", ""));
        } else {
          score = parseFloat(raw);
          //raw += "%"; // apply the percent sign to avoid confusion
        }
        total = 100;
      }
    }

    let array = this.state.groups;
    array[group]["grades"][index]["name"] = name;
    array[group]["grades"][index]["raw"] = raw;
    array[group]["grades"][index]["score"] = score;
    array[group]["grades"][index]["total"] = total;

    this.setState({
      groups: array
    });

    this.calcGroupGrade(group);
  }

  calcGroupPercent() {
    let pTotal = 0;
    this.state.groups.map(
      group => (pTotal += parseInt(group.weighting || 0, 10))
    );

    return pTotal;
  }

  calcGroupGrade(group) {
    let groupScores = 0.0;
    let groupTotals = 0.0;
    let array = this.state.groups;
    array[group].grades.forEach(grade => {
      groupScores += grade.score;
      groupTotals += grade.total;
    });

    array[group].score = +(
      Math.round(array[group].weighting * (groupScores / groupTotals) + "e+2") +
      "e-2"
    );

    this.setState({ groups: array });
    this.calcTotalGrade();
  }

  calcTotalGrade() {
    let grade = 0;
    this.state.groups.forEach(group => {
      grade += group.score;
    });

    this.setState({ grade: grade });
  }

  render() {
    return (
      <div className="container">
        <h1>Grade calculator</h1>
        <div className="row">
          <div className="col-md-4">
            <h2>Groups</h2>
            <p>
              Please enter the grade weighting for each group by percentage. If
              there is no weighting and all assignments represent a total
              percentage, just add one group for 100%.
            </p>

            {this.state.groups.map((group, index) => (
              <KeyDValueInput
                key={index}
                index={index}
                type="number"
                dItem={[group.name, group.weighting]}
                handleUpdate={this.handleUpdateGroup}
              />
            ))}

            <div className="clearfix" style={{ marginTop: "10px" }}>
              <div className="float-left">
                <p style={{ margin: "8px 0 0" }}>
                  <b>Adds to</b>: {this.calcGroupPercent()}%
                </p>
              </div>
              <div className="float-right">
                <button
                  className="btn btn-small float-right"
                  onClick={e => this.handleAppendGroup()}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
          <div className="col-md">
            <h2 style={{ margin: "0" }}>
              Grades
              <small
                className="float-right"
                style={{ fontSize: "70%", marginTop: "8px" }}
              >
                <b>Total</b>: {this.state.grade || 0}%{" "}
                <b>({this.getLetterGrade(this.state.grade)})</b>
              </small>
            </h2>
            {this.state.groups.map(
              (group, index) =>
                group.name ? (
                  <div key={index} className="row">
                    <div className="col">
                      <div className="clearfix" style={{ marginTop: "15px" }}>
                        <h4>
                          {group.name}
                          <small
                            className="float-right"
                            style={{ fontSize: "60%", marginTop: "8px" }}
                          >
                            <b>Weight</b>: {group.weighting || 0}%,{" "}
                            <b>Achieved</b>: {group.score || 0}%
                          </small>
                        </h4>
                      </div>
                      <hr />

                      <GradeInputList
                        groupIndex={index}
                        grades={group.grades}
                        handleUpdate={this.handleUpdateGrade}
                      />

                      <div className="clearfix" style={{ marginTop: "10px" }}>
                        <button
                          className="btn btn-small float-right"
                          onClick={e => this.handleAppendGrade(index)}
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ``
                )
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
