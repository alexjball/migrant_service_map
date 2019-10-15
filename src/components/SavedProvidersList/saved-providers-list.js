import React from "react";
import { MenuDropdownItem } from "..";
import { printJSX } from "util/printJSX";
import "./saved-providers-list.css";
import { Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import { faPrint, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default class SavedProvidersList extends React.Component {
  state = {};

  toProviderDiv = provider => {
    const {
      id,
      address,
      email,
      mission,
      name,
      telephone,
      typeName,
      website
    } = provider;
    return (
      <div className={"provider"} key={id}>
        <div className={"name"}>{name}</div>
        <div className={"type"} style={{ fontStyle: "italic" }}>
          {typeName}
        </div>
        <div className={"details"}>
          <div className={"address"}>Address: {address}</div>
          <div className={"email"}>Email: {email}</div>
          <div className={"telephone"}>Phone: {telephone}</div>
          <div className={"website"}>
            Website: <a href={website}>{website}</a>
          </div>
          <div className={"mission"}>{mission}</div>
        </div>
      </div>
    );
  };

  printSavedProviders(providers) {
    const printPage = (
      <div className={"print"}>
        <div className={"category"}>{_.map(providers, this.toProviderDiv)}</div>
      </div>
    );
    printJSX(printPage);
  }

  emailSavedProviders(providers) {
    const email = providers.map(provider => {
      const { name, address, website, telephone, email } = provider;
      return [
        name,
        `Address: ${address}`,
        `Website: ${website}`,
        `Phone: ${telephone}`,
        `Email: ${email}`
      ].join("\n");
    }).join("\n\n");

    const uriEncodedBody = encodeURIComponent(email);

    let myWindow;

    function openWin() {
      myWindow = window.open("mailto:?&body=" + uriEncodedBody);
      setTimeout(closeWin, 3000);
    }

    // closeWin shuts new tab after 3 seconds if email is
    // opened in email application e.g. Outlook, Mail, and keeps new tab open if
    // redirected to browser email application e.g. Gmail

    function closeWin() {
      try {
        // Without try block, "if (myWindow.location)" would cause
        // cross site error after redirect
        if (myWindow.location.href) {
          myWindow.close();
        }
      } catch {
        return;
      }
    }

    openWin();
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      savedProviders,
      saveProvider,
      searchCenter,
      highlightedProviders,
      displayProviderInformation,
      flyToProvider
    } = this.props;
    return (
      <div className="saved-list">
        <div className="header-container">
          <header>
            <h3>SAVED PROVIDERS</h3>
            <div>
              <FontAwesomeIcon
                size="2x"
                icon={faPrint}
                onClick={() => this.printSavedProviders(savedProviders)}
                className="print-icon"
                data-tip="Print"
              />
              <FontAwesomeIcon
                size="2x"
                icon={faEnvelope}
                onClick={() => this.emailSavedProviders(savedProviders)}
                className="email-icon"
                data-tip="Email"
              />
            </div>
          </header>
          <div className="search-center">
            Showing proximity to {searchCenter}
          </div>
        </div>

        <Droppable
          droppableId="saved-items"
          direction="vertical"
          key="saved-items-drop-area"
        >
          {provided => {
            return (
              <div
                className="saved-content-container"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {savedProviders.map((provider, index) => (
                  <Draggable
                    draggableId={provider.id}
                    key={provider.id}
                    index={index}
                  >
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="saved-draggable"
                        onClick={() => displayProviderInformation(provider.id)}
                      >
                        <MenuDropdownItem
                          key={provider.id}
                          provider={provider}
                          isSaved="saved"
                          toggleSavedStatus={() => saveProvider(provider.id)}
                          flyToProvider={() => flyToProvider(provider.id)}
                          isHighlighted={highlightedProviders.includes(
                            provider.id
                          )}
                          inSavedMenu={true}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
    );
  }
}
