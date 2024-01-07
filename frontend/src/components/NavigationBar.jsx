import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {Grid, IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Feed, Login, Search, Settings} from "@mui/icons-material";
import {UserAuth} from "../service/AuthorizationContext";
import ConfigurationWindow from "./ConfigurationWindow";

const NavigationBar = () => {

    const {googleSignIn, user} = UserAuth();
    const {logOut} = UserAuth();
    const location = useLocation();
    const showReturnHome = location.pathname !== '/home';

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSettingsClick = () => {
        setIsSettingsOpen(true);
    };

    const handleCloseSettings = () => {
        setIsSettingsOpen(false);
    };

    return (
        <Grid
            container
            style={{padding: '4px'}}
            direction="row"
        >
            {/*Left Side of navigation bar*/}
            <Grid container xs={6}>
                {showReturnHome ? (
                    <Link to='/'>
                        <IconButton edge="start" color="inherit" aria-label="back">
                            <ArrowBackIcon sx={{color: 'blue'}}/>
                            <Typography style={{color: 'blue', textDecoration: 'underline'}} variant="body1">Return /home</Typography>
                        </IconButton>
                    </Link>
                ):(
                    <Link to='/'>
                        <IconButton color="inherit" aria-label="back">
                            <Search sx={{color: 'blue'}}/>
                            <Typography style={{color: 'blue'}} variant="body1">Qiao一Qiao App</Typography>
                        </IconButton>
                    </Link>
                )}
            </Grid>

            {/*Right side of navigation bar*/}
            <Grid container xs={6} direction={"row-reverse"}>
                <IconButton>
                    <Typography style={{color: 'darkorange', textDecoration: 'underline'}}
                                variant="body1">Sources</Typography>
                    <Feed sx={{color: 'darkorange'}}></Feed>
                </IconButton>
                <IconButton disabled onClick={handleSettingsClick}>
                    <Typography style={{color: 'darkorange', textDecoration: 'underline'}}
                                variant="body1">Configuration</Typography>
                    <Settings sx={{color: 'darkorange'}}></Settings>
                    <ConfigurationWindow isOpen={isSettingsOpen} onClose={handleCloseSettings}/>
                </IconButton>
                {user === null ? (
                        <IconButton onClick={handleGoogleSignIn}>
                            <Typography style={{color: 'darkorange', textDecoration: 'underline'}} variant="body1">Sign
                                In</Typography>
                            <Login sx={{color: 'darkorange'}}></Login>
                        </IconButton>)
                    : (
                        <IconButton onClick={handleSignOut}>
                            <Typography style={{color: 'darkorange', textDecoration: 'underline'}} variant="body1">Sign
                                Out</Typography>
                            <Login style={{color: 'darkorange'}}/>
                        </IconButton>
                    )}
            </Grid>
        </Grid>
    )
}

export default NavigationBar;