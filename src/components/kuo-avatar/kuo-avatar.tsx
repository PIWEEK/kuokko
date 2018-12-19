import { Component } from '@stencil/core';

@Component({
  tag: 'kuo-avatar',
  styleUrl: 'kuo-avatar.css',
  shadow: true
})

export class KuoAvatar {
  
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