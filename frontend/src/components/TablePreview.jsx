import React from 'react';
import {Grid, Typography} from '@mui/material';
import {Link} from 'react-router-dom';

const TablePreview = ({table, colorIndex, handleWordClick}) => {
    const lightColors = [
        'lightblue',
        'lightcoral',
        'lightgreen',
        'lightgoldenrodyellow',
        'lightskyblue',
        'lightpink',
        'lightseagreen',
        'lightsteelblue',
    ];

    return (
        <Grid container>
            <Grid item xs={12}>
                <Link
                    to={'/' + table.name.replaceAll(' ', '-').toLowerCase()}
                    style={{color: 'black'}}
                >
                    <Typography variant="h6" style={{textAlign: 'left'}}>
                        {table.name}
                    </Typography>
                </Link>
            </Grid>
            <Grid container xs={12}
                  sx={{
                      backgroundColor: lightColors[colorIndex % 8],
                      borderRadius: '5px'
                  }}
            >
                <Grid container xs={6}
                      sx={{padding: '5px'}}
                >
                    {table.entries.slice(0, 7).map((word, index) => (
                        <Grid
                            container
                            xs={12}
                            key={index}
                        >
                            <Grid item xs={2}>
                                <Typography variant={"subtitle1"} sx={{color: 'black'}}>
                                    {index + 1 + "."}
                                </Typography>
                            </Grid>
                            <Grid item xs={10} sx={{textAlign: 'left', width: 'fit-content'}}>
                                <Typography
                                    variant={"h6"}
                                    sx={{
                                        color: 'blue',
                                        width: 'fit-content',
                                        "&:hover": {
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => {
                                        handleWordClick(word.simplified)
                                    }}

                                >
                                    {word.simplified}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Grid container xs={6}
                      sx={{padding: '5px'}}
                >
                    {table.entries.slice(7, 14).map((word, index) => (
                        <Grid
                            container
                            xs={12}
                            key={index}
                        >
                            <Grid item xs={2}>
                                <Typography variant={"subtitle1"} sx={{color: 'black'}}>
                                    {index + 8 + "."}
                                </Typography>
                            </Grid>
                            <Grid item xs={10} sx={{textAlign: 'left', width: 'fit-content'}}>
                                <Typography
                                    variant={"h6"}
                                    sx={{
                                        color: 'blue',
                                        width: 'fit-content',
                                        "&:hover": {
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => {
                                        handleWordClick(word.simplified)
                                    }}
                                >
                                    {word.simplified}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TablePreview;
