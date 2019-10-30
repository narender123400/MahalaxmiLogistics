import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../_services/DatabaseService';
import {DialogComponent} from '../dialog/dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { StockModalComponent } from '../stock-modal/stock-modal.component';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
})
export class StockTransferComponent implements OnInit {
  
  loading: any;
  products: any = [];
  unit_prices: any = [];
  attr_types: any = [];
  
  stock_total: any = [];
  stock_qty: any = [];
  
  attr_options: any = [];
  data: any;
  search: any = '';
  loading_page = false;
  loading_list = false;
  loader: any = false;
  current_page = 1;
  last_page: number ;
  searchData = true;
  
  constructor(public db: DatabaseService, public dialog: DialogComponent, public dialogs: MatDialog ) {  }
  ngOnInit() {
    
    this.getProductList();
    
  }
  
  
  // openDialog(id, mode): void {
  //   const dialogRef = this.dialogs.open(StockModalComponent, {
  //     width: '850px',
  //     data: {
  //       'id' : id,
  //       'mode' : mode
  //     }
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
  
  
  
  redirect_previous() {
    this.current_page--;
    this.getProductList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getProductList();
  }
  

  filtering : any = false;
  filter:any = {};

  getProductList() {
    this.loading_list = true;
    const typ = 'Product';

    // this.filter.status = status;
      
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      
      if( this.filter.date  || this.filter.status ||  this.filter.search )this.filtering = true;
    
    this.db.post_rqst(  {'filter':this.filter}, 'sales/transfer_stock_list?page=' + this.current_page + '&t=' + typ)
    .subscribe(data => {
      console.log(data);
      this.loading_list = false;
      
      this.data = data;
      // this.current_page = this.data.data.products.current_page;
      // this.last_page = this.data.data.products.last_page;
      this.products = this.data.data.salesInvoiceList.data;
      
      // if(this.search && this.products.length < 1) { this.searchData = false; }
      // else { this.searchData = true; }
      
    },err => {
      this.loading_list = false;
      this.dialog.retry().then((result) => { this.getProductList(); });
    });
  }


  transferStockCancel(id)
  {
    this.dialog.delete('Item Data !').then((result) => {
      console.log(result);
      if(result){


      this.db.post_rqst( { 'id':id } , 'sales/CancelStockTxransfer')
      .subscribe( r => {

        this.getProductList();
        this.dialog.success( 'Company to Branch Transfer Stock is Cancel Successfully!');

      });
}
});
  }
  
  
  active:any = {};
  edit_qty(index)
  {
    console.log(index);
    
    this.active[index] = Object.assign({'qty' : 1});
    
    console.log(this.active);
    
  }

}