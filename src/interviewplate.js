// @flow

import template from "./template";

export default class InterviewPlate {
    data: { [key: string]: any };
    DB: { [key: string]: any };
    container: { [key: string]: any };

    card: HTMLFormElement;
    fieldFullName: HTMLInputElement;
    fieldBirthDate: HTMLInputElement;
    fieldPhoneNumber: HTMLInputElement;
    fieldTextArea: HTMLTextAreaElement;

    linkEdit: HTMLAnchorElement;
    linkDelete: HTMLAnchorElement;
    linkSave: HTMLAnchorElement;
    linkCancel: HTMLAnchorElement;
    linkAdd: HTMLAnchorElement;

    constructor(data: { [key: string]: any }, DB: { [key: string]: any }, container: { [key: string]: any }, isEmpty: boolean) {

        if (isEmpty) {
            this.data = {
                isEmpty: true,
                readonly: '',
                id: 'newCard',
                fullName: '',
                birthDate: '',
                phoneNumber: '',
                interviewNotes: ''
            }
        }
        else {
            this.data = data;
            this.data.isEmpty = false;
            this.data.readonly = 'readonly';
            this.data.id = data._id.$oid;
        }
        this.DB = DB;
        this.container = container;
    }

    render() {
        const container = this.data.isEmpty ? this.container.newCard : this.container.list;
        container.insertAdjacentHTML('beforeend', template(this.data));

        this.card = ((document.getElementById(this.data.id): any): HTMLFormElement);
        const findID = (parent, parentID) => fieldName => parent.querySelector(`#${fieldName}_${parentID}`);
        const getField = findID(this.card, this.data.id);

        this.fieldFullName = ((getField('fullName'): any): HTMLInputElement);
        this.fieldBirthDate = ((getField('birthDate'): any): HTMLInputElement);
        this.fieldPhoneNumber = ((getField('phoneNumber'): any): HTMLInputElement);
        this.fieldTextArea = ((getField('interviewNotes'): any): HTMLTextAreaElement);

        // dynamic change in the height of the textarea
        this.fieldTextArea.style.height = this.fieldTextArea.scrollHeight + 'px';
        this.fieldTextArea.addEventListener('keyup', (e: KeyboardEvent) => {
            e.preventDefault();
            this.fieldTextArea.style.height = '24px';
            this.fieldTextArea.style.height = this.fieldTextArea.scrollHeight + 'px';
        });

        this.linkEdit = ((getField('linkEdit'): any): HTMLAnchorElement);
        this.linkEdit.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            this.edit();
        });

        this.linkDelete = ((getField('linkDelete'): any): HTMLAnchorElement);
        this.linkDelete.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            this.destroy();
        });

        this.linkSave = ((getField('linkSave'): any): HTMLAnchorElement);
        this.linkSave.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            this.update();
        });

        this.linkCancel = ((getField('linkCancel'): any): HTMLAnchorElement);
        this.linkCancel.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            this.cancel();
        });

        this.linkAdd = ((getField('linkAdd'): any): HTMLAnchorElement);
        this.linkAdd.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            this.linkAdd.hidden = true;
            this.update();
        });

        if (this.data.isEmpty) {
            this.linkEdit.hidden = true;
            this.linkDelete.hidden = true;
            this.linkSave.hidden = true;
            this.linkCancel.hidden = true;
            this.linkAdd.hidden = false;
        }
    }

    destroy() {
        if (confirm('Are you sure to delete this card?')) {
            this.remove();
        }
    }

    remove() {
        const requestUrl = `${this.DB.URLpath}/${this.data.id}?apiKey=${this.DB.apiKey}`;
        const requestOptions = {
            method: 'DELETE',
            mode: 'cors'
        };

        fetch(requestUrl, requestOptions)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    console.log('Delete successful');
                    this.card.remove();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .catch(error => {
                console.log('Request failed', error);
            });
    }

    update() {
        const newData = {
            fullName: this.fieldFullName.value,
            birthDate: this.fieldBirthDate.value,
            phoneNumber: this.fieldPhoneNumber.value,
            interviewNotes: this.fieldTextArea.value
        };
        let requestUrl = `${this.DB.URLpath}?apiKey=${this.DB.apiKey}`;
        let requestOptions = {
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        };

        if (!this.data.isEmpty) {
            requestUrl = `${this.DB.URLpath}/${this.data.id}?apiKey=${this.DB.apiKey}`;
            requestOptions = {
                method: 'PUT',
                body: JSON.stringify(newData),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            };
        }

        fetch(requestUrl, requestOptions)
            .then(response => response.text())
            .then(text => {
                console.log('Request successful');
                if (this.data.isEmpty) {
                    this.erase();
                    const data = JSON.parse(text);
                    const card = new InterviewPlate(data, this.DB, this.container, false);
                    card.render();
                }
                else {
                    this.save();
                }
            })
            .catch(error => {
                console.log('Request failed', error);
            });
    }

    erase() {
        this.fieldFullName.value = '';
        this.fieldBirthDate.value = '';
        this.fieldPhoneNumber.value = '';
        this.fieldTextArea.value = '';
        this.linkAdd.hidden = false;
    }

    edit() {
        this.linkEdit.hidden = true;
        this.linkDelete.hidden = true;
        this.linkSave.hidden = false;
        this.linkCancel.hidden = false;

        this.card.classList.add('edit-card');
        this.fieldFullName.readOnly = false;
        this.fieldFullName.classList.add('editable');
        this.fieldBirthDate.readOnly = false;
        this.fieldBirthDate.classList.add('editable');
        this.fieldPhoneNumber.readOnly = false;
        this.fieldPhoneNumber.classList.add('editable');
        this.fieldTextArea.readOnly = false;
        this.fieldTextArea.classList.add('editable');
    }

    cancel() {
        this.card.classList.remove('edit-card');
        this.fieldFullName.readOnly = true;
        this.fieldFullName.value = this.data.fullName;
        this.fieldFullName.classList.remove('editable');

        this.fieldBirthDate.readOnly = true;
        this.fieldBirthDate.value = this.data.birthDate;
        this.fieldBirthDate.classList.remove('editable');

        this.fieldPhoneNumber.readOnly = true;
        this.fieldPhoneNumber.value = this.data.phoneNumber;
        this.fieldPhoneNumber.classList.remove('editable');

        this.fieldTextArea.readOnly = true;
        this.fieldTextArea.value = this.data.interviewNotes;
        this.fieldTextArea.classList.remove('editable');
        this.fieldTextArea.style.height = '24px';
        this.fieldTextArea.style.height = this.fieldTextArea.scrollHeight + 'px';

        this.linkSave.hidden = true;
        this.linkCancel.hidden = true;
        this.linkEdit.hidden = false;
        this.linkDelete.hidden = false;
    }

    save() {
        this.card.classList.remove('edit-card');
        this.fieldFullName.readOnly = true;
        this.data.fullName = this.fieldFullName.value;
        this.fieldFullName.classList.remove('editable');

        this.fieldBirthDate.readOnly = true;
        this.data.birthDate = this.fieldBirthDate.value;
        this.fieldBirthDate.classList.remove('editable');

        this.fieldPhoneNumber.readOnly = true;
        this.data.phoneNumber = this.fieldPhoneNumber.value;
        this.fieldPhoneNumber.classList.remove('editable');

        this.fieldTextArea.readOnly = true;
        this.data.interviewNotes = this.fieldTextArea.value;
        this.fieldTextArea.classList.remove('editable');
        this.fieldTextArea.style.height = '24px';
        this.fieldTextArea.style.height = this.fieldTextArea.scrollHeight + 'px';

        this.linkSave.hidden = true;
        this.linkCancel.hidden = true;
        this.linkEdit.hidden = false;
        this.linkDelete.hidden = false;
    }
}
