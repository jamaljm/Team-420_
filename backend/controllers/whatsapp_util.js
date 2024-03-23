import axios from 'axios';
import fs from 'fs';
import { supabase } from '../supabaseconf.js';

async function location_request(phonenumber) {
  try {
    const response = await axios.post(`https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      type: "interactive",
      to: `${phonenumber}`,
      interactive: {
        type: "location_request_message",
        body: {
          text: "*share your current location*."
        },
        action: {
          name: "send_location"
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ACCESSTOKEN}`
      }
    });
    
    console.log(response.data); // Log the response data
  } catch (error) {
    console.error('Error:', error.response.data); // Log error response data
  }
}


async function mark_as_seen(messageid) {

    const data = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageid
      };
      
      const config = {
        headers: {
          'Authorization': `Bearer ${process.env.ACCESSTOKEN}`,
          'Content-Type': 'application/json'
        }
      };
  
      
  try {
    const response = await axios.post(`https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}/messages`, data, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}


const remove_msg = async (incomingMessage, res) => {
    // Check if msg is older than 1 min
    const timestamp_str = incomingMessage.timestamp;
    console.log("timestamp_str", timestamp_str);
    const timestamp = new Date(parseInt(timestamp_str) * 1000); // Convert Unix timestamp to milliseconds
    const current_utc_time = new Date();
    const time_difference = current_utc_time - timestamp;
    const one_minute =  45 * 1000; // Convert 1 minute to milliseconds
  
    if (time_difference > one_minute) {
      // Data stored successfully
      console.log("remove msg", time_difference);
      return "exit";
    }
  
    return "proceed";
};
  

const getMediaUrl = async (media_id)=>{
    const headers = {
        'Authorization': `Bearer ${process.env.ACCESSTOKEN}`
    };
    console.log("media_id", media_id);
    console.log("headers", headers);
    try {
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/${media_id}/`, { headers });

        if (response.status === 200) {
            return response.data;
        } else {
            // Handle non-200 status codes if needed
            console.error(`Failed to get media URL. Status Code: ${response.status}`);
            return null;
        }
    } catch (error) {
        // Handle request errors
        console.error('Error fetching media URL:', error.message);
        return null;
    }
}; 


function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // Distance in kilometers

    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}



async function downloadWhatsAppMedia( mediaUrl, waId) {
    const headers = {
        'Authorization': `Bearer ${process.env.ACCESSTOKEN}`
    };

    try {
        // Send a GET request to the media URL
        const response = await axios.get(mediaUrl, { headers, responseType: 'arraybuffer' });

        if (response.status === 200) {
            // Extract the MIME type from the response headers
            const contentType = response.headers['content-type'];

            // Determine the file extension based on the MIME type
            const fileExtension = contentType ? '.' + contentType.split('/')[1] : '';

            // Build the file path including the determined file extension
            const filePath = `${waId}${fileExtension}`;

            // Save the media to the specified file path
           await fs.writeFileSync(filePath, response.data, 'binary');

              // Upload the file to Supabase storage
              const { data, error } = await supabase
              .storage
              .from('images')
              .upload(filePath, response.data, {
                  contentType: contentType
              });

          if (error) {
              console.error('Error uploading file to Supabase:', error.message);
              return null;
          }

            return filePath;
        } else {
            console.error(`Failed to download media. Status code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Error downloading media:', error.message);
        return null;
    }
}


const sent_message=async (req, res) => {

  const msg = req.body.message;

 const message = {
    body: `${msg}`,
    preview_url: false,
  };

  await  wa.messages.text(message, '919778715634');

  return "sent";

};





export { location_request, mark_as_seen, remove_msg, getMediaUrl, calculateDistance, downloadWhatsAppMedia,sent_message};
