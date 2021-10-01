import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    apiURLUsers = environment.apiURL + 'users';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiURLUsers}`);
    }

    getUser(categoryId: string): Observable<User> {
        return this.http.get<User>(`${this.apiURLUsers}/${categoryId}`);
    }

    createUser(category: User): Observable<User> {
        return this.http.post<User>(`${this.apiURLUsers}`, category);
    }

    updateUser(category: User): Observable<User> {
        return this.http.put<User>(`${this.apiURLUsers}/${category.id}`, category);
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
    }
}
