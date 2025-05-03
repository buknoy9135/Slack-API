import { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";
import { API_URL } from "../constants/Constants";
import axios from "axios";

function ChannelDetails(props) {
    const { selectedChannel, channelOwner } = props;
    const [channelData, setChannelData] = useState()
    const { userHeaders } = useData();

    //fetch channel details
    useEffect (() => {
        if(!selectedChannel) return;
        const fetchChannelDetails = async () => {
            try {
                const requestHeaders = {
                    headers: userHeaders
                };

                const response = await axios.get(`${API_URL}/channels/${selectedChannel.id}`, requestHeaders);
                
                setChannelData(response.data.data);
                } catch (error) {
                    console.error("Failed to fetch channel details", error)
                    return alert("Cannot get channel details");
                }
            };
            fetchChannelDetails();
        }
    , [selectedChannel, userHeaders])

    return(
        <div className="ChannelDetails-container">
            {selectedChannel && channelData ? (
                <div>                    
                    <p>Channel Name: {channelData.name}</p>
                    <p>Channel ID: {channelData.id}</p>
                    <p>Channel Owner ID: {channelData.owner_id}</p>
                    {channelOwner && (
                        <p>Owner username: {channelOwner.email.split("@")[0]} </p>
                        
                    )}
                    
                </div>
            ) : (
                <p>Select a channel for details</p>
            )}
        </div>
    );
}

export default ChannelDetails;