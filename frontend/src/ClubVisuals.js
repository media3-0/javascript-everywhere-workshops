import React, { Component } from "react";
import { RadialChart } from "react-vis";
import _ from "lodash";

import SortingDropdown from "./SortingDropdown";
import { SORTING_KEYS } from "./consts";

class ClubVisuals extends Component {
  render() {
    const data = this.props.peopleInClubs.map(clubData => {
      const clubName = clubData.clubName;
      const people = clubData.people;

      const sum = people.reduce((memo, person) => {
        return memo + person.data[this.props.activeKey];
      }, 0);

      return {
        label: clubName,
        angle: sum
      };
    });

    const topData = _.sortBy(data, d => d.angle)
      .reverse()
      .slice(0, 5);

    return (
      <div>
        <SortingDropdown
          value={this.props.activeKey}
          onSelect={key => this.props.setVisKey(key)}
        />

        <RadialChart
          data={topData}
          width={300}
          height={300}
          showLabels={true}
          animation={true}
        />
      </div>
    );
  }
}

export default ClubVisuals;
