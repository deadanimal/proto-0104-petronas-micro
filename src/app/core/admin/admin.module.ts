import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AccordionModule,
  BsDropdownModule,
  ModalModule,
  ProgressbarModule,
  TabsModule,
  TooltipModule,
} from "ngx-bootstrap";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoadingBarModule } from "@ngx-loading-bar/core";

import { RouterModule } from "@angular/router";
import { AdminRoutes } from "./admin.routing";
import { QuillModule } from "ngx-quill";
import { NgxDropzoneModule } from "ngx-dropzone";
import { OrgChartModule } from "angular-org-chart";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "src/environments/environment";
import * as mapbox from "mapbox-gl";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
(mapbox as any).accessToken = environment.mapbox.accessToken;
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { AcWarningsComponent } from "./ac-warnings/ac-warnings.component";
import { McSpAndInternationalComponent } from "./mc-sp-and-international/mc-sp-and-international.component";
import { McPublicationComponent } from "./mc-publication/mc-publication.component";
import { McCommAndCorpComponent } from "./mc-comm-and-corp/mc-comm-and-corp.component";
import { AcEarthquakeNTsunamiComponent } from "./ac-earthquake-n-tsunami/ac-earthquake-n-tsunami.component";
import { PreviousBillSummaryComponent } from "./previous-bill-summary/previous-bill-summary.component";
import { McProcAndAdminComponent } from "./mc-proc-and-admin/mc-proc-and-admin.component";
import { AcSatelliteAndRadarComponent } from "./ac-satellite-and-radar/ac-satellite-and-radar.component";
import { AcClimateComponent } from "./ac-climate/ac-climate.component";
import { AcForecastsComponent } from "./ac-forecasts/ac-forecasts.component";

import { ManagementAuditComponent } from "./management-audit/management-audit.component";
import { ManagementUserComponent } from "./management-user/management-user.component";
import { ReportComponent } from "./report/report.component";
import { ManagementRolesComponent } from "./management-roles/management-roles.component";

import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { ChargersUsageComponent } from "./chargers-usage/chargers-usage.component";
import { ChargersRewardComponent } from "./chargers-reward/chargers-reward.component";
import { McEducationComponent } from "./mc-education/mc-education.component";
import { ChargersBillSummaryComponent } from "./chargers-bill-summary/chargers-bill-summary.component";
import { ChargersPaymentChannelComponent } from "./chargers-payment-channel/chargers-payment-channel.component";
import { ChargersContactUsComponent } from "./chargers-contact-us/contact-us.component";
import { ChargersBillPresentmentComponent } from "./chargers-bill-presentment/chargers-bill-presentment.component";
import { ChargersBillAnalyticalComponent } from "./chargers-bill-analytical/chargers-bill-analytical.component";
import { AcObservationComponent } from "./ac-observation/ac-observation.component";
import { ChargersServiceTaxComponent } from "./chargers-service-tax/chargers-service-tax.component";
import { AnalyticsComponent } from "./analytics/analytics.component";

@NgModule({
  declarations: [
    ManagementAuditComponent,
    ManagementUserComponent,
    ManagementRolesComponent,
    ReportComponent,
    DashboardComponent,
    AcWarningsComponent,
    McSpAndInternationalComponent,
    McPublicationComponent,
    PreviousBillSummaryComponent,
    McCommAndCorpComponent,
    AcEarthquakeNTsunamiComponent,
    AcSatelliteAndRadarComponent,
    McProcAndAdminComponent,
    AcClimateComponent,
    AcForecastsComponent,
    ChargersUsageComponent,
    ChargersRewardComponent,
    McEducationComponent,
    ChargersBillSummaryComponent,
    ChargersPaymentChannelComponent,
    ChargersContactUsComponent,
    ChargersBillPresentmentComponent,
    ChargersBillAnalyticalComponent,
    AcObservationComponent,
    ChargersServiceTaxComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    LoadingBarModule,
    NgxDatatableModule,
    RouterModule.forChild(AdminRoutes),
    QuillModule.forRoot(),
    NgxDropzoneModule,
    OrgChartModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    LeafletModule,
  ],
})
export class AdminModule {}
