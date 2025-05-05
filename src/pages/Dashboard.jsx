import React, { useState } from "react";
import UserChatDisplay from "../components/UserChatDisplay";
import UserList from "../components/UserList";
import ChannelChatDisplay from "../components/ChannelChatDisplay";
import ChannelList from "../components/ChannelList";
import CreateChannel from "../components/CreateChannel.jsx";
import "../css/Dashboard.css";

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

  //function to get the details of channel owner (API channel details display only the ID)
  const channelOwner = selectedChannel
    ? userList.find((user) => user.id === selectedChannel.owner_id)
    : null;

  return (
    <div className="dashboard-container">
      {/* <h2>Dashboard</h2> */}
      <nav className="navleft-container">
        {loading && <p>Populating users, please wait...</p>}

        <div className="show-users-container">
          <div className="show-user-button">
            <button onClick={() => setShowUsers(!showUsers)}>
              ▿ Direct Messages
            </button>
          </div>

          <div className="user-list-container hide-scrollbar">
            {showUsers && (
              <UserList
                userList={userList}
                setUserList={setUserList}
                setSelectedUser={setSelectedUser}
                setMessage={setMessage}
                setLoading={setLoading}
                setSelectedChannel={setSelectedChannel}
              />
            )}
          </div>
        </div>

        {loadingChannel && <p>Populating channels, please wait...</p>}

        <div className="show-channels-container">
          <div className="show-channel-button">
            <button onClick={() => setShowChannels(!showChannels)}>
              ▿ Channels List
            </button>
          </div>

          <div className="channel-list-container hide-scrollbar">
            {showChannels && (
              <ChannelList
                channelList={channelList}
                setChannelList={setChannelList}
                setLoadingChannel={setLoadingChannel}
                setSelectedChannel={setSelectedChannel}
                setMessageChannel={setMessageChannel}
                setSelectedUser={setSelectedUser}
              />
            )}
          </div>
        </div>

        <div className="create-channel-container">
          <CreateChannel userList={userList} />
        </div>
        <div className="logout-button">
          <button onClick={onLogout}>⏻ Logout</button>
        </div>
      </nav>

      <div className="chat-display-area">
        {selectedUser && !selectedChannel && (
          <UserChatDisplay
            selectedUser={selectedUser}
            message={message}
            setMessage={setMessage}
          />
        )}

        {selectedChannel && !selectedUser && (
          <ChannelChatDisplay
            selectedChannel={selectedChannel}
            messageChannel={messageChannel}
            setMessageChannel={setMessageChannel}
            channelOwner={channelOwner} //pass thru ChannelChatDisplay then to ChannelDetails
            userList={userList}
            // selectedUserIds={selectedUserIds}
            // setSelectedUserIds={setSelectedUserIds}
          />
        )}

        <div className="no-message">
          {!selectedUser && !selectedChannel && (
            <h3>Select User or Channel to message...</h3>
          )}
        </div>

        {selectedUser && selectedChannel && (
          <div>
            If you're able to display this, check again. Maybe you have two
            active mouse clicking at the same time.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
