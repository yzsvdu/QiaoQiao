import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    ToggleButton,
    ToggleButtonGroup,
    Checkbox, FormControlLabel, Grid,
} from "@mui/material";

const ConfigurationWindow = ({ isOpen, onClose }) => {
    const [animations, setAnimations] = useState(true);
    const [strokeOrderSpeed, setStrokeOrderSpeed] = useState("normal");

    const handleSave = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleCheckboxChange = () => {
        setAnimations((prevAnimations) => !prevAnimations);
    };

    const handleSpeedChange = (event, newSpeed) => {
        if (newSpeed !== null) {
            setStrokeOrderSpeed(newSpeed);
        }
    };

    const getSpeedOptions = () => {
        switch (strokeOrderSpeed) {
            case "slow":
                return {
                    strokeAnimationSpeed: 1,
                    delayBetweenStrokes: 750,
                };
            case "fast":
                return {
                    strokeAnimationSpeed: 3,
                    delayBetweenStrokes: 250,
                };
            default:
                return {
                    strokeAnimationSpeed: 2,
                    delayBetweenStrokes: 500,
                };
        }
    };

    const speedOptions = getSpeedOptions();

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Settings and Configurations</DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Stroke Order Speed</FormLabel>
                            <ToggleButtonGroup
                                value={strokeOrderSpeed}
                                exclusive
                                onChange={handleSpeedChange}
                                size="small"
                            >
                                <ToggleButton value="slow" style={{ color: strokeOrderSpeed === 'slow' ? 'white' : 'black', background: strokeOrderSpeed === 'slow' ? 'lightblue' : 'transparent' }}>Slow</ToggleButton>
                                <ToggleButton value="normal" style={{ color: strokeOrderSpeed === 'normal' ? 'white' : 'black', background: strokeOrderSpeed === 'normal' ? 'lightgreen' : 'transparent' }}>Normal</ToggleButton>
                                <ToggleButton value="fast" style={{ color: strokeOrderSpeed === 'fast' ? 'white' : 'black', background: strokeOrderSpeed === 'fast' ? 'lightcoral' : 'transparent' }}>Fast</ToggleButton>
                            </ToggleButtonGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{marginTop: '20px'}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={animations}
                                    onChange={handleCheckboxChange}
                                    color="primary"
                                />
                            }
                            label="Show Site Animations and Effects"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={(e) => {
                        handleSave(e);
                    }}
                    variant="outlined"
                    color="secondary"
                >
                    Save & Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfigurationWindow;
