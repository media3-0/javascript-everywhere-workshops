import React, { Component } from "react";
import _ from "lodash";

class Person extends Component {
  render() {
    return <span>{this.props.name}</span>;
  }
}

class Club extends Component {
  render() {
    const personsToRender = this.props.peopleInClub.map(d => {
      const name = d.data["ludzie.nazwa"];

      return (
        <div>
          <Person name={name} />
        </div>
      );
    });

    return (
      <div>
        <h3>{this.props.clubName}</h3>
        {personsToRender}
      </div>
    );
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
    const allClubs = this.state.data.map(d => {
      const club = d.data["sejm_kluby.nazwa"];
      return club;
    });

    const clubs = _.uniq(allClubs);

    const clubsToRender = clubs.map(clubName => {
      const peopleInClub = this.state.data.filter(d => {
        const isPersonInClub = d.data["sejm_kluby.nazwa"] === clubName;

        return isPersonInClub;
      });

      return <Club clubName={clubName} peopleInClub={peopleInClub} />;
    });

    return <div className="wrapper">{clubsToRender}</div>;
  }
}

export default App;
