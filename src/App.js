import React, { Component } from 'react';
import {Header, Grid, Input, Button} from 'semantic-ui-react';
import { play } from './audioHelpers';

const COLORS = [
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "teal",
  "blue",
  "violet",
  "purple",
  "pink",
  "brown",
]


class App extends Component {
  constructor() {
    super()
    this.state = {
      new: false,
      music: [
      {
        name: "1",
        key: 1,
        audio: [],
        editable: false,
      },
      {
        name: "2",
        key: 2,
        audio: [],
        editable: false,
      },
      {
        name: "3",
        key: 3,
        audio: [],
        editable: false,
      }]
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    let clickedBtn = e.target.innerText;
    for (let i = 0; i < this.state.music.length; i++) {
      if (this.state.music[i].name === clickedBtn ) {
        if (this.state.music[i].audio.length > 0) {
          // get audio
      
        } else {
          // set audio
          console.log(music)
          let music = [...this.state.music];
          music[i].editable = true
          this.setState({music})
        }
      }
    }
  }

  handleChange(e) {
    if(e.key === "Enter" || e.key === undefined) {
      for (let i = 0; i < this.state.music.length; i++) {
        if (this.state.music[i].editable) {
          let music = [...this.state.music];
          music[i].name = e.target.value;
          music[i].editable = false
          this.setState({music})
        }
      }
    }
  }

  componentDidMount() {
    if (!window.localStorage.length) {
      this.setState({new: true})
    }
  }

  render() {
    let newbieMsg = null
    if (this.state.new) {
      newbieMsg = (<p>Click the buttons to upload a sound (5 second or shorter)</p>)
    }
    let buttons = this.state.music.map((x) => {
      if (!x.editable) {
          return (
            <Grid.Row>
            <Grid.Column>
              <Button color={COLORS[Math.floor(Math.random()*COLORS.length)]}
                      key={x.key}
                      onClick={this.handleClick} style={{width: "100%"}}>
                      {x.name}</Button>
            </Grid.Column>
            </Grid.Row>
          )
      } else {
        return (
          <Grid.Row>
          <Grid.Column>
          <Input
            key={x.key} placeholder={x.name} onKeyPress={this.handleChange} onBlur={this.handleChange} style={{width: "100%"}}/>
          </Grid.Column>
          </Grid.Row>
        )
      }
    })
    return (
      <div style={{margin: 10}}>
        <Header as="h1" center>uSoundboard</Header>
        {newbieMsg}
        <Grid style={{width: "100%"}}>
          {buttons}
        </Grid>
      </div>
    );
  }
}

export default App;
