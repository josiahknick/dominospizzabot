const discord = require('discord.js');
  const fetch = require('sync-fetch'); 
  
  exports.run = async (client, message, args) => {
    
    const apiKey = 'API_KEY';
  
    const zipCode = args[0];
  
    if (!zipCode) {
      return message.channel.send('Please provide a zip code.');
    }

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
  
    try {
      const geocodingResponse = fetch(geocodingUrl);
      const geocodingData = geocodingResponse.json();
  
      if (geocodingData.status === 'OK' && geocodingData.results.length > 0) {
        const location = geocodingData.results[0].geometry.location;
  
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&rankby=distance&type=restaurant&name=domino%27s+pizza&key=${apiKey}`;
  
        const response = fetch(apiUrl);
        const data = response.json();
  
        if (data.status === 'OK' && data.results.length > 0) {
          const nearestDomino = data.results[0];
          const name = nearestDomino.name;
          const address = nearestDomino.vicinity;
  
          const embed = new discord.MessageEmbed()
            .setTitle('Nearest Domino\'s Pizza Location')
            .addField('Name', name)
            .addField('Address', address)
            .setColor('#FF5733')
            .setTimestamp();
  
          message.channel.send(embed);
        } else {
          message.channel.send('No Domino\'s Pizza location found near the provided zip code.');
        }
      } else {
        message.channel.send('Could not retrieve location data for the provided zip code.');
      }
    } catch (error) {
      console.error(error);
      message.channel.send('An error occurred while fetching data from the API.');
    }
  };
  
