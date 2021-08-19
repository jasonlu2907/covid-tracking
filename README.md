# TrackingCovidApp
Data gets from > *https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data* in csv format (view raw file).

This project was designed to track COVID-19 cases globally using these technologies and tools: 

<img align="left" alt="Visual Studio Code" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png" />
<img align="left" alt="JavaScript" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png" />
<img align="left" alt="HTML5" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" />
<img align="left" alt="CSS3" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" />
<img align="left" alt="Sass" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/sass/sass.png" />
<img align="left" alt="JavaScript" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" />
- Google Charts
- Bootswatch

# Steps
1. Initialize angular project `ng new *your_project_name* --style=scss --routing=true`
2. Create components, I only used 4 which are *home, countries, navbar, and dashboard-card*
3. Access **app-routing.module.ts** and set the routing for `'' and '/countries'` 
4. `npm i bootswatch` to install bootswatch module. Here I used *sketchy* theme so this is how I included it in my app at **styles.scss**
```c
@import "../node_modules/bootswatch/dist/sketchy/variables"; 
@import "../node_modules/bootstrap/scss/bootstrap.scss"; 
@import "../node_modules/bootswatch/dist/sketchy/bootswatch";
```
5. Design your own **navbar-comp**
6. Create a service to catch the data `ng g s services/*your_service_name*`
7. getData method from the service will return an Array, which stores **country_name,confirmed,death,recovered,active cases** at each element
8. Use that data from getData and pass to **dashboard-card-comp** as properties using `@Input`
9. getDate method from the sevice will return an Object, where each key is a country and the value of each country is an Array that stores dataByDate
10. Whenever you select a country from the text box, the appropriate data will be passed and displayed in a table & a chart. The most important thing is to **Handle the Observable stream** by merging 2 seperate streams and only subscribe when both of them are finished.
11. ```c
      <google-chart
        [type]="chart.PieChart"
        [data]="datatable"
        [columns]="chart.columnNames"
        [options]="chart.options"
        [height]="chart.height"
        style="width: 100%;">
      </google-chart>
    ```
  The tricky part is when the user try to change the country/ filter the result, the data from datatable property **need** to be updated in the appropriate method. I spent most of the time struggling with it.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
