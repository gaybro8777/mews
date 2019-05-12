tracks = {}

class Track extends Model {
	constructor(id) {
		super(id)
		this.title = "";
		this.artist = 0;
	}

	toString() {
		return this.title || "?"
	}

	async getInfo() {
		this.fromDict(await api.getTrack(this.id))
	}

	fromDict(dict) {
		this.title    = dict.title
		this.artist   = dict.artist
		this.picture  = dict.picture
		this.is_known = true
		this.change()
	}

	getURL() {
		return "/tracks/" + this.id + "/";
	}

	static get(id) {
		var track = tracks[id]
		if (!track) {
			track = new Track(id)
			tracks[id] = track
			track.getInfo()
		}

		return track
	}
}