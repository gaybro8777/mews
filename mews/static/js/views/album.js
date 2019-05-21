import { rjs, ViewModel } from "../rjs.js"
import { TracksView } from "./tracks.js"
import { api } from "../api.js"
import { Album } from "../models/album.js"
import { player } from "../main.js"

export class AlbumTracksView extends ViewModel {
	constructor(element) {
		super(element)

		this.tracks_view = new TracksView(this.element.querySelector("section"), "column is-half")
	}

	onChange(album) {
		if (!album) {
			this.element.classList.remove("is-active")
			return
		}

		this.element.classList.add("is-active")
		this.element.querySelector(".modal-card-title").textContent = album.title + " by " + album.artist
		this.element.querySelector("section").innerHTML = ""
	}

	setTarget(target) {
		super.setTarget(target)

		if (this.tracks_view) {
			this.tracks_view.setTarget(target)
		}

	}
}

let alview = null

rjs.onLoad(() => {
	alview = new AlbumTracksView(document.getElementById("albummodal"))
})

export function appendAlbum(album) {
	let element = document.createElement("div")
	let picture = album.picture || "/dummy/?title=" + encodeURI(album.title)
	element.innerHTML = `
		<div class="image is-1by1"><img src="${picture}"></div>
		<div class="actions">
			<a class="action-play"><span class="fa fa-play"></span></a>
			<a class="action-add"><span class="fa fa-plus"></span></a>
		</div>
		<h3 class="title is-5 is-marginless">${album.title}</h3>
		<a class="subtitle is-6">${album.artist}</a>`;
	element.setAttribute("class", "column is-one-fifth album")
	element.setAttribute("data-id", album.id)
	document.querySelector("#albums").appendChild(element)
	element.querySelector(".action-play").addEventListener("click", function(event) {
		player.playAlbum(album.id)
		event.stopPropagation()
	})
	element.querySelector(".action-add").addEventListener("click", function(event) {
		player.addAlbum(album.id)
		event.stopPropagation()
	})
	element.addEventListener("click", function(event) {
		alview.setTarget(album)
		if (!album.isKnown()) {
			album.syncTracks()
		}
		event.stopPropagation()
	})
}

export async function showAlbums() {
	let albums = await api.getAlbums()
	for (let dict of albums) {
		var album = Album.get(dict.id)
		album.fromDict(dict)
		appendAlbum(album)
	}
}
