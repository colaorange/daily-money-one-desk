import { AccountApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { Account } from '@client/model';
import { makeAutoObservable, runInAction } from 'mobx';

export class AccountStore {

    readonly configuration: Configuration
    private _accounts?: Account[] | undefined

    constructor({ configuration }: { configuration: Configuration }) {
        this.configuration = configuration

        makeAutoObservable(this);
    }

    get accounts(): Account[] | undefined {
        return this._accounts
    }

    findBookAccounts(bookId: string): Account[] | undefined {
        return this._accounts ? this._accounts.filter((a) => a.bookId === bookId) : undefined
    }


    async fetchAccounts(force?: boolean): Promise<void> {
        if (!force && this._accounts) {
            return
        }
        const accounts = (await new AccountApi(this.configuration).listAccountAll()).data
        runInAction(() => {
            this._accounts = accounts
        })
    }
}