import React, {useState, useEffect } from 'react'
import PageContainer from "../components/PageContainer"
import Title from '../components/Title'
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { CustomTableContainer, StyledTableCell, StyledTableRow } from "../components/Table";
import _ from "lodash";
import BuyBackChart from '../components/BuyBackChart';
import CChart from '../components/Chart/CChart';
import ChartWraper from '../components/Chart/ChartWraper4Grid';
import LChart from '../components/Chart/LChart';
import { numberWithCommas } from '../utils/calculation';
import CummulativeWrapper from '../components/Cummulative/CummulativeWrapper';
import useTransaction from '../hooks/useTransaction';
import { AvaxAPIKey, BuybackWallet, TxEndpoint } from '../utils/constant';
import axios from 'axios';

const Airdrop = () => {
    const [totalCheemsX, setTotalCheemsX] = useState(0)
    const [totalAvax, setTotalAvax] = useState(0)
    // const {account} = useAuth()
    const {airdropHistory, buybackHistory} = useTransaction()
    const [accAirdrop, setAirdrop] = useState([])
    const [accJackpot, setAccJackpot] = useState([])
    const [jackpotHistory, setJackpotHisory] = useState([])

    
    useEffect(()=>{
        let accAmount = 0;
        let delta = airdropHistory[0].amount;
        const accBuyBack = _.map(airdropHistory, each=>{
            const tmp = _.cloneDeep(each)
            accAmount += tmp.amount;
            tmp.amount = accAmount - delta;
            tmp.delta = delta;
            return tmp;
        })
        setAirdrop(accBuyBack)
        setTotalCheemsX(accAmount)
    }, [airdropHistory])

    useEffect(()=>{
        (async()=>{
            const url=`${TxEndpoint}${BuybackWallet}&startblock=1&endblock=99999999&sort=asc&apikey=${AvaxAPIKey}`
            const res = await axios.get(url);
            let _totalAVAX=0;
            const tmp = []
            const chatyTmp = []
            _.map(res.data.result, each=>{
                if(Number(each.value) !== 0) {
                    if(_.findIndex(buybackHistory, {blockNum: Number(each.blockNumber)}) !== -1) return
                    tmp.push({date: new Date(each.timeStamp*1000).toLocaleString("en", { hour12: false }), amount: numberWithCommas(each.value / 10**18, 2) + ' AVAX', reciever: each.to, tx: each.hash})
                    _totalAVAX += each.value / 10 ** 18
                    chatyTmp.push({amount: _totalAVAX, delta: 0, date: new Date(each.timeStamp*1000).toLocaleString("en", { hour12: false })})
                }
            })
            setJackpotHisory(tmp)
            setTotalAvax(_totalAVAX)
            setAccJackpot(chatyTmp)
        })()
    }, [buybackHistory])

    
    return (
        <PageContainer>
            <Title title="Giveway & AirDrop" mb="50px" />
            <ChartWraper mb="50px" col={1}>
                <CChart className="col1" value={numberWithCommas(totalCheemsX, 2)} title="Total CheemsX Airdropped" />
                <LChart className="col2" value={numberWithCommas(totalAvax, 2) + ' AVAX'} title="Total AVAX Jackpots Distributed" />
            </ChartWraper>
            <Box mb="50px">
                <CustomizedTables title="CheemsX Airdrop" headerList={HeadData1} dataList={airdropHistory} />
            </Box>
            <Box>
                <CustomizedTables title="AVAX Jackpot" headerList={HeadData2} dataList={jackpotHistory} />
            </Box>
            <CummulativeWrapper mt="50px">
                <BuyBackChart title="Airdrops Chart" color="#36ac52" fillColor={"#36ac52c0"} position="left" data={accAirdrop} />
                <BuyBackChart title="JackPot Chart" color="#fa4251" fillColor={"#fa4251a7"} position="right" data={accJackpot} />
            </CummulativeWrapper>
        </PageContainer>
    );
}

export default Airdrop

const HeadData1 = [
    'Date',
    'Amount of CheemsX',
    'Recipient Wallet Address',
    'Transaction Link'
]

const HeadData2 = [
    'Date',
    'Amount of AVAX',
    'Recipient Wallet Address',
    'Transaction Link'
]

function CustomizedTables({ headerList, dataList, title }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [_dataList, setDataList] = React.useState([])

    useEffect(()=>{
        const tmp = _.cloneDeep(dataList)
        _.reverse(tmp)
        setDataList(tmp)
    },[dataList])

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - _dataList.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <>
            <Box color="#333333" component="h6">{title}</Box>
            <CustomTableContainer component={Paper} sx={{ maxHeight:  500}}>
                <Table stickyHeader sx={{ minWidth: 700}} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {
                                _.map(headerList, (each, index) => {
                                    return <StyledTableCell align="center" key={index}>{each}</StyledTableCell>
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? _dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : _dataList).map((row, index) => {
                                if(row.date === "no data") return null;
                                return <StyledTableRow key={index}>
                                    <StyledTableCell align="center">{row.date}</StyledTableCell>
                                    <StyledTableCell align="center">{row.amount}</StyledTableCell>
                                    <StyledTableCell align="center">{row.reciever}</StyledTableCell>
                                    <StyledTableCell align="center"><a href={`https://snowtrace.io/tx/${row.tx}`}>view Tx</a></StyledTableCell>
                                </StyledTableRow>
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={_dataList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                style={{ width: '100%' }}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </CustomTableContainer>
        </>
    );
}

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

