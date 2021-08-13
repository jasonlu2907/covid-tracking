import { Component, OnInit } from '@angular/core';
import { GlobalData } from '../models/global-data';
import { TrackingService } from '../services/tracking.service';
import { ChartType } from "angular-google-charts";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  data$: GlobalData[] = [];
  countries: string[] = [];
  totalConfirmed$: number = 0;
  totalDeath$: number = 0;
  totalRecovered$: number = 0;
  totalActive$: number = 0;

  datatable: [string, number][] = [];
  chart = {
    PieChart: ChartType.PieChart,
    columnNames: ['Type', 'Cases'],
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  }

  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7] 
  ]

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.trackingService.getData()
      .subscribe(res => {
        console.log(res);
        this.data$ = res;
        this.data$.forEach(country => {
          if(country.country !== undefined) {
            this.countries.push(country.country);
          }
        });
      });
  }

  onSelectChange($event: string):void {
    console.log($event);
    this.datatable = [];
    
    this.data$.forEach((el:GlobalData, i:number) => {
      if(el.country === $event) {
        this.totalActive$ = el.active;
        this.totalConfirmed$ = el.confirmed;
        this.totalDeath$ = el.death;
        this.totalRecovered$ = el.recovered;

        this.datatable.push(['Confirmed', el.confirmed]);
        this.datatable.push(['Death', el.death]);
        this.datatable.push(['Recovered', el.recovered]);
        this.datatable.push(['Active', el.active]);
        // console.log(this.datatable);
      }
    });
  }

  initChart() {

  }
}
