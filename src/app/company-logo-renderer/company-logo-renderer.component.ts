import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-company-logo-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
      <span *ngIf="value"><img [alt]="value" [src]="'https://www.ag-grid.com/example-assets/space-company-logos/' + value.toLowerCase() + '.png'" />
          <p>{{ value }}</p></span>`,
  styles: ["img {display: block; width: 25px; height: auto; maxHeight: 50%; margin-right: 12px; filter: brightness(1.2);} span {display: flex; height: 100%; width: 100%; align-items: center} p { text-overflow: ellipsis; overflow: hidden; white-space: nowrap }"]
})

export class CompanyLogoRenderer implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;

  agInit(params: any): void {
    this.value = params.value;
  }

  // Return Cell Value
  refresh(params: any): boolean {
    this.value = params.value;
    return true;
  }
}
