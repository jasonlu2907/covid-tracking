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
  private dataURL: string = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private extension: string = `.csv`;
  private now: {date: string, month: string, year: string} = {date: '0', month: '0', year: '1900'};
  private dateURL: string = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  
  constructor(private http: HttpClient) {
    const currentTime = new Date();
    this.now.date = currentTime.getDate() < 10 ? `0${currentTime.getDate()}`: `${currentTime.getDate()}`;
    this.now.month = currentTime.getMonth()+1 < 10 ? `0${currentTime.getMonth()+1}`: `${currentTime.getMonth()+1}`;
    this.now.year = `${currentTime.getFullYear()}`;

    this.dateCalculate(this.now);
    this.dataURL = `${this.dataURL}${this.now.month}-${this.now.date}-${this.now.year}${this.extension}`;
  }

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

  dateCalculate(date: {date: string, month: string, year: string}) {
    if(parseInt(date.date) === 1) {
      if(parseInt(date.month) === 1) {
        date.year = `${parseInt(date.year) - 1}`;
      }
      date.month = `${parseInt(date.month) - 1}`;
    } else {
      date.date = `${parseInt(date.date) - 1}`;
    }
  }
}
