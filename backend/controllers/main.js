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

                const {data:user1, error1} = await supabase
                .from('users')
                .select('*')
                .eq('user_phone', incomingMessage.from.phone);

                if(user1[0].language==="malayalam")
                {
                    console.log("malayalam");
                    const message = {
                        body: `ഹലോ ${incomingMessage.from.name}, നിങ്ങളുടെ സാഹചര്യം ശ്രദ്ധിക്കപ്പെട്ടിരിക്കുന്നു`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);
                }
                if(user1[0].language==="hindi")
                {
                    console.log("hindi");
                    const message = {
                        body: `नमस्ते ${incomingMessage.from.name}, आपका आपातकालीन अनुरोध सफलतापूर्वक सबमिट कर दिया गया है। हमारी टीम आपके स्थान पर पहुंच रही है।`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);
                }
                if(user1[0].language==="english")
                {
                    const message = {
                        body: `hey ${incomingMessage.from.name}, your emergency request has been successfully submitted. Our team is on the way to your location.`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);

                }


                return "location";
            }


            if (incomingMessage.audio && incomingMessage.audio.hasOwnProperty("id")) 
            {
                console.log("audio message");

                const audioinfo=await manage_audio(incomingMessage);

                const {data:user, error:err} = await supabase
                .from('users')
                .update({ "language": audioinfo.language })
                .eq('user_phone', incomingMessage.from.phone)
                .select('*');

                const voice_text=audioinfo.text;

                const proccesstext=JSON.parse(await process_text(voice_text));

                if(user[0].language==="malayalam")
                {
                    console.log("malayalam");
                    const message = {
                        body: `ഹലോ ${incomingMessage.from.name}, നിങ്ങളുടെ സാഹചര്യം ശ്രദ്ധിക്കപ്പെട്ടിരിക്കുന്നു`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);
                }
                if(user[0].language==="hindi")
                {
                    console.log("hindi");
                    const message = {
                        body: `नमस्ते ${incomingMessage.from.name}, आपकी स्थिति नोट कर ली गई है.`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);
                }
                if(user[0].language==="english")
                {
                    const message = {
                        body: `hey ${incomingMessage.from.name}, your situation is noted.`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);

                }

                    const getflags=await process_flags(proccesstext.description);

                    const {data:user1, error} = await supabase
                    .from('main_table')
                    .insert([
                        {
                            "user_name": incomingMessage.from.name,
                            "user_phone": incomingMessage.from.phone,
                            "emergency_desc": proccesstext,
                            "flags": JSON.parse(getflags),
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


                if(user[0].user_flag===true)
                {
                    
                    const processtext=JSON.parse(await process_text(incomingMessage.text.body));
                    if(user[0].language==="malayalam")
                    {
                        console.log("malayalam");
                        const message = {
                            body: `ഹലോ ${incomingMessage.from.name}, നിങ്ങളുടെ സാഹചര്യം ശ്രദ്ധിക്കപ്പെട്ടിരിക്കുന്നു`,
                            preview_url: false,
                        };
    
                        await wa.messages.text(message, incomingMessage.from.phone);
                    }
                    if(user[0].language==="hindi")
                    {
                        console.log("hindi");
                        const message = {
                            body: `नमस्ते ${incomingMessage.from.name}, आपकी स्थिति नोट कर ली गई है.`,
                            preview_url: false,
                        };
    
                        await wa.messages.text(message, incomingMessage.from.phone);
                    }
                    if(user[0].language==="english")
                    {
                        const message = {
                            body: `hey ${incomingMessage.from.name}, your situation is noted.`,
                            preview_url: false,
                        };
    
                        await wa.messages.text(message, incomingMessage.from.phone);

                    }




                    const getflags=await process_flags(processtext.description);
                    console.log(getflags);

                    const {data:user1, error} = await supabase
                    .from('main_table')
                    .insert([
                        {
                            "user_name": incomingMessage.from.name,
                            "user_phone": incomingMessage.from.phone,
                            "emergency_desc": processtext,
                            "flags": JSON.parse(getflags),
                        },
                        ]); 

                        await location_request(incomingMessage.from.phone);

                    const {data:user2, error1} = await supabase
                    .from('users')
                    .update({ "user_flag": false })
                    .eq('user_phone', incomingMessage.from.phone);    


                        return "text";
                }




                const {data, error} = await supabase
                  .from('users')
                  .update({ "user_flag": true })
                  .eq('user_phone', incomingMessage.from.phone);
                
                if(user[0].language==="malayalam")
                {
                    console.log("malayalam");
                    const message = {
                        body: `ഹലോ ${incomingMessage.from.name}, ദയവായി നിങ്ങളുടെ അടിയന്തരാവസ്ഥ അറിയിക്കുക`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);
                }
                if(user[0].language==="hindi")
                {
                    console.log("hindi");
                    const message = {
                        body: `नमस्ते ${incomingMessage.from.name}, कृपया अपनी आपातकालीन स्थिति बताएं`,
                        preview_url: false,
                    };

                    await wa.messages.text(message, incomingMessage.from.phone);
                }
                if(user[0].language==="english")
                {
                    const message = {
                        body: `hey ${incomingMessage.from.name} Please state your emergency  `,
                        preview_url: false,
                    };
    
                    await wa.messages.text(message, incomingMessage.from.phone);
    
                }
               
                
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

               await downloadWhatsAppMedia(mediaurl.url,'jeff');



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
                        "image_link":"https://wknqtqxfmrqcgvihsulz.supabase.co/storage/v1/object/public/images/jeff.jpeg"
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