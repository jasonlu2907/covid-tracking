import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../services/tracking.service';
import { GlobalData } from '../models/global-data';
import { ChartType } from "angular-google-charts";

//Google-charts

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data$: GlobalData[] = [];
  totalConfirmed$: number = 0;
  totalDeath$: number = 0;
  totalRecovered$: number = 0;
  totalActive$: number = 0;
  datatable: [string, number][] = []; //[country, cases][]

  chart = {
    PieChart: ChartType.PieChart,
    LineChart: ChartType.LineChart,
    columnNames: ['Country', 'Cases'],
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  };

  //testing data for data property in google-charts
  /*data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7] 
  ];*/

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.trackingService.getData()
      .subscribe(result => {
        this.data$ = result;
        // console.log(this.data$[0]);

        result.forEach((country: GlobalData)  => {
          if(!Number.isNaN(country.active)) {
            this.totalActive$ += country.active;
            this.totalConfirmed$ += country.confirmed;
            this.totalDeath$ += country.death;
            this.totalRecovered$ += country.recovered;
          }
        });

        this.initChart('c');

      }, 
      (err: any) => {
        console.log(err);
      });
      
    }
    
  initChart(caseType: string) {
    // this.datatable.push(['Country', 'Cases']);
    this.data$.forEach((el: GlobalData) => {
      let value: number = 0;

      if(caseType == 'c') {
        if(el.confirmed > 2000) {
          value = el.confirmed;
        }
      }
      if(caseType == 'a') {
        if(el.active > 2000) {
          value = el.active;
        }
      }
      if(caseType == 'd') {
        if(el.death > 2000) {
          value = el.death;
        }
      }
      if(caseType == 'r') {
        if(el.recovered > 2000) {
          value = el.recovered;
        }
      }
      this.datatable.push([el.country, value]);
    });
  }

  updateChart(caseType: string) {
    // console.log(caseType);
    this.datatable = [];
    this.initChart(caseType);
  }
}
