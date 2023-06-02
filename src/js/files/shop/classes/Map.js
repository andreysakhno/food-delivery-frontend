import { Loader } from 'google-maps';

export class Map {
	#google;
	#map;
	#mainMarker;
	#autocomplete;
	#input;
	#mapCnt;
	#markers;
	
	static get _CONFIGURATION() {
		return {
			ctaTitle: "Checkout",
			mapOptions: {
				center: { lat: 50.44813845420719, lng: 30.523545411355187 },
				fullscreenControl: true,
				mapTypeControl: false,
				streetViewControl: true,
				zoom: 11,
				zoomControl: true,
				maxZoom: 22,
				mapId: "",
			},
			mapsApiKey: "AIzaSyBgqOn618wGMaPpY2uZC3ODrMuUQ2he9R8",
			capabilities: {
				addressAutocompleteControl: true,
				mapDisplayControl: true,
				ctaControl: false,
			},
		};
	};	

	constructor(google, map, mainMarker, autocomplete, mapCnt, input) {
		this.#google = google;
		this.#map = map;
		this.#mainMarker = mainMarker;
		this.#autocomplete = autocomplete;		
		this.#mapCnt = mapCnt;
		this.#input = input;
		this.#markers = [];
		
		this._handlers();
	}

	static async initialize(mapContainer, autocompleteInput) {
		const options = { libraries: ["places"] };
		const loader = new Loader(Map._CONFIGURATION.mapsApiKey, options);

		const google = await loader.load();

		const map = new google.maps.Map(mapContainer, {
				zoom: Map._CONFIGURATION.mapOptions.zoom,
				center: { lat: Map._CONFIGURATION.mapOptions.center.lat, lng: Map._CONFIGURATION.mapOptions.center.lng },
				mapTypeControl: false,
				fullscreenControl: Map._CONFIGURATION.mapOptions.fullscreenControl,
				zoomControl: Map._CONFIGURATION.mapOptions.zoomControl,
				streetViewControl: Map._CONFIGURATION.mapOptions.streetViewControl
		});
		
		const marker = new google.maps.Marker({ map: map, draggable: false });

		const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {});

		return new Map(google, map, marker, autocomplete, mapContainer, autocompleteInput);
	}

	addMarkers(elements) {			
		elements.forEach((element, index) => {
			let [Lat, Lng] = element.shopCoords.split(";");
			const marker = new this.#google.maps.Marker({
				map: this.#map,
				position: { lat: +Lat, lng: +Lng },
				title: element.shopTitle,
				label: `${index + 1}`,
			});
			marker.setVisible(true);
			this.#markers.push(marker);
		});	
	} 

	removeMarkers() {
		this.#markers.forEach((item) => {
			item.setMap(null);
		});
	}

	_handlers() {		
		this.#autocomplete.addListener("place_changed", () => {
			this.#mainMarker.setVisible(false);
			const place = this.#autocomplete.getPlace();
			if (!place.geometry) {
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}
			this._pinMarker(place.geometry.location);
		});

		const geocoder = new this.#google.maps.Geocoder();	
		this.#google.maps.event.addListener(this.#map, 'click', (event) => {
			this.#mainMarker.setVisible(false);
			const location = event.latLng;
			geocoder.geocode({
				'latLng': location
			}, (results, status) => {
				if (status == this.#google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						this._pinMarker(location);							
						this.#input.value = results[0].formatted_address;;
					}
				}
			});
		});
	}	

	_pinMarker(location) {
		this.#map.setCenter(location);
		this.#mainMarker.setPosition(location);
		this.#mainMarker.setVisible(true);
	}

}


