import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  TemplateRef,
} from "@angular/core";
import { Audit } from "src/assets/mock/admin-audit/audit.model";
import { MocksService } from "src/app/shared/services/mocks/mocks.service";
// import { AuditData } from 'src/assets/mock/admin-audit/audit.data.json'
import * as moment from "moment";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

//
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import swal from "sweetalert2";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { NotifyService } from "src/app/shared/handler/notify/notify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { tileLayer, latLng, marker, icon } from "leaflet";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import "leaflet/dist/images/marker-shadow.png";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-ac-forecasts",
  templateUrl: "./ac-forecasts.component.html",
  styleUrls: ["./ac-forecasts.component.scss"],
})
export class AcForecastsComponent implements OnInit, OnDestroy {
  // Chart
  chart: any;

  // Datepicker
  bsDPConfig = {
    isAnimated: true,
    containerClass: "theme-default",
  };

  // Modal
  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered",
  };

  // Table
  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  tableRows: Audit[] = [];
  SelectionType = SelectionType;
  listPenguatkuasa: any = [
    {
      type: "Mesra",
      address: "353, Jln Cheras, Taman Pertama, 55300 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    },
    {
      type: "Mesra",
      address: "Taman Segar, 56100 Cheras, Wilayah Persekutuan",
    },
    {
      type: "KFC",
      address: "90, Jalan Peel, Maluri, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    },
    {
      type: "Mesra",
      address: "Level 47, Tower 1, PETRONAS Twin Tower, Kuala Lumpur City Centre, Kuala Lumpur, 50088, Kuala Lumpur, WP Kuala Lumpur",
    },
    {
      type: "Tealive",
      address: "Level 3, No.6, Jalan Cochrane, Seksyen 90, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    },
  ];
  options = {
    layers: [
      tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "...",
      }),
    ],
    zoom: 14,
    center: latLng(3.134695, 101.722898),
  };
  layers = [
    // circle([ 46.95, -122 ], { radius: 5000 }),
    // polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
    marker([3.141810, 101.715283], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/logo/logo mesra.jpg",
      }),
    }),
    // circle([ 46.95, -122 ], { radius: 5000 }),
    // polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
    marker([3.132940, 101.712551], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/logo/kfc2.jpg",
      }),
    }),
    marker([3.134695, 101.722898], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/logo/logoTealive.png",
        popupAnchor: [0,-15],
      }),
    }),
    marker([3.124799, 101.713710], {
      icon: icon({
        iconSize: [50, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/logo/logo mesra.jpg",
      
      }),
    }),
    marker([3.127808, 101.722374], {
      icon: icon({
        iconSize: [50, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/logo/logo mesra.jpg",
      }),
    }),
  ];

  constructor(
    private mockService: MocksService,
    private notifyService: NotifyService,
    private zone: NgZone,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private loadingBar: LoadingBarService,
    private router: Router,
    private _route: ActivatedRoute
  ) {
    // this.getData();
  }

  ngOnInit() {
    this.getCharts();
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }


  // getData() {
  //   this.mockService.getAll(this.listReceipt).subscribe(
  //     (res) => {
  //       // Success
  //       this.tableRows = [...res];
  //       this.tableTemp = this.tableRows.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //       console.log("Svc: ", this.tableTemp);
  //     },
  //     () => {
  //       // Unsuccess
  //     },
  //     () => {
  //       // After
  //       this.getChart();
  //     }
  //   );
  // }

  openModal(modalRef: TemplateRef<any>, row) {
    // if (row) {
    //   console.log(row);
    //   this.editActionForm.patchValue(row);
    // }
    this.modal = this.modalService.show(
      modalRef,
      Object.assign({}, { class: "gray modal-lg" })
    );
    // this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide();
    // this.editActionForm.reset();
  }

  navigatePage(path: String, id) {
    // let qq = "db17a36a-1da6-4919-9746-dfed8802ec9d";
    console.log(id);
    console.log(path + "/" + id);
    if (path == "/admin//utility/Actions") {
      return this.router.navigate([path]);
    } else if (path == "/admin//utility/Action-detail") {
      return this.router.navigate([path, id]);
    } else if (path == "history") {
      return this.router.navigate(["/admin/weapon/observation"]);
  }
}

  successMessage() {
    let title = "Success";
    let message = "Create New Action";
    this.notifyService.openToastr(title, message);
  }

  successEditMessage() {
    let title = "Success";
    let message = "Edit Action";
    this.notifyService.openToastr(title, message);
  }

  errorAlert(task) {
    swal.fire({
      title: "Error",
      text: "Cannot " + task + " Action, Please Try Again!",
      type: "error",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-danger",
      confirmButtonText: "Close",
    });
  }

  successAlert(task) {
    swal.fire({
      title: "Success",
      text: "Successfully " + task,
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close",
    });
  }

  confirm() {
    swal
      .fire({
        title: "Confirmation",
        text: "Are you sure to redeem this?",
        type: "info",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info",
        confirmButtonText: "Confirm",
        showCancelButton: true,
        cancelButtonClass: "btn btn-danger",
        cancelButtonText: "Cancel",
      })
      .then((task) => {
        // if (result.value) {
        this.successAlert("redeem this");
        // }
      });
  }

  entriesChange($event) {
    this.tableEntries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this.tableTemp = this.tableRows.filter(function (d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart11();
      this.getChart12();
      this.getChart13();
    });
  }

  getChart11() {
    let chart = am4core.create("chartForecast11", am4charts.XYChart);

    // Add data
    chart.data = [
      { year: "1896", uk: 7, ussr: 0, russia: 0, usa: 20, china: 0 },
      { year: "1900", uk: 78, ussr: 0, russia: 0, usa: 55, china: 0 },
      { year: "1904", uk: 2, ussr: 0, russia: 0, usa: 394, china: 0 },
      { year: "1908", uk: 347, ussr: 0, russia: 0, usa: 63, china: 0 },
      { year: "1912", uk: 160, ussr: 0, russia: 0, usa: 101, china: 0 },
      { year: "1916", uk: 0, ussr: 0, russia: 0, usa: 0, china: 0 },
      { year: "1920", uk: 107, ussr: 0, russia: 0, usa: 193, china: 0 },
      { year: "1924", uk: 66, ussr: 0, russia: 0, usa: 198, china: 0 },
      { year: "1928", uk: 55, ussr: 0, russia: 0, usa: 84, china: 0 },
      { year: "1932", uk: 34, ussr: 0, russia: 0, usa: 181, china: 0 },
      { year: "1936", uk: 36, ussr: 0, russia: 0, usa: 92, china: 0 },
      { year: "1940", uk: 0, ussr: 0, russia: 0, usa: 0, china: 0 },
      { year: "1944", uk: 0, ussr: 0, russia: 0, usa: 0, china: 0 },
      { year: "1948", uk: 56, ussr: 0, russia: 0, usa: 148, china: 0 },
      { year: "1952", uk: 31, ussr: 117, russia: 0, usa: 130, china: 0 },
      { year: "1956", uk: 45, ussr: 169, russia: 0, usa: 118, china: 0 },
      { year: "1960", uk: 28, ussr: 169, russia: 0, usa: 112, china: 0 },
      { year: "1964", uk: 28, ussr: 174, russia: 0, usa: 150, china: 0 },
      { year: "1968", uk: 18, ussr: 188, russia: 0, usa: 149, china: 0 },
      { year: "1972", uk: 29, ussr: 211, russia: 0, usa: 155, china: 0 },
      { year: "1976", uk: 32, ussr: 285, russia: 0, usa: 155, china: 0 },
      { year: "1980", uk: 45, ussr: 442, russia: 0, usa: 0, china: 0 },
      { year: "1984", uk: 72, ussr: 0, russia: 0, usa: 333, china: 76 },
      { year: "1988", uk: 53, ussr: 294, russia: 0, usa: 193, china: 53 },
      { year: "1992", uk: 50, ussr: 0, russia: 0, usa: 224, china: 83 },
      { year: "1996", uk: 26, ussr: 0, russia: 115, usa: 260, china: 110 },
      { year: "2000", uk: 55, ussr: 0, russia: 188, usa: 248, china: 79 },
      { year: "2004", uk: 57, ussr: 0, russia: 192, usa: 264, china: 94 },
      { year: "2008", uk: 77, ussr: 0, russia: 143, usa: 315, china: 184 },
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    function createSeries(field, name) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dummyData = {
        field: field,
      };
      series.dataFields.valueY = field + "_hi";
      series.dataFields.openValueY = field + "_low";
      series.dataFields.categoryX = "year";
      series.name = name;
      series.tooltipText =
        "[font-size: 18]{name}[/]\n{categoryX}: [bold]{" + field + "}[/]";
      series.strokeWidth = 1;
      series.fillOpacity = 1;
      series.tensionX = 0.8;

      return series;
    }

    createSeries("uk", "United Kingdom");
    createSeries("ussr", "Soviet Union");
    createSeries("russia", "Russia");
    createSeries("usa", "United States");
    createSeries("china", "China");

    // Legend
    // chart.legend = new am4charts.Legend();
    // chart.legend.itemContainers.template.togglable = false;
    // chart.legend.itemContainers.template.cursorOverStyle =
    //   am4core.MouseCursorStyle.default;
    // chart.legend.position = "right";
    // chart.legend.reverseOrder = true;

    // Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.maxTooltipDistance = 0;

    // Responsive
    chart.responsive.enabled = true;
    chart.responsive.useDefault = false;
    chart.responsive.rules.push({
      relevant: am4core.ResponsiveBreakpoints.widthL,
      state: function (target, stateId) {
        if (target instanceof am4charts.Legend) {
          let state = target.states.create(stateId);
          state.properties.position = "bottom";
          return state;
        }
        return null;
      },
    });

    // Prepare data for the river-stacked series
    chart.events.on("beforedatavalidated", updateData);
    function updateData() {
      let data = chart.data;
      if (data.length == 0) {
        return;
      }

      for (var i = 0; i < data.length; i++) {
        let row = data[i];
        let sum = 0;

        // Calculate open and close values
        chart.series.each(function (series) {
          let field = series.dummyData.field;
          let val = Number(row[field]);
          row[field + "_low"] = sum;
          row[field + "_hi"] = sum + val;
          sum += val;
        });

        // Adjust values so they are centered
        let offset = sum / 2;
        chart.series.each(function (series) {
          let field = series.dummyData.field;
          row[field + "_low"] -= offset;
          row[field + "_hi"] -= offset;
        });
      }
    }
  }

  getChart12() {
    let chart = am4core.create("chartForecast12", am4charts.RadarChart);

    /* Add data */
    chart.data = [
      {
        country: "Lithuania",
        litres: 501,
        units: 250,
      },
      {
        country: "Czech Republic",
        litres: 301,
        units: 222,
      },
      {
        country: "Ireland",
        litres: 266,
        units: 179,
      },
      {
        country: "Germany",
        litres: 165,
        units: 298,
      },
      {
        country: "Australia",
        litres: 139,
        units: 299,
      },
      {
        country: "Austria",
        litres: 336,
        units: 185,
      },
      {
        country: "UK",
        litres: 290,
        units: 150,
      },
      {
        country: "Belgium",
        litres: 325,
        units: 382,
      },
      {
        country: "The Netherlands",
        litres: 40,
        units: 172,
      },
    ];

    /* Create axes */
    let xAxis = chart.xAxes.push(new am4charts.ValueAxis() as any);
    xAxis.renderer.maxLabelPosition = 0.99;

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
    yAxis.renderer.labels.template.verticalCenter = "bottom";
    yAxis.renderer.labels.template.horizontalCenter = "right";
    yAxis.renderer.maxLabelPosition = 0.99;
    yAxis.renderer.labels.template.paddingBottom = 1;
    yAxis.renderer.labels.template.paddingRight = 3;

    /* Create and configure series */
    let series1 = chart.series.push(new am4charts.RadarSeries());
    series1.bullets.push(new am4charts.CircleBullet());
    series1.strokeOpacity = 0;
    series1.dataFields.valueX = "x";
    series1.dataFields.valueY = "y";
    series1.name = "Series #1";
    series1.sequencedInterpolation = true;
    series1.sequencedInterpolationDelay = 10;
    series1.data = [
      { x: 83, y: 5.1 },
      { x: 44, y: 5.8 },
      { x: 76, y: 9 },
      { x: 2, y: 1.4 },
      { x: 100, y: 8.3 },
      { x: 96, y: 1.7 },
      { x: 68, y: 3.9 },
      { x: 0, y: 3 },
      { x: 100, y: 4.1 },
      { x: 16, y: 5.5 },
      { x: 71, y: 6.8 },
      { x: 100, y: 7.9 },
      { x: 9, y: 6.8 },
      { x: 85, y: 8.3 },
      { x: 51, y: 6.7 },
      { x: 95, y: 3.8 },
      { x: 95, y: 4.4 },
      { x: 1, y: 0.2 },
      { x: 107, y: 9.7 },
      { x: 50, y: 4.2 },
      { x: 42, y: 9.2 },
      { x: 35, y: 8 },
      { x: 44, y: 6 },
      { x: 64, y: 0.7 },
      { x: 53, y: 3.3 },
      { x: 92, y: 4.1 },
      { x: 43, y: 7.3 },
      { x: 15, y: 7.5 },
      { x: 43, y: 4.3 },
      { x: 90, y: 9.9 },
    ];

    let series2 = chart.series.push(new am4charts.RadarSeries());
    series2.bullets.push(new am4charts.CircleBullet());
    series2.strokeOpacity = 0;
    series2.dataFields.valueX = "x";
    series2.dataFields.valueY = "y";
    series2.name = "Series #2";
    series2.sequencedInterpolation = true;
    series2.sequencedInterpolationDelay = 10;
    series2.data = [
      { x: 178, y: 1.3 },
      { x: 129, y: 3.4 },
      { x: 99, y: 2.4 },
      { x: 80, y: 9.9 },
      { x: 118, y: 9.4 },
      { x: 103, y: 8.7 },
      { x: 91, y: 4.2 },
      { x: 151, y: 1.2 },
      { x: 168, y: 5.2 },
      { x: 168, y: 1.6 },
      { x: 152, y: 1.2 },
      { x: 149, y: 3.4 },
      { x: 182, y: 8.8 },
      { x: 106, y: 6.7 },
      { x: 111, y: 9.2 },
      { x: 130, y: 6.3 },
      { x: 147, y: 2.9 },
      { x: 81, y: 8.1 },
      { x: 138, y: 7.7 },
      { x: 107, y: 3.9 },
      { x: 124, y: 0.7 },
      { x: 130, y: 2.6 },
      { x: 86, y: 9.2 },
      { x: 169, y: 7.5 },
      { x: 122, y: 9.9 },
      { x: 100, y: 3.8 },
      { x: 172, y: 4.1 },
      { x: 140, y: 7.3 },
      { x: 161, y: 2.3 },
      { x: 141, y: 0.9 },
    ];

    let series3 = chart.series.push(new am4charts.RadarSeries());
    series3.bullets.push(new am4charts.CircleBullet());
    series3.strokeOpacity = 0;
    series3.dataFields.valueX = "x";
    series3.dataFields.valueY = "y";
    series3.name = "Series #3";
    series3.sequencedInterpolation = true;
    series3.sequencedInterpolationDelay = 10;
    series3.data = [
      { x: 419, y: 4.9 },
      { x: 417, y: 5.5 },
      { x: 434, y: 0.1 },
      { x: 344, y: 2.5 },
      { x: 279, y: 7.5 },
      { x: 307, y: 8.4 },
      { x: 279, y: 9 },
      { x: 220, y: 8.4 },
      { x: 204, y: 8 },
      { x: 446, y: 0.9 },
      { x: 397, y: 8.9 },
      { x: 351, y: 1.7 },
      { x: 393, y: 0.7 },
      { x: 254, y: 1.8 },
      { x: 260, y: 0.4 },
      { x: 300, y: 3.5 },
      { x: 199, y: 2.7 },
      { x: 182, y: 5.8 },
      { x: 173, y: 2 },
      { x: 201, y: 9.7 },
      { x: 288, y: 1.2 },
      { x: 333, y: 7.4 },
      { x: 308, y: 1.9 },
      { x: 330, y: 8 },
      { x: 408, y: 1.7 },
      { x: 274, y: 0.8 },
      { x: 296, y: 3.1 },
      { x: 279, y: 4.3 },
      { x: 379, y: 5.6 },
      { x: 175, y: 6.8 },
    ];

    /* Add legend */
    chart.legend = new am4charts.Legend();

    /* Add cursor */
    chart.cursor = new am4charts.RadarCursor();
  }

  getChart13() {
    let chart = am4core.create("chartForecast13", am4charts.RadarChart);

    /* Add data */
    chart.data = [
      {
        direction: "N",
        value: 8,
      },
      {
        direction: "NE",
        value: 9,
      },
      {
        direction: "E",
        value: 4.5,
      },
      {
        direction: "SE",
        value: 3.5,
      },
      {
        direction: "S",
        value: 9.2,
      },
      {
        direction: "SW",
        value: 8.4,
      },
      {
        direction: "W",
        value: 11.1,
      },
      {
        direction: "NW",
        value: 10,
      },
    ];

    /* Create axes */
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis() as any);
    categoryAxis.dataFields.category = "direction";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
    //valueAxis.renderer.gridType = "polygons";

    let range = categoryAxis.axisRanges.create();
    range.category = "NW";
    range.endCategory = "NW";
    range.axisFill.fill = am4core.color("#0066CC");
    range.axisFill.fillOpacity = 0.3;

    let range2 = categoryAxis.axisRanges.create();
    range2.category = "N";
    range2.endCategory = "N";
    range2.axisFill.fill = am4core.color("#0066CC");
    range2.axisFill.fillOpacity = 0.3;

    let range3 = categoryAxis.axisRanges.create();
    range3.category = "SE";
    range3.endCategory = "SW";
    range3.axisFill.fill = am4core.color("#CC3333");
    range3.axisFill.fillOpacity = 0.3;
    range3.locations.endCategory = 0;

    /* Create and configure series */
    let series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "direction";
    series.name = "Wind direction";
    series.strokeWidth = 3;
    series.fillOpacity = 0.2;
  }
}
