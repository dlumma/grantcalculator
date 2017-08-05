import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig, s3Upload, s3Delete } from '../libs/awsLib';

import {
    FormGroup,
    FormControl,
    ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config.js';
import './Grants.css';

class Grants extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            grant: null,
            content: '',
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getGrant();
            this.setState({
                grant: results,
                content: results.content,
            });
        }
        catch (e) {
            alert(e);
        }
    }

    getGrant() {
        return invokeApig({ path: `/grants/${this.props.match.params.id}` }, this.props.userToken);
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    formatFilename(str) {
        return (str.length < 50)
            ? str
            : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = (event) => {
        this.file = event.target.files[0];
    }

    saveNote(note) {
        return invokeApig({
            path: `/notes/${this.props.match.params.id}`,
            method: 'PUT',
            body: note,
        }, this.props.userToken);
    }

    handleSubmit = async (event) => {
        let uploadedFilename;

        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert('Please pick a file smaller than 5MB');
            return;
        }

        this.setState({ isLoading: true });

        try {

            if (this.file) {
                uploadedFilename = (await s3Upload(this.file, this.props.userToken)).Location;
            }

            await this.saveGrant({
                ...this.state.grant,
                content: this.state.content,
                attachment: uploadedFilename || this.state.grant.attachment,
            });
            this.props.history.push('/');
        }
        catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }



    deleteNote() {
        // TODO: check if there is an attachment
        console.log('this.state.grant.attachment: ' + this.state.grant.attachment)
        s3Delete(this.state.grant.attachment, this.props.userToken)
        return invokeApig({
            path: `/grants/${this.props.match.params.id}`,
            method: 'DELETE',
        }, this.props.userToken);
    }

    handleDelete = async (event) => {
        event.preventDefault();

        const confirmed = window.confirm('Are you sure you want to delete this note?');

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteNote();
            this.props.history.push('/');
        }
        catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }

    render() {
        return (
            <div className="Grants">
                {this.state.grant &&
                    (<form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.content}
                                componentClass="textarea" />
                        </FormGroup>
                        {this.state.grant.attachment &&
                            (<FormGroup>
                                <ControlLabel>Attachment</ControlLabel>
                                <FormControl.Static>
                                    <a target="_blank" rel="noopener noreferrer" href={this.state.grant.attachment}>
                                        {this.formatFilename(this.state.grant.attachment)}
                                    </a>
                                </FormControl.Static>
                            </FormGroup>)}
                        <FormGroup controlId="file">
                            {!this.state.grant.attachment &&
                                <ControlLabel>Attachment</ControlLabel>}
                            <FormControl
                                onChange={this.handleFileChange}
                                type="file" />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Save"
                            loadingText="Saving…" />
                        <LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…" />
                    </form>)}
            </div>
        );
    }
}

export default withRouter(Grants); 