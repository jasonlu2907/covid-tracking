import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryData } from '../models/country-data';
import { GlobalData } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private dataURL: string = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-09-2021.csv';
  private dateURL: string = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.dataURL, {responseType: 'text'})
      .pipe(map(
        res => {
          //Store the data in the globalDetails Obj { *countryname: <globalData>}
          const globalDetails: any = {};

          let rows = res.split('\n');
          // console.log(rows);

          //Remove the first element because it is just the definitions of each col
          rows.splice(0, 1);
          rows.forEach(row => {
            //split khi gặp dấu , except the , with the next element is a blankspace
            let cols = row.split(/,(?=\S)/);
            const eachReport = {
              country: cols[3],
              confirmed: +cols[7], // TRICK: Doi string -> integer: add +
              death: +cols[8],
              recovered: +cols[9],
              active: +cols[10]
            };

            let temp = globalDetails[eachReport.country];
            if(temp) {
              temp.confirmed += eachReport.confirmed;
              temp.death += eachReport.death;
              temp.recovered += eachReport.recovered;
              temp.active += eachReport.active;

              // this line doesn't affect the app
              globalDetails[eachReport.country] = temp;
            } else {
              globalDetails[eachReport.country] = eachReport;
            }
          });

          // console.log(globalDetails);
          //Vietnam: {"country": "Vietnam","confirmed": 1234,...}
          return Object.values(globalDetails); //return as an array with the values 
          //from each key, since we don't care about the key
        }
      ));
  }

  getDateValue(): Observable<any> {
    return this.http.get(this.dateURL, {responseType: 'text'})
      .pipe(map(res => {
        let rows = res.split('\n');
        // console.log(rows);
        let header = rows[0];
        let dates = header.split(/,(?=\S)/); // string cua cac dates
        // console.log(dates);
        dates.splice(0, 4);

        const everyCountriesData: any = {}
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols: string[] = row.split(/,(?=\S)/);
          let con: string = cols[1];
          cols.splice(0, 4); // remove unnecessary properties

          everyCountriesData[con] = [];
          cols.forEach((el, i) => {
            let dataByDate: CountryData = {
              country: con,
              cases: +el,
              date: new Date(Date.parse(dates[i]))
            };
            everyCountriesData[con].push(dataByDate);
          });
          // console.log(con, cols);
        });
        return everyCountriesData;
      }));
  }
}
