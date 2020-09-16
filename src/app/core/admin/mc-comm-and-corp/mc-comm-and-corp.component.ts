import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  TemplateRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Audit } from "src/assets/mock/admin-audit/audit.model";
import { MocksService } from "src/app/shared/services/mocks/mocks.service";
// import { AuditData } from 'src/assets/mock/admin-audit/audit.data.json'
import * as moment from "moment";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
// am4core.useTheme(am4themes_kelly);
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
import { MapService } from "src/app/shared/services/map/map.service";
import { Map, NavigationControl } from "mapbox-gl";
import { tileLayer, latLng, marker, icon } from "leaflet";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-mc-comm-and-corp",
  templateUrl: "./mc-comm-and-corp.component.html",
  styleUrls: ["./mc-comm-and-corp.component.scss"],
})
export class McCommAndCorpComponent implements OnInit, OnDestroy {
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
  listBillStatement: any = [
    {
      cust: "Consumer",
      cust_code: "Cusumer 10",
      bill_sce: "1st Billing",
      pro_serv: "unifi",
      season: "Hari Raya",
      created: "Ali",
      created_at: "2019-07-27T01:07:14Z",
    },
    {
      cust: "SME",
      cust_code: "SME 20",
      bill_sce: "2nd Billing",
      pro_serv: "voice",
      season: "Hari Raya",
      created: "Jannah",
      created_at: "2019-07-27T01:07:14Z",
    },
    {
      cust: "TMOne",
      cust_code: "TMOne 30",
      bill_sce: "2nd Billing",
      pro_serv: "unifi",
      season: "Hari Raya",
      created: "Yaya",
      created_at: "2019-07-27T01:07:14Z",
    },
  ];

  options = {
    layers: [
      tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "...",
      }),
    ],
    zoom: 12,
    center: latLng(2.733335, 101.377733),
  };
  layers = [
    // circle([ 46.95, -122 ], { radius: 5000 }),
    // polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
    marker([2.722361, 101.43545], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/google/ship1.png",
      }),
    }),
    // circle([ 46.95, -122 ], { radius: 5000 }),
    // polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
    marker([2.76077, 101.385978], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/google/ship1.png",
      }),
    }),
    marker([2.738822, 101.369488], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/google/ship1.png",
      }),
    }),
    marker([2.733335, 101.292532], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/google/ship2.png",
      }),
    }),
    marker([2.681208, 101.322765], {
      icon: icon({
        iconSize: [40, 40],
        iconAnchor: [13, 41],
        iconUrl: "../assets/img/google/ship2.png",
      }),
    }),
  ];

  @ViewChild("mapEl", { static: true })
  mapEl: ElementRef<HTMLDivElement>;

  private map: Map;

  constructor(
    private mapSrv: MapService,
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

  // ngAfterViewInit(): void {
  //   this.map = new Map({
  //     container: this.mapEl.nativeElement,
  //     style: "mapbox://styles/mapbox/dark-v10",
  //     center: { lng: 113.662942, lat: 3.337954 },
  //     zoom: 4,
  //     pitch: 20,
  //     attributionControl: false,
  //   });
  //   this.map.addControl(
  //     new NavigationControl({
  //       showZoom: true,
  //       showCompass: true,
  //       visualizePitch: true,
  //     }),
  //     "top-right"
  //   );
  //   this.mapSrv.map.next(this.map);
  //   this.map.on("load", () => {
  //     console.log("map loaded");
  //     this.mapSrv.map.complete();
  //     // Add a geojson point source.
  //     // Heatmap layers also work with a vector tile source.
  //     this.map.addSource("earthquakes", {
  //       type: "geojson",
  //       data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
  //     });
  //     this.map.addLayer(
  //       {
  //         id: "earthquakes-heat",
  //         type: "heatmap",
  //         source: "earthquakes",
  //         maxzoom: 9,
  //         paint: {
  //           // Increase the heatmap weight based on frequency and property magnitude
  //           "heatmap-weight": [
  //             "interpolate",
  //             ["linear"],
  //             ["get", "mag"],
  //             0,
  //             0,
  //             6,
  //             1,
  //           ],
  //           // Increase the heatmap color weight weight by zoom level
  //           // heatmap-intensity is a multiplier on top of heatmap-weight
  //           "heatmap-intensity": [
  //             "interpolate",
  //             ["linear"],
  //             ["zoom"],
  //             0,
  //             1,
  //             9,
  //             3,
  //           ],
  //           // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
  //           // Begin color ramp at 0-stop with a 0-transparancy color
  //           // to create a blur-like effect.
  //           "heatmap-color": [
  //             "interpolate",
  //             ["linear"],
  //             ["heatmap-density"],
  //             0,
  //             "rgba(33,102,172,0)",
  //             0.2,
  //             "rgb(103,169,207)",
  //             0.4,
  //             "rgb(209,229,240)",
  //             0.6,
  //             "rgb(253,219,199)",
  //             0.8,
  //             "rgb(239,138,98)",
  //             1,
  //             "rgb(178,24,43)",
  //           ],
  //           // Adjust the heatmap radius by zoom level
  //           "heatmap-radius": [
  //             "interpolate",
  //             ["linear"],
  //             ["zoom"],
  //             0,
  //             2,
  //             9,
  //             20,
  //           ],
  //           // Transition from heatmap to circle layer by zoom level
  //           "heatmap-opacity": [
  //             "interpolate",
  //             ["linear"],
  //             ["zoom"],
  //             7,
  //             1,
  //             9,
  //             0,
  //           ],
  //         },
  //       },
  //       "waterway-label"
  //     );
  //     this.map.addLayer(
  //       {
  //         id: "earthquakes-point",
  //         type: "circle",
  //         source: "earthquakes",
  //         minzoom: 7,
  //         paint: {
  //           // Size circle radius by earthquake magnitude and zoom level
  //           "circle-radius": [
  //             "interpolate",
  //             ["linear"],
  //             ["zoom"],
  //             7,
  //             ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
  //             16,
  //             ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
  //           ],
  //           // Color circle by earthquake magnitude
  //           "circle-color": [
  //             "interpolate",
  //             ["linear"],
  //             ["get", "mag"],
  //             1,
  //             "rgba(33,102,172,0)",
  //             2,
  //             "rgb(103,169,207)",
  //             3,
  //             "rgb(209,229,240)",
  //             4,
  //             "rgb(253,219,199)",
  //             5,
  //             "rgb(239,138,98)",
  //             6,
  //             "rgb(178,24,43)",
  //           ],
  //           "circle-stroke-color": "white",
  //           "circle-stroke-width": 1,
  //           // Transition from heatmap to circle layer by zoom level
  //           "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
  //         },
  //       },
  //       "waterway-label"
  //     );
  //   });
  // }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  openModal(modalRef: TemplateRef<any>, row) {
    // if (row) {
    //   console.log(row);
    //   this.editActionForm.patchValue(row);
    // }
    this.modal = this.modalService.show(
      modalRef,
      Object.assign({}, { class: "gray modal-xl" })
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
        text: "Are you sure to delete data?",
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
        this.successAlert("delete data");
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
      this.getChart();
      this.getChart1();
      this.getChart2();
      this.getChart3();
      // this.getChart4();
      // this.getChart5();
      // this.getChart6();
    });
  }

  getChart() {
    let chart = am4core.create("chartdivAcWarn", am4charts.RadarChart);

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

  getChart1() {
    let chart = am4core.create("chartdivAcWarn1", am4charts.RadarChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        category: "One",
        value1: 8,
        value2: 2,
      },
      {
        category: "Two",
        value1: 11,
        value2: 4,
      },
      {
        category: "Three",
        value1: 7,
        value2: 6,
      },
      {
        category: "Four",
        value1: 13,
        value2: 8,
      },
      {
        category: "Five",
        value1: 12,
        value2: 10,
      },
      {
        category: "Six",
        value1: 15,
        value2: 12,
      },
      {
        category: "Seven",
        value1: 9,
        value2: 14,
      },
      {
        category: "Eight",
        value1: 6,
        value2: 16,
      },
    ];

    chart.padding(20, 20, 20, 20);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis() as any);
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.tooltipLocation = 0.5;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.horizontalCenter = "left";
    valueAxis.min = 0;

    let series1 = chart.series.push(new am4charts.RadarColumnSeries());
    series1.columns.template.tooltipText = "{name}: {valueY.value}";
    series1.columns.template.width = am4core.percent(100);
    series1.name = "Series 1";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";

    let series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.columns.template.width = am4core.percent(100);
    series2.columns.template.tooltipText = "{name}: {valueY.value}";
    series2.name = "Series 2";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";

    chart.seriesContainer.zIndex = -1;

    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX.exportable = false;
    // chart.scrollbarY = new am4core.Scrollbar();
    // chart.scrollbarY.exportable = false;

    chart.cursor = new am4charts.RadarCursor();
    chart.cursor.xAxis = categoryAxis;
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fillOpacity = 0.1;
    chart.cursor.lineX.fill = am4core.color("#000000");
  }

  getChart2() {
    let chart = am4core.create("chartdivAcWarn2", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.paddingRight = 20;

    let data = [];
    let visits = 10;
    for (var i = 1; i < 60; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), value: visits });
    }

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.StepLineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.noRisers = true;
    series.strokeWidth = 2;
    series.fillOpacity = 0.2;
    series.sequencedInterpolation = true;

    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.series.push(series);
  }

  getChart3() {
    let chart = am4core.create("chartdivAcWarn3", am4charts.ChordDiagram);
    chart.hiddenState.properties.opacity = 0;

    let data = [];
    let letters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];

    function randomLetter(except) {
      let letter = letters[Math.floor(Math.random() * letters.length - 1)];
      if (letter == except) {
        return randomLetter(except);
      } else {
        return letter;
      }
    }

    for (var i = 0; i < letters.length; i++) {
      let fromLetter = letters[i];
      for (var o = 0; o < 3; o++) {
        data.push({
          from: fromLetter,
          to: randomLetter(fromLetter),
          value: Math.round(Math.random() * 100),
        });
      }
    }

    chart.data = data;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";
    chart.nonRibbon = true;
    chart.sortBy = "name";
    chart.startAngle = 90;
    chart.endAngle = 450;

    let nodeTemplate = chart.nodes.template;
    nodeTemplate.fill = chart.colors.getIndex(0);
    nodeTemplate.fillOpacity = 0.4;
    nodeTemplate.slice.disabled = true;
    nodeTemplate.setStateOnChildren = true;
    nodeTemplate.label.disabled = true;
    nodeTemplate.togglable = false;

    nodeTemplate.readerTitle = "Drag to rearrange";
    nodeTemplate.showSystemTooltip = true;

    let hoverState = nodeTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 1;

    let linkTemplate = chart.links.template;
    linkTemplate.opacity = 0.1;
    linkTemplate.stroke = chart.colors.getIndex(0);
    linkTemplate.defaultState.properties.opacity = 0.1;
    linkTemplate.tooltipText = "";

    let linkHoverState = linkTemplate.states.create("hover");
    linkHoverState.properties.opacity = 1;

    nodeTemplate.events.on("over", function (event) {
      let node = event.target;
      node.outgoingDataItems.each(function (dataItem) {
        dataItem.link.isHover = true;
      });
    });

    nodeTemplate.events.on("out", function (event) {
      let node = event.target;
      node.outgoingDataItems.each(function (dataItem) {
        dataItem.link.isHover = false;
      });
    });

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.grab;

    nodeTemplate.cursorDownStyle = am4core.MouseCursorStyle.grabbing;

    let circleBullet = nodeTemplate.createChild(am4charts.CircleBullet);
    circleBullet.setStateOnChildren = true;
    circleBullet.circle.radius = 15;

    let circleHoverState = circleBullet.states.create("hover");
    circleHoverState.properties.scale = 1.5;

    // we create a separate label as node.label ispositioned differently and doesn't fit perfectly for one-letter labels
    let label = circleBullet.createChild(am4core.Label);
    label.text = "{fromName}";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";

    let labelHoverState = label.states.create("hover");
    labelHoverState.properties.fill = am4core.color("#ffffff");
  }
}
