import os

from flask import Flask, render_template, redirect
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
    def __init__(self, creator, time_stamp, content, url, color='black'):
        self.creator = creator
        self.time_stamp = time_stamp
        self.content = content
        self.url = url
        self.color = color
        self.data = [creator, time_stamp, content, color]
        self.json = {'creator': creator,
                     'time_stamp': time_stamp,
                     'content': content,
                     'url': url,
                     'color': color}


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


@app.route('/chat/<string:url>')
def room(url):
    return render_template('room-v2.html',
                        chatroom_name=chat_dict[url].chatroom_name,
                        creator=chat_dict[url].creator,
                        date_created=chat_dict[url].date_created,
                        messages=chat_dict[url].messages,
                        url=url,
                        chat_list=chat_list
                        )


@socketio.on('new chatroom')
def new_chatroom(data):
    # creates a new Chatroom object
    chatroom = Chatroom(
        creator=data['creator'],
        date_created=data['date_created'],
        chatroom_name=data['chatroom_name'])

    # adds chatroom to chat_list and chat_dict
    chat_list.append(chatroom.json)
    chat_dict[chatroom.url] = chatroom

    # emits the new chat_list dictionary
    emit("update chat list", chatroom.json, broadcast=True)


@socketio.on('new message')
def new_message(data):
    # creates a new Message object
    message = Message(
        creator=data['creator'],
        time_stamp=data['time_stamp'],
        content=data['content'],
        url=data['chatroom_url'],
        color=data['color'])

    # adds the message.data to the chatroom messages list
    obj = chat_dict[data['chatroom_url']]
    obj.messages.append(message.json)

    if len(obj.messages) > 100:
        del obj.messages[0]

    emit("update message list", message.json, broadcast=True)



if __name__ == '__main__':
    app.run(debug=False)
    socketio.run(app)
