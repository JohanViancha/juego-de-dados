import { Component } from '@angular/core';

import Swal from 'sweetalert2';

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
    turno:boolean;
    tirar:string;
    index:number;
    tipoOperacion:string;
    numerosJugador1:number[] = [8];
    numerosJugador2:number[] = [8,9];
    tacharNumero:number;
    realizaOperacion:boolean;
    toast:any;
    constructor(){
      this.realizaOperacion = false;
      this.tacharNumero =0;
      this.index = 0;
      this.tirar = 'Tirar dados jugador 1';
      this.numero1 = 1;
      this.numero2 = 1;
      this.turno = true;
      this.tipoOperacion = '+';
      this.toast  = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,  
      });
    }


    validarTurno(){
      this.turno = !this.turno;
      if(this.turno){
        this.tirar = 'Tirar dados jugador 1';
      }else{
        this.tirar = 'Tirar dados jugador 2';
      }
    }
    async iniciarTurno(){
      this.toast.close();
      await this.tirarDados();
      this.index = 0;
      let respuesta = await this.borrarNumero();
      if(respuesta === -1){
          this.notificarOperacion();
      }else{       
        this.validarTurno();
      }
      this.validarGanador();
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
            this.dado1 = `../assets/img/dice${this.numero1}.svg`;
            this.dado2 = `../assets/img/dice${this.numero2}.svg`;   
            clearInterval(miTiro);
            resolve('Terminado');
          }
        }, 400);


    });
      
    }


    borrarNumero():Promise<number>{
      return new Promise((resolve, reject)=>{
        this.tacharNumero = this.numero1+this.numero2;
        if(this.turno){
          const i = this.numerosJugador1.indexOf(this.tacharNumero);
          if(i!== -1){
            this.numerosJugador1.splice(i, 1);
          }
          resolve(i);
        }else{
          const i = this.numerosJugador2.indexOf(this.tacharNumero);
          if(i!== -1){
            this.numerosJugador2.splice(i, 1);
          }
          resolve(i);
        }      
      })
      
    }

    borrarnumerosOperacion():boolean{
      let eliminado = false;
      if(this.turno){
        const i = this.numerosJugador1.indexOf(this.numero1);
        if(i!== -1){
          const j = this.numerosJugador1.indexOf(this.numero2);
          if(j!== -1){
            this.numerosJugador1 = this.numerosJugador1.filter(e=>{
                return e !== this.numero1 &&  e !== this.numero2;     
            })
            eliminado = true;
          }
        }
        return eliminado;
      }else{
        const i = this.numerosJugador2.indexOf(this.numero1);
        if(i!== -1){
          const j = this.numerosJugador2.indexOf(this.numero2);
          if(j!== -1){
            this.numerosJugador2 = this.numerosJugador2.filter(e=>{
              return e !== this.numero1 && e !== this.numero2;     
            })
            eliminado = true;
          }
        }
        return eliminado;
      }      
    }


    notificarOperacion():void{
      this.realizaOperacion = true;
      Swal.fire({
        title:`No puedes tachar el numero ${this.tacharNumero}`,
        text:`Realiza una operción que como resultado de  ${this.tacharNumero}`,
        icon:'info',
        timer:5000,
      }).then(()=>{
        this.index = 5;
        this.toast.fire({
          icon: 'info',
          title: 'Realiza la operación',
        }).then((result:any)=>{   
            this.index = 0;       
            if(result.dismiss =='timer'){    
              this.validarTurno();    
              Swal.fire(
                'Se acabo el tiempo',
                'Has perdido el turno',
                'warning'
                );
            }          
          });
      })
      ; 
    }

    realizarOperacion():void{
        let confirmacion = false;
        this.realizaOperacion = false;
        switch(this.tipoOperacion){
          case '+':
            if(this.tacharNumero === this.numero1+this.numero2){
              confirmacion = this.borrarnumerosOperacion();
            }
          break;

          case '-':
            if(this.tacharNumero === this.numero1-this.numero2){
              confirmacion = this.borrarnumerosOperacion();
            }
          break;

          case '*':
            if(this.tacharNumero === this.numero1*this.numero2){
              confirmacion = this.borrarnumerosOperacion();
            }
          break;

          case '/':
            if(this.tacharNumero === this.numero1/this.numero2){
              confirmacion = this.borrarnumerosOperacion();
            }
          break;
        }

        this.validarTurno();
        if(!confirmacion){
          this.index = 0; 
          Swal.fire(
            'La operación es incorrecta',
            'Has perdido tu turno',
            'warning'
          ); 
        }else{
          this.toast.close();
        }
    }

    validarGanador(){
        let jugadorGanado = 0;
        if(this.numerosJugador1.length==0){
          Swal.fire(
            `El jugador 1 ha ganado`,
             '',
             'success'
           ); 
        }else if(this.numerosJugador2.length == 0){
          Swal.fire(
            `El jugador 2 ha ganado`,
             '',
             'success'
           ); 
        }

        
    }
}
