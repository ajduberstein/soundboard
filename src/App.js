import React, { Component } from 'react';
import {Header, Grid, Input, Button} from 'semantic-ui-react';
import {stateFromURL, clearQueryStr, stateToURL} from './textHelpers';
import Speech from 'speak-tts';

let responsiveVoice;


const TEXT_ONLY = true;
// 5 MB limit in local storage
const MAX_KEYS = 10;

const COLORS = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
]

const getInitMusic = (() => {
  let arr = []
  for (let i = 0; i < MAX_KEYS; i++) {
     arr.push({
      key: i,
      text: "",
      editable: false
    })
  }
  return arr
})

const initBtnMsg = 'Click to add a sound'

let colorIdx = 0

const getDefaultState = () => {
  return {
    music: getInitMusic(),
    name: 'Networking Soundboard'
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = getDefaultState();
    this.handleClick = this.handleClick.bind(this);
    this.handleHardReset = this.handleHardReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(key, e) {
    e.preventDefault();
    let clickedBtn = key;
    for (let i = 0; i < this.state.music.length; i++) {
      if (this.state.music[i].key === clickedBtn) {
        let mediumPresent = this.state.music[i].text
        if (mediumPresent) {
          Speech.speak({
            text: this.state.music[i].text
          })
        } else {
          let music = [...this.state.music];
          music[i].editable = true
          i = Infinity;
          this.setState({music})
        }
      }
    }
  }

  handleChange(e) {
    if(e.key === "Enter" || e.key === undefined) {
      for (let i = 0; i < MAX_KEYS; i++) {
        if (this.state.music[i].editable) {
          let isUserInput = e.target.value !== ""
          let music = [...this.state.music];
          music[i].text = e.target.value;
          music[i].editable = !isUserInput;
          i = Infinity
          stateToURL(this.state.music)
          this.setState({music})
        }
      }
    }
  }

  handleHardReset(e) {
    e.preventDefault();
    clearQueryStr()
    this.setState(getDefaultState());
  }

  componentDidMount() {
    let music = stateFromURL(getInitMusic())
    let ds = getDefaultState()
    if (music) ds.music = music

    Speech.init({
      lang: 'en-US',
    });

    this.setState(ds)
  }

  render() {
    let buttons = this.state.music.map((x) => {
      if (!x.editable) {
          colorIdx++;
          return (
            <Grid.Row>
            <Grid.Column>
              <Button color={COLORS[colorIdx % COLORS.length]}
                      key={x.key}
                      onClick={this.handleClick.bind(this, x.key)} style={{width: "100%"}}>
                      {x.text || initBtnMsg}</Button>
            </Grid.Column>
            </Grid.Row>
          )
      } else {
        return (
          <Grid.Row>
          <Grid.Column>
          <Input
            key={x.key} placeholder={x.text} onKeyPress={this.handleChange} onBlur={this.handleChange} style={{width: "100%"}}/>
          </Grid.Column>
          </Grid.Row>
        )
      }
    })
    return (
      <div style={{margin: 10}}>
        <Header as="h1">{this.state.name}</Header>
        <Grid style={{width: "100%"}}>
          {buttons}
        </Grid>
        <Grid>
        <div style={{width: "100%"}}>
          <Button size="small" onClick={this.handleHardReset}>Clear all</Button>
        </div>
          <p> Lovingly crafted by <a href="http://duberste.in">duber</a> </p>
        </Grid>
      </div>
    );
  }
}

export default App;
