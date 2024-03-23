from typing import Union
import re
import json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()


def get_whisper_transcription(audio_file_path):
    with open(audio_file_path, "rb") as audio_file:
        transcript = client.audio.translations.create(
            model="whisper-1",
            file=audio_file
        )

        return transcript.text


master_function_descriptions = [
    {
        "name": "extract_accident_details",
        "parameters": {

            "type": "object",
            "properties": {
                "Accident_tittle": {
                    "type": "string",
                    "description": "Tittle of the accident",
                },
                "location": {
                    "type": "string",
                    "description": "Location of the accident",
                    },
                "accident_description": {
                    "type": "string",
                    "description": "Description of the accident",
                },
                "user_name": {
                    "type": "string",
                    "description": "Name of the user who reported the accident",
                },
                "accident_type": {
                    "type": "string",
                    "description": "Type of the accident",
                },
                "number_of_people": {
                    "type": "string",
                    "description": "Number of people involved in the accident",
                },
                 "police_needed": {
                    "type": "boolean",
                    "description": "If the accident needs police assistance then true else always give false",
                },
                 "fireforce_needed": {
                    "type": "boolean",
                    "description": "If the accident needs fireforce assistance then true else always give false",
                },
                  "ambulance_needed": {
                    "type": "boolean",
                    "description": "If the accident needs ambulance assistance then true else always give false",
                },
            
            },


        },
    }


]




def extract_details(messages: dict):
    '''
    messages: list of dicts with keys: role, content
    '''
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "from the given conversation  extract the important key details about the accident"},
            {"role": "user", "content": str(messages)}],
        temperature=0.001,
        functions=master_function_descriptions,
        function_call={"name":"extract_accident_details"},


    )
    output = response.choices[0].message
    reason = response.choices[0].finish_reason
    print(output)
    print(reason)

    if reason == "function_call" or reason == "stop":
        params = json.loads(output.function_call.arguments)
        return (params)
    else:
        return (output.content)
