import { whatsapp1, supabase, wa } from "../supabaseconf.js";

import { mark_as_seen,location_request,remove_msg } from "./whatsapp_util.js";


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




            if(typeOfMsg==="location" && incomingMessage.location.hasOwnProperty("latitude"))
            {


                console.log("location message");


                console.log(incomingMessage.location);



                return "location";
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
                  .from('user')
                  .insert([
                      {
                        user_name: incomingMessage.from.name,
                        user_phone: incomingMessage.from.phone,
                      },
                    ]);
    
                }
               
                await location_request(incomingMessage.from.phone);





                return "text";

            }


            if(typeOfMsg==="media_message" && incomingMessage.image.hasOwnProperty("id"))
            {
                console.log("image message");




                return "image";
            }

            
    

}

    } catch (error) {
        console.error("Error in signupController:", error);
        // Handle the error appropriately, e.g., return an error response
        return "error";
    }
};



export { mainflow };