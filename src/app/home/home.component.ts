import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToasterService } from 'angular2-toaster';
import { Chart } from 'chart.js';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ApiService],
 
})
export class HomeComponent implements OnInit, OnChanges {
  
  @Output() onOpenChange = new EventEmitter<boolean>();
  @Output() onDateChange = new EventEmitter<any>();
  from: any;
  to: any;
  @ViewChild('myDrop') dropdown: any;
  private toasterService: ToasterService;
  totalcount: any;
  toggle = localStorage.getItem('sidebartoggle');
  public count: number = 0;
  data: any;
  fileReaded: any;
  arrayBuffer: any;
  file: File;
  linechart: any;
  chartdata: any;
  statistics: any;
  loader: boolean = false;

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  constructor(private apiservice: ApiService, private router: Router, toasterService: ToasterService, private calendar: NgbCalendar,
    private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.toasterService = toasterService;
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var fromdate = d.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day;
    this.from = fromdate;
    var month = d.getMonth() + 2;
    var day = d.getDate();
    var todate = d.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day;
    this.to = todate;
  }

  ngOnInit() {
    /* STATISTICS FOR DASHBOARD */
    this.apiservice.statistics(this.from,this.to).subscribe(res => {
      if (res.status == true) {
        this.statistics = res.data;
      }
      else {
        this.toasterService.pop('error', 'Error', res.message);
      }
    });

    /* CHARTDATA FOR DASHBOARD */
    this.apiservice.chartdata().subscribe(data => {
      if (data.status == true) {
        let temparry = { 'month': [], 'courier': [], 'coustomer': [], 'na': [] };
        for (let i = 0; i < data.data.length; i++) {
          temparry['month'][i] = data.data[i]['order_date'];
          temparry['courier'][i] = data.data[i]['courier'];
          temparry['coustomer'][i] = data.data[i]['coustomer'];
          temparry['na'][i] = data.data[i]['na'];
        }
        this.chartdata = temparry;
        this.loader = true;
        if (temparry) {
          this.generatechart(this.chartdata);
        }
      }
      else {
        this.toasterService.pop('error', 'Error', data.message);
      }
    });
    if (this.from && this.to) {
      this.fromDate = this.ngbDateParserFormatter.parse(this.from);
      this.toDate = this.ngbDateParserFormatter.parse(this.to);
    }
  }

  ngOnChanges() {
    if (this.from && this.to) {
      this.fromDate = this.ngbDateParserFormatter.parse(this.from);
      this.toDate = this.ngbDateParserFormatter.parse(this.to);
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  openChange(event) {
    this.onOpenChange.emit(event);
  }

  dateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && this.isAfterOrSame(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    console.log(this.fromDate);
    console.log(this.toDate);
    this.pushDate();
  }

  private pushDate() {
    if (this.fromDate && this.toDate) {
      this.from = this.ngbDateParserFormatter.format(this.fromDate);
      this.to = this.ngbDateParserFormatter.format(this.toDate);
      this.onDateChange.emit({ from: this.from, to: this.to });
      this.dropdown.close();
    }
  }

  private isAfterOrSame(one: NgbDateStruct, two: NgbDateStruct) {
    if (!one || !two) {
      return false;
    }

    let parsedFrom = this.ngbDateParserFormatter.format(one);
    let parsedTo = this.ngbDateParserFormatter.format(two);
    if (moment(parsedFrom).isAfter(parsedTo) || moment(parsedFrom).isSame(parsedTo)) {
      return true;
    }

    return false;
  }

  generatechart(cdata) {
    var data = {
      labels: cdata.month,
      datasets: [
        {
          label: "Courier",
          backgroundColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          fill: true,
          borderColor: "#3cba9f",
          borderWidth: 0,
          data: cdata.courier
        },
        {
          label: "Coustomer",
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          fill: true,
          borderColor: "#3cba9f",
          borderWidth: 0,
          data: cdata.coustomer
        },
        {
          label: "Sell product",
          backgroundColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          fill: true,
          borderColor: "#3cba9f",
          borderWidth: 0,
          data: cdata.na
        }
      ],
    };

    this.linechart = new Chart('canvas', {
      type: 'bar',
      data: data,
      options: {
        elements: {
          rectangle: {
            borderWidth: 0,
          }
        },

        tooltips: {
          mode: 'index',
          intersect: true,
          borderWidth: 0,
          callbacks: {
            label: function (tooltipItem, data) {
              let Harpo = data.datasets[tooltipItem.datasetIndex].label;
              let valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              let total = 0;
              if (tooltipItem.datasetIndex != data.datasets.length - 1) {
                return Harpo + " : " + valor;
                // return Harpo + " : $" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
              } else {
                return [Harpo + " : " + valor];
                // return [Harpo + " : $" + valor, "Total : $" + total];
                // return [Harpo + " : $" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), "Total : $" + total];
              }
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            },
            gridLines: {
              drawBorder: false,
            },
          }],
          xAxes: [{
            gridLines: {
              display: false,
            },
          }]
        }
      }
    });
  }
  
  convertFile(csv: any) {

    /* this.fileReaded = csv.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);

    reader.onload = (e) => {
      let csv = reader.result;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(',');
      let lines = [];
      let r = 0;

      for (let i = 1; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }
          lines[i] = tarr;
        }
      }
      lines = $.grep(lines, function (n) { return (n); });
      console.log(lines);
    } */
  }

  incomingfile(event) {
    this.count = 0;
    $('.btn-upload').html("<i class='fas fa-spinner fa-spin'></i> Please wait...");
    $('.btn-upload').prop('disabled', true);
    this.file = event.target.files[0];

    $('.image-upload-wrap').hide();
    $('.file-upload-content').show();
    $('.excel_name').html(this.file.name);

    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[1];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1}));
      delete this.data["0"];
      let header = this.data[1];
      delete this.data["1"];
      this.data = $.grep(this.data, function (n) { return (n); });
      
      var index = 0;
      var arrayLength = this.data.length;
      var tempArray = [];

      for (index = 0; index < arrayLength; index += 500) {
        let myChunk = this.data.slice(index, index + 500);
        tempArray.push(myChunk);
      }
      this.data = tempArray;
      this.totalcount = this.data.length;
      console.log(this.data);

      /* EXCEL SHEET UPLOAD AND SAVE DATA */
      this.apiservice.insertdata(this.data[0]).subscribe(data => {
        if (data.status == true) {
          this.count++;
          console.log(this.count);
          if (this.count < this.totalcount) {
            this.insertdata(this.data[this.count]);
          }
          else {
            $('.btn-upload').html("UPLOAD FILE");
            $('.btn-upload').prop('disabled', false);
            this.toasterService.pop('success', 'Success', data.message);
          } 
        }
        else {
          $('.btn-upload').html("UPLOAD FILE");
          $('.btn-upload').prop('disabled', false);
          this.toasterService.pop('error', 'Error', data.message);
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  insertdata(data) {
    /* EXCEL SHEET UPLOAD AND SAVE DATA */
    this.apiservice.insertdata(data).subscribe(data => {
      if (data.status == true) {
        this.count++;
        console.log(this.count);
        if (this.count >= this.totalcount) {
          $('.btn-upload').html("UPLOAD FILE");
          $('.btn-upload').prop('disabled', false);
          this.toasterService.pop('success', 'Success', data.message);
        }
        if (this.count < this.totalcount) {
          this.insertdata(this.data[this.count])
        }
      }
      else {
        $('.btn-upload').html("UPLOAD FILE");
        $('.btn-upload').prop('disabled', false);
        this.toasterService.pop('error', 'Error', data.message);
      }
    });
  }

  Upload() {
    
    /* let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[1];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.apiservice.insertdata(XLSX.utils.sheet_to_json(worksheet, { raw: true })).subscribe(data => {
        console.log(data);
      });
    }
    fileReader.readAsArrayBuffer(this.file); */
  }
}
