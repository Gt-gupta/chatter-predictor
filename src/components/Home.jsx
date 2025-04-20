import React, { useState } from "react";

import './home.css';
import Loader from "./Loader";
import Doc from "./Doc/Doc";
import DocItem from "./DocItem/DocItem";
import Depthbutton from "./depth/Depthbutton";
import Check from "./Check/Check";
import SpinWheel from "./wheel/Wheel";

function Home() {
    const [feed, setFeed] = useState(0.0);
    const [depth, setDepth] = useState(0.0);
    const [rpm, setRpm] = useState(0.0);
    const [loading, setLoading] = useState(true);
    const [chatter, setChatter] = useState(-1);
    const [error, setError] = useState("");
    const updateFeed = (value) => {
        setFeed(value);
    }
    const updateDepth = (value) => {
        setDepth(value);
    }
    const updateRpm = (value) => {
        setRpm(value);
    }

    const handlePredict = async () => {
        // Validate inputs
        if (rpm <= 0 || depth <= 0 || feed <= 0) {
            console.log('All values must be greater than 0')
            setError('All values must be greater than 0');
            return;
        }

        setLoading(true);
        setError(null);
        console.log(`${feed} , ${depth} , ${rpm}`)

        try {
            console.log("before call")
            const response = await fetch('http://localhost:5001/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rpm: rpm,
                    doc: depth,  // Assuming 'doc' is depth of cut
                    feed: feed
                })
            });

            if (!response.ok) {
                throw new Error('Prediction failed');
            }

            const data = await response.json();

            setChatter(data.prediction);

        } catch (err) {
            setError(err.message);
            console.log("call aborted")
        } finally {
            setLoading(false);
        }
    };

    const items = [0.04, 0.05, 0.06, 0.07, 0.08, 0.10, 0.12, 0.14, 0.16, 0.20, 0.24, 0.28, 0.32, 0.58, 1.04, 1.28, 1.52, 2.24];
    return (
        <div className="body">
            <div className="home">
                <div className="left">
                    <h1 style={{ fontSize: "50px" }}>Chatter Predictor</h1>
                    <div className="content">
                        <Doc buttonText={feed === 0 ? "Select Feed rate" : `${feed}`} content={<>
                            {items.map((item) => (<DocItem key={item} onClick={updateFeed}>{`${item}`}</DocItem>))}</>} />
                    </div>


                    <Depthbutton onClick={updateDepth} />

                    <div className="wheel">
                        <SpinWheel onClick={updateRpm} />
                    </div>

                    <Check onClick={handlePredict} />



                </div>
                <div className="right">
                    <h1 style={{ fontSize: "50px" }}>Result</h1>

                    {loading ? <Loader /> :
                        <div style={{marginTop:'50%'}}>
                            <h1>Prediction : {chatter===1 ? "Chatter" : "No Chatter"}</h1>
                        </div>
                        }

                </div>

                <script src="script.js">
                </script>
            </div>
            <div className="bottom">
                <h3 style={{ fontSize: "22px" }}>Made by Gaytri Gupta, A.V.S.N Sriya and Garima Sanjeev.</h3>
            </div>

        </div>

    );
}

export default Home;