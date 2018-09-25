import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToasterService } from 'angular2-toaster';
import { Chart } from 'chart.js';

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ApiService],
})
export class HomeComponent implements OnInit {

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
  loader: boolean = false;

  constructor(private apiservice: ApiService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.apiservice.chartdata().subscribe(data => {
      if(data.status == true) {
        let temparry = { 'month': [], 'courier': [], 'coustomer': [], 'na': []};
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
          label: "NA",
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
