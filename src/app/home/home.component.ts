import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../services/tracking.service';
import { GlobalData } from '../models/global-data';
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
      });
  }

  

}
