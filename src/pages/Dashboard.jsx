import React, { useState } from "react";
import UserChatDisplay from "../components/UserChatDisplay";
import UserList from "../components/UserList";
import ChannelChatDisplay from "../components/ChannelChatDisplay";
import ChannelList from "../components/ChannelList";
import CreateChannel from "../components/CreateChannel.jsx";

function Dashboard(props) {
  const { onLogout } = props;

  //useState for Users
  const [showUsers, setShowUsers] = useState(true); //toggle hide/show the users
  const [loading, setLoading] = useState(true); //controls the loading text to appear/hide
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState();

  //useState for Channels
  const [channelList, setChannelList] = useState([]);
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messageChannel, setMessageChannel] = useState();

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {loading && <p>Populating users, please wait...</p>}

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

      {loadingChannel && <p>Populating channels, please wait...</p>}
      {showChannels && (
        <ChannelList
          channelList={channelList}
          setChannelList={setChannelList}
          setLoadingChannel={setLoadingChannel}
          setSelectedChannel={setSelectedChannel}
          setMessageChannel={setMessageChannel}
        />
      )}

      <CreateChannel userList={userList} />

      <ChannelChatDisplay
        selectedChannel={selectedChannel}
        messageChannel={messageChannel}
        setMessageChannel={setMessageChannel}
      />

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
