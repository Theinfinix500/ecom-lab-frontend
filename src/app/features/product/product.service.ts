import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FilterMetadata } from 'primeng/api';
import { Observable } from 'rxjs';
import { Product } from './product.model';

export interface FindAllOptions {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  globalFilter?: string;
  globalFilterFields?: string[];
  filters?: {
    [s: string]: FilterMetadata;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  protected http: HttpClient = inject(HttpClient);

  getProducts({
    page = 1,
    size = 10,
    sort = '',
    order = 'ASC',
    globalFilterFields = [],
    globalFilter = '',
    filters
  }: FindAllOptions) {
    let request = `${this.apiUrl}?limit=${size}&page=${page}`;
    let params = new HttpParams();
    for (const key in filters) {
      if (
        filters[key] &&
        filters[key].value !== undefined &&
        filters[key].value !== null
      ) {
        params = params.set(key, JSON.stringify(filters[key]));
      }
    }

    if (sort !== '') {
      request = request + `&sort=${sort}&order=${order}`;
    }

    if (globalFilter) {
      request =
        request +
        `&globalFilter=${globalFilter}&globalFilterFields=${globalFilterFields}`;
    }

    return this.http.get<{ data: any[] }>(request, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
