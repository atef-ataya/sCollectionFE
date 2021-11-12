import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CategoriesService, Product, ProductsService, Category } from '@bluebits/products';

@Component({
    selector: 'bluebits-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    selectedCategories: (string | undefined)[] | undefined;
    isCategoryPage: boolean | undefined;

    constructor(private prodService: ProductsService, private catService: CategoriesService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
            params.categoryid ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
        });
        this._getProducts();
        this._getCategories();
    }

    private _getProducts(categoriesFilter?: (string | undefined)[]) {
        this.prodService.getProducts(categoriesFilter).subscribe((products) => {
            this.products = products;
        });
    }

    private _getCategories() {
        this.catService.getCategories().subscribe((categories) => {
            this.categories = categories;
        });
    }

    categoryFilter() {
        this.selectedCategories = this.categories.filter((category) => category.checked).map((category) => category.id);
        this._getProducts(this.selectedCategories);
    }
}
