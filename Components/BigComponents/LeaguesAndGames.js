import { LitElement, html, css } from '@lion/core';
import './Ticket';
import { connect } from 'pwa-helpers';
import { store } from '../../redux/store/store';
import { addBet, removeBet, addTicket } from '../../redux/actions/auth';

class LeaguesAndGames extends connect(store)(LitElement) {
  static get styles() {
    return css`
      html {
        box-sizing: border-box;
      }
      ul {
        display: none;
        list-style-type: none;
        padding: 0px;
      }
      h1 {
        font-size: 20px;
        font-family: cursive;
      }
      h3 {
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: grey;
        padding: 10px;
        margin: 0;
      }
      .container:last-child {
        padding-bottom: 20px;
      }
      h3:hover {
        cursor: pointer;
        color: black;
      }
      .select {
        display: flex;
      }
      p {
        display: block;
      }
      li {
        padding: 8px;
      }
      .odd {
        border: 1px solid black;
        padding: 6px 2px;
        text-align: center;
      }
      .odd:hover {
        cursor: pointer;
        background-color: grey;
      }
      .odd:active {
        background-color: crimson;
      }
      .clicked {
        background-color: crimson;
        border: 1px solid blue;
      }
      .more > p {
        position: relative;
        top: 20px;
      }
      .more > p:hover {
        cursor: pointer;
        color: blue;
      }
    `;
  }
  static get properties() {
    return {
      leagues: { type: Array },
      games: { type: Array },
      top10games: { type: Object },
      oddsTop10: { type: Array },
      oddsLigues: { type: Array },
      arrayOfLeaguesAndGames: { type: Object },
    };
  }
  constructor() {
    super();
    // API call for games and leagues and top 10 games

    // oddsTop10Games: un obiect care are key - meciul, iar proprietatea sa fie un obiect cu optiunile ca si key, iar valoriile cote
    // prettier-ignore
    this.top10Games = {
      'City vs Utd': {
        'firstWin': 1.8,
        'equal': 3.25,
        "secondWin": 3.56,
        'over3': 1.75,
        'under3': 1.85,
      },
      'Stoke vs WestHam': {
        'firstWin': 1.8,
        'equal': 3.25,
        'secondWin': 3.56,
        'over3': 1.75,
        'under3': 1.85,
      },
      'Liverpool vs Chelsea': {
        'firstWin': 5,
        'equal': 2.25,
        'secondWin': 1.5,
        'over3': 1.5,
        'under3': 2.2
      },
    };
    console.log(Object.keys(this.top10Games));
    console.log(Object.values(this.top10Games));
    console.log(store.getState());
    // campionate, meciuri si cote: un array care contine obiecte cu numele campionatelor (ex liga1), la proprietati meciurile, iar la fiecare
    // meci, numele optiunilor si cotele
  }

  stateChanged(state) {
    this.ticket = state.ticket;
  }

  getSiblings(parent) {
    const siblingsArr = [];
    let sibling = parent.firstChild;
    while (sibling) {
      if (sibling.nodeType === 1) {
        siblingsArr.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblingsArr;
  }

  removeClicks(element) {
    [...element.parentElement.parentElement.children].forEach(sibling =>
      [...sibling.children].forEach(elem => elem.classList.remove('clicked'))
    );
  }
  _selectOdd(event) {
    const game =
      event.target.parentElement.parentElement.parentElement.firstElementChild
        .innerText;
    const odd = event.target.innerText;
    const option = event.target.previousElementSibling.innerText;
    if (event.target.classList.contains('clicked')) {
      // sterge meci din bilet
      event.target.classList.remove('clicked');
      store.dispatch(removeBet(game, option, odd));
    } else {
      // adauga meci in bilet
      store
        .getState()
        .ticket.forEach(match =>
          match.game === game
            ? store.dispatch(removeBet(match.game, match.option, match.odd))
            : null
        );
      this.removeClicks(event.target);
      event.target.classList.add('clicked');
      store.dispatch(addBet(game, option, odd));
      console.log(store.getState());
    }
  }
  showDetails(event) {
    const list = event.target.nextElementSibling;
    list.classList.contains('select')
      ? list.classList.remove('select')
      : list.classList.add('select');
  }
  showMoreOptions() {
    console.log('more options');
  }

  handleBet() {
    const sum = this.shadowRoot.querySelector('.much').value;
    store.dispatch(
      addTicket(store.getState().ticket, store.getState().funds - sum)
    );
    console.log(store.getState());
    const elements = this.shadowRoot.querySelectorAll('.clicked');
    elements.forEach(elem => elem.classList.remove('clicked'));
  }

  render() {
    return html`
      ${!this.top10Games
        ? html`Content is loading`
        : html`
            <h1>Most betted games</h1>
            ${Object.keys(this.top10Games).map(
              (key, index) => html` <div class="container">
                <h3 @click=${this.showDetails}>${key}</h3>
                <ul>
                  <li>
                    <p>1 final</p>
                    <p class="odd" @click=${this._selectOdd}>
                      ${Object.values(this.top10Games)[index].firstWin}
                    </p>
                  </li>
                  <li>
                    <p>X final</p>
                    <p class="odd" @click=${this._selectOdd}>
                      ${Object.values(this.top10Games)[index].equal}
                    </p>
                  </li>
                  <li>
                    <p>2 final</p>
                    <p class="odd" @click=${this._selectOdd}>
                      ${Object.values(this.top10Games)[index].secondWin}
                    </p>
                  </li>
                  <li>
                    <p>Over 2.5</p>
                    <p class="odd" @click=${this._selectOdd}>
                      ${Object.values(this.top10Games)[index].over3}
                    </p>
                  </li>
                  <li>
                    <p>Under 2.5</p>
                    <p class="odd" @click=${this._selectOdd}>
                      ${Object.values(this.top10Games)[index].under3}
                    </p>
                  </li>
                  <li class="more" @click=${this.showMoreOptions}>
                    <p>More</p>
                  </li>
                </ul>
              </div>`
            )}
          `}
      <input type="text" class="much" />
      <button type="button" class="bet" @click=${this.handleBet}>
        Place bets
      </button>
    `;
  }
}

window.customElements.define('leagues-and-games', LeaguesAndGames);
