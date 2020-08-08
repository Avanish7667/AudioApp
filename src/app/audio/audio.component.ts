import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {
  currentFile: any = {};
  
  currentTime="00:00:00";
  duration="00:00:00";
  seek=0;
  start:boolean;
  audioEvents=[
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  //creating an audio object,we can load the audio file which we want to show
  audioObj=new Audio() 
  files=[
    {
      url: './assets/Song1.mp3',
      name: 'chand sitare',
      artist: 'Udit Narayan'
    },
    {
      url:'./assets/song2.mp3',
      name:'My song2',
      artist: 'atif aslam'
    },
    {
      url:'./assets/song3.mp3',
      name:'My song3',
      artist:'arijit'
    },
    {
      url:"https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3",
      name: "Perfect",
      artist: " Ed Sheeran"
    },
    {
    url:"https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3",
    name: "Man Atkeya Beparwah",
    artist: "Nusrat Fateh Ali Khan"
    },
    {
    url:"https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3",
    name: "Penny Lane",
    artist: "The Beatles"
    }
  ]

  openFile(url,index){
    this.currentFile={index,url}
    this.streamObserver(url).subscribe(event=>{})
  }

  constructor() { }

  ngOnInit(): void {
  }
  
  //To play songs
  play(){
    this.audioObj.play()
    console.log("Clicked Play button")
  }
  //to pause songs
  pause(){
    this.audioObj.pause()
    console.log("Clicked pause button")
  }
  playOrPause(){
    
    if(this.start==false){
      this.play()
    }
    else{
      this.pause()
    }
    this.start=!this.start
  }
  //to stop song
  stop(){
    this.start=true;
    this.audioObj.pause()
    this.audioObj.currentTime=0;
    console.log("Clicked stop button")
  }
  setVolume(e){
    this.audioObj.volume=e.target.value
    console.log(e.target.value)
  }
  streamObserver(url){
    return new Observable(observer =>{
      this.audioObj.src=url         //set url in audio object
      this.audioObj.load()     //load url of audio object
      this.audioObj.play()
      const handler= (event:Event) =>{
        console.log(event)
        this.seek=this.audioObj.currentTime
        this.duration=this.timeFormat(this.audioObj.duration)
        this.currentTime=this.timeFormat(this.audioObj.currentTime)
      }
      this.addEvents(this.audioObj,this.audioEvents,handler)

      return ()=>{
        this.audioObj.pause()
        this.audioObj.currentTime=0;
        this.removeEvents(this.audioObj,this.audioEvents,handler)
      }
    })
  }
  setSeekTo(ev){
    this.audioObj.currentTime=ev.target.value
  }
  addEvents(obj,events,handler){
    events.forEach(event => {
      obj.addEventListener(event,handler)
    })
  }
  removeEvents(obj,events,handler){
    events.forEach(event => {
      obj.removeEventListener(event,handler)
    })
  }
  timeFormat(time,format="HH:mm:ss"){
    const momentTime= time*1000;
    return moment.utc(momentTime).format(format);
  }
  
  isFirstPlaying() {
    // return false;
    return this.currentFile.index === 0;
  }
  isLastPlaying() {
    // return true;
    return this.currentFile.index === this.files.length - 1;
  }
  
  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file.url, index);
  }
  previous(){
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file.url, index);
  }
  onSliderChangeEnd(change) {
    this.setSeekTo(change.value);
  }
  
}
