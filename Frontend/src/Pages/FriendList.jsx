import "../Css/Friendlist.css";

import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import Axios from 'axios'


function FriendList() {
    const [userId, setuserId] = useState("");
    const [friends, setFriends] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {

                    alert("You are not logged in!");
                    setLoading(false);
                    setTimeout(() => {
                        navigate("/login");
                    }, 0);
                    return;
                }

                const response = await Axios.get("http://localhost:2500/userrouter/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setuserId(response.data.user.email);
                setLoading(false);


            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to fetch profile data. Please login again.");
                setLoading(false);
                // localStorage.removeItem("token");
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            }
        };

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true); // Set loading state before making the request

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("You are not logged in!");
                    setLoading(false);
                    return;
                }

                const response = await Axios.post(`http://localhost:2500/userrouter/friends`, { userId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFriends(response.data.friends);
            } catch (err) {
                console.error("Error fetching friends:", err.response ? err.response.data : err);
                setError("Failed to fetch friends data.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFriends();
        }
    }, [userId]);


    const addFriend = async (friendId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in!");
                return;
            }

            const response = await Axios.post(
                `http://localhost:2500/userrouter/addfriend`,
                { userId, friendId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setFriends((prevFriends) => [...prevFriends, response.data.friend]);
        } catch (err) {
            console.error("Error adding friend:", err.response ? err.response.data : err);
            setError("Failed to add friend.");
        }
    };

    const removeFriend = async (friendId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in!");
                return;
            }

            await Axios.delete(`http://localhost:2500/userrouter/removefriend/${userId}/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
        } catch (err) {
            console.error("Error removing friend:", err.response ? err.response.data : err);
            setError("Failed to remove friend.");
        }
    };

    // useEffect(()=>{
    //     const fechallusers = async () => {
    //         try {
    //             const token = localStorage.getItem("token");

    //             if (!token) {
    //                 setError("You are not logged in!");
    //                 setLoading(false);
    //                 return;
    //             }

    //             const response = await Axios.get(`http://localhost:2500/admin/getallusers`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });

    //             console.log(response?.data);
    //             setFriends(response?.data)
    //         } catch (err) {
    //             console.error("Error fetching friends:", err.response ? err.response.data : err);
    //             setError("Failed to fetch friends data.");
    //             setLoading(false);
    //         }
    //     }
    //     fechallusers();
    // },[])


    return (
        <div className="friendlist-container">
            <header className="friendlist-header">
                <h5>ZipChats</h5>
                <p>{userId}</p>
                <div className="friendlist-actions">
                    <button className="add-friend-btn" onClick={() => addFriend(prompt("Enter friend ID to add:"))}>Add Friend</button>
                    <button className="remove-friend-btn" onClick={() => removeFriend(prompt("Enter friend ID to remove:"))}>Remove Friend</button>
                </div>
            </header>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul className="friendlist">
                    {friends.map((friend) => (
                        <li key={friend.id} className={`friend ${friend.status}`} >
                            <img src={friend.profilePicture} alt={friend.username} className="avatar" />
                            <div className="friend-info">
                                <h2>{friend.username}</h2>
                                <p>{friend.status}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default FriendList;
