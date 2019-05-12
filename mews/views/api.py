from flask import render_template, jsonify, request
from mews import app
from mews.models import *



@app.route("/api/tracks/<int:id>/")
def api_track(id):
	track = Track.query.get(id)
	if track is None:
		abort(404)

	return jsonify(track.asDict())


@app.route("/api/albums/")
def api_albums():
	albums = db.session.query(Album).join(Artist.albums).order_by(Artist.name).all()
	return jsonify([ a.asDict() for a in albums ])


@app.route("/api/album_cache/")
def api_album_cache():
	ret = {}

	albums = db.session.query(Album).join(Artist.albums).all()
	for album in albums:
		ret[(album.artist.name + "/" + album.title).lower()] = album.asDict()

	return jsonify(ret)


@app.route("/api/playlists/")
def api_playlists():
	playlists = Playlist.query.all()
	return jsonify([ p.asDict() for p in playlists ])


@app.route("/api/playlists/new/", methods=["POST"])
def api_playlist_create():
	playlist = Playlist()
	playlist.title = request.form.get("title") or "Untitled Playlist"
	db.session.add(playlist)
	db.session.commit()
	return jsonify(playlist.asDict())


@app.route("/api/playlists/<int:id>/tracks/", methods=["GET", "POST"])
def api_playlist_tracks(id):
	playlist = Playlist.query.get(id)
	if playlist is None:
		abort(404)

	if request.method == "POST":
		to_add = request.get_json()
		if "albums" in to_add:
			for album_id in to_add["albums"]:
				album = Album.query.get(album_id)
				if album is not None:
					playlist.tracks.extend(album.tracks)

	return jsonify([ t.asDict(t.id) for t in playlist.tracks ])