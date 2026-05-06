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
#     async for update in agent.run("講一個500字的中文笑話。", stream=True):
#         if update.text:
#             print(update.text, end="", flush=True)
#     print()  # New line after streaming is complete

# asyncio.run(main())

# 3. Multi-modal input
from agent_framework import Message, Content

message = Message(
    role="user",
    contents=[
        Content.from_text("請問這裡是哪裡啊？"),
        Content.from_uri(
            uri="https://www.yzu.edu.tw/admin/pr/images/20260426.jpg",
            media_type="image/jpeg",
        ),
    ],
)


async def main():
    result = await agent.run(message)
    print(result.text)


asyncio.run(main())