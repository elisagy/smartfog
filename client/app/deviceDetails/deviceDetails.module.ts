import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DeviceDetailsComponent } from './deviceDetails.component';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'deviceDetails/:deviceId', component: DeviceDetailsComponent },
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


        TooltipModule.forRoot(),
        NgxDatatableModule.forRoot({
            messages: {
                emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
                totalMessage: 'total', // Footer total message
                selectedMessage: 'selected' // Footer selected message
            }
        }),
        NgxChartsModule
    ],
    declarations: [
        DeviceDetailsComponent,
    ],
    providers: [
        SocketService,
    ],
    exports: [
        DeviceDetailsComponent,
    ],
})
export class DeviceDetailsModule { }
