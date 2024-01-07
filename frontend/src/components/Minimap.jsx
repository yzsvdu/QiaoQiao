import React from 'react';
import {List, ListItemText} from "@mui/material";

const Minimap = ({loadedSets, loadMoreEntries, scrollToWord, tableSize}) => (
    <div
        style={{
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 'flex',
            flexDirection: 'column',
            height: '25vh',
        }}
    >
        <List
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto', // Make the List scrollable
            }}
        >
            {Array(Math.max(Math.floor(tableSize / 500) + 1, 1)).fill(0).map((value, index) => (
                <span
                    key={index}
                    style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginLeft: '8px',
                        color: 'blue',
                    }}
                    onClick={async () => {
                        if (index === 0) {
                            scrollToWord(1);
                            return
                        }
                        let isLoaded = false;
                        let isPrevSetLoaded = false;
                        let isBetween = false;
                        let betweenIndex = null;

                        for (let i = 0; i < loadedSets.length; i++) {
                            const set = loadedSets[i];
                            if (index * 500 >= set.setStart && index * 500 <= set.setEnd) {
                                isLoaded = true
                                break
                            }
                            if (index * 500 - 500 >= set.setStart && index * 500 - 500 <= set.setEnd) {
                                isPrevSetLoaded = true;
                            }
                        }

                        if (!isLoaded) {
                            for (let i = 0; i < loadedSets.length; i++) {
                                const set = loadedSets[i];
                                if (index * 500 <= set.setStart) {
                                    isBetween = true;
                                    betweenIndex = i;
                                    break;
                                }
                            }
                        }


                        if (isLoaded) {
                            scrollToWord((index) * 500);
                        } else {
                            if (!isBetween) {
                                if (!isPrevSetLoaded) {
                                    await loadMoreEntries(index * 500 - 501, index * 500 - 1);
                                }
                                await loadMoreEntries(index * 500 - 1, index * 500 + 500 - 1, null, index * 500);

                            } else {
                                await loadMoreEntries(index * 500 - 1, index * 500 + 500 - 1, betweenIndex, index * 500);
                            }
                        }
                    }}
                >
                    <ListItemText primary={`${index * 500}`}/>
                </span>
            ))}
        </List>
    </div>
);

export default Minimap;
