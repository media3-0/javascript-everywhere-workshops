import React, { Component } from "react";

class Person extends Component {
  render() {
    return <span>{this.props.name}</span>;
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch("/api/poslowie")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ data: data });
      });
  }

  render() {
    const personsToRender = this.state.data.map((d, index) => {
      const name = d.data["ludzie.nazwa"];

      return (
        <div>
          <Person name={name} />
        </div>
      );
    });

    return <div className="wrapper">
      {personsToRender}
    </div>;
  }
}

export default App;
