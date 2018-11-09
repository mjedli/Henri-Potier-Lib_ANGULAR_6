import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Book } from '../model/book';
import { BOOKS } from '../model/mock-books';

import { BookService } from '../services/book.service';

@Component({
  selector: 'books-root',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})

export class BooksComponent implements OnInit {
  
  searchForm: FormGroup;
  addToCartForm: FormGroup;

  constructor(private bookService: BookService, private formBuilder: FormBuilder) { }

  books = BOOKS;

  searchTitle = "";
  cartNumberOfProduct = 0;

  titleBook = "";

  getBooks(): void {
    this.bookService.getBooks().subscribe(books => this.books = books.filter(x => x.title.search(this.searchTitle) != -1));
  }

  onSubmit() {
    this.getBooks();
  }

  addToLocalStorage(title:string, isbn:string, price:String) {
    this.cartNumberOfProduct = this.cartNumberOfProduct+1;
    localStorage.setItem("cartNumberOfProductItem", this.cartNumberOfProduct.toString());
    localStorage.setItem("product_"+this.cartNumberOfProduct, title+"#"+isbn+"#"+price);
  }

  emptyCart() {
      localStorage.clear();
      this.cartNumberOfProduct = 0;
  }

   ngOnInit() {
       this.searchForm = this.formBuilder.group({
            searchBook: ['', Validators.required]
        });
        this.getBooks();
        var count = localStorage.getItem("cartNumberOfProductItem");

        if (count == null || count == "null"){
            this.cartNumberOfProduct = 0;
        } else {
            this.cartNumberOfProduct = parseInt(count);
        }
   }
}