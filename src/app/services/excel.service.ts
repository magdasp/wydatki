import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Expenses } from '../body/models/Expenses.model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

private data = new Array<Expenses>();
private newData = new Subject<Expenses[]>();

constructor() { }
public exportAsExcelFile(json: any[], excelFileName: string): void {

  //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {header: ['kod','nazwa']});
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'Arkusz1': worksheet }, SheetNames: ['Arkusz1'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  this.saveAsExcelFile(excelBuffer, excelFileName);
}


private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

   let dateYear = new Date().getFullYear().toString();
   let dateMonth = ('0' + (new Date().getMonth() + 1).toString()).slice(-2);

   FileSaver.saveAs(data, fileName + '_' + dateYear + dateMonth + EXCEL_EXTENSION);
}


readFromExcelFile(target: DataTransfer):  Observable<Expenses[]> {
  const reader: FileReader = new FileReader();
  reader.readAsBinaryString(target.files[0]);
  reader.onload = (e: any) => {
    /* create workbook */
    const binarystr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

    /* selected the first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.data = XLSX.utils.sheet_to_json(ws);
    this.newData.next(this.data);
  };
  return this.newData.asObservable();
  }
}
