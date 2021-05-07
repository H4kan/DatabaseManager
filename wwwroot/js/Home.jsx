

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logging: false,
            logged: false,
            dbName: ""
        }
    }

    // handles sending data from inputs to server
    sendLoginRequest = (loginHandler) => {
        this.setState({
            logging: true
        });
        fetch(this.props.url,
            {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginHandler)
            })
            .then(res => res.json())
            // if res is SUCC connection succeded
            .then(res => {
                if (res == "FAIL") alert("Failed to connect to database");
                else if (res == "SUCC") {
                    this.setState({
                        logged: true,
                        dbName: loginHandler.dbName
                    })
                }
            })
            // logging is used to display loading icon
            .then(() => {
                this.setState({
                    logging: false
                });
            });

    }

    // logged controls displaying of manager window or login window
    logoutHandler = () => {
        this.setState({ logged: false });
    }

    render() {
        return <div className="main">
            {this.state.logged ? <button className="logout" onClick={this.logoutHandler}>Logout</button> : ""}
            {this.state.logged ? <Main url={this.props.url} dbName={this.state.dbName} logout={this.logoutHandler} /> : <LoginBox sendLogin={this.sendLoginRequest} logging={this.state.logging} />}
            </div>
    }
}

ReactDOM.render(<Home url={ENDPOINT} dbName={DB_NAME} />, document.getElementById('content'));