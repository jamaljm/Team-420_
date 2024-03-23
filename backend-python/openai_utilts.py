from typing import Union
import re
import json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()


def get_menu(image_url: str) -> Union[str, dict, None]:
    """
    Given an image url, return the menu items and their prices
    """

    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "You are given a picture of a restaurant menu. Extract the menu items and their prices . Only include the amount number and not the currency or stuff .Return only the JSON object with the menu items and their prices.Please dont include another json object inside the main one."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                        },
                    },
                ],
            }
        ],
        max_tokens=1000,
        temperature=0.001,

    )

    json_string = (response.choices[0].message.content)

    print(json_string)
    pattern = re.compile(r'{(.*?)}', re.DOTALL)
    match = pattern.search(json_string)

    if match:
        extracted_content = match.group(1)
        extracted_content = "{"+extracted_content+"}"
        try:
            extracted_content = json.loads(extracted_content)
        except json.JSONDecodeError as e:
            return f"Error decoding JSON: {e}"
        # Remove the '/-' and convert the prices to integers
        menu_int = {item: int(price)
                    for item, price in extracted_content.items()}

        return (menu_int)
    else:
        print("regex error")
        return (None)


def generate_image(prompt, size):
    '''
    available sizes:  1024x1024, 1024x1792 or 1792x1024
    '''
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    return image_url


def gen_msg(messages: list):
    '''
    messages: list of dicts with keys: role, content
    '''
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        temperature=0.001,


    )

    return (response.choices[0].message.content)


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



dbitem="{'Ch. Shawarma Rumali': 110, 'Ch. Crispy Shawarma Rumali': 120, 'Ch. Cheesy Shawarma Rumali': 120, 'Ch. Shawarma Bread': 110, 'Ch. Sandwich': 60, 'Ch. Cheese Sandwich': 80, 'Ch. Cheese Garlic Sandwich': 85, 'Ch. Cheese Chilli Sandwich': 85, 'Ch. Grilled Sandwich': 80, 'Mix Veg Sandwich': 50, 'Veg Cheese Sandwich': 70, 'Veg Paneer Sandwich': 90, 'Veg Capsicum Sandwich': 80, 'Ch. Burger': 85, 'Ch. Cheese Burger': 110, 'Ch. Zinger Burger': 110, 'Ch. Jumbo Burger': 130, 'Veg Burger': 60, 'Veg Cheese Burger': 85, 'Drumsticks (3 pcs)': 180, 'Ch. Nuggets (3 pcs)': 90, 'Ch. Cheesy Fingers (3 pcs)': 150, 'French Fries': 60}"

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
