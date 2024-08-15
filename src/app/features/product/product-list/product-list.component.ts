import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterMetadata } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  TableLazyLoadEvent,
  TableModule,
  TableRowSelectEvent
} from 'primeng/table';
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
export class ProductListComponent {
  router: Router = inject(Router);
  productService: ProductService = inject(ProductService);

  products!: Product[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
  value: any;
  totalRecords: number = 0;
  globalFilterFields: string[] = ['name', 'description'];

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

  onRowSelect(tableRowEvent: TableRowSelectEvent) {
    const {
      data: { id: productId }
    } = tableRowEvent;

    if (productId) this.router.navigate(['/products', productId]);
  }
}
