import {
    async,
    ComponentFixture,
    inject,
    TestBed,
} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from 'chai';
import { TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../components/socket/socket.service';
import { SocketServiceStub } from '../../components/socket/socket.mock';
import { DevicesComponent } from './devices.component';

describe('Component: DevicesComponent', function() {
    let comp: DevicesComponent;
    let fixture: ComponentFixture<DevicesComponent>;
    let httpTestingController: HttpTestingController;
    const mockThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                TooltipModule.forRoot(),
                HttpClientTestingModule,
            ],
            declarations: [ DevicesComponent ], // declare the test component
            providers: [
                { provide: SocketService, useClass: SocketServiceStub },
            ],
        }).compileComponents();

        httpTestingController = TestBed.get(HttpTestingController);
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(DevicesComponent);
        // DevicesComponent test instance
        comp = fixture.componentInstance;

        /**
         * Trigger initial data binding and run lifecycle hooks
         */
        fixture.detectChanges();
    }));

    it('should attach a list of things to the controller', () => {
        // `GET /api/things` should be made once
        const req = httpTestingController.expectOne('/api/things');
        expect(req.request.method).to.equal('GET');

        // Respond with mock data
        req.flush(mockThings);

        // assert that there are no outstanding requests
        httpTestingController.verify();

        expect(comp.awesomeThings).to.equal(mockThings);
    });
});
