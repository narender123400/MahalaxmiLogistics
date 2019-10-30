import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import {map, startWith} from 'rxjs/operators';
import {AttrType, Brand, Measurement, Product} from '../add-product/add-product.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html'
  // styleUrls: ['./edit-product.component.scss']
})

export class EditProductComponent implements OnInit {
  form: any = {};
  data: any = [];
  
  measurementTypes:any = [];
  myControl: FormControl;
  filteredBrands: Observable<any[]>;
  brands: Brand[] = [];
  products: Product[] = [];
  filteredProducts: Observable<any[]>;
  measurements: Measurement[] = [];
  filteredMeasurements: Observable<any[]>;
  attrTypes: AttrType[] = [];
  filteredAttrTypes: Observable<any[]>;
  unitData: any = [];
  attrData: any = [];
  newUnitData: any = [];
  newAttrData: any = [];
  formData: any = {};
  nexturl: any;
  temp: any;
  product_id: any;
  sendingData = false;
  loading_data = true;
  constructor(public db: DatabaseService, private router: Router,
    public dialog: DialogComponent, private route: ActivatedRoute) {
    }
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.product_id = params['id'];
        
        if (this.product_id) { this.productData(); }
      });
    }
    productData() {
      this.loading_data = false;
      
      this.db.get_rqst( '', 'products/' + this.product_id + '/edit')
      .subscribe(data => {
        console.log(data);
        
        this.loading_data = true;
        this.form = data.product;
      }, error => {
        this.loading_data = true;
        
        this.dialog.retry().then((result) => {
          this.productData();
        });
        
      });
    }
    
    
    updateProduct() {
      
      this.sendingData = true;
      
      this.db.insert_rqst( {'data':this.form } , 'products/update')
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
        this.dialog.success( 'Part Updated Successfully!');
        
        
      }, error => {
        this.sendingData = false;
        this.dialog.retry().then((result) => { this.updateProduct(); });
      });
      
    }
    
    
    
  }
  