import { Loader } from 'google-maps';
import { FlashMessage } from "./FlashMessage.js";

export class GoogleMap {
	#google;
	#map;
	#mainMarker;
	#autocomplete;
	#input;
	#directionsService;
	#directionsRenderer;
	#mapCnt;

	#markers;
	
	static get _CONFIGURATION () {
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
			mapsApiKey: "AIzaSyAOh0pu75uFzUHxNfikPcy4xwlnb5QTlTw",
			capabilities: {
				addressAutocompleteControl: true,
				mapDisplayControl: true,
				ctaControl: false,
			},
		};
	};
	
	static get _mapOptions() {
		return {
				zoom: GoogleMap._CONFIGURATION.mapOptions.zoom,
				center: { 
					lat: GoogleMap._CONFIGURATION.mapOptions.center.lat, 
					lng: GoogleMap._CONFIGURATION.mapOptions.center.lng
				},
				mapTypeControl: false,
				fullscreenControl: GoogleMap._CONFIGURATION.mapOptions.fullscreenControl,
				zoomControl: GoogleMap._CONFIGURATION.mapOptions.zoomControl,
				streetViewControl: GoogleMap._CONFIGURATION.mapOptions.streetViewControl
		}
	}

	constructor(
		google,
		map,
		mainMarker,
		autocomplete,
		directionsService,
		directionsRenderer,
		mapCnt,
		input)
	{
		this.#google = google;
		this.#map = map;
		this.#mainMarker = mainMarker;
		this.#autocomplete = autocomplete;
		this.#directionsService = directionsService;
		this.#directionsRenderer = directionsRenderer;
		this.#mapCnt = mapCnt;
		this.#input = input;
		this.#markers = [];

		this.hasRoute = false; 
		
		this._addHandlers();
	}

	static async initialize(mapContainer, autocompleteInput) {
		const loaderOptions = { libraries: ["places"] };
		const loader = new Loader(GoogleMap._CONFIGURATION.mapsApiKey, loaderOptions);

		const google = await loader.load();
		// Ініціалізуємо карту
		const map = new google.maps.Map(mapContainer, GoogleMap._mapOptions);
		// Ініціалізуємо маркер, адреси клієнта
		const marker = new google.maps.Marker({ map: map, draggable: false });
		// Автозаполнення адресии для input adress 
		const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {});

		const directionsService = new google.maps.DirectionsService;

		const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

		return new GoogleMap(
			google,
			map,
			marker,
			autocomplete,
			directionsService,
			directionsRenderer,
			mapContainer,
			autocompleteInput
		);
	}	

	async calculateAndDisplayRoute() {
		
		if (this.#markers.length === 0) {			
			this._clearMap();
			return;
		}
		
		// Шукаємо індекс маркера в массиві markers найбільш віддаленого від головного маркера		
		const maxDistanceIndex = await this._getDistances().then((distances) => {	
			if (!Array.isArray(distances) || distances.length === 0) return -1;	
			const maxDistance = Math.max(...distances);
			return  distances.indexOf(maxDistance);		
		});

		console.log(maxDistanceIndex);
		
		if (maxDistanceIndex === -1) {
			FlashMessage.warning("Неможливо прокласти маршрут! Ви занадто далеко знаходитесь!");
			return;
		}

		// Заповнюємо масив way points. Кординати всіх маркерів, крім найвіддаленішого. Від найвіддаленішого ми почнемо шлях
		const waypts = [];
		this.#markers.forEach((marker, index) => { 
			if (index !== maxDistanceIndex) {
				waypts.push({
					location: marker.position,
					stopover: true,
				});
			}        
		});
		
		// Скриваємо головний маркер 
		this._hideMainMarker();

		// Видаляємо маркери з карти. directionsRenderer.setDirections далі знову їх додасть
		this._hideMarkers();
		
		// Малюємо шлях на мапі від найвіддаленішого маркеру до головного
		this.#directionsService.route(
			{
				origin: this.#markers[maxDistanceIndex].position,
				destination: this.#mainMarker.position,
				waypoints: waypts,
      	   optimizeWaypoints: true,
				avoidTolls: true,
				avoidHighways: false,				
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(response, status) => {
				if (status == google.maps.DirectionsStatus.OK) {
					this.#directionsRenderer.setDirections(response);	

					this.hasRoute = true; 

					let distance = 0;
					let duration = 0;
					response.routes[0].legs.forEach((leg) => {
						distance += leg.distance.value;
						duration += leg.duration.value;
					});
					this._renderRouteInfo(distance, duration);
				} else {
					FlashMessage.warning("Directions request failed due to " + status);
				}
			}			
		);		
		
	}

	async _getDistances() {	
		const requests =  this.#markers.map((marker) => {
			return new Promise((resolve, reject) => {
				this.#directionsService.route(
					{
						origin: this.#mainMarker.position,
						destination: marker.position,
						avoidTolls: false,
						avoidHighways: false,
						travelMode: google.maps.TravelMode.DRIVING,
					},
					(response, status) => {
						if (status === google.maps.DirectionsStatus.OK) {							
							resolve(response);
						} else {
							reject(status);
						}
					}
				);
			});
		});

		try {			
			const responses = await Promise.all(requests);			
			return responses.map((response) => {
				return response.routes[0].legs[0].distance.value;
			});
		} catch (error) {
			console.log(error);
		}
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
		this._hideMarkers();
		this.#markers = [];
	}

	hasMainMarker() {
		return this.#mainMarker.hasOwnProperty('position');
	}

	clearMap() {
		this.#directionsRenderer.setMap(null);
		this.#directionsRenderer = null;		
		this._renderRouteInfo(0, 0);
	}

	_addHandlers() {	
		// Подія на заповнення адресси в Input
		this.#autocomplete.addListener("place_changed", () => {
			this.#mainMarker.setVisible(false);
			const place = this.#autocomplete.getPlace();
			if (!place.geometry) {
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}
			this._pinMainMarker(place.geometry.location);
			if (this.#markers.length > 0) this.calculateAndDisplayRoute();
		});

		const geocoder = new this.#google.maps.Geocoder();	
		// Подія на клік на карті
		this.#google.maps.event.addListener(this.#map, 'click', (event) => {
			this.#mainMarker.setVisible(false);
			const location = event.latLng;
			geocoder.geocode({
				'latLng': location
			}, (results, status) => {
				if (status == this.#google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						this._pinMainMarker(location);							
						this.#input.value = results[0].formatted_address;
						if (this.#markers.length > 0) this.calculateAndDisplayRoute();
					}
				}
			});
		});
	}	

	_pinMainMarker(location) {
		this.#map.setCenter(location);
		this.#mainMarker.setPosition(location);
		this.#mainMarker.setVisible(true);
	}

	_hideMainMarker() {		
		this.#mainMarker.setVisible(false);
	}

	_hideMarkers() {
		this.#markers.forEach((item) => {
			item.setMap(null);
		});
	}

	_renderRouteInfo(distance, duration) {
		const distanceElement = document.querySelector(".route-info__distance-value");
		const durationElement = document.querySelector(".route-info__duration-value");

		distanceElement.textContent = `${Math.floor(distance / 1000)} км`;
		durationElement.textContent = `${Math.floor(duration / 60)} хв`;
	}
}


