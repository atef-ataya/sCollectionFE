import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styles: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
    form: FormGroup = {} as FormGroup;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    isSubmitted = false;
    editmode = false;
    currentCategoryId?: string;
    endsubs$: Subject<any> = new Subject();

    // formbuilder to build reactive form in angular we use it as service
    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            color: ['#fff']
        });

        this._checkEditMode();
    }

    ngOnDestroy() {
        this.endsubs$.next();
        this.endsubs$.complete();
    }

    onCancel() {
        this.location.back();
    }
    onSubmit() {
        this.isSubmitted = true;

        if (this.form.invalid) {
            return;
        }
        const category: Category = {
            id: this.currentCategoryId,
            name: this.categoryForm.name.value,
            icon: this.categoryForm.icon.value,
            color: this.categoryForm.color.value
        };
        if (this.editmode) {
            this._updateCategory(category);
        } else {
            this._addCategory(category);
        }
    }

    get categoryForm() {
        return this.form.controls;
    }

    private _addCategory(category: Category) {
        this.categoriesService
            .createCategory(category)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (category: Category) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category ${category.name} is Created!`
                    });
                    timer(1000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is Not Created.'
                    });
                }
            );
    }

    private _updateCategory(category: Category) {
        this.categoriesService
            .updateCategory(category)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category is Updated!'
                    });
                    timer(1000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is Not Updated.'
                    });
                }
            );
    }

    private _checkEditMode() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentCategoryId = params.id;
                this.categoriesService
                    .getCategory(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((category) => {
                        this.categoryForm.name.setValue(category.name);
                        this.categoryForm.icon.setValue(category.icon);
                        this.categoryForm.color.setValue(category.color);
                    });
            }
        });
    }
}
