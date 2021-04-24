

const FilterDialog = (props) =>
{
    return <div className="filterForm">
        <form>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" />
            <label htmlFor="surname">Surame</label>
            <input type="text" id="surname" name="surname" />
        </form> 
        </div>
}

const ActionButton = (props) =>
{
    return <button>Edit</button>;
}

const EditButton = (props) =>
{
    return <button>Delete</button>;
}

const FilterButton = (props) =>
{
    return <button onClick={props.filterDialog}>Filter</button>;
}

const RefreshButton = (props) =>
{
    return <button>Refresh</button>;
}

const AddButton = (props) =>
{
    return <button>Add</button>;
}


const ListBox = (props) => {


    const trElems = props.records.map(el =>
    {
        return <tr key={el.personId}>
            <td><span>{el.personId}</span></td>
            <td><span>{el.name}</span></td>
            <td><span>{el.surname}</span></td>
            <td><span>{el.carId}</span></td>
            <td><span>{el.date.substring(0, 10)}</span></td>
            <td><span>00.000</span></td>
            <td><span>$123.000</span></td>
            <td><span className="actionBtns"><ActionButton/>          <EditButton/></span></td>
        </tr>
    }
        );

    return (
        <div className="listBox">
            <div className="topBar">
                <h2 className="title">{props.dbName}</h2>
                <div>
                    <FilterButton filterDialog={props.filterDialog} />
                    <RefreshButton />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th><span>ID</span></th>
                        <th><span>Name</span></th>
                        <th><span>Surname</span></th>
                        <th><span>Car ID</span></th>
                        <th><span>Production date</span></th>
                        <th><span>Capacity</span></th>
                        <th><span>Cost</span></th>
                        <th><span>Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {trElems}
                </tbody>
            </table>
            <div className="bottomBar">
                <AddButton />
            </div>
        </div>
        )
}
   


class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filterDialogVisible: false
        }
    }

    switchfilterDialog = () => {
        this.setState({
            filterDialogVisible: !this.state.filterDialogVisible
        })
    }

    componentDidMount() {
        fetch(this.props.url)
            .then(res => res.json())
            .then(res => { console.log(res); return res; })
            .then(res => this.setState({
                records: res
            }))

    }
    render() {
        return (
            <div className="home">
                <h1>Database Manager</h1>
                <ListBox records={this.state.records} dbName={this.props.dbName} filterDialog={this.switchfilterDialog} />
                <footer>Created by <a href="https://github.com/H4kan">H4kan</a>, 2021</footer>
                {this.state.filterDialogVisible ? <FilterDialog /> : null}
            </div>
        );
    }
}

ReactDOM.render(<Home url={ENDPOINT} dbName={DB_NAME} />, document.getElementById('content'));