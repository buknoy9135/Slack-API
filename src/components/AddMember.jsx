import { useState } from "react";
import UserListCheckbox from "./UserListCheckbox";
import { useData } from "../context/DataProvider";
import { API_URL } from "../constants/Constants";
import axios from "axios";
import '../css/AddMember.css'

function AddMember(props) {
  const { userList, selectedChannel } = props;

  const { userHeaders } = useData();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showModalAddMember, setShowModalAddMember] = useState(false);

  //toggle function to add user ID if not selected, and remove if already is
  const handleToggleUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  //function to add member to a channel
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      alert("Please select atleast one member to add into the channel");
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

      alert(`Successfully added ${selectedUserIds.length} member(s)`);
      setShowModalAddMember(false);
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Cannot add member to channel");
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
          userList={userList}
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
</>

  );
}

export default AddMember;
