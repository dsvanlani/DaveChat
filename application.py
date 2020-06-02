import os

from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit
from secrets import token_urlsafe as make_url

class Chatroom:
    def __init__(self, creator, date_created, chatroom_name):
        self.creator = creator
        self.date_created = date_created
        self.url = make_url(16)
        self.chatroom_name = chatroom_name
        self.messages = []

        self.json = {
            'creator': self.creator,
            'date_created': self.date_created,
            'url': self.url,
            'chatroom_name': self.chatroom_name,
            'messages': self.messages
        }

class Message:
    def __init__(self, creator, time_stamp, content):
        self.creator = creator
        self.time_stamp = time_stamp
        self.content = content

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chat_list = []
chat_dict = {}

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/chat")
def chat():
    return render_template('chat.html', chat_list=chat_list)

@socketio.on('new chatroom')
def new_chatroom(data):
    # creates a new Chatroom object
    chatroom = Chatroom(
        creator=data['creator'],
        date_created=data['date_created'],
        chatroom_name=data['chatroom_name'])

    # adds chatroom to the chat_list dictionary
    chat_list.append(chatroom.json)
    chat_dict[chatroom.url] = chatroom

    # emits the new chat_list dictionary
    emit("update chat list", chatroom.json, broadcast=True)

@app.route('/chat/<string:url>')
def room(url):
    return f' {chat_dict[url].json}'


# Runs the app in Debug mode
if __name__ == '__main__':
    app.run(debug=True)

