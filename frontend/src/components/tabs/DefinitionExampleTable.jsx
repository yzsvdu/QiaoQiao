import React, {useEffect, useState} from "react";
import {Button, IconButton, Paper, Typography} from "@mui/material";
import pinyinify from "../../helpers/pinyin_converter";
import ExampleSentence from "./ExampleSentence";
import {Clear} from "@mui/icons-material";

const DefinitionExampleTable = ({result, query}) => {
    const [loading, setLoading] = useState(false);
    const [pinyin, setPinyin] = useState(result.pinyin)
    const [sentencePairs, setSentencePairs] = useState([])
    const [subSearchs, setSubSearches] = useState([result])

    useEffect(() => {
        setLoading(true);
        const examplesEndpoint = `/services/dictionary/examples?query=${query}`;
        fetch(examplesEndpoint).then((response) => response.json()).then((data) => {
            setSentencePairs(data.sentence_pairs)
        }).finally(() => {
            setLoading(false);
        })

        if (pinyin.length === 0) {
            const pinyinEndpoint = `/services/dictionary/pinyin?query=${query}`;
            fetch(pinyinEndpoint).then((response) => response.json()).then((data) => {
                const concatenatedPinyin = data.pinyin.map((p) => p[0]).join(' ');
                setPinyin(concatenatedPinyin);
            })
        }
    }, [query])

    const handleSubwordClick = (subword) => {
        const defineEndpoint = `api/define?query=${subword}`;
        fetch(defineEndpoint)
            .then((response) => response.json())
            .then((data) => {
                setSubSearches((prev) => [...prev, data]);
            })
            .catch((error) => {
                console.error('Error calling API:', error);
            });
    }

    const handleSubsearchClick = (index) => {
        const updatedSubSearchs = [
            ...subSearchs.slice(0, index),
            ...subSearchs.slice(index + 1),
            subSearchs[index],
        ];
        setSubSearches(updatedSubSearchs);
    }

    const handleRemoveClick = (index) => {
        setHoveredIndex(null);
        const updatedSubSearchs = [
            ...subSearchs.slice(0, index)
        ];
        setSubSearches(updatedSubSearchs);
    }

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const transitionDuration = 0.5;


    return (
        <>
            <div style={{position: 'relative', minHeight: "240px"}}>
                {subSearchs.map((search, index) => (
                    <Paper
                        key={index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: `${(index) * 20}px`,
                            right: 0,
                            padding: '5px',
                            backgroundColor: index === hoveredIndex ? 'lightgray' : "floralwhite", // Apply darker background if hovered and not the last index
                            borderRadius: '15px',
                            paddingBottom: '40px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            height: '180px',
                            overflowY: "auto",
                            zIndex: subSearchs.length,
                            transition: `background-color ${transitionDuration}s ease`, // Add transition for background-color
                            animation: `slideIn ${transitionDuration}s ease-out`
                        }}
                        onMouseEnter={() => setHoveredIndex(index)} // Set the hovered index on mouse enter
                        onMouseLeave={() => setHoveredIndex(null)} // Reset the hovered index on mouse leave
                        onClick={() => {
                            handleSubsearchClick(index);
                        }}
                    >
                        <div
                            style={{
                            position: 'relative',
                        }}>
                            <IconButton
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: subSearchs.length - index + 1, // Set higher zIndex to overlap with Paper
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveClick(index);
                                }}
                            >
                                <Clear style={{color: 'black'}}/>
                            </IconButton>
                            <Typography variant="h6"
                                        style={{marginTop: '20px', marginBottom: '12px', color: '#0066cc'}}>
                                <span style={{color: '#333'}}>Traditional:</span> {search.traditional}
                            </Typography>
                            <Typography variant="h6" style={{marginBottom: '12px', color: '#0066cc'}}>
                                <span style={{color: '#333'}}>Simplified:</span> {search.simplified}
                            </Typography>
                            <Typography variant="h6" style={{marginBottom: '12px', color: '#0066cc'}}>
                                <span
                                    style={{color: '#333'}}>Pinyin:</span> {pinyinify(search.pinyin.replaceAll('[', '').replaceAll(']', ''))}
                            </Typography>
                            <Typography variant="h6" style={{marginBottom: '12px', color: '#0066cc'}}>
                                <span
                                    style={{color: '#333'}}>Definitions:</span> {search.definitions.replaceAll('/', '; ')}
                            </Typography>
                        </div>
                    </Paper>
                ))}
            </div>


            {loading && (<div>Looking for examples...</div>)}

            <Paper style={{
                overflowY: 'auto',
                maxHeight: '60vh',
                padding: "20px",
                backgroundColor: 'lightgoldenrodyellow'
            }}>
                {sentencePairs.length > 0 ? (
                    sentencePairs.map((pair, index) => {
                        const indexOfOccurrence = pair.chinese.indexOf(result.simplified);
                        return (
                            <ExampleSentence pair={pair} index={index} indexOfOccurrence={indexOfOccurrence}
                                             handleSubwordClick={handleSubwordClick}></ExampleSentence>
                        )
                    })
                ) : (
                    <Typography variant="body1" style={{textAlign: 'center', marginTop: '20px', color: '#777'}}>
                        <Button variant="contained" color="primary">
                            No examples found.
                            Search Again
                        </Button>
                    </Typography>

                )}
            </Paper>

        </>
    )
}

export default DefinitionExampleTable;