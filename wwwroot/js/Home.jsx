
class LoginBox extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            serverName: ".",
            trusted: true,
            login: "",
            password: ""
        }
    }


    render() {
        return <div className="loginBox">
            <h3> Sign into database</h3>
            <div><span>Server name:</span> <input defaultValue="." type="text" onChange={(e) => { this.setState({ serverName: e.target.value }); }} /></div>
            <div className="trusted"><input type="checkbox" defaultChecked onChange={(e) => { this.setState({ trusted: e.target.checked }); }} /><span>Trusted connection</span></div>
            <div><span>Login:</span> <input type="text" onChange={(e) => { this.setState({ login: e.target.value }); }} disabled={this.state.trusted} /></div>
            <div><span>Password:</span> <input type="text" onChange={(e) => { this.setState({ password: e.target.value }); }} disabled={this.state.trusted} /></div>
            <button disabled={this.state.serverName.length == 0 || (!this.state.trusted && (this.state.login.length == 0 || this.state.password.length == 0))} onClick={() => this.props.sendLogin(this.state)}>Sign in</button>
            </div>
    }
}

class FilterDialog extends React.Component
{

    constructor(props) {
        super(props);
        this.props = props;
        this.name = props.filterHandler.name;
        this.surname = props.filterHandler.surname;
        this.date = props.filterHandler.date;
        this.capacity = props.filterHandler.capacity;
        this.cost = props.filterHandler.cost;

       this.nameInput = <input type="text" id="name" name="name" onChange={e => this.name = e.target.value} defaultValue={props.filterHandler.name} />;
        this.surnameInput = <input type="text" id="surname" name="surname" onChange={e => this.surname = e.target.value} defaultValue={props.filterHandler.surname} />;
        this.dateInput1 = <input type="date" id="date1" name="date" onChange={e => this.date[0] = e.target.value} defaultValue={props.filterHandler.date[0]} />
        this.dateInput2 = <input type="date" id="date2" name="date" onChange={e => this.date[1] = e.target.value} defaultValue={props.filterHandler.date[1]} />;
        this.capacityInput1 = <input type="number" id="capacity1" name="capacity" onChange={e => this.capacity[0] = e.target.value} defaultValue={props.filterHandler.capacity[0]} />;
        this.capacityInput2 = <input type="number" id="capacity2" name="capacity" onChange={e => this.capacity[1] = e.target.value} defaultValue={props.filterHandler.capacity[1]} />;
        this.costInput1 = <input type="number" id="cost1" name="cost" onChange={e => this.cost[0] = e.target.value} defaultValue={props.filterHandler.cost[0]} />;
        this.costInput2 = <input type="number" id="cost2" name="cost" onChange={e => this.cost[1] = e.target.value} defaultValue={props.filterHandler.cost[1]} />;
    }

    componentDidMount() {
        if (this.props.filterHandler.sortOrd != "") {
            document.querySelector(".sortTable #" + this.props.filterHandler.sortOrd).checked = true;
        }
    }

    sendForm = () => {
        const radioElems = document.getElementsByName("sort");
        let sortOrd = "";


        radioElems.forEach(el => { if (el.checked) sortOrd = el.id; });


        this.props.sendRequest(this.name, this.surname, this.date, this.capacity, this.cost, sortOrd);
        this.props.switchDialog();
    }

    clearForm = () => {
        this.props.sendRequest("", "", ["", ""], ["", ""], ["", ""], "");
        this.props.switchDialog();
    }

    render() {

        return <div className="filterForm">
            <div>
                <h3>Filter</h3>
                <form>
                    <label htmlFor="name">Name</label>
                    {this.nameInput}
                    <label htmlFor="surname">Surname</label>
                    {this.surnameInput}
                    <label htmlFor="date">Production date</label>
                    {this.dateInput1} - {this.dateInput2}
                    <label htmlFor="capacity">Capacity</label>
                    {this.capacityInput1} - {this.capacityInput2}
                    <label htmlFor="cost">Cost(USD)</label>
                    {this.costInput1} - {this.costInput2}
                </form>
            </div>
            <div className="sortTable">
                <h3>Sort</h3>
                <div>
                    <input type="radio" id="name" name="sort" value="name" />
                    <label htmlFor="name">alphabetically by Name</label>
                </div>
                <div>
                    <input type="radio" id="surname" name="sort" value="surname" />
                    <label htmlFor="surname">alphabetically by Surname</label>
                </div>
                <div>
                    <input type="radio" id="dateDesc" name="sort" value="dateDesc" />
                    <label htmlFor="dateDesc">descending by Production Date</label>
                </div>
                <div>
                    <input type="radio" id="dateAsc" name="sort" value="dateAsc" />
                    <label htmlFor="dateAsc">ascending by Production Date</label>
                </div>
                <div>
                    <input type="radio" id="capDesc" name="sort" value="capDesc" />
                    <label htmlFor="capDesc">descending by Capacity</label>
                </div>
                <div>
                    <input type="radio" id="capAsc" name="sort" value="capAsc" />
                    <label htmlFor="capAsc">ascending by Capacity</label>
                </div>
                <div>
                    <input type="radio" id="costDesc" name="sort" value="costDesc" />
                    <label htmlFor="costDesc">descending by Cost</label>
                </div>
                <div>
                    <input type="radio" id="costAsc" name="sort" value="costAsc" />
                    <label htmlFor="costAsc">ascending by Cost</label>
                </div>

            </div>
            <div className="filterBtns">
                <button onClick={this.clearForm}>Clear</button>
                <button onClick={this.sendForm}>Filter</button>
            </div>
        </div>
    }
}

const EditButton = (props) =>
{
    return <button disabled={props.btn_dis} onClick={() => { props.updateCurrEdit(props.ind, props.elem); }}>Edit</button>;
}

const DeleteButton = (props) =>
{
    return <button disabled={props.btn_dis} onClick={() => { props.addMarkDel(props.id); }} className="red">{props.marked ? "x" : "Delete"}</button>;
}

const FilterButton = (props) =>
{
    return <button onClick={props.filterDialog}>Filter/Sort</button>;
}


const RefreshButton = (props) =>
{
    return <button disabled={props.btn_dis} onClick={props.refreshRequest}>Refresh</button>;
}

const AddButton = (props) =>
{
    return <button disabled={props.btn_dis} onClick={props.addNewEl}>Add</button>;
}

const ConfirmDelButton = (props) => {
    return <button className="red" disabled={props.btn_dis} onClick={() => { props.deleteRequest(props.ids); props.clear(); }}>Confirm deletion</button>;
}

const ConfirmEditButton = (props) => {
    let el = props.elem;
    let editHandler = props.editHandler;
    let isDisabled = (editHandler.name.length == 0 || editHandler.surname.length == 0 || editHandler.carId.length == 0);
    return <button onClick={() => {
        if (el.name != editHandler.name || el.surname != editHandler.surname
            || el.carId.toString() != editHandler.carId || el.date != editHandler.date)
            props.editRequest(props.editHandler);
        props.updateCurrEdit(-1, null);
    }}
        disabled={isDisabled}
    >Confirm</button>;
}

const CancelButton = (props) => {
    return <button onClick={() => { props.updateCurrEdit(-1, null); }}>Cancel</button>;
}

const ConfirmAddButton = (props) => {
    let editHandler = props.editHandler;
    let isDisabled = (editHandler.name.length == 0 || editHandler.surname.length == 0 || editHandler.carId.length == 0);
    return <button onClick={() => {
        props.addRequest(props.editHandler);
        props.updateCurrEdit(-1, null);
    }}
        disabled={isDisabled}
    >Confirm</button>;
}

class ListBox extends React.Component
{

    constructor(props) {
        super(props);
  
        this.state =
        {
            markedForDel: [],
            currEdit: -1,
            newElementEdit: false,
            editHandler: {
                personId: "",
                name: "",
                surname: "",
                carId: "",
                date: ""
            }
        };

    }

    addMarkDel = (id) => {
        let arrId = this.state.markedForDel.indexOf(id.toString());
        if (arrId == -1)
            this.setState(
                {
                    markedForDel: this.state.markedForDel.concat(id.toString())
                });
        else {
            const arr = this.state.markedForDel;
            arr.splice(arrId, 1);
            this.setState(
                {
                    markedForDel: arr
                });
        }
    }

    updateCurrEdit = (ind, el) => {
            this.setState({
                currEdit: ind,
                newElementEdit: false
            });
        if (ind >= 0) {
            let dateStr = "";
            if (el.date.length > 0) {
                const dateArr = el.date.split('.');
                const date = new Date(dateArr[2], dateArr[1], dateArr[0]);
                const days = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
                const months = date.getMonth() > 10 ? date.getMonth() : "0" + (date.getMonth());
                dateStr = `${date.getFullYear()}-${months}-${days}`;
            }
            
            this.setState({
                editHandler: {
                    personId: el.personId.toString(),
                    name: el.name,
                    surname: el.surname,
                    carId: el.carId.toString(),
                    date: dateStr
                }
            });
        }
            
        else 
            this.setState({
                editHandler: {
                    personId: "",
                    name: "",
                    surname: "",
                    carId: "",
                    date: ""
                }
            });
    }

    clearMarkDel = () => {
        this.setState({
            markedForDel: []
        })
    }

    addNewEl = () => {
        
        this.setState(
            {
                currEdit: -1,
                newElementEdit: true
            })
    }

    render() {
        this.trElems = this.props.records.map((el, ind) => {
            let dateStr = "";
            if (el.date.length > 0) {
                const dateArr = el.date.split('.');
                const date = new Date(dateArr[2], dateArr[1], dateArr[0]);
                const days = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
                const months = date.getMonth() > 10 ? date.getMonth() : "0" + (date.getMonth());
                dateStr = `${days}.${months}.${date.getFullYear()}`;
            }
     
            if (this.state.currEdit != ind) {
                return <tr key={el.personId}>
                    <td><span>{el.personId}</span></td>
                    <td><span>{el.name}</span></td>
                    <td><span>{el.surname}</span></td>
                    <td><span>{el.carId}</span></td>
                    <td><span>{dateStr}</span></td>
                    <td><span>{el.capacity.toFixed(2)}</span></td>
                    <td><span>${el.cost}</span></td>
                    <td><span className="actionBtns"><EditButton btn_dis={this.props.btn_dis} ind={ind} updateCurrEdit={this.updateCurrEdit} elem={el} /> <DeleteButton
                        btn_dis={this.props.btn_dis} id={el.personId} addMarkDel={this.addMarkDel}
                        marked={this.state.markedForDel.indexOf(el.personId.toString()) >= 0}
                    /></span></td>
                </tr>
            }
            else {
     
                return <tr key={el.personId}>
                    <td><span>{el.personId}</span></td>
                    <td><input type="text" defaultValue={this.state.editHandler.name} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, name: e.target.value } })} /></td>
                    <td><input type="text" defaultValue={this.state.editHandler.surname} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, surname: e.target.value } })}  /></td>
                    <td><input type="number" defaultValue={this.state.editHandler.carId} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, carId: e.target.value } })}  /></td>
                    <td><input type="date" defaultValue={this.state.editHandler.date} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, date: e.target.value } })} /></td>
                    <td><span>{el.capacity.toFixed(2)}</span></td>
                    <td><span>${el.cost}</span></td>
                    <td><span className="actionBtns">
                        <ConfirmEditButton editHandler={this.state.editHandler} updateCurrEdit={this.updateCurrEdit} editRequest={this.props.editRequest} elem={el}/>
                        <CancelButton updateCurrEdit={this.updateCurrEdit} /></span></td>
                </tr>
            }
           
            
        }
        );
        if (this.state.newElementEdit) {
            const newElem = <tr key={0}>
                <td><span>0</span></td>
                <td><input type="text" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, name: e.target.value } })} /></td>
                <td><input type="text" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, surname: e.target.value } })} /></td>
                <td><input type="number" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, carId: e.target.value } })} /></td>
                <td><input type="date" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, date: e.target.value } })} /></td>
                <td><span>0</span></td>
                <td><span>0</span></td>
                <td><span className="actionBtns">
                    <ConfirmAddButton editHandler={this.state.editHandler} addRequest={this.props.addRequest} updateCurrEdit={this.updateCurrEdit} />
                    <CancelButton updateCurrEdit={this.updateCurrEdit} /></span></td>
            </tr>
            this.trElems.unshift(newElem);

        }
        return (
            <div className="listBox">
                <div className="topBar">
                    <h2 className="title">{this.props.dbName}</h2>
                    <div>
                        <FilterButton filterDialog={this.props.filterDialog}/>
                        <RefreshButton btn_dis={this.props.btn_dis} refreshRequest={this.props.refreshRequest} />
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
                        {this.trElems}
                    </tbody>
                </table>
                <div className="bottomBar">
                    <AddButton btn_dis={this.props.btn_dis} addNewEl={this.addNewEl} />
                    {this.state.markedForDel.length > 0 ? < ConfirmDelButton btn_dis={this.props.btn_dis} deleteRequest={this.props.deleteRequest} ids={this.state.markedForDel} clear={this.clearMarkDel} /> : null}
                </div>
            </div>
        )
    }
}
   


class Main extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filterDialogVisible: false,
        }
        this.filterHandler = {
            name: "",
            surname: "",
            date: ["", ""],
            capacity: ["", ""],
            cost: ["", ""],
            sortOrd: ""
        }
    }



    switchfilterDialog = () => {
        this.setState({
            filterDialogVisible: !this.state.filterDialogVisible
        })
    }

    refreshRequest = () => {
        fetch(this.props.url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.filterHandler)
            })
            .then(res => res.json())
            .then(res => {
                if (this.state.records.length > 0 && res.length == 0) alert("Error ocurred during operation");
                else this.setState({
                    records: res
                })
            });
    }

    deleteRequest = (ids) => {
        fetch(this.props.url,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personId: ids})
            })
            .then(res => res.json())
            .then(res => {
                if (this.state.records.length > 0 && res.length == 0) alert("Error ocurred during operation");
                else this.setState({
                    records: res
                })
            });
        
    }

    sendFilterRequest = (name, surname, date, capacity, cost, sortOrd) =>
    {
        this.filterHandler = {
            name,
            surname,
            date,
            capacity,
            cost,
            sortOrd
        };

        fetch(this.props.url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.filterHandler)
            })
            .then(res => res.json())
            .then(res => {
                if (this.state.records.length > 0 && res.length == 0) alert("Error ocurred during operation");
                else this.setState({
                    records: res
                })
            });
    }

    sendEditRequest = (editHandler) =>
    {
        fetch(this.props.url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editHandler)
        })
        .then(res => res.json())
            .then(res => {
                if (this.state.records.length > 0 && res.length == 0) alert("Error ocurred during operation");
                else this.setState({
                    records: res
                })
            });
    }

    sendAddRequest = (editHandler) => {

        fetch(this.props.url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editHandler)
        })
            .then(res => res.json())
            .then(res => {
                if (this.state.records.length > 0 && res.length == 0) alert("Error ocurred during operation");
                else this.setState({
                    records: res
                })
            });
    }

    getDatabase = () => {
        fetch(this.props.url)
            .then(res => res.json())
            .then(res => this.setState({
                records: res
            }));
    }

    componentDidMount() {

        this.getDatabase();
    }
    render() {
        return (
            <div className="home">
                <h1>Database Manager</h1>
                <ListBox records={this.state.records} dbName={this.props.dbName} filterDialog={this.switchfilterDialog} btn_dis={this.state.filterDialogVisible} refreshRequest={this.refreshRequest} deleteRequest={this.deleteRequest} editRequest={this.sendEditRequest} addRequest={this.sendAddRequest} />
                <footer>Created by <a href="https://github.com/H4kan">H4kan</a>, 2021</footer>
                {this.state.filterDialogVisible ? <FilterDialog switchDialog={this.switchfilterDialog} sendRequest={this.sendFilterRequest} filterHandler={this.filterHandler} /> : null}
            </div>
        );
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            dbName: ""
        }
    }

    sendLoginRequest = (loginHandler) => {
        console.log(loginHandler);
        fetch(this.props.url,
            {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginHandler)
            })
            //.then(res => res.json())
            //.then(res => console.log(res));
    }

    render() {
        return <div className="main">
            {this.state.logged ? <Main url={this.props.url} dbName={this.state.dbName} /> : <LoginBox sendLogin={this.sendLoginRequest} />}
            </div>
    }
}

ReactDOM.render(<Home url={ENDPOINT} dbName={DB_NAME} />, document.getElementById('content'));