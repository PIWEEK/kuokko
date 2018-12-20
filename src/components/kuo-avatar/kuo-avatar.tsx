import { Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'kuo-avatar',
  styleUrl: 'kuo-avatar.css',
  shadow: true
})

export class KuoAvatar {

  @Prop() speech: string;

  @State() isSleep: boolean = true;
  @State() isHalfSleep: boolean = false;
  @State() isAwake: boolean = false;

  hostData() {
    return {
      'class': {
        'speaking': this.speech === "start",
        'on-match': this.speech === "match",
        '' : this.speech === "end"
      },
    };
  }

  handleKuokkoStart() {
    console.log('handleKuokkoStart');
    this.isSleep = false;
    this.isHalfSleep = true;
    setTimeout(() => {
      this.isHalfSleep = false;
      this.isAwake = true;
    }, 500);
    const event = new CustomEvent(`kuokko:start`);
    document.dispatchEvent(event);
  }

  render() {
    const sleepClass = "asleep " + (!this.isSleep ? "hidden" : "");
    const halfSleepClass = "halfasleep " + (!this.isHalfSleep ? "hidden" : "");
    const awakeClass = "awake " + (!this.isAwake ? "hidden" : "");
    console.log(sleepClass, halfSleepClass, awakeClass);

    return (
      <div
        class="kuokko-face"
        onClick={this.handleKuokkoStart.bind(this)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102">
          <g class={sleepClass}>
            <path fill="#3A3F47" d="M82.398 67.026c-.989 6.78-9.181 3.531-11.653-2.118-1.271-3.532-5.085-12.36-11.723-8.828-.777.423-1.342 1.13-1.837 1.977a5.086 5.086 0 0 0-1.765-1.977c-6.71-3.532-10.453 5.296-11.794 8.828-2.472 5.579-10.594 8.898-11.583 2.118-1.13 11.512 20.128 7.063 25.142-1.06 5.156 8.123 26.343 12.572 25.213 1.06z"/>
            <path fill="#3A3F47" d="M57 74.07a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path d="M43 46s2.5 1.5 5 1.5 5-1.5 5-1.5M61 46s2.5 1.5 5 1.5 5-1.5 5-1.5"/>
          </g>
          <g class={halfSleepClass}>
            <path fill="#3A3F47" d="M79.398 63.026c-.989 6.78-9.181 3.531-11.653-2.119-1.271-3.53-5.085-12.359-11.723-8.827-.777.423-1.342 1.13-1.837 1.977a5.086 5.086 0 0 0-1.765-1.977c-6.71-3.532-10.453 5.296-11.794 8.828-2.472 5.579-10.594 8.898-11.583 2.118-1.13 11.512 20.128 7.063 25.142-1.06 5.156 8.123 26.343 12.572 25.213 1.06z"/>
            <path fill="#3A3F47" d="M54 69.07c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2zM40 41h10c.04 0 .573.012.858.486a1 1 0 0 1-.343 1.372h-.002l-.003.002-.009.005-.028.017a11.452 11.452 0 0 1-.446.242c-.295.152-.715.353-1.218.555-.992.396-2.378.821-3.809.821s-2.817-.425-3.809-.822a14.341 14.341 0 0 1-1.567-.741 7.645 7.645 0 0 1-.098-.055l-.027-.017-.009-.005-.003-.001v-.001a1 1 0 0 1-.345-1.372C39.426 41.012 40 41 40 41zM58 41h10c.039 0 .573.012.857.486a1 1 0 0 1-.343 1.372h-.001l-.003.002-.009.005-.028.017a11.425 11.425 0 0 1-.446.242c-.295.152-.715.353-1.218.555-.992.396-2.378.821-3.81.821-1.43 0-2.816-.425-3.808-.822a14.322 14.322 0 0 1-1.567-.741 7.506 7.506 0 0 1-.098-.055l-.027-.017-.009-.005-.003-.001v-.001a1 1 0 0 1-.345-1.372C57.426 41.012 58 41 58 41z"/>
          </g>
          <g class={awakeClass}>
            <path fill="#3A3F47" d="M76.398 62.026c-.989 6.78-9.181 3.531-11.653-2.119-1.271-3.53-5.085-12.359-11.723-8.827-.777.423-1.342 1.13-1.837 1.977a5.086 5.086 0 0 0-1.765-1.977c-6.71-3.532-10.453 5.296-11.794 8.828-2.472 5.579-10.594 8.898-11.583 2.118-1.13 11.512 20.128 7.063 25.142-1.06 5.156 8.123 26.343 12.572 25.213 1.06zM42.438 43.876a5.438 5.438 0 1 0 0-10.876 5.438 5.438 0 0 0 0 10.876zM59.378 43.805a5.367 5.367 0 1 0 0-10.734 5.367 5.367 0 0 0 0 10.734z"/>
          </g>
        </svg>
      </div>
    );
  }
}
