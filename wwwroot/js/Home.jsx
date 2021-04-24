
const ListBox = (props) => {

    const liElems = props.records.map(el => <li key={el.personId}>{el.name}</li>);

    return (
        <div className="listBox">
            <h2 className="title">{props.dbName}</h2>
            <ul>
                {liElems}
            </ul>
        </div>
        )
}
   


class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = { records: [] }
    }

    componentDidMount() {
        fetch(this.props.url)
            .then(res => res.json())
            .then(res => this.setState({
                records: res
            }))

    }
    render() {
        return (
            <div className="home">
                <h1>Database Manager</h1>
                <ListBox records={this.state.records} dbName={this.props.dbName} />
            </div>
        );
    }
}

ReactDOM.render(<Home url={ENDPOINT} dbName={DB_NAME} />, document.getElementById('content'));