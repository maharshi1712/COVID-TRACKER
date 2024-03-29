import React from 'react';
import { Card, Typography, CardContent } from '@material-ui/core';
import './InfoBox.css';

function Infobox({title, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick} className="infoBox">
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className="infoBox__cases"> {cases} </h2>
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox;
