import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

import * as shape from 'd3-shape';

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

    chartData = [];
    colorScheme: any = { domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'] };
    curve: any = shape.curveLinear;

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
                    this.device = devices || {};
                    return this.http.get('/api/readings')
                        .subscribe((readings: any[]) => {
                            this.readings = readings.filter(reading => reading.device === this.device._id || reading.device._id === this.device._id);
                            this.chartData = this.getChartData();
                            this.SocketService.syncUpdates('reading', this.readings, (event, reading, readings) => {
                                this.readings = [...readings.filter(reading => reading.device === this.device._id || reading.device._id === this.device._id)];
                                this.chartData = this.getChartData();
                            });
                            this.SocketService.syncUpdates('device', [], (event, device) => {
                                this.device = device;
                                this.chartData = this.getChartData();
                            });
                        });
                })
        );
    }

    ngOnDestroy() {
        this.SocketService.unsyncUpdates('reading');
        this.SocketService.unsyncUpdates('device');
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

    getChartData() {
        return [{ name: this.device.name, series: this.readings.map(reading => ({ name: new Date(reading.createdAt), value: reading.humidity })) }];
    }
}
