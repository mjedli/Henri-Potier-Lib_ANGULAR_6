import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Book } from '../model/book';
import { RootObject } from '../model/offre';

import { BookService } from '../services/book.service';

@Component({
  selector: 'cart-root',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

    constructor(private bookService: BookService) { }

    books: Book[];
    offres: RootObject;

    offreReduction = "";
    totalPrice = 0;
    totalAfterReduction = 0;

    private cartNumberOfProduct = 0;

    ngOnInit() {

        var count = localStorage.getItem("cartNumberOfProductItem");
        
        if (count == null || count == "null") {
            this.cartNumberOfProduct = 0;
        } else {
            this.cartNumberOfProduct = parseInt(count);
        }

        var currentBooks = [];

        for (var i = 1; i <= this.cartNumberOfProduct; i++) {
            
            var current = localStorage.getItem("product_"+i);
            var tab = current.split("#");

            var currentBook = {
                isbn: tab[1],
                title: tab[0],
                price: parseInt(tab[2]),
                cover: '',
                synopsis : ''
              };

            this.totalPrice = this.totalPrice + parseInt(tab[2]);
            currentBooks.push(currentBook);
        }

        this.books = currentBooks;

        try {
            this.bookService.getOffres(this.books).toPromise().then(resp => {
                this.offres = resp;
            },
            error => {
                console.log(error, "error");
            }).then(x => {

                this.totalAfterReduction = this.totalPrice;

                for (var i = 0; i < this.offres.offers.length; i++) {

                    if ( this.offres.offers[i].type == "percentage") {
                        this.totalAfterReduction = this.totalAfterReduction - (this.totalPrice * (this.offres.offers[i].value / 100));
                        this.offreReduction = this.offreReduction + " - " + (this.totalPrice * (this.offres.offers[i].value / 100));
                    }
            
                    if (this.offres.offers[i].type == "minus") {
                        this.totalAfterReduction = this.totalAfterReduction - this.offres.offers[i].value;
                        this.offreReduction = this.offreReduction + " - " + this.offres.offers[i].value;
                    }
            
                    if (this.offres.offers[i].type == "slice") {
                        var tran = this.totalPrice / this.offres.offers[i].sliceValue;
                        this.totalAfterReduction = this.totalAfterReduction - (Math.floor(tran) * this.offres.offers[i].value);
                        this.offreReduction = this.offreReduction + " - " + (Math.floor(tran) * this.offres.offers[i].value);
                    }    
                }
                
            });
        } catch (e) {
            console.log(e);
        }
    }
}