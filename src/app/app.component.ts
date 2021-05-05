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
  stockTitle: string | string[];

  myControl = new FormControl();
  options = [
    "Apple Inc. (AAPL)",
    "Amazon.com, Inc. (AMZN)",
    "Alibaba Group (BABA)",
    "Alphabet Inc. (GOOGL)",
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
    await axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&outputsize=compact&apikey=${this.api_key}`
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

        this.options.map((stock) => {
          if (stock.split(/[()]/)[1] === this.metaData["2. Symbol"]) {
            this.stockTitle = stock;
          }
        });

        await this.initSideMenuData();
        await this.initChartData();

        this.ngxService.stop();
      });
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

        this.options.map((stock) => {
          if (stock.split(/[()]/)[1] === this.metaData["2. Symbol"]) {
            this.stockTitle = stock;
          }
        });

        await this.initSideMenuData();
        await this.initChartData();

        this.ngxService.stop();
      });
  }
}
