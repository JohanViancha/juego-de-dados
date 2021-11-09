import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    dado1= '../assets/img/dice1.png';
    dado2 = '../assets/img/dice1.png'
    sonidoDados = new Audio();
    numero1:number;
    numero2:number;
    //True=> Jugador 2
    //False => Jugador 1
    turno:boolean;
    tirar:string;
    index:number;
    numerosJugador1:number[] = [1,2,3,4,5,6,7,8,9,10];
    numerosJugador2:number[] = [1,2,3,4,5,6,7,8,9,10];
    tacharNumero:number;
    constructor(){
      this.tacharNumero =0;
      this.index = 0;
      this.tirar = 'Tirar dados jugador 1';
      this.numero1 = 0;
      this.numero2 = 0;
      this.turno = false;
    }


    async iniciarTurno(){
      await this.tirarDados();
      if(this.turno){
        this.tirar = 'Tirar dados jugador 1';
      }else{
        this.tirar = 'Tirar dados jugador 2';
      }
      this.turno = !this.turno;

      if(this.buscarNumero()===-1){
          this.realizarOperacion();
      }else{
          this.tacharNumero = this.numero1+this.numero2;
      }
    }
    
    tirarDados():Promise<any>{
      return new Promise((resolve,reject)=>{
        this.sonidoDados.src = '../assets/sonidos/sonidos-dados.mp3';
        this.sonidoDados.play();
        this.index = 0;
        let miTiro = setInterval(()=>{
            this.numero1 = Math.round(Math.random()*5)+1;
            this.numero2 = Math.round(Math.random()*5)+1;
            this.dado1 = `../assets/img/dice${this.numero1}.png`;
            this.dado2 = `../assets/img/dice${this.numero2}.png`;   
            this.index++;
          if(this.index==5){
            this.index = 0;
            clearInterval(miTiro);
            resolve('Terminado');
            this.dado1 = `../assets/img/dice${this.numero1}.svg`;
            this.dado2 = `../assets/img/dice${this.numero2}.svg`;   

          }
        }, 400);


    });
      
    }


    buscarNumero():number{
      if(this.turno){
        const i = this.numerosJugador1.indexOf(this.numero1+this.numero2);
        if(i!== -1){
          this.numerosJugador1.splice(i, 1);
        }  
        return i;
      }else{
        const i = this.numerosJugador2.indexOf(this.numero1+this.numero2);
        if(i!== -1){
          this.numerosJugador2.splice(i, 1);
        }
        return i;
      }      
    }

    realizarOperacion():void{

      

    }
}
