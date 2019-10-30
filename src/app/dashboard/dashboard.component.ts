import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../_services/DatabaseService';
import {DialogComponent} from '../dialog/dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SingleDataSet, Label } from 'ng2-charts';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Consumer' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Franchise' }
  ];



    // Pie
    public pieChartOptions: ChartOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      }
    };
    public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
    public pieChartData: SingleDataSet = [300, 500, 100];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    // public pieChartPlugins = [pluginDataLabels];



    public pieChartOptions2: ChartOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      }
    };
    public pieChartLabels2: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
    public pieChartData2: SingleDataSet = [300, 500, 100];
    public pieChartType2: ChartType = 'pie';
    public pieChartLegend2 = true;




  constructor(private route: ActivatedRoute,public db: DatabaseService, public dialog: DialogComponent ) { }

  ngOnInit() {
            this.dashboard_data(); 
  }


  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }










    // // events
    // public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //   console.log(event, active);
    // }
  
    // public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //   console.log(event, active);
    // }
  
    changeLabels() {
      const words = ['hen', 'variable', 'embryo', 'instal', 'pleasant', 'physical', 'bomber', 'army', 'add', 'film',
        'conductor', 'comfortable', 'flourish', 'establish', 'circumstance', 'chimney', 'crack', 'hall', 'energy',
        'treat', 'window', 'shareholder', 'division', 'disk', 'temptation', 'chord', 'left', 'hospital', 'beef',
        'patrol', 'satisfied', 'academy', 'acceptance', 'ivory', 'aquarium', 'building', 'store', 'replace', 'language',
        'redeem', 'honest', 'intention', 'silk', 'opera', 'sleep', 'innocent', 'ignore', 'suite', 'applaud', 'funny'];
      const randomWord = () => words[Math.trunc(Math.random() * words.length)];
      this.pieChartLabels = Array.apply(null, { length: 3 }).map(_ => randomWord());
    }



    charts(){

      this.pieChartLabels = this.dashboard.chart_franhcise_counsumers_arr1;
      this.pieChartData = this.dashboard.chart_franhcise_counsumers_arr2;

      this.pieChartLabels2 = this.dashboard.chart_franhcise_profit_arr1;
      this.pieChartData2 = this.dashboard.chart_franhcise_profit_arr2;




      this.barChartLabels = this.dashboard.label;

      console.log(this.filter.graphType );

      this.barChartData =  [
        
        { data: this.dashboard.counsumer_lead_count, label: ( this.filter.graphType == 'Invoice' ) ? 'Order' : 'Consumer' },
        { data: this.dashboard.franchise_lead_count, label:  ( this.filter.graphType == 'Invoice' ) ? 'Invoice' : 'Franchise'  }
      ];




      // public pieChartData: SingleDataSet = [300, 500, 100];/
    }


  filter:any = {};
  loading_list:any = false;

  dashboard:any = {};
  dashboard_data() {
    this.loading_list = true;

    var dashboard = {'filter': this.filter , 'login':this.db.datauser };
    this.db.post_rqst( {'dashboard':  dashboard}, 'dashboard/dashboard_data' ).subscribe(d => {

      this.loading_list = false;
      this.dashboard = d['data'].bucket;
      console.log(  this.dashboard  );

      this.charts();

   },err => {  this.loading_list = false; this.dialog.retry().then((result) => {  console.log(err); this.dashboard_data(); }); 

    });
    }



}
