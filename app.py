from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db= client.dbjungle

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/memo', method=['GET'])
def listing():
    title_give = requests.args.get('title_give')
    return jsonify({'result':'success', 'msg':'GET 연결 완료'})

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'], request.form['password']):
            return log_the_user_in(request.form['username'])
        else :
            error = 'Invalid username/password'
    return render_template('login.html', error=error)


@app.route('/love', method=['GET', 'POST'])

@app.errorhandler(404)
def not_found():
    return render_template('error_html'), 404





if __name__ == '__main__':  
   app.run('0.0.0.0',port=5001,debug=True)