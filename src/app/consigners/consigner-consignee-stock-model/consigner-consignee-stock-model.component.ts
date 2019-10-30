import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-consigner-consignee-stock-model',
  templateUrl: './consigner-consignee-stock-model.component.html',
})
export class ConsignerConsigneeStockModelComponent implements OnInit {

  part_data: any = {};
  franchise_id

  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent,
     @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<ConsignerConsigneeStockModelComponent>) {
       this.part_data.consigner_id = lead_data.consigner_id; 
       this.part_data.branch_id = lead_data.franchise_id; 
       this.part_data.mode = lead_data.mode;
      
      }
      ngOnInit() {
           this.getStockDetails();
      }

loading_list:any = false;
stock_data:any = [];

getStockDetails() {
    this.loading_list = true;

    this.db.post_rqst(  {'consigner_id' : this.part_data.consigner_id ,'mode' : this.part_data.mode } , 'consigners/consigner_consig_stk_model')
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
