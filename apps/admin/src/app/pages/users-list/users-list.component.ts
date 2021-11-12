import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '@bluebits/users';
import { User } from '@bluebits/users';
import * as countriesLib from 'i18n-iso-countries';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const require: (arg0: string) => countriesLib.LocaleData;

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html',
    styles: []
})
export class UsersListComponent implements OnInit, OnDestroy {
    users: User[] = [];
    countryName?: string;
    endsubs$: Subject<any> = new Subject();

    constructor(
        private usersService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getUsers();
    }

    ngOnDestroy() {
        this.endsubs$.next();
        this.endsubs$.complete();
    }
    deleteUser(userId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this User?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService
                    .deleteUser(userId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this._getUsers();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User is Deleted!' });
                        },
                        () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User is Not deleted.' });
                        }
                    );
            }
        });
    }

    _getCountry(countryName: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));

        countryName = countriesLib.getName(countryName, 'en');
        console.log(countryName);

        return countryName;
    }

    private _getUsers() {
        this.usersService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    updateUser(userId: string) {
        this.router.navigateByUrl(`users/form/${userId}`);
    }
}
