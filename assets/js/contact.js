class Contact {
    constructor(name, gender, phone, email, subject, message) {
        this.name = name;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }
}

class UI {
    static displayContact() {
        const Contact = Store.getContact();
        Contact.forEach(contact => UI.addContactToList(contact));
    }

    static addContactToList(contact) {
        const list = document.querySelector('#contact-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${contact.name}</td>
        <td class="text-center"><img src="images/${contact.gender}.png" alt="${contact.gender} icon"></td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>${contact.subject}</td>
        <td>${contact.message}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete"> X </a></td>
        `;
        list.appendChild(row);
    }

    static ValidateEmail(inputText) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (inputText.match(mailformat)) {
            return true;
        } else {
            return false;
        }
    }

    static deleteContact(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#my-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    static clearFields() {
        document.querySelector('#name').value = "";
        document.querySelector('#gender').value = "";
        document.querySelector('#phone').value = "";
        document.querySelector('#email').value = "";
        document.querySelector('#subject').value = "";
        document.querySelector('#message').value = "";
    }

}

class Store {
    static getContact() {
        let Contact;
        if (localStorage.getItem("Contact") === null) {
            Contact = [];
        } else {
            Contact = JSON.parse(localStorage.getItem("Contact"));
        }

        return Contact;
    }

    static addContact(contact) {
        const Contact = Store.getContact();
        Contact.push(contact);
        localStorage.setItem("Contact", JSON.stringify(Contact));
    }

    static removeContact(message) {
        const Contact = Store.getContact();

        Contact.forEach((contact, index) => {
            if (contact.message === message) {
                Contact.splice(index, 1);
            }
        });

        localStorage.setItem("Contact", JSON.stringify(Contact));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayContact);

document.querySelector('#my-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const gender = document.querySelector('#gender').value;
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;
    const subject = document.querySelector('#subject').value;
    const message = document.querySelector('#message').value;

    if (name === "" || phone === "" || email === "" || subject === "" || message === "") {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {

        if (gender === "Male" || gender === "Female" || gender === "male" || gender === "female") {
            if (UI.ValidateEmail(email)) {
                const contact = new Contact(name, gender, phone, email, subject, message);
                UI.addContactToList(contact);
                Store.addContact(contact);
                UI.showAlert('Contact Added', 'success');
                UI.clearFields();

            } else {
                UI.showAlert('Invalid email address', 'danger');
            }


        } else {
            UI.showAlert('Please fill gender => "Male" or "Female"', 'danger');
        }
    }
});

document.querySelector("#contact-list").addEventListener("click", e => {
    UI.deleteContact(e.target);
    Store.removeContact(
        e.target.parentElement.previousElementSibling.textContent
    );
    UI.showAlert("contact Removed", "success");
});
