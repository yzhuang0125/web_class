import asyncio
from dotenv import load_dotenv
# from agent_framework.openai import OpenAIChatClient
from agent_framework.openai import OpenAIChatCompletionClient
import os

load_dotenv()  # Load environment variables from .env file

# base_url = os.getenv("AZURE_OPENAI_ENDPOINT")
# api_key = os.getenv("AZURE_OPENAI_API_KEY")
# model = os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")

base_url = os.getenv("GITHUB_MODEL_ENDPOINT")
api_key = os.getenv("GITHUB_MODEL_KEY")
model = os.getenv("GITHUB_MODEL_NAME")

agent = OpenAIChatCompletionClient(
    base_url=base_url,
    api_key=api_key,
    model=model,
).as_agent(
    instructions="You are good at telling jokes.",
    name="Joker"
)

# 1. Simple run
async def main():
    result = await agent.run("Tell me a joke about a pirate.")
    print(result)

asyncio.run(main())