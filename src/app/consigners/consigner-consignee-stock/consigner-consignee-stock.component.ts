import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ConsignerConsigneeStockModelComponent } from '../consigner-consignee-stock-model/consigner-consignee-stock-model.component';

@Component({
  selector: 'app-consigner-consignee-stock',
  templateUrl: './consigner-consignee-stock.component.html',
})
export class ConsignerConsigneeStockComponent implements OnInit {

  franchise_id;
  loading_list = false;

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent, public dialogs: MatDialog) {}

  ngOnInit() {

    this.route.params.subscribe(params => {
    this.franchise_id = params['franchise_id'];
    
    if (this.franchise_id) {
       this.getConsumers(); 
      }
    });
  }

  current_page = 1;
  last_page: number ;
  total_leads = 0;
  filter:any = {};
  filtering:any = false;

  redirect_previous() {
  this.current_page--;
  this.getConsumers();
}
redirect_next() {
  if (this.current_page < this.last_page) { this.current_page++; }
  else { this.current_page = 1; }
  this.getConsumers();
}

  consumers:any = [];
  tmp:any;
  total_consignee = 0;
  getConsumers() {
    
    this.loading_list = true;
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    if(  this.filter.date  || this.filter.search )this.filtering = true;

    this.db.post_rqst(  {'filter':this.filter , 'l_id':this.franchise_id}, 'consigners/consigner_consignee_stock?page='+this.current_page)
    .subscribe(d => {
      console.log(d);
      this.loading_list = false;
      this.current_page = d.consumers.current_page;
      this.last_page = d.consumers.last_page;
      this.total_consignee = d.consumers.total;
      this.consumers = d.consumers.data;


     console.log(  this.consumers );
    },err => {  this.loading_list = false; this.dialog.retry().then((result) => { this.getConsumers(); });   });
  }

  openDialog(consigner_id, mode): void {
    const dialogRef = this.dialogs.open(ConsignerConsigneeStockModelComponent, {
      width: '850px',
      data: {
        'consigner_id' : consigner_id,
        'franchise_id' : this.franchise_id,
        'mode' : mode,
      }
    });

    dialogRef.afterClosed().subscribe(r => {
      if(r){
            this.getConsumers();
      }
    });
  }
}