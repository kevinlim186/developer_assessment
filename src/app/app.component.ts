import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { House } from './interface';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, AfterViewInit {

/**
 *
 * Creates the Mat paginator object that will be tied to the mat table.
 *
 */
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

/**
 *
 * This is the complete list fetched from the API endpoint. This will be used to reset the viewport as
 * the user navigates to the different filter option.
 *
 */
  houses: House[] = [];

/**
 *
 * Creates the viewport table. This will contain the data that will be shown to the user.
 *
 */
  viewPort = new MatTableDataSource<House>();

/**
 *
 * Contains the header list of tthe table.
 *
 */
  displayedColumns =  ['Street', 'Value', 'Rooms'];

/**
 *
 * Contains filter options.
 *
 */
  filter =  ['All', 'Distance from my Sister', 'More than 5 Rooms', 'Missing Information'];

/**
 *
 * The default option is blank, which will show everything.
 *
 */

  selectedValue = '';

  constructor(private http: HttpClient) {}
  
  ngAfterViewInit(): void {
    this.viewPort.paginator = this.paginator;
  }

/**
 *
 * Initializes table by fetching the from the API rest endpoint. The table is created and paginated.
 * The api end point is routed through a proxy because the backend server does not allow cross origin
 * site requests.
 *
 */
  ngOnInit() {
  /** 
    this.http.get<any>('/api/houses').subscribe((data) => {
      this.houses = data.houses;
      this.viewPort = new MatTableDataSource(data.houses);
      this.viewPort.paginator = this.paginator;
    });
    */

    this.houses = JSON.parse(this.source).houses;
    this.viewPort = new MatTableDataSource(this.houses);
  }

/**
 *
 * The filter value is checked. Based on the selected option of the user, the data will be manipulated.
 *
 */
  filterData() {
    let source = this.houses.slice();
    switch (this.selectedValue) {
/**
 *
 * If the filter value is based on distance from sister's house, the coordinates each house is
 * computed. This function assumes that the longtitude and latitude are present in all houses
 * otherwise, as service must be written to get the longitude and latitude. The data is then sorted by
 * distance in ascending order from the house of the sister. The viewport is then updated.
 *
 */
      case 'Distance from my Sister':
        const sisterStreet = 'Eberswalder Straße 55';
        const sisterHouse: House = source.filter(item => item.street === sisterStreet)[0];
        const lat1 = sisterHouse.coords.lat;
        const lon1 = sisterHouse.coords.lon;

        source.sort((a, b) => {
          const alat2 = a.coords.lat;
          const alon2 = a.coords.lon;
          const blat2 = b.coords.lat;
          const blon2 = b.coords.lon;
          const adis = this.getDistance(lat1, alat2, lon1, alon2);
          const bdis = this.getDistance(lat1, blat2, lon1, blon2);
          return adis < bdis ? -1 : adis > bdis ? 1 : 0;
        });
        this.viewPort =  new MatTableDataSource(source);
        this.viewPort.paginator = this.paginator;
        break;
/**
 *
 * If the filter value is based on number of rooms, items with undefined params are removed then it is
 * subsequently filtered by the number indicated in the specification. It is then sorted in ascending
 * order based on number of rooms. The viewport is then updated.
 *
 */
      case 'More than 5 Rooms':
        source = source .filter(item => item.params !== undefined)
                        .filter(item => item.params.rooms > 5)
                        .sort((a, b) => {
                          const x = a.params.rooms;
                          const y = b.params.rooms;
                          return x < y ? -1 : x > y ? 1 : 0;
                        });
        this.viewPort =  new MatTableDataSource(source);
        this.viewPort.paginator = this.paginator;
        break;

/**
 *
 * If the filter value is based on number of rooms, items with undefined will be checked for any
 * undefined attributes. It is then sorted by street name in ascending order. Lastly, the view port is
 * updated
 *
 */
      case 'Missing Information':
        console.log('Missing Information');
        source = source .filter(item => (item.params === undefined ||
                                item.params.value === undefined ||
                                item.params.rooms === undefined ||
                                item.coords === undefined ||
                                item.coords.lat === undefined ||
                                item.coords.lon === undefined))
                        .sort((a, b) => {
                          const x = a.street;
                          const y = b.street;
                          return x < y ? -1 : x > y ? 1 : 0;
                        });
        this.viewPort =  new MatTableDataSource(source);
        this.viewPort.paginator = this.paginator;
        break;

      default:
        this.viewPort =  new MatTableDataSource(source);
        this.viewPort.paginator = this.paginator;
    }
  }


/**
 * Converts degree to radian
 *
 * @param degree - number in Degrees.
 * @returns Radian equvalient.
 *
 */
  degToRad(degree: number) {
    return degree * (Math.PI / 180);
  }

/**
 * Returns the distance in Kilometer given the longtitude and latitude
 *
 * @param lat1 - The latitude of the first location (in degrees).
 * @param lat2 - The latitude of the second location (in degrees).
 * @param long1 - The longtitude of the first location (in degrees).
 * @param long2 - The longtitude of the second location (in degrees).
 * @returns The distance in Kilometer of the first and second location.
 *
 */
  getDistance(lat1: number, lat2: number, long1: number, long2: number) {
    const earthRadius = 6371; // in KM
    const latDiff = this.degToRad(lat1 - lat2);
    const longDiff = this.degToRad(long1 - long2);
    const hav =   Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                  Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
                  Math.sin(longDiff / 2) * Math.sin(longDiff / 2);
    const theta = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
    return theta * earthRadius;
  }

  source = `{   "houses": [     {       "coords": { "lat": 52.5013632, "lon": 13.4174913 },       "params": { "rooms": 5, "value": 1000000 },       "street": "Adalbertstraße 13"     },     {       "coords": { "lat": 52.4888151, "lon": 13.3147011 },       "params": { "value": 1000000 },       "street": "Brandenburgische Straße 10"     },     {       "coords": { "lat": 52.5141632, "lon": 13.3780111 },       "params": { "rooms": 3, "value": 1500000 },       "street": "Cora-Berliner-Straße 22"     },     {       "coords": { "lat": 52.53931, "lon": 13.4206011 },       "params": { "rooms": 12, "value": 5000000 },       "street": "Danziger Straße 66"     },     {       "coords": { "lat": 52.5418739, "lon": 13.4057378 },       "params": { "rooms": 10, "value": 4000000 },       "street": "Eberswalder Straße 55"     },     {       "coords": { "lat": 52.5336332, "lon": 13.4015613 },       "street": "Fehrbelliner Straße 23"     },     {       "coords": { "lat": 52.5269281, "lon": 13.3984283 },       "params": { "rooms": 20, "value": 7000000 },       "street": "Gipsstraße 44"     },     {       "coords": { "lat": 52.4858232, "lon": 13.4215013 },       "params": { "rooms": 18, "value": 2000000 },       "street": "Hermannstraße 1"     },     {       "coords": { "lat": 52.4863064, "lon": 13.3385237 },       "params": { "rooms": 12, "value": 2300000 },       "street": "Innsbrucker Straße 8"     },     {       "coords": { "lat": 52.4896432, "lon": 13.3329913 },       "params": { "rooms": 8, "value": 800000 },       "street": "Jenaer Straße 8"     }   ] }`
}
