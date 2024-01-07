import React, {useEffect, useState} from "react";
import {Grid, Paper, Tab, Tabs} from "@mui/material";
import RelatedTable from "./tabs/RelatedTable";
import DecomposedTable from "./tabs/DecomposedTable";
import StrokeOrderTable from "./tabs/StrokeOrderTable";
import DefinitionExampleTable from "./tabs/DefinitionExampleTable";

const InformationTable = ({query_}) => {
    const [result, setResult] = useState(null);
    const [query, setQuery] = useState('你好');
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const handleQuerySearch = () => {
        setResult(null);

        const defineEndpoint = `${process.env.REACT_APP_SPRING}/api/define`;

        // Create payload object
        const payload = {
            query: query.trim(),
        };

        // Fetch using POST method
        fetch(defineEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.pinyin.length === 0) {
                    const pinyinEndpoint = `${process.env.REACT_APP_DJANGO}/services/dictionary/pinyin?query=${query}`;

                    fetch(pinyinEndpoint)
                        .then((response) => response.json())
                        .then((pinyinData) => {
                            const concatenatedPinyin = pinyinData.pinyin.map((p) => p[0]).join(' ');

                            // Set the new data with pinyin to the state
                            setResult({
                                ...data,
                                pinyin: concatenatedPinyin,
                            });
                        })
                        .catch((pinyinError) => {
                            console.error('Error calling Pinyin API:', pinyinError);
                        });
                } else {
                    setResult(data);
                }
            })
            .catch((error) => {
                console.error('Error calling API:', error);
            });
    };


    // initialize props
    useEffect(() => {
        setQuery(query_);
    }, [query_])

    useEffect(() => {
        handleQuerySearch();
    }, [query])

    return (
        <Grid container xs={6} direction="column" alignItems="center" justifyContent="center">
            <Paper
                elevation={3}
                style={{
                    padding: 16,
                    height: '80vh',
                    width: '90%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Tabs */}
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    centered
                    TabIndicatorProps={{style: {backgroundColor: 'orange'}}}

                >
                    <Tab style={{color: "black"}} label="Definition"/>
                    <Tab style={{color: "black"}} label="Word Decomposition"/>
                    <Tab style={{color: "black"}} label="Stroke Order"/>
                    <Tab style={{color: "black"}} label="Related Words"/>

                </Tabs>

                {/* Content based on selected tab */}
                {selectedTab === 0 && result &&
                    <DefinitionExampleTable result={result} query={query}></DefinitionExampleTable>}
                {selectedTab === 1 && result &&
                    <DecomposedTable decomposition={result.decomposition} result={result}></DecomposedTable>}
                {selectedTab === 2 && result && <StrokeOrderTable simplified={result.simplified}></StrokeOrderTable>}
                {selectedTab === 3 && <RelatedTable query={query}></RelatedTable>}
            </Paper>
        </Grid>
    )
}

export default InformationTable;
