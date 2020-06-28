import os

from datetime import datetime
from flask import Flask, jsonify, make_response, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


# variables
class Channel:
    def __init__(self, name, messages):
        self.name = name
        self.messages = messages
    def __getitem__(self, name):
        return self.messages

class Message:
    def __init__(self, text, timestamp, user):
        self.text = text
        self.timestamp = timestamp
        self.user = user

channels = []

@app.route("/")
def index():
    return render_template("index.html", channels = channels)

@app.route("/new-channel", methods=["POST"])
def newchannel():
    # get name (parameter or form input)
    name = request.form.get("channel-name")

    # check for existing channel
    for channel in channels:     
        if channel.name == name:
            # go to channel page if found 
            return redirect(url_for("channel", channelname = name))

    # if not found in list, create new channel
    new_chan = Channel(name=name, messages=[])
    channels.append(new_chan)
    return redirect(url_for("channel", channelname = name))

@app.route("/channel/<channelname>")
def channel(channelname):
    # check for existing channel
    for channel in channels:
        if channel.name == channelname:
            # go to channel page if found
            return render_template("channel.html", curr_channel = channel, channels = channels)
    
    # if not found in list, return error
    return make_response(render_template("404.html"), 404)

@socketio.on("new message")
def newmsg(message):
    # get text and time of message and save as Message
    text = message["text"]
    timestamp = datetime.utcnow()
    msg = Message(text=text, timestamp=timestamp, user=message["user"])

    # convert time to string
    timestamp = json.dumps(timestamp.isoformat())

    # add message to channel
    channel = message["channel"]
    for chan in channels:
        if chan.name == channel:
            if len(chan["messages"]) == 100:
                chan["messages"].pop(0)
            chan["messages"].append(msg)
            break
    
    # emit message
    emit("update messages", {"message": text, "timestamp": timestamp, "user": message["user"]}, broadcast=True)
