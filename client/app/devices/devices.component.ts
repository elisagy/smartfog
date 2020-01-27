import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

interface Thing {
    name: string;
    info?: string;
}

@Component({
    selector: 'devices',
    template: require('./devices.html'),
    styles: [require('./devices.scss')],
})
export class DevicesComponent implements OnInit, OnDestroy {
    SocketService;

    static parameters = [HttpClient, SocketService];
    constructor(private http: HttpClient, private socketService: SocketService) {
        this.http = http;
        this.SocketService = socketService;
    }

    ngOnInit() {
        
    }


    ngOnDestroy() {
        
    }
}
