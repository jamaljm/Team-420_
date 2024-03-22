import axios from 'axios';

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
        'Authorization': `Bearer ${process.env.WA_ACCESS_TOKEN}`
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
  


export { location_request, mark_as_seen, remove_msg};
