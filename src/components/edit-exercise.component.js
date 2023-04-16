import React, { Component } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import withRouter from "./withRouter";

class EditExercise extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '', 
            description: '',
            duration: 0, 
            date: new Date(),
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/users/')
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username), 
                    })
                }
            })
            .catch(err => console.log("err get all users", err))

            
        console.log("params: ", this.props)
        // React router dom v6 does not support this.props.match.params anymore
        // useParams need to be used in the React function component, and cannot be used in a class component
        // so we nedd to create a wrapper to use useParams that wraps a class componenet
        // https://www.cluemediator.com/how-to-access-url-parameters-in-the-class-component-using-react-router-v6
        axios.get('http://localhost:5000/exercises/'+this.props.params.id)
            .then(res => {
                console.log("res data: ", res.data)
                this.setState({
                    username: res.data.username,
                    description: res.data.description,
                    duration: res.data.duration, 
                    date: new Date(res.data.date)
                })
            })
            .catch(err => console.log("err here", err))

            console.log("setState: ", this.state)
    }

    onChangeUsername(e) {
        console.log("triggre")
        this.setState({
            username: e.target.value
        })
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        })
    }

    onChangeDuration(e) {
        this.setState({
            duration: e.target.value
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    onSubmit(e) {
        e.preventDefault();
        
        const exercise = {
            username: this.state.username, 
            description: this.state.description, 
            duration: this.state.duration, 
            date: this.state.date
        }

        console.log("Exercise:", exercise)

        axios.post('http://localhost:5000/exercises/update/'+this.props.params.id, exercise)
            .then(res => console.log("res add exercise: ", res.data)) 

        window.location = '/'
    }

    render() {
        return (
            <div>
                <h3>Edit Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        {/* Select tag only show the options that is available,
                        if a value is not mapped in options, the value will not be shown */}
                        <select 
                            // ref='userInput'
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}>
                            {
                                this.state.users.map(function(user){
                                    return (
                                        <option key={user} value={user}>
                                            {user}
                                        </option>
                                    )

                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input 
                            type='text'
                            required
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration (in minutes): </label>
                        <input 
                            type='text'
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date: </label>
                        <div>
                            <DatePicker selected={this.state.date} onChange={this.onChangeDate} />
                        </div>
                    </div>

                    <div className="form-group">
                        <input type='submit' value='Edit Exercise Log' className="btn btn-primary my-3" />
                    </div>
                </form>
            </div>
        )
    }
}


export default withRouter(EditExercise)