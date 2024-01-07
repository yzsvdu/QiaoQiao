import React, {useEffect, useState} from "react";
import {Grid, Paper, Typography} from "@mui/material";
import pinyinify from "../../helpers/pinyin_converter";

const DecomposedTable = ({decomposition, result}) => {
    const [segmentedCharacters, setSegmentedCharacters] = useState([]);
    const [segmentedPinyin, setSegmentedPinyin] = useState([]);
    useEffect(() => {
        const segmentationEndpoint = `${process.env.REACT_APP_DJANGO}/services/dictionary/segment/?query=${result.simplified}`
        fetch(segmentationEndpoint).then((res) => res.json()).then((data) => {
            setSegmentedCharacters(data.chinese_segments);
            setSegmentedPinyin(data.pinyin_segments);
        })
    }, [result])

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    marginTop: '8px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    maxHeight: '100%', // Set a maximum height for the container
                    overflowY: 'auto'
                }}
            >
                <Grid container xs={12} sx={{
                    marginBottom: '8px',
                }}>
                    <Paper
                        elevation={2}
                        sx={{
                            padding: '8px',
                            borderRadius: '4px',
                            width: '100%',
                            display: 'grid',
                            backgroundColor: 'floralwhite',
                            gridTemplateColumns: `repeat(${segmentedCharacters.length}, min-content)`,
                            gridTemplateRows: 'repeat(2, 1fr)',
                            gap: '8px',
                            overflowX: 'auto'
                        }}
                    >
                        {segmentedCharacters.map((segment, index) => (
                            <div key={index} style={{ gridRow: 1, gridColumn: index + 1, backgroundColor: index % 2 === 0 ? 'lightgreen' : 'lightblue', padding: '8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                <span> {pinyinify(segment)} </span>
                            </div>
                        ))}

                        {segmentedPinyin.map((segment, index) => (
                            <div key={index} style={{ gridRow: 2, gridColumn: index + 1, backgroundColor: index % 2 === 0 ? 'lightgreen' : 'lightblue', padding: '8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                <span> {pinyinify(segment)} </span>
                            </div>
                        ))}
                    </Paper>
                </Grid>
                {decomposition && decomposition.map((decomposedWord, index) => (
                    <Grid
                        container
                        item
                        xs={12}
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
                {decomposition.length === 0 && (
                    <Grid
                        container
                        item
                        xs={12}
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
                                backgroundColor: '#f0f0f0'
                            }}
                        >
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">
                                        {result.simplified + ' ' + pinyinify(result.pinyin)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        {result.definitions.replaceAll('/', '; ')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </>
    );
}

export default DecomposedTable;
