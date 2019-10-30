import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-branch-pickup-history-detail',
  templateUrl: './branch-pickup-history-detail.component.html',
})
export class BranchPickupHistoryDetailComponent implements OnInit {

  loading: any;
  orderDetail: any = [];
  orderItemDetail: any = {};
  orderInvoiceList: any = {};
  data: any;

  order_id;
  loading_list = true;

  current_page = 1;
  last_page: number ;

  constructor(public db: DatabaseService,
              private route: ActivatedRoute, 
              public dialog: DialogComponent,
              private router: Router) {   
              }

  ngOnInit() {

      this.route.params.subscribe(params => {
        this.order_id = params['id'] || '';
        if( this.order_id ) {
           
          this.sales_challan();
        }

      });
    }
 
    toInt(i){
      return parseInt(i);
    }
pickup:any = {};
pickup_item:any = [];

sales_challan()
{
  // this.loading_list = false;

  this.db.post_rqst(  {'id':this.order_id}, 'consigners/pickup_history_detail')
    .subscribe( d  => {
      console.log( d );

      // this.loading_list = true;
      this.pickup = d['data'].pickup; 
      this.pickup_item = d.data.pickup_item; 

      console.log(this.pickup);
      console.log(this.pickup_item);


    },err => { this.dialog.retry().then((result) => { this.sales_challan();  });   });
  }

  print()
  {
  setTimeout(function(){ 
  let printContents, popupWin;
  printContents = document.getElementById('print-section').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
  <html>
  <head>
  <title>Print tab</title>
  <style>
  body
  {
    font-family: 'arial';
  }
  .print-section
  {
    width: 1024px;
    background: #fff;
    padding: 15px;
    margin: 0 auto
  }
  .print-section table
  {
    width: 1024px;
    box-sizing: border-box;
    table-layout: fixed;
  }
  .print-section table tr table.table1 tr td h2
  {
      font-size: 4px;
      line-height: 10px;
  }
  .print-section table tr table.table1 tr td p
  {
      font-size: 1px;
      line-height: 10px;
  }
  table .table3 tr td
  {
    background: #ccc;
  }
  .print-section table tr table.table1 tr td:nth-child(1){width: 324px;}
  .print-section table tr table.table1 tr td:nth-child(2){width: 700px;}
  </style>
  </head>
  <body onload="window.print();window.close()">${printContents}</body>
  </html>`
  );
  popupWin.document.close();
      }, 300);
  }
 


}
