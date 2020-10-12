import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(private toastController: ToastController){}
    
    //jsjsjjsjsja

    async presentToast(message: any){
            message: message,
            duration: 2000,
            position: 'bottom',
            color: 'dark',
            cssClass: 'presentToast'
        });
        toast.present();
    }
}