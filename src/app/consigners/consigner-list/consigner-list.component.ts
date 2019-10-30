import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';
import { BranchPickupModelComponent } from '../../branch//branch-pickup-model/branch-pickup-model.component';

@Component({
  selector: 'app-consigner-list',
  templateUrl: './consigner-list.component.html',
})
export class ConsignerListComponent implements OnInit {

  loading: any;
  data: any;
  source: any = '';
  loading_page = false;
  loading_list = false;
  loader: any = false;
  consigners: any = [];
  locations: any = [];
  total_consigners = 0;

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent, public dialogs: MatDialog) {}
  ngOnInit()
  {
    this.loading_page = true;
    this.getConsignerList();
  }

  last_page: number ;
  current_page = 1;
  search: any = '';
  searchData = true;
  isInvoiceDataExist = false;
  filter:any = {};
  filtering : any = false;
  franchise_id;

  redirect_previous() {
    this.current_page--;
    this.getConsignerList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getConsignerList();
  }

  getConsignerList() 
  {
    this.isInvoiceDataExist = false;
    this.loading_list = false;
          
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    if( this.filter.date )this.filtering = true;

    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'consigners/getConsigner?page=' + this.current_page + '&s=' + this.search + '&source=' + this.source)
      .subscribe(data => {
        console.log(data);
        
        this.data = data;
        this.current_page = this.data.data.consigners.current_page;
        this.last_page = this.data.data.consigners.last_page;
        this.total_consigners = this.data.data.consigners.total;
        this.consigners = this.data.data.consigners.data;
        this.loading_list = true;
      },err => {this.dialog.retry().then((result) => {this.getConsignerList(); console.log(err); });  
      });
  }

  

  orderListReverse(){
    this.consigners=this.consigners.reverse();
  }
 


  deleteLead(l_id) {
    this.dialog.delete('Consigner').then((result) => {
      if(result) {
    this.loading_list = false;

        this.db.post_rqst({l_id: l_id}, 'consigners/remove')
          .subscribe(data => {
            this.loading_list = true;
            this.data = data;
            if (this.data.data.r_lead) { this.getConsignerList(); }
          },err => {  this.dialog.retry().then((result) => { 
            this.deleteLead(l_id);      
            console.log(err); });  
          });
      }
    });
  }

  openDialog(branch_id,id, mode : any = 0 ): void {

    console.log(branch_id);
    const dialogRef = this.dialogs.open(BranchPickupModelComponent, {
      width: '850px',
      data: {
        'franchise_id' :    branch_id,
        'consignee_id' : id,
        'mode' : mode,
      }
    });

    dialogRef.afterClosed().subscribe(r => {
      if(r){
            this.getConsignerList();
      }
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