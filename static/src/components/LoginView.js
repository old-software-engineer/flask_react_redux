/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.cf = null
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });

        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }

        if (this.state.password === '' || !this.state.password) {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });

        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.props.loginUser(this.state.email, this.state.password, this.state.redirectTo);
    }

    componentDidMount(){
            // customize your questions here
    // this.refs.email.setAttribute('cf-questions', "What is your name?");
    // this.refs.password.setAttribute('cf-questions', "What is your email?");

    this.cf = window.cf.ConversationalForm.startTheConversation({
      formEl: this.refs.form,
      context: document.getElementById("target"), // <-- bind this to an element instead of html body
      flowStepCallback: (dto, success, error) => {
        success();
      },
      submitCallback: () => {
        // action when form submitted
        console.log("Form submitted...");
      }
    });
    }

    render() {
        return (
            <div ref='target' id='target' className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>

                    <form id='form' ref='form' role="form">
                        <div className="text-center">
                            <h2>Login to view protected content!</h2>
                            {
                                this.props.statusText &&
                                    <div className="alert alert-info">
                                        {this.props.statusText}
                                    </div>
                            }

                            <div className="col-md-12">
                                <TextField
                                  hintText="Email"
                                  floatingLabelText="what is your email?"
                                  type="email"
                                  errorText={this.state.email_error_text}
                                  onChange={(e) => this.changeValue(e, 'email')}
                                />
                            </div>
                            <div className="col-md-12">
                                <TextField
                                  hintText="Password"
                                  floatingLabelText="Now enter your password."
                                  type="password"
                                  errorText={this.state.password_error_text}
                                  onChange={(e) => this.changeValue(e, 'password')}
                                />
                            </div>

                            <div className="col-md-12">
                                <TextField
                                  floatingLabelText="Thanks for participating in this demo."
                                  type="text"
                                  errorText='This is the end of demo. Now you can leave the page.'
                                  onChange={(e) => this.changeValue(e, 'password')}
                                />
                            </div>

                            <RaisedButton
                              disabled={this.state.disabled}
                              style={{ marginTop: 50 }}
                              label="Submit"
                              onClick={(e) => this.login(e)}
                            />

                        </div>
                    </form>


            </div>
        );

    }
}

LoginView.propTypes = {
    loginUser: React.PropTypes.func,
    statusText: React.PropTypes.string,
};
