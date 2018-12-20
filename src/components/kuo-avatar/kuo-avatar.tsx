import { Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'kuo-avatar',
  styleUrl: 'kuo-avatar.css',
  shadow: true
})

export class KuoAvatar {

  @Prop() speech: string;

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
    this.isAwake = true;
    const event = new CustomEvent(`kuokko:start`);
    document.dispatchEvent(event);
  }

  render() {
    const awakeClass = "kuokko-face open";

    return (
      <div
        class={this.isAwake ? awakeClass : 'kuokko-face'}
        onClick={this.handleKuokkoStart.bind(this)}>
        <div class="face-wrapper">
        <div class="eyeface">
            <div class="eye"></div>
            <div class="eye"></div>
        </div>
        <svg class="moustache" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 159 59">
          <path d="M 158.64761,37.034567 C 155.53434,58.376656 129.74648,48.150093 121.96552,30.364805 117.96392,19.249281 105.95879,-8.5403248 85.061186,2.5755175 82.615587,3.9095952 80.837026,6.1326373 79.281023,8.800478 78.011162,6.270516 76.093465,4.1227077 73.723101,2.5755175 52.603254,-8.5403248 40.820372,19.249281 36.596528,30.364805 28.815249,47.927857 3.2490009,58.376656 0.13667838,37.034567 -3.4204416,73.272177 63.496539,59.265936 79.281023,33.699686 95.50999,59.265936 162.20473,73.272177 158.64761,37.034567 Z"/>
        </svg>
        <div class="mouth"></div>
    </div>
      </div>
    );
  }
}
