

const FilterDialog = (props) =>
{
    let name = "", surname = "", date = ["", ""], capacity = ["", ""], cost = ["", ""];
    const nameInput = <input type="text" id="name" name="name" onChange={e => name = e.target.value} />;
    const surnameInput = <input type="text" id="surname" name="surname" onChange={e => surname = e.target.value}/>;
    const dateInput1 = <input type="date" id="date1" name="date" onChange={e => date[0] = e.target.value}/>
    const dateInput2 = <input type="date" id="date2" name="date" onChange={e => date[1] = e.target.value} />;
    const capacityInput1 = <input type="number" id="capacity1" name="capacity" onChange={e => capacity[0] = e.target.value} />;
    const capacityInput2 = <input type="number" id="capacity2" name="capacity" onChange={e => capacity[1] = e.target.value} />;
    const costInput1 = <input type="number" id="cost1" name="cost" onChange={e => cost[0] = e.target.value}/>;
    const costInput2 = <input type="number" id="cost2" name="cost" onChange={e => cost[1] = e.target.value}/>;

    

    const sendForm = () => {
        props.sendRequest(name, surname, date, capacity, cost);
        props.switchDialog();
    }

    return <div className="filterForm">
        <h3>Filter</h3>
        <form>
            <label htmlFor="name">Name</label>
            {nameInput}
            <label htmlFor="surname">Surname</label>
            {surnameInput}
            <label htmlFor="date">Production date</label>
            {dateInput1}
            {dateInput2}
            <label htmlFor="capacity">Capacity</label>
            {capacityInput1}
            {capacityInput2}
            <label htmlFor="cost">Cost</label>
            {costInput1}
            {costInput2}
        </form> 
        <div>
            <button onClick={props.switchDialog}>Cancel</button>
            <button onClick={sendForm}>Filter</button>
        </div>
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
            <td><span>{el.capacity.toFixed(2)}</span></td>
            <td><span>${el.cost}</span></td>
            <td><span className="actionBtns"><ActionButton/>          <EditButton/></span></td>
        </tr>
    }
        )

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

    sendFilterRequest = (name, surname, date, capacity, cost) =>
    {
        const handler = {
            action: "FILTER",
            name,
            surname,
            date,
            capacity,
            cost,
        };
        console.log(handler);
        fetch(this.props.url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(handler)
            })
            .then(res => console.log(res.json()));
    }

    getDatabase = () => {
        fetch(this.props.url)
            .then(res => res.json())
            .then(res => { console.log(res); return res; })
            .then(res => this.setState({
                records: res
            }))
    }

    componentDidMount() {

        this.getDatabase();
    }
    render() {
        return (
            <div className="home">
                <h1>Database Manager</h1>
                <ListBox records={this.state.records} dbName={this.props.dbName} filterDialog={this.switchfilterDialog} />
                <footer>Created by <a href="https://github.com/H4kan">H4kan</a>, 2021</footer>
                {this.state.filterDialogVisible ? <FilterDialog switchDialog={this.switchfilterDialog} sendRequest={this.sendFilterRequest} /> : null}
            </div>
        );
    }
}

ReactDOM.render(<Home url={ENDPOINT} dbName={DB_NAME} />, document.getElementById('content'));