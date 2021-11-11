import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expenses } from './models/Expenses.model';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  titleList: string = "Lista wydatków";
  titleAdd: string = "Dopisz do listy";
  titleEdit: string = "Edytuj wiersz";
  title: string = this.titleAdd;
  expenses = new Array<Expenses>();
  displayedColumns: string[] = ['fees', 'food', 'chemistry', 'clothes', 'treatment', 'transport', 'house', 'another', 'delete', 'edit'];
  dataSource: any = null;
  expensesForm: FormGroup;
  pos: number = -1;
  isHiddenAdd: boolean = false;
    
  constructor(private excelService: ExcelService, private fb: FormBuilder) {
    this.expensesForm = this.fb.group({
      fees: ['', [Validators.max(2147483647), Validators.min(0)]],
      food: ['', [Validators.max(2147483647), Validators.min(0)]],
      chemistry: ['', [Validators.max(2147483647), Validators.min(0)]],
      clothes: ['', [Validators.max(2147483647), Validators.min(0)]],
      treatment: ['', [Validators.max(2147483647), Validators.min(0)]],
      transport: ['', [Validators.max(2147483647), Validators.min(0)]],
      house: ['', [Validators.max(2147483647), Validators.min(0)]],
      another: ['', [Validators.max(2147483647), Validators.min(0)]]
    });
  }

  ngOnInit(): void {  
    this.dataSource = new MatTableDataSource(this.expenses);
  }

  addExpense() {
    if (this.expensesForm.dirty && this.expensesForm.valid) {
      this.expenses.push({
        fees: this.expensesForm.value['fees'],
        food: this.expensesForm.value['food'],
        chemistry: this.expensesForm.value['chemistry'],
        clothes: this.expensesForm.value['clothes'],
        treatment: this.expensesForm.value['treatment'],
        transport: this.expensesForm.value['transport'],
        house: this.expensesForm.value['house'],
        another: this.expensesForm.value['another']
      });
      this.dataSource = new MatTableDataSource(this.expenses);
    }
  }

  clear() {
    this.expensesForm.reset();
  }

  deleteExpense(element: any) {
    this.expenses = this.expenses.filter( e => e !== element);
    this.dataSource = new MatTableDataSource(this.expenses);
  }

  editExpense(element: any) {
    this.pos = this.expenses.indexOf(element);
    this.expensesForm.get('fees')?.setValue(element.fees);
    this.expensesForm.get('food')?.setValue(element.food);
    this.expensesForm.get('chemistry')?.setValue(element.chemistry);
    this.expensesForm.get('clothes')?.setValue(element.clothes);
    this.expensesForm.get('treatment')?.setValue(element.treatment);
    this.expensesForm.get('transport')?.setValue(element.transport);
    this.expensesForm.get('house')?.setValue(element.house);
    this.expensesForm.get('another')?.setValue(element.another);
    this.isHiddenAdd = true;
    this.title = this.titleEdit;
  }

  saveExpense() {
    if (this.expensesForm.dirty && this.expensesForm.valid) {
      this.expenses[this.pos].fees = this.expensesForm.value['fees'];
      this.expenses[this.pos].food = this.expensesForm.value['food'];
      this.expenses[this.pos].chemistry = this.expensesForm.value['chemistry'];
      this.expenses[this.pos].clothes = this.expensesForm.value['clothes'];
      this.expenses[this.pos].treatment = this.expensesForm.value['treatment'];
      this.expenses[this.pos].transport = this.expensesForm.value['transport'];
      this.expenses[this.pos].house = this.expensesForm.value['house'];
      this.expenses[this.pos].another = this.expensesForm.value['another'];
      
      this.dataSource = new MatTableDataSource(this.expenses);
    }
  }

  cancel() {
    this.expensesForm.reset();
    this.pos = -1;
    this.isHiddenAdd = false;
    this.title = this.titleAdd;
  }

  sumFees() {
    return this.expenses.map(t => t.fees? t.fees : 0).reduce((acc, value) => acc + value, 0);
  }
  sumFood() {
    return this.expenses.map(t => t.food? t.food : 0).reduce((acc, value) => acc + value, 0);
  }
  sumChemistry() {
    return this.expenses.map(t => t.chemistry? t.chemistry : 0).reduce((acc, value) => acc + value, 0);
  }
  sumClothes() {
    return this.expenses.map(t => t.clothes? t.clothes : 0).reduce((acc, value) => acc + value, 0);
  }
  sumTreatment() {
    return this.expenses.map(t => t.treatment? t.treatment : 0).reduce((acc, value) => acc + value, 0);
  }
  sumTransport() {
    return this.expenses.map(t => t.transport? t.transport : 0).reduce((acc, value) => acc + value, 0);
  }
  sumHouse() {
    return this.expenses.map(t => t.house? t.house : 0).reduce((acc, value) => acc + value, 0);
  }
  sumAnother() {
    return this.expenses.map(t => t.another? t.another : 0).reduce((acc, value) => acc + value, 0);
  }

  exportXls() {
    this.excelService.exportAsExcelFile(this.expenses, 'wydatki');
  }

  onFileChange(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Nie można wybrać kilku plików');
    }

    this.excelService.readFromExcelFile(target).subscribe(e => {
      this.expenses = e;
      this.dataSource = new MatTableDataSource(this.expenses);
    });
  }

}

