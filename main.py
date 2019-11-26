from __future__ import print_function
from flask import Flask, render_template, request, send_file
import urllib2
import json, sys, base64
import eyed3
from api import api
API = api.api()
app = Flask(__name__)


@app.route("/")
def gethtml():
    return render_template('index.html')

@app.route("/fileTree")
def getfiles():
    return API.getFileTree()

@app.route('/music')
def download_file():
    filepath = request.args.get("path")
    return send_file(base64.b64decode(filepath))

@app.route('/trackinfo')
def getinfo():
    filepath = request.args.get("path")
    audiofile = eyed3.load(base64.b64decode(filepath))
    return json.dumps({"artist": audiofile.tag.artist, "album": audiofile.tag.album, "name": audiofile.tag.title})

@app.route('/files')
def files():
    return render_template('files.html')

@app.route('/playing')
def playing():
    return render_template('playing.html')

@app.route('/playlists')
def playlists():
    return render_template('playlists.html')

@app.route('/savePlaylist', methods = ['POST'])
def savePlaylist():
    a = request.get_json()
    print(a, file=sys.stderr)
    with open('/home/vova/PycharmProjects/music player/playlists/playlists.txt', 'r') as outfile:
        b = json.load(outfile)
        b.append(a)
        with open('/home/vova/PycharmProjects/music player/playlists/playlists.txt', 'w') as outfile1:
            json.dump(b, outfile1)
    return "ok",200

@app.route('/getPlaylists')
def getPlaylists():
    with open('/home/vova/PycharmProjects/music player/playlists/playlists.txt', 'r') as f:
        a = f.read()
    return a

@app.route('/deletePlaylist', methods = ['POST'])
def delPlaylist():
    a = request.get_json()
    with open('/home/vova/PycharmProjects/music player/playlists/playlists.txt', 'r') as outfile:
        b = json.load(outfile)
        for i in b:
            if i['name'] == a['name']:
                b.remove(i)
        with open('/home/vova/PycharmProjects/music player/playlists/playlists.txt', 'w') as outfile1:
            json.dump(b, outfile1)
    return "ok", 200

@app.route('/getPlaylistSongs', methods = ['POST'])
def getPlSongs():
    a = request.get_json()
    with open('/home/vova/PycharmProjects/music player/playlists/playlists.txt', 'r') as outfile:
        b = json.load(outfile)
        for i in b:
            if i['name'] == a['name']:
                return json.dumps(i)
    return "", 404




# endpoint get all playlists / delete playlist by name
