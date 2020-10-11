import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
//import { from } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  body: any;
  genders = ['Female', 'Male', 'Other'];
  gender = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCrl: NavController,
    private alertService: AlertService,
  ) { }
  
  ngOnInit() {
  }

  //Dismiss Register Modal
  dismissRegister() {
    this.modalController.dismiss();
  }

  // On Login button tab, dismiss Register modal and open login Modal
  async loginModal(){
    
    this.dismissRegister();
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }

  GetSelected(value){
    console.log("Selected:" + this.genders[value]);
  }

  register(form: NgForm){

    this.body = {
      ufName: form.value.fname,
      ulname: form.value.lname,
      gender: this.gender,
      age: form.value.age,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      securityQuestion: form.value.securityQuestion,
      securityAnswer: form.value.securityAnswer,
      status: false
    };

    console.log("this is the body: " + JSON.stringify(this.body));

    //alert(this.gender);
    //console.log("Gender Type: "+this.gender);

    //this.voter = this.body;
    this.authService.register(this.body).subscribe(
      (data) => {
        console.log("Data: " + JSON.stringify(data))
        this.authService.login(form.value.username, form.value.password).subscribe(
          (data) => {
            console.log("DATA: "+JSON.stringify(data));
          }, (error) => {
            console.log("ERROR: "+JSON.stringify(error));
          },
          () => {
            this.dismissRegister();
            this.navCrl.navigateRoot('/dashboard');
          }
        );
        console.log("Reg: Log: SU "+JSON.stringify(data));
        this.alertService.presentToast(data['errorMessage']);
      }, 
      error => {
        console.log(error);
      }, 
      () => {

      }
    );
  }
}

/*
{
	"uid": 2,
	"ufName" : "Mjovo",
	"ulName" : "Mpax",
	"gender" : "Male",
	"age" : 29,
	"username" : "mjovo",
	"password" : "tje",
	"email" : "mjovo@gmail.com",
	"securityQuestion" : "color",
	"securityAnswer" : "black",
	"status": true
}
*/