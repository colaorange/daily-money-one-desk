import { BookApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { Book } from '@client/model';
import { makeAutoObservable, runInAction } from 'mobx';

export class BookStore {

    readonly configuration: Configuration
    private _currentBookId?: string;
    private _books?: Book[] | undefined
    private _fetchingBooks = 0

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

    get currentBook(): Book | undefined {
        return (this._books && this._currentBookId) ? this._books.find((b) => b.id === this._currentBookId) : undefined
    }

    async fetchBooks(force?: boolean): Promise<void> {
        if (!force && this._fetchingBooks > 0) {
            return
        }
        this._fetchingBooks++
        try {
            const books = (await new BookApi(this.configuration).listBookAll()).data
            runInAction(() => {
                this._books = books
            })
        } finally {
            this._fetchingBooks--
        }
    }
}