// @flow

import './style.styl';

export default (data: { [key: string]: any }) => {
    return `<form class="card" id="${data.id}">

            <label  class="label">Full name</label>
            <input  type="text" class="input" placeholder="Input full name"
                    id="fullName_${data.id}"
                    value="${data.fullName}" 
                    ${data.readonly}>
                    
            <label  class="label">Birth date</label>
            <input  type="date" class="input" placeholder="Select date"
                    id="birthDate_${data.id}"
                    value="${data.birthDate}" 
                    ${data.readonly}>

            <label  class="label">Phone number</label>
            <input  type="tel" class="input" placeholder="Input phone number"
                    id="phoneNumber_${data.id}"
                    value="${data.phoneNumber}" 
                    ${data.readonly}>
            
            <label    class="label">Interview</label>
            <textarea class="textarea" placeholder="Input interview text"
                      id="interviewNotes_${data.id}" 
                      ${data.readonly}>${data.interviewNotes}</textarea>
            
            <p class="icon-plate">
                <a class="link edit"    id="linkEdit_${data.id}"     href="#">✎</a>
                <a class="link delete"  id="linkDelete_${data.id}"   href="#">⊗</a>
                <a class="link save"    id="linkSave_${data.id}"     href="#" hidden>✔</a>
                <a class="link cancel"  id="linkCancel_${data.id}"   href="#" hidden>⊖</a>
                <a class="link add"     id="linkAdd_${data.id}"      href="#" hidden>⊕</a>
            </p>
        </form>`;
}