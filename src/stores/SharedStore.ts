import { TimeGranularity, TimePeriod } from '@/types';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

export class SharedStore {

    private _timePeriod: TimePeriod

    constructor() {
        this._timePeriod = {
            start: null,
            end: moment().endOf('day').valueOf(),
            granularity: TimeGranularity.MONTHLY
        }
        makeAutoObservable(this);
    }

    get timePeriod(): TimePeriod {
        return this._timePeriod
    }

    set timePeriod(timePeriod: TimePeriod) {
        this._timePeriod = timePeriod
    }
}