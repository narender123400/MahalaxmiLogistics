import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';

export class Brand {
  constructor(public name: string) { }
}
export class Product {
  constructor(public name: string) { }
}
export class Measurement {
  constructor(public name: string) { }
}
export class AttrType {
  constructor(public name: string) { }
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
})
export class AddProductComponent implements OnInit {
  form: any = {};
  data: any = [];
  
  
  unitData: any = [];
  attrData: any = [];
  formData: any = {};
  nexturl: any;
  temp: any;
  sendingData = false;
  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent) {
    }
    ngOnInit() {
    }
    
    
    
    
    
    
    
    saveProduct() {
      
      this.sendingData = true;
      
      this.db.insert_rqst( {'data':this.form } , 'products/save')
      .subscribe(d => {
        console.log( d );
        this.sendingData = false;
        
        if (d == 'Exist') {
          this.dialog.warning( 'Part Number Already Exist!');
          return
        }

        if (d == 'Combo-Exist') {
          this.dialog.warning( 'this Part Number Already Exist in Combo !');
          return
        }

        this.router.navigate(['/part-list']);
        this.dialog.success( 'Part added Successfully!');
        
        
      }, error => {
        this.sendingData = false;
        this.dialog.retry().then((result) => { this.saveProduct(); });
      });
      
    }
  }
  