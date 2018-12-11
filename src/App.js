import React from 'react';
import logo from './logo.svg';
import './App.css';

const paragraph = "As your hair is made of keratin, a protein, not getting enough protein in your diet can lead to dry, brittle strands, says the nutritionist Jo Lewin. She recommends adding chicken, turkey, fish, dairy products and eggs into your diet. Good sources for vegetarians and vegans are legumes, nuts, tofu and quinoa. Complex carbohydrates and iron are also important.";
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
      console.log(nextProps);
      this.setState(nextProps);
    }
  }



  render() {
    return (
      <div className="Dropdown" style={{
        top:this.state.top,
        left:this.state.left,
      }}>
        <ul className="ul-class">
          <li className="li-class">.</li>
          <li className="li-class">,</li>
          <li className="li-class">;</li>
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
    }
  }
  onClick = (e) => {
    console.log("clicked");
    this.state.showDropdown(e);
  }
  render() {
    return (
      <span id={this.props.id} className="punctuation-space" onClick={this.onClick}> </span>
    );
  }
}

class TextSpace extends React.Component {
  render() {
    return (
      <span className="text-span">{this.props.text}</span>
    );
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
      answersObject:this.getAnswersObj(paragraph),
    }
  }

  checkAnswer = (id) => {

  }

  getAnswersObj = (text) => {
    let answersObject = {};
    let textArray = text.split("");
    for (let i = 0; i < textArray.length; i++){
      if (punctuationMarks.includes(textArray[i])) {
        answersObject[i] = textArray[i];
      }
    }
    this.setState({answersObject:answersObject});
  }

  showDropdown = (e) => {
    console.log(e.clientX, e.clientY);
    this.setState({
      dropdownVisible:true,
      dropdownX:e.clientX,
      dropdownY:e.clientY,
    })
    return "";
  }

  replacePunctuation = (text) => {
    let textArray = text.split("");
    let resultArray = [];
    let tempPosition = 0;
    for (let i = 0; i < textArray.length; i++){
      if (punctuationMarks.includes(textArray[i])) {
        resultArray.push(<TextSpace text={textArray.slice(tempPosition,i).join("")} key={i + "t"} />)
        resultArray.push(<PunctuationSpace id={i} showDropdown={this.showDropdown} key={i + "p"}/>);

        tempPosition = i + 1;
      }
    }
    return resultArray;
  }

  render() {
    return (
      <div className="App">
        {this.replacePunctuation(paragraph)}
        {this.state.dropdownVisible ? <Dropdown left={this.state.dropdownX} top={this.state.dropdownY} checkAnswer={this.checkAnswer} /> : "" }
      </div>
    );
  }
}

export default App;
