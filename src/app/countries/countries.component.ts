import { Component, OnInit } from '@angular/core';
import { GlobalData } from '../models/global-data';
import { TrackingService } from '../services/tracking.service';
import { ChartType } from "angular-google-charts";
import { CountryData } from '../models/country-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

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

  countriesDataByDate$: any = {};
  selectedCountry: CountryData[] = [];

  datatable: [string, number][] = [];
  chart = {
    title:'damy',
    LineChart: ChartType.LineChart,
    data: this.datatable,
    columnNames: ["Dates", "Cases"],
    options: {
      hAxis: {
        title: 'Dates'
      },
      vAxis:{
        title: 'Cases'
      },
      animation:{
        duration: 1000,
        easing: 'out',
      }
    },
    width: 600,
    height: 400
  };

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    merge(
      this.trackingService.getData().pipe(
        map(res => {
          this.data$ = res;
          this.data$.forEach((el: GlobalData) => {
            if(el !== undefined) {
              this.countries.push(el.country);
            }
          })
        })
      ),
      this.trackingService.getDateValue().pipe(
        map(res => {
          this.countriesDataByDate$ = res;
        })
      )
    ).subscribe(
      {
        complete: () => {
          this.onSelectChange('Afghanistan');

        }
      }
    )

    /* Nếu như chia Observable 2 đợt như này thì sẽ gặp bất lợi,
    ta biết onSelectChange sẽ gọi hàm updateChart vậy tsao khi catch
    getDataValue ta phải gọi thêm updateChart 1l nữa? Giả sử ta ko gọi updateChart
    nữa mà chỉ gán biến selectedCountry thì bug vẫn sẽ có, vì 2 luồn Obsevable
    này khác nhau, dataByDate sẽ tới sau nên khi t gọi onSelectChange
    , Observable countriesDataByDate$ vẫn chưa có => selectedCountry = undefine
    => updateChart f chạy 2l trong khi lần đầu tiên countriesDataByDate
    vẫn chưa được trả về => giải quyết = merge Observable và subscribe sau
    khi cả 2 Obsevables complete và chỉ gọi onSelectChange đúng 1l*/
    /*this.trackingService.getData()
      .subscribe(res => {
        this.data$ = res;
        // console.log(this.data$);
        this.data$.forEach((el: GlobalData) => {
          if(el !== undefined) {
            this.countries.push(el.country);
          }
        })
        this.onSelectChange('Afghanistan');
      })*/

    /*this.trackingService.getDateValue()
      .subscribe(res => {
        this.countriesDataByDate$ = res;
        this.selectedCountry = this.countriesDataByDate$['Afghanistan'];
        console.log(this.countriesDataByDate$);
        this.updateChart();
      })
    */

    
  }

  onSelectChange($event: string):void {
    // console.log(this.selectedCountry);


    this.data$.forEach((el:GlobalData, i:number) => {
      if(el.country === $event) {
        this.totalActive$ = el.active;
        this.totalConfirmed$ = el.confirmed;
        this.totalDeath$ = el.death;
        this.totalRecovered$ = el.recovered;
      }
    });
    
    this.selectedCountry = this.countriesDataByDate$[$event];
    this.updateChart();
  }
  
  updateChart() {
    this.datatable = [];
    console.log(this.selectedCountry);
    this.selectedCountry.forEach((el: CountryData) => {
      // console.log(el.date, el.cases);
      this.datatable.push([el.date.toString(), el.cases]);
    });

    // Datatable works but google charts doesn't unless we re-define this.chart
    // console.log(this.datatable);

    this.chart = {
      title:'damy',
      LineChart: ChartType.LineChart,
      data: this.datatable,
      columnNames: ["Dates", "Cases"],
      options: {
        hAxis: {
          title: 'Dates'
        },
        vAxis:{
          title: 'Cases'
        },
        animation:{
          duration: 1000,
          easing: 'out',
        }
      },
      width: 500,
      height: 400
    }
  }

}
