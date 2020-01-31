import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

@Component({
    selector: 'devices',
    template: require('./devices.html'),
    styles: [require('./devices.scss')],
})
export class DevicesComponent implements OnInit, OnDestroy {
    SocketService;
    devices: any[] = [];

    static parameters = [HttpClient, SocketService];
    constructor(private http: HttpClient, private socketService: SocketService) {
        this.http = http;
        this.SocketService = socketService;
    }

    ngOnInit() {
        return this.http.get('/api/devices')
            .subscribe((devices: any[]) => {
                this.devices = devices;
                this.SocketService.syncUpdates('device', this.devices);
            });
    }

    ngOnDestroy() {
        this.SocketService.unsyncUpdates('device');
    }
}
