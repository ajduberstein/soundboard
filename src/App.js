import React, { Component } from 'react';
import {Header, Grid, Input, Button} from 'semantic-ui-react';
import audioToByteString from './audioHelpers';

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

const initBtnMsg = 'Click to add a sound'
const initInputMsg = 'Upload audio and add a name'

let colorIdx = 0

const defaultState = {
  new: true,
  music: [
    {
      name: "",
      key: 1,
      audio: [],
      editable: false,
    },
    {
      name: "",
      key: 2,
      audio: [],
      editable: false,
    },
    {
      name: "",
      key: 3,
      audio: [],
      editable: false,
    }
  ]
}

class App extends Component {
  constructor() {
    super()
    this.state = defaultState;
    this.handleClick = this.handleClick.bind(this);
    this.handleHardReset = this.handleHardReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(key, e) {
    e.preventDefault();
    let clickedBtn = key;
    for (let i = 0; i < this.state.music.length; i++) {
      if (this.state.music[i].key === clickedBtn ) {
        if (this.state.music[i].audio.length > 0) {
          // get audio
          //
        } else {
          // set audio
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
      for (let i = 0; i < this.state.music.length; i++) {
        if (this.state.music[i].editable) {
          let music = [...this.state.music];
          music[i].name = e.target.value;
          music[i].editable = false
          i = Infinity
          this.setState({music})
        }
      }
    }
  }

  handleHardReset(e) {
    window.localStorage.clear();
    this.setState(defaultState);
  }

  componentDidMount() {
    if (!window.localStorage.length) {
      this.setState({new: true})
    } else {
      this.setState({new: false})
    }
  }

  handleFileUpload(key, e) {
    debugger;
    let uploadedFile = e.target.files[0];
    for (let i = 0; i < this.state.music.length; i++) {
      if (this.state.music[i].key === key) {
        let music = [...this.state.music];
        music[i].audio = audioToByteString(uploadedFile)
        // Close loop
        i = Infinity
        this.setState({music})
      }
    }
  }

  render() {
    let newbieMsg = null
    if (this.state.new) {
      newbieMsg = (<p>Click the buttons to upload a short sound</p>)
    }
    let buttons = this.state.music.map((x) => {
      if (!x.editable) {
          colorIdx++;
          return (
            <Grid.Row>
            <Grid.Column>
              <Button color={COLORS[colorIdx % COLORS.length]}
                      key={x.key}
                      onClick={this.handleClick.bind(this, x.key)} style={{width: "100%"}}>
                      {x.name || initBtnMsg}</Button>
              <audio key={"audio" + x.key} style={{display: "none"}} />
            </Grid.Column>
            </Grid.Row>
          )
      } else {
        return (
          <Grid.Row>
          <Grid.Column>
          <Input type="file" accept=".mp3,audio/*" onChange={this.handleFileUpload.bind(this, x.key)} />
          <Input
            key={x.key} placeholder={x.name || initInputMsg} onKeyPress={this.handleChange} onBlur={this.handleChange} style={{width: "100%"}}/>
          </Grid.Column>
          </Grid.Row>
        )
      }
    })
    return (
      <div style={{margin: 10}}>
        <Header as="h1">uSoundboard</Header>
        {newbieMsg}
        <Grid style={{width: "100%"}}>
          {buttons}
        </Grid>
        <div style={{position: "absolute", bottom: 0, width: "100%"}}>
          <Button size="small" onClick={this.handleHardReset}>Clear all sounds</Button>
          <p> Lovingly crafted by <a href="http://duberste.in">duber</a> </p>
        </div>
      </div>
    );
  }
}

export default App;
