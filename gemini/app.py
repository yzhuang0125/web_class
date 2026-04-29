from configparser import ConfigParser

# Set up the config parser
config = ConfigParser()
config.read("config.ini")

from langchain_google_genai import ChatGoogleGenerativeAI

llm_gemini = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    google_api_key=config["Gemini"]["API_KEY"]
)

user_input = "可以抽大麻嗎？"

role_description_1 = """
你是一個是天使
"""

messages = [
    ("system", role_description_1),
    ("human", user_input),
]

response_gemini = llm_gemini.invoke(messages)

print(f"問 : {user_input}")
print(f"Gemini : {response_gemini.content}")

role_description_2 = """
你是一個是大惡魔
"""

messages = [
    ("system", role_description_2),
    ("human", user_input),
]

response_gemini = llm_gemini.invoke(messages)

print(f"問 : {user_input}")
print(f"Gemini : {response_gemini.content}")