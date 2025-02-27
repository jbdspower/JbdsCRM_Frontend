import {fromLatLng,setKey,setLanguage} from 'react-geocode';

// Set the API key for Geocoding
setKey('AIzaSyDw1Azkwh-3GjkOIig95Xu7aTaqwg8nTVw');
setLanguage('en');

export const getLocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  
            fromLatLng(latitude, longitude).then(
              (response) => {
                if (response.results && response.results.length > 0) {
                  const address = response.results[0].formatted_address;
                  resolve(address);
                } else {
                  reject('No address found for the given coordinates.');
                }
              },
              (error) => {
                console.error('Error retrieving address from coordinates:', error);
                reject('Unable to retrieve address from coordinates.');
              }
            );
          },
          (error) => {
            console.error('Error retrieving your location:', error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject('User denied the request for Geolocation.');
                break;
              case error.POSITION_UNAVAILABLE:
                reject('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                reject('The request to get user location timed out.');
                break;
              case error.UNKNOWN_ERROR:
                reject('An unknown error occurred.');
                break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };
  
  // Mock function for converting latitude and longitude to address
 
  
