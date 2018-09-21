import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToasterService } from 'angular2-toaster';

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
  // count: any = 0;
  public count: number = 0;
  data: any;
  fileReaded: any;
  arrayBuffer: any;
  file: File;

  constructor(private apiservice: ApiService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    /* this.apiservice.getcurrencylist().subscribe(data => {
      console.log(data);
    }); */
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
