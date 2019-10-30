import { Component, OnInit } from '@angular/core';
import {DialogComponent} from '../../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../../_services/DatabaseService';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { FormsModule, FormGroup }   from '@angular/forms';
import * as moment from 'moment';
import { log } from 'util';


@Component({
  selector: 'app-consigner-intransit',
  templateUrl: './consigner-intransit.component.html'

})
export class ConsignerIntransitComponent implements OnInit {

    consingerList: any = [];
    consingeeList: any = [];

  data:any = {};

  brandList:any = [];
  productList : any = [];
  measurementList: any = [];
  attributeTypeList: any = [];
  attributeOptionList: any = [];

  orderItemList: any = [];

  loader: any = '';
  current_page = 1;
  search: any = '';
  branch_id:any='';
  consigner_id:any='';
  consignee_id:any='';

  orderData: any = {};
  loading_list = false;
  franchise_id :any = '';
  
    constructor(public db: DatabaseService,
                public dialog: DialogComponent,
                private route: ActivatedRoute,
                private router: Router) { }

                ngOnInit() {

                  this.orderData.vehicals_info = '<b>Vehicle Type&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :&nbsp; &nbsp;</b><div><b>vehicle No.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:&nbsp; &nbsp;<br></b></div><div><b>vehicle Frieght&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :&nbsp; &nbsp;<br></b></div><div><b>Driver Name&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :&nbsp; &nbsp;</b></div><div><b>Driver Mobile No.&nbsp; &nbsp; &nbsp;:&nbsp; &nbsp;</b></div><div><b>Name Of Transport&nbsp; :&nbsp; &nbsp;</b></div>';

                  this.route.params.subscribe(params => {
                      console.log(params);
                  this.franchise_id = params['franchise_id'];
            
                  
            
                  if (this.franchise_id) { 
                      this.getConsignee(); 
                  } else {
                      this.getConsignee();
                  }
                  // this.getParts();
            
                });
                }
            
                consigneeList: any = [];
                temp_cons: any = [];
                getConsignee() {
            
                    console.log(this.franchise_id);
                    this.loading_list = true;
                    this.db.post_rqst({'l_id':this.franchise_id} , 'branches/getConsignee')
                    .subscribe( r => {
                        console.log(r);
                        this.consigneeList  = r.consumers;            
                        this.temp_cons  = r.consumers;            
                        this.loading_list = false;
                        console.log(this.consigneeList);
                    },err => {   this.loading_list = false; this.dialog.retry().then((result) => {  this.getConsignee();  }); });
                }


                type_data:any ={};
                getMaster(){
                    this.getParts();
                  console.log( this.type_data.type);
                }



categoryList:any = [];
getParts()
{

  let d = Object.assign({}, this.consigneeList.filter(x => x.id === this.orderData.consignee_id )[0] ); 
this.orderData.payment_from = d.payment_from;
console.log( this.orderData.payment_from );


    this.loading_list = true;
    this.db.post_rqst(  {'id' : this.franchise_id ,'cons_id': this.orderData.consignee_id, 'type': this.type_data.type}, 'sales/getParts')
    .subscribe((result: any) => {
        this.loading_list = false;
        console.log(result);
        this.categoryList = result['data']['parts'];
        console.log(this.categoryList);        
    },err => {  this.loading_list = false; this.dialog.retry().then((result) => { this.getParts(); });   });
}

getComboList()
{
  this.loading_list = true;
  this.db.post_rqst(  {'id' : this.franchise_id ,'cons_id': this.orderData.consignee_id}, 'sales/getParts')
  .subscribe((result: any) => {
      this.loading_list = false;
      console.log(result);
      this.categoryList = result['data']['parts'];
      console.log(this.categoryList);        
  },err => {  this.loading_list = false; this.dialog.retry().then((result) => { this.getParts(); });   });
}


clear(){
  this.consigneeList = [];
  // this.calculateNetInvoiceTotal();
}


  



keyword = 'part_number';
// data:any = [];


selectEvent(item) {
  this.data.part_number = item.part_number;
  console.log(   this.data.part_number );
  
  if(this.data.part_number){
    this.partDetail();
  }
  
}

onChangeSearch(val: string) {
  
}

onFocused(e){
}

clear_part()
{
this.categoryList = [];
}




partDetail(){
  console.log(this.data.part_number );
  
  this.data = Object.assign({}, this.categoryList.filter(x => x.part_number === this.data.part_number )[0] ); 
console.log(  this.data );
this.data.qty = 1;
// this.data.rental_price = this.data.rental_price;
// this.data.amount = this.data.rental_price *  this.data.qty;

  
}




    getAmount(qty,rate)
    {
          console.log(qty);
          console.log(rate);
          
          this.data.amount = qty * rate;
          console.log(this.data);
    }  
    

    AddItem(s:any)
    {

      if( !this.data.part_number){
        this.dialog.warning('Part Number must!');
        return;
      }

        if( parseInt(   this.data.fresh_stock  ) == 0 ){
            this.dialog.warning('Stock Down!');
            return;
          }
    
          if( parseInt(   this.data.fresh_stock  ) < parseInt(  this.data.qty ) ){
            this.dialog.warning('Transfer Qty is grater than Fresh Stock!');
            return;
          }
    

          
        this.loading_list = true;
     

 
        if(this.orderItemList.length == 0)
        {
            this.orderItemList.push(this.data);
        }
        else
        {
            for(let i=0;i<this.orderItemList.length;i++)
            {
                if(this.data.part_number == this.orderItemList[i].part_number )
                {
                    this.orderItemList[i].qty  = parseInt (  this.orderItemList[i].qty  );
                    this.orderItemList[i].qty +=  parseInt(this.data.qty);
                    this.orderItemList[i].rental_price = this.data.rental_price;
                    this.orderItemList[i].amount =  this.orderItemList[i].rental_price * this.orderItemList[i].qty;

                    break;
                }
                else if(i == this.orderItemList.length - 1)
                {
                    this.orderItemList.push(this.data);     
                    break;   
                }
            }
        }

        this.data = {};

        console.log(this.orderItemList);

        // this.calculateNetOrderTotal();

        console.log(this.orderItemList);

      // s.resetForm();
      this.loading_list = false;

      console.log(  this.orderData);

      this.update_qty();
      
    }



    calculateNetOrderTotal() {

        this.orderData.netSubTotal = 0;
        this.orderData.netDiscountAmount = 0;
        this.orderData.netGstAmount = 0;
        this.orderData.netAmount = 0;
        this.orderData.netTotalQty = 0;
        this.orderData.netTotalItem = 0;
        
        for (let j = 0; j < this.orderItemList.length; j++)
        {
            console.log(this.orderItemList[j].qty);
            
            this.orderData.netTotalQty += this.orderItemList[j].qty;
            this.orderData.netSubTotal += this.orderItemList[j].amount;
            this.orderData.netDiscountAmount += this.orderItemList[j].discounted_amount;
            this.orderData.netGstAmount += this.orderItemList[j].gst_amount;
            this.orderData.netAmount += this.orderItemList[j].item_final_amount;
        }
        this.orderData.netTotalItem += this.orderItemList.length;

        this.orderData.netGrossAmount = this.orderData.netSubTotal - this.orderData.netDiscountAmount;

        console.log(this.orderData);
    }

    savingData:any= false;
    submit_sales_order()
    {
        this.loading_list = true;
        this.savingData = true;
        console.log(this.orderData);
        console.log(this.orderItemList);

        this.orderData.itemList = this.orderItemList;
        this.orderData.created_by = this.db.datauser.id;
        this.orderData.consigner_id = this.franchise_id;
       
        this.db.insert_rqst( {'stock' :this.orderData }, 'sales/saveIntrnsit')
        .subscribe((result: any) => {
            this.savingData = false;
            this.loading_list = false;
              console.log(result);
            this.router.navigate(['/in-transit-list/' + this.franchise_id]);
            this.dialog.success( 'Intransit genrated Successfully!');
            
        },err => {   this.loading_list = false; this.savingData = false; this.dialog.retry().then((result) => {    });
    });
}


checkFrshStock(){

    if( parseInt(   this.data.fresh_stock  ) == 0 ){
      this.dialog.warning('Stock Down!');

    }

    if( parseInt(   this.data.fresh_stock  ) < parseInt(  this.data.qty ) ){
      this.dialog.warning('Transfer Qty is grater than Fresh Stock!');
      
    }
    // this.update_qty1();
    
  }


  RemoveItem(index)
  {
      console.log(index);
      this.dialog.delete('Item Data !').then((result) => {
          console.log(result);
          if(result){
            this.orderItemList.splice(index,1);

            // this.calculateNetInvoiceTotal();
            this.dialog.success('Item has been deleted.');
          }
      });
  }



  
  required_qty:any = '';
  grater_stock:any = '';
  update_qty(){
    this.grater_stock = 0;
    for (let j = 0; j < this.orderItemList.length; j++)
    {
      this.orderItemList[j].grater_stock = '';
      if(this.orderItemList[j].fresh_stock < this.orderItemList[j].qty){
        this.orderItemList[j].grater_stock = '1';
        this.grater_stock++;
      }




    }




    if(this.grater_stock){
      this.dialog.warning('Transfer Qty grater than required qty!');
    }

    
  }

  active:any={};

  toggleterritory1(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active.user1 = true; }
    if(action == 'close')
    { this.active.user1 = false;}
  
    console.log(this.active);
  
  
  }
  
  search2:any={};
  tmpsearch3:any={};
  getItemscheckin(con,search)
  {
    console.log(search);
    if(con=='con2'){
      this.consigneeList=[];
    console.log( this.consigneeList);

      for(var i=0;i<this.temp_cons.length; i++)
      {
        search=search.toLowerCase();
        this.tmpsearch3=this.temp_cons[i]['consignee_name'].toLowerCase();
        if(this.tmpsearch3.includes(search))
        {
          this.consigneeList.push(this.temp_cons[i]);
        }     
      }    
      console.log(this.consigneeList);
    }
  }
  



}
