
// this file has all kind of special buttons used in application

const EditButton = (props) => {
    return <button disabled={props.btn_dis} onClick={() => { props.updateCurrEdit(props.ind, props.elem); }}>Edit</button>;
}

const DeleteButton = (props) => {
    return <button disabled={props.btn_dis} onClick={() => { props.addMarkDel(props.id); }} className="red">{props.marked ? "x" : "Delete"}</button>;
}

const FilterButton = (props) => {
    return <button onClick={props.filterDialog}>Filter/Sort</button>;
}


const RefreshButton = (props) => {
    return <button disabled={props.btn_dis} onClick={props.refreshRequest}>Refresh</button>;
}

const AddButton = (props) => {
    return <button disabled={props.btn_dis} onClick={props.addNewEl}>Add</button>;
}

const ConfirmDelButton = (props) => {
    return <button className="red" disabled={props.btn_dis} onClick={() => { props.deleteRequest(props.ids); props.clear(); }}>Confirm deletion</button>;
}

const ConfirmEditButton = (props) => {
    let el = props.elem;
    let editHandler = props.editHandler;
    // if any of these fields empty, button disabled
    let isDisabled = (editHandler.name.length == 0 || editHandler.surname.length == 0 || editHandler.carId.length == 0);
    return <button onClick={() => {
        // edit send only if any field has changed
        if (el.name != editHandler.name || el.surname != editHandler.surname
            || el.carId.toString() != editHandler.carId || el.date != editHandler.date)
            props.editRequest({ ...props.editHandler, carRequest: false });
        // currently edited record gets unset
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
        props.addRequest({ ...props.editHandler, carRequest: false });
        // currently edited record gets unset
        props.updateCurrEdit(-1, null);
    }}
        disabled={isDisabled}
    >Confirm</button>;
}