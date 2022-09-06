import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Title from "../components/Title";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import _ from "lodash";
import CChart from "../components/Chart/CChart";
import ChartWraper from "../components/Chart/ChartWraper4Grid";
import LChart from "../components/Chart/LChart";
import { numberWithCommas } from "../utils/calculation";
import CummulativeWrapper from "../components/Cummulative/CummulativeWrapper";
import AChart from "../components/Chart/AChart";
import BChart from "../components/Chart/BChart";
import CreateStake, { Irrevisible } from "../components/Stake/CreateStake";
import { Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import {
  getTotalStakedAmmount,
  getUserBalance,
  getUserStakedInfo,
  getUserUnclaimRewardByName,
  getTime,
  isClaimable,
  claim,
  compound,
  getTokenURI,
  canWithdrawPrimaryToken,
} from "../hooks/useTokenInfo";
import { toast } from "react-toastify";
import NFTPopup from "../components/Stake/NFTPopup";

const NodePage = () => {
  const { account } = useAuth();
  const [totalStake, setTotalStake] = useState(0);
  const [myState, setMyState] = useState(0);
  const [dailyReward, setDailyReward] = useState(0);
  const [cheemsXBalance, setCheemsXBalance] = useState(0);
  const [userStakeInfo, setUserStakeInfo] = useState([]);
  const [isClaim, setClaimable] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [open, setOpen] = useState(false);
  const [uri, setUri] = useState("")

  useEffect(() => {
    if (!account) return;
    loadUserInfo();
    // eslint-disable-next-line
  }, [account]);

  useEffect(() => {
    if (!account) return;
    (async () => {
      let canClaim = false;
      let reward = 0;
      for (let i = 0; i < selectedList.length; i++) {
        const res = await isClaimable(selectedList[i], account);
        const r = await getUserUnclaimRewardByName(selectedList[i], account)
        if(!r) {
          canClaim = false;
          break;
        }
        reward += r;
        canClaim = res;
        if (!res) break;
      }
      const canWithdraw = await canWithdrawPrimaryToken(reward)
      if(!canWithdraw) {
        canClaim = false;
      }
      setClaimable(canClaim);
    })();
    // eslint-disable-next-line
  }, [selectedList]);

  const loadUserInfo = async () => {
    const userBalance = await getUserBalance(account);
    setCheemsXBalance(userBalance);
    const totalS = await getTotalStakedAmmount();
    setTotalStake(totalS);
    const stakeInfo = await getUserStakedInfo(account);
    let sum = 0;
    _.each(stakeInfo.dailyRewards, (each) => {
      sum += Number(each);
    });
    setDailyReward(sum / 10 ** 18);
    let amount = 0;
    const curTime = await getTime();

    const tmp = [];
    for (let i = 0; i < stakeInfo.stakedInfo.length; i++) {
      if ( Number(stakeInfo.stakedInfo[i].duration) === -1 ) {
        amount += Number(stakeInfo.stakedInfo[i].amount) / 10 ** 18;
        const rewards = await getUserUnclaimRewardByName(
          stakeInfo.stakedInfo[i].name,
          account
        );
        const uri = await getTokenURI(stakeInfo.stakedInfo[i].NFTId)
        let delta = curTime - stakeInfo.stakedInfo[i].stakedTime;
        const stakedTime = Date.now() - delta * 1000;
        delta = curTime - stakeInfo.stakedInfo[i].lastClaimed;
        tmp.push({
          name: stakeInfo.stakedInfo[i].name,
          amount: Number(stakeInfo.stakedInfo[i].amount) / 10 ** 18,
          stakedTime: new Date(stakedTime)
            .toLocaleString("en", { timeZone: "EST", hour12: false })
            .slice(0, 16),
          lastClaimed:
            (Math.round(delta / 3600 / 24) === 0
              ? ""
              : `${Math.round(delta / 3600 / 24)} days `) +
            (Math.round(delta / 3600) % 24 === 0
              ? ""
              : `${Math.round(delta / 3600) % 24} hr`) +
            ` ${Math.round(delta / 60) % 60} min ago`,
          rewards: numberWithCommas(Number(rewards) / 10 ** 18, 2),
          apr: numberWithCommas(
            Number(stakeInfo.dailyRewards[i]) / 10 ** 18,
            2
          ),
          uri: uri
        });
      }
    }
    setUserStakeInfo(tmp);
    setMyState(amount);
  };

  const selected = (nameList) => {
    setSelectedList(nameList);
  };

  const claimSelected = async () => {
    if (!selectedList) return;
    await toast.promise(claim(selectedList, account), {
      pending: "Claiming Now...",
      success: "Success!",
      error: "Something went wrong!",
    });
    loadUserInfo()
  };
  const compoundSelected = async () => {
    if (!selectedList) return;
    await toast.promise(compound(selectedList, account), {
      pending: "Compounding now...",
      success: "Success!",
      error: "Something went wrong!",
    });
    loadUserInfo()
  };

  const loadNFT = (uri) => {
    setUri(uri)
    setOpen(true)
  }

  return (
    <PageContainer>
      <Title title="NFT Node" mb="50px" />
      <ChartWraper mb="50px">
        <AChart
          className="col1"
          value={numberWithCommas(totalStake, 2)}
          title="Total Stakes & Locks"
        />
        <CChart
          className="col2"
          value={numberWithCommas(myState, 2)}
          title="My Stakes"
        />
        <LChart
          className="col3"
          value={numberWithCommas(dailyReward, 2)}
          title="Estimated Daily Rewards"
        />
        <BChart
          className="col4"
          value={numberWithCommas(cheemsXBalance, 2)}
          title="Wallet CheemsX Balance"
        />
      </ChartWraper>
      <CummulativeWrapper
        py="50px"
        mb="30px"
        borderBottom="1px solid rgba(0,0,0,.1)"
        borderTop="1px solid rgba(0,0,0,.1)"
      >
        <CreateStake
          isDisabled={false}
          className="left"
          mode={Irrevisible}
          onCreateStake={loadUserInfo}
          balance={cheemsXBalance}
          title="Create a Node"
        />
      </CummulativeWrapper>
      <Box mb="10px" display="flex">
        <Button
          variant="contained"
          color="info"
          sx={{ mr: "20px" }}
          disabled={!isClaim}
          onClick={claimSelected}
        >
          Claim Selected
        </Button>
        <Button
          variant="contained"
          color="warning"
          disabled={!isClaim}
          onClick={compoundSelected}
        >
          Compound Selected
        </Button>
      </Box>
      <Box mb="50px">
        <EnhancedTable rows={userStakeInfo} onSelected={selected} viewNFT={loadNFT} />
      </Box>
      <NFTPopup isOpen={open} onClose={()=>setOpen(false)} uri={uri} />
    </PageContainer>
  );
};

export default NodePage;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Stake Amount",
  },
  {
    id: "stakedTime",
    numeric: true,
    disablePadding: true,
    label: "Date/Time",
  },
  {
    id: "lastClaimed",
    numeric: true,
    disablePadding: false,
    label: "Last Claimed",
  },
  {
    id: "rewards",
    numeric: true,
    disablePadding: false,
    label: "Rewards",
  },
  {
    id: "apr",
    numeric: true,
    disablePadding: false,
    label: "Daily APR	",
  },
  {
    id: "unstake",
    numeric: true,
    disablePadding: false,
    label: "View NFT",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0
          ? {
              bgcolor: "#111",
            }
          : { bgcolor: "#333" }),
        color: "white",
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Your Nodes
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EnhancedTable({ rows, onSelected, viewNFT }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    console.log(property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    console.log(newSelected);
    setSelected(newSelected);
    if (onSelected) onSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{ width: "100%", mb: 2, borderRadius: "8px", overflow: "hidden" }}
      >
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 850 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{numberWithCommas(row.amount, 3)}</TableCell>
                      <TableCell align="center">{row.stakedTime}</TableCell>
                      <TableCell align="center">{row.lastClaimed}</TableCell>
                      <TableCell align="center">{row.rewards}</TableCell>
                      <TableCell align="center">{row.apr}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="info"
                          onClick={(e)=>{e.stopPropagation(); viewNFT(row.uri);}}
                          size="small"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 43 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
