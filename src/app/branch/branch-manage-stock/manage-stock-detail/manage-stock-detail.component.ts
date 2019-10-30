import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../_services/DatabaseService';
import {DialogComponent} from '../../../dialog/dialog.component';


@Component({
  selector: 'app-manage-stock-detail',
  templateUrl: './manage-stock-detail.component.html',
})
export class ManageStockDetailComponent implements OnInit {


  loading: any;
  manage: any = {};
  manage_item: any = [];
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
          this.salesOrderDetail(); 
        }

      });
  }




  

  salesOrderDetail() {
console.log(this.order_id);
    this.loading_list = false;

    this.db.post_rqst(  {'id': this.order_id}, 'branches/manage_stock_detail')
      .subscribe( d  => {
        console.log( d );
        
        this.loading_list = true;

        this.manage = d.data.manage; 
        this.manage_item = d.data.manage_item; 

        console.log(  this.manage);
        console.log( this.manage_item);

      },err => {  this.dialog.retry().then((result) => { this.salesOrderDetail(); });   });
}





}
