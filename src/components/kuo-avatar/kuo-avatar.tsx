import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'kuo-avatar',
  styleUrl: 'kuo-avatar.css',
  shadow: true
})

export class KuoAvatar {

  @Prop() speech: string;

  hostData() {
    return {
      'class': {
        'speaking': this.speech === "start",
        'on-match': this.speech === "match",
        '' : this.speech === "end"
      },
    };
  }
  
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