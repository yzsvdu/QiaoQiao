import React, {useEffect, useRef, useState} from 'react';
import {VariableSizeList} from "react-window";
import {Checkbox, Grid, IconButton, Paper, Typography} from "@mui/material";

import pinyinify from "../helpers/pinyin_converter";
import {Search} from "@mui/icons-material";
import InformationTable from "../components/InformationTable";
import {UserAuth} from "../service/AuthorizationContext";
import NavigationBar from "../components/NavigationBar";
import Minimap from "../components/Minimap";
import AutoSizer from "react-virtualized-auto-sizer";
import {getLearnedWords, updateLearnedWords} from "../service/AccessDatabase";


const TableViewPage = ({endpoint}) => {
    const [title, setTitle] = useState('');
    const [tableUID, setTableUID] = useState(null)
    const [entryList, setEntryList] = useState([]);

    const [query, setQuery] = useState('你好');
    const jumpRefs = useRef([]);
    const [loadedSets, setLoadedSets] = useState([]);
    const tableHeader = useRef(null);
    const {user} = UserAuth();
    const listRef = useRef(null);
    const [scrollToIndex, setScrollToIndex] = useState(0);
    const [learnedWords, setLearnedWords] = useState(null);
    const [filteredList, setFilteredList] = useState([]);
    const [tbSizeParam, setTbSizeParam] = useState(2);

    const [tableConfig, setTableConfig] = useState({
        hideLearned: false,
        singleChar: false,
        pinyin: true,
        definition: true,
    });

    const updateTableConfig = (configKey) => {
        setTableConfig((prevConfig) => ({
            ...prevConfig,
            [configKey]: !prevConfig[configKey], // Toggle the value
        }));
    };

    const loadMoreEntries = async (setStart, setEnd, betweenIndex = null, jumpToIndex = null) => {
        const fetchAddress = `${endpoint}?startIndex=${setStart}&endIndex=${setEnd}`;
        const response = await fetch(fetchAddress);
        const data = await response.json();
        setTitle(data.name);
        setTableUID(data.uid)
        if (jumpToIndex) {
            setScrollToIndex(jumpToIndex);
        }

        if (betweenIndex == null) {
            setEntryList((prevWords) => [...prevWords, ...data.entries]);
            setLoadedSets((prevSets) => [...prevSets, {setStart, setEnd}]);
        } else {
            let leftSet = entryList.slice(0, betweenIndex * 500 - 1);
            let rightSet = entryList.slice(betweenIndex * 500 - 1);
            let updatedWords = [...leftSet, ...data.entries, ...rightSet];
            setEntryList(updatedWords);
            setLoadedSets((prevSets) => {
                const updatedSets = [...prevSets, {setStart, setEnd}];
                updatedSets.sort((a, b) => a.setStart - b.setStart);
                return updatedSets;
            });
        }
    };

    const loadLearnedWords = async (id, tableUID) => {
        try {
            if (id && tableUID) {
                await getLearnedWords(id, tableUID).then((data) => {
                    setLearnedWords(data);
                });
            }
        } catch (error) {
            console.error('Error loading learned words:', error);
        }
    };

    const scrollToWord = (targetIndex) => {
        const index = entryList.findIndex((word) => word.id === targetIndex);

        if (index !== -1) {
            listRef.current.scrollToItem(index, 'start');
        }
    };

    useEffect(() => {
        scrollToWord(scrollToIndex);
    }, [entryList])

    useEffect(() => {
        const visibleElementCount = 4 + ((tableConfig.pinyin ? 1 : 0)) + ((tableConfig.definition ? 1 : 0));
        const newTbSizeParam = 12 / visibleElementCount;
        setTbSizeParam(newTbSizeParam);
    }, [tableConfig]);


    useEffect(() => {
        if (user && user.uid !== null && tableUID !== null) {
            loadLearnedWords(user.uid, tableUID);
        }
    }, [user, tableUID])

    useEffect(() => {
        loadMoreEntries(0, 499);
    }, [])

    useEffect(() => {
        // Check if user is defined before updating learned words
        if (user && learnedWords) {
            updateLearnedWords(user.uid, tableUID, learnedWords);
        }
    }, [learnedWords]);

    useEffect(() => {
        // Filter out learned words from entryList
        if (tableConfig.hideLearned && learnedWords) {
            const filteredList = entryList.filter(entry => !learnedWords.includes(entry.id));
            setFilteredList(filteredList);
        } else {
            setFilteredList(entryList);
        }

    }, [tableConfig.hideLearned, entryList, learnedWords]);

    const handleCheckboxChange = async (word, index, isChecked) => {
        if (
            !selectionState.selecting &&
            index >= Math.min(selectionState.start, selectionState.end) &&
            index <= Math.max(selectionState.start, selectionState.end)
        ) {
            const rangeStart = Math.min(selectionState.start, selectionState.end);
            const rangeEnd = Math.max(selectionState.start, selectionState.end);
            let highlightedWordIds = [];
            for (let i = rangeStart; i <= rangeEnd; i++) {
                const wordInHighlightedRange = filteredList[i];
                highlightedWordIds.push(wordInHighlightedRange.id);
            }

            setLearnedWords((prevLearned) => {
                const uniquePrevLearned = new Set(prevLearned);
                const uniqueHighlightedWordIds = new Set(highlightedWordIds);

                if (isChecked) {
                    // Add the highlighted word IDs to the learnedWords array
                    return [...uniquePrevLearned, ...uniqueHighlightedWordIds];
                } else {
                    // Remove the highlighted word IDs from the learnedWords array
                    const difference = new Set([...uniquePrevLearned].filter((x) => !uniqueHighlightedWordIds.has(x)));
                    return Array.from(difference);
                }
            })
        } else {
            const wordId = word.id;
            setLearnedWords((prevLearned) => {
                if (isChecked) {
                    return [...prevLearned, wordId];
                } else {
                    return prevLearned.filter((w) => w !== wordId);
                }
            });
        }

    };


    const [selectionState, setSelectionState] = useState({
        selecting: false,
        start: null,
        end: null,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                !selectionState.selecting &&
                selectionState.start !== null &&
                selectionState.start === selectionState.end &&
                event.key === 'Shift'
            ) {
                // Add your logic here for keydown event when conditions are met
                selectionState.holdingShift = true;

            }
        };

        const handleKeyUp = () => {
            selectionState.holdingShift = false;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [selectionState]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const rowsDiv = document.getElementById('rows');
            if (rowsDiv && !rowsDiv.contains(event.target)) {
                setHighlightedRows([]);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const [highlightedRows, setHighlightedRows] = useState([]);

    const handleMouseMove = (index, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (selectionState.selecting) {
            const newEnd = index;
            setSelectionState((prevState) => ({
                ...prevState,
                end: newEnd,
            }));

            const newHighlightedRows = Array.from(
                {length: Math.abs(newEnd - selectionState.start) + 1},
                (_, i) => Math.min(newEnd, selectionState.start) + i
            );
            setHighlightedRows(newHighlightedRows);
        }
    };

    const handleMouseDown = (index, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (selectionState.holdingShift) {
            setSelectionState((prevState) =>
                ({
                    ...prevState,
                    end: index
                })
            )
            const newHighlightedRows = Array.from(
                {length: Math.abs(index - selectionState.start) + 1},
                (_, i) => Math.min(index, selectionState.start) + i
            );
            setHighlightedRows(newHighlightedRows);
        } else {
            setSelectionState({
                selecting: true,
                start: index,
                end: index,
            });
            setHighlightedRows([index]);
        }
    };

    const handleMouseUp = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectionState((prevState) => ({
            ...prevState,
            selecting: false,
            end: index,
        }));
    };

    const Row = ({index, style}) => {
        const word = filteredList[index];
        const [hoverIndex, setHoverIndex] = useState(null);
        const shouldBeHighlighted = highlightedRows.includes(index) && hoverIndex !== index
        const shouldBeHoverColor = hoverIndex === index;

        let backgroundColor;
        if (shouldBeHoverColor) {
            backgroundColor = 'skyblue';
        } else {
            backgroundColor = shouldBeHighlighted ? 'lightgray' : 'transparent';
        }

        const rowStyles = {
            borderBottom: '1px solid #ccc',
            alignItems: 'center',
            display: 'flex',
            backgroundColor: backgroundColor,
            ...style,
        };


        return (
            <div
                style={rowStyles}
                onMouseOver={() => {
                    setHoverIndex(index)
                }}
                onMouseLeave={() => {
                    setHoverIndex(null)
                }}
                onMouseUp={(event) => handleMouseUp(index, event)}
                onMouseDown={(event) => handleMouseDown(index, event)}
                onMouseMove={(event) => handleMouseMove(index, event)}
            >
                <Grid container
                      sx={{alignItems: 'center'}}
                >
                    <Grid item xs={tbSizeParam}>
                        <Checkbox
                            disabled={user === null}
                            onChange={(event) => {
                                handleCheckboxChange(word, index, event.target.checked);
                            }}
                            checked={learnedWords && learnedWords.includes(word.id)}
                            onMouseDown={(event) => event.stopPropagation()}
                            onMouseUp={(event) => event.stopPropagation()}
                        />
                    </Grid>
                    <Grid item xs={tbSizeParam}>
                        <Typography variant="subtitle1">{word.id}</Typography>
                    </Grid>
                    <Grid item xs={tbSizeParam}>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6">{word.simplified}</Typography>
                            <Typography
                                variant="h6">{word.simplified !== word.traditional ? `[${word.traditional}]` : ''}</Typography>
                        </div>
                    </Grid>
                    {tableConfig.pinyin ? (
                        <Grid item xs={tbSizeParam}>
                            <Typography variant="subtitle2" style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {pinyinify(word.pinyin)}
                            </Typography>
                        </Grid>
                    ) : null}

                    {tableConfig.definition ? (
                        <Grid item xs={tbSizeParam} style={{whiteSpace: 'nowrap'}}>
                            <Typography variant="body1" style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {word.definitions.replaceAll('"', "")}
                            </Typography>
                        </Grid>
                    ) : null}
                    <Grid item xs={tbSizeParam}>
                        <IconButton
                            onClick={() => {
                                setQuery(word.simplified)
                            }}
                            onMouseDown={(event) => event.stopPropagation()}
                            onMouseUp={(event) => event.stopPropagation()}
                        >
                            <Search style={{pointerEvents: 'none', color: 'blue'}}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        );
    };

    return (
        <Grid container direction='column'>
            <NavigationBar></NavigationBar>
            <Grid container justifyContent="center">
                <Grid container xs={6} direction="row">
                    <Grid container xs={0.6}></Grid>
                    <Grid container xs={10.4}>
                        <Paper elevation={3} style={{
                            padding: 16,
                            height: '85vh',
                            overflowY: 'auto',
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '10px'
                        }}>
                            <div style={{display: "flex", flexDirection: 'column', height: '100%'}}>
                                <Grid item alignItems="center" marginBottom={2}
                                      sx={{borderBottom: '1px solid black', padding: '10px 0px 10px 0px'}}>
                                    <Typography variant="h5">{title}</Typography>
                                </Grid>
                                <Grid container direction="row">
                                    {/* Checkboxes */}
                                    {['hideLearned', 'singleChar', 'pinyin', 'definition'].map((configKey, index) => (
                                        <Grid key={index} container xs={3} style={{alignItems: 'center'}}>
                                            <Checkbox
                                                checked={tableConfig[configKey]}
                                                onChange={() => updateTableConfig(configKey)}
                                            />
                                            <Typography variant="subtitle1">
                                                {configKey === 'hideLearned' ? 'Hide Learned' :
                                                    configKey === 'singleChar' ? 'Single Char' :
                                                        configKey === 'pinyin' ? 'Show Pinyin' :
                                                            'Show Def.'}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Header */}
                                <Grid container style={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 8,
                                    marginBottom: 16,
                                    padding: 8
                                }}>
                                    {['Mark Learned', 'Index', 'Character', 'Pinyin', 'Definition', 'Analyze'].map((header, index) => {
                                        if ((header === 'Definition' && !tableConfig.definition) || (header === 'Pinyin' && !tableConfig.pinyin)) return null

                                        return (
                                            <Grid key={index} item xs={tbSizeParam}>
                                                <Typography variant="subtitle1">{header}</Typography>
                                            </Grid>
                                        )
                                    })}
                                </Grid>

                                {/* List of words */}
                                <div id="rows" style={{flexGrow: 1}}>
                                    <AutoSizer>
                                        {({height, width}) => (
                                            <VariableSizeList
                                                ref={listRef}
                                                itemCount={filteredList.length}
                                                itemSize={(index) => 65}
                                                height={height}
                                                width={width}
                                            >
                                                {({index, style}) => {
                                                    return <Row index={index} style={style}/>;
                                                }}
                                            </VariableSizeList>
                                        )}
                                    </AutoSizer>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={1}>
                        <Minimap
                            tableHeader={tableHeader}
                            loadedSets={loadedSets}
                            loadMoreEntries={loadMoreEntries}
                            jumpRefs={jumpRefs}
                            scrollToWord={scrollToWord}>
                        </Minimap>
                    </Grid>
                </Grid>
                <InformationTable query_={query}></InformationTable>
            </Grid>
        </Grid>
    );
};

export default TableViewPage;
