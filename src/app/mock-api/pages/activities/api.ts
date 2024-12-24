import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { activities as activitiesData } from './data';

@Injectable({ providedIn: 'root' })
export class ActivitiesMockApi {
  private _activities: any = activitiesData;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Activities - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/pages/activities')
      .reply(() => [200, cloneDeep(this._activities)]);
  }
}
