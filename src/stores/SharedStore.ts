import { TimeGranularity, TimePeriod } from '@/types';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

export class SharedStore {

    private _timePeriod: TimePeriod

    constructor() {
        this._timePeriod = {
            start: moment().add(-1, 'month').add(1, 'day').valueOf(),
            end: moment().endOf('day').valueOf(),
            granularity: TimeGranularity.DAILY
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