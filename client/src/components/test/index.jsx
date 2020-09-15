import React from "react";
import { CircularProgress, Fab } from "@material-ui/core";

class TestMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            maskVolume: this.props.volume,
            sourceVolume: this.props.volume,
            questions: [],
            index: 0,
            dbs: [0],
            amount: 5,
            time: 0,
            timer: [],
        }
    }

    componentDidMount = async () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 1; j < 9; j++) {
                const audio1 = new Audio(process.env.PUBLIC_URL + "/loss-audios/0" + i + j + ".wav");
                const audio2 = new Audio(process.env.PUBLIC_URL + "/mask-audios/0" + i + j + ".wav");
                audio1.volume = 0;
                audio2.volume = 0;
                await audio1.play();
                await audio2.play();
                audio1.pause();
                audio2.pause();
            }
        }
        const questions = []
        for (let i = 0; i < this.state.amount; i++) {
            const color = Math.floor(Math.random() * 4).toString();
            const number = Math.ceil(Math.random() * 8).toString();
            questions.push("0" + color + number);
        }
        this.setState({ loading: false, questions }, () => console.log(this.state));
        this.playAudio();
    }

    startTimer = () => {
        this.timer = setInterval(
            () =>
                this.setState({
                    time: this.state.time + 0.01,
                }),
            10
        );
        console.log("start");
    };
    stopTimer = () => {
        clearInterval(this.timer);
        console.log("stop");
    };
    resetTimer = () => {
        this.setState({ time: 0 });
        console.log("reset");
    };

    playAudio = async () => {
        const { questions, index, maskVolume, sourceVolume } = this.state;
        const sourceAudio = new Audio(process.env.PUBLIC_URL + "/loss-audios/" + questions[index] + ".wav");
        const maskAudio = new Audio(process.env.PUBLIC_URL + "/mask-audios/" + questions[index] + ".wav");
        sourceAudio.volume = sourceVolume;
        maskAudio.volume = maskVolume;
        await sourceAudio.play();
        await maskAudio.play();
        this.startTimer();
    }

    handleClick = async (num) => {
        const { questions, index, timer } = this.state;
        this.stopTimer();
        timer.push(Number(this.state.time).toFixed(2));
        this.resetTimer();
        this.setState({ timer });
        const correct = questions[index] === num;
        if (correct) {
            var sourceVolume = this.goHarder();
        } else {
            var sourceVolume = this.goEasier();
        }
        console.log(this.state);
        await this.setState({ index: index + 1, sourceVolume });
        if (this.state.index >= this.state.amount) {
            console.log("it goes finish")
            const { dbs } = this.state;
            const sum = dbs.reduce((pre, num) => pre + num, 0);
            const SNR = Number(sum / 5).toFixed(2);
            console.log("SNR is " + SNR);
            this.props.handleClick(SNR, timer);
        } else {
            console.log("it goes continue")
            setTimeout(() => {
                this.playAudio();
            }, 2000)
        }
    }

    goEasier = () => {
        const { sourceVolume, index, dbs } = this.state;
        // if (index <= 4) {
        //     dbs.push(dbs[index] + 4);
        //     this.setState({ dbs });
        //     if (sourceVolume * 10 ** (4 / 20) > 1) {
        //         return 1;
        //     } else {
        //         return sourceVolume * 10 ** (4 / 20);
        //     }
        // } else {
        dbs.push(dbs[index] + 3);
        this.setState({ dbs });
        if (sourceVolume * 10 ** (2 / 20) > 1) {
            return 1;
        } else {
            return sourceVolume * 10 ** (3 / 20);
        }
        // }
    };

    goHarder = () => {
        const { sourceVolume, index, dbs } = this.state;
        // if (index <= 4) {
        //     dbs.push(dbs[index] - 4);
        //     this.setState({ dbs });
        //     return sourceVolume * 10 ** (-4 / 20);
        // } else {
        dbs.push(dbs[index] - 1);
        this.setState({ dbs });
        return sourceVolume * 10 ** (-1 / 20);
        // }
    };

    render() {
        const { loading, index, amount } = this.state;
        return (
            loading
                ?
                <div>
                    <CircularProgress />
                    <h2>Loading data ...</h2>
                </div>
                :
                index < amount ?
                    <div style={{ backgroundColor: "grey", position: "fixed", height: "100%", width: "100%" }}>
                        <div className="row" style={{ height: "25%" }}>
                            <button value="001" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>1</button>
                            <button value="002" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>2</button>
                            <button value="003" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>3</button>
                            <button value="004" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>4</button>
                            <button value="005" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>5</button>
                            <button value="006" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>6</button>
                            <button value="007" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>7</button>
                            <button value="008" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "red", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>8</button>
                        </div>
                        <div className="row" style={{ height: "25%" }}>
                            <button value="011" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>1</button>
                            <button value="012" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>2</button>
                            <button value="013" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>3</button>
                            <button value="014" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>4</button>
                            <button value="015" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>5</button>
                            <button value="016" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>6</button>
                            <button value="017" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>7</button>
                            <button value="018" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "green", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>8</button>
                        </div>
                        <div className="row" style={{ height: "25%" }}>
                            <button value="021" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>1</button>
                            <button value="022" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>2</button>
                            <button value="023" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>3</button>
                            <button value="024" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>4</button>
                            <button value="025" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>5</button>
                            <button value="026" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>6</button>
                            <button value="027" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>7</button>
                            <button value="028" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "blue", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>8</button>
                        </div>
                        <div className="row" style={{ height: "25%" }}>
                            <button value="031" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>1</button>
                            <button value="032" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>2</button>
                            <button value="033" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>3</button>
                            <button value="034" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>4</button>
                            <button value="035" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>5</button>
                            <button value="036" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>6</button>
                            <button value="037" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>7</button>
                            <button value="038" onClick={(e) => this.handleClick(e.target.value)} style={{ color: "white", border: "none", background: "none", width: "12.5%", fontSize: 80 }}>8</button>
                        </div>
                    </div>
                    :
                    <h2>Done!</h2>

        )
    }
}

export default TestMain;