import { Component } from '@stencil/core';
// import * as rxOp from 'rxjs/operators';
// import bus from '../../js/events';

@Component({
  tag: 'kuo-avatar',
  styleUrl: 'kuo-avatar.css',
  shadow: true
})

export class MyComponent {

  // private componentWillLoad() {
  //   bus.pipe(
  //     rxOp.filter((message) => {
  //       return message.type = "search";
  //     })
  //   ).subscribe((event) => {
  //     // this.recipes = event.payload;
  //   });
  // }
  
  render() {
    return (
      <div class="kuokko-face">
        <img
          class="kuokko-logo"
          src="src/images/kuokko.svg"
          alt="Kuokko avatar" />
      </div>
    );
  }
}