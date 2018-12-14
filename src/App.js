import React from 'react';
import './App.css';

let level = 0;
const paragraph = require("./paragraphs.json");
const punctuationMarks = [",",".",";"];

class Dropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      left:props.left,
      top:props.top,
      id:null,
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState(nextProps);
    }
  }

  onClick = (e) => {
    this.props.checkAnswer(e.target.id);
  }



  render() {
    return (
      <div className="Dropdown" style={{
        top:this.state.top,
        left:this.state.left,
      }}>
        <ul className="ul-class">
          <li className="li-class" id="." onClick={this.onClick}>.</li>
          <li className="li-class" id="," onClick={this.onClick}>,</li>
          <li className="li-class" id=";" onClick={this.onClick}>;</li>
        </ul>
      </div>
    )
  }
}

class PunctuationSpace extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showDropdown:props.showDropdown,
      answered:props.answered,
      content:props.content,
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState(nextProps);
    }
  }

  createClassList = () => {
    return this.state.answered ? "punctuation-space-answered" :"punctuation-space";
  }

  onClick = (e) => {
    this.state.showDropdown(e);
    this.props.startTimer();
  }

  render() {
    return (
      <span id={this.props.id} className={this.createClassList()} onClick={this.onClick}>{this.state.content}</span>
    );
  }
}

class TextSpace extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      answered:props.answered,
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState(nextProps);
    }
  }

  formatText = () => {
    if (this.state.answered){
      return this.props.text;
    }
    return this.props.text.toLowerCase();
  }

  render() {
    return (
      <span className="text-span">{this.formatText()}</span>
    );
  }
}

class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      on: props.on,
      seconds:0,
    }
    this.timer = 0;
    this.countDown = this.countDown.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.startTimer();
  }
  componentWillReceiveProps(nextProps){
      if (!nextProps.on) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
      this.setState({on:nextProps.on});
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds + 1;
    this.setState({
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 100) {
      clearInterval(this.timer);
    }
  }

  startTimer() {
    if (this.state.on){
      this.timer = setInterval(this.countDown, 1000);
    }
    else {
      this.stopTimer();
    }
  }

  stopTimer() {
    this.setState({
      on:false,
      seconds:0,
    });
    clearInterval(this.timer);
  }

  formatTime = () => {
    let sec = this.state.seconds;
    const seconds = (s) => {
      let str = Math.floor(s % 60).toString();
      if (str.length < 2) str = "0" + str;
      return str;
    }
    const minutes = (s) => {
      let str = Math.floor(s / 60).toString();
      if (str.length < 2) str = "0" + str;
      return str;
    }
    return `${minutes(sec)}:${seconds(sec)}`
  }
  render () {
    return (
      <div className="timer">
        <h2 className="time-text">{this.formatTime()}</h2>
      </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      clickedOnId:null,
      dropdownVisible:false,
      dropdownX:0,
      dropdownY:0,
      elementArray:this.replacePunctuation(paragraph[level]),
      answersObject:this.getAnswersObj(paragraph[level]),
      points:0,
      timerOn:false,
    }
  }

  addPoints = (p) => {
    let points = this.state.points;
    points += p;

    this.setState({points:points});
  }

  checkAnswer = (symbol) => {
    function checkIfAllAnswered(obj) {
      for (let answer in obj) {
        if (!obj[answer].answered) return false;
      }
      return true;
    }
    const id = this.state.id;
    let elArrayCopy = this.state.elementArray;
    let answersObject = this.state.answersObject;
    const correctAnswer = answersObject[id].symbol;
    this.setState({dropdownVisible:false,});
    if (symbol === correctAnswer) {
      this.addPoints(10);
      for (let i = 0; i < this.state.elementArray.length; i++){
        let el = this.state.elementArray[i];
        if (el.id == id){
          el.answered = true;
          el.content = symbol;
          elArrayCopy[i] = el;
          answersObject[id].answered = true;

          if (i + 1 < elArrayCopy.length) {
            let textEl = this.state.elementArray[i + 1];
            textEl.answered = true;
            elArrayCopy[i + 1] = textEl;
          }
          this.setState({
            elementArray:elArrayCopy,
            answersObject:answersObject,
          });
          break;
        }
      }
      if (checkIfAllAnswered(answersObject)) this.levelUp();
      return true;
    } else {
      this.addPoints(-3);
    }
    return false;
  }

  createText = () => {
    const elArray = this.state.elementArray;
    let resultArray = [];
    for (let i = 0; i < elArray.length; i++){
      let el = elArray[i];
      if(el.type === "text") {
        resultArray.push(<TextSpace text={el.text} key={el.key} answered={el.answered} />)
      } else {
        resultArray.push(<PunctuationSpace
           id={el.id}
           showDropdown={this.showDropdown}
           key={el.key}
           answered={el.answered}
           content={el.content}
           startTimer={this.startTimer}
           />)
      }
    }
    return resultArray;
  }

  getAnswersObj = (text) => {
    let answersObject = {};
    let textArray = text.split("");
    for (let i = 0; i < textArray.length; i++){
      if (punctuationMarks.includes(textArray[i])) {
        answersObject[i] = {
          symbol:textArray[i],
          answered:(i === textArray.length - 1),
        }
      }
    }
    return answersObject;
  }

  levelUp = () => {
    level++;
    this.setState({
      elementArray:this.replacePunctuation(paragraph[level]),
      answersObject:this.getAnswersObj(paragraph[level]),
      timerOn:false,
    })
  }

  showDropdown = (e) => {
    this.setState({
      dropdownVisible:true,
      dropdownX:e.clientX,
      dropdownY:e.clientY,
      id:e.target.id,
    })
    return "";
  }

  replacePunctuation = (text) => {
    let textArray = text.split("");
    let resultArray = [];
    let tempPosition = 0;
    for (let i = 0; i < textArray.length; i++){
      if (punctuationMarks.includes(textArray[i])) {
        resultArray.push({
          text:textArray.slice(tempPosition,i).join(""),
          key:i + "t",
          type:"text",
          answered:(tempPosition === 0),
        },
        {
          id:i,
          type:"punctuation",
          key: i + "p",
          answered:(i === (textArray.length - 1)),
          content:(i === (textArray.length - 1) ? "." : " "),
        },);
        //resultArray.push(<TextSpace text={textArray.slice(tempPosition,i).join("")} key={i + "t"} />)
        //resultArray.push(<PunctuationSpace id={i} showDropdown={this.showDropdown} key={i + "p"}/>);

        tempPosition = i + 1;
      }
    }
    return resultArray;
  }

  startTimer = () =>{
    if (!this.state.timerOn) this.setState({timerOn:true});
  }

  render() {
    return (
      <div className="App">
        <Timer on={this.state.timerOn} />
        {this.createText()}
        {this.state.dropdownVisible ? <Dropdown
          left={this.state.dropdownX}
          top={this.state.dropdownY}
          checkAnswer={this.checkAnswer} /> : "" }
      </div>
    );
  }
}

export default App;
