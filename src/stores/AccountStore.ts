import { AccountApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { Account } from '@client/model';
import { makeAutoObservable, runInAction } from 'mobx';

export class AccountStore {

    readonly configuration: Configuration
    private _accounts?: Account[] | undefined
    private _fetchingAccounts = 0

    constructor({ configuration }: { configuration: Configuration }) {
        this.configuration = configuration

        makeAutoObservable(this);
    }

    get accounts(): Account[] | undefined {
        return this._accounts
    }

    listBookAccounts(bookId: string): Account[] {
        return this._accounts ? this._accounts.filter((a) => a.bookId === bookId) : []
    }

    mapBookAccounts(bookId: string): Map<string, Account> {
        return new Map((this._accounts ? this._accounts.filter((a) => a.bookId === bookId) : []).map(a => [a.id, a]))
    }

    getAccount(uid: string): Account | undefined {
        return (this._accounts) ? this._accounts.find((a) => a.id === uid) : undefined
    }


    async fetchAccounts(force?: boolean): Promise<void> {
        if (!force && (this._accounts || this._fetchingAccounts > 0)){
            return
        }
        this._fetchingAccounts++
        try {
            //all accounts in all books, include hidden account
            const accounts = (await new AccountApi(this.configuration).listAccountAll()).data
            runInAction(() => {
                this._accounts = accounts
            })
        } finally {
            this._fetchingAccounts--
        }
    }
}