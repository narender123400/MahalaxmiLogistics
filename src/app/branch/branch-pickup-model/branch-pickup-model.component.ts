import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-branch-pickup-model',
  templateUrl: './branch-pickup-model.component.html'
})
export class BranchPickupModelComponent implements OnInit {

  part_data: any = {};
  franchise_id

  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent,
     @Inject(MAT_DIALOG_DATA) public lead_data: any, public dialogRef: MatDialogRef<BranchPickupModelComponent>) {
       console.log(lead_data);
       
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

//     val_accept(i:any,x:any)
//   {
// console.log(this.stock_data[i]);

//     if( this.stock_data[i].delivered_qty >= this.stock_data[i].pick_stock){
//       this.stock_data[i].pick_stock = this.stock_data[i].pick_stock + this.stock_data[i].pick_stock_maintenance;
//     }else{      
//       this.stock_data[i].pick_stock = this.stock_data[i].delivered_qty;
//       this.dialog.warning('Greater Qty!');
//       return;
//     }
//   }



checkPartStock(i:any){
      
console.log(this.stock_data[i]);
       
    if( parseInt(   this.stock_data[i].delivered_qty ) == 0 ){

      this.stock_data[i].pick_stock_maintenance = 0;
      this.stock_data[i].pick_stock = 0;
      this.dialog.warning('Stock Down!');
      return;
    }
    
    if( parseInt(   this.stock_data[i].delivered_qty  ) < parseInt(  this.stock_data[i].pick_stock ) ){

      this.stock_data[i].pick_stock = 0;
      
      this.dialog.warning('Pickup Qty is grater than Delivery Stock!');
      return;
    }
    if( parseInt(   this.stock_data[i].delivered_qty  ) < parseInt(   this.stock_data[i].pick_stock_maintenance ) ){

      this.stock_data[i].pick_stock_maintenance = 0;
      this.dialog.warning('Maintenance Qty is grater than Delivery Stock!');
      return;
    }
    if( parseInt(   this.stock_data[i].delivered_qty  ) < parseInt(  this.stock_data[i].pick_stock + this.stock_data[i].pick_stock_maintenance ) ){

      this.stock_data[i].pick_stock_maintenance = 0;
      this.stock_data[i].pick_stock = 0;
      this.dialog.warning(' Qty is grater than Delivery Stock!');
      return;
    }
  }




  checkComboStock(i:any,x:any){
      
    console.log(this.stock_data[i]);
           
        if( parseInt(   this.stock_data[i].combo_list[x].pending_qty ) == 0 ){

          this.stock_data[i].combo_list[x].pick_stock = 0;
          this.dialog.warning('Stock Down!');
          return;
        }
        
        if( parseInt(   this.stock_data[i].combo_list[x].pending_qty ) < parseInt(  this.stock_data[i].combo_list[x].pick_stock ) ){

          this.stock_data[i].combo_list[x].pick_stock = 0;
          this.dialog.warning('Pickup Qty is grater than Delivery Stock!');
          return;
        }
       
      }



 purchase_form:any = {};
save()
{

  this.loading_list = true;
  
  console.log( this.part_data.branch_id  );
  
  this.db.insert_rqst(  { 'transport' : this.purchase_form, 'created_by' : this.db.datauser.id, 'consignee_id': this.part_data.consignee_id , 'branch_id' : this.part_data.branch_id , 'stock_data':this.stock_data }, 'branches/savePickStock')
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
