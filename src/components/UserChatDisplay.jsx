import { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import "../css/UserChatDisplay.css";
import send_icon from "../assets/send_message.png";
import avatar_person from '../assets/avatar_person.png'

function UserChatDisplay(props) {
  const { selectedUser, message, setMessage } = props;
  const { userHeaders } = useData();
  const [chatUserMessages, setChatUserMessages] = useState([]);

  //Fetch user messages function
  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserMessages = async () => {
      try {
        const requestHeaders = {
          headers: userHeaders,
        };

        const response = await axios.get(
          `${API_URL}/messages?receiver_id=${selectedUser.id}&receiver_class=User`,
          requestHeaders
        );

        if (response.status === 200) {
          setChatUserMessages(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        alert("Could not load messages.");
      }
    };

    fetchUserMessages();
    //useEffect runs when selectedUser or userHeaders changes

    const intervalId = setInterval(fetchUserMessages, 5000); //fetch every 5 seconds

    return () => clearInterval(intervalId); //cleanup on unmount or user change
  }, [selectedUser, userHeaders]);

  //function to send message
  const handleMessage = async () => {
    if (!message.trim()) {
      alert("Please type a message before sending.");
      return;
    }

    try {
      const requestBody = {
        receiver_id: Number(selectedUser.id),
        receiver_class: "User",
        body: message,
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
        alert(`Message sent to ${selectedUser.email.split("@")[0]}!`);
        setMessage(""); //clear after successful send
      } else {
        alert("Failed to send message. Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the message.");
    }
  };

  return (
    <div className="UserChatDisplay-container">

      <div className="user-info">
        <button>User Details</button>
      </div>
      <div className="userchat-display">
        <div className="hide-scrollbar">
          <div className="userchat-history-display">
            {chatUserMessages.length > 0 ? (
              chatUserMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender?.email === userHeaders.uid ? "sent" : "received"
                  }`}
                >
                  {msg.sender?.email === userHeaders.uid ? (
                    // Sent message: just show the message body
                    <>{msg.body} <img className="receiver-avatar" src={avatar_person} alt="avatar person" width="16px" height="16px" /> </> 
                  )  : (
                    // Received message: show sender's username in blue, followed by the message body
                    <>
                      <span className="sender-username">
                      <img className="sender-avatar" src={avatar_person} alt="avatar person" width="16px" height="16px" /> {msg.sender?.email.split("@")[0] || "User"}:
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

      <div className="userchat-input">
        {selectedUser ? (
          <div className="message-input">
            <textarea
              rows="1"
              cols="120"
              name="comment"
              type="text"
              placeholder={`sending message to ${
                selectedUser.email.split("@")[0]
              } (id ${selectedUser.id})`}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="send-icon">
              <button
                onClick={handleMessage}
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
          <p>Select a user to message</p>
        )}
      </div>
    </div>
  );
}
export default UserChatDisplay;
