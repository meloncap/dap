import { styled, Box } from '@mui/material'

const ChartWraper4Grid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 0px;

    .col1 { grid-area: 1 / 1 / 2 / 2; }
    .col2 { grid-area: 1 / 2 / 2 / 3; }
    .col3 { grid-area: 1 / 3 / 2 / 4; }
    .col4 { grid-area: 1 / 4 / 2 / 5; }

    @media (max-width: 1366px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: ${p=> `repeat(${!p.col ? '2' : p.col}, 1fr)`};
        grid-column-gap: 30px;
        grid-row-gap: 50px;

        .col1 { grid-area: 1 / 1 / 2 / 2; }
        .col2 { grid-area: 1 / 2 / 2 / 3; }
        .col3 { grid-area: 2 / 1 / 3 / 2; }
        .col4 { grid-area: 2 / 2 / 3 / 3; }
    }
    
    @media (max-width: 600px) {
        display: flex;
        flex-direction: column;
    }
`

export default ChartWraper4Grid;