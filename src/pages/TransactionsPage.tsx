import BookSelect from "@/components/BookSelect"
import { useBookStore } from "@/contexts/useStore"
import MainTemplate from "@/templates/MainTemplate"
import utilStyles from "@/utilStyles"
import { Book } from "@client/model"
import { Toolbar, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { PropsWithChildren, useCallback, useEffect } from "react"

export type TransactionsPageProps = PropsWithChildren
/**
 * 
1. 收入與花費趨勢圖（Income vs. Expenses Trend Chart）
折線圖（Line Chart）：展示每月或每年的收入與花費變化趨勢，通常用不同顏色表示收入和花費。
柱狀圖（Bar Chart）：按月、季度或年度顯示收入和花費的絕對值，易於比較不同時間段的變化。
2. 資產與債務趨勢圖（Assets vs. Liabilities Trend Chart）
折線圖（Line Chart）：顯示資產和債務隨著時間的增減變化，可以幫助理解資產負債的變化趨勢。
堆疊面積圖（Stacked Area Chart）：將資產和債務疊加在一起，觀察總體財務狀況的變化。
3. 淨資產趨勢圖（Net Worth Trend Chart）
折線圖（Line Chart）：展示資產減去債務後的淨資產隨時間的變化，反映財務健康狀況。
堆疊柱狀圖（Stacked Bar Chart）：可以用不同顏色區分不同資產類別或債務類別的增減變化。
4. 收入與花費結構圖（Income and Expense Structure Chart）
圓餅圖（Pie Chart）：分別展示不同收入來源和花費類別的比例構成，了解收入和花費的結構。
環狀圖（Doughnut Chart）：類似圓餅圖，但中間有空白，適合同時展示收入與花費的比例。
5. 現金流量圖（Cash Flow Chart）
瀑布圖（Waterfall Chart）：展示收入、花費、資產增值和債務變化等的現金流量，便於理解現金流的來源和去向。
6. 財務健康評估圖（Financial Health Assessment Chart）
雷達圖（Radar Chart）：多個維度同時展示，如收入穩定性、負債比率、儲蓄率等，視覺化地呈現財務健康狀況。
 * 
 */

export const TransactionsPage = observer(function AboutPage(props: TransactionsPageProps) {


    const bookStore = useBookStore()

    const { books, currentBookId } = bookStore
    useEffect(() => {
        if (!books) {
            bookStore.fetchBooks()
        }
    }, [bookStore, books])

    const onBookChange = useCallback((book?: Book) => {
        bookStore.currentBookId = book?.id
    }, [bookStore])

    return <MainTemplate>
        <Toolbar css={utilStyles.alignSelfStretch}>
            <BookSelect bookId={currentBookId} books={books} onChange={onBookChange} />
        </Toolbar>
        <Typography>TransactionsPage</Typography>
    </MainTemplate>
})

export default TransactionsPage