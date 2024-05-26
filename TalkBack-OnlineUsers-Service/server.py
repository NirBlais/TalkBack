from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import logging

    
app = Flask(__name__)

CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*",supports_credentials=True)

userList=[]


# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     # response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
#     return response
@app.route("/userlogdin", methods=["POST"])
def UserLogdIn():
    username = request.json.get("username")
    if(username):    
        if(str(username) not in userList):    
            userList.append(str(username))
        socketio.emit('userlogdin', {'username':username,'userList':userList})
        return username,200
    return "no username sent", 400

@app.route("/userlogdout", methods=["POST"])
def UserLogdOut():
    username = request.json.get("username")
    if(username):
        if(str(username) in userList):
            userList.remove(str(username))
            socketio.emit('userlogdout', {'username':username,'userList':userList})
            return "user logd out",200
    return "no user", 400


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5175)