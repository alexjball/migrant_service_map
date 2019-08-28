import React from "react";
import RadioButtonDropdown from "../Dropdowns/radio-button-dropdown";
import distances from "assets/distances";
import { Row, Column } from "simple-flexbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const defaultDistanceText = "None Selected";
export default class DistanceDropdown extends React.Component {
  state = { distanceText: defaultDistanceText };

  onRadioButtonChanged = (miles, text) => {
    const { onChange = () => {} } = this.props;
    onChange(miles);
    if (miles) {
      this.setState({ distanceText: text });
    } else {
      this.setState({ distanceText: defaultDistanceText });
    }
  };

  clearDistance = event => {
    const { onChange = () => {} } = this.props;
    onChange(undefined);
    this.setState({ distanceText: defaultDistanceText });
  };

  render() {
    const { className } = this.props;
    const { distanceText } = this.state;
    const options = distances.map(distance => {
      if (distance < 0) {
        // "null" clears the filter
        return { value: null, text: "None" };
      } else {
        return {
          value: distance,
          text: `${distance} mile${distance === 1 ? "" : "s"}`
        };
      }
    });
    return (
      <RadioButtonDropdown
        className={className}
        onChange={this.onRadioButtonChanged}
        options={options}
        selected={this.state.distanceText}
        header={
          <>
            <Row alignItems="center">
              <Column flexGrow={1}>
                <h2 style={{ flex: 1 }}>Distance</h2>
                <p>{distanceText}</p>
              </Column>
              <div
                className="clear-icon-container"
                onClick={this.clearDistance}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </Row>
          </>
        }
      />
    );
  }
}
