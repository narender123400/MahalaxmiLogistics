import { BrowserModule } from '@angular/platform-browser';

import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { DialogComponent } from './dialog/dialog.component';
import { ConvertArray } from './_Pipes/ConvertArray.pipe';
import { StrReplace } from './_Pipes/StrReplace.pipe';
import { Crypto } from './_Pipes/Crypto.pipe';
import { DatePikerFormat } from './_Pipes/DatePikerFormat.pipe';

import { ChartsModule } from 'ng2-charts';
// import { PushNotificationService } from 'ngx-push-notifications';
import { PushNotificationsModule } from 'ng-push'; //import the module

import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { AuthGuard } from './_guards/AuthGuard';
import { AuthGuardLog } from './_guards/AuthGuardLog';
import { DatabaseService } from './_services/DatabaseService';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FooterComponent} from './footer/footer.component';
import {MasterAddTabsComponent} from './master/master-add-tabs/master-add-tabs.component';
import {ProductListComponent} from './product/product-list/product-list.component';
import {MasterListingTabsComponent} from './master/master-listing-tabs/master-listing-tabs.component';
import {EditProductComponent} from './product/edit-product/edit-product.component';
import {PurchaseOrderListComponent} from './purchase/purchase-order-list/purchase-order-list.component';
import {AddPurchaseComponent} from './purchase/add-purchase/add-purchase.component';
import {PurchaseDetailComponent} from './purchase/purchase-detail/purchase-detail.component';
import {ReceivedPurchaseOrderComponent} from './purchase/received-purchase-order/received-purchase-order.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { AddVendorComponent } from './vendor/add-vendor/add-vendor.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { FranchiseCustomerLeftTabsComponent } from './master/franchise-customer-left-tabs/franchise-customer-left-tabs.component';
import { SaleOrderListComponent } from './sale-order/sale-order-list/sale-order-list.component';
import { SaleOrderDetailComponent } from './sale-order/sale-order-detail/sale-order-detail.component';
import { AddSaleComponent } from './sale-order/add-sale/add-sale.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersAddComponent } from './users/users-add/users-add.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { FranchiseHeaderTabComponent } from './master/franchise-header-tab/franchise-header-tab.component';
import { StockListAdComponent } from './stock/stock-list-ad/stock-list-ad.component';
import { MaterialIncomingComponent } from './stock/material-incoming/material-incoming.component';
import { FinishMaterialComponent } from './stock/finish-material/finish-material.component';
import { FinishMaterialDetailComponent } from './stock/finish-material-detail/finish-material-detail.component';
import { StockTabComponent } from './master/stock-tab/stock-tab.component';
import { StockListTabComponent } from './master/stock-list-tab/stock-list-tab.component';
import { MaterialOutgoingComponent } from './stock/material-outgoing/material-outgoing.component';
import { InvoiceComponent } from './report/invoice/invoice.component';
import { SalesOrderComponent } from './report/sales-order/sales-order.component';
import { ReportTabComponent } from './master/report-tab/report-tab.component';
import { ItemOutgoingComponent } from './stock/item-outgoing/item-outgoing.component';
import { ItemTabComponent } from './master/item-tab/item-tab.component';
import { FinishTabComponent } from './master/finish-tab/finish-tab.component';
import { FinishOutgoingComponent } from './stock/finish-outgoing/finish-outgoing.component';
import { NumericWords } from './_Pipes/NumericWords.pipe';
import { ManualIncomeComponent } from './stock/manual-income/manual-income.component';
import { FinishManualIncomeComponent } from './stock/finish-manual-income/finish-manual-income.component';
import { TransferStockComponent } from './invoice/transfer-stock/transfer-stock.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockTransferDetailComponent } from './stock-transfer/stock-transfer-detail/stock-transfer-detail.component';
import { TransferOutgoingComponent } from './stock/transfer-outgoing/transfer-outgoing.component';
import { ConsignerListComponent } from './consigners/consigner-list/consigner-list.component';
import { ConsignerAddComponent } from './consigners/consigner-add/consigner-add.component';
import { ConsignerDetailComponent } from './consigners/consigner-detail/consigner-detail.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { BranchAddComponent } from './branch/branch-add/branch-add.component';
import { BranchDetailComponent } from './branch/branch-detail/branch-detail.component';
import { BranchLeftTabComponent } from './branch/branch-left-tab/branch-left-tab.component';
import { ConsigneeListComponent } from './consignee/consignee-list/consignee-list.component';
import { ConsigneeDetailComponent } from './consignee/consignee-detail/consignee-detail.component';
import { ConsigneeAddComponent } from './consignee/consignee-add/consignee-add.component';
import { ConsigneeLeftTabComponent } from './consignee/consignee-left-tab/consignee-left-tab.component';
import { ConsignerLeftTabComponent } from './consigners/consigner-left-tab/consigner-left-tab.component';
import { BranchConsignerListComponent } from './branch/branch-consigner-list/branch-consigner-list.component';
import { ConsignerConsigneeListComponent } from './consigners/consigner-consignee-list/consigner-consignee-list.component';
import { ComboComponent } from './combo/combo-list/combo.component';
import { ComboAddComponent } from './combo/combo-add/combo-add.component';
import { ComboEditComponent } from './combo/combo-edit/combo-edit.component';
import { BranchStockComponent } from './branch/branch-stock/branch-stock.component';
import { ConsignerStockComponent } from './consigners/consigner-stock/consigner-stock.component';
import { BranchStockHeaderTabComponent } from './branch/branch-stock/branch-stock-header-tab/branch-stock-header-tab.component';
import { ConsignerSalesOrderComponent } from './consigners/consigner-sales-order/consigner-sales-order.component';
import { BranchConsigneeListComponent } from './branch/branch-consignee-list/branch-consignee-list.component';
import { SaleOrderDeliverComponent } from './sale-order/sale-order-deliver/sale-order-deliver.component';
import { ConsigneeSaleOrderComponent } from './consignee/consignee-sale-order/consignee-sale-order.component';
import { BranchSalesOrderComponent } from './branch/branch-sales-order/branch-sales-order.component';
import { StockModalComponent } from './stock/stock-modal/stock-modal.component';
import { BranchStockModelComponent } from './branch/branch-stock-model/branch-stock-model.component';
import { ConsignerStockModelComponent } from './consigners/consigner-stock-model/consigner-stock-model.component';
import { ConsignerChallanComponent } from './consigners/consigner-challan/consigner-challan.component';
import { BranchChallanComponent } from './branch/branch-challan/branch-challan.component';
import { ConsigneeChallanComponent } from './consignee/consignee-challan/consignee-challan.component';
import { BranchTransactionComponent } from './branch/branch-transaction/branch-transaction.component';
import { ConsignerTransactionComponent } from './consigners/consigner-transaction/consigner-transaction.component';
import { ConsigneeStockComponent } from './consignee/consignee-stock/consignee-stock.component';
import { ConsigneeTransactionComponent } from './consignee/consignee-transaction/consignee-transaction.component';
import { InTransitListComponent } from './consigners/in-transit/in-transit-list/in-transit-list.component';
import { ConsignerIntransitComponent } from './consigners/in-transit/consigner-intransit/consigner-intransit.component';
import { BranchReceivedStockComponent } from './branch/branch-received-stock/branch-received-stock.component';
import { InTransitDetailComponent } from './consigners/in-transit/in-transit-detail/in-transit-detail.component';
import { ConsigneeIntransitListComponent } from './consignee/consignee-intransit/consignee-intransit-list/consignee-intransit-list.component';
import { BranchPickupModelComponent } from './branch/branch-pickup-model/branch-pickup-model.component';
import { BranchPickupComponent } from './branch/branch-pickup/branch-pickup.component';
import { BranchPickupHeaderTabComponent } from './branch/branch-pickup/branch-pickup-header-tab/branch-pickup-header-tab.component';
import { BranchPickupHistoryComponent } from './branch/branch-pickup-history/branch-pickup-history.component';
import { BranchPickupHistoryDetailComponent } from './branch/branch-pickup-history-detail/branch-pickup-history-detail.component';
import { ConsigneeStockModelComponent } from './consignee/consignee-stock-model/consignee-stock-model.component';
import { FranchiseLeftTabsComponent } from './master/franchise-left-tabs/franchise-left-tabs.component';
import { ConsignorHeaderTabComponent } from './master/consignor-header-tab/consignor-header-tab.component';
import { BranchMaintenanceComponent } from './branch/branch-maintenance/branch-maintenance.component';
import { BranchScrapComponent } from './branch/branch-scrap/branch-scrap.component';
import { BranchManageStockComponent } from './branch/branch-manage-stock/branch-manage-stock.component';
import { ManageStockAddComponent } from './branch/branch-manage-stock/manage-stock-add/manage-stock-add.component';
import { ManageStockDetailComponent } from './branch/branch-manage-stock/manage-stock-detail/manage-stock-detail.component';
import { MaintenanceStockComponent } from './stock/maintenance-stock/maintenance-stock.component';
import { ScrapStockComponent } from './stock/scrap-stock/scrap-stock.component';
import { ManageStockComponent } from './stock/manage-stock/manage-stock.component';
import { StockManageStockAddComponent } from './stock/manage-stock/stock-manage-stock-add/stock-manage-stock-add.component';
import { BranchInterBranchAddComponent } from './branch/branch-inter-branch/branch-inter-branch-add/branch-inter-branch-add.component';
import { BranchInterBranchDetailComponent } from './branch/branch-inter-branch/branch-inter-branch-detail/branch-inter-branch-detail.component';
import { BranchInterBranchReceivedStockComponent } from './branch/branch-inter-branch/branch-inter-branch-received-stock/branch-inter-branch-received-stock.component';
import { BranchAggrementChallanComponent } from './branch/branch-aggrement-challan/branch-aggrement-challan.component';
import { ConsignerAggrementChallanComponent } from './consigners/consigner-aggrement-challan/consigner-aggrement-challan.component';
import { ConsignerAggrementChallanDetailComponent } from './consigners/consigner-aggrement-challan-detail/consigner-aggrement-challan-detail.component';
import { HeaderTabComponent } from './consigners/consigner-stock/header-tab/header-tab.component';
import { ConsignerConsigneeStockComponent } from './consigners/consigner-consignee-stock/consigner-consignee-stock.component';
import { ConsignerConsigneeStockModelComponent } from './consigners/consigner-consignee-stock-model/consigner-consignee-stock-model.component';
import { SaleChallanComponent } from './sale-order/sale-challan/sale-challan.component';
import { BranchChallanInvoiceComponent } from './branch/branch-challan-invoice/branch-challan-invoice.component';
import { ReceivedPurchaseOrderDetailComponent } from './purchase/received-purchase-order-detail/received-purchase-order-detail.component';
import { SaleInvoiceDetailComponent } from './sale-order/sale-invoice-detail/sale-invoice-detail.component';
import { ConsignerPickupModelComponent } from './consigners/consigner-pickup-model/consigner-pickup-model.component';
import { ChallanListComponent } from './sale-order/challan-list/challan-list.component';
import { SaleInvoiceListComponent } from './sale-order/sale-invoice-list/sale-invoice-list.component';
import { BranchMaintenanceTransactionComponent } from './branch/branch-maintenance-transaction/branch-maintenance-transaction.component';
import { BranchIntransitModelComponent } from './branch/branch-intransit-model/branch-intransit-model.component';
import { EditChallanComponent } from './sale-order/sale-challan/edit-challan/edit-challan.component';
import { SaleOrderEditComponent } from './sale-order/sale-order-edit/sale-order-edit.component';
import { PurchaseEditComponent } from './purchase/purchase-edit/purchase-edit.component';
import { TransferStockEditComponent } from './invoice/transfer-stock-edit/transfer-stock-edit.component';
import { BranchInterBranchEditComponent } from './branch/branch-inter-branch/branch-inter-branch-edit/branch-inter-branch-edit.component';


const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuardLog] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,2] } },
  { path: 'part-list', component: ProductListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'part-add', component: AddProductComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] }},
  { path: 'part-edit/:id', component: EditProductComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] } },
  { path: 'combo-list', component: ComboComponent, canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'combo-add', component: ComboAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'combo-edit/:id', component: ComboEditComponent, canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'purchases', component: PurchaseOrderListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] } },
  { path: 'purchases/add', component: AddPurchaseComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] } },
  { path: 'purchases/:id/details', component: PurchaseDetailComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] } },
  { path: 'purchases/:id/receive', component: ReceivedPurchaseOrderComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] } }, 
  { path: 'received-purchase-ord-detail/:id', component: ReceivedPurchaseOrderDetailComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] } },
  { path: 'vendors/add', component: AddVendorComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'vendors', component: VendorListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'vendors/vendor-detail/:id', component:  VendorDetailComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'sale-order-list', component:  SaleOrderListComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] }  },
  { path: 'sale-order-detail/:id', component:  SaleOrderDetailComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] }  },
  { path: 'sale-add', component:  AddSaleComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'sale-add/:id', component:  AddSaleComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'sale-invoice-list', component:  SaleInvoiceListComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] }  },
  { path: 'sale-challan-list', component:  ChallanListComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] }  },
  { path: 'sale-order-deliver/:id', component:  SaleOrderDeliverComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'sale-challan/:id', component:  SaleChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'sale-challan/:id/:branch_id', component:  SaleChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'edit-challan/:id', component:  EditChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'edit-challan/:id/:branch_id', component:  EditChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'sale-challan-invoice', component:  BranchChallanInvoiceComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'transfer-stock/:id/:orderId', component:  TransferStockComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] }  },
  { path: 'transfer-stock', component:  TransferStockComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,2,4] }  },
  { path: 'users-list', component:  UsersListComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] }  },
  { path: 'users-add', component:  UsersAddComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] }  },
  { path: 'users-edit/:id', component:  UsersEditComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] }  },
  { path: 'stock-list-ad', component: StockListAdComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'material-incoming/:id/:unit_id', component: MaterialIncomingComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'fresh-stock', component: FinishMaterialComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'maintenance-stock', component: MaintenanceStockComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'scrap-stock', component: ScrapStockComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'finish-outgoing/:id/:unit_id', component: FinishOutgoingComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,4] } },
  { path: 'finish-material-detail/:id', component: FinishMaterialDetailComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'material-outgoing/:id/:unit_id', component: MaterialOutgoingComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'transfer-outgoing/:id/:unit_id', component: TransferOutgoingComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'item-outgoing/:id/:unit_id', component: ItemOutgoingComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,4] } },
  { path: 'manual-income/:id/:unit_id', component: ManualIncomeComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'finish-manual-income/:id/:unit_id', component: FinishManualIncomeComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,4] }  },
  { path: 'report/order', component:  SalesOrderComponent , canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'report/invoice', component:  InvoiceComponent , canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'transfer-stock-list', component: StockTransferComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1] } },
  { path: 'manage-stock-list', component: ManageStockComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1] } },
  { path: 'manage-stock-add', component: StockManageStockAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'manage-stock-add/:maintenance', component: StockManageStockAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'transfer-stock-detail/:id', component: StockTransferDetailComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1] } },
  { path: 'consigner-list', component: ConsignerListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,3] } },
  { path: 'consigner-add', component: ConsignerAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'consigner-add/:franchise_id', component: ConsignerAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'consigner-detail/:franchise_id', component: ConsignerDetailComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consigner-consignee/:franchise_id', component: ConsignerConsigneeListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consigner-stock/:franchise_id', component: ConsignerStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consigner-sales-order/:franchise_id', component: ConsignerSalesOrderComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consigner-transaction/:id/:type/:franchise_id', component: ConsignerTransactionComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'in-transit-add/:franchise_id', component: ConsignerIntransitComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'in-transit-list/:franchise_id', component: InTransitListComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'in-transit-detail/:id', component: InTransitDetailComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'branch-list', component: BranchListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,3] } },
  { path: 'branch-add', component: BranchAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1] } },
  { path: 'branch-add/:franchise_id', component: BranchAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-detail/:franchise_id', component: BranchDetailComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,3] } },
  { path: 'branch-consigner/:franchise_id', component: BranchConsignerListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,3] } },
  { path: 'branch-stock/:franchise_id', component: BranchStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-consignee/:franchise_id', component: BranchConsigneeListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,3] } },
  { path: 'branch-sales-order/:franchise_id', component: BranchSalesOrderComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,3] } },
  { path: 'branch-transaction/:franchise_id/:id', component: BranchTransactionComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,3] } },
  { path: 'branch-received-stock/:franchise_id', component: BranchReceivedStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-pickup/:franchise_id', component: BranchPickupComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-pickup-history/:franchise_id', component: BranchPickupHistoryComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-pickup-history-detail/:id', component:  BranchPickupHistoryDetailComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'branch-maintenance/:franchise_id', component: BranchMaintenanceComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-scrap/:franchise_id', component: BranchScrapComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-manage-stock/:franchise_id', component: BranchManageStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-manage-stock-add/:franchise_id', component: ManageStockAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-manage-stock-add/:franchise_id/:maintenance', component: ManageStockAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-manage-stock-detail/:id', component:  ManageStockDetailComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5] }  },
  { path: 'branch-inter-branch-add/:franchise_id', component: BranchInterBranchAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-inter-branch-detail/:id', component: BranchInterBranchDetailComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1] } },
  { path: 'branch-inter-branch-received-stock/:franchise_id', component: BranchInterBranchReceivedStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-aggrement-challan/:franchise_id', component: BranchAggrementChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'branch-maintenance-transaction/:franchise_id/:id', component: BranchMaintenanceTransactionComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,3] } },
  { path: 'consigner-aggrement-challan/:franchise_id', component: ConsignerAggrementChallanComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'consigner-aggr-challan-detail/:id', component:  ConsignerAggrementChallanDetailComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] }  },
  { path: 'consigner-consignee-stock/:franchise_id', component: ConsignerConsigneeStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'sale-invoice-detail/:id', component:  SaleInvoiceDetailComponent , canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] }  },
  { path: 'consignee-list', component: ConsigneeListComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,3] } },
  { path: 'consignee-add', component: ConsigneeAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consignee-add/:franchise_id', component: ConsigneeAddComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consignee-detail/:franchise_id', component: ConsigneeDetailComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consignee-sales-order/:franchise_id', component: ConsigneeSaleOrderComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consignee-stock/:franchise_id', component: ConsigneeStockComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'consignee-transaction/:id/:franchise_id', component: ConsigneeTransactionComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'consignee-intransit-list/:franchise_id', component: ConsigneeIntransitListComponent, canActivate: [AuthGuard]  , data: { expectedRole: [1,5,8] } },
  { path: 'consigner-challan/:franchise_id', component: ConsignerChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5,8] } },
  { path: 'branch-challan/:franchise_id', component: BranchChallanComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'sale-order-edit/:id', component: SaleOrderEditComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'purchase-edit/:id', component: PurchaseEditComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'c-to-b-transfer-stock-edit/:c_to_b_id', component: TransferStockEditComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },
  { path: 'b-to-b-edit/:b_to_b_id/:b_id', component: BranchInterBranchEditComponent, canActivate: [AuthGuard] , data: { expectedRole: [1,5] } },

  
  { path: '**', redirectTo: ''},
  
  
  
];


@NgModule({
  declarations: [
    SaleInvoiceDetailComponent,
    BranchChallanInvoiceComponent,
    ReceivedPurchaseOrderDetailComponent,
    SaleInvoiceListComponent,
    ChallanListComponent,
    SaleChallanComponent,
    ConsignerAggrementChallanComponent,
    ConsignerAggrementChallanDetailComponent,
    HeaderTabComponent,
    ConsignerConsigneeStockComponent,
    SaleOrderEditComponent,
    ConsigneeStockModelComponent,
    BranchPickupModelComponent,
    BranchPickupComponent,
    BranchReceivedStockComponent,
    ConsignerIntransitComponent,
    ConsigneeTransactionComponent,
    ConsigneeStockComponent,
    ConsignerTransactionComponent,
    AppComponent,
    LoginComponent,
    HeaderComponent,
    AddProductComponent,
    DialogComponent,
    DashboardComponent,
    FooterComponent,
    MasterAddTabsComponent,
    AddProductComponent,
    ProductListComponent,
    EditProductComponent,
    MasterListingTabsComponent,
    FranchiseLeftTabsComponent,
    PurchaseOrderListComponent,
    PurchaseDetailComponent,
    AddPurchaseComponent,
    ReceivedPurchaseOrderComponent,
    VendorDetailComponent,        
    AddVendorComponent,
    VendorListComponent,
    FranchiseCustomerLeftTabsComponent,
    SaleOrderListComponent,
    SaleOrderDetailComponent,
    AddSaleComponent,
    ConvertArray,
    NumericWords,
    UsersListComponent,
    UsersAddComponent,
    UsersEditComponent,
    FranchiseHeaderTabComponent,
    StockListAdComponent,
    MaterialIncomingComponent,
    FinishMaterialComponent,
    FinishMaterialDetailComponent,
    StockTabComponent,
    StockListTabComponent,
    MaterialOutgoingComponent,
    StrReplace,
    Crypto,
    DatePikerFormat,
    ReportTabComponent,
    SalesOrderComponent ,    
    InvoiceComponent ,       
    ItemOutgoingComponent,
    ItemTabComponent,
    FinishTabComponent,
    FinishOutgoingComponent,
    ManualIncomeComponent,
    FinishManualIncomeComponent,
    TransferStockComponent,
    StockTransferComponent,
    StockTransferDetailComponent,
    TransferOutgoingComponent,
    ConsignerListComponent,
    ConsignerAddComponent,
    ConsignerDetailComponent,
    BranchListComponent,
    BranchAddComponent,
    BranchDetailComponent,
    BranchLeftTabComponent,
    ConsigneeAddComponent,
    ConsigneeDetailComponent,
    ConsigneeListComponent,
    ConsigneeLeftTabComponent,
    ConsignerLeftTabComponent,
    BranchConsignerListComponent,
    ConsignerConsigneeListComponent,
    ComboComponent,
    ComboAddComponent,
    ComboEditComponent,
    BranchStockComponent,
    ConsignerStockComponent,
    BranchStockHeaderTabComponent,
    ConsignerSalesOrderComponent,
    BranchConsigneeListComponent,
    SaleOrderDeliverComponent,
    BranchSalesOrderComponent,
    ConsigneeSaleOrderComponent,
    StockModalComponent,
    BranchStockModelComponent,
    ConsignerStockModelComponent,
    ConsignerChallanComponent,
    BranchChallanComponent,
    ConsigneeChallanComponent,
    BranchTransactionComponent,
    ConsignerIntransitComponent,
    InTransitListComponent,
    InTransitDetailComponent,
    ConsigneeIntransitListComponent,
    BranchPickupHeaderTabComponent,
    BranchPickupHistoryComponent,
    BranchPickupHistoryDetailComponent,
    ConsignorHeaderTabComponent,
    BranchMaintenanceComponent,
    BranchScrapComponent,
    BranchManageStockComponent,
    ManageStockAddComponent,
    ManageStockDetailComponent,
    MaintenanceStockComponent,
    ScrapStockComponent,
    ManageStockComponent,
    StockManageStockAddComponent,
    BranchInterBranchAddComponent,
    BranchInterBranchDetailComponent,
    BranchInterBranchReceivedStockComponent,
    BranchAggrementChallanComponent,
    ConsignerConsigneeStockModelComponent,
    BranchChallanInvoiceComponent,
    ConsignerPickupModelComponent,
    BranchMaintenanceTransactionComponent,
    BranchIntransitModelComponent,
    EditChallanComponent,
    PurchaseEditComponent,
    TransferStockEditComponent,
    BranchInterBranchEditComponent,
  ],
  

  
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AutocompleteLibModule,
    PushNotificationsModule,
    NgxEditorModule,
    AngularFontAwesomeModule,
    BsDatepickerModule
  ],
  providers: [
    AuthGuard,
    AuthGuardLog,
    DatabaseService
  ],
  entryComponents: [
    ConsigneeStockModelComponent,
    StockModalComponent,
    BranchStockModelComponent,
    ConsignerStockModelComponent,
    BranchPickupModelComponent,
    ConsignerConsigneeStockModelComponent,
    ConsignerPickupModelComponent,
    BranchIntransitModelComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
