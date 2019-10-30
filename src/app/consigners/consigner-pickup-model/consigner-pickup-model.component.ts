import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-consigner-pickup-model',
  templateUrl: './consigner-pickup-model.component.html',
})
export class ConsignerPickupModelComponent implements OnInit {

  part_data: any = {};
  franchise_id

  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent,
     @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<ConsignerPickupModelComponent>) {
       this.part_data.consignee_id = lead_data.consignee_id; 
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

    this.db.post_rqst(  {'consignee_id' : this.part_data.consignee_id , 'mode' : this.part_data.mode , 'branch_id' : this.part_data.branch_id } , 'branches/branch_pickup_dialoge')
      .subscribe( d => {
        console.log( d );
        
        this.loading_list = false;
        this.stock_data = d;

      },err => {
        this.loading_list = false;
            this.dialog.retry().then((result) => { this.getStockDetails(); });
      });

    }

    val_accept(i:any,x:any)
  {
console.log(this.stock_data[i]);

    if( this.stock_data[i].delivered_qty >= this.stock_data[i].pick_stock){
      this.stock_data[i].pick_stock = this.stock_data[i].pick_stock;
    }else{      
      this.stock_data[i].pick_stock = this.stock_data[i].delivered_qty;
      this.dialog.warning('Greater Qty!');
      return;
    }
  }


save()
{

  this.loading_list = true;
  
  console.log( this.part_data.branch_id  );
  
  this.db.insert_rqst(  { 'created_by' : this.db.datauser.id, 'consignee_id': this.part_data.consignee_id , 'branch_id' : this.part_data.branch_id , 'stock_data':this.stock_data }, 'branches/savePickStock')
    .subscribe( d => {
      console.log( d );
      this.loading_list = false;
      this.dialogRef.close(true);
      this.dialog.success('Stock Picked Successfully!');
    },err => {
      this.loading_list = false;
          this.dialog.retry().then((result) => {  });
    });

  }



  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(event.keyCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  


}
