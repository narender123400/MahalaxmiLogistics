import { Component,  OnInit, ViewChild } from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DialogComponent} from '../../dialog/dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-challan-list',
  templateUrl: './challan-list.component.html',
})
export class ChallanListComponent implements OnInit {

  today:any = moment().format("YYYY-MM-DD");

    loading: any;
    salesChallanList: any = [];
    search: any = '';
    totalorder;
    searchData = true;
    loading_list = true;
    current_page = 1;
    last_page: number;
    filter:any = {};
    filtering : any = false;
  
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

    salesOrderList() {
      this.loading_list = false;
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      if( this.filter.date  ||  this.filter.search )this.filtering = true;
    
      this.db.post_rqst( {'filter' : this.filter } , 'sales/challan_list?page=' + this.current_page )
        .subscribe(d => {     
          this.loading_list = true;
            this.current_page = d.salesChallanList.current_page;
            this.last_page = d.salesChallanList.last_page;
            this.salesChallanList = d.salesChallanList.data; 
            this.totalorder = d.salesChallanList.total;

        },err => {  
          this.loading_list = true;
          this.dialog.retry().then((result) => { this.salesOrderList(); });   });
    }
 
    

    cancelChallan(id){
         
            this.dialog.delete('Challan Parts !').then((result) => {
              console.log(result);
              if(!result)return;
        
        
                this.db.post_rqst( { 'id':id } , 'sales/cancelChallan')
                .subscribe( r => {
          
                  this.salesOrderList();
                  this.dialog.success( 'Challan Cancel Successfully!');
          
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