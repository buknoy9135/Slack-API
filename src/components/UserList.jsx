import React, { useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import avatar_person from "../assets/avatar_person.png";

function UserList(props) {
  const {
    userList,
    setUserList,
    setSelectedUser,
    setMessage,
    setLoading,
    setSelectedChannel,
  } = props;
  const { userHeaders } = useData();

  //function for getUsers
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
    getUsers();

    const intervalId = setInterval(() => {
      getUsers();
    }, 5000); // update getChannels every 5 seconds

    // Clean up the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [userHeaders, setUserList, setLoading]);

  //function to select user (clickable user list)
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedChannel(null); //disables display of channel messages
    setMessage(""); //reset message when changing users
  };

  if (!userList || userList.length === 0) {
    return <div>No users available...</div>;
  }
  return (
    <div className="GetAllUsers-container">
      {userList
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
            <div key={id} className="hide-scrollbar">
              <div
                className="user-select-pointer"
                onClick={() => handleUserClick(individual)}
                style={{
                  cursor: "pointer",
                  // borderBottom: "1px solid #ccc",
                  padding: "0.2rem",
                }}
              >
                <span>
                  <img
                    className="person-avatar"
                    src={avatar_person}
                    alt="avatar person"
                    width="16px"
                    height="16px"
                  />{" "}
                  {username}
                  <span> </span>
                </span>
                <span className="user-id">(ID: {id})</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default UserList;
