
// handles dialog used for filtering and sorting
class FilterDialog extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name = props.filterHandler.name;
        this.surname = props.filterHandler.surname;
        this.date = props.filterHandler.date;
        this.capacity = props.filterHandler.capacity;
        this.cost = props.filterHandler.cost;

        // inputs
        this.nameInput = <input type="text" id="name" name="name" onChange={e => this.name = e.target.value}
            defaultValue={props.filterHandler.name} />;
        this.surnameInput = <input type="text" id="surname" name="surname" onChange={e => this.surname = e.target.value}
            defaultValue={props.filterHandler.surname} />;
        this.dateInput1 = <input type="date" id="date1" name="date" onChange={e => this.date[0] = e.target.value}
            defaultValue={props.filterHandler.date[0]} />
        this.dateInput2 = <input type="date" id="date2" name="date" onChange={e => this.date[1] = e.target.value}
            defaultValue={props.filterHandler.date[1]} />;
        this.capacityInput1 = <input type="number" id="capacity1" name="capacity" onChange={e => this.capacity[0] = e.target.value}
            defaultValue={props.filterHandler.capacity[0]} />;
        this.capacityInput2 = <input type="number" id="capacity2" name="capacity" onChange={e => this.capacity[1] = e.target.value}
            defaultValue={props.filterHandler.capacity[1]} />;
        this.costInput1 = <input type="number" id="cost1" name="cost" onChange={e => this.cost[0] = e.target.value}
            defaultValue={props.filterHandler.cost[0]} />;
        this.costInput2 = <input type="number" id="cost2" name="cost" onChange={e => this.cost[1] = e.target.value}
            defaultValue={props.filterHandler.cost[1]} />;
    }

    componentDidMount() {
        // if some filter was already applied, checked box is put back
        if (this.props.filterHandler.sortOrd != "") {
            document.querySelector(".sortTable #" + this.props.filterHandler.sortOrd).checked = true;
        }
    }

    // handles confirming filter/sort settings
    sendForm = () => {
        const radioElems = document.getElementsByName("sort");
        let sortOrd = "";

        // if any radio button checked, sortOrd is set to its id
        radioElems.forEach(el => { if (el.checked) sortOrd = el.id; });

        
        this.props.sendRequest(this.name, this.surname, this.date, this.capacity, this.cost, sortOrd);
        // closes dialog
        this.props.switchDialog();
    }

    // if clear is clicked, filter/sort is cleared
    clearForm = () => {
        this.props.sendRequest("", "", ["", ""], ["", ""], ["", ""], "");
        // closes dialog
        this.props.switchDialog();
    }

    render() {
        // filter/sort dialog is a form and div gropuing sorting radio boxes
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