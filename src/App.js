import React, { Component } from 'react';
import {Header, Grid, Input, Button} from 'semantic-ui-react';
import {Player, audioToLocalStorage} from './AudioHelpers';

// 5 MB limit in local storage
const HARD_LIMIT = 5000000 
const p = new Player()
const MAX_KEYS = 6;

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
      name: "",
      key: i,
      uploaded: false,
      editable: false
    })
  }
  return arr
})

const initBtnMsg = 'Click to add a sound'
const initInputMsg = 'Upload audio and add a name'

let colorIdx = 0

const getDefaultState = () => {
  return {
    new: true,
    music: getInitMusic(),
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
        if (this.state.music[i].uploaded && !this.state.music[i].editable) {
          // get audio
          p.playByteArrayAtLocalStorageIndex(this.state.music[i].key)
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
          let isUserInput = e.target.value !== ""
          let music = [...this.state.music];
          music[i].name = e.target.value;
          music[i].editable = !isUserInput;
          if (isUserInput) {
            window.localStorage.setItem(i + "name", music[i].name)
          }
          i = Infinity
          this.setState({music})
        }
      }
    }
  }

  handleHardReset(e) {
    e.preventDefault();
    window.localStorage.clear();
    this.setState(getDefaultState());
  }

  componentDidMount() {
    // Hydrate from a saved state
    if (!window.localStorage.length) {
      this.setState({new: true})
    } else {
      let music = [...getInitMusic()]
      for (let i = 0; i < MAX_KEYS; i++) {
        if (window.localStorage.key(i)) {
          music[i].name = window.localStorage.getItem(i + "name")
          music[i].uploaded = true
        }
      }
      this.setState({new: false, music: music})
    }
  }

  handleFileUpload(key, e) {
    let uploadedFile = e.target.files[0];
    for (let i = 0; i < this.state.music.length; i++) {
      if (this.state.music[i].key === key) {
        let music = [...this.state.music];
        if (uploadedFile.size <= HARD_LIMIT) {
          audioToLocalStorage(uploadedFile, key, () => {
            music[i].uploaded = true
            // Close loop
            i = Infinity
            this.setState({music})
          })
        } else {
          alert("File must be less than 5 MB")
        }
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
