import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

@Component({
    selector: 'deviceDetails',
    template: require('./deviceDetails.html'),
    styles: [require('./deviceDetails.scss')],
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {
    ActivatedRoute;
    SocketService;
    device: any;
    readings: any[] = [];
    newReading: any = {};

    static parameters = [HttpClient, ActivatedRoute, SocketService];
    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private socketService: SocketService) {
        this.http = http;
        this.ActivatedRoute = activatedRoute;
        this.SocketService = socketService;
    }

    ngOnInit() {
        return this.ActivatedRoute.params.subscribe(params =>
            this.http.get(`/api/devices/${params.deviceId}`)
                .subscribe((devices: any[]) => {
                    this.device = devices.pop() || {};
                    return this.http.get('/api/readings')
                        .subscribe((readings: any[]) => {
                            this.readings = readings.filter(reading => reading.device === this.device._id);
                            this.SocketService.syncUpdates('reading', this.readings, (event, reading, readings) => {
                                this.readings = [...readings.filter(reading => reading.device === this.device._id)];
                            });
                        });
                })
        );
    }

    ngOnDestroy() {
        this.SocketService.unsyncUpdates('reading');
    }

    addReading() {
        if (this.newReading) {
            return this.http.post('/api/readings', Object.assign({}, this.newReading, { device: this.device._id }))
                .subscribe(reading => {
                    this.newReading = {};
                });
        }
    }

    deleteReading(readingId) {
        return this.http.delete(`/api/readings/${readingId}`).subscribe();
    }
}
