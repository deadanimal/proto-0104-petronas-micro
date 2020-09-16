import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";

import { AcWarningsComponent } from "./ac-warnings/ac-warnings.component";
import { McSpAndInternationalComponent } from "./mc-sp-and-international/mc-sp-and-international.component";
import { McPublicationComponent } from "./mc-publication/mc-publication.component";
import { McCommAndCorpComponent } from "./mc-comm-and-corp/mc-comm-and-corp.component";
import { AcEarthquakeNTsunamiComponent } from "./ac-earthquake-n-tsunami/ac-earthquake-n-tsunami.component";
import { McProcAndAdminComponent } from "./mc-proc-and-admin/mc-proc-and-admin.component";
import { PreviousBillSummaryComponent } from "./previous-bill-summary/previous-bill-summary.component";
import { AcSatelliteAndRadarComponent } from "./ac-satellite-and-radar/ac-satellite-and-radar.component";
import { AcClimateComponent } from "./ac-climate/ac-climate.component";
import { AcForecastsComponent } from "./ac-forecasts/ac-forecasts.component";

import { ManagementAuditComponent } from "./management-audit/management-audit.component";
import { ManagementUserComponent } from "./management-user/management-user.component";
import { ReportComponent } from "./report/report.component";
import { ManagementRolesComponent } from "./management-roles/management-roles.component";
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

export const AdminRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "weapon",
        children: [
          {
            path: "warnings",
            component: AcWarningsComponent,
          },
          {
            path: "forecasts",
            component: AcForecastsComponent,
          },
          {
            path: "climate",
            component: AcClimateComponent,
          },
          {
            path: "observation",
            component: AcObservationComponent,
          },
        ],
      },
      {
        path: "academy",
        children: [
          {
            path: "education",
            component: McEducationComponent,
          },
          {
            path: "communication-and-corporate",
            component: McCommAndCorpComponent,
          },
        ],
      },
      {
        path: "analytics",
        component: AnalyticsComponent,
      },
      {
        path: "earthquake-and-tsunami",
        component: AcEarthquakeNTsunamiComponent,
      },
      //   ],
      // },
      {
        path: "previous-bill-summary",
        component: PreviousBillSummaryComponent,
      },
      // {
      //   path: "manual-content",
      //   children: [
      {
        path: "strategic-planning-and-international",
        component: McSpAndInternationalComponent,
      },
      {
        path: "procurement-and-administration",
        component: McProcAndAdminComponent,
      },
      {
        path: "publication",
        component: McPublicationComponent,
      },
      {
        path: "education",
        component: McEducationComponent,
      },
      //   ],
      // },
      // {
      //   path: "charges",
      //   children: [
      {
        path: "service-tax",
        component: ChargersServiceTaxComponent,
      },
      {
        path: "reward",
        component: ChargersRewardComponent,
      },
      {
        path: "announcement",
        component: McEducationComponent,
      },
      {
        path: "bill-summary",
        component: ChargersBillSummaryComponent,
      },
      {
        path: "payment-channel",
        component: ChargersPaymentChannelComponent,
      },
      {
        path: "contact-us",
        component: ChargersContactUsComponent,
      },
      {
        path: "bill-presentment",
        component: ChargersBillPresentmentComponent,
      },
      {
        path: "bill-analytical",
        component: ChargersBillAnalyticalComponent,
      },
      //   ],
      // },
      {
        path: "report",
        component: ReportComponent,
      },
      {
        path: "management",
        children: [
          {
            path: "users",
            component: ManagementUserComponent,
          },
          {
            path: "roles",
            component: ManagementRolesComponent,
          },
          {
            path: "audit-trails",
            component: ManagementAuditComponent,
          },
        ],
      },
    ],
  },
];
