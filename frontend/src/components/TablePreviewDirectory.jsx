import React, {useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import TablePreview from "./TablePreview";

const TablePreviewDirectory = ({handleWordClick}) => {
    const [leftPreviews, setLeftPreviews] = useState([]);
    const [rightPreviews, setRightPreviews] = useState([]);
    const loadTablePreviews = async () => {
        const curatedBoardsEndpoint = `api/table/table-previews`;
        const response = await fetch(curatedBoardsEndpoint);
        const data = await response.json();
        setLeftPreviews(data.leftPreviews);
        setRightPreviews(data.rightPreviews);
    }

    useEffect(() => {
        loadTablePreviews();
    }, []);

    return (
        <>
            <Grid container xs={12} sx={{marginTop: '20px', height: '70vh', overflowY: 'auto'}}>
                {/*Left Column*/}
                <Grid container xs={5.9} sx={{height: 'fit-content'}}>
                    {leftPreviews && leftPreviews.map((table, index) => {
                        return (
                            <TablePreview table={table} colorIndex={index}
                                          handleWordClick={handleWordClick}></TablePreview>
                        )
                    })}
                </Grid>

                {/*Spacing*/}
                <Grid container xs={0.2}></Grid>

                {/* Right Column Board*/}
                <Grid container xs={5.9} sx={{height: 'fit-content'}}>
                    {rightPreviews && rightPreviews.map((table, index) => {
                        return (
                            <TablePreview table={table} colorIndex={index + 2}
                                          handleWordClick={handleWordClick}></TablePreview>
                        )
                    })}
                </Grid>
            </Grid>

        </>
    );
};

export default TablePreviewDirectory;
