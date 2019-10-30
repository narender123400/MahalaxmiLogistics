import { Component,Inject, OnInit } from '@angular/core';


import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';



@Component({
  selector: 'app-consigner-stock-model',
  templateUrl: './consigner-stock-model.component.html'
})
export class ConsignerStockModelComponent implements OnInit {
part_data: any = {};

  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent,
     @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<ConsignerStockModelComponent>) {
      //  this.part_data.part_id = lead_data.id; 
       this.part_data.consigner_id = lead_data.consigner_id; 
       this.part_data.master_parts_stock_id = lead_data.master_parts_stock_id; 
       this.part_data.combo_id = lead_data.combo_id; 
       this.part_data.type = lead_data.type; 
       this.part_data.part_number = lead_data.part_number; 
       this.part_data.mode = lead_data.mode; 
      this.getStockDetails();
      
      }


  ngOnInit() {
  }


  loading_list:any = false;
  
stock_data:any = [];

  getStockDetails() {
    this.loading_list = true;
    console.log( this.part_data );
    

    this.db.post_rqst(  {'consigner_id' : this.part_data.consigner_id, 'mode' : this.part_data.mode, 'type' : this.part_data.type, 'combo_id' : this.part_data.combo_id ,'part_id':this.part_data.master_parts_stock_id } , 'consigners/consigner_stock_model')
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
