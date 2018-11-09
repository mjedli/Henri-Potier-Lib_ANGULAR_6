import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Book } from '../model/book';
import { RootObject } from '../model/offre';

@Injectable({
  providedIn: 'root',
})

export class BookService {

    private booksUrl = 'http://henri-potier.xebia.fr/books/';

    private offresUrlPrefix = '/commercialOffers';

    constructor(private http: HttpClient) { }

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.booksUrl);
    }

    getOffres(books:Book[]): Observable<RootObject> {

        for (var i = 0; i < books.length; i++) {
            if (i == 0) {
                this.booksUrl = this.booksUrl + books[i].isbn;
            } else {
                this.booksUrl = this.booksUrl + "," + books[i].isbn;
            }
        }
        
        this.booksUrl = this.booksUrl + this.offresUrlPrefix;
        return this.http.get<RootObject>(this.booksUrl);
    }

}