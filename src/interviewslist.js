// @flow

import InterviewPlate from './interviewplate';

export default class InterviewsList {
    DB: { [key: string]: any };
    container: { [key: string]: any };

    constructor(DB: { [key: string]: any }, container: { [key: string]: any }) {
        this.DB = DB;
        this.container = container;
    }

    getList() {
        const requestUrl = `${this.DB.URLpath}?apiKey=${this.DB.apiKey}`;
        const requestOptions = {
            method: 'GET',
            mode: 'cors'
        };

        fetch(requestUrl, requestOptions)
            .then(response => response.text())
            .then(text => {
                console.log('Request successful');
                let data = JSON.parse(text);
                let list = [];
                data.forEach(item => {
                    list.push(new InterviewPlate(item, this.DB, this.container, false));
                });
                this.drawList(list);
                const newCard = new InterviewPlate({}, this.DB, this.container, true);
                newCard.render();
            })
            .catch(error => {
                console.log('Request failed', error);
            });
    }

    drawList(list: Array<InterviewPlate>) {
        list.forEach(item => {
            item.render();
        });
    };
}
