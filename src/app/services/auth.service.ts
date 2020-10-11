import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { Voter } from '../models/voter';
import { Candidate } from '../models/candidate';
import { Result } from '../models/result';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    isloggedIn = false;
    token:any;
    uid: number;

    constructor(
        private http: HttpClient,
        private storage: NativeStorage,
        private env: EnvService,
    ){ 

    }

    login(username, password){
        //console.log("Username: " + username + " Password: " + password);
        return this.http.post<Voter>(this.env.API_URL+'/voterlogin',
            {username: username, password: password})
            .pipe(tap(token => {
                
                console.log("Token UID: "+token.uid);
                this.uid = token.uid;
                console.log("Token Data: "+JSON.stringify(token));
                this.storage.setItem('token', JSON.stringify(token))
                .then( () => {
                        console.log('Token Stored');
                    },
                    (error) => {
                        console.log(error);
                        console.error('Error storing item', error);
                    }
                );
                this.token = token;
                this.isloggedIn = true;
                return token;
            }),
        );
    }

    register(voter: Voter){
        /*const headers = new HttpHeaders({
            'Authorization': this.token["token_type"]+" "+this.token["access_token"]
        });*/

        return this.http.post(this.env.API_URL+'/createvoter', voter);
    }

    logout() {
        const headers = new HttpHeaders({
            'Authorization': this.token["token_type"]+" "+this.token["access_token"]
        });

        return this.http.get<Voter>(this.env.API_URL+'/voter/'+this.uid, {headers: headers})
            .pipe(tap(data => {
                this.storage.remove("token");
                this.isloggedIn = false;
                return data;
            })
        );
    }

    getVoter(){
        const headers = new HttpHeaders({
            'Authorization': this.token["token_type"] + " " + this.token["access_token"]
        });

        //return this.http.get<Voter>(this.env.API_URL+'auth/voter', {headers: headers})
        return this.http.get<Voter>(this.env.API_URL+'/voter/'+this.uid, {headers: headers})
            .pipe(tap(voter => {
                console.log("Voter "+JSON.stringify(voter));
                console.log("Voter status: "+ JSON.stringify(voter.status));
                return voter;
            })
        );
    }

    updateVoter(voter: Voter){
        return this.http.put<any>(this.env.API_URL+'/updatevoter',voter)
            .pipe(tap( (data) => {
                console.log("Updating data: "+ JSON.stringify(data));
                return data;
            },)
        );
    }

    getToken() {
        return this.storage.getItem('token').then(
            data => {
                this.token = data;

                if(this.token != null) {
                    this.isloggedIn = true;
                }else {
                    this.isloggedIn = false;
                }
            },
            error => {
                console.log(error);
                this.token = null;
                this.isloggedIn = false;
            }
        );
    }

    getCandidates(){

        /*const headers = new HttpHeaders({
            'Authorization': this.token["token_type"]+" "+this.token["access_token"]
        });*/

        return this.http.get<Candidate[]>(this.env.API_URL+'/candidates')
            .pipe(tap(data => {
                return data;
            })
        );
    }

    getCandidate(id) {

        const headers = new HttpHeaders({
            'Authorization': this.token["token_type"] +" "+ this.token["access_token"]
        });

        return this.http.get<Candidate>(this.env.API_URL+'/candidate/'+id)
            .pipe(tap(data => {
                return data;
            })
        );
    }

    updateCandidate(candidate: Candidate){
        const headers = new HttpHeaders({
            'Authorization': this.token["toke_type"] +" "+ this.token["access_token"]
        });

        return this.http.put<any>(this.env.API_URL+'/updateCandidate', candidate)
            .pipe(tap(data => {
                
                return data;
            })
        );
    }

    addVoter(voter: Voter){
        
        const headers = new HttpHeaders({
            'Authorization': this.token["token_type"] + " " + this.token["access_token"]
        });

        return this.http.put<Result>(this.env.API_URL+'/updatevoter', voter, {headers: headers})
            .pipe(tap(data => {
                return data;
            })
        );
    }

    //generate admin OTP
    getnerateAdminOTP(){
        const headers = new HttpHeaders({
            'Authorization': this.token["token_type"] + " " + this.token["access_token"]
        });

        return this.http.get<any>(this.env.API_URL+'/otp', {headers:headers})
            .pipe(tap(otp => {
                return otp;
            })
        );
    }
}