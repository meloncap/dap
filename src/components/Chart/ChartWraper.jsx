import { styled, Box } from '@mui/material'

const ChartWraper = styled(Box)`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    .col1 { grid-area: 1 / 1 / 2 / 3; }
    .col2 { grid-area: 1 / 3 / 2 / 5; }
    .col3 { grid-area: 1 / 5 / 2 / 7; }
    .col4 { grid-area: 1 / 7 / 2 / 9; }
    .col5 { grid-area: 2 / 1 / 3 / 3; }

    @media (max-width: 1366px) {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-column-gap: 30px;
        grid-row-gap: 50px;
        .col1 { grid-area: 1 / 1 / 2 / 4; }
        .col2 { grid-area: 1 / 4 / 2 / 7; }
        .col3 { grid-area: 1 / 7 / 2 / 10; }
        .col4 { grid-area: 2 / 2 / 3 / 5; }
        .col5 { grid-area: 2 / 6 / 3 / 9; }
    }
    
    @media (max-width: 600px) {
        display: flex;
        flex-direction: column;
    }
`

export default ChartWraper;