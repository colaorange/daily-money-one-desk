import { BookApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { Book } from '@client/model';
import { makeAutoObservable } from 'mobx';

export class BookStore {

    readonly configuration: Configuration
    private _currentBookId?: string;
    private _books?: Book[] | undefined

    constructor({ configuration, currentBookId }: { configuration: Configuration, currentBookId?: string }) {
        this.configuration = configuration
        this._currentBookId = currentBookId

        makeAutoObservable(this);
    }

    get currentBookId(): string | undefined {
        return this._currentBookId
    }
    set currentBookId(currentBookId: string | undefined) {
        this._currentBookId = currentBookId
    }

    get books(): Book[] | undefined {
        return this._books
    }

    async fetchBooks(): Promise<Book[]> {
        const books = (await new BookApi(this.configuration).listBook()).data
        this._books = books
        return books
    }
}