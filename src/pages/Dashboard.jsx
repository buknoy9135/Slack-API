import React, { useState } from "react";
import UserChatDisplay from "../components/UserChatDisplay";
import UserList from "../components/UserList";
// import ChannelChatDisplay from "../components/ChannelChatDisplay";
import ChannelList from "../components/ChannelList";
import CreateChannel from "../components/CreateChannel.jsx";

function Dashboard(props) {
  const { onLogout } = props;

  //useState for Users
  const [showUsers, setShowUsers] = useState(false); //toggle hide/show the users
  const [loading, setLoading] = useState(true); //controls the loading text to appear/hide  
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState();

  //useState for Channels
  

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {loading && <p>Populating users, please wait...</p>}
      {/* <button onClick={sendMessage}>Message</button> */}
      <button onClick={onLogout}>Logout</button>

      <div className="show-users">
        <button onClick={() => setShowUsers(!showUsers)}>
          Direct Messages
        </button>
      </div>

      {showUsers && (
        <UserList
          userList={userList}
          setUserList={setUserList}
          setSelectedUser={setSelectedUser}
          setMessage={setMessage}
          setLoading={setLoading}
        />
      )}

      <UserChatDisplay
        selectedUser={selectedUser}
        message={message}
        setMessage={setMessage}
      />

      <div className="show-channels">
        <button onClick={() => setShowChannels(!showChannels)}>
          Channels List
        </button>
      </div>
      <ChannelList 
      channelList={channelList}
      setChannelList={setChannelList}
      loadingChannel={loadingChannel}
      setLoadingChannel={setLoadingChannel}
      messageChannel={messageChannel}
      setMessageChannel={setMessageChannel}
      showChannels={showChannels}
      setShowChannels={setShowChannels}
      selectedChannel={selectedChannel}
      setSelectedChannel={setSelectedChannel}
      />
      <CreateChannel userList={userList} />

      {/* <ChannelChatDisplay userList={userList} /> */}
    </div>
  );
}

export default Dashboard;
