import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-consigner-aggrement-challan-detail',
  templateUrl: './consigner-aggrement-challan-detail.component.html',
})
export class ConsignerAggrementChallanDetailComponent implements OnInit {

  order_id;
  loading_list = true;

  constructor(public db: DatabaseService,private route: ActivatedRoute,public dialog: DialogComponent,private router: Router) {}

  ngOnInit() {
      this.route.params.subscribe(params => {
        this.order_id = params['id'] || '';
        if( this.order_id ) {
          this.challan_list();
        }
      });
  }


  
  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(event.keyCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  greater_qty : any = 0;
  val_accept(i:any)
  {
    this.greater_qty = 0;
    if( this.sub_child[i].qty >= this.sub_child[i].accept_qty){
      this.sub_child[i].accept_qty = this.sub_child[i].accept_qty;
    }else{      
      this.sub_child[i].accept_qty = this.sub_child[i].qty;
      this.greater_qty++;
      this.dialog.warning('Greater Qty!');

    }
  }



  challanReceive()
  {
    if(this.greater_qty){
      this.dialog.warning('You have enter greater Qty as compare challan qty!');
      return;
    }
    this.loading_list = false;


   this.db.insert_rqst( {'items': this.sub_child , 'created_by' : this.db.datauser.id , 'remark': this.parent.remark},'sales/challanReceive')
    .subscribe( r => {
      this.loading_list = true;
      this.dialog.success('Challan Stock Received Successfully!');
      this.challan_list();
    },err=>{ this.loading_list = true; this.dialog.retry().then((result) => {  }); });
    
  }



parent:any = {};
child:any = {};
sub_child:any = [];

  challan_list()
  {
    this.loading_list = false;
    this.db.post_rqst(  {'id':this.order_id}, 'sales/sale_challan_detail')
      .subscribe( d  => {
        console.log( d );
        this.loading_list = true;

        this.parent = d.data.parent; 
        this.child = d.data.child; 
        this.sub_child = d.data.sub_child; 

        console.log(  this.parent );
        console.log(  this.child );
        console.log(  this.sub_child );

      },err => { this.dialog.retry().then((result) => { this.challan_list(); });   });
    }

 bill:any ={};
 conr_detail:any ={};
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
