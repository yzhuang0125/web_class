from flask import Flask, render_template, url_for
from flask import request
from configparser import ConfigParser
import os

# Config Parser
config = ConfigParser()
config.read("config.ini")

from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    google_api_key=config["Gemini"]["API_KEY"]
)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/call_llm", methods=["POST"])
def call_llm():
    if request.method == "POST":
        print("POST!")
        data = request.form
        print(data)
        user_input = "請講一句打招呼的話，不超過 20 字"
        
        event_type = request.form.get("event")

        if event_type == "enemy":

            role_description = """
            你是遊戲裡的NPC，請向玩家提示tomato在右上角(20字以內)。
            """
            user_input = "玩家遇到你了"

        elif event_type == "finish":

            role_description = """
            你是遊戲NPC。
            請恭喜玩家破關(20字以內)，要有滿滿的情緒價值，如果有emoji就更好了。
            """
            user_input = "玩家抵達終點"


        messages = [
            ("system", role_description),
            ("human", user_input),
        ]
        try:
            result = llm.invoke(messages)
            return result.content
        except Exception as e:
            print(f"Error: {e}")
            return "我現在不想跟你講話，待會再來"