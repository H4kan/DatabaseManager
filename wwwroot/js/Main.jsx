

// holds whole manager view (after logging in)
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
            sortOrd: "",
            carIds: []
        }
    }


    // hides/displays filter/sort options
    switchfilterDialog = () => {
        this.setState({
            filterDialogVisible: !this.state.filterDialogVisible
        })
    }

    // handles refreshing records
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

    // handles deleting marked items
    deleteRequest = (ids) => {
        fetch(this.props.url,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personId: ids })
            })
            .then(res => res.json())
            .then(res => {
                if (this.state.records.length > 0 && res.length == 0) alert("Error ocurred during operation");
                else this.setState({
                    records: res
                })
            });

    }

    // handles sending filter/sort info to server
    sendFilterRequest = (name, surname, date, capacity, cost, sortOrd) => {
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
                this.setState({
                    records: res
                })
            });
    }

    // handles sending request to edit record to server
    sendEditRequest = (editHandler) => {
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

    // handles sending request to add record to server
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

    getCarIds = () => {
        fetch(this.props.url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personId: "",
                name: "",
                surname: "",
                carId: "",
                date: "",
                carRequest: true
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    carIds: res
                })
            });
    }

    // default GET request, sets records
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
                <ListBox records={this.state.records} dbName={this.props.dbName} filterDialog={this.switchfilterDialog} btn_dis={this.state.filterDialogVisible}
                    refreshRequest={this.refreshRequest} deleteRequest={this.deleteRequest} editRequest={this.sendEditRequest} addRequest={this.sendAddRequest}
                    getCarIds={this.getCarIds} carIds={this.state.carIds} />
                <footer>Created by <a href="https://github.com/H4kan">H4kan</a>, 2021</footer>
                {this.state.filterDialogVisible ? <FilterDialog switchDialog={this.switchfilterDialog} sendRequest={this.sendFilterRequest} filterHandler={this.filterHandler} /> : null}
            </div>
        );
    }
}