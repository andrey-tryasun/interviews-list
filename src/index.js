// @flow

import InterviewsList from './interviewslist';

window.addEventListener('load', () => {

    const DB = {
        database: 'interviewsdb',
        collection: 'participants',
        apiKey: 'oB9FGcNB_hId_LCzanzcUjQNb9sRoF3l',
        URLpath: ''
    };

    DB.URLpath = `https://api.mlab.com/api/1/databases/${DB.database}/collections/${DB.collection}`;


    let list = document.createElement('div');
    if (document.body) {
        document.body.appendChild(list);
    }
    list.className = 'container-list';

    let newCard = document.createElement('div');
    if (document.body) {
        document.body.appendChild(newCard);
    }
    newCard.className = 'container-new-card';

    const container = {
        list: list,
        newCard: newCard
    };

    const interviewsList = new InterviewsList(DB, container);
    interviewsList.getList();

});