import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, GridApi, GridReadyEvent, ITextFilterParams, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy, ValueFormatterParams, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { CompanyLogoRenderer } from './company-logo-renderer/company-logo-renderer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AgGridModule, HttpClientModule, CompanyLogoRenderer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  themeClass = "ag-theme-material";

  // Default Column Definitions: Apply configuration across all columns
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
    filter: true,
    floatingFilter: true,
    editable: false,
  };
  rowData: any[] = [
    { mission: "Voyager", company: "NASA", location: "Cape Canaveral", date: "1977-09-05", rocket: "Titan-Centaur ", price: 86580000, successful: true },
    { mission: "Apollo 13", company: "NASA", location: "Kennedy Space Center", date: "1970-04-11", rocket: "Saturn V", price: 3750000, successful: false },
    { mission: "Falcon 9", company: "SpaceX", location: "Cape Canaveral", date: "2015-12-22", rocket: "Falcon 9", price: 9750000, successful: true }
  ];
  // Column Definitions: Defines & controls grid columns.
  colDefs: any[] = [
    {
      headerName: 'Athlete Details',
      children: [
        { field: 'mission' },
        { field: 'company', editable: true },
      ]
    },
    {
      headerName: 'Sports Results',
      children: [
        { field: 'price' },
        { field: 'total', columnGroupShow: 'closed' },
        { field: 'date', columnGroupShow: 'open' },
      ]
    },

    {
      field: "mission", filter: true, filterParams: {
        buttons: ['clear', 'apply'],
      } as ITextFilterParams
    },
    { field: "company", cellRenderer: CompanyLogoRenderer, filter: 'agSetColumnFilter' },
    { field: "location", filter: true },
    { field: "date" },
    { field: "price", valueFormatter: (params: ValueFormatterParams) => { return '£' + params.value.toLocaleString(); } },
    { field: "successful", editable: true },
    { field: "rocket" }
  ];
  title = 'NgWithAgGridDemo';
  public autoSizeStrategy:
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy = { type: 'fitGridWidth' };
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100, 200, 500, 1000];
  private gridApi!: GridApi;

  constructor(private http: HttpClient) {}

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    const eventStr = JSON.stringify(event.data);
    console.log(`New Cell Value: ${eventStr} ${event.value}`);
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
        .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
        .subscribe(data => this.rowData = data);
  }

  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  onBtnUpdate() {
    (document.querySelector(
        '#csvResult'
    ) as any).value = this.gridApi.getDataAsCsv();
  }
}
