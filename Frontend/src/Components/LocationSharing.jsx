// client/src/components/LocationShare.js
// import React from 'react';
import Axios from 'axios';

const LocationShare = ({ senderId, receiverId }) => {
    const shareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
                // Encrypt and send the locationMessage similar to text messages
                // Example:
                socket.emit('sendMessage', { senderId, receiverId, content: encryptMessage(locationMessage), type: 'location' });
            });
        } else {
            alert('Geolocation not supported');
        }
    };

    return <button onClick={shareLocation}>Share Location</button>;
};

export default LocationShare;