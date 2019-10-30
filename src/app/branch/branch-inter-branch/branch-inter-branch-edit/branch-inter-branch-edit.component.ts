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
  selector: 'app-branch-inter-branch-edit',
  templateUrl: './branch-inter-branch-edit.component.html',
})
export class BranchInterBranchEditComponent implements OnInit {

  franchiseList: any = [];
  branch_from_id: any = [];

  data:any = {};
  data1:any = {};

  dbItemData:any = {};

  brandList:any = [];

  productList : any = [];

  measurementList: any = [];
  attributeTypeList: any = [];
  attributeOptionList: any = [];
  orderDetail: any = [];
  orderItemDetail: any = {};
  orderInvoiceList: any = {};

  invoiceItemList: any = [];
  ary: any;
  franchise_id:any;
  ord_id:any;

  loader: any = '';
  current_page = 1;
  search: any = '';

  invoiceData: any = {};
  loading_list = false;

  mode: any = '1'; 
  invoice_id;


  constructor(public db: DatabaseService,
              public dialog: DialogComponent,
              private route: ActivatedRoute, 
              private router: Router,
              public matDialog: MatDialog,
              ) { }

    ngOnInit() {

      this.invoiceData.gst_per = 18;

      this.route.params.subscribe(params => {
          console.log(params);
          this.invoice_id = params['b_to_b_id'];
          this.branch_from_id = params['b_id'];
          
          this.salesInvoiceDetail(this.invoice_id);
          this.getBranches(0);
          
          this.getParts();
    });
    }

    invoiceDetail:any = {};
    itemdetail:any = [];
    from_id:any = {};
    salesInvoiceDetail(invoice_id) {
      this.loading_list = true;
      this.db.post_rqst(  {'id':this.invoice_id}, 'branches/branch_inter_detail')
      .subscribe(data => {
        this.invoiceDetail = data['data']['invoicedetail'];
        this.itemdetail = data['data']['itemdetail'];
        this.loading_list = false;


        this.invoiceData = this.invoiceDetail;

        // this.from_id.branch_from_id = this.invoiceDetail.branch_from_id;

        // console.log(this.from_id.branch_from_id);


        this.invoiceData.gst_per = this.invoiceDetail.gst;
        this.invoiceData.sgst_amount = this.invoiceDetail.sgst;
        this.invoiceData.cgst_amount = this.invoiceDetail.cgst;
        this.invoiceData.igst_amount = this.invoiceDetail.igst;
        this.invoiceData.total_amount = this.invoiceDetail.total_price;
  
        this.invoiceItemList = this.itemdetail;
  
        for (let i = 0; i < this.itemdetail.length; i++) {
          this.invoiceItemList[i].transfer_qty = this.itemdetail[i].qty;
          this.invoiceItemList[i].amount = this.itemdetail[i].total_price;
          this.invoiceItemList[i].fresh_stock = this.itemdetail[i].fresh_stock;
        }

        console.log(data);
        console.log(this.invoiceDetail);
        console.log(this.itemdetail);
      },err => {  this.dialog.retry().then((result) => { this.salesInvoiceDetail(invoice_id); });   });
    }

    branchesList: any = [];
    temp_cons: any = [];
    getBranches(franchise_id) {

        console.log(franchise_id);
        this.loading_list = true;        
        this.db.get_rqst('' , 'branches/getbranches_names/' + franchise_id)
        .subscribe((result: any) => {
            console.log(result);
            this.branchesList  = result.getbranches_names;            
            this.temp_cons  = result.getbranches_names;            
            this.loading_list = false;
console.log(this.branchesList);
            // this.branchesList.branch_name 

            console.log(this.branchesList);
        },err => {   this.loading_list = false; this.dialog.retry().then((result) => {  this.getBranches(franchise_id);  }); });
    }


    

    change_org(){
      if(this.invoiceItemList > 0){
        this.calculateNetInvoiceTotal();
      }
    }
    

    product:any = [];
    getDetails()
    {
      this.loading_list = true;
      console.log(this.data);
      this.db.post_rqst( {'id': this.data.part_id  } , 'purchase/getDetails')
      .subscribe( r => {
        this.loading_list = false;
  
        console.log(r.detail);
        // r.data;
        this.data = r.detail;
        this.data.qty = 1;
        this.data.amount = 0;
        // this.GetAmount(1,  r.detail.sale_price);
  
      },error => {this.loading_list = false;  this.dialog.retry().then((result) => {  this.getDetails(); }); });
    }
    
    

    
  keyword = 'part_number';
  // data:any = [];
 
   
  selectEvent(item) {
    console.log(   this.data.part_id );
    
    // if(this.data.part_id){

      this.data = Object.assign({}, this.categoryList.filter(x=>x.id === item.id)[0] );
      console.log( this.categoryList.filter(x=>x.id === item.id)[0] );
      console.log(this.data);
      
      
      this.data.qty = 1;
      this.data.transfer_qty = 1;
      this.data.amount = 0;
      this.data.amount = (this.data.rental_price)*(this.data.transfer_qty);

      this.data.part_id = item.id;

      // this.getDetails();
    // }
    
  }
  onChangeSearch(val: string) {
    
  }
  
  onFocused(e){
  }






  categoryList:any = [];
  getParts()
  {

    this.data.product_id = '';
    this.data.measurement = '';
    this.data.rate = '';
    this.data.sale_qty =  '';
    this.data.attribute_type = '';
    this.data.attribute_option = '';
    this.brandList = [];

      this.loading_list = true;
      this.db.post_rqst(  {'branch_id' : this.branch_from_id }, 'sales/getBranchParts')
      .subscribe((result: any) => {
          this.loading_list = false;
          console.log(result);
          this.categoryList = result['data']['parts'];
          console.log(this.categoryList);     
 
          
      },err => {  this.loading_list = false; this.dialog.retry().then((result) => { this.getParts(); });   });
  }




    getSalePrice()
    {
        console.log(this.data);
        console.log(this.measurementList);

        this.data.qty = 1;
        this.data.rate = this.measurementList.filter(x=>x.unit_of_measurement === this.data.measurement)[0]['sale_price'];
        this.data.sale_qty = this.measurementList.filter(x=>x.unit_of_measurement === this.data.measurement)[0]['sale_qty'];
        this.data.uom_id = this.measurementList.filter(x=>x.unit_of_measurement === this.data.measurement)[0]['id'];
        this.data.description = this.measurementList.filter(x=>x.unit_of_measurement === this.data.measurement)[0]['description'];
        console.log(this.data);
    }


    getAmount(qty,rate)
    {
          console.log(qty);
          console.log(rate);
          
          this.data.amount = qty * rate;
          console.log(this.data);
    }  

    AddItem(form)
    {

console.log( this.data );

      
                      if( parseInt(   this.data.fresh_stock  ) == 0 ){
                        this.dialog.warning('Stock Down!');
                        return;
                      }

                      if( parseInt(   this.data.fresh_stock  ) < parseInt(  this.data.transfer_qty ) ){
                        this.dialog.warning('Transfer Qty is grater than Fresh Stock!');
                        return;
                      }

                      if( this.invoiceItemList.findIndex(x => x.part_number == this.data.part_number  ) > -1 ){
                        this.dialog.warning('Same Part Already added!');
                        return;
                      }

            this.invoiceItemList.push(JSON.parse(JSON.stringify(this.data)));
            this.data = {};
            // this.testing();
            this.cal();
          }
          
          item_list:any = [];
          invoice_data:any = {};
          testing()
          {
           
      
            this.invoice_data.total_amount_temp = 0;
            for(var i=0;i<this.invoiceItemList.length;i++)
            {
              console.log(this.invoiceItemList[i].amount);
              this.invoice_data.total_amount_temp = this.invoice_data.total_amount_temp + this.invoiceItemList[i].amount;
              this.invoice_data.total_amount = this.invoice_data.total_amount_temp;
              this.cal();
              console.log(this.invoice_data);
            }
      
          }


   
    RemoveItem(i, id:any = 0, purchase_id :any = 0)
    {
  
        this.dialog.delete('Item Data !').then( r => {
          if(!r)return;
          if(purchase_id){
            this.cal(id);
            this.delete(i,id);
          }else{
                    this.invoiceItemList.splice(i,1);
                    this.cal();
                    this.dialog.success( 'Stock Transfer Item Deleted Successfully!');
                  }
        });
  
  }
  
  delete(i, id){
    this.db.post_rqst( {'id': id, 'b_t_b_id':this.invoice_id, 'data':this.invoiceData ,'from_branch_id':this.branch_from_id } , 'branches/DeleteBranchInterBranchStkItm')
    .subscribe( r => {
      this.itemdetail.splice(i,1);
      this.dialog.success( 'Stock Transfer Item Deleted Successfully!');
      this.salesInvoiceDetail(this.invoice_id);
  
    });
  }



    checkFrshStock(qty){

      if(qty == '' || qty == undefined)
      {
        this.data.transfer_qty = 0;
      }
      else
      {
        this.data.amount = (this.data.rental_price)*qty;
        console.log(this.data.amount);
      }

      if( parseInt(   this.data.fresh_stock  ) == 0 ){
        this.dialog.warning('Stock Down!');

      }

      if( parseInt(   this.data.fresh_stock  ) < parseInt(  this.data.transfer_qty ) ){
        this.dialog.warning('Transfer Qty is grater than Fresh Stock!');

      }
    }

    required_qty:any = '';
    update_qty(index,qty,price){
      
      // this.invoiceItemList[index].amount = qty*price;
      console.log(this.invoiceItemList[index].amount);
      this.grater_stock = 0;
      for (let j = 0; j < this.invoiceItemList.length; j++)
      {
        this.invoiceItemList[j].transfer_qty = parseInt(this.invoiceItemList[j].transfer_qty);
        this.invoiceItemList[j].grater_stock = '';
        if(this.invoiceItemList[j].fresh_stock < this.invoiceItemList[j].transfer_qty){
          this.invoiceItemList[j].grater_stock = '1';
          this.grater_stock++;
        }




      }



      if(this.grater_stock){
        this.dialog.warning('Transfer Qty grater than required qty!');
      }
     this.cal();
      
    }

    organization:any = [];
    // change_invoice_id()
    // {
    //     this.loading_list = true;
        

    //     this.db.post_rqst( this.invoiceData , 'sales/getInvoiceId')
    //     .subscribe((result: any) => {
    //         this.organization = result['data'].organization;
            
    //         // if(result['data'].invoice_id){
    //             this.invoiceData.organization_id = '';
    //             this.invoiceData.due_terms = '';
    //         // }

    //         if(this.organization.length > 0 ){
    //           this.invoiceData.organization_id = this.organization[0].id;
    //         }

    //         this.loading_list = false;

    //     },err => {console.log(err);  this.savingData = false; this.loading_list = false; this.dialog.retry().then((result) => { this.change_invoice_id(); }); });
    // }


    discount_per_count(i){
        if( this.invoiceItemList[i].discount > 0 ){
            this.invoiceItemList[i].amount = this.invoiceItemList[i].qty * this.invoiceItemList[i].rate ;
        this.invoiceItemList[i].discounted_amount = ( this.invoiceItemList[i].amount ) * ( this.invoiceItemList[i].discount / 100);
        this.invoiceItemList[i].discounted_amount = this.invoiceItemList[i].discounted_amount ? this.invoiceItemList[i].discounted_amount.toFixed(2) : 0;
      }else{
        this.invoiceItemList[i].discounted_amount = 0 ;
        this.invoiceItemList[i].discount  = 0;
      }
    
      this.calculateNetInvoiceTotal();
    
    }
    
      discount_amt_count(i){
        if(  this.invoiceItemList[i].discounted_amount > 0 ){
            this.invoiceItemList[i].amount = this.invoiceItemList[i].qty * this.invoiceItemList[i].rate ;
          this.invoiceItemList[i].discount =   ( this.invoiceItemList[i].discounted_amount /  this.invoiceItemList[i].amount  ) * 100 ;
        this.invoiceItemList[i].discount =  this.invoiceItemList[i].discount ? this.invoiceItemList[i].discount.toFixed(2) : 0;
    
        }else{
          this.invoiceItemList[i].discounted_amount = 0 ;
          this.invoiceItemList[i].discount  = 0;
        }
      this.calculateNetInvoiceTotal();
       
    
      }

      allItemDiscount(){



        this.calculateNetInvoiceTotal();
// console.log(this.invoiceData.extra_discount);

      }
      clear(){
          this.invoiceItemList = [];
          // this.calculateNetInvoiceTotal();
          this.selected_vendor = Object.assign({}, this.branchesList.filter(x => x.id === this.invoiceData.branch_id )[0] ); 

  console.log(this.selected_vendor);
      }

  grater_stock:any = 0;
  franchiseDetail:any = {};
    calculateNetInvoiceTotal() {

        this.invoiceData.rate = 0;
        this.invoiceData.itemTotal = 0;
        this.invoiceData.netSubTotal = 0;
        this.invoiceData.netDiscountAmount = 0;
        this.invoiceData.netDiscountPer  = 0;
        this.invoiceData.netGstAmount = 0
        this.invoiceData.cgst_amt = 0;
        this.invoiceData.sgst_amt = 0;
        this.invoiceData.igst_amt = 0;
        this.invoiceData.shiping_gst_per  = 0;

        this.invoiceData.sgst_per = 0;
        this.invoiceData.cgst_per = 0;
        this.invoiceData.igst_per = 0;

        this.invoiceData.netAmount = 0;

        this.invoiceData.shiping_gst = [];
        this.invoiceData.shippingWithGst = 0;

        this.invoiceData.shipping_cgst_amt = 0;
        this.invoiceData.shipping_sgst_amt = 0;
        this.invoiceData.shipping_igst_amt = 0;
        this.invoiceData.shiping_igst_per  = 0;
        this.invoiceData.shiping_sgst_per  = 0;
        this.invoiceData.shiping_cgst_per  = 0;
        this.grater_stock = 0;

        if(this.invoiceItemList == 0){
            this.invoiceData.shipping_charges = 0;
            this.invoiceData.extra_discount = 0;
        }

  

        
        for (let j = 0; j < this.invoiceItemList.length; j++)
        {

          if(this.invoiceItemList[j].sale_qty < this.invoiceItemList[j].qty){
            this.grater_stock++;
          }

            this.invoiceItemList[j].extra_discount = this.invoiceItemList[j].extra_discount || 0;
            
            this.invoiceItemList[j].discount -= parseInt( this.invoiceItemList[j].extra_discount ); 

            this.invoiceItemList[j].discount += parseInt( this.invoiceData.extra_discount  );
            
            this.invoiceItemList[j].extra_discount = parseInt( this.invoiceData.extra_discount );
            
            this.invoiceItemList[j].discounted_amount = parseInt( this.invoiceItemList[j].amount ) * ( this.invoiceItemList[j].discount  / 100);
            this.invoiceItemList[j].discounted_amount = this.invoiceItemList[j].discounted_amount ? this.invoiceItemList[j].discounted_amount.toFixed(2) : 0;

            this.invoiceItemList[j].amount = this.invoiceItemList[j].qty * this.invoiceItemList[j].rate ;
             this.invoiceItemList[j].gross_amount =  this.invoiceItemList[j].amount -   this.invoiceItemList[j].discounted_amount;


            
            if(this.mode == '1')this.franchiseDetail = this.franchiseList.filter(x => x.id === parseInt(this.invoiceData.franchise_id ) )[0];
            

            this.invoiceData.shiping_gst.push( this.invoiceItemList[j].gst );

            if(j == (this.invoiceItemList.length - 1) ){

                this.invoiceData.shiping_gst_per = Math.max.apply(null, this.invoiceData.shiping_gst);

                console.log(this.invoiceData.shiping_gst_per);

                // this.invoiceData.shipping_charges = 
            }
          

            if( this.franchiseDetail.state == this.db.datauser.state ){

                this.invoiceItemList[j].cgst_per = this.invoiceItemList[j].gst/2;
                this.invoiceItemList[j].sgst_per = this.invoiceItemList[j].gst/2;
                this.invoiceItemList[j].igst_per = 0;

                this.invoiceItemList[j].cgst_amt = Math.round( this.invoiceItemList[j].gross_amount * ( this.invoiceItemList[j].cgst_per / 100) );
                this.invoiceItemList[j].sgst_amt = Math.round( this.invoiceItemList[j].gross_amount * ( this.invoiceItemList[j].sgst_per / 100) );
                this.invoiceItemList[j].igst_amt = 0;
    
                this.invoiceItemList[j].gst_amount = Math.round( this.invoiceItemList[j].cgst_amt +  this.invoiceItemList[j].sgst_amt + this.invoiceItemList[j].igst_amt );
    
                if(j == (this.invoiceItemList.length - 1) && this.invoiceData.shipping_charges > 0 ){

                this.invoiceData.shiping_cgst_per = this.invoiceData.shiping_gst_per/2;
                this.invoiceData.shiping_sgst_per = this.invoiceData.shiping_gst_per/2;
                this.invoiceData.shiping_igst_per = 0;

                this.invoiceData.shipping_cgst_amt = Math.round( this.invoiceData.shipping_charges * (  this.invoiceData.shiping_cgst_per/ 100) );  
                this.invoiceData.shipping_sgst_amt = Math.round( this.invoiceData.shipping_charges * (  this.invoiceData.shiping_sgst_per/ 100) );  
                this.invoiceData.shipping_igst_amt = 0;
                this.invoiceData.shippingWithGst = Math.round(  this.invoiceData.shipping_cgst_amt + this.invoiceData.shipping_sgst_amt);
                // this.invoiceData.itemTotal +=  this.invoiceData.shipping_charges || 0;
                this.invoiceData.netAmount += this.invoiceData.shipping_charges +  this.invoiceData.shippingWithGst;

                }
    
    
            }else{
              this.invoiceItemList[j].cgst_per = 0;
              this.invoiceItemList[j].sgst_per = 0;
              this.invoiceItemList[j].igst_per = this.invoiceItemList[j].gst;

              this.invoiceItemList[j].cgst_amt = 0;
              this.invoiceItemList[j].sgst_amt = 0;
              this.invoiceItemList[j].igst_amt = Math.round( this.invoiceItemList[j].gross_amount * ( this.invoiceItemList[j].igst_per / 100) );
              this.invoiceItemList[j].gst_amount = Math.round( this.invoiceItemList[j].cgst_amt +  this.invoiceItemList[j].sgst_amt + this.invoiceItemList[j].igst_amt );
            //   && this.invoiceData.shipping_charges != 0 
                if(j == (this.invoiceItemList.length - 1 ) && this.invoiceData.shipping_charges > 0  ){
                        this.invoiceData.shiping_cgst_per = 0;
                        this.invoiceData.shiping_sgst_per = 0;
                        this.invoiceData.shiping_igst_per = this.invoiceData.shiping_gst_per;


                        this.invoiceData.shipping_igst_amt = Math.round( this.invoiceData.shipping_charges * (  this.invoiceData.shiping_igst_per/ 100) ); 
                        this.invoiceData.shippingWithGst = Math.round( this.invoiceData.shipping_igst_amt); 
                        // this.invoiceData.itemTotal +=  this.invoiceData.shipping_charges || 0;
                        this.invoiceData.netAmount += this.invoiceData.shipping_charges +  this.invoiceData.shippingWithGst;

                    }
    
            }
    
             this.invoiceItemList[j].item_final_amount = this.invoiceItemList[j].gross_amount + this.invoiceItemList[j].gst_amount;

            this.invoiceData.rate += this.invoiceItemList[j].rate;
            this.invoiceData.itemTotal += this.invoiceItemList[j].amount;
            
            this.invoiceData.netDiscountAmount += parseFloat(this.invoiceItemList[j].discounted_amount );
            this.invoiceData.netDiscountAmount = this.invoiceData.netDiscountAmount || 0;
            this.invoiceData.netSubTotal += this.invoiceData.itemTotal;

            this.invoiceData.netGstAmount += this.invoiceItemList[j].gst_amount || 0;
            if(j == (this.invoiceItemList.length - 1) && this.invoiceData.shipping_charges > 0 )
            this.invoiceData.netGstAmount += this.invoiceData.shippingWithGst || 0;


           

            this.invoiceData.cgst_amt += this.invoiceItemList[j].cgst_amt ? this.invoiceItemList[j].cgst_amt : 0;
            this.invoiceData.sgst_amt += this.invoiceItemList[j].sgst_amt ? this.invoiceItemList[j].sgst_amt : 0;
            this.invoiceData.igst_amt += this.invoiceItemList[j].igst_amt ? this.invoiceItemList[j].igst_amt : 0;
            
            this.invoiceData.cgst_per += this.invoiceItemList[j].cgst_per ? this.invoiceItemList[j].cgst_per : 0;
            this.invoiceData.sgst_per += this.invoiceItemList[j].sgst_per ? this.invoiceItemList[j].sgst_per : 0;
            this.invoiceData.igst_per += this.invoiceItemList[j].igst_per ? this.invoiceItemList[j].igst_per : 0;



            this.invoiceData.igst_per += this.invoiceData.shiping_igst_per ? this.invoiceData.shiping_igst_per : 0;
            this.invoiceData.sgst_per += this.invoiceData.shiping_sgst_per ? this.invoiceData.shiping_sgst_per : 0;
            this.invoiceData.cgst_per += this.invoiceData.shiping_cgst_per ? this.invoiceData.shiping_cgst_per : 0;


              this.invoiceData.cgst_amt += this.invoiceData.shipping_cgst_amt ? this.invoiceData.shipping_cgst_amt : 0;
              this.invoiceData.sgst_amt += this.invoiceData.shipping_sgst_amt ? this.invoiceData.shipping_sgst_amt : 0;
              this.invoiceData.igst_amt += this.invoiceData.shipping_igst_amt ? this.invoiceData.shipping_igst_amt : 0;

            this.invoiceData.netAmount += this.invoiceItemList[j].item_final_amount;
            
        }

        


        console.log(this.invoiceData.shipping_charges);
        
        // this.invoiceData.netAmount += this.invoiceData.shipping_charges;

        this.invoiceData.netDiscountPer = (  (this.invoiceData.netDiscountAmount / this.invoiceData.itemTotal ) * 100 ).toFixed(2);




        this.invoiceData.netGrossAmount = this.invoiceData.itemTotal - this.invoiceData.netDiscountAmount;

        this.invoiceData.receivedAmount = this.invoiceData.netAmount;
        this.invoiceData.balance = 0;


                // this.invoiceData.apply_extra_discount = this.invoiceData.extra_discount;
console.log(this.invoiceItemList);

        console.log(this.invoiceData);

        if(this.grater_stock > 0){
          this.dialog.success('Stock Down');
        }
    }



    onReceivedChangeHandler() {

        console.log(this.invoiceData.receivedAmount);


         if(this.invoiceData.receivedAmount < 0) {
            this.invoiceData.receivedAmount = 0;
            this.invoiceData.due_terms = '';
         }

         if(this.invoiceData.receivedAmount <= this.invoiceData.netAmount){
         this.invoiceData.balance = this.invoiceData.netAmount - this.invoiceData.receivedAmount;
  
          }else{
            this.invoiceData.receivedAmount = 0
            this.invoiceData.due_terms = '';
            this.invoiceData.balance = this.invoiceData.netAmount;
          }

        //  this.invoiceData.balance = this.invoiceData.netAmount - this.invoiceData.receivedAmount;

         
        
    }

    savingData :any = false;
    submit_sales_invoice()
    {

        // console.log(this.invoiceData.due_terms);
        this.invoiceData.due_terms = this.invoiceData.due_terms ? this.db.pickerFormat(this.invoiceData.due_terms) : '';

        this.invoiceData.login_id = this.db.datauser.id;

        this.invoiceData.branch_from = this.branch_from_id;

        this.loading_list = true
      
        this.invoiceData.itemList = this.invoiceItemList;


        console.log(this.invoiceData);

        console.log(this.franchise_id)



        this.db.post_rqst( { 'stock':this.invoiceData, 'data':this.data } , 'branches/updateBranchInterStockTxransfer')
        .subscribe((result: any) => {
            this.savingData = false;

            console.log(result);
            this.router.navigate(['/branch-inter-branch-received-stock/' + this.branch_from_id ]);

            this.loading_list = false;

        },err => {console.log(err);  this.savingData = false; this.loading_list = false; this.dialog.retry().then((result) => { }); });
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
      this.branchesList=[];
    console.log( this.branchesList);

      for(var i=0;i<this.temp_cons.length; i++)
      {
        search=search.toLowerCase();
        this.tmpsearch3=this.temp_cons[i]['branch_name'].toLowerCase();
        if(this.tmpsearch3.includes(search))
        {
          this.branchesList.push(this.temp_cons[i]);
        }     
      }    
      console.log(this.branchesList);
    }
  }
  
  selected_vendor:any = {};
    
  cal(id:any=0){
    
    this.invoiceData.total_qty  = 0;
    this.invoiceData.total_amount  = 0;
    this.invoiceData.gst  = 0;
    this.invoiceData.gst_per  = this.invoiceData.gst_per ? this.invoiceData.gst_per : 0;
    this.invoiceData.net_amount  = 0;
    this.invoiceData.actual_amount  = 0;
    this.invoiceData.cgst_amount = 0;
    this.invoiceData.sgst_amount= 0;
    this.invoiceData.igst_amount= 0;
    
    for (let i = 0; i < this.invoiceItemList.length; i++) {
      
      this.invoiceItemList[i].cgst_amount  = 0;
      this.invoiceItemList[i].sgst_amount  = 0;
      this.invoiceItemList[i].igst_amount  = 0;
      this.invoiceItemList[i].gst_amount  = 0;
      
      this.invoiceItemList[i].transfer_qty = this.invoiceItemList[i].transfer_qty ? this.invoiceItemList[i].transfer_qty : 0;
      
      // this.purchase_list[i].gst  = 18;
      
      this.invoiceItemList[i].amount = this.invoiceItemList[i].transfer_qty * this.invoiceItemList[i].rental_price;
      
      this.invoiceData.total_qty += parseFloat( this.invoiceItemList[i].transfer_qty );
      this.invoiceData.total_amount += parseFloat(  this.invoiceItemList[i].amount );
      // this.data.tot_pur_amount += parseInt(  this.purchase_list[i].amount );
      
      // this.itemdetail[i].gst_amount  = parseInt(  this.itemdetail[i].deliver_rantal ) * ( parseInt( this.itemdetail[i].gst ) / 100);
      // this.data.gst  += parseInt(    this.itemdetail[i].gst_amount );
      
      console.log(this.selected_vendor.state );
      console.log(this.db.datauser.state );
      console.log( this.invoiceData.gst_per );
      
      if( this.selected_vendor.state ==  this.db.datauser.state   ){
        
        
        this.invoiceItemList[i].cgst_amount  = parseFloat(  this.invoiceItemList[i].amount ) * ( ( parseFloat( this.invoiceData.gst_per ) / 2 ) / 100);
        this.invoiceItemList[i].sgst_amount  = parseFloat(  this.invoiceItemList[i].amount ) * ( ( parseFloat( this.invoiceData.gst_per ) / 2 ) / 100);
        
      }else{
        
        this.invoiceItemList[i].igst_amount  = parseFloat(  this.invoiceItemList[i].amount ) * ( parseFloat( this.invoiceData.gst_per ) / 100);
        
      }
      
      this.invoiceItemList[i].gst_amount  += parseFloat( this.invoiceItemList[i].cgst_amount )  + parseFloat( this.invoiceItemList[i].sgst_amount ) + parseFloat( this.invoiceItemList[i].igst_amount );
      
      console.log(this.invoiceData.cgst_amount);
      console.log(this.invoiceData.sgst_amount);
      console.log(this.invoiceData.igst_amount);
      
      this.invoiceData.cgst_amount  += Math.round(  parseFloat(    this.invoiceItemList[i].cgst_amount  ));
      this.invoiceData.sgst_amount  += Math.round(  parseFloat(    this.invoiceItemList[i].sgst_amount  ));
      this.invoiceData.igst_amount  += Math.round(  parseFloat(    this.invoiceItemList[i].igst_amount  ));
      
      this.invoiceData.gst  += parseFloat( this.invoiceData.cgst_amount )  + parseFloat( this.invoiceData.sgst_amount ) + parseFloat( this.invoiceData.igst_amount );
      
      this.invoiceData.gst = Math.round( this.invoiceData.gst );
      
      this.invoiceData.net_amount +=  parseFloat( this.invoiceItemList[i].gst_amount )  +  parseFloat( this.invoiceItemList[i].amount );

      this.invoiceData.net_amount =  Math.round( this.invoiceData.net_amount );
      
      // this.data.actual_amount  = parseInt(this.data.net_amount) + parseInt(this.data.shipping_charge) ;
      
      // this.data.net_amount =  parseInt( this.data.gst )  +  parseInt( this.data.total_amount );
      
      
      
    }
    
    console.log(  this.invoiceData);
    
  }




}
