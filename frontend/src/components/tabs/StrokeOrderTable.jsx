import React, {useEffect, useRef} from "react";
import HanziWriter from "hanzi-writer";

const StrokeOrderTable = ({simplified}) => {
    const characterContainerRef = useRef(null);

    useEffect(() => {
        const handleClick = (hanziWriter) => {
            // Start the animation using HanziWriter API
            hanziWriter.animateCharacter();
        };

        if (simplified) {
            const container = characterContainerRef.current;
            if (container) {
                // Clear existing content when the component mounts
                container.innerHTML = '';

                simplified.split('').forEach((char, index) => {
                    const containerId = `character-target-${index}`;
                    const containerDiv = document.createElement('div');
                    containerDiv.id = containerId;
                    containerDiv.addEventListener('click', () => handleClick(hanzi)); // Pass hanziWriter instance to handleClick
                    container.appendChild(containerDiv);

                    const hanzi = HanziWriter.create(containerId, char, {
                        width: 100,
                        height: 100,
                        padding: 5,
                        radicalColor: '#ff0000',
                        strokeColor: '#000',
                        outlineColor: '#bcbcbc',
                        showOutline: true,
                        showCharacter: false,
                        strokeAnimationSpeed: 2,
                        delayBetweenStrokes: 500,
                    });
                });
            }
        }
    }, [simplified]);

    return (
        <div ref={characterContainerRef} style={{display: 'flex', flexWrap: 'wrap'}}></div>
    );
};

export default StrokeOrderTable;