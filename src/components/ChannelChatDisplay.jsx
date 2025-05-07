import { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import "../css/ChannelChatDisplay.css";
import ChannelDetails from "./ChannelDetails";
import AddMember from "./AddMember";
import send_icon from "../assets/send_message.png";
import groupavatar from "../assets/group.png";
import avatar_person from '../assets/avatar_person.png'

function ChannelChatDisplay(props) {
  const {
    selectedChannel,
    messageChannel,
    setMessageChannel,
    channelOwner,
    userList,
  } = props;

  const { userHeaders } = useData();
  const [chatChannelMessages, setChatChannelMessages] = useState([]);

  // Fetch channel messages
  useEffect(() => {
    if (!selectedChannel) return;

    const fetchChannelMessages = async () => {
      try {
        const requestHeaders = {
          headers: userHeaders,
        };

        const response = await axios.get(
          `${API_URL}/messages?receiver_id=${selectedChannel.id}&receiver_class=Channel`,
          requestHeaders
        );

        if (response.status === 200) {
          setChatChannelMessages(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        alert("Could not load messages.");
      }
    };

    fetchChannelMessages();
    const intervalId = setInterval(fetchChannelMessages, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount or user change
  }, [selectedChannel, userHeaders]);

  // Send channel message
  const handleChannelMessage = async () => {
    if (!messageChannel.trim()) {
      alert("Please type a message before sending.");
      return;
    }

    try {
      const requestBody = {
        receiver_id: Number(selectedChannel.id),
        receiver_class: "Channel",
        body: messageChannel,
      };

      const requestHeaders = {
        headers: userHeaders,
      };

      const response = await axios.post(
        `${API_URL}/messages`,
        requestBody,
        requestHeaders
      );

      if (response.status === 200) {
        alert(`Message sent to ${selectedChannel.name}!`);
        setMessageChannel(""); // Clear after successful send
      } else {
        alert("Failed to send message. Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the message.");
    }
  };

  return (
    <div className="ChannelChatDisplay-container">
      <div className="channel-info">
        {/* Channel Details will be controlled inside the ChannelDetails component */}
        <ChannelDetails
          selectedChannel={selectedChannel}
          channelOwner={channelOwner}
          userList={userList}
        />

        {/* Add Member component */}
        <div className="addmember-button">
          <AddMember userList={userList} selectedChannel={selectedChannel} />
        </div>
      </div>

      <div className="channelchat-display">
        <div className="hide-scrollbar">
          <div className="channelchat-history-display">
            {chatChannelMessages.length > 0 ? (
              chatChannelMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender?.email === userHeaders.uid ? "sent" : "received"
                  }`}
                >
                  {msg.sender?.email === userHeaders.uid ? (
                    <>{msg.body} <img className="sender-avatar" src={avatar_person} alt="avatar person" width="16px" height="16px" /></> 
                  ) : (
                    <>
                      <span className="sender-username">
                        <img
                          className="sender-avatar"
                          src={groupavatar}
                          alt="avatar"
                          width="20px"
                          height="18px"
                        />{" "}
                        {msg.sender?.email.split("@")[0] || "User"}:
                      </span>
                      {msg.body}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="channelchat-input">
        {selectedChannel ? (
          <div className="message-input">
            <textarea
              rows="1"
              cols="120"
              name="comment"
              type="text"
              placeholder={`sending message to channel ${selectedChannel.name} (channel id ${selectedChannel.id})`}
              value={messageChannel}
              onChange={(event) => setMessageChannel(event.target.value)}
            />
            <div className="send-icon">
              <button
                onClick={handleChannelMessage}
                style={{ border: "none", background: "none", padding: 0 }}
              >
                <img
                  src={send_icon}
                  alt="send message icon"
                  width="24px"
                  height="24px"
                />
              </button>
            </div>
          </div>
        ) : (
          <p>Select a channel to message</p>
        )}
      </div>
    </div>
  );
}

export default ChannelChatDisplay;
