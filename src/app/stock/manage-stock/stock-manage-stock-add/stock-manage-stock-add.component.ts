import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../_services/DatabaseService';
import {DialogComponent} from '../../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-stock-manage-stock-add',
  templateUrl: './stock-manage-stock-add.component.html',
})
export class StockManageStockAddComponent implements OnInit {

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

   
       this.getProductList();
       this.route.params.subscribe(params => {

       this.managestock = params['maintenance'] || '';

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
        console.log(this.products);

        if(this.managestock == 'maintenance'){
          for (let i = 0; i < this.products.length; i++) {
            this.products[i].scrap_stock = 0;
            this.products[i].fresh_stock = 0;
            
          }

        }else{

          for (let i = 0; i < this.products.length; i++) {
            this.products[i].scrap_stock = 0;
            this.products[i].maintenance_stock = 0;
            
          }
          
        }
       

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
check(i:any)
{
console.log(this.products[i]);

this.flag = 0;

this.products[i].scrap_stock = this.products[i].scrap_stock ? this.products[i].scrap_stock : 0;
this.products[i].maintenance_stock = this.products[i].maintenance_stock ? this.products[i].maintenance_stock : 0;

      for (let x = 0; x < this.products.length; x++) {
        const element = this.products[x];
        
        this.products[i].greater = '';


        if( parseInt(this.products[i].fresh_stock ) < ( parseInt(this.products[i].scrap_stock ) + parseInt( this.products[i].maintenance_stock) ) )
        {
          this.products[i].greater = '1';
          this.flag++;
          this.dialog.warning('Stock is grater than Fresh Stock!');
        }

       
      }
}
checkqty(i:any)
{
console.log(this.products[i]);

this.flag = 0;

this.products[i].scrap_stock = this.products[i].scrap_stock ? this.products[i].scrap_stock : 0;
this.products[i].fresh_stock = this.products[i].fresh_stock ? this.products[i].fresh_stock : 0;

      for (let x = 0; x < this.products.length; x++) {
        const element = this.products[x];
        
        this.products[i].greater = '';


        if( parseInt(this.products[i].maintenance_stock ) < ( parseInt(this.products[i].scrap_stock ) + parseInt( this.products[i].fresh_stock) ) )
        {
          this.products[i].greater = '1';
          this.flag++;
          this.dialog.warning('Stock is grater than Maintenance Stock!');
        }

       
      }
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
    this.dialog.warning('Stock is grater than  Stock!');
    return;
  }



  console.log(this.products);
  this.loading_list = true;

 
      this.db.insert_rqst({'stock': this.products , 'created_by':this.db.datauser.id , 'branch_id' : 0 ,'type':  this.managestock,'user_id':this.db.datauser.id,'stock_type': this.managestock  }, 'branches/company_manage_stock')
        .subscribe(data => {
        this.loading_list = false;

      
          this.dialog.success( 'Stock Updated'); 
          this.router.navigate(['/fresh-stock']);

          //  for (let j = 0; j < this.products.length; j++) {
          //    this.products[j].updated_at = '1';
          //    this.save = 0;
          // }

        },err => { this.loading_list = false; this.dialog.retry().then((result) => { this.update_stock(); });
    //  }
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
