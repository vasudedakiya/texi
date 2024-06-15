import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locationIqKey } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class LocationIqService {

  private autoCompleteUrl: string = 'https://us1.locationiq.com/v1/autocomplete?q=';
  private revGeoUrl: string = 'https://us1.locationiq.com/v1/reverse?';
  private directionUrl: string = 'https://us1.locationiq.com/v1/directions/driving/';
  private secrateKey: string = '&key=' + locationIqKey;
  // lat=23.03840405&lon=72.52889497&key=pk.0335047998a1719169a05e9551040793

  constructor(private _httpClient: HttpClient) { }

  autoComplete(words: string) {
    return this._httpClient.get<any>(this.autoCompleteUrl + encodeURIComponent(words) + this.secrateKey);
  }

  reverseGeocoding(lat: number, lon: number) {
    return this._httpClient.get<any>(this.revGeoUrl + 'lat=' + lat + '&lon=' + lon + '&format=json' + this.secrateKey);
  }

  direction(fromLat: number, fromLon: number, toLat: number, toLon: number) {
    return this._httpClient.get<any>(this.directionUrl + encodeURIComponent(fromLat + ',' + fromLon + ';' + toLat + ',' + toLon) + '?key=' + locationIqKey);
  }

}
