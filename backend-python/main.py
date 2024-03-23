from typing import Union
from fastapi import FastAPI, HTTPException, Response
from fastapi import FastAPI, WebSocket, Depends, HTTPException, Form
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from firebase_utils import push_to_firebase

from pydantic import BaseModel
import websockets
from genimage import multigen
import wave

from openai_utilts import extract_details, get_menu, gen_msg, get_whisper_transcription
from location import get_coordinates

import audioop
import base64
import datetime
import json
import os

from fastapi import FastAPI, WebSocket, Depends, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
from twilio.rest import Client
from twilio.twiml.voice_response import Start, VoiceResponse
from dotenv import load_dotenv
import openai

from config import supabase


import vosk
load_dotenv()
app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Set environment variables for your credentials
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
twilio_phone_number = os.environ["TWILIO_PHONE_NUMBER"]
# number_to_call = os.environ["TO_PHONE_NUMBER"]
openai.api_key = os.environ["OPENAI_API_KEY"]

twilio_client = Client(account_sid, auth_token)

model = vosk.Model('model')

CL = '\x1b[0K'
BS = '\x08'

say_queue = []

host = ""


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


class ImageRequest(BaseModel):
    image_url: str


@app.post("/extract-menu")
async def extract_menu_from_image(image_request: ImageRequest):
    try:
        image_url = image_request.image_url
        menu_int = get_menu(image_url)
        url_dict = multigen(menu_int)

        if menu_int is not None:
            menu_items_data = {"menu_items": menu_int, "image_urls": url_dict}
            # Convert data to list of JSON objects
            menu_items_list = []
            for item_name, price in menu_items_data["menu_items"].items():
                image_url = menu_items_data["image_urls"].get(item_name, None)
                menu_item = {
                    "item_name": item_name,
                    "price": price,
                    "image_url": image_url
                }
                menu_items_list.append(menu_item)

            return (menu_items_list)
        else:
            raise HTTPException(
                status_code=500, detail="Error extracting menu from image")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# twilio code 👇👇👇👇👇👇👇👇👇👇


@app.post("/call")
def call(request: Request, CallSid: str = Form(...), From: str = Form(...)):

    global host_global
    global call_id
    global from_phone_no
    from_phone_no = From
    response = VoiceResponse()
    start = Start()
    call_id = CallSid
    host_global = request.headers["host"]

    print(CallSid, From, host_global)

    response.pause(length=2)
    
    print(response)
    return Response(str(response), status_code=200, media_type="text/xml")


concat_response = ""
last_processed: datetime.datetime = datetime.datetime.now()

messages: list[dict[str, str]] = [
    
    {"role": "system", "content": "You are a Accident management bot which recieve message about accident.Make sure to extract type of accident , no of people and location of the user .Make sure to keep the conversation short.At the end say THANK YOU and GOODBYE."},
]
c = 0


@app.websocket("/stream")
async def stream(websocket: WebSocket):
    print("/stream")
    await websocket.accept()
    global concat_response
    global last_processed
    global messages
    global c
    total = None
    """Receive and transcribe audio stream."""
    
    log = open("log.txt", "w")
    while True:
        message = await websocket.receive_text()
        #print("while true")
        packet = json.loads(message)
        if packet['event'] == 'start':
            
                twilio_client.calls(call_id).update(twiml=f"""<Response>
                                                                  <Say voice="Google.en-AU-Standard-D">This is 100,plz state your emergency</Say>
                                                                  <Start>
                                                                    <Stream url="wss://{host_global}/stream" />
                                                                  </Start>
                                                                  <Pause length="20" />
                                                                  </Response>
                                                                  """)
              
            print('Streaming is starting')

            

        elif packet['event'] == 'stop':
           
            print('\nStreaming has stopped')
            params = extract_details(messages)
            if not params:
                continue
            else:
                params["phone_no"] = from_phone_no
                params["status"] = "ordered"
                params["unique_id"] = call_id
                if params.get("location", None):
                    params["coordinates"] = get_coordinates(params["location"])

                # pushd={call_id:params}
                print(params)
                newkey={"type":params["accident_type"],"description":params["accident_description"],"no_of_people":params["number_of_people"]}
                flags = {"police":params["police_needed"],"fireforce":params["fireforce_needed"],"ambulance":params["ambulance_needed"]}
                data, count = supabase.table('main_table').insert({"user_name": params["user_name"],"user_phone":params["phone_no"],"user_lat":params["coordinates"]['lat'],
                                                           "user_lon":params["coordinates"]['lng'],"emergency_desc":newkey,"flags":flags }).execute()
                    
                
        elif packet['event'] == 'media':
            audio = base64.b64decode(packet['media']['payload'])
            

            if total is None:
                total = audio
            else:
                total += audio
            # print("total") 
            if rec.AcceptWaveform(audio):
                print("recc")
                r = json.loads(rec.Result())
                voice_response = r['text']
                print(f"the other {voice_response}")

                concat_response += f" {voice_response}"

                time_difference = datetime.datetime.now() - last_processed               #nice
                print(time_difference.total_seconds())
               
                # Specify the output file name and format
                output_file = 'output.wav'
                print("output file")
                

                # Create a WAV file and write the audio data
                with wave.open(output_file, 'w') as wf:
                    wf.setnchannels(channels)
                    wf.setsampwidth(sample_width)
                    wf.setframerate(sample_rate)
                    wf.writeframes(total)
                transcript = get_whisper_transcription(output_file)

                print(f"does openai work {transcript}")

            # concat_response += f" {transcript}"

                # print(concat_response)
                messages.append({"role": "user", "content": transcript})

                response_message = gen_msg(messages=messages)

                messages.append(
                    {"role": "assistant", "content": response_message})

                print(f"GPT response demo: {response_message}")
                twilio_client.calls(call_id).update(twiml=f"""<Response>
                                                                  <Say voice="Google.en-AU-Standard-D"> {response_message} </Say>
                                                                  <Start>
                                                                    <Stream url="wss://{host_global}/stream" />
                                                                
                                                                  """)
                last_processed = datetime.datetime.now()
                print("last processed")
                break
            else:
                r = json.loads(rec())
                print(CL + r['partial']*)
                      

    print("final")


public_url = ""


if __name__ == '__main__':
    port = 5000
    public_url = "https://f40b-14-139-171-162.ngrok-free.app"
    number = twilio_client.incoming_phone_numbers.list()[0]
    number.update(voice_url=public_url + '/call')

    print(f'Waiting for calls  {number.phone_number}')
    print(f"Listening for audio on {public_url}")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port, )
