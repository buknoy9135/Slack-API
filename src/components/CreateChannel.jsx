import { useState } from "react";
import { useData } from "../context/DataProvider";
import { API_URL } from "../constants/Constants";
import axios from "axios";
import UserListCheckbox from "./UserListCheckbox";

function CreateChannel(props) {
  const { userList } = props;

  const { userHeaders } = useData();
  const [channelName, setChannelName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showModalChannel, setShowModalChannel] = useState(false);
  const [createdChannel, setCreatedChannel] = useState(null);

  //toggle function to add user ID if not selected, and remove if already is
  const handleToggleUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  //function to add channel
  const handleAddChannel = async (e) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      alert("Please select atleast one member to create the channel");
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
        alert(`Successfully created a channel: ${channelName}`);
        setCreatedChannel(data.data);
        setShowModalChannel(false);
        setChannelName("");
        setSelectedUserIds([]);
      }
    } catch (error) {
      alert("Cannot create a channel");
    }
  };

  return (
    <div className="CreateChannel-container">
      <div>
        <button className="create-channel-button" onClick={() => setShowModalChannel(true)}>
        ✙ Create Channel
        </button>
      </div>
      {showModalChannel && (
        <form onSubmit={handleAddChannel}>
          <label>Channel Name:</label>
          <input
            type="text"
            required
            maxLength={15}
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <h4>Select Members:</h4>
          <UserListCheckbox
            userList={userList}
            selectedUserIds={selectedUserIds}
            onToggle={handleToggleUser}
          />
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
        </form>
      )}

      
    </div>
  );
}

export default CreateChannel;
