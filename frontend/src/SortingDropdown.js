import React, { Component } from "react";
import { SORTING_KEYS } from "./consts";

class SortingDropdown extends Component {
  render() {
    const keyOptions = SORTING_KEYS.map(key => {
      return <option value={key}>{key}</option>;
    });

    return (
      <select
        value={this.props.value}
        onChange={event => {
          this.props.onSelect(event.target.value);
        }}
      >
        {keyOptions}
      </select>
    );
  }
}

export default SortingDropdown;
