import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-favorite-button',
  imports: [],
  templateUrl: './favorite-button.html',
  styleUrl: './favorite-button.css',
})
export class FavoriteButton {
  clickEvent = output<Event>();
  disabled = input.required();
  filled = input.required();
  outlined = input.required();

  onClick(event: Event){
    this.clickEvent.emit(event);
  }
}
