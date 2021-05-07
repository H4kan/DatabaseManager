
// listbox handles table with records
class ListBox extends React.Component {

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

    // handles marking/unmarking record for deletion
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

    // makes record appear as "editable"
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
        this.props.getCarIds();
    }

    // clears all marked for deletion
    clearMarkDel = () => {
        this.setState({
            markedForDel: []
        })
    }

    // makes list render with element in creation mode
    addNewEl = () => {

        this.setState(
            {
                currEdit: -1,
                newElementEdit: true
            });
        this.props.getCarIds();
    }

    // on adding new element list should be scrolled to top where new element is going to appear
    componentDidUpdate() {
        if (this.state.newElementEdit) {
            document.querySelector("tbody").scrollTo(0, 0);
        }
    }

    getOptionsCarIds = () => {
        if (this.props.carIds)
            return this.props.carIds.map(el => <option value={el} key={el}>{el}</option>);
        else return [];
    }

    render() {
        // tr elems holds list of records in <tr/>
        this.trElems = this.props.records.map((el, ind) => {
            let dateStr = "";
            if (el.date.length > 0) {
                // formatting date
                const dateArr = el.date.split('.');
                const date = new Date(dateArr[2], dateArr[1], dateArr[0]);
                const days = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
                const months = date.getMonth() > 10 ? date.getMonth() : "0" + (date.getMonth());
                dateStr = `${days}.${months}.${date.getFullYear()}`;
            }
            // if current element is not edited it is returned as fields with data informations
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
                // otherwise there are inputs for edition
                return <tr key={el.personId}>
                    <td><span>{el.personId}</span></td>
                    <td><input type="text" defaultValue={this.state.editHandler.name} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, name: e.target.value } })} /></td>
                    <td><input type="text" defaultValue={this.state.editHandler.surname} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, surname: e.target.value } })} /></td>
                    <td>
                        <select defaultValue={this.state.editHandler.carId} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, carId: e.target.value } })}>
                            {this.getOptionsCarIds()}
                        </select>
                    </td>
                    <td><input type="date" defaultValue={this.state.editHandler.date} onChange={e => this.setState({ editHandler: { ...this.state.editHandler, date: e.target.value } })} /></td>
                    <td><span>{el.capacity.toFixed(2)}</span></td>
                    <td><span>${el.cost}</span></td>
                    <td><span className="actionBtns">
                        <ConfirmEditButton editHandler={this.state.editHandler} updateCurrEdit={this.updateCurrEdit} editRequest={this.props.editRequest} elem={el} />
                        <CancelButton updateCurrEdit={this.updateCurrEdit} /></span></td>
                </tr>
            }


        }
        );
        // if new element is being added
        if (this.state.newElementEdit) {

            const newElem = <tr key={0}>
                <td><span>0</span></td>
                <td><input type="text" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, name: e.target.value } })} /></td>
                <td><input type="text" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, surname: e.target.value } })} /></td>
                <td>
                    <select defaultValue="" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, carId: e.target.value } })}>
                        {this.getOptionsCarIds().concat(<option value="" selected disabled hidden></option>)}
                    </select>
                </td>
                <td><input type="date" onChange={e => this.setState({ editHandler: { ...this.state.editHandler, date: e.target.value } })} /></td>
                <td><span>0</span></td>
                <td><span>0</span></td>
                <td><span className="actionBtns">
                    <ConfirmAddButton editHandler={this.state.editHandler} addRequest={this.props.addRequest} updateCurrEdit={this.updateCurrEdit} />
                    <CancelButton updateCurrEdit={this.updateCurrEdit} /></span></td>
            </tr>
            this.trElems.unshift(newElem);

        }

        // list is returned as table with trElemens as records
        return (
            <div className="listBox">
                <div className="topBar">
                    <h2 className="title">{this.props.dbName}</h2>
                    <div>
                        <FilterButton filterDialog={this.props.filterDialog} />
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
                    {/* if there are buttons marked for deletion, confirming deletion button is displayed */}
                    {this.state.markedForDel.length > 0 ? < ConfirmDelButton btn_dis={this.props.btn_dis} deleteRequest={this.props.deleteRequest} ids={this.state.markedForDel} clear={this.clearMarkDel} /> : null}
                </div>
            </div>
        )
    }
}