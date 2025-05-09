import React from "react";
import "../css/Prompt.css";

function Prompt({ promptHeading, promptMessage, onClose }) {
  return (
    <div className="Prompt-container">
      <div className="prompt-body">
        <h2>{promptHeading}</h2>
        <p>{promptMessage}</p>
        <div className="prompt-button">
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default Prompt;
