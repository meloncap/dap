import React, { useEffect, useState } from "react";
import AChart from "../components/Chart/AChart";
import ChartWraper from "../components/Chart/ChartWraper4Grid";
import PageContainer from "../components/PageContainer";
import Title from "../components/Title";
import CummulativeWrapper, { CummulativeItem } from '../components/Cummulative/CummulativeWrapper'
import { CummulativePieChart } from '../components/Chart/CummulativeChart'
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableFooter from "@mui/material/TableFooter";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  CustomTableContainer,
  StyledTableCell,
  StyledTableRow,
} from "../components/Table";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { CheemsXMain, ColorList, TreasuryWallet, APIEndpoint, APIKey } from "../utils/constant";
import { numberWithCommas } from "../utils/calculation";
import _ from "lodash"
import { PieSubTopbar } from "../components/Cummulative";
import axios from "axios"
import LChart from "../components/Chart/LChart";

const Treasury = () => {
  const { isInitialized } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const [tBalance, setBalance] = useState(0);
  const [rows, setRows] = useState([]);
  const [totalUSD, setTotalUSD] = useState(0)
  const [pieData, setPieData] = useState([])
  // const [tPrice, setPrice] = useState(0)

  useEffect(() => {
    if (!isInitialized) return;
    fetchTokenBalances();
    // eslint-disable-next-line
  }, [isInitialized]);

  const fetchTokenBalances = async () => {
    const options = {
      chain: "avalanche",
      address: TreasuryWallet,
    };
    const balances = await Web3Api.account.getTokenBalances(options);
    let totalUSD = 0;
    const temp = [];
    let addressList = _.map(balances, each=>{
        return each.token_address
    })
    addressList = _.join(addressList, ",");

    const url = APIEndpoint + "v1/pricing/historical_by_addresses_v2/43114/USD/" +
                addressList + 
                "/?quote-currency=USD&format=JSON" + 
                `&page-size=1000&key=${APIKey}`
    const {data} = await axios.get(url);
    _.map(data.data, (each, index)=>{
        const balanceInfo = _.find(balances, {symbol: each.contract_ticker_symbol})
        if(!balanceInfo) return;
        const USD = each.prices[0].price * balanceInfo.balance/10**each.contract_decimals;
        if(each.contract_address.toLowerCase() === CheemsXMain.toLowerCase()) {
          // setPrice(numberWithCommas(USD,2))
          setBalance(numberWithCommas(balanceInfo.balance/10**each.contract_decimals, 2))
        }
        temp.push({
            name: each.contract_ticker_symbol,
            balance: balanceInfo.balance/10**each.contract_decimals,
            USD: USD,
            color: ColorList[index % 20],
            logo: each.logo_url,
        })
        totalUSD += USD;
    })
    const pieData = _.map(temp, each=>{
        return {
            name: each.name,
            color:each.color,
            value: (each.USD / totalUSD * 100)
        }
    })
    setRows(temp);
    setPieData(pieData)
    setTotalUSD(totalUSD)
  };

  return (
    <PageContainer>
      <Title title="Treasury Balance" mb="50px" />
      <ChartWraper mb="50px" col={1}>
        <AChart className="col1" value={tBalance} title="Treasury CheemsX Holding" />
        <LChart className="col2" value={`$ ${numberWithCommas(totalUSD, 2)}`} title="USD value of Treasury" />
      </ChartWraper>
      <CustomizedTables rows={rows} totalUSD={totalUSD} />
      <CummulativeWrapper mt="50px">
        <CummulativeItem className="left" title="USD By %">
          <PieSubTopbar
            display="flex"
            width="100%"
            height="100%"
            alignItems="center"
          >
            <Box className="chart">
              <CummulativePieChart pieData={pieData} />
            </Box>
            <Box fontSize="16px" className="info">
              <Box display="flex" flexDirection="column">
                {_.map(rows, (each, index)=>{
                    return <Box display="flex" alignItems="center" mb="20px" key={index}>
                    <Box
                      borderRadius="50%"
                      width="10px"
                      height="10px"
                      bgcolor={each.color}
                      mr="15px"
                    />
                    <Box>{each.name}</Box>
                  </Box>
                })}
              </Box>
            </Box>
          </PieSubTopbar>
        </CummulativeItem>
      </CummulativeWrapper>
    </PageContainer>
  );
};

export default Treasury;

function CustomizedTables({ rows, totalUSD }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <CustomTableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" width={'25%'}>Token</StyledTableCell>
            <StyledTableCell align="center" width={'25%'}>Token Balance</StyledTableCell>
            <StyledTableCell align="center" width={'25%'}>Total Percentage</StyledTableCell>
            <StyledTableCell align="center" width={'25%'}>Current USD Value</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows).map((row, index) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell
                align="center"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Box ml="10px">{row.name}</Box>
              </StyledTableCell>
              <StyledTableCell align="center">{numberWithCommas(row.balance,3)}</StyledTableCell>
              <StyledTableCell align="center">
                {((row.USD / totalUSD) * 100).toFixed(2)}%
              </StyledTableCell>
              <StyledTableCell align="center">${numberWithCommas(row.USD,2)}</StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              style={{ width: "100%" }}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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
