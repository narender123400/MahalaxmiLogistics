import { Component,  OnInit, ViewChild } from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogComponent} from '../../dialog/dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-sale-invoice-list',
  templateUrl: './sale-invoice-list.component.html',
})
export class SaleInvoiceListComponent implements OnInit {

  today:any = moment().format("YYYY-MM-DD");

    loading: any;
    salesinvoiceList: any = [];
    data: any;
    
    search: any = '';
    totalorder;
    pendingorder;
    //statuss;
    approved_order:any = '';
    searchData = true;
    loading_list = true;
    current_page = 1;
    last_page: number;
    filter:any = {};
  
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(public db: DatabaseService, public dialog: DialogComponent ) { }

    ngOnInit() {
        this.salesOrderList();
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

    salesOrderList() {
      this.loading_list = false;
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      if( this.filter.date   )this.filtering = true;
    
      this.db.post_rqst( {'filter' : this.filter } , 'sales/sales_challan_list?page=' + this.current_page )
        .subscribe(d => {     
          this.loading_list = true;
            this.current_page = d.salesOrderList.current_page;
            this.last_page = d.salesOrderList.last_page;
            this.salesinvoiceList = d.salesOrderList.data; 
            this.totalorder = d.salesOrderList.total;

        },err => {  
          this.loading_list = true;
          this.dialog.retry().then((result) => { this.salesOrderList(); });   });
    }




    
    cancelInvoice(id){
            
          this.dialog.delete('Challan Parts !').then((result) => {
            console.log(result);
            if(!result)return;
      
      
              this.db.post_rqst( { 'id':id } , 'sales/cancelInvoice')
              .subscribe( r => {
        
                this.salesOrderList();
                this.dialog.success( 'Invoice Cancel Successfully!');
        
              });
            });
    }

  
}


export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [];