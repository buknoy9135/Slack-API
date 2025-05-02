import { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import "../css/ChannelChatDisplay.css";

function ChannelChatDisplay(props) {
  const { selectedChannel, messageChannel, setMessageChannel } = props;

  const { userHeaders } = useData();
  const [chatChannelMessages, setChatChannelMessages] = useState([]);

  //Fetch channel messages function
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
    const intervalId = setInterval(fetchChannelMessages, 5000); //fetch every 5 seconds
    return () => clearInterval(intervalId); //cleanup on unmount or user change
  }, [selectedChannel, userHeaders]);

  //Function to send channel message
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
        setMessageChannel(""); //clear after successful send
      } else {
        alert("Failed to send message. Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occured while sending the message.");
    }
  };

  return (
    <div className="ChannelChatDisplay-container">
      <div className="channelchat-display">
        <div className="channelchat-history-display">
          {chatChannelMessages.length > 0 ? (
            chatChannelMessages.map((msg, index) => (
              <div
                key={index}
                className={`chat-mesage ${
                  msg.sender?.email === userHeaders.uid ? "sent" : "received"
                }`}
              >
                {msg.sender?.email.split("@")[0] || "User"}: {msg.body}
              </div>
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </div>
      </div>
      <div className="channelchat-input">
        {selectedChannel ? (
          <div className="message-input">
            <textarea
              rows="3"
              cols="50"
              name="comment"
              type="text"
              placeholder={`sending message to channel ${selectedChannel.name} (channel id ${selectedChannel.id})`}
              value={messageChannel}
              onChange={(event) => setMessageChannel(event.target.value)}
            />
            <button onClick={handleChannelMessage}>Send Message</button>
          </div>
        ) : (
          <p>Select a channel to message</p>
        )}
      </div>
    </div>
  );
}

export default ChannelChatDisplay;
