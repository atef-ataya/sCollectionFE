import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit {
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;

    constructor(
        private ordersService: OrdersService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getOrders();
    }

    getOrders() {
        this.ordersService.getOrders().subscribe((orders: Order[]) => {
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
                this.ordersService.deleteOrder(orderId).subscribe(
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
