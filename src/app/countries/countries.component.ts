import { Component, OnInit } from '@angular/core';
import { GlobalData } from '../models/global-data';
import { TrackingService } from '../services/tracking.service';

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
    this.data$.forEach((el:GlobalData, i:number) => {
      if(el.country === $event) {
        this.totalActive$ = el.active;
        this.totalConfirmed$ = el.confirmed;
        this.totalDeath$ = el.death;
        this.totalRecovered$ = el.recovered;
      }
    })
  }

}
