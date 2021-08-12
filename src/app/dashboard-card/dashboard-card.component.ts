import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {
  @Input() 
  totalConfirmed: number | undefined;
  @Input() 
  totalDeath: number | undefined;
  @Input() 
  totalRecovered: number = 0;
  @Input() 
  totalActive: number = 0; // It can goes all ways (assertion, defined, or undefine)


  constructor() { }

  ngOnInit(): void {
  }

}
