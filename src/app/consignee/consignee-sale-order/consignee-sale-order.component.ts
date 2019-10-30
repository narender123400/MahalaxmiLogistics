import { Component,  OnInit, ViewChild } from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogComponent} from '../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-consignee-sale-order',
  templateUrl: './consignee-sale-order.component.html',
})
export class ConsigneeSaleOrderComponent implements OnInit {

  loading: any;
    isOrderDataExist = false;
    orderList: any = [];
    data: any;
    
    search: any = '';
    totalorder;
    pendingorder;
    //statuss;
    approved_order:any = '';
    searchData = true;
    loading_list = false;
    current_page = 1;
    last_page: number;
    filter:any = {};
    franchise_id
  
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(public db: DatabaseService, public dialog: DialogComponent ,private route: ActivatedRoute,) { }

    ngOnInit() {

      this.route.params.subscribe(params => {
        this.franchise_id = params['franchise_id'];
        
        if (this.franchise_id) {
           this.salesOrderList(); 
          }
        });
      }
        
    
      redirect_previous() {
        this.current_page--;
        this.salesOrderList();
      }
      redirect_next() {
        if (this.current_page < this.last_page) { this.current_page++; }
        else { this.current_page = 1; }
        this.salesOrderList();
      }

     
    filtering : any = false;

    salesOrderList(status:any = '') {
        //alert(this.statuss);
      this.isOrderDataExist = false;

      this.loading_list = true;

      this.filter.status = status;
      
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
  
      
      if( this.filter.date  || this.filter.status ||  this.filter.search )this.filtering = true;

    
      this.db.post_rqst(  {'filter':this.filter,'consignee_id':this.franchise_id }, 'sales/orderList?page=' + this.current_page )
      //this.db.post_rqst( '', 'sales/orderList')
        .subscribe(data => {     
          this.isOrderDataExist = true;
          this.loading_list = false;
                 
            this.data = data;
            console.log(this.data);
            this.current_page = this.data.data.salesOrderList.current_page;
            this.last_page = this.data.data.salesOrderList.last_page;
            this.orderList = this.data.data.salesOrderList.data;
            this.totalorder = this.data.data.totalorder;
            this.pendingorder = this.data.data.pendingorder;
            this.approved_order = this.data.data.approved_order;
            console.log(this.orderList);
            // if (this.search && this.orderList.length < 1) { this.searchData = false; }
            // if (this.search && this.orderList.length > 0) { this.searchData = true; }

        },err => {    this.loading_list = false; this.dialog.retry().then((result) => { this.salesOrderList(status); });   });
    }
    // this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    
  
}


export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [];