import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Voter } from 'src/app/models/voter';
import { Candidate } from 'src/app/models/candidate';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {
  voter: Voter;
  candidates: Candidate[];
  private i: number; 
  //candidate: Candidate;
  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private alertService: AlertService,
    ) {
      this.menu.enable(true);
  }

  ngOnInit() {
    this.authService.getCandidates()
    .subscribe( data => {
      console.log(data);
      this.candidates = data;
    });

    this.authService.getVoter().subscribe(
      voter => {
        console.log("Voter: "+JSON.stringify(voter));
        this.voter = voter;

        console.log("Status:: "+this.voter.status);
      }
    );

    /*this.authService.getCandidate(this.authService.uid)
    .subscribe(data => {
      console.log(data);
      this.candidate = data;
    });*/

  }

  async presentprompt(i){
    let alert = await this.alertCtrl.create({
      header: 'Vote',
      message: 'Every vote counts',
      cssClass: 'prompt-alert',

      inputs: [
        /*{
          name: 'Vote:',
          value: 
          //name: 'username',
          //placeholder: 'Username',
          //AlertInput.type: 'radio',
        }*/
        {
          name: 'Vote',
          type: 'checkbox',
          placeholder: 'Vote',
          label: 'Vote',
          checked: true,
          disabled: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (data) => {
            console.log('Cancel clicked');
            this.alertService.presentToast('Click "Vote" button to vote');
          }
        },
        {
          text: 'Vote',
          
          handler: (data) => {

            if(this.voter.status == false){
              console.log("You can vote.");
              this.voter.status = true;
              console.log("Updating Voter: "+ JSON.stringify(this.voter));
              this.authService.updateVoter(this.voter).subscribe((data) => {
                  console.log("Result: " + JSON.stringify(data));
                  console.log("SLS: " + i);
                  this.addVoteCount(i);
                  this.alertService.presentToast('Thank you, You voted for ' + this.candidates[i].name);
                }, (error) => {
                  console.log("Error Result: " + error);
                }
              );
            } else {
              console.log("You already voted.");
              this.alertService.presentToast('You already voted.');
            }
            
            console.log(data);
            /*if(User.isvalid(data.username, data.password)){
              //logged in!
            }else{
              //invalidlogin
              return false;
            }*/
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewWillEnter(){
    this.authService.getVoter().subscribe(
      voter => {
        console.log("Voter: " + JSON.stringify(voter))
        this.voter = voter;
      }
    );
  }

  addVoteCount(i){
    
    console.log("This boots(cId) " + this.candidates[i].cId);
   
    this.authService.getCandidate(this.candidates[i].cId).subscribe(
        (candidate) => {
          candidate.count = candidate.count+1;
          console.log("DDDDDD: "+candidate.count);
          this.authService.updateCandidate(candidate).subscribe((data) => {
              console.log(JSON.stringify(data));
            }, (error) => {
              console.log(JSON.stringify(error));
            }
          );
        }, (err) => {
          console.log("Error " + JSON.stringify(err));
        }
    )
    
    //let candidate: Candidate;
    //console.log(counter_add);
    /*candidate.count_votes = 0;
    candidate.name = this.candidates[i].name;
    candidate.partyName = this.candidates[i].partyName;
    candidate.cId = this.candidates[i].cId;

    this.authService.updateCandidate(candidate).subscribe(
      (data) => {
        console.log(data);
      }, (error) => {
        console.log(error);
      }
    );*/
  }
}
