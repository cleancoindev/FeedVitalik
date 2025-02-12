import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() eatenTransactions: [];
  @Output() changeSound: EventEmitter<any> = new EventEmitter<any>();
  sound;
  background;

  constructor() {}

  convertToEth(wei){
    return wei / 10**18
  }

  ConvertToGwei(wei) {
    return wei / 10**9
  }

  expandModal() {
    document.getElementById('dialog').style.width = "65%";
  }

  resetModalWidth() {
    document.getElementById('dialog').style.width = "600px";
  }

  populateLeaderboard(){
    const allScores = [];
    const top3 = [{
      "score": 0
    }];

    // Loop through localStorage and get all objects with score property
    // Then store in array called allScores
    for(let i=0; i < localStorage.length; i++){
      const object = JSON.parse(localStorage.getItem(localStorage.key(i)));
      
      if (object.score != undefined){
        allScores.push(object);
      }
    }

    // Sort array by score (Smallest to Largest)
    allScores.sort(this.dynamicSort("score"));
    
    // Loop through sorted array started at highest and printout top 3
    let num = 1;
    for(let i=allScores.length-1; i>allScores.length-6; i--){
      document.getElementById("score"+num).innerHTML = allScores[i].score
      document.getElementById("date"+num).innerHTML = allScores[i].date
      document.getElementById("largest"+num).innerHTML = allScores[i].largest
      num++;
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  clearScores(){
    if(window.confirm("Are you sure you want to clear all scores? This cannot be undone.")){
      localStorage.clear();
      this.storeSettings();

      for(var i =1; i <= 5; i++){
        document.getElementById("score"+i).innerHTML = "";
        document.getElementById("date"+i).innerHTML = ""; 
        document.getElementById("largest"+i).innerHTML = "";
      }
    }
  }

  readSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    this.sound = settings.sound;
    this.background = settings.background;
    console.log('Reading setting bg = ' + this.background )
  }

  setSound(value) {
    this.sound = value;
    this.storeSettings();
    this.changeSound.emit(this.sound)
  }

  setBackground(value) {
    this.background = value;
    this.storeSettings();
    document.getElementById('bg').style.backgroundImage = "url('../assets/Images/backgrounds/bg" + this.background + ".png')"
  }

  storeSettings() {
    var data = {
      'sound': this.sound,
      'background': this.background,
    };

    localStorage.setItem('settings', JSON.stringify(data));
  }
}
