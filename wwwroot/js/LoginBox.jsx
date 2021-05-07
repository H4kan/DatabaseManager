
// window displayed on startup, makes user give sufficient information to connect database
class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverName: ".",
            dbName: "",
            trusted: true,
            login: "",
            password: ""
        }
    }

    sendLogin = () => {
        this.props.sendLogin(this.state);
    }

    render() {
        return <div className="loginBox">
            <h3> Sign into database</h3>
            <div><span>Server name:</span> <input defaultValue="." type="text" onChange={(e) => { this.setState({ serverName: e.target.value }); }} /></div>
            <div><span>Database name:</span> <input defaultValue="" type="text" onChange={(e) => { this.setState({ dbName: e.target.value }); }} /></div>
            <div className="trusted"><input type="checkbox" defaultChecked onChange={(e) => { this.setState({ trusted: e.target.checked }); }} /><span>Trusted connection</span></div>
            <div><span>Login:</span> <input type="text" onChange={(e) => { this.setState({ login: e.target.value }); }} disabled={this.state.trusted} /></div>
            <div><span>Password:</span> <input type="text" onChange={(e) => { this.setState({ password: e.target.value }); }} disabled={this.state.trusted} /></div>
            <div className="buttonDiv">

                <iframe src="https://giphy.com/embed/3o7bu3XilJ5BOiSGic" width="30" height="30" frameBorder="0" className={this.props.logging ? "visible" : ""}></iframe>
                {/*data cant be sent if any of suffcient field is empty */}
                <button disabled={this.props.logging || this.state.serverName.length == 0 || this.state.dbName.length == 0 ||
                    (!this.state.trusted && (this.state.login.length == 0 || this.state.password.length == 0))}
                    onClick={this.sendLogin}>Sign in</button>
            </div>
        </div>
    }
}