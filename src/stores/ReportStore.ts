import { ReportApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { BookBalanceReport, ReportBookBalanceOption, ReportBookGranularityBalanceOption, BookGranularityBalanceReport } from '@client/model';
import { makeAutoObservable } from 'mobx';

export class ReportStore {

    readonly configuration: Configuration

    constructor({ configuration }: { configuration: Configuration }) {
        this.configuration = configuration
        makeAutoObservable(this);
    }

    async reportBookBalance(bookId: string, option: ReportBookBalanceOption): Promise<BookBalanceReport> {
        return (await new ReportApi(this.configuration).reportBookBalance(bookId, option)).data
    }

    async reportBookGranularityBalance(bookId: string, option: ReportBookGranularityBalanceOption): Promise<BookGranularityBalanceReport> {
        return (await new ReportApi(this.configuration).reportBookGranularityBalance(bookId, option)).data
    }
}