import React, { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import UserChatDisplay from "./UserChatDisplay";
import UserList from "./UserList";
import ChannelChatDisplay from "./ChannelChatDisplay";

function GetAllChannels() {
  const { userHeaders } = useData();

  //channels useState
  const [channelList, setChannelList] = useState([]);
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [showChannels, setShowChannels] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messageChannel, setMessageChannel] = useState();

  //function for getChannels
  const getChannels = async () => {
    try {
      const requestHeaders = {
        headers: userHeaders,
      };

      const response = await axios.get(`${API_URL}/channels`, requestHeaders);
      const { data } = response;
      setChannelList(data.data);
    } catch (error) {
      if (error) {
        return alert("Cannot get channels");
      }
    } finally {
      setLoadingChannel(false); // success or not, will stop loading
    }
  };

  useEffect(() => {
    if (channelList.length === 0) {
      getChannels();
    }
  });

  //   function to select channel and make it clickable
  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
    setMessageChannel(""); //reset message when changing channels
  };

  return (
    <div className="GetAllChannels-container">
      {loadingChannel && <p>Populating channels, please wait...</p>}
      <div className="show-channels">
        <button onClick={() => setShowChannels(!showChannels)}>
          Channels List
        </button>
      </div>
      {showChannels &&
        channelList.map((channel) => {
          const { id, owner_id, name } = channel;
          return (
            <div
              className="channel-select-pointer"
              key={id}
              onClick={() => handleChannelClick(channel)}
              style={{ cursor: "pointer", padding: "0.2rem" }}
            >
              <span>
                <strong> {name} </strong>
              </span>
              <span> {owner_id} (owner ID) </span>
              <span> {id} (channel ID) </span>
            </div>
          );
        })}
    </div>
  );
}
export default GetAllChannels;
