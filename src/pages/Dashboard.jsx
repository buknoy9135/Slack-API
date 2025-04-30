import React, { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import UserChatDisplay from "../components/UserChatDisplay";

function Dashboard(props) {
  const { onLogout } = props;
  const { userHeaders } = useData();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true); //controls the loading text to appear/hide
  const [showUsers, setShowUsers] = useState(false); //toggle hide/show the users
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState();

  const getUsers = async () => {
    try {
      // axios.get(url, object that has the headers key - value would be the required headers)
      const requestHeaders = {
        headers: userHeaders,
      };
      const response = await axios.get(`${API_URL}/users`, requestHeaders);
      const { data } = response;
      setUserList(data.data);
    } catch (error) {
      if (error) {
        return alert("Cannot get users");
      }
    } finally {
      setLoading(false); // success or not, will stop loading
    }
  };

  useEffect(() => {
    if (userList.length === 0) {
      getUsers();
    }
  },);

  //function to select user (clickable user list)
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessage(""); //reset message when changing users
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {loading && <p>Populating users, please wait...</p>}
      {/* <button onClick={sendMessage}>Message</button> */}
      <button onClick={onLogout}>Logout</button>

      <div className="show-users">
        <button onClick={() => setShowUsers(!showUsers)}>User List</button>
      </div>

      {showUsers &&
        userList &&
        userList
          .filter((invidual) => invidual.id >= 194) // filter to display only IDs 194 and up
          .sort((a, b) => {
            const emailA = a.email.toLowerCase();
            const emailB = b.email.toLowerCase();
            return emailA.localeCompare(emailB); //sort alphabetically the email
          })
          .map((individual) => {
            const { id, email } = individual;
            const username = email.split("@")[0]; //remove @ onwards of email to get username
            return (
              <div
                className="user-select-pointer"
                key={id}
                onClick={() => handleUserClick(individual)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              >
                <p>ID: {id}</p>
                <p>
                  <strong>{username}</strong>
                </p>
              </div>
            );
          })}
      {!userList && <div>No users available...</div>}
      <UserChatDisplay
        selectedUser={selectedUser}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
}

export default Dashboard;
