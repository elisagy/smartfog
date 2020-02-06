import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

@Component({
    selector: 'devices',
    template: require('./devices.html'),
    styles: [require('./devices.scss')],
})
export class DevicesComponent implements OnInit, OnDestroy {
    Router;
    SocketService;
    devices: any[] = [];
    selectedDevices: any[] = [];
    newDevice: any = {};

    static parameters = [HttpClient, Router, SocketService];
    constructor(private http: HttpClient, private router: Router, private socketService: SocketService) {
        this.http = http;
        this.Router = router;
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

    onDeviceSelected() {
        this.Router.navigate([`/deviceDetails/${(this.selectedDevices.pop() || {})._id}`]);
    }

    addDevice() {
        if (this.newDevice) {
            return this.http.post('/api/devices', this.newDevice)
                .subscribe(device => {
                    this.newDevice = {};
                });
        }
    }

    deleteDevice($event: any, deviceId: string) {
        $event.stopPropagation();
        return this.http.delete(`/api/devices/${deviceId}`).subscribe();
    }
}
