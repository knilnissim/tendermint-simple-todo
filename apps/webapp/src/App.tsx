import React, { Component } from 'react';
import { render } from 'react-dom';
import LotionClient from './LotionClient';

class App extends Component {

  client = new LotionClient();

  state = {
    newItemTitle: '',
    items: [],
    loading: false,
  };

  async componentDidMount() {
    const { items } = await this.client.getState();
    this.setState({ ...this.state, items });
  }

  startLoading = (otherState?: any) => this.setState({ ...this.state, ...{ ...otherState }, loading: true });

  completeLoading = (otherState?: any) => this.setState({ ...this.state, ...{ ...otherState }, loading: false });

  updateNewItemTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, newItemTitle: e.target.value });
  }

  add = async (title: string) => {
    const newItemTitle = '';
    this.startLoading({ newItemTitle });
    await this.client.sendTx('ADD', { title });
    const { items } = await this.client.getState();
    this.completeLoading({ items });
  }

  toggle = async (index: number) => {
    this.startLoading();
    await this.client.sendTx('TOGGLE', { index });
    const { items } = await this.client.getState();
    this.completeLoading({ items });
  }

  render() {
    const { newItemTitle, items, loading } = this.state;
    return (
      <div>
        <h1>Lotion Simple Todo</h1>
        <section>
          <form onSubmit={e => { e.preventDefault(), this.add(newItemTitle); }}>
            <input type='text' value={newItemTitle} onChange={this.updateNewItemTitle} disabled={loading}/>
            <input type='submit' value='ADD' disabled={loading}/>
          </form>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <div>
                  <input
                    type='checkbox'
                    name='feature'
                    value={item.title} checked={item.completed}
                    onChange={() => this.toggle(index)}
                    disabled={loading}/>
                  <label>{item.title}</label>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));

export default App;
