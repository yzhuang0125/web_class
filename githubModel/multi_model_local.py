import asyncio
from dotenv import load_dotenv
from agent_framework.openai import OpenAIChatCompletionClient
import os

load_dotenv()  # Load environment variables from .env file

base_url = os.getenv("GITHUB_MODEL_ENDPOINT")
api_key = os.getenv("GITHUB_MODEL_KEY")
model = os.getenv("GITHUB_MODEL_NAME")

agent = OpenAIChatCompletionClient(
    base_url=base_url,
    api_key=api_key,
    model=model,
).as_agent(
    name="VisionAgent",
    instructions="You are a helpful agent that can analyze images"
)

# 1. Simple run
# async def main():
#     result = await agent.run("Tell me a joke about a pirate.")
#     print(result.text)
# asyncio.run(main())

# 2. Streaming response
# async def main():
#     async for update in agent.run_stream("講一個中文笑話，不超過300字。"):
#         if update.text:
#             print(update.text, end="", flush=True)
#     print()  # New line after streaming is complete

# asyncio.run(main())

# 3. Multi-modal input
from agent_framework import Message, Content

user_contents = []

question = "兩張圖片是同一個品種嗎？"
user_contents.append(Content.from_text(question))

image_list = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq80Nbwsh1plJ9GssZwsq8cd09Q6o7OFupdw&s",
    "cat.jpg",
]

for image_url in image_list:
    if image_url.startswith("http"):
        user_contents.append(Content.from_uri(uri=image_url, media_type="image/jpeg"))
    else:
        with open(image_url, "rb") as f:
            image = f.read()
        user_contents.append(Content.from_data(data=image, media_type="image/jpeg"))

message = Message(
    role="user",
    contents=user_contents,
)

async def main():
    result = await agent.run(message)
    print(result.text)

asyncio.run(main())