import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../_services/DatabaseService';
import {DialogComponent} from '../../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-manage-stock-add',
  templateUrl: './manage-stock-add.component.html'
})
export class ManageStockAddComponent implements OnInit {

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
  franchise_id;
  managestock : any = '';
  
  constructor(public db: DatabaseService, public dialog: DialogComponent, public dialogs: MatDialog ,private route: ActivatedRoute,private router: Router, ) {  }
  

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      this.managestock = params['maintenance'] || '';

      console.log(this.managestock);
      
    if (this.franchise_id) {
       this.getProductList();
    }
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
    this.db.post_rqst(  {'branch_id':this.franchise_id,'type' : this.managestock}, 'branches/get_manage_stock')
      .subscribe(d => {
        console.log(d);
        this.loading_list = false;
        this.products = d.data.products;
        if(this.search && this.products.length < 1) { this.searchData = false; }
        else { this.searchData = true; }
      },err => {
        this.loading_list = false;
            this.dialog.retry().then((result) => { this.getProductList(); });
      });
  }

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

flag :any = 0;
check(x)
{
this.flag = 0;
this.loading_list = true;


for (let i = 0; i < this.products.length; i++) {
  
        this.products[i].greater = '';
        this.products[i].scrap_stock = this.products[i].scrap_stock ? this.products[i].scrap_stock : 0;
        this.products[i].maintenance_stock = this.products[i].maintenance_stock ? this.products[i].maintenance_stock : 0;

        if( parseInt(this.products[i].fresh_stock ) < ( parseInt(this.products[i].scrap_stock ) + parseInt( this.products[i].maintenance_stock) ) )
        {
          this.products[i].greater = '1';
          this.flag++;
          this.dialog.warning('Stock is grater than Fresh Stock!');
        }
      }
  this.loading_list = false;

}

checkqty(x)
{
this.flag = 0;
this.loading_list = true;


for (let i = 0; i < this.products.length; i++) {
  
        this.products[i].greater = '';
        this.products[i].scrap_stock = this.products[i].scrap_stock ? this.products[i].scrap_stock : 0;
        this.products[i].fresh_stock = this.products[i].fresh_stock ? this.products[i].fresh_stock : 0;

        if( parseInt(this.products[i].maintenance_stock ) < ( parseInt(this.products[i].scrap_stock ) + parseInt( this.products[i].fresh_stock) ) )
        {
          this.products[i].greater = '1';
          this.flag++;
          this.dialog.warning('Stock is grater than Maintenance Stock!');
        }
      }
  this.loading_list = false;

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
  if( this.flag ){
    this.dialog.warning('Stock is grater than Stock!');
    return;
  }
  console.log(this.products);
  this.loading_list = true;
      this.db.post_rqst({'stock': this.products , 'branch_id' : this.franchise_id ,'type': this.managestock ,'created_id':this.db.datauser.id,'stock_type':this.managestock  }, 'branches/manage_stock')
        .subscribe(data => {
        this.loading_list = false;
          this.dialog.success( 'Stock Updated'); 
           for (let j = 0; j < this.products.length; j++) {
             this.products[j].updated_at = '1';
             this.save = 0;
          }
          this.router.navigate(['branch-stock/'+ this.franchise_id ]);
        },err => { this.loading_list = false; this.dialog.retry().then((result) => { this.update_stock(); });
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
