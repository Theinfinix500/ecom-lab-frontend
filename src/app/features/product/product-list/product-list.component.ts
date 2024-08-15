import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterMetadata } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products!: Product[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
  value: any;
  totalRecords: number = 0;
  globalFilterFields: string[] = ['name', 'description'];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
    ];
  }

  loadProducts(tableEvent: TableLazyLoadEvent) {
    this.loading = true;

    const page = tableEvent.first! / tableEvent.rows! + 1;
    const size = tableEvent.rows!;
    const sort = tableEvent.sortField as string;
    const order = tableEvent.sortOrder === 1 ? 'ASC' : 'DESC';
    const globalFilter = tableEvent.globalFilter as string;
    const filters = tableEvent.filters as { [s: string]: FilterMetadata };

    this.productService
      .getProducts({
        page,
        size,
        sort,
        order,
        globalFilter,
        globalFilterFields: this.globalFilterFields,
        filters
      })
      .subscribe(result => {
        this.products = (result as any).data;
        this.totalRecords = (result as any).count;
        this.loading = false;
      });
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;

      default:
        return undefined;
    }
  }
}
