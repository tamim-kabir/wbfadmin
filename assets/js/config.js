import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set, child, get, onValue, push, update, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdIrcAhBYZ2rPP_bmx3ZGnONQ-6o8BbxM",
    authDomain: "admin-31619.firebaseapp.com",
    databaseURL: "https://admin-31619-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "admin-31619",
    storageBucket: "admin-31619.appspot.com",
    messagingSenderId: "481441719682",
    appId: "1:481441719682:web:eec79da35d9702cdb79b9b",
    measurementId: "G-MG2M0PKZMC"
};

var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var db = getDatabase(app);
var currentUser = [];
//register
if(window.location.pathname == '/WbfAdmin/auth-register.html'){///WbfAdmin
    var passValidate = false;
    document.getElementById('userPassword').addEventListener('keyup', (e) => {
        e.preventDefault();
        let value = document.getElementById('userPassword').value;
        if(value == ""){
            document.getElementById('userPassLength').innerText = '';
            return
        }
        if(value.length >= 6){
            document.getElementById('userPassLength').innerText = '';
        }
        else if(value.length >= 3){
            document.getElementById('userPassLength').innerText = 'Password length should be grater then 6';
        }
    });

    document.getElementById('confirmPassword').addEventListener('keyup', (e) => {
        e.preventDefault();
        let confirmPassValue = document.getElementById('confirmPassword').value;
        let password = document.getElementById('userPassword').value;
        if(confirmPassValue == ""){
            document.getElementById('conPassNotMatch').innerText = '';
            return
        }
        if(confirmPassValue.length >= 6 && confirmPassValue == password) {
            document.getElementById('conPassNotMatch').innerText = '';
            passValidate = true;
        }
        else {
            document.getElementById('conPassNotMatch').innerText = "Not Match";
        }
    });
    document.getElementById('register').addEventListener('click', () => {
        if(passValidate) {
            let name = document.getElementById('userName').value;
            let email = document.getElementById('userEmail').value;
            let phone = document.getElementById('mobileNo').value;
            let password = document.getElementById('userPassword').value;
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {          
                let userData = {
                    email: email,
                    name: name,
                    phone: phone,
                    userRole: ''           
                };
                set(ref(db, 'users/' + userCredential.user.uid), userData)
                .then(() => {                
                    window.location.href = window.location.origin + '/WbfAdmin/auth-login.html';
                });
            }).catch((e) => {
                alert(e.code, e.message);
            });
        }
    });
} else if(window.location.pathname == '/WbfAdmin/auth-login.html') {
    //Login
    document.getElementById('login').addEventListener('click', () => {
        let email = document.getElementById('userEmail').value;
        let password = document.getElementById('userPassword').value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {  
            currentUser =  userCredential.currentUser;        
            window.location.href = window.location.origin + '/WbfAdmin/index.html'
        }).catch((e) => {
            if(e.code == 'auth/wrong-password')
                document.getElementById('errorMassage').innerHTML = 'Wrong Password';
            else if(e.code == 'auth/wrong-password')
                document.getElementById('errorMassage').innerHTML = 'Wrong Password';
        });
    });
} else if(window.location.pathname == '/WbfAdmin/' || window.location.pathname.replace('#','').trim() == '/WbfAdmin/index.html') {
    onAuthStateChanged(auth, (user) => {
        if (!user) { 
            window.location.href = window.location.origin + '/WbfAdmin/auth-login.html';
        }
        else
            currentUser = user;
    });
    document.getElementById('logout').addEventListener('click', () => {            
        signOut(auth)
        .then(() => {
            window.location.href = window.location.origin + '/WbfAdmin/auth-login.html'
        });
    });
}else if(window.location.pathname.replace('#','').trim() == '/WbfAdmin/app-settings.html') {
    onAuthStateChanged(auth, (user) => {
        if (!user) { 
            window.location.href = window.location.origin + '/WbfAdmin/auth-login.html';
        }
        else
            currentUser = user;
    });
    document.getElementById('logout').addEventListener('click', () => {            
        signOut(auth)
        .then(() => {
            window.location.href = window.location.origin + '/WbfAdmin/auth-login.html'
        });     
        
    });
}
//Settings
(function() {
    let classes = document.getElementsByClassName('clickAbleItem');
    for(let i = 0; i < classes.length; i++){
        classes[i].addEventListener('click', () => {
            document.querySelector('.clickAbleItem.active').classList.remove("active")
            classes[i].classList.add('active');
            switch(i){
                case 0:
                    interastSettings();
                    break;
                case 1:
                    
                    break;
                case 2:
                    
                    break;
                case 3:
                    
                    break;
            }            
        });
    }
})();
function interastSettings() {
    $('#modalTitle').text('Create interast');    
    loadInterast(); 
}
$('#btnSave').click(() => {
    let modalTitle = $('#modalTitle').text();
    switch(modalTitle){
        case 'Create interast':
            createInterst();
            break;
        case 1:

            break;
        case 2:

            break;
        case 3:

            break;
    }
});
function createInterst() {
    let name = $('#modalCrate #name').val(); 
    let currentUid = currentUser.uid;  
    let interst = {
        name: name,
        createdBy: currentUid,
        createdDate: new Date(), 
    }
    const newPostKey = push(child(ref(db), 'posts')).key;

    const updates = {};
    updates['/interst/' + newPostKey] = interst;

    update(ref(db), updates)
        .then(() => {
            $('#modalCrate').modal('hide');
            loadInterast();
        });
    return;
}
function loadInterast() {
    $('#tblSettings tbody').empty();
    let content = ``, sl = 0;
    let dbRef = ref(db, 'interst');
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((snapshot) => {
            let newDate = new Date(snapshot.val().createdDate);
            let format = newDate.getDate() + "/" + newDate.getMonth() + 1 + "/" + newDate.getFullYear() + ' ' + newDate.getHours() + ':' + newDate.getMinutes();
                content += `<tr>
                                <td>${++sl}</td>
                                <td>${snapshot.val().name}</td>
                                <td>${format}</td>
                                <td class="d-flex justify-content-center">
                                    <a href="javascript:void(0)" data-id="${snapshot.key}" class="remove"><i class="las la-trash text-danger font-16"></i></a>
                                    <a href="javascript:void(0)" data-id="${snapshot.key}" class="pl-2 edit"><i class="las la-pen text-secondary font-16"></i></a>                                                            
                                </td>
                            </tr>`
            });
            $('#tblSettings tbody').append(content);
        }, 
        {
            onlyOnce: true,
        });
    
    return;
}
$(document).ready(() => {
    interastSettings();
})