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
        <h4>{this.props.clubName}</h4>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      activeClubName: undefined,
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

    function getPeopleMatchingClub(peopleList, clubName) {
      return peopleList.filter(d => {
        const isPersonInClub = d.data["sejm_kluby.nazwa"] === clubName;
        return isPersonInClub;
      });
    }

    const clubsToRender = clubs.map(clubName => {
      const peopleInClub = getPeopleMatchingClub(this.state.data, clubName);

      return (
        <div
          onClick={() => {
            this.setState({ activeClubName: clubName });
          }}
        >
          <Club clubName={clubName} peopleInClub={peopleInClub} />
        </div>
      );
    });

    const activeClubNamePeople = getPeopleMatchingClub(
      this.state.data,
      this.state.activeClubName
    );

    const activeClubNamePeopleToRender = activeClubNamePeople.map(d => {
      const name = d.data["ludzie.nazwa"];

      return (
        <div>
          <Person name={name} />
        </div>
      );
    });

    return (
      <div className="wrapper">
        {clubsToRender}
        <hr />
        {activeClubNamePeopleToRender}
      </div>
    );
  }
}

export default App;
