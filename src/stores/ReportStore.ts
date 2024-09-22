import { ReportApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { BookBalanceReport, ReportBookBalanceOption } from '@client/model';
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
}