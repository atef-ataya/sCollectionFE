import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;
    endsubs$: Subject<any> = new Subject();

    constructor(
        private ordersService: OrdersService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getOrders();
    }

    ngOnDestroy() {
        this.endsubs$.next();
        this.endsubs$.complete();
    }

    getOrders() {
        this.ordersService
            .getOrders()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((orders: Order[]) => {
                this.orders = orders;
            });
    }

    showOrder(orderId: any) {
        this.router.navigateByUrl(`orders/${orderId}`);
    }
    deleteOrder(orderId: string) {
        console.log(orderId);
        this.confirmationService.confirm({
            message: 'Do you want to delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ordersService
                    .deleteOrder(orderId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this.getOrders();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order is Deleted!' });
                        },
                        () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order is Not deleted.' });
                        }
                    );
            }
        });
    }
}
