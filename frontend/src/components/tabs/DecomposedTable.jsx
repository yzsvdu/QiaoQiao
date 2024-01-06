import React from "react";
import {Grid, Paper, Typography} from "@mui/material";
import pinyinify from "../../helpers/pinyin_converter";

const DecomposedTable = ({decomposition}) => {
    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    marginTop: '8px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    maxHeight: '60vh', // Set a maximum height for the container
                    overflowY: 'auto', // Enable vertical scrolling when content exceeds the maximum height
                }}
            >
                {decomposition && decomposition.map((decomposedWord, index) => (
                    <Grid
                        container
                        item
                        key={index}
                        spacing={1}
                        justifyContent="center" // Center the nested Grid horizontally
                        alignItems="center" // Center the nested Grid vertically
                        sx={{
                            marginBottom: '8px',
                            width: '100%',
                        }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                padding: '8px',
                                borderRadius: '4px',
                                width: '100%',
                                backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'bisque',
                            }}
                        >
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">
                                        {decomposedWord.simplified + ' ' + pinyinify(decomposedWord.pinyin)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        {decomposedWord.definitions.replaceAll('/', '; ')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default DecomposedTable;
