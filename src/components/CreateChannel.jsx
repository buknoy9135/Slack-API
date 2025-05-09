import { useState } from "react";
import { useData } from "../context/DataProvider";
import { API_URL } from "../constants/Constants";
import axios from "axios";
import UserListCheckbox from "./UserListCheckbox";
import Prompt from "../parts/Prompt";
import "../css/CreateChannel.css";

function CreateChannel(props) {
  const { userList } = props;

  const { userHeaders } = useData();
  const [channelName, setChannelName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showModalChannel, setShowModalChannel] = useState(false);
  const [createdChannel, setCreatedChannel] = useState(null);

  //prompt modal
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptHeading, setPromptHeading] = useState("");
  const [promptMessage, setPromptMessage] = useState("");

  const handlePromptClose = () => setPromptOpen(false);

  //toggle function to add user ID if not selected, and remove if already is
  const handleToggleUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  //function to add channel
  const handleAddChannel = async (e) => {
    e.preventDefault();

    if (!channelName) {
      setPromptOpen(true);
      setPromptHeading("Missing information:");
      setPromptMessage(
        "Please set channel name."
      );
      return;
    }

    if (selectedUserIds.length === 0) {
      setPromptOpen(true);
      setPromptHeading("Missing information:");
      setPromptMessage(
        "Please select atleast (1) member to create the channel."
      );
      return;
    }

    

    const requestBody = {
      name: channelName,
      user_ids: selectedUserIds,
    };

    const requestHeaders = {
      headers: userHeaders,
    };

    try {
      const response = await axios.post(
        `${API_URL}/channels`,
        requestBody,
        requestHeaders
      );

      const { data } = response;
      console.log(data);

      if (data.data) {
        setPromptOpen(true);
        setPromptHeading("Success!");
        setPromptMessage(`Successfully created a channel: ${channelName}`);
        console.log(createdChannel);
        setCreatedChannel(data.data);
        setShowModalChannel(false);
        setChannelName("");
        setSelectedUserIds([]);
      }
    } catch (error) {
      setPromptOpen(true);
      setPromptHeading("Failed:");
      setPromptMessage("Cannot create a channel");
    }
  };

  return (
    <div className="CreateChannel-container">
      <div>
        <button
          className="create-channel-button"
          onClick={() => setShowModalChannel(true)}
        >
          ✙ Create Channel
        </button>
      </div>
      {showModalChannel && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleAddChannel}>
            <div className="channelname-container">
              <h4>Channel Name:</h4>
              <input
                type="text"
                // required
                placeholder="max 15 characters only"
                maxLength={15}
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            <div className="select-members-container">
              <h4>Select Members:</h4>
              <UserListCheckbox
                userList={userList}
                selectedUserIds={selectedUserIds}
                onToggle={handleToggleUser}
              />
            </div>

            <div className="confirm-buttons">
              <button type="submit">Add Channel</button>
              <button
                type="button"
                onClick={() => {
                  setShowModalChannel(false);
                  setSelectedUserIds([]);
                  setChannelName("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {promptOpen && (
        <Prompt
          promptHeading={promptHeading}
          promptMessage={promptMessage}
          onClose={handlePromptClose}
        />
      )}
    </div>
  );
}

export default CreateChannel;
