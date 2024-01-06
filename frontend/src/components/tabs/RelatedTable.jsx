import React, {useEffect, useState} from "react";
import {Grid, Paper, Typography} from "@mui/material";
import pinyinify from "../../helpers/pinyin_converter";

const RelatedTable = ({query}) => {
    const [relatedEntries, setRelatedEntries] = useState(null)

    useEffect(() => {
        const relatedWordsEndpoint = `api/related?query=${query}`;
        fetch(relatedWordsEndpoint)
            .then((response) => response.json())
            .then((data) => {
                setRelatedEntries(data)
            })
            .catch((error) => {
                console.error('Error calling API:', error);
            }).finally(() => {
        });
    }, [])

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    marginTop: '8px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    maxHeight: '70vh', // Set a maximum height for the container
                    overflowY: 'auto', // Enable vertical scrolling when content exceeds the maximum height
                }}
            >
                <Grid item xs={12} sx={{textAlign: 'left'}}> {/* Float title to the left */}
                    <Typography variant="h5">Words with Same Leading Character</Typography>
                </Grid>
                {relatedEntries && relatedEntries.leadingEntryList.map((entry, index) => (
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
                            marginTop: '4px'
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
                                        {entry.simplified + ' ' + pinyinify(entry.pinyin)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        {entry.definitions.replaceAll('/', '; ')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
                {/* Add spacing between sections */}
                <Grid item xs={12} sx={{marginBottom: '16px'}}/>

                {/* Section 2: Words with similar trailing character */}
                <Grid item xs={12} sx={{textAlign: 'left'}}> {/* Float title to the left */}
                    <Typography variant="h5">Words with Same Trailing Character</Typography>
                </Grid>
                {relatedEntries && relatedEntries.trailingEntryList.map((entry, index) => (
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
                            marginTop: '4px'
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
                                        {entry.simplified + ' ' + pinyinify(entry.pinyin)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        {entry.definitions.replaceAll('/', '; ')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

        </>
    )
}

export default RelatedTable;