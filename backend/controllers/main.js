import { whatsapp1, supabase, wa } from "../supabaseconf.js";

import { mark_as_seen,location_request,remove_msg,getMediaUrl,downloadWhatsAppMedia } from "./whatsapp_util.js";
import { process_text,process_voice,fetchCompletion, process_flags } from "./openai_utils.js";
import { manage_audio } from "./audio.js";


const mainflow = async (req, res) => {
    try {
        let body = whatsapp1.parseMessage(req.body);

        if (body?.isMessage) {
            let businessId = body.WABA_ID;
            let incomingMessage = body.message;
            let recipientPhone = incomingMessage.from.phone;
            let typeOfMsg = incomingMessage.type;


           

            let msg = incomingMessage.text?.body || '';

            const removeStatus = await remove_msg(incomingMessage, res);

            if (removeStatus === "exit") {
                return "removed";
        
            }

            await mark_as_seen(incomingMessage.message_id);


            console.log("from ", incomingMessage.from.phone);




            if(typeOfMsg==="location_message" && incomingMessage.location.hasOwnProperty("latitude"))
            {


                console.log("location message");


                console.log(incomingMessage.location);

                const {data:user, error:err} = await supabase
                .from('main_table')
                .update({ "user_lat": incomingMessage.location.latitude, "user_lon": incomingMessage.location.longitude })
                .eq('user_phone', incomingMessage.from.phone)
                .order('created_at', { ascending: false })
                .limit(1);


                const message = {
                    body: `hey ${incomingMessage.from.name} emergency request has been successfully submitted. Our team is on the way to your location.`,
                    preview_url: false,
                };

                await wa.messages.text(message, incomingMessage.from.phone);

                return "location";
            }


            if (incomingMessage.audio && incomingMessage.audio.hasOwnProperty("id")) 
            {
                console.log("audio message");

                const audioinfo=await manage_audio(incomingMessage);

                const {data:user, error:err} = await supabase
                .from('users')
                .update({ "language": audioinfo.language })
                .eq('user_phone', incomingMessage.from.phone);

                const voice_text=audioinfo.text;

                const description=await process_text(incomingMessage.text.body);

                    const message = {
                        body: `hey ${incomingMessage.from.name}, your sitvation is noted.`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);


                    const getflags=await process_flags(description);

                    const {data:user1, error} = await supabase
                    .from('main_table')
                    .insert([
                        {
                            "user_name": incomingMessage.from.name,
                            "user_phone": incomingMessage.from.phone,
                            "emergency_desc": description,
                            "flags": getflags,
                        },
                        ]); 

                        await location_request(incomingMessage.from.phone);

                return "audio";
            }



            if (incomingMessage.text && incomingMessage.text.hasOwnProperty("body")) {
                
                 console.log("text message");

                const {data:user, error:err} = await supabase
                .from('users')
                .select('*')
                .eq('user_phone', incomingMessage.from.phone);
    
                if(user[0].user_flag===true)
                {
                    
                    const description=await process_text(incomingMessage.text.body);

                    const message = {
                        body: `hey ${incomingMessage.from.name}, your sitvation is noted.`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);


                    const getflags=await process_flags(description);

                    const {data:user1, error} = await supabase
                    .from('main_table')
                    .insert([
                        {
                            "user_name": incomingMessage.from.name,
                            "user_phone": incomingMessage.from.phone,
                            "emergency_desc": description,
                            "flags": getflags,
                        },
                        ]); 

                        await location_request(incomingMessage.from.phone);

                    const {data:user2, error1} = await supabase
                    .from('users')
                    .update({ "user_flag": false })
                    .eq('user_phone', incomingMessage.from.phone);    


                        return "text";
                }



                if(user.length===0)
                {
    
                  const {data, error} = await supabase
                  .from('users')
                  .insert([
                      {
                        user_name: incomingMessage.from.name,
                        user_phone: incomingMessage.from.phone,
                        user_flag:true,
                      },
                    ]);
    
                }

                const message = {
                    body: `hey ${incomingMessage.from.name} Plz state the emergency situation `,
                    preview_url: false,
                };

                await wa.messages.text(message, incomingMessage.from.phone);

                

               
                // await location_request(incomingMessage.from.phone);

                return "text";

            }


            if(typeOfMsg==="media_message" && incomingMessage.image.hasOwnProperty("id"))
            {
                console.log("image message");

                const {data:user, error:err} = await supabase
                .from('users')
                .select('*')
                .eq('user_phone', incomingMessage.from.phone);
    
                if(user.length===0)
                {
    
                  const {data, error} = await supabase
                  .from('users')
                  .insert([
                      {
                        user_name: incomingMessage.from.name,
                        user_phone: incomingMessage.from.phone,
                      },
                    ]);
    
                }
            

                const mediaurl=await getMediaUrl(incomingMessage.image.id);
                console.log(mediaurl.url);

               await downloadWhatsAppMedia(mediaurl.url,'1234');
                const imageinfo=await fetchCompletion();

                const regex = /{([^}]*)}/;
                const match = regex.exec(imageinfo);

                const contentBetweenBraces = match[1];
                console.log(contentBetweenBraces);
                const newjson=JSON.parse('{'+contentBetweenBraces+'}');
                console.log(newjson);
                
                const {data:user1, error} = await supabase
                .from('main_table')
                .insert([
                    {
                        "user_name": incomingMessage.from.name,
                        "user_phone": incomingMessage.from.phone,
                        "emergency_desc": newjson,
                    },
                    ]); 


                    const result=JSON.parse(await process_flags(newjson.description));


                    const {data:user2, error1} = await supabase
                    .from('main_table')
                    .update({ "flags": result })
                    .eq('user_phone', incomingMessage.from.phone);
                    

                    await location_request(incomingMessage.from.phone);


                return "image";
            }

            
    

}

    } catch (error) {
        console.error("Error in signupController:", error);

        return "error";
    }
};



export { mainflow };