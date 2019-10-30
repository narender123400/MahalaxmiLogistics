import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';
import { BranchPickupModelComponent } from '../branch-pickup-model/branch-pickup-model.component';

@Component({
  selector: 'app-branch-pickup',
  templateUrl: './branch-pickup.component.html'
})
export class BranchPickupComponent implements OnInit {

  franchise_id;
  loading_list = false;

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent, public dialogs: MatDialog) {}

  ngOnInit() {

    this.route.params.subscribe(params => {
    this.franchise_id = params['franchise_id'];
    console.log(this.franchise_id);
    
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

  pickup:any = [];
  tmp:any;
  total_consigners = 0;

  getConsumers() {
    
    this.loading_list = true;
    // this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    // if(  this.filter.date || this.filter.search )this.filtering = true;

    this.db.post_rqst(  {'branch_id':this.franchise_id}, 'branches/branch_pickup?page='+this.current_page)
    .subscribe(d => {
      console.log(d);
    this.loading_list = false;


        // this.current_page = d.current_page;
        // this.last_page = d.last_page;
        // this.total_consigners = d.total;
        // this.pickup = d.data;
        this.pickup = d;

     console.log(  this.pickup );
    },err => {  this.loading_list = false; this.dialog.retry().then((result) => { this.getConsumers(); });   });
  }

  openDialog(consignee_id , mode : any = 0 ): void {
    const dialogRef = this.dialogs.open(BranchPickupModelComponent, {
      width: '1280px',
      data: {
        'consignee_id' : consignee_id,
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