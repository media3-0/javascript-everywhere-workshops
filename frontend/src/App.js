import React, { Component } from "react";
import _ from "lodash";

import SortingDropdown from "./SortingDropdown";
import ClubVisuals from "./ClubVisuals";
import { SORTING_KEYS } from "./consts";

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
      activeSortingKey: SORTING_KEYS[0],
      activeClubName: undefined,
      data: [],
      visuals: []
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

    const peopleInClubs = clubs.map(clubName => {
      return {
        clubName: clubName,
        people: getPeopleMatchingClub(this.state.data, clubName)
      };
    });

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

    const clubVisualsToRender = this.state.visuals.map((visualKey, i) => {
      return (
        <div key={visualKey}>
          <ClubVisuals
            peopleInClubs={peopleInClubs}
            activeKey={visualKey}
            setVisKey={key => {
              const newVisuals = this.state.visuals;
              newVisuals[i] = key;

              this.setState({ visuals: newVisuals });
            }}
          />
          <button
            onClick={() => {
              const newVisuals = this.state.visuals.filter((d, j) => {
                return i !== j;
              });

              this.setState({ visuals: newVisuals });
            }}
          >
            remove
          </button>
        </div>
      );
    });

    return (
      <div className="wrapper">
        {clubsToRender}

        <hr />

        {clubVisualsToRender}

        <button
          onClick={() => {
            const newVisuals = this.state.visuals.concat([SORTING_KEYS[0]]);
            this.setState({ visuals: newVisuals });
          }}
        >
          add new vis
        </button>

        <hr />

        <SortingDropdown
          value={this.state.activeSortingKey}
          onSelect={key => {
            this.setState({ activeSortingKey: key });
          }}
        />

        {activeClubNamePeopleToRender}
      </div>
    );
  }
}

export default App;
