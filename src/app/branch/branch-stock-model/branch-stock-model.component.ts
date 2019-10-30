import { Component,Inject, OnInit } from '@angular/core';


import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';


@Component({
  selector: 'app-branch-stock-model',
  templateUrl: './branch-stock-model.component.html'
})
export class BranchStockModelComponent implements OnInit {

part_data: any = {};

  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent,
     @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<BranchStockModelComponent>) {
       this.part_data.part_id = lead_data.id; 
       this.part_data.branch_id = lead_data.branch_id; 
       this.part_data.mode = lead_data.mode; 
      this.getStockDetails();
      
      }


  ngOnInit() {
  }


  loading_list:any = false;
  
stock_data:any = {};

  getStockDetails() {
    this.loading_list = true;
    console.log( this.part_data );
    

    this.db.post_rqst(  {'part' : this.part_data } , 'stockdata/getBranchStockDetails')
      .subscribe( d => {
        console.log( d );
        
        this.loading_list = false;
        this.stock_data = d;

      },err => {
        this.loading_list = false;
            this.dialog.retry().then((result) => { this.getStockDetails(); });
      });

    }


}
