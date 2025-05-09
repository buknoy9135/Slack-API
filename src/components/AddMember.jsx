import { useState } from "react";
import UserListCheckbox from "./UserListCheckbox";
import { useData } from "../context/DataProvider";
import { API_URL } from "../constants/Constants";
import axios from "axios";
import Prompt from "../parts/Prompt";
import "../css/AddMember.css";

function AddMember(props) {
  const { userList, selectedChannel, existingMemberUserIds } = props;

  const { userHeaders } = useData();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showModalAddMember, setShowModalAddMember] = useState(false);

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

  const filteredUserList = userList.filter(
    (user) => !existingMemberUserIds.includes(user.id)
  );
  // console.log(filteredUserList) //just for checking in console
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      setPromptOpen(true);
      setPromptHeading("Required:");
      setPromptMessage(
        "Please select atleast one member to add into the channel"
      );
      return;
    }

    const requestHeaders = {
      headers: userHeaders,
    };

    try {
      for (const userId of selectedUserIds) {
        const requestBody = {
          id: Number(selectedChannel.id),
          member_id: userId,
        };

        const response = await axios.post(
          `${API_URL}/channel/add_member`,
          requestBody,
          requestHeaders
        );

        console.log(`Added user ID ${userId}:`, response.data);
      }

      setPromptOpen(true);
      setPromptHeading("Success!");
      setPromptMessage(
        `Successfully added ${selectedUserIds.length} member(s).`
      );
      setShowModalAddMember(false);
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Failed to add member:", error);
      setPromptOpen(true);
      setPromptHeading("Failed:");
      setPromptMessage("Cannot add member to channel");
    }
  };

  return (
    <>
      <div className="AddMember-container">
        <button
          className="addmember"
          onClick={() => setShowModalAddMember(true)}
        >
          Add Member
        </button>
      </div>

      {showModalAddMember && (
        <div className="addmember-modal-backdrop">
          <form onSubmit={handleAddMember} className="addmember-modal-content">
            <h4>Add Member</h4>
            <UserListCheckbox
              userList={filteredUserList}
              selectedUserIds={selectedUserIds}
              onToggle={handleToggleUser}
            />
            <button type="submit">Add Member</button>
            <button
              type="button"
              onClick={() => {
                setShowModalAddMember(false);
                setSelectedUserIds([]);
              }}
            >
              Cancel
            </button>
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
    </>
  );
}

export default AddMember;
