import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../services/tracking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any;
  totalConfirmed: number = 0;
  totalDeath: number = 0;
  totalRecovered: number = 0;
  totalActive: number = 0;

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.trackingService.getData().subscribe(res => {
      console.log(res);
    });
  }

  

}
