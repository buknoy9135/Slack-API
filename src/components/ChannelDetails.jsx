import { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";
import { API_URL } from "../constants/Constants";
import axios from "axios";
import "../css/ChannelDetails.css"; // Optional, if you want to style the modal

function ChannelDetails({ selectedChannel, channelOwner, userList }) {
  const { userHeaders } = useData();
  const [channelData, setChannelData] = useState();
  const [showModal, setShowModal] = useState(false); // Control the modal visibility

  // Fetch channel details
  useEffect(() => {
    if (!selectedChannel) return;
    const fetchChannelDetails = async () => {
      try {
        const requestHeaders = {
          headers: userHeaders,
        };

        const response = await axios.get(
          `${API_URL}/channels/${selectedChannel.id}`,
          requestHeaders
        );

        setChannelData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch channel details", error);
        return alert("Cannot get channel details");
      }
    };
    fetchChannelDetails();
  }, [selectedChannel, userHeaders]);

  return (
    <>
      <div className="channel-details-button">
        <button onClick={() => setShowModal(!showModal)}>
          Channel Details
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Channel Details</h2>
            </div>

            <div className="modal-body">
              {selectedChannel && channelData ? (
                <div>
                  <p>Channel Name: {channelData.name}</p>
                  <p>Channel ID: {channelData.id}</p>
                  {channelOwner && (
                    <p>
                      Channel Owner username: {channelOwner.email.split("@")[0]}{" "}
                    </p>
                  )}
                  <p>Channel Owner ID: {channelData.owner_id}</p>
                  <p>Channel Members:</p>
                  {channelData.channel_members.map((member) => {
                    const matchedUser = userList.find(
                      (user) => user.id === member.user_id
                    );

                    return (
                      <div key={member.id}>
                        <p>
                          {matchedUser
                            ? matchedUser.email.split("@")[0]
                            : "Not found"}{" "}
                          (ID: {member.user_id})
                        </p>
                      </div>
                    );
                  })}

                  <div className="ok-button">
                    <button onClick={() => setShowModal(false)}>OK</button>
                  </div>
                </div>
              ) : (
                <p>Select a channel for details</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChannelDetails;
