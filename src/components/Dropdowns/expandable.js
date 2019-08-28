import React from "react";
import "./expandable.css";

export default class Expandable extends React.Component {
  static defaultProps = {
    expanded: false
  };

  closeOnSelect = () => {
    if (this.props.closeOnSelect) {
      this.props.setExpanded(false);
    }
  };

  render() {
    const { className, content, footer, header, expanded, setExpanded } = this.props;

    return (
      <div
        className="expandable-container"
        onMouseEnter={setExpanded(true)}
        onMouseLeave={setExpanded(false)}
      >
        <div
          className={`expandable-content-wrapper ${className} ${
            expanded ? "expanded" : ""
          }`}
        >
          <div onClick={setExpanded(!expanded)} className="expandable-header">
            {header}
          </div>
          <div
            onClick={this.closeOnSelect}
            className={`expanded-content ${expanded ? "expanded" : ""}`}
          >
            {content}
          </div>
          <div className={`expanded-content ${expanded ? "expanded" : ""}`}>
            {footer}
          </div>
        </div>
      </div>
    );
  }
}
