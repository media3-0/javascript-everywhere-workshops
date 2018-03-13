import React, { Component } from "react";
import _ from "lodash";

const KEYS = [
  "poslowie.liczba_glosow",
  "poslowie.liczba_glosowan",
  "poslowie.liczba_glosowan_opuszczonych",
  "poslowie.liczba_glosowan_zbuntowanych",
  "poslowie.liczba_interpelacji",
  "poslowie.liczba_komisji",
  "poslowie.liczba_podkomisji",
  "poslowie.liczba_projektow_uchwal",
  "poslowie.liczba_projektow_ustaw",
  "poslowie.liczba_przejazdow",
  "poslowie.liczba_przelotow",
  "poslowie.liczba_slow",
  "poslowie.liczba_uchwal_komisji_etyki",
  "poslowie.liczba_wnioskow",
  "poslowie.liczba_wyjazdow",
  "poslowie.liczba_wypowiedzi",
  "poslowie.procent_glosow"
];

const CHART_WIDTH = 400;
const CHART_HEIGHT = 10;
const BAR_HEIGHT = 2;

class Person extends Component {
  render() {
    return (
      <span>
        <svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <rect
            width={CHART_WIDTH * this.props.scaledValue}
            height={BAR_HEIGHT}
            y={(CHART_HEIGHT - BAR_HEIGHT) / 2}
          />
        </svg>
        {this.props.name}: {this.props.value}
      </span>
    );
  }
}

class Club extends Component {
  render() {
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
      activeSortingKey: KEYS[0],
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
      return (
        <div
          onClick={() => {
            this.setState({ activeClubName: clubName });
          }}
        >
          <Club clubName={clubName} />
        </div>
      );
    });

    const activeClubNamePeople = getPeopleMatchingClub(
      this.state.data,
      this.state.activeClubName
    );

    const sortedActiveClubNamePeople = _.sortBy(
      activeClubNamePeople,
      d => d.data[this.state.activeSortingKey]
    ).reverse();

    let maxValue = 0;

    if (sortedActiveClubNamePeople.length > 0) {
      maxValue =
        sortedActiveClubNamePeople[0].data[this.state.activeSortingKey];
    }

    const activeClubNamePeopleToRender = sortedActiveClubNamePeople.map(d => {
      const name = d.data["ludzie.nazwa"];
      const value = d.data[this.state.activeSortingKey];
      const scaledValue = value / maxValue;

      return (
        <div>
          <Person name={name} value={value} scaledValue={scaledValue} />
        </div>
      );
    });

    const keyOptions = KEYS.map(key => {
      return <option value={key}>{key}</option>;
    });

    return (
      <div className="wrapper">
        {clubsToRender}

        <hr />

        <select
          onChange={event => {
            this.setState({ activeSortingKey: event.target.value });
          }}
        >
          {keyOptions}
        </select>

        {activeClubNamePeopleToRender}
      </div>
    );
  }
}

export default App;
