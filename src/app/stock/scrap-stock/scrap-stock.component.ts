import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StockModalComponent } from '../stock-modal/stock-modal.component';
@Component({
  selector: 'app-scrap-stock',
  templateUrl: './scrap-stock.component.html',
})
export class ScrapStockComponent implements OnInit {
  
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


  openDialog(id, mode): void {
    const dialogRef = this.dialogs.open(StockModalComponent, {
      width: '850px',
      data: {
        'id' : id,
        'mode' : mode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }



  redirect_previous() {
    this.current_page--;
    this.getProductList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getProductList();
  }

  getProductList() {
    this.loading_list = true;
    const typ = 'Product';

    this.db.post_rqst(  '', 'stockdata/getFreshStock?page=' + this.current_page + '&s=' + this.search + '&t=' + typ)
      .subscribe(data => {
        console.log(data);
        this.loading_list = false;
        
        this.data = data;
        this.current_page = this.data.data.products.current_page;
        this.last_page = this.data.data.products.last_page;
        this.products = this.data.data.products.data;

        if(this.search && this.products.length < 1) { this.searchData = false; }
        else { this.searchData = true; }
      
      },err => {
        this.loading_list = false;
            this.dialog.retry().then((result) => { this.getProductList(); });
      });
  }


//   getProductList() {
//     this.loading_list = true;
//     this.db.post_rqst(  '', 'stock/getFinishProducts?page=' + this.current_page + '&s=' + this.search)
//     .subscribe(data => {
//       this.loading_list = false;
      
//       console.log(data);
//       this.data = data;
//       this.current_page = this.data.data.products.current_page;
//       this.last_page = this.data.data.products.last_page;
//       this.products = this.data.data.products;
//       if(this.search && this.products.length < 1) { this.searchData = false; }
//       else { this.searchData = true; }
//       this.unit_prices = this.data.data.unit_prices;
//       // this.attr_types = this.data.data.attr_types;
//       // this.attr_options = this.data.data.attr_options;
//       this.stock_qty = this.data.data.stock_qty;
//       this.stock_total = this.data.data.stock_total;
//     },err => { this.loading_list = false; this.dialog.retry().then((result) => { this.getProductList(); });
//   });
// }

deleteProduct(p_id) {
  this.loading_list = true;
  
  this.dialog.delete('Product').then((result) => {
    this.loading_list = true;
    
    if(result) {
      this.db.post_rqst({p_id: p_id}, 'products/remove')
      .subscribe(data => {
        this.data = data;
        if (this.data.data.r_product) { this.getProductList(); }
      });
    }
  });
}


save = 0;

add(x){
  if(x){
    this.save++;
  }else{
    this.save--;
  }
}

update_stock() {
  console.log(this.products);
  this.loading_list = true;

  // this.dialog.delete('sTOCLK').then((result) => {
  //   if(result) {
      this.db.post_rqst({'stock': this.products ,'type': '','user_id':this.db.datauser.id,'stock_type':'Fresh'  }, 'stock/updateStock')
        .subscribe(data => {
        this.loading_list = false;

          // this.data = data;
          this.dialog.success( 'Stock Updated'); 

           for (let j = 0; j < this.products.length; j++) {
             this.products[j].updated_at = '1';
             this.save = 0;
          }

        },err => { this.loading_list = false; this.dialog.retry().then((result) => { this.update_stock(); });
    //  }
  });
}





// update_stock()
// {
//   console.log(this.stock_qty);
//   this.loading_list = true;
  
//   this.db.post_rqst({'stock': this.stock_qty ,'type': '' }, 'stock/updateStock')
//   .subscribe(data => {
//     this.loading_list = false;
    
//     // this.data = data;
//     this.dialog.error( 'Stock Updated'); 
//     for (let i = 0; i < this.stock_qty.length; i++) {
//       const element = this.stock_qty[i];
//       for (let j = 0; j < this.stock_qty[i].length; j++) {
//         const element = this.stock_qty[i][j].updated_at = '1';
//         this.save = 0;
        
//       }
      
//     }
//   },err => { this.loading_list = false; this.dialog.retry().then((result) => { this.update_stock(); });
// });
// this.active = {};

// }


active:any = {};
edit_qty(index)
{
  console.log(index);
  
  this.active[index] = Object.assign({'qty' : 1});
  
  console.log(this.active);
  
}


}
