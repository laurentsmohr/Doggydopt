import React from 'react';
import ReactDOM from 'react-dom';
import List from './components/List.jsx';
import Search from './components/Search.jsx';
import exampleData from '../../exampleData.js';
import axios from 'axios';
import Home from './components/Home.jsx';
import Authenticate from './components/Authenticate.jsx';
import SearchShelters from './components/SearchShelters.jsx';
import AdoptList from './components/AdoptList.jsx';
import { BrowserRouter, Route, Link, Switch, browserHistory } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breeds: exampleData,
      unfiltered: [],
      zipCode: 10017, 
    } 
    this.addDefaultSrc = this.addDefaultSrc.bind(this);
    this.searchNow = this.searchNow.bind(this);
    this.setZipInApp = this.setZipInApp.bind(this);
  }

  componentWillMount() {
    axios.get('/breeds/all')
    .then(res => {
      this.setState({
        breeds: res.data
      }, console.log('all breeds is', res.data));
    }).catch(err => {
      console.error(err);
    })
  }

  setZipInApp(zipCode) {
    this.setState({
      zipCode: zipCode,
    })
  }

  searchNow(params) {
    //The searchnow filters the breeds dynamicly as the user makes their selection for characteristics. As each selection is made, searchNow is invoked. 
    var allBreeds;

    //Checks to see if this is the first the filter is being used, if yes than a copy of all the breeds is kept in the state as unfiltered so additional api calls are unnecssary.
    if(this.state.unfiltered.length === 0){
      allBreeds = this.state.breeds.slice();
    } else {
      allBreeds = this.state.unfiltered.slice();
    };

    //If all the selections are 'unselected' or zero, than all the breeds are shown.
    if(params.size.length + params.exercise.length + params.shedding.length + params.biddability.length + params.barking.length === 0){
      this.setState({
        breeds: allBreeds,
        unfiltered: allBreeds
      });
    } else {
      var createSelector = (breed, category) => {
        if (params[category].length !== 0) {
          return params[category].some(characteristic => {
            if (category === 'size') {
              if(characteristic === 'small'){
                return breed.weight_avg > 0 && breed.weight_avg <= 25;
              } else if(characteristic === 'medium'){
                return breed.weight_avg > 26 && breed.weight_avg <= 40;
              } else if (characteristic === 'large'){
                return breed.weight_avg > 41 && breed.weight_avg <= 300;
              }
            } else {
              return characteristic === breed[category];
            }
          })
        } else {
          return true;
        }
      }
      //Based on the selection, certain breeds are shown and others are not.
      var filteredBreeds = allBreeds.filter(breed => {    
        var exerciseSelect = createSelector(breed, 'exercise');
        var sheddingSelect = createSelector(breed, 'shedding');
        var biddabilitySelect = createSelector(breed, 'biddability');
        var sizeSelect = createSelector(breed, 'size');
        var barkingSelect = createSelector(breed, 'barking'); 
        return exerciseSelect && sheddingSelect && biddabilitySelect && sizeSelect && barkingSelect;
      }); //end of filter

      this.setState({
        breeds: filteredBreeds,
        unfiltered: allBreeds
      });
    }; //end of if else
  } //end of searchNow()

 // SETS DEFAULT PIC IF DOG HAS NO SUITABLE PICTURE
 addDefaultSrc(ev){
    ev.target.src = 'https://www.drawingtutorials101.com/drawing-tutorials/Cartoon-Movies/Bolt/bolt/how-to-draw-Dog-from-Bolt-step-0.png'
  }

  render () {
    return (
      <Switch>
        <Route exact={true} path="/signup" render={() => (
          <Authenticate thisPage="signup" otherPage="login" />
        )}/>
        <Route exact={true} path="/login" render={() => (
          <Authenticate thisPage="login" otherPage="signup" setZipInApp={this.setZipInApp}/>
        )}/>
        <Route exact={true} path="/" component={Home}/>
        <Route exact={true} path="/matchMe" render={() => (
          <div>
            <div className='below-header'>
                <Search search={this.search} searchNow={this.searchNow}/>
                <List zipCode={this.state.zipCode} breeds={this.state.breeds} addDefaultSrc={this.addDefaultSrc}/> 
            </div> 
          </div>
        )}/> 
        <Route exact={true} path="/adopt/:breed/:zip" render={({match}) => ( 
          <AdoptList match={match}/>
        )}/>
        <Route exact={true} path="/shelters" render={() => (
          <SearchShelters />
        )} />
      </Switch>
    )
  }
}

ReactDOM.render((
  <BrowserRouter history={browserHistory}>
    <App/>
  </BrowserRouter>
), document.getElementById('app'));
