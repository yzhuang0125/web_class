import pandas as pd
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def formPage():
    df = pd.read_csv(
        "https://www.taifex.com.tw/data_gov/taifex_open_data.asp?data_name=DailyForeignExchangeRates",
        # encoding="cp950",
    )
    df.isnull().sum()
    df.drop(df.iloc[:, 5:], axis=1, inplace=True)
    df.drop(df.iloc[:, 2:4], axis=1, inplace=True)
    df.columns = ["date", "usd-twd", "usd-jpy"]
    df["twd-jpy"] = df["usd-twd"] / df["usd-jpy"]
    # df.drop(df.iloc[:, 1:3], axis=1, inplace=True)
    df['date'] = pd.to_datetime(df['date'], format='%Y%m%d')
    df['date'] = df["date"].astype(str)
    result = df.to_json(orient="records")
    return render_template("index.html", exchangeData=result)

if __name__ == '__main__':
    app.run()