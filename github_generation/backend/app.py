from flask import Flask, jsonify, request, send_from_directory
import random
import os

# 建立 Flask 應用，將前端目錄設為靜態資源目錄
app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend'),
    static_url_path='',
    template_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend')
)

# 辦公室對話題庫，每個 NPC 有一組題目與四個選項
QUESTIONS = [
    {
        'npc': '同事 Alice',
        'context': 'Alice 想要你幫忙檢查一封英語郵件。',
        'question': 'How should you respond when Alice asks you to check her email?',
        'options': [
            'Sure, I can help review it for you.',
            'No, I am too busy right now.',
            'You should ask someone else.',
            'I don\'t know how to write emails.'
        ],
        'correct': 0
    },
    {
        'npc': '經理 Bob',
        'context': 'Bob 正在找人討論週五的會議安排。',
        'question': 'What is the most appropriate reply to Bob?',
        'options': [
            'I would like to join the meeting and help prepare the agenda.',
            'I don\'t care about the meeting.',
            'Maybe you should cancel the meeting.',
            'I am leaving early today.'
        ],
        'correct': 0
    },
    {
        'npc': '行政助理 Carol',
        'context': 'Carol 想確認你是否可以幫忙訂會議室。',
        'question': 'Which response is best?',
        'options': [
            'Yes, I can reserve the room for the meeting.',
            'No, I won\'t do it.',
            'I don\'t know where the room is.',
            'Ask Bob to do it instead.'
        ],
        'correct': 0
    },
    {
        'npc': '設計師 Dave',
        'context': 'Dave 想知道你對新的演示文稿有什麼想法。',
        'question': 'What is the best answer?',
        'options': [
            'I think the slides are clear and the design looks great.',
            'The slides are terrible.',
            'I haven\'t looked at them yet.',
            'Just use a different font.'
        ],
        'correct': 0
    }
]

@app.route('/')
def index():
    """傳回前端靜態首頁。"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/static/<path:filename>')
def static_assets(filename):
    """傳回 static 資料夾中的圖片與其他資源。"""
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'static'), filename)

@app.route('/api/question', methods=['GET'])
def get_question():
    """隨機選擇一個對話題目，並回傳給前端。"""
    question = random.choice(QUESTIONS)
    return jsonify({
        'npc': question['npc'],
        'context': question['context'],
        'question': question['question'],
        'options': question['options'],
        'id': QUESTIONS.index(question)
    })

@app.route('/api/evaluate', methods=['POST'])
def evaluate_answer():
    """評估玩家所選的答案是否正確。"""
    data = request.get_json() or {}
    question_id = data.get('id')
    selected = data.get('selected')

    if question_id is None or selected is None:
        return jsonify({'error': 'Missing id or selected answer.'}), 400

    if not (0 <= question_id < len(QUESTIONS)):
        return jsonify({'error': 'Invalid question id.'}), 400

    question = QUESTIONS[question_id]
    correct = question['correct'] == selected
    message = '回答正確！' if correct else f"回答不正確，正確答案是：{question['options'][question['correct']]}"

    return jsonify({
        'correct': correct,
        'message': message,
        'correctIndex': question['correct']
    })

if __name__ == '__main__':
    app.run(debug=True)
