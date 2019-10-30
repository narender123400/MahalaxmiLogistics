import { Component, OnInit } from '@angular/core';
import {DialogComponent} from '../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../_services/DatabaseService';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html'
})
export class AddSaleComponent implements OnInit {

    consingerList: any = [];
    consingeeList: any = [];
    consingerList2: any = [];
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
  brch_id:any='';
  id:any='';
  consigner_id:any='';
  consignee_id:any='';

  orderData: any = {};
  loading_list = false;
  franchise_id:any;
  date1:any;


    constructor(public db: DatabaseService,
                public dialog: DialogComponent,
                private route: ActivatedRoute,
                private router: Router) {

                  this.date1 = new Date();
                 }

    ngOnInit() {
        this.route.params.subscribe(params => {

            console.log(params);
            this.orderData.branch_id = params['id'] || '';

            this.getConsingersList();
              if (this.orderData.branch_id) { 
                this.getBranches(this.orderData.branch_id); 
            } else {
                this.getBranches(0);
            }


          this.orderData.total_qty = 0;
          this.orderData.type =  'Combo';
            // this.getComboList();
    });
    }

branchesList: any = [];
getBranches(branch_id) {


    this.loading_list = true;   

    this.db.get_rqst('' , 'branches/getbranches_names/' + branch_id)
    .subscribe((result: any) => {
        console.log(result);
        this.branchesList  = result.getbranches_names;            
        this.loading_list = false;
        console.log(this.branchesList);
    },err => {   this.loading_list = false; this.dialog.retry().then((result) => {  this.getBranches(branch_id);  }); });
}
temp_cons:any=[];
    getConsingersList() {

        this.loading_list = true;
      
        this.db.post_rqst({'branch_id': this.orderData.branch_id } , 'sales/getConsinger?&s='+ this.search)
        .subscribe( r => {
            console.log(r);
            this.loading_list = false;
            this.consingerList = r.consingers;
            this.consingerList2 = r.consingers;
            this.temp_cons = r.consingers;
          },err => {  this.loading_list = false; this.dialog.retry().then((result) => { this.getConsingersList(); });   });
  }



  getMaster(){
    this.data.type ==  this.orderData.type;  

    if(this.orderData.type == 'Part' ){

      this.getPartsList();
    }else{
      this.getComboList();
    }
    console.log( this.data);
    
  }



  parts :any = [];
  getPartsList()
  {
      this.loading_list = true;
  console.log( this.orderData.consigner_id  );
  
      this.db.post_rqst(  {'consigner_id' : this.orderData.consigner_id } , 'sales/getConsigneeParts?$s=' +this.search)
      .subscribe( r => {
          this.loading_list = false;
          console.log(r);
          this.parts = r.parts;
      },err => {  this.loading_list = false;  this.dialog.retry().then((result) => { this.getPartsList(); });   });
  }
  

  

getComboList()
{
    this.loading_list = true;
console.log( this.orderData.consigner_id  );

    this.db.post_rqst(  {'consigner_id' : 0} , 'sales/combo')
    .subscribe( r => {
        this.loading_list = false;
        console.log(r);
        this.parts = r.data.combo;
        console.log( this.parts  );
        
    },err => {  this.loading_list = false;  this.dialog.retry().then((result) => { this.getPartsList(); });   });
}



  



keyword = 'part_number';


selectEvent(item) {
  this.data.part_number = item.part_number;
  console.log(   this.data.part_number );
  
  if(this.data.part_number){
    this.partDetail();
  }
  
}


// combo_keyword = 'combo_name';

// selectComboEvent(item) {
//   this.data.combo_name = item.combo_name;
//   console.log(   this.data.combo_name );
  
//   if(this.data.combo_name){
//     this.partDetail();
//   }
  
// }


onChangeSearch(val: string) {
  
}

onFocused(e){
}

setConsigner(){
    console.log(this.orderData.consigner_id);
    
    if( this.orderData.consigner_id ){
        
        // console.log( this.consingerList.indexOf( this.orderData.consigner_id));
        // ruits.findIndex(fruit => fruit === "blueberries");
        this.consingerList.splice( this.consingerList.findIndex(d => d.id === this.orderData.consigner_id), 1 );
    }
}

agreement_consignee : any = [];
addConsignee(event,id){
console.log(event);

if(event.checked)
this.agreement_consignee.push(id);
else
this.agreement_consignee.splice( this.agreement_consignee.indexOf( id), 1 );
console.log(this.agreement_consignee);

}


partDetail(){
  console.log(this.data.part_number );
  this.data.type = ''; 
  this.data = Object.assign({}, this.parts.filter(x => x.part_number === this.data.part_number )[0] ); 
console.log(  this.data );
this.data.qty = 1;
this.data.rental_price = 0;
this.data.rental_price = this.data.rental_price;
this.data.amount = this.data.rental_price *  this.data.qty;
this.data.type ==  this.orderData.type;  
console.log(  this.orderData.type );

  console.log( this.data );
  
}



comboDetail(){
  console.log(this.data.combo_name );
  
  this.data = Object.assign({}, this.parts.filter(x => x.combo_name === this.data.combo_name )[0] ); 
console.log(  this.data );
this.data.qty = 1;
this.data.rental_price = this.data.price;
this.data.amount = this.data.rental_price *  this.data.qty;

  
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
        this.loading_list = true;
     

       console.log( this.data.type);
       
        if(this.orderItemList.length == 0)
        {
            this.orderItemList.push(this.data);
        }
        else
        {
            for(let i=0;i<this.orderItemList.length;i++)
            {
                if(this.orderData.type == this.orderItemList[i].type  && this.data.part_number == this.orderItemList[i].part_number )
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

      s.resetForm();
      this.loading_list = false;

      console.log(  this.orderItemList);
      console.log(  this.orderData);

    }


    RemoveItem(index)
    {
        console.log(index);
        this.dialog.delete('Item Data !').then((result) => {
            console.log(result);
            if(result){
               this.orderItemList.splice(index,1);

            //    this.calculateNetOrderTotal();
               this.dialog.success('Item has been deleted.');
            }
        });
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



if( !this.orderData.branch_id )
{
    this.dialog.warning('Please select one branch');
    return;
}

if( this.agreement_consignee.length == 0 )
{
    this.dialog.warning('Please select at least one consignee!');
    return;
}

if(!this.orderData.start_date || !this.orderData.end_date )
{
    this.dialog.warning('Start date and End date are Mandetory');
    return;
}      

if( !this.orderData.payment_term )
{
    this.dialog.warning('Please select one Payment Term!');
    return;
}

if( !this.orderData.payment_from )
{
    this.dialog.warning('Please select one Payment From!');
    return;
}



        this.loading_list = true;
        this.savingData = true;
        console.log(this.orderData);
        console.log(this.orderItemList);

        this.orderData.itemList = this.orderItemList;
        this.orderData.created_by = this.db.datauser.id;
        this.orderData.title = this.orderData.title ? this.orderData.title : '';
        this.orderData.p_o_n = this.orderData.p_o_n ? this.orderData.p_o_n : '';


        // this.orderData.date_created =  this.orderData.date_created ? this.db.pickerFormat(this.orderData.date_created) :'';
        this.orderData.start_date =  this.orderData.start_date ? this.db.pickerFormat(this.orderData.start_date) :'';
        this.orderData.end_date   = this.orderData.end_date ? this.db.pickerFormat(this.orderData.end_date) : '';

        console.log(this.orderData);
        this.orderData.agreement_consignee = this.agreement_consignee;

        this.db.insert_rqst( this.orderData , 'sales/saveOrder')
        .subscribe((result: any) => {
            this.savingData = false;
            this.loading_list = false;
              console.log(result);
            this.router.navigate(['/sale-order-list']);
            this.dialog.success( 'Aggrement Created Successfully!');
            
        },err => {   this.loading_list = false; this.savingData = false; this.dialog.retry().then((result) => {    });
    });      


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


// active:any={};

toggleterritory2(key,action)
{
  console.log(action);
  console.log(key);
  
  if(action == 'open')
  { this.active.user2 = true; }
  if(action == 'close')
  { this.active.user2 = false;}

  console.log(this.active);


}




search2:any={};
tmpsearch3:any={};
getItemscheckin(con,search)
{
  console.log(search);
  if(con=='con2'){
    this.consingerList=[];
    for(var i=0;i<this.temp_cons.length; i++)
    {
      search=search.toLowerCase();
      this.tmpsearch3=this.temp_cons[i]['name'].toLowerCase();
      if(this.tmpsearch3.includes(search))
      {
        this.consingerList.push(this.temp_cons[i]);
      }     
    }    
    console.log(this.consingerList);
  }
  if(con=='con1'){
    this.consingerList2=[];
    for(var i=0;i<this.temp_cons.length; i++)
    {
      search=search.toLowerCase();
      this.tmpsearch3=this.temp_cons[i]['name'].toLowerCase();
      if(this.tmpsearch3.includes(search))
      {
        this.consingerList2.push(this.temp_cons[i]);
      }     
    }    
    console.log(this.consingerList2);
  }
 
  
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
