import React, {useState} from 'react';
import {Autocomplete, Grid, Paper, TextField,} from '@mui/material';
import '../styles/Resize.css'
import TablePreviewDirectory from "../components/TablePreviewDirectory";
import InformationTable from "../components/InformationTable";
import NavigationBar from "../components/NavigationBar";

const HomePage = () => {
    const [query, setQuery] = useState('');
    const [finalQuery, setFinalQuery] = useState('你好')
    const [suggestions, setSuggestions] = useState([]);

    const handleWordClick = (word) => {
        setFinalQuery(word);
    }

    const handleQueryChange = async (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        if (newQuery.length === 0) {
            setSuggestions([]);
            return;
        }
        const suggestionsEndpoint = `/api/suggest?query=${newQuery}`
        const response = await fetch(suggestionsEndpoint, {credentials: 'include', headers: {'Content-Type': 'application/json'}});
        const data = await response.json();
        setSuggestions(data.suggestions);
    }

    return (
        <Grid container direction='column'>
            <NavigationBar></NavigationBar>
            <Grid container justifyContent="center">
                <Grid item xs={6} container alignItems="center" justifyContent="center">
                    <Paper
                        elevation={3}
                        style={{
                            padding: 16,
                            height: '80vh',
                            width: '80%',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '10px',
                            overflow: 'auto', // Add this line to enable vertical scrolling
                        }}
                    >
                        {/* Your search bar component goes here */}
                        <Grid container>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={suggestions}
                                    renderInput={(params) => (
                                        <TextField
                                            value={query}
                                            {...params}
                                            label="Search for Chinese Characters"
                                            variant="outlined"
                                            sx={{
                                                "& label.Mui-focused": {
                                                    color: "black"
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "orange"
                                                    }
                                                }
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    setFinalQuery(query);
                                                }
                                            }}
                                            onChange={(e) => handleQueryChange(e)}
                                        />
                                    )}
                                    onChange={(event, newValue) => {
                                        setQuery(newValue)
                                    }}
                                />
                            </Grid>
                            <Grid container xs={12}>
                                <TablePreviewDirectory handleWordClick={handleWordClick}></TablePreviewDirectory>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <InformationTable query_={finalQuery}></InformationTable>
            </Grid>
        </Grid>
    );

}
export default HomePage;
