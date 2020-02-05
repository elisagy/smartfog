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
    newDevice: any = {};

    static parameters = [HttpClient, SocketService];
    constructor(private http: HttpClient, private socketService: SocketService) {
        this.http = http;
        this.SocketService = socketService;
    }

    ngOnInit() {
        return this.http.get('/api/devices')
            .subscribe((devices: any[]) => {
                this.devices = devices;
                this.SocketService.syncUpdates('device', this.devices, (event, device, devices) => {
                    this.devices = [...devices];
                });
            });
    }

    ngOnDestroy() {
        this.SocketService.unsyncUpdates('device');
    }

    addDevice() {
        if (this.newDevice) {
            return this.http.post('/api/devices', this.newDevice)
                .subscribe(device => {
                    this.newDevice = {};
                });
        }
    }

    deleteDevice(deviceId) {
        return this.http.delete(`/api/devices/${deviceId}`).subscribe();
    }
}
