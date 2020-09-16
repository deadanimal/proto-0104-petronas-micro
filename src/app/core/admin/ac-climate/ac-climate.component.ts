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

// amchart
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

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

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-ac-climate",
  templateUrl: "./ac-climate.component.html",
  styleUrls: ["./ac-climate.component.scss"],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class AcClimateComponent implements OnInit, OnDestroy {
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
  listBillPresent: any = [
    {
      month: "Jan",
      temp: "89/73",
      rain: "7 days",
    },
    {
      month: "Feb",
      temp: "90/74",
      rain: "7 days",
    },
    {
      month: "Mar",
      temp: "88/72",
      rain: "7 days",
    },
    {
      month: "Apr",
      temp: "88/73",
      rain: "7 days",
    },
    {
      month: "May",
      temp: "90/74",
      rain: "7 days",
    },
    {
      month: "Hun",
      temp: "89/73",
      rain: "7 days",
    },
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
      // this.getChart();
      this.getChart1();
      // this.getChart2();
      this.getChart3();
      this.getChart4();
      this.getChart5();
      // this.getChart6();
    });
  }

  getChart1() {
    // times of events
    let startTime = new Date(2018, 0, 13, 6).getTime();
    let endTime = new Date(2018, 0, 13, 11, 59).getTime();
    let launchTime = new Date(2018, 0, 13, 7, 0).getTime();
    let alertTime = new Date(2018, 0, 13, 8, 7).getTime();
    let cancelTime = new Date(2018, 0, 13, 8, 45).getTime();

    let colorSet = new am4core.ColorSet();
    let currentTime;

    let container = am4core.create("chartCLimate1", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    // map chart ////////////////////////////////////////////////////////
    let mapChart = container.createChild(am4maps.MapChart);
    mapChart.mouseWheelBehavior = "none";

    // try {
    mapChart.geodata = am4geodata_continentsLow;
    // } catch (e) {
    //   mapChart.raiseCriticalError({
    //     message:
    //       'Map geodata could not be loaded. Please download the latest <a href="https://www.amcharts.com/download/download-v4/">amcharts geodata</a> and extract its contents into the same directory as your amCharts files.',
    //   });
    // }

    mapChart.projection = new am4maps.projections.Miller();
    mapChart.deltaLongitude = 145;
    mapChart.seriesContainer.draggable = false;

    let polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.fill = am4core.color("#3b3b3b");
    polygonSeries.mapPolygons.template.strokeOpacity = 0;
    polygonSeries.exclude = ["Antarctica"];

    let mapImageSeries = mapChart.series.push(new am4maps.MapImageSeries());
    let pyongyang = mapImageSeries.mapImages.create();
    pyongyang.longitude = 125.739708;
    pyongyang.latitude = 39.034333;
    pyongyang.nonScaling = true;

    let pyongyangCircle = pyongyang.createChild(am4core.Circle);
    pyongyangCircle.fill = colorSet.getIndex(5);
    pyongyangCircle.stroke = pyongyangCircle.fill;
    pyongyangCircle.radius = 4;

    pyongyang.tooltip = new am4core.Tooltip();
    pyongyang.tooltip.filters.clear();
    pyongyang.tooltip.background.cornerRadius = 20;
    pyongyang.tooltip.label.padding(15, 20, 15, 20);
    pyongyang.tooltip.background.strokeOpacity = 0;
    pyongyang.tooltipY = -5;
    pyongyang.fill = pyongyangCircle.fill;

    let koreaText = pyongyang.createChild(am4core.Label);
    koreaText.text = "North Korea";
    koreaText.fillOpacity = 0.2;
    koreaText.fontSize = 20;
    koreaText.fill = am4core.color("#ffffff");
    koreaText.verticalCenter = "middle";
    koreaText.horizontalCenter = "right";
    koreaText.paddingRight = 15;

    let bomb = mapImageSeries.mapImages.create();
    bomb.longitude = 125.739708;
    bomb.latitude = 39.034333;
    bomb.nonScaling = true;
    bomb.opacity = 0;

    let bombImage = bomb.createChild(am4core.Image);
    bombImage.width = 32;
    bombImage.height = 32;
    bombImage.href = "//www.amcharts.com/wp-content/uploads/2018/11/rocket.png";
    bombImage.verticalCenter = "middle";
    bombImage.horizontalCenter = "middle";

    let honolulu = mapImageSeries.mapImages.create();
    honolulu.longitude = -157.887841;
    honolulu.latitude = 21.368213;
    honolulu.nonScaling = true;

    let bulletAlertCircle = honolulu.createChild(am4core.Circle);
    bulletAlertCircle.fill = am4core.color();
    bulletAlertCircle.stroke = colorSet.getIndex(2);
    bulletAlertCircle.strokeOpacity = 1;
    bulletAlertCircle.radius = 5;
    bulletAlertCircle.strokeWidth = 2;
    bulletAlertCircle.visible = false;
    let bulletAlertAnimation = bulletAlertCircle
      .animate(
        [
          { property: "radius", to: 50 },
          { property: "strokeOpacity", to: 0, from: 1 },
        ],
        600
      )
      .loop()
      .pause();

    let honoluluCircle = honolulu.createChild(am4core.Circle);
    honoluluCircle.fill = colorSet.getIndex(2);
    honoluluCircle.stroke = honoluluCircle.fill;
    honoluluCircle.radius = 4;
    honoluluCircle.tooltipY = -5;
    honoluluCircle.isMeasured = true;

    honolulu.tooltip = new am4core.Tooltip();
    honolulu.tooltip.filters.clear();
    honolulu.fill = honoluluCircle.fill;
    honolulu.tooltip.background.cornerRadius = 20;
    honolulu.tooltip.label.padding(15, 20, 15, 20);
    honolulu.tooltip.background.strokeOpacity = 0;
    honolulu.tooltipY = -5;

    let hawaiiText = honolulu.createChild(am4core.Label);
    hawaiiText.text = "Hawaii, USA";
    hawaiiText.fillOpacity = 0.1;
    hawaiiText.fontSize = 35;
    hawaiiText.fill = am4core.color("#ffffff");
    hawaiiText.verticalCenter = "middle";
    hawaiiText.paddingLeft = 30;

    let bang = mapImageSeries.mapImages.create();
    bang.longitude = -177;
    bang.latitude = 24;
    bang.nonScaling = true;
    let bangImage = bang.createChild(am4core.Image);
    bangImage.width = 50;
    bangImage.height = 50;
    bangImage.verticalCenter = "middle";
    bangImage.horizontalCenter = "middle";
    bangImage.href =
      "https://www.amcharts.com/wp-content/uploads/2018/11/bang.png";
    bang.opacity = 0;

    let mapLineSeries = mapChart.series.push(new am4maps.MapLineSeries());
    let line = mapLineSeries.mapLines.create();
    line.imagesToConnect = [pyongyang, bang];
    line.line.strokeOpacity = 0; // it's invisible, we use it for a bomb image to follow it

    mapChart.homeGeoPoint = { longitude: -175, latitude: 15 };
    mapChart.homeZoomLevel = 2.2;

    // clock chart //////////////////////////////////////////////////////////////////
    let clock = mapChart.chartContainer.createChild(am4charts.GaugeChart);
    clock.align = "right";
    clock.width = 250;
    clock.height = 250;
    clock.align = "right";
    clock.zIndex = 10;

    clock.startAngle = -90;
    clock.endAngle = 270;

    let axis = clock.xAxes.push(new am4charts.ValueAxis() as any);
    axis.min = 0;
    axis.max = 12;
    axis.strictMinMax = true;
    axis.renderer.line.stroke = am4core.color("#ffffff");

    axis.renderer.line.strokeWidth = 1;
    axis.renderer.line.strokeOpacity = 0.4;
    axis.renderer.minLabelPosition = 0.05; // hides 0 label
    axis.renderer.inside = true;
    axis.renderer.labels.template.radius = 23;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.minGridDistance = 20;
    axis.renderer.ticks.template.length = 4;
    axis.renderer.ticks.template.strokeOpacity = 0.2;
    axis.renderer.ticks.template.stroke = am4core.color("#ffffff");
    axis.renderer.labels.template.fill = am4core.color("#ffffff");

    // clock hands
    let hourHand = clock.hands.push(new am4charts.ClockHand());
    hourHand.radius = am4core.percent(60);
    hourHand.startWidth = 5;
    hourHand.endWidth = 5;
    hourHand.rotationDirection = "clockWise";
    hourHand.pin.radius = 5;
    hourHand.zIndex = 0;
    hourHand.stroke = am4core.color("#ffffff");
    hourHand.fill = am4core.color("#ffffff");

    let minutesHand = clock.hands.push(new am4charts.ClockHand());
    minutesHand.rotationDirection = "clockWise";
    minutesHand.startWidth = 2;
    minutesHand.endWidth = 2;
    minutesHand.radius = am4core.percent(78);
    minutesHand.zIndex = 1;
    minutesHand.stroke = am4core.color("#ffffff");
    minutesHand.fill = am4core.color("#ffffff");

    function updateHands(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();

      // set hours
      hourHand.showValue(hours + minutes / 60, 0);
      // set minutes
      minutesHand.showValue((12 * (minutes + seconds / 60)) / 60, 0);
    }

    /// end of clock

    let exploded = false;
    let roundedTime;

    let honoluluTexts = [
      {
        time: new Date(2018, 0, 13, 6, 7).getTime(),
        text: "I wonder what's on youtube...",
      },
      {
        time: new Date(2018, 0, 13, 6, 30).getTime(),
        text: "... oooh a kitty video ...",
      },
      {
        time: new Date(2018, 0, 13, 7, 10).getTime(),
        text: "... LOL funny ...",
      },
      { time: new Date(2018, 0, 13, 8, 7).getTime(), text: "Huh?!?" },
      { time: new Date(2018, 0, 13, 8, 15).getTime(), text: "OMG!!!" },
      { time: new Date(2018, 0, 13, 8, 49).getTime(), text: "Phew!" },
      {
        time: new Date(2018, 0, 13, 8, 59).getTime(),
        text: "OK, where were we?",
      },
      { time: new Date(2018, 0, 13, 9, 20).getTime(), text: "" },
    ];

    let pyongyangTexts = [
      { time: new Date(2018, 0, 13, 6, 5).getTime(), text: "Great comrade..." },
      { time: new Date(2018, 0, 13, 6, 20).getTime(), text: "WHAT!?" },
      {
        time: new Date(2018, 0, 13, 6, 40).getTime(),
        text: "Please, push this button...",
      },
      { time: new Date(2018, 0, 13, 7, 0).getTime(), text: "O.K." },
      { time: new Date(2018, 0, 13, 7, 30).getTime(), text: "" },
    ];

    // updates all elements
    function setTime() {
      let time = new Date(
        startTime + (endTime - startTime) * slider.start
      ).getTime();
      let roundedTime = am4core.time
        .round(new Date(time), "minute", 0)
        .getTime();

      if (roundedTime != currentTime) {
        currentTime = roundedTime;
        let count = lineSeries.dataItems.length;
        if (slider) {
          for (var i = 0; i < count; i++) {
            let dataItem = lineSeries.dataItems.getIndex(i);

            if (i < slider.start * count) {
              dataItem.show(500, 0, ["valueY"]);
            } else {
              dataItem.hide(500, 0, 0, ["valueY"]);
            }
          }
        }
      }

      // add some drama by zooming the map
      updateHands(new Date(time));

      let bombFlyDuration = cancelTime - launchTime;
      let bombPosition = (time - launchTime) / bombFlyDuration;
      bombPosition = Math.min(1, bombPosition);
      bombPosition = Math.max(0, bombPosition);

      let oPoint = line.positionToPoint(bombPosition);
      let geoPoint = mapChart.seriesPointToGeo(oPoint);
      bomb.latitude = geoPoint.latitude;
      bomb.longitude = geoPoint.longitude;
      bomb.rotation = oPoint.angle + 90;

      if (bombPosition > 0 && bombPosition < 1) {
        bomb.opacity = 1;
      }

      if (bombPosition >= 1 && !exploded) {
        bomb.opacity = 0;
        bang.opacity = 1;
        bang.animate({ property: "opacity", to: 0, from: 1 }, 1000);
        exploded = true;
      }

      if (exploded && bombPosition < 1) {
        exploded = false;
        bang.opacity = 0;
        bomb.opacity = 1;
      }

      if (bombPosition <= 0.001) {
        bomb.opacity = 0;
      }

      if (time > alertTime && time < cancelTime) {
        if (!bulletAlertCircle.visible) {
          bulletAlertCircle.visible = true;
          bulletAlertAnimation.resume();
        }
      } else {
        bulletAlertCircle.visible = false;
      }

      for (var i = 0; i < honoluluTexts.length; i++) {
        let honoluluText = honoluluTexts[i];
        if (time > honoluluText.time) {
          honolulu.tooltipText = honoluluText.text;
        }
      }

      if (honolulu.tooltipText) {
        honolulu.showTooltip();
      } else {
        honolulu.hideTooltip();
      }

      for (var i = 0; i < pyongyangTexts.length; i++) {
        let pyongyangText = pyongyangTexts[i];
        if (time > pyongyangText.time) {
          pyongyang.tooltipText = pyongyangText.text;
        }
      }

      if (pyongyang.tooltipText) {
        pyongyang.showTooltip();
      } else {
        pyongyang.hideTooltip();
      }
    }

    let chart = container.createChild(am4charts.XYChart);
    chart.padding(0, 50, 50, 50);
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.tooltip.background.pointerLength = 4;
    dateAxis.tooltip.background.fillOpacity = 1;
    dateAxis.tooltip.background.fill = am4core.color("#666666");
    dateAxis.tooltip.background.stroke = dateAxis.tooltip.background.fill;

    chart.height = 300;
    chart.valign = "bottom";

    let gradientFill = new am4core.LinearGradient();
    gradientFill.addColor(am4core.color("#000000"), 0, 0);
    gradientFill.addColor(am4core.color("#000000"), 1, 1);
    gradientFill.rotation = 90;

    chart.background.fill = gradientFill;

    //dateAxis.renderer.inside = true;
    dateAxis.renderer.ticks.template.disabled = true;
    dateAxis.renderer.grid.template.strokeDasharray = "3,3";
    dateAxis.renderer.grid.template.strokeOpacity = 0.2;
    dateAxis.renderer.line.disabled = true;
    dateAxis.tooltip.dateFormatter.dateFormat = "YYYY-MM-dd HH:mm";
    dateAxis.renderer.inside = false;
    dateAxis.renderer.labels.template.fillOpacity = 0.4;
    dateAxis.renderer.minLabelPosition = 0.03;
    dateAxis.renderer.labels.template.fill = am4core.color("#ffffff");
    dateAxis.renderer.grid.template.stroke = am4core.color("#ffffff");

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = -90;
    valueAxis.max = 90;
    valueAxis.renderer.minGridDistance = 20;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.line.disabled = true;
    valueAxis.tooltip.disabled = true;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.4;
    valueAxis.renderer.labels.template.fill = am4core.color("#ffffff");
    valueAxis.renderer.grid.template.stroke = am4core.color("#ffffff");
    valueAxis.renderer.inside = true;
    valueAxis.renderer.baseGrid.strokeOpacity = 0.2;
    valueAxis.renderer.baseGrid.stroke = am4core.color("#ffffff");

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "value";
    lineSeries.dataFields.dateX = "time";
    lineSeries.tooltipText = "{valueY.workingValue}%";
    lineSeries.stroke = am4core.color("#3f2698");
    lineSeries.tooltip.background.fillOpacity = 0;
    lineSeries.tooltip.autoTextColor = false;
    lineSeries.tooltip.label.fill = am4core.color("#ffffff");
    lineSeries.tooltip.filters.clear();
    lineSeries.tooltip.pointerOrientation = "vertical";
    lineSeries.strokeWidth = 2;
    lineSeries.tensionX = 0.7;
    lineSeries.showOnInit = false;

    lineSeries.events.on("datavalidated", function () {
      lineSeries.dataItems.each(function (dataItem) {
        dataItem.hide(0, 0, 0, ["valueY"]);
      });
    });

    let negativeRange = valueAxis.createSeriesRange(lineSeries);
    negativeRange.value = 0;
    negativeRange.endValue = -100;
    negativeRange.contents.stroke = am4core.color("#84279a");
    negativeRange.contents.fill = negativeRange.contents.stroke;

    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "none";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;

    chart.events.on("ready", function () {
      createSlider();
    });

    let slider;

    let alertStart = dateAxis.axisRanges.create();
    alertStart.date = new Date(alertTime);
    alertStart.grid.stroke = am4core.color("#ffffff");
    alertStart.grid.strokeWidth = 1;
    alertStart.grid.strokeOpacity = 0.5;
    alertStart.grid.strokeDasharray = undefined;
    alertStart.label.text = "Citizens alerted";
    alertStart.label.horizontalCenter = "right";
    alertStart.label.fillOpacity = 0.7;
    alertStart.label.dy = -215;
    alertStart.label.fill = am4core.color("#FFFFFF");

    let alertCanceled = dateAxis.axisRanges.create();
    alertCanceled.date = new Date(cancelTime);
    alertCanceled.grid.stroke = am4core.color("#ffffff");
    alertCanceled.grid.strokeOpacity = 0.5;
    alertCanceled.grid.strokeDasharray = undefined;
    alertCanceled.label.text = "Alert canceled";
    alertCanceled.label.dy = -215;
    alertCanceled.label.fillOpacity = 0.7;
    alertCanceled.label.horizontalCenter = "left";
    alertCanceled.label.fill = am4core.color("#FFFFFF");

    let playButton;

    function createSlider() {
      let sliderContainer = container.createChild(am4core.Container);

      sliderContainer.width = am4core.percent(100);
      sliderContainer.valign = "bottom";
      sliderContainer.padding(0, 50, 25, 50);
      sliderContainer.layout = "horizontal";
      sliderContainer.height = 50;

      playButton = sliderContainer.createChild(am4core.PlayButton);
      playButton.valign = "middle";
      playButton.events.on("toggled", function (event) {
        if (event.target.isActive) {
          play();
        } else {
          stop();
        }
      });

      slider = sliderContainer.createChild(am4core.Slider);
      slider.valign = "middle";
      slider.margin(0, 0, 0, 0);
      slider.background.opacity = 0.3;
      slider.opacity = 0.7;
      slider.background.fill = am4core.color("#ffffff");
      slider.marginLeft = 30;
      slider.height = 15;
      slider.events.on("rangechanged", function () {
        setTime();
      });

      slider.startGrip.events.on("drag", function () {
        stop();
        sliderAnimation.setProgress(slider.start);
      });

      sliderAnimation = slider
        .animate({ property: "start", to: 1 }, 50000, am4core.ease.linear)
        .pause();
      sliderAnimation.events.on("animationended", function () {
        playButton.isActive = false;
      });
    }

    let sliderAnimation;

    function play() {
      if (slider) {
        if (slider.start >= 1) {
          slider.start = 0;
          sliderAnimation.start();
        }
        sliderAnimation.resume();
        playButton.isActive = true;
      }
    }

    function stop() {
      sliderAnimation.pause();
      playButton.isActive = false;
    }

    setTimeout(function () {
      play();
    }, 3000);

    let label = container.createChild(am4core.Label);
    label.text =
      "Website traffic in Hawaii during January 13, 2018 false ballistic missile alert";
    label.valign = "bottom";
    label.padding(0, 50, 10, 0);
    label.align = "right";

    chart.data = [
      { time: "2018-01-13 06:00", value: 0 },
      { time: "2018-01-13 06:01", value: -4 },
      { time: "2018-01-13 06:02", value: -16 },
      { time: "2018-01-13 06:03", value: -5 },
      { time: "2018-01-13 06:04", value: 12 },
      { time: "2018-01-13 06:05", value: -4 },
      { time: "2018-01-13 06:06", value: -5 },
      { time: "2018-01-13 06:07", value: -8 },
      { time: "2018-01-13 06:08", value: -2 },
      { time: "2018-01-13 06:09", value: -14 },
      { time: "2018-01-13 06:10", value: 15 },
      { time: "2018-01-13 06:11", value: 0 },
      { time: "2018-01-13 06:12", value: -14 },
      { time: "2018-01-13 06:13", value: -13 },
      { time: "2018-01-13 06:14", value: 2 },
      { time: "2018-01-13 06:15", value: 10 },
      { time: "2018-01-13 06:16", value: 11 },
      { time: "2018-01-13 06:17", value: 13 },
      { time: "2018-01-13 06:18", value: -11 },
      { time: "2018-01-13 06:19", value: 0 },
      { time: "2018-01-13 06:20", value: -10 },
      { time: "2018-01-13 06:21", value: 0 },
      { time: "2018-01-13 06:22", value: -21 },
      { time: "2018-01-13 06:23", value: -9 },
      { time: "2018-01-13 06:24", value: -11 },
      { time: "2018-01-13 06:25", value: -7 },
      { time: "2018-01-13 06:26", value: -14 },
      { time: "2018-01-13 06:27", value: 0 },
      { time: "2018-01-13 06:28", value: -9 },
      { time: "2018-01-13 06:29", value: 12 },
      { time: "2018-01-13 06:30", value: 7 },
      { time: "2018-01-13 06:31", value: 10 },
      { time: "2018-01-13 06:32", value: 5 },
      { time: "2018-01-13 06:33", value: 12 },
      { time: "2018-01-13 06:34", value: 13 },
      { time: "2018-01-13 06:35", value: 10 },
      { time: "2018-01-13 06:36", value: -14 },
      { time: "2018-01-13 06:37", value: -12 },
      { time: "2018-01-13 06:38", value: -8 },
      { time: "2018-01-13 06:39", value: -13 },
      { time: "2018-01-13 06:40", value: -13 },
      { time: "2018-01-13 06:41", value: -12 },
      { time: "2018-01-13 06:42", value: -11 },
      { time: "2018-01-13 06:43", value: 9 },
      { time: "2018-01-13 06:44", value: 0 },
      { time: "2018-01-13 06:45", value: -4 },
      { time: "2018-01-13 06:46", value: -6 },
      { time: "2018-01-13 06:47", value: -7 },
      { time: "2018-01-13 06:48", value: -12 },
      { time: "2018-01-13 06:49", value: -8 },
      { time: "2018-01-13 06:50", value: -7 },
      { time: "2018-01-13 06:51", value: 9 },
      { time: "2018-01-13 06:52", value: 10 },
      { time: "2018-01-13 06:53", value: 12 },
      { time: "2018-01-13 06:54", value: -4 },
      { time: "2018-01-13 06:55", value: 3 },
      { time: "2018-01-13 06:56", value: 9 },
      { time: "2018-01-13 06:57", value: -2 },
      { time: "2018-01-13 06:58", value: 7 },
      { time: "2018-01-13 06:59", value: 5 },
      { time: "2018-01-13 07:00", value: 8 },
      { time: "2018-01-13 07:01", value: -1 },
      { time: "2018-01-13 07:02", value: 1 },
      { time: "2018-01-13 07:03", value: -6 },
      { time: "2018-01-13 07:04", value: 0 },
      { time: "2018-01-13 07:05", value: -7 },
      { time: "2018-01-13 07:06", value: 3 },
      { time: "2018-01-13 07:07", value: 7 },
      { time: "2018-01-13 07:08", value: 2 },
      { time: "2018-01-13 07:09", value: -6 },
      { time: "2018-01-13 07:10", value: 2 },
      { time: "2018-01-13 07:11", value: -3 },
      { time: "2018-01-13 07:12", value: -8 },
      { time: "2018-01-13 07:13", value: -15 },
      { time: "2018-01-13 07:14", value: -3 },
      { time: "2018-01-13 07:15", value: -17 },
      { time: "2018-01-13 07:16", value: -8 },
      { time: "2018-01-13 07:17", value: -4 },
      { time: "2018-01-13 07:18", value: 0 },
      { time: "2018-01-13 07:19", value: -6 },
      { time: "2018-01-13 07:20", value: -5 },
      { time: "2018-01-13 07:21", value: -16 },
      { time: "2018-01-13 07:22", value: -8 },
      { time: "2018-01-13 07:23", value: -23 },
      { time: "2018-01-13 07:24", value: -9 },
      { time: "2018-01-13 07:25", value: -9 },
      { time: "2018-01-13 07:26", value: -11 },
      { time: "2018-01-13 07:27", value: -12 },
      { time: "2018-01-13 07:28", value: -13 },
      { time: "2018-01-13 07:29", value: -11 },
      { time: "2018-01-13 07:30", value: -14 },
      { time: "2018-01-13 07:31", value: -10 },
      { time: "2018-01-13 07:32", value: -4 },
      { time: "2018-01-13 07:33", value: -17 },
      { time: "2018-01-13 07:34", value: 0 },
      { time: "2018-01-13 07:35", value: 12 },
      { time: "2018-01-13 07:36", value: -11 },
      { time: "2018-01-13 07:37", value: 5 },
      { time: "2018-01-13 07:38", value: -4 },
      { time: "2018-01-13 07:39", value: 4 },
      { time: "2018-01-13 07:40", value: 1 },
      { time: "2018-01-13 07:41", value: -3 },
      { time: "2018-01-13 07:42", value: 4 },
      { time: "2018-01-13 07:43", value: -1 },
      { time: "2018-01-13 07:44", value: 0 },
      { time: "2018-01-13 07:45", value: 1 },
      { time: "2018-01-13 07:46", value: 1 },
      { time: "2018-01-13 07:47", value: 0 },
      { time: "2018-01-13 07:48", value: -5 },
      { time: "2018-01-13 07:49", value: 8 },
      { time: "2018-01-13 07:50", value: 7 },
      { time: "2018-01-13 07:51", value: -1 },
      { time: "2018-01-13 07:52", value: 10 },
      { time: "2018-01-13 07:53", value: 10 },
      { time: "2018-01-13 07:54", value: -10 },
      { time: "2018-01-13 07:55", value: -6 },
      { time: "2018-01-13 07:56", value: 0 },
      { time: "2018-01-13 07:57", value: 2 },
      { time: "2018-01-13 07:58", value: -10 },
      { time: "2018-01-13 07:59", value: 0 },
      { time: "2018-01-13 08:00", value: -12 },
      { time: "2018-01-13 08:01", value: -1 },
      { time: "2018-01-13 08:02", value: 0 },
      { time: "2018-01-13 08:03", value: 0 },
      { time: "2018-01-13 08:04", value: 0 },
      { time: "2018-01-13 08:05", value: 0 },
      { time: "2018-01-13 08:06", value: 0 },
      { time: "2018-01-13 08:07", value: 0 },
      { time: "2018-01-13 08:08", value: -47 },
      { time: "2018-01-13 08:09", value: -48 },
      { time: "2018-01-13 08:10", value: -54 },
      { time: "2018-01-13 08:11", value: -60 },
      { time: "2018-01-13 08:12", value: -44 },
      { time: "2018-01-13 08:13", value: -55 },
      { time: "2018-01-13 08:14", value: -56 },
      { time: "2018-01-13 08:15", value: -62 },
      { time: "2018-01-13 08:16", value: -62 },
      { time: "2018-01-13 08:17", value: -58 },
      { time: "2018-01-13 08:18", value: -56 },
      { time: "2018-01-13 08:19", value: -63 },
      { time: "2018-01-13 08:20", value: -58 },
      { time: "2018-01-13 08:21", value: -63 },
      { time: "2018-01-13 08:22", value: -62 },
      { time: "2018-01-13 08:23", value: -77 },
      { time: "2018-01-13 08:24", value: -69 },
      { time: "2018-01-13 08:25", value: -62 },
      { time: "2018-01-13 08:26", value: -68 },
      { time: "2018-01-13 08:27", value: -68 },
      { time: "2018-01-13 08:28", value: -63 },
      { time: "2018-01-13 08:29", value: -55 },
      { time: "2018-01-13 08:30", value: -54 },
      { time: "2018-01-13 08:31", value: -58 },
      { time: "2018-01-13 08:32", value: -61 },
      { time: "2018-01-13 08:33", value: -64 },
      { time: "2018-01-13 08:34", value: -53 },
      { time: "2018-01-13 08:35", value: -52 },
      { time: "2018-01-13 08:36", value: -47 },
      { time: "2018-01-13 08:37", value: -55 },
      { time: "2018-01-13 08:38", value: -48 },
      { time: "2018-01-13 08:39", value: -47 },
      { time: "2018-01-13 08:40", value: -32 },
      { time: "2018-01-13 08:41", value: -42 },
      { time: "2018-01-13 08:42", value: -41 },
      { time: "2018-01-13 08:43", value: -34 },
      { time: "2018-01-13 08:44", value: -40 },
      { time: "2018-01-13 08:45", value: -49 },
      { time: "2018-01-13 08:46", value: -38 },
      { time: "2018-01-13 08:47", value: -33 },
      { time: "2018-01-13 08:48", value: -39 },
      { time: "2018-01-13 08:49", value: -28 },
      { time: "2018-01-13 08:50", value: -38 },
      { time: "2018-01-13 08:51", value: -39 },
      { time: "2018-01-13 08:52", value: -35 },
      { time: "2018-01-13 08:53", value: -30 },
      { time: "2018-01-13 08:54", value: -13 },
      { time: "2018-01-13 08:55", value: -15 },
      { time: "2018-01-13 08:56", value: -17 },
      { time: "2018-01-13 08:57", value: -17 },
      { time: "2018-01-13 08:58", value: -14 },
      { time: "2018-01-13 08:59", value: -5 },
      { time: "2018-01-13 09:00", value: 13 },
      { time: "2018-01-13 09:01", value: 48 },
      { time: "2018-01-13 09:02", value: 33 },
      { time: "2018-01-13 09:03", value: 32 },
      { time: "2018-01-13 09:04", value: 22 },
      { time: "2018-01-13 09:05", value: 38 },
      { time: "2018-01-13 09:06", value: 9 },
      { time: "2018-01-13 09:07", value: 28 },
      { time: "2018-01-13 09:08", value: 21 },
      { time: "2018-01-13 09:09", value: 32 },
      { time: "2018-01-13 09:10", value: 16 },
      { time: "2018-01-13 09:11", value: 22 },
      { time: "2018-01-13 09:12", value: 17 },
      { time: "2018-01-13 09:13", value: 32 },
      { time: "2018-01-13 09:14", value: 12 },
      { time: "2018-01-13 09:15", value: 11 },
      { time: "2018-01-13 09:16", value: 18 },
      { time: "2018-01-13 09:17", value: 19 },
      { time: "2018-01-13 09:18", value: 15 },
      { time: "2018-01-13 09:19", value: -7 },
      { time: "2018-01-13 09:20", value: 6 },
      { time: "2018-01-13 09:21", value: 7 },
      { time: "2018-01-13 09:22", value: 13 },
      { time: "2018-01-13 09:23", value: 14 },
      { time: "2018-01-13 09:24", value: 11 },
      { time: "2018-01-13 09:25", value: 15 },
      { time: "2018-01-13 09:26", value: -5 },
      { time: "2018-01-13 09:27", value: 6 },
      { time: "2018-01-13 09:28", value: 10 },
      { time: "2018-01-13 09:29", value: 24 },
      { time: "2018-01-13 09:30", value: -11 },
      { time: "2018-01-13 09:31", value: -8 },
      { time: "2018-01-13 09:32", value: -13 },
      { time: "2018-01-13 09:33", value: 3 },
      { time: "2018-01-13 09:34", value: -1 },
      { time: "2018-01-13 09:35", value: 6 },
      { time: "2018-01-13 09:36", value: 7 },
      { time: "2018-01-13 09:37", value: 7 },
      { time: "2018-01-13 09:38", value: 8 },
      { time: "2018-01-13 09:39", value: 10 },
      { time: "2018-01-13 09:40", value: -12 },
      { time: "2018-01-13 09:41", value: -6 },
      { time: "2018-01-13 09:42", value: -10 },
      { time: "2018-01-13 09:43", value: 2 },
      { time: "2018-01-13 09:44", value: -6 },
      { time: "2018-01-13 09:45", value: -5 },
      { time: "2018-01-13 09:46", value: -9 },
      { time: "2018-01-13 09:47", value: -12 },
      { time: "2018-01-13 09:48", value: -6 },
      { time: "2018-01-13 09:49", value: -10 },
      { time: "2018-01-13 09:50", value: 2 },
      { time: "2018-01-13 09:51", value: -6 },
      { time: "2018-01-13 09:52", value: -5 },
      { time: "2018-01-13 09:53", value: -9 },
      { time: "2018-01-13 09:54", value: -12 },
      { time: "2018-01-13 09:55", value: -6 },
      { time: "2018-01-13 09:56", value: -16 },
      { time: "2018-01-13 09:57", value: 2 },
      { time: "2018-01-13 09:58", value: -6 },
      { time: "2018-01-13 09:59", value: -5 },
      { time: "2018-01-13 10:00", value: -20 },
      { time: "2018-01-13 10:01", value: -12 },
      { time: "2018-01-13 10:02", value: 8 },
      { time: "2018-01-13 10:03", value: -10 },
      { time: "2018-01-13 10:04", value: -20 },
      { time: "2018-01-13 10:05", value: -6 },
      { time: "2018-01-13 10:06", value: -5 },
      { time: "2018-01-13 10:07", value: -9 },
      { time: "2018-01-13 10:08", value: -5 },
      { time: "2018-01-13 10:09", value: 9 },
      { time: "2018-01-13 10:10", value: 2 },
      { time: "2018-01-13 10:11", value: -8 },
      { time: "2018-01-13 10:12", value: 10 },
      { time: "2018-01-13 10:13", value: 4 },
      { time: "2018-01-13 10:14", value: -1 },
      { time: "2018-01-13 10:15", value: 3 },
      { time: "2018-01-13 10:16", value: -5 },
      { time: "2018-01-13 10:17", value: -1 },
      { time: "2018-01-13 10:18", value: -4 },
      { time: "2018-01-13 10:19", value: 0 },
      { time: "2018-01-13 10:20", value: 4 },
      { time: "2018-01-13 10:21", value: 5 },
      { time: "2018-01-13 10:22", value: 6 },
      { time: "2018-01-13 10:23", value: 20 },
      { time: "2018-01-13 10:24", value: 12 },
      { time: "2018-01-13 10:25", value: 8 },
      { time: "2018-01-13 10:26", value: 3 },
      { time: "2018-01-13 10:27", value: 2 },
      { time: "2018-01-13 10:28", value: 0 },
      { time: "2018-01-13 10:29", value: -3 },
      { time: "2018-01-13 10:30", value: 0 },
      { time: "2018-01-13 10:31", value: 4 },
      { time: "2018-01-13 10:32", value: 5 },
      { time: "2018-01-13 10:33", value: 3 },
      { time: "2018-01-13 10:34", value: 13 },
      { time: "2018-01-13 10:35", value: 16 },
      { time: "2018-01-13 10:36", value: 12 },
      { time: "2018-01-13 10:37", value: 11 },
      { time: "2018-01-13 10:38", value: 3 },
      { time: "2018-01-13 10:39", value: 13 },
      { time: "2018-01-13 10:40", value: 16 },
      { time: "2018-01-13 10:41", value: 12 },
      { time: "2018-01-13 10:42", value: 11 },
      { time: "2018-01-13 10:43", value: 3 },
      { time: "2018-01-13 10:44", value: 13 },
      { time: "2018-01-13 10:45", value: 22 },
      { time: "2018-01-13 10:46", value: 18 },
      { time: "2018-01-13 10:47", value: 22 },
      { time: "2018-01-13 10:48", value: 3 },
      { time: "2018-01-13 10:49", value: 13 },
      { time: "2018-01-13 10:50", value: 6 },
      { time: "2018-01-13 10:51", value: 12 },
      { time: "2018-01-13 10:52", value: 11 },
      { time: "2018-01-13 10:53", value: 3 },
      { time: "2018-01-13 10:54", value: 24 },
      { time: "2018-01-13 10:55", value: 2 },
      { time: "2018-01-13 10:56", value: -1 },
      { time: "2018-01-13 10:57", value: 2 },
      { time: "2018-01-13 10:58", value: -10 },
      { time: "2018-01-13 10:59", value: -5 },
      { time: "2018-01-13 11:00", value: -11 },
      { time: "2018-01-13 11:01", value: 4 },
      { time: "2018-01-13 11:02", value: 0 },
      { time: "2018-01-13 11:03", value: 5 },
      { time: "2018-01-13 11:04", value: -4 },
      { time: "2018-01-13 11:05", value: -19 },
      { time: "2018-01-13 11:06", value: 4 },
      { time: "2018-01-13 11:07", value: -1 },
      { time: "2018-01-13 11:08", value: 3 },
      { time: "2018-01-13 11:09", value: -5 },
      { time: "2018-01-13 11:10", value: -3 },
      { time: "2018-01-13 11:11", value: -10 },
      { time: "2018-01-13 11:12", value: -8 },
      { time: "2018-01-13 11:13", value: -10 },
      { time: "2018-01-13 11:14", value: 2 },
      { time: "2018-01-13 11:15", value: -10 },
      { time: "2018-01-13 11:16", value: 14 },
      { time: "2018-01-13 11:17", value: 16 },
      { time: "2018-01-13 11:18", value: 8 },
      { time: "2018-01-13 11:19", value: 12 },
      { time: "2018-01-13 11:20", value: 6 },
      { time: "2018-01-13 11:21", value: 17 },
      { time: "2018-01-13 11:22", value: 14 },
      { time: "2018-01-13 11:23", value: -15 },
      { time: "2018-01-13 11:24", value: -14 },
      { time: "2018-01-13 11:25", value: -8 },
      { time: "2018-01-13 11:26", value: -6 },
      { time: "2018-01-13 11:27", value: -3 },
      { time: "2018-01-13 11:28", value: -16 },
      { time: "2018-01-13 11:29", value: -8 },
      { time: "2018-01-13 11:30", value: 10 },
      { time: "2018-01-13 11:31", value: -8 },
      { time: "2018-01-13 11:32", value: -6 },
      { time: "2018-01-13 11:33", value: -3 },
      { time: "2018-01-13 11:34", value: 0 },
      { time: "2018-01-13 11:35", value: 4 },
      { time: "2018-01-13 11:36", value: -11 },
      { time: "2018-01-13 11:37", value: -8 },
      { time: "2018-01-13 11:38", value: -3 },
      { time: "2018-01-13 11:39", value: -2 },
      { time: "2018-01-13 11:40", value: -15 },
      { time: "2018-01-13 11:41", value: 9 },
      { time: "2018-01-13 11:42", value: 0 },
      { time: "2018-01-13 11:43", value: -1 },
      { time: "2018-01-13 11:44", value: -5 },
      { time: "2018-01-13 11:45", value: -1 },
      { time: "2018-01-13 11:46", value: -7 },
      { time: "2018-01-13 11:47", value: -4 },
      { time: "2018-01-13 11:48", value: -7 },
      { time: "2018-01-13 11:49", value: -8 },
      { time: "2018-01-13 11:50", value: -7 },
      { time: "2018-01-13 11:51", value: -6 },
      { time: "2018-01-13 11:52", value: -5 },
      { time: "2018-01-13 11:53", value: -6 },
      { time: "2018-01-13 11:54", value: 1 },
      { time: "2018-01-13 11:55", value: -3 },
      { time: "2018-01-13 11:56", value: 10 },
      { time: "2018-01-13 11:57", value: 15 },
      { time: "2018-01-13 11:58", value: 0 },
      { time: "2018-01-13 11:59", value: 0 },
    ];
  }

  getChart3() {
    // chatt petak warna warni
    let chart = am4core.create("chartCLimate3", am4charts.XYChart);
    // chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [
      {
        country: "Jan",
        visits: 3025,
      },
      {
        country: "Feb",
        visits: 1882,
      },
      {
        country: "Mar",
        visits: 1809,
      },
      {
        country: "Apr",
        visits: 1322,
      },
      {
        country: "May",
        visits: 1122,
      },
      {
        country: "Jun",
        visits: 1114,
      },
      {
        country: "July",
        visits: 984,
      },
      {
        country: "Aug",
        visits: 711,
      },
      {
        country: "Sep",
        visits: 665,
      },
      {
        country: "Oct",
        visits: 580,
      },
      {
        country: "Nov",
        visits: 443,
      },
      {
        country: "Dec",
        visits: 441,
      },
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    // categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

    // this.chart2 = chart;
  }

  getChart4() {
    // chart 2 line
    // let chart = am4core.create("chartReceipt", am4charts.XYChart);
    let chart = am4core.create("chartCLimate4", am4charts.XYChart);

    // Add data
    chart.data = [
      {
        month: "Jan",
        active: 89,
        inactive: 74,
      },
      {
        month: "Feb",
        active: 87,
        inactive: 73,
      },
      {
        month: "Mar",
        active: 86,
        inactive: 75,
      },
      {
        month: "Apr",
        active: 88,
        inactive: 76,
      },
      {
        month: "May",
        active: 87,
        inactive: 74,
      },
      {
        month: "Jun",
        active: 88,
        inactive: 73,
      },
      {
        month: "Jul",
        active: 89,
        inactive: 75,
      },
      {
        month: "Aug",
        active: 90,
        inactive: 76,
      },
      {
        month: "Sep",
        active: 89,
        inactive: 75,
      },
      {
        month: "Oct",
        active: 89,
        inactive: 76,
      },
      {
        month: "Nov",
        active: 87,
        inactive: 74,
      },
      {
        month: "Dec",
        active: 87,
        inactive: 75,
      },
    ];
    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    // categoryAxis.renderer.opposite = true;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.inversed = true;
    valueAxis.title.text = "Ferenheit";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "active";
    series1.dataFields.categoryX = "month";
    series1.name = "High";
    series1.strokeWidth = 3;
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "Amount {name} in {categoryX}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "inactive";
    series2.dataFields.categoryX = "month";
    series2.name = "Low";
    series2.strokeWidth = 3;
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "Amount {name} in {categoryX}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    // Add legend
    chart.legend = new am4charts.Legend();
  }

  getChart5() {
    // chart bar 2 line
    // let chart = am4core.create("chartReceipt", am4charts.XYChart);
    let chart = am4core.create("chartCLimate5", am4charts.XYChart);
    chart.colors.step = 2;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.maxWidth = 95;

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "category";
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    function createSeries(value, name) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = value;
      series.dataFields.categoryX = "category";
      series.name = name;

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      let bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.interactionsEnabled = false;
      bullet.dy = 30;
      bullet.label.text = "{valueY}";
      bullet.label.fill = am4core.color("#ffffff");

      return series;
    }

    chart.data = [
      {
        category: "Jan",
        first: 12,
        second: 12,
      },
      {
        category: "Feb",
        first: 13,
        second: 11,
      },
      {
        category: "Mar",
        first: 13,
        second: 11,
      },
      {
        category: "Apr",
        first: 13,
        second: 11,
      },
      {
        category: "May",
        first: 12,
        second: 12,
      },
      {
        category: "Jun",
        first: 11,
        second: 13,
      },
      {
        category: "Jul",
        first: 11,
        second: 13,
      },
    ];

    createSeries("first", "Day Time");
    createSeries("second", "Night Time");

    function arrangeColumns() {
      let series = chart.series.getIndex(0);

      let w =
        1 -
        xAxis.renderer.cellStartLocation -
        (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            } else {
              series.dummyData = chart.series.indexOf(series);
            }
          });
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta;

            series.animate(
              { property: "dx", to: dx },
              series.interpolationDuration,
              series.interpolationEasing
            );
            series.bulletsContainer.animate(
              { property: "dx", to: dx },
              series.interpolationDuration,
              series.interpolationEasing
            );
          });
        }
      }
    }
  }

  getChart6() {
    // pie chart
    // let chart = am4core.create("chartReceipt", am4charts.XYChart);
    let chart = am4core.create("chartCLimate6", am4charts.PieChart);

    // Add data
    chart.data = [
      {
        label: "SMS",
        amount: 501.9,
      },
      {
        label: "Email",
        amount: 301.9,
      },
      {
        label: "Printed",
        amount: 201.1,
      },
    ];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "amount";
    pieSeries.dataFields.category = "label";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);
  }
}
