import axios from 'axios';
import { whatsapp1, supabase, wa,openai } from "../supabaseconf.js";
import dotenv from "dotenv";
import fs from 'fs';


dotenv.config();



const translate_to = async (language,msg) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `translate the below text to ${language}.
                                              ${msg}
                                                        `,
            },
        ],
        temperature: 0.1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
};




const process_flags = async (desc) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content:`
                REPLY ONLY IN JSON FORMAT ONLY
                ${desc}
  based on the given data analyse the data and return json like the eg whether the given situation needs a police,fireforce or ambulance.
  if it belongs to she_help or women safety the return accordingly. the result  should be in a json format.
    
                eg: {
                    "police": true,
                    "fireforce": false,
                    "ambulance": false,
                    "she_help": false
                }   
                return json only  `,
            },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
  
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  };
  

  const process_text = async (desc) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content:` ONLY REPLY IN JSON FORMAT
                ${desc}

from the given description find the approx no of people,type of the accident and a small description to understand the accident.
return the details in this format. please return a json even if data is wrong only once
eg: 
{
    "no_of_people": 2,
    "type": "car accident",
    "description":"There is a huge car accident occured and 3 people are injured.2 May have seen lost some blood and 1 person is in critical condition."
}` ,
            },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
  
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  };
  


const process_voice = async (incomingMessage,text) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `I will give a text from product details, and return a JSON of all product details including product_name as mandatory, price, and all the details without making new unspecified keys and values in the json
                            text: ${text}
                            `,
            },
        ],
        temperature: 0.1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log(response.choices[0].message.content);
    const temp_json = response.choices[0].message.content;
    const p_json = JSON.parse(temp_json);

    console.log("pppppppp", p_json.product_name);
   const image_url=await make_image(p_json.product_name);
   

    const {data,error} = await supabase
    .from('sellers')
    .insert([
        {
            farmer_id: incomingMessage.from.phone,
            products: p_json,
            image_url: image_url,
            farmer_name: incomingMessage.from.name,
            
        },
        ]).select('*');

        

    const ret_json = {
        p_json: p_json,
        image_url: image_url,
        id: data[0].id
        };
          

    return ret_json;
};


// const processimage = async (imageUrl,language) => {
//     const response = await openai.chat.completions.create({
//         model: "gpt-4-vision-preview",
//         messages: [
//             {
//                 role: "user",
//                 content: [
//                     {
//                         type: "text",
//                         text: `Analyze the image and give the details about the accident or disaster in the image.
// find out the no of injured person,type of the accident , severity of the accident in the scale of 1-10 and a small description to understand the accident for police,
// fireforce and hospitals.

// return the details in the format of JSON.

// eg: {

//     "no_of_injured": 2,
//     "type": "car accident",
//     "severity": 7,
//     "description":"There is a huge car accident occured and 3 people are injured.2 May have seen lost some blood and 1 person is in critical condition."
    
// }`,
//                     },
//                     {
//                         type: "image_url",
//                         image_url: {
//                             url: imageUrl,
//                             "detail": "low",
//                         },
//                     },
//                 ],
//             },
//         ],
//         max_tokens: 1000,
//     });
//     console.log(response.choices[0].message.content);
//     return response.choices[0].message.content;
// };


// Function to encode the image


function encodeImage(imagePath) {
    if (fs.existsSync(imagePath)) 
 {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
 
}
}

const imagePath = "jeff.jpeg";

// Getting the base64 string
const base64Image = encodeImage(imagePath);

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
};

const payload = {
  "model": "gpt-4-vision-preview",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          text: `from the given image find the approx no of people,type of the accident and a small description to understand the accident.
         return the details in this format. please return a json even if data is wrong only once
          eg: 
           {
              "no_of_people": 2,
              "type": "car accident",
              "description":"There is a huge car accident occured and 3 people are injured.2 May have seen lost some blood and 1 person is in critical condition."
          }`,
        },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:image/jpeg;base64,${base64Image}`
          }
        }
      ]
    }
  ],
  "max_tokens": 3000
};

async function fetchCompletion() {
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
    //console.log(response.data.choices[0].message.content);

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:111111 ", error.response.data);
  }
}


export {translate_to,process_voice,process_text,fetchCompletion,process_flags};