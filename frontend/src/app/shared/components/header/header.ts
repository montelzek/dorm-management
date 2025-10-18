import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  userName = input('Guest');

  dormName = input('Main Hall');

  roomNumber = input('101');

  avatarUrl = input('/user-placeholder.svg');
}
