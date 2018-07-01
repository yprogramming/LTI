import { BrowserModule } from '@angular/platform-browser';
import { SearchPipe } from './search.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SearchPipe
  ],
  exports: [
    SearchPipe
  ]
})
export class PipesModule { }
