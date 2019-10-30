import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';

@Component({
  selector: 'app-combo-add',
  templateUrl: './combo-add.component.html'
})
export class ComboAddComponent implements OnInit {

  brandList:any = [];
  productList : any = [];
  measurementList: any = [];
  attributeTypeList: any = [];
  attributeOptionList: any = [];
  data:any = {};
  loading_list:any = false;

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
  public matDialog: MatDialog,  public dialog: DialogComponent) {}

  ngOnInit() {
    this.getProductList();
    this.finish_good.total_price = 0;
    this.finish_good.total_qty = 0;
    this.finish_good.total_amount = 0;
    this.finish_good.price = 0;
  }
  rawMatrialList:any = [];
  rawproductList : any = [];
  disabled:any = false;
  finish_good:any = {};
  raw_material :any = {};

  getProductList()
  {
        this.loading_list = true;
        this.finish_good.product_id = '';
        this.finish_good.measurement = '';
        this.finish_good.rate = '';
        this.finish_good.attribute_type = '';
        this.finish_good.attribute_option = '';

        this.db.post_rqst( '' , 'products/get_parts')
        .subscribe( r => {
          console.log( r );
          this.loading_list = false;
            this.productList = r.products;
console.log( this.productList );
        }, error => {
            console.log(error);
            this.dialog.retry().then((result) => {
              this.getProductList();
          });
        });
  }
  keyword = 'part_number';
  selectEvent(item) {
    this.raw_material.part_number = item.part_number;
    console.log(   this.raw_material.part_number );
    
    if(this.raw_material.part_number){
      this.getDetail();
    }
  }
  onChangeSearch(val: string) {
  }
  onFocused(e){
  }
  getDetail()
  {
      console.log(this.finish_good);
      console.log(this.measurementList);
      this.raw_material.qty = 1;
      const x = this.productList.filter(x=>x.part_number === this.raw_material.part_number)[0];
      this.raw_material.description = x.description;
      this.raw_material.dimensions = x.dimensions;
      this.raw_material.weight = x.weight;
      this.raw_material.volume_weight = x.volume_weight;
      this.raw_material.volume_weight = x.volume_weight;
      this.raw_material.price = x.purchase_price;
      this.raw_material.id = x.id;
      this.GetAmount(1,this.raw_material.price);
      // this.finish_good.price += parseInt( this.raw_material.price );

  }
  GetAmount(qty,p)
  {
    qty = qty ? qty : 1;   
    this.raw_material.amount = qty * p;
    console.log(this.data);    
  }
  addRawMatrialList(i)
  {
    if( !this.raw_material.part_number ){
      this.dialog.warning('Please Choose Part!');
      return;
    }
    for (let i = 0; i < this.rawMatrialList.length; i++) {
      if( this.raw_material.part_number ===  this.rawMatrialList[i].part_number ){
            this.dialog.success('Part Number Already Exist! please Delete first it.');
            return;
      }
    }
// this.finish_good.total_price += parseInt( this.raw_material.price );
// this.finish_good.qty += parseInt( this.raw_material.qty );

    this.rawMatrialList.push( this.raw_material );

    this.cal();

    

    console.log(this.rawMatrialList);
    this.raw_material={};
    i.resetForm();
  }
  amount:any = 0;
  qty:any = 0;

  cal()
  {

    this.finish_good.total_qty  = 0;
    this.finish_good.price = 0;


    for (let i = 0; i < this.rawMatrialList.length; i++) {


      this.finish_good.total_qty = parseInt(  this.rawMatrialList[i].qty);

      this.rawMatrialList[i].amount =   parseInt( this.rawMatrialList[i].qty ) * parseInt ( this.rawMatrialList[i].price );

      this.finish_good.price  += parseInt( this.rawMatrialList[i].amount  );
      
    }

  }


  RemoveItem(i)
  {
      console.log(i);
      this.dialog.delete('Item Data !').then((result) => {
          console.log(result);
          if(result){
            this.rawMatrialList.splice(i,1);
            this.dialog.success('Item has been deleted.');
            this.cal();
          }
      });
  }
  savingData:any = false;
  saveRawProductList()
  {
    this.savingData = true;
       console.log(this.finish_good);
       console.log(this.rawMatrialList);
        this.db.post_rqst( {'raw': this.rawMatrialList , 'finish_good': this.finish_good , 'login_id': this.ses.users.id } , 'stock/saveRawProductList')
        .subscribe((d) => {
          this.savingData = false;


          if (d == 'Exist') {
            this.dialog.warning( 'Combo Name Already Exist!');
            return
          }
  
          if (d == 'Combo-Exist') {
            this.dialog.warning( 'this Combo Name Already Exist in Part Number !');
            return
          }
  
          this.router.navigate(['/combo-list']);
          this.dialog.success( 'Combo added Successfully!');

        }, error => {
          this.savingData = false;
        });
  }
}
