import React, { Component } from "react";

class Person extends Component {
  render() {
    return <span>{this.props.name}</span>;
  }
}

fetch("/api/poslowie")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log("data", data);
  });

class App extends Component {
  constructor() {
    super();

    this.state = {
      selectedPersonNumber: -1
    };
  }

  render() {
    const data = [
      "Jan Nowak",
      "Adam Nowak",
      "Ewa Nowak",
      "Andrzej Nowak",
      "Józef Nowak"
    ];

    const onClickPerson = index => {
      this.setState({
        selectedPersonNumber: index
      });
    };

    const personsToRender = data.map((person, index) => {
      const isPersonSelected = index == this.state.selectedPersonNumber;

      return (
        <div onClick={() => onClickPerson(index)}>
          <Person name={person} />
          {isPersonSelected ? " X" : ""}
        </div>
      );
    });

    return (
      <div className="wrapper">
        selected person: {this.state.selectedPersonNumber}
        {personsToRender}
      </div>
    );
  }
}

export default App;
