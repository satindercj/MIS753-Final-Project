import { Component } from "@angular/core";
import { formatNumber } from "@angular/common";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import axios from "axios";
import * as moment from "moment";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
} from "ng-apexcharts";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  pageTitle = "MIS 753 Final Project";
  api_key = "R3Y7HU5SANY66YRE";
  metaData = {};
  timeSeriesData = {};
  currentDayInfo = {
    date: "",
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
  };
  previousDayInfo = {
    date: "",
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
  };
  currentDay = 0;
  currentDate = "";
  previousDate = "";
  percentChange = 0;
  percentChangeImage: string;
  percentColor: string;
  sideMenuData = [];

  myControl = new FormControl();
  options = [
    "Apple Inc. (AAPL)",
    "Amazon.com, Inc. (AMZN)",
    "Alibaba Group (BABA)",
    "Alphabet Inc. (GOOGL)",
    "Axos Financial, Inc. (AX)",
    "Microsoft Corporation (MSFT)",
    "Facebook, Inc. (FB)",
    "Tesla, Inc. (TSLA)",
  ];
  filteredOptions: Observable<string[]>;

  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;

  constructor(private ngxService: NgxUiLoaderService) {
    this.getInitialData();

    // this.dayInfo = {
    //   date: moment().format('DD/MM/YY'),
    //   open: "20",
    //   high: "10",
    //   low: "15",
    //   close: "30",
    //   volume: "1000",
    // }
  }

  ngOnInit() {
    this.ngxService.start();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.filter(value))
    );
  }

  filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  async getInitialData() {
    const res = {
      data: {
        "Meta Data": {
          "1. Information": "Daily Prices (open, high, low, close) and Volumes",
          "2. Symbol": "AX",
          "3. Last Refreshed": "2021-04-30",
          "4. Output Size": "Compact",
          "5. Time Zone": "US/Eastern",
        },
        "Time Series (Daily)": {
          "2021-04-30": {
            "1. open": "45.1500",
            "2. high": "44.8200",
            "3. low": "48.2700",
            "4. close": "48.2700",
            "5. volume": "426790",
          },
          "2021-04-29": {
            "1. open": "46.0900",
            "2. high": "46.8900",
            "3. low": "46.0500",
            "4. close": "46.3100",
            "5. volume": "324524",
          },
          "2021-04-28": {
            "1. open": "45.6800",
            "2. high": "45.9700",
            "3. low": "45.0201",
            "4. close": "45.9700",
            "5. volume": "252544",
          },
          "2021-04-27": {
            "1. open": "45.3200",
            "2. high": "45.7900",
            "3. low": "44.9800",
            "4. close": "45.7900",
            "5. volume": "184094",
          },
          "2021-04-26": {
            "1. open": "46.1300",
            "2. high": "46.8800",
            "3. low": "45.4400",
            "4. close": "45.5700",
            "5. volume": "200590",
          },
          "2021-04-23": {
            "1. open": "44.4500",
            "2. high": "46.2500",
            "3. low": "44.4500",
            "4. close": "45.8800",
            "5. volume": "323036",
          },
          "2021-04-22": {
            "1. open": "45.3400",
            "2. high": "45.6990",
            "3. low": "44.2500",
            "4. close": "44.2600",
            "5. volume": "270479",
          },
          "2021-04-21": {
            "1. open": "44.4400",
            "2. high": "45.1600",
            "3. low": "44.0918",
            "4. close": "44.9200",
            "5. volume": "339928",
          },
          "2021-04-20": {
            "1. open": "46.6000",
            "2. high": "46.8300",
            "3. low": "44.1800",
            "4. close": "44.5300",
            "5. volume": "540838",
          },
          "2021-04-19": {
            "1. open": "46.7000",
            "2. high": "47.0000",
            "3. low": "45.7100",
            "4. close": "46.5700",
            "5. volume": "230109",
          },
          "2021-04-16": {
            "1. open": "47.6700",
            "2. high": "47.6700",
            "3. low": "46.4600",
            "4. close": "46.7200",
            "5. volume": "245565",
          },
          "2021-04-15": {
            "1. open": "47.6500",
            "2. high": "47.6500",
            "3. low": "46.1000",
            "4. close": "46.9800",
            "5. volume": "230569",
          },
          "2021-04-14": {
            "1. open": "46.7900",
            "2. high": "48.3600",
            "3. low": "46.7550",
            "4. close": "47.4800",
            "5. volume": "220057",
          },
          "2021-04-13": {
            "1. open": "47.7200",
            "2. high": "47.7200",
            "3. low": "45.9800",
            "4. close": "46.8400",
            "5. volume": "386583",
          },
          "2021-04-12": {
            "1. open": "48.6700",
            "2. high": "49.0900",
            "3. low": "47.9250",
            "4. close": "48.1100",
            "5. volume": "260802",
          },
          "2021-04-09": {
            "1. open": "48.3000",
            "2. high": "48.6400",
            "3. low": "47.8700",
            "4. close": "48.5300",
            "5. volume": "205199",
          },
          "2021-04-08": {
            "1. open": "47.6300",
            "2. high": "48.2499",
            "3. low": "46.6700",
            "4. close": "48.1300",
            "5. volume": "234047",
          },
          "2021-04-07": {
            "1. open": "48.0600",
            "2. high": "48.3900",
            "3. low": "47.2500",
            "4. close": "47.6400",
            "5. volume": "191560",
          },
          "2021-04-06": {
            "1. open": "48.2700",
            "2. high": "48.7900",
            "3. low": "47.8300",
            "4. close": "48.0100",
            "5. volume": "165851",
          },
          "2021-04-05": {
            "1. open": "48.1400",
            "2. high": "48.3900",
            "3. low": "47.5400",
            "4. close": "48.1300",
            "5. volume": "227226",
          },
          "2021-04-01": {
            "1. open": "47.1600",
            "2. high": "47.6200",
            "3. low": "46.1900",
            "4. close": "47.4900",
            "5. volume": "257867",
          },
          "2021-03-31": {
            "1. open": "47.5400",
            "2. high": "48.1400",
            "3. low": "46.9100",
            "4. close": "47.0100",
            "5. volume": "287407",
          },
          "2021-03-30": {
            "1. open": "46.6600",
            "2. high": "47.8900",
            "3. low": "46.6600",
            "4. close": "47.6700",
            "5. volume": "305465",
          },
          "2021-03-29": {
            "1. open": "47.7100",
            "2. high": "48.7000",
            "3. low": "46.1490",
            "4. close": "46.4500",
            "5. volume": "522263",
          },
          "2021-03-26": {
            "1. open": "47.8800",
            "2. high": "48.4200",
            "3. low": "47.3101",
            "4. close": "48.3200",
            "5. volume": "295199",
          },
          "2021-03-25": {
            "1. open": "45.3100",
            "2. high": "47.3700",
            "3. low": "45.0000",
            "4. close": "47.0000",
            "5. volume": "287597",
          },
          "2021-03-24": {
            "1. open": "47.4000",
            "2. high": "48.4200",
            "3. low": "45.6700",
            "4. close": "45.6900",
            "5. volume": "545876",
          },
          "2021-03-23": {
            "1. open": "48.4100",
            "2. high": "48.8700",
            "3. low": "46.2600",
            "4. close": "46.5900",
            "5. volume": "366260",
          },
          "2021-03-22": {
            "1. open": "51.0700",
            "2. high": "51.6950",
            "3. low": "48.8400",
            "4. close": "48.9200",
            "5. volume": "451076",
          },
          "2021-03-19": {
            "1. open": "52.1500",
            "2. high": "52.6000",
            "3. low": "50.1100",
            "4. close": "52.1200",
            "5. volume": "941450",
          },
          "2021-03-18": {
            "1. open": "53.5900",
            "2. high": "54.3600",
            "3. low": "52.1400",
            "4. close": "52.3500",
            "5. volume": "406619",
          },
          "2021-03-17": {
            "1. open": "52.4000",
            "2. high": "52.8100",
            "3. low": "51.8900",
            "4. close": "52.7700",
            "5. volume": "318895",
          },
          "2021-03-16": {
            "1. open": "51.7900",
            "2. high": "52.1100",
            "3. low": "50.8800",
            "4. close": "51.9200",
            "5. volume": "291368",
          },
          "2021-03-15": {
            "1. open": "51.9900",
            "2. high": "52.4500",
            "3. low": "50.5100",
            "4. close": "51.6400",
            "5. volume": "313643",
          },
          "2021-03-12": {
            "1. open": "51.9900",
            "2. high": "52.5000",
            "3. low": "51.4700",
            "4. close": "52.0600",
            "5. volume": "336970",
          },
          "2021-03-11": {
            "1. open": "50.1800",
            "2. high": "51.4000",
            "3. low": "49.9144",
            "4. close": "51.1500",
            "5. volume": "362177",
          },
          "2021-03-10": {
            "1. open": "48.9900",
            "2. high": "50.5500",
            "3. low": "48.9692",
            "4. close": "50.1600",
            "5. volume": "380620",
          },
          "2021-03-09": {
            "1. open": "48.8200",
            "2. high": "49.7950",
            "3. low": "48.0000",
            "4. close": "49.2800",
            "5. volume": "336127",
          },
          "2021-03-08": {
            "1. open": "48.5500",
            "2. high": "49.5400",
            "3. low": "48.2800",
            "4. close": "48.9400",
            "5. volume": "248895",
          },
          "2021-03-05": {
            "1. open": "47.9200",
            "2. high": "48.0650",
            "3. low": "45.9700",
            "4. close": "47.8300",
            "5. volume": "344010",
          },
          "2021-03-04": {
            "1. open": "48.2500",
            "2. high": "49.3100",
            "3. low": "46.3750",
            "4. close": "47.0400",
            "5. volume": "508173",
          },
          "2021-03-03": {
            "1. open": "47.6000",
            "2. high": "49.3900",
            "3. low": "47.4400",
            "4. close": "48.2200",
            "5. volume": "409370",
          },
          "2021-03-02": {
            "1. open": "47.7300",
            "2. high": "48.1200",
            "3. low": "47.0500",
            "4. close": "47.3500",
            "5. volume": "249752",
          },
          "2021-03-01": {
            "1. open": "47.3300",
            "2. high": "47.8700",
            "3. low": "46.6500",
            "4. close": "47.8300",
            "5. volume": "179341",
          },
          "2021-02-26": {
            "1. open": "46.3700",
            "2. high": "46.9500",
            "3. low": "45.0800",
            "4. close": "46.2700",
            "5. volume": "417294",
          },
          "2021-02-25": {
            "1. open": "47.8700",
            "2. high": "47.9700",
            "3. low": "46.2150",
            "4. close": "46.7100",
            "5. volume": "271228",
          },
          "2021-02-24": {
            "1. open": "46.4500",
            "2. high": "48.4400",
            "3. low": "46.4500",
            "4. close": "47.5800",
            "5. volume": "427137",
          },
          "2021-02-23": {
            "1. open": "45.7600",
            "2. high": "46.2800",
            "3. low": "44.8800",
            "4. close": "46.0800",
            "5. volume": "264777",
          },
          "2021-02-22": {
            "1. open": "44.7000",
            "2. high": "46.4100",
            "3. low": "44.7000",
            "4. close": "45.8700",
            "5. volume": "337283",
          },
          "2021-02-19": {
            "1. open": "43.9000",
            "2. high": "45.0600",
            "3. low": "43.7400",
            "4. close": "45.0600",
            "5. volume": "456114",
          },
          "2021-02-18": {
            "1. open": "43.4700",
            "2. high": "44.1400",
            "3. low": "43.1000",
            "4. close": "43.5900",
            "5. volume": "361404",
          },
          "2021-02-17": {
            "1. open": "43.9900",
            "2. high": "44.3100",
            "3. low": "43.5400",
            "4. close": "43.6200",
            "5. volume": "271016",
          },
          "2021-02-16": {
            "1. open": "45.5400",
            "2. high": "45.5400",
            "3. low": "44.2350",
            "4. close": "44.3200",
            "5. volume": "296369",
          },
          "2021-02-12": {
            "1. open": "44.6300",
            "2. high": "45.1200",
            "3. low": "44.4000",
            "4. close": "45.0200",
            "5. volume": "235323",
          },
          "2021-02-11": {
            "1. open": "45.6200",
            "2. high": "46.1300",
            "3. low": "44.1500",
            "4. close": "44.9000",
            "5. volume": "346493",
          },
          "2021-02-10": {
            "1. open": "45.6900",
            "2. high": "46.0500",
            "3. low": "44.9100",
            "4. close": "45.4500",
            "5. volume": "269957",
          },
          "2021-02-09": {
            "1. open": "44.4100",
            "2. high": "45.6300",
            "3. low": "44.1500",
            "4. close": "45.4400",
            "5. volume": "188938",
          },
          "2021-02-08": {
            "1. open": "44.1200",
            "2. high": "44.6900",
            "3. low": "43.8150",
            "4. close": "44.4200",
            "5. volume": "239574",
          },
          "2021-02-05": {
            "1. open": "43.2800",
            "2. high": "44.0500",
            "3. low": "42.5200",
            "4. close": "43.9500",
            "5. volume": "280789",
          },
          "2021-02-04": {
            "1. open": "42.2100",
            "2. high": "43.2300",
            "3. low": "41.9500",
            "4. close": "43.1200",
            "5. volume": "261538",
          },
          "2021-02-03": {
            "1. open": "41.7500",
            "2. high": "42.1800",
            "3. low": "41.0500",
            "4. close": "42.0000",
            "5. volume": "239849",
          },
          "2021-02-02": {
            "1. open": "40.5400",
            "2. high": "42.4000",
            "3. low": "40.0300",
            "4. close": "41.9800",
            "5. volume": "403152",
          },
          "2021-02-01": {
            "1. open": "39.9800",
            "2. high": "40.1200",
            "3. low": "38.9600",
            "4. close": "40.0300",
            "5. volume": "386760",
          },
          "2021-01-29": {
            "1. open": "40.9800",
            "2. high": "41.7600",
            "3. low": "38.7600",
            "4. close": "38.9500",
            "5. volume": "400605",
          },
          "2021-01-28": {
            "1. open": "39.8400",
            "2. high": "40.4800",
            "3. low": "39.4292",
            "4. close": "40.1300",
            "5. volume": "394778",
          },
          "2021-01-27": {
            "1. open": "39.5200",
            "2. high": "39.6600",
            "3. low": "38.3200",
            "4. close": "39.2600",
            "5. volume": "374218",
          },
          "2021-01-26": {
            "1. open": "41.5600",
            "2. high": "41.5700",
            "3. low": "40.4001",
            "4. close": "40.5300",
            "5. volume": "394101",
          },
          "2021-01-25": {
            "1. open": "41.6300",
            "2. high": "41.6300",
            "3. low": "40.2800",
            "4. close": "41.1300",
            "5. volume": "455710",
          },
          "2021-01-22": {
            "1. open": "40.7400",
            "2. high": "41.7700",
            "3. low": "40.0000",
            "4. close": "41.7400",
            "5. volume": "364580",
          },
          "2021-01-21": {
            "1. open": "42.6000",
            "2. high": "42.6000",
            "3. low": "41.0000",
            "4. close": "41.0200",
            "5. volume": "223329",
          },
          "2021-01-20": {
            "1. open": "41.9800",
            "2. high": "42.4800",
            "3. low": "41.6700",
            "4. close": "42.2600",
            "5. volume": "246816",
          },
          "2021-01-19": {
            "1. open": "42.4200",
            "2. high": "42.5880",
            "3. low": "41.6101",
            "4. close": "42.1600",
            "5. volume": "202238",
          },
          "2021-01-15": {
            "1. open": "41.5500",
            "2. high": "42.1200",
            "3. low": "41.1800",
            "4. close": "41.8000",
            "5. volume": "177288",
          },
          "2021-01-14": {
            "1. open": "41.5900",
            "2. high": "42.4400",
            "3. low": "41.2900",
            "4. close": "42.0200",
            "5. volume": "287806",
          },
          "2021-01-13": {
            "1. open": "42.2600",
            "2. high": "42.2600",
            "3. low": "40.7850",
            "4. close": "41.1400",
            "5. volume": "226218",
          },
          "2021-01-12": {
            "1. open": "42.3600",
            "2. high": "43.4800",
            "3. low": "42.2806",
            "4. close": "42.3900",
            "5. volume": "366688",
          },
          "2021-01-11": {
            "1. open": "40.5800",
            "2. high": "42.1700",
            "3. low": "40.5800",
            "4. close": "42.1300",
            "5. volume": "231912",
          },
          "2021-01-08": {
            "1. open": "41.6000",
            "2. high": "41.6700",
            "3. low": "40.5100",
            "4. close": "41.0500",
            "5. volume": "369096",
          },
          "2021-01-07": {
            "1. open": "41.0200",
            "2. high": "41.8900",
            "3. low": "40.7800",
            "4. close": "41.5400",
            "5. volume": "380543",
          },
          "2021-01-06": {
            "1. open": "38.2500",
            "2. high": "41.4000",
            "3. low": "38.2500",
            "4. close": "40.6300",
            "5. volume": "649561",
          },
          "2021-01-05": {
            "1. open": "36.8200",
            "2. high": "37.5100",
            "3. low": "36.8200",
            "4. close": "37.2800",
            "5. volume": "212773",
          },
          "2021-01-04": {
            "1. open": "37.6300",
            "2. high": "37.8900",
            "3. low": "36.1600",
            "4. close": "36.8200",
            "5. volume": "236039",
          },
          "2020-12-31": {
            "1. open": "37.2800",
            "2. high": "37.8500",
            "3. low": "37.1300",
            "4. close": "37.5300",
            "5. volume": "208589",
          },
          "2020-12-30": {
            "1. open": "37.1500",
            "2. high": "37.9000",
            "3. low": "37.1500",
            "4. close": "37.3400",
            "5. volume": "153828",
          },
          "2020-12-29": {
            "1. open": "37.5300",
            "2. high": "37.5850",
            "3. low": "36.7116",
            "4. close": "37.1000",
            "5. volume": "208461",
          },
          "2020-12-28": {
            "1. open": "37.8000",
            "2. high": "38.0150",
            "3. low": "37.2700",
            "4. close": "37.4700",
            "5. volume": "240440",
          },
          "2020-12-24": {
            "1. open": "37.6700",
            "2. high": "37.7700",
            "3. low": "37.2077",
            "4. close": "37.7100",
            "5. volume": "100537",
          },
          "2020-12-23": {
            "1. open": "36.8700",
            "2. high": "37.5000",
            "3. low": "36.7200",
            "4. close": "37.4100",
            "5. volume": "178892",
          },
          "2020-12-22": {
            "1. open": "37.1300",
            "2. high": "37.3582",
            "3. low": "36.5900",
            "4. close": "36.7300",
            "5. volume": "217882",
          },
          "2020-12-21": {
            "1. open": "36.5000",
            "2. high": "37.0800",
            "3. low": "36.3200",
            "4. close": "37.0300",
            "5. volume": "327228",
          },
          "2020-12-18": {
            "1. open": "37.1400",
            "2. high": "37.5100",
            "3. low": "36.3000",
            "4. close": "36.6100",
            "5. volume": "1116545",
          },
          "2020-12-17": {
            "1. open": "36.7700",
            "2. high": "37.2400",
            "3. low": "36.3200",
            "4. close": "37.0600",
            "5. volume": "280577",
          },
          "2020-12-16": {
            "1. open": "36.8000",
            "2. high": "37.0000",
            "3. low": "36.4442",
            "4. close": "36.6900",
            "5. volume": "280798",
          },
          "2020-12-15": {
            "1. open": "35.9600",
            "2. high": "36.7900",
            "3. low": "35.5900",
            "4. close": "36.6000",
            "5. volume": "347147",
          },
          "2020-12-14": {
            "1. open": "36.2700",
            "2. high": "36.4400",
            "3. low": "35.4000",
            "4. close": "35.4500",
            "5. volume": "269583",
          },
          "2020-12-11": {
            "1. open": "35.3600",
            "2. high": "35.8981",
            "3. low": "35.2400",
            "4. close": "35.7600",
            "5. volume": "292470",
          },
          "2020-12-10": {
            "1. open": "35.4700",
            "2. high": "35.6900",
            "3. low": "34.9200",
            "4. close": "35.5800",
            "5. volume": "214738",
          },
          "2020-12-09": {
            "1. open": "36.0000",
            "2. high": "36.4900",
            "3. low": "35.5600",
            "4. close": "35.5800",
            "5. volume": "460345",
          },
          "2020-12-08": {
            "1. open": "35.1700",
            "2. high": "35.9000",
            "3. low": "35.1700",
            "4. close": "35.4300",
            "5. volume": "473127",
          },
          "2020-12-07": {
            "1. open": "34.7100",
            "2. high": "35.8600",
            "3. low": "34.5000",
            "4. close": "35.6400",
            "5. volume": "229754",
          },
        },
      },
    };

    this.metaData = res.data["Meta Data"];
    this.timeSeriesData = res.data["Time Series (Daily)"];

    this.timeSeriesData = res.data["Time Series (Daily)"];

    this.currentDate = Object.keys(this.timeSeriesData)[this.currentDay];
    this.previousDate = Object.keys(this.timeSeriesData)[this.currentDay + 1];

    this.currentDayInfo = {
      date: moment(this.currentDate).format("MM/DD/YYYY"),
      open: this.timeSeriesData[this.currentDate]["1. open"],
      high: this.timeSeriesData[this.currentDate]["2. high"],
      low: this.timeSeriesData[this.currentDate]["3. low"],
      close: this.timeSeriesData[this.currentDate]["4. close"],
      volume: this.timeSeriesData[this.currentDate]["5. volume"],
    };

    this.previousDayInfo = {
      date: moment(this.previousDate).format("MM/DD/YYYY"),
      open: this.timeSeriesData[this.previousDate]["1. open"],
      high: this.timeSeriesData[this.previousDate]["2. high"],
      low: this.timeSeriesData[this.previousDate]["3. low"],
      close: this.timeSeriesData[this.previousDate]["4. close"],
      volume: this.timeSeriesData[this.previousDate]["5. volume"],
    };

    this.percentChange =
      ((this.currentDayInfo.close - this.previousDayInfo.close) /
        this.previousDayInfo.close) *
      100;

    if (this.percentChange >= 0) {
      this.percentChangeImage = "../assets/pics/up-arrow.png";
      this.percentColor = "#01ce53";
    } else {
      this.percentChangeImage = "../assets/pics/down-arrow.png";
      this.percentColor = "#D91414";
    }

    await this.initSideMenuData();
    await this.initChartData();

    this.ngxService.stop();

    /*await axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AX&outputsize=compact&apikey=${this.api_key}`
      )
      .then(async (res) => {
        console.log(res);
        this.metaData = res.data["Meta Data"];
        this.timeSeriesData = res.data["Time Series (Daily)"];

        this.currentDate = Object.keys(this.timeSeriesData)[this.currentDay];
        this.previousDate = Object.keys(this.timeSeriesData)[
          this.currentDay + 1
        ];

        this.currentDayInfo = {
          date: moment(this.currentDate).format("MM/DD/YYYY"),
          open: this.timeSeriesData[this.currentDate]["1. open"],
          high: this.timeSeriesData[this.currentDate]["2. high"],
          low: this.timeSeriesData[this.currentDate]["3. low"],
          close: this.timeSeriesData[this.currentDate]["4. close"],
          volume: this.timeSeriesData[this.currentDate]["5. volume"],
        };

        this.previousDayInfo = {
          date: moment(this.previousDate).format("MM/DD/YYYY"),
          open: this.timeSeriesData[this.previousDate]["1. open"],
          high: this.timeSeriesData[this.previousDate]["2. high"],
          low: this.timeSeriesData[this.previousDate]["3. low"],
          close: this.timeSeriesData[this.previousDate]["4. close"],
          volume: this.timeSeriesData[this.previousDate]["5. volume"],
        };

        this.percentChange =
          ((this.currentDayInfo.close - this.previousDayInfo.close) /
            this.previousDayInfo.close) *
          100;

        if (this.percentChange >= 0) {
          this.percentChangeImage = "../assets/pics/up-arrow.png";
          this.percentColor = "#01ce53";
        } else {
          this.percentChangeImage = "../assets/pics/down-arrow.png";
          this.percentColor = "#D91414";
        }

        await this.initSideMenuData();
        await this.initChartData();

        this.ngxService.stop();
      });
      */
  }

  initSideMenuData() {
    this.sideMenuData = [];
    //for (let i = 0; i < Object.keys(this.timeSeriesData).length - 1; i++)

    for (let i = 0; i < 10; i++) {
      this.sideMenuData.push({
        date: moment(Object.keys(this.timeSeriesData)[i]).format("MM/DD/YYYY"),
        open: this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
          "1. open"
        ],
        high: this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
          "2. high"
        ],
        low: this.timeSeriesData[Object.keys(this.timeSeriesData)[i]]["3. low"],
        close: this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
          "4. close"
        ],
        volume: this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
          "5. volume"
        ],
        percentChange:
          ((this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
            "4. close"
          ] -
            this.timeSeriesData[Object.keys(this.timeSeriesData)[i + 1]][
              "4. close"
            ]) /
            this.timeSeriesData[Object.keys(this.timeSeriesData)[i + 1]][
              "4. close"
            ]) *
          100,
        percentChangeImage:
          ((this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
            "4. close"
          ] -
            this.timeSeriesData[Object.keys(this.timeSeriesData)[i + 1]][
              "4. close"
            ]) /
            this.timeSeriesData[Object.keys(this.timeSeriesData)[i + 1]][
              "4. close"
            ]) *
            100 >=
          0
            ? "../assets/pics/up-arrow.png"
            : "../assets/pics/down-arrow.png",
        percentColor:
          ((this.timeSeriesData[Object.keys(this.timeSeriesData)[i]][
            "4. close"
          ] -
            this.timeSeriesData[Object.keys(this.timeSeriesData)[i + 1]][
              "4. close"
            ]) /
            this.timeSeriesData[Object.keys(this.timeSeriesData)[i + 1]][
              "4. close"
            ]) *
            100 >=
          0
            ? "#01ce53"
            : "#D91414",
      });
    }
  }

  initChartData() {
    let dates = [];

    for (let i = Object.keys(this.timeSeriesData).length - 1; i > 0; i--) {
      dates.push([
        Object.keys(this.timeSeriesData)[i],
        this.timeSeriesData[Object.keys(this.timeSeriesData)[i]]["4. close"],
      ]);
    }

    this.series = [
      {
        name: this.metaData["2. Symbol"],
        data: dates,
        color: "#8f83ff",
      },
    ];

    this.chart = {
      type: "area",
      stacked: false,
      foreColor: "#969292",
      height: "auto",

      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    };
    this.dataLabels = {
      enabled: false,
    };
    this.markers = {
      size: 0,
      colors: ["#22a8ee"],
    };
    this.title = {
      text: "Stock Price Movement",
      align: "left",
      style: {
        fontSize: "20",
        fontWeight: 700,
        color: "#22a8ee",
      },
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };
    this.yaxis = {
      labels: {
        formatter: function (val, index) {
          return "$" + val.toFixed(2);
        },
      },
    };
    this.xaxis = {
      type: "datetime",
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function (val) {
          return "$" + val.toFixed(2);
        },
      },
    };
  }

  updateInfo(historicalDay) {
    this.currentDayInfo = historicalDay;
    this.percentChange = historicalDay.percentChange;
    if (this.percentChange >= 0) {
      this.percentChangeImage = "../assets/pics/up-arrow.png";
      this.percentColor = "#01ce53";
    } else {
      this.percentChangeImage = "../assets/pics/down-arrow.png";
      this.percentColor = "#D91414";
    }
    window.scrollTo({ top: 0, behavior: `smooth` });
  }

  async getSearchData(searchEvent) {
    let keyVal = searchEvent.split("(").pop().split(")")[0];

    this.ngxService.start();
    await axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${keyVal}&outputsize=compact&apikey=${this.api_key}`
      )
      .then(async (res) => {
        this.metaData = res.data["Meta Data"];
        this.timeSeriesData = res.data["Time Series (Daily)"];

        this.currentDate = Object.keys(this.timeSeriesData)[this.currentDay];
        this.previousDate = Object.keys(this.timeSeriesData)[
          this.currentDay + 1
        ];

        this.currentDayInfo = {
          date: moment(this.currentDate).format("MM/DD/YYYY"),
          open: this.timeSeriesData[this.currentDate]["1. open"],
          high: this.timeSeriesData[this.currentDate]["2. high"],
          low: this.timeSeriesData[this.currentDate]["3. low"],
          close: this.timeSeriesData[this.currentDate]["4. close"],
          volume: this.timeSeriesData[this.currentDate]["5. volume"],
        };

        this.previousDayInfo = {
          date: moment(this.previousDate).format("MM/DD/YYYY"),
          open: this.timeSeriesData[this.previousDate]["1. open"],
          high: this.timeSeriesData[this.previousDate]["2. high"],
          low: this.timeSeriesData[this.previousDate]["3. low"],
          close: this.timeSeriesData[this.previousDate]["4. close"],
          volume: this.timeSeriesData[this.previousDate]["5. volume"],
        };

        this.percentChange =
          ((this.currentDayInfo.close - this.previousDayInfo.close) /
            this.previousDayInfo.close) *
          100;

        if (this.percentChange >= 0) {
          this.percentChangeImage = "../assets/pics/up-arrow.png";
          this.percentColor = "#01ce53";
        } else {
          this.percentChangeImage = "../assets/pics/down-arrow.png";
          this.percentColor = "#D91414";
        }

        await this.initSideMenuData();
        await this.initChartData();

        this.ngxService.stop();
      });
  }
}
