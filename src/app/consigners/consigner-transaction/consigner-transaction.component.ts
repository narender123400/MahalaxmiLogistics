import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';
// import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';

@Component({
  selector: 'app-consigner-transaction',
  templateUrl: './consigner-transaction.component.html',
})
export class ConsignerTransactionComponent implements OnInit {

  prod_id:any = '';

  loading: any;
  products: any = [];
  unit_prices: any = [];
  attr_types: any = [];

  stock_total: any = [];
  stock_qty: any = [];

  attr_options: any = [];
  data: any;

  loading_list: any = false;
  unit_id: any = '';
  mode :any = '';
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent, public dialogs: MatDialog) {
}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.prod_id = params['id'];
      this.type = params['type'];
      this.cons_id = params['franchise_id'];
      console.log(  params['franchise_id'] );

    
    if (this.prod_id &&  this.cons_id ) {
console.log(  this.cons_id  );
      
       this.getProductDetail();
       this.mode = '1'; 
      }
    });
  }


  // openDialog(): void {
  //   const dialogRef = this.dialogs.open(InvoiceModalComponent, {
  //     width: '768px',
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }


  product:any = {};
  porducFinishGood:any = [];
  unit:any = {};
  incoming:any = [];
  outgoing:any = [];
  cons_id : any = '';
  type:any = '';
  getProductDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'cons_id':this.cons_id ,'type': this.type }, 'consigners/consigner_incoming')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.product = this.data.data.prod;
        // this.porducFinishGood = this.data.data.finish_good;
        this.incoming = this.data.data.incoming;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getProductDetail();
            });
      });
  }

  incoming_challan:any = [];
  get_Challan_incoming() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'cons_id':this.cons_id ,'type': this.type }, 'consigners/consigner_incoming_challan')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        // this.product = this.data.data.prod;
        // this.porducFinishGood = this.data.data.finish_good;
        this.incoming_challan = this.data.data.incoming;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getProductDetail();
            });
      });
  }




  getOutgoingDetail() {
    // this.loading_list = true;
    // this.db.post_rqst(  { 'id':this.prod_id  }, 'stock/getOutgoingDetail')
    //   .subscribe(data => {
    //     this.loading_list = false;
    //     this.data = data;
    //     this.branchs = this.data.data.branch;
    //     console.log(this.data);
        

    //   },err => {
    //     this.loading_list = false;

    //         this.dialog.retry().then((result) => {
    //             this.getbranchsDetail();
    //         });
    //   });
  }






  getbranchsDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'mode' : '1' ,'type': this.type}, 'stock/getFinishGoodDetail')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.incoming = this.data.data.branch;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchsDetail();
            });
      });
  }




  // stock :any = '';
  // getbranchsConsDetail() {
  //   this.loading_list = true;
  //   this.db.post_rqst(  { 'id':this.prod_id , 'consignor_id':this.cons_id }, 'branches/consignee_stock')
  //     .subscribe(d => {
  //       this.loading_list = false;
  //       console.log(d);
  //       this.stock = d.consignee;

  //     },err => {
  //       this.loading_list = false;

  //           this.dialog.retry().then((result) => {
  //               this.getbranchsConsDetail();
  //           });
  //     });
  // }


  getbranchtransferstock() {
    this.loading_list = true;
    this.db.post_rqst(  { 'part_id':this.prod_id, 'consignor_id':this.cons_id ,'type': this.type}, 'consigners/transaction_intrnsit_outgoing')
      .subscribe(data => {
        console.log(data);
        this.loading_list = false;
        this.outgoing = data.outgoing;
        console.log(this.outgoing);
       
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchtransferstock();
            });
      });
  }

  intransit_incoming:any = [];
  getIncominginTransit() {
    this.loading_list = true;
    this.db.post_rqst(  { 'part_id':this.prod_id, 'consignee_id':this.cons_id ,'type': this.type }, 'consigners/getIncominginTransit')
      .subscribe(data => {
        console.log(data);
        this.loading_list = false;
        this.intransit_incoming = data.incoming;
        console.log(this.intransit_incoming);
       
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getIncominginTransit();
            });
      });
  }





  pickupOutgoing : any = [];
  getbranchsConsDetail() {

    this.loading_list = true;
    
    this.db.post_rqst(  { 'consigner_id' : this.cons_id , 'id' : this.prod_id  ,'type': this.type}, 'consigners/transaction_pickupStockOutgoing')
      .subscribe(d => {
        this.loading_list = false;

        this.pickupOutgoing = d;
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchsConsDetail();
            });
      });
  }





}
