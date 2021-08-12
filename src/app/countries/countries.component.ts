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

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.trackingService.getData()
      .subscribe(res => {
        this.data$ = res;
        this.data$.forEach(country => {
          if(country.country !== undefined) {
            this.countries.push(country.country);
          }
        });
      });
  }

}
