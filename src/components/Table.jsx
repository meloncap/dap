import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#333',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        // borderRadius: '10px'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 18,
        color: '#808080',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({

    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '10px',
    '&::-webkit-scrollbar': {
        height: '8px',
        width: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'darkgrey',
        borderRadius: '5px'
    }
    
}));
