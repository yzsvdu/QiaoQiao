import React, {useState} from "react";
import {Paper, Typography} from "@mui/material";
import pinyinify from "../../helpers/pinyin_converter";

const ExampleSentence = ({pair, index, indexOfOccurrence, handleSubwordClick}) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const transitionDuration = 0.5;
    return (
        <Paper key={index} elevation={3} style={{
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#fdfdfd',
            animation: `slideIn ${transitionDuration}s ease-out`
        }}>
            <Typography variant="subtitle1" style={{textAlign: 'left', color: '#777', marginBottom: '8px'}}>
                {index + 1}. Chinese Sentence:
            </Typography>
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%'}}>
                {pair.chinese.map((segment, i) => {
                    const colors = ['#0066cc', 'darkorange'];
                    const textColor = i === indexOfOccurrence ? 'red' : colors[i % colors.length];

                    // Check if the segment contains Chinese or English punctuation
                    const isPunctuation = /[！“”‘’，。、《》]/.test(segment);

                    return (
                        <span
                            key={i}
                            style={{
                                textAlign: 'left',
                                marginBottom: '10px',
                                color: textColor,
                                cursor: isPunctuation ? 'default' : 'pointer',
                                transition: 'background-color 0.3s', // Add transition for a smooth effect
                                backgroundColor: i === hoveredIndex && !isPunctuation ? 'lightblue' : 'transparent',
                                whiteSpace: 'nowrap', // Prevent the spans from breaking to a new line
                            }}
                            onClick={isPunctuation ? null : () => handleSubwordClick(segment)}
                            onMouseEnter={(e) => !isPunctuation && setHoveredIndex(i)}
                            onMouseLeave={(e) => !isPunctuation && setHoveredIndex(null)}
                        >
                        {i > 0 && ' '}{segment}
                    </span>
                    );
                })}
            </div>

            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%'}}>
                {pair.pinyin.map((segment, i) => {
                    const colors = ['#0066cc', 'darkorange'];
                    const textColor = i === indexOfOccurrence ? 'red' : colors[i % colors.length];

                    return (
                        <Typography
                            key={i}
                            variant="body1"
                            style={{
                                whiteSpace: 'pre',
                                textAlign: 'left',
                                marginBottom: '0px',
                                color: textColor,
                                backgroundColor: i === hoveredIndex ? 'lightblue' : 'transparent',
                            }}
                        >
                            {pinyinify(segment) + " "}
                        </Typography>
                    );
                })}
            </div>
            <Typography variant="subtitle1" style={{textAlign: 'left', color: '#777', marginBottom: '8px', marginTop: '10px'}}>
                English Translation:
            </Typography>
            <Typography variant="body1" style={{textAlign: 'left'}}>
                {pair.english}
            </Typography>
        </Paper>
    )
}

export default ExampleSentence;