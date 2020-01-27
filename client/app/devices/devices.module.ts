import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap';

import { DevicesComponent } from './devices.component';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'devices', component: DevicesComponent },
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


        TooltipModule.forRoot(),
    ],
    declarations: [
        DevicesComponent,
    ],
    providers: [
        SocketService,
    ],
    exports: [
        DevicesComponent,
    ],
})
export class DevicesModule {}
