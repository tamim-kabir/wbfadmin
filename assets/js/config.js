import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref as dbRef, set, child, get, onValue, push, update, remove,query, orderByChild } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getStorage, ref as stRef, uploadBytes, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

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
var currentUser = auth.currentUser;
//register
if(window.location.pathname == '/wbfadmin/auth-register.html'){///wbfadmin
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
                set(dbRef(db, 'users/' + userCredential.user.uid), userData)
                .then(() => {                
                    window.location.href = window.location.origin + '/wbfadmin/auth-login.html';
                });
            }).catch((e) => {
                alert(e.code, e.message);
            });
        }
    });
} else if(window.location.pathname == '/wbfadmin/auth-login.html') {
    //Login
    document.getElementById('login').addEventListener('click', () => {
        let email = document.getElementById('userEmail').value;
        let password = document.getElementById('userPassword').value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {  
            currentUser =  userCredential.currentUser;        
            window.location.href = window.location.origin + '/wbfadmin/index.html'
        }).catch((e) => {
            if(e.code == 'auth/wrong-password')
                document.getElementById('errorMassage').innerText = 'Wrong Password';
            else if(e.code == 'auth/wrong-password')
                document.getElementById('errorMassage').innerText = 'Wrong Password';
        });
    });
} else if(window.location.pathname == '/wbfadmin/' || window.location.pathname.replace('#','').trim() == '/wbfadmin/index.html') {
    onAuthStateChanged(auth, (user) => {
        if (!user) { 
            window.location.href = window.location.origin + '/wbfadmin/auth-login.html';
        }
        else
            currentUser = user;
    });
    document.getElementById('logout').addEventListener('click', () => {            
        signOut(auth)
        .then(() => {
            window.location.href = window.location.origin + '/wbfadmin/auth-login.html'
        });
    });
}else if(window.location.pathname.replace('#','').trim() == '/wbfadmin/app-settings.html') {
    onAuthStateChanged(auth, (user) => {
        if (!user) { 
            window.location.href = window.location.origin + '/wbfadmin/auth-login.html';
        }
        else{
            currentUser = user;
        }
    });
    document.getElementById('logout').addEventListener('click', () => {            
        signOut(auth)
        .then(() => {
            window.location.href = window.location.origin + '/wbfadmin/auth-login.html'
        });     
        
    });
    interastSettings();
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
                    appSettings();
                    break;
                case 2:
                    
                    break;
                case 3:
                    
                    break;
            }            
        });
    }
    
})();


$('#btnSave').click(() => {
    let modalTitle = $('#modalTitle').text();
    switch(modalTitle){
        case 'Create interast':
            createInterst();
            break;
        case 'Create App Settings':
            createAppSettings()
            break;
        case 2:

            break;
        case 3:

            break;
    }
});
//#region interst begain
function interastSettings() {
    $('#settingsBody').empty();    
    $('#settingsBody').append(
        `<div class="row">
            <div class="col-md-6">
                <div class="card" id="settingsttArea">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-md-6">
                                <h4 id="cardHeaderTitleSettings">Interast Settings</h4>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex justify-content-end ">
                                <a class="btn btn-success" data-bs-toggle="modal" id="addNew" data-bs-target="#modalCrate">Add</a> 
                                </div>                                                
                            </div>
                        </div>                        
                    </div>
                    <div class="card-body ">
                        <table class="table table-hover table-bordered" id="tblSettings">
                            <thead>
                                <tr>
                                    <th>Sl</th>
                                    <th>Name</th>
                                    <th>Created Date</th>
                                    <th class="text-center">Icon</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>                              
            </div>
            <div class="col-md-6">
                <div class="card" id="Analysis">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-md-6">
                                <h4 id="cardHeaderTitleAnalysis">Interast Analysis</h4>
                            </div>
                            <div class="col-md-6">

                            </div>
                        </div>                        
                    </div>
                    <div class="card-body ">
                        <div id="chartArea">
                        </div>
                    </div>
                </div>                              
            </div>
        </div>`
    );
    $('#frm').empty();
    $('#frm').append(
        `<div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <input type="hidden" id="id" />
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="Enter Name">
                </div>
            </div>
            <div class="col-md-12">                                    
            </div>
        </div>
        <div class="row">
            <div class="col-md-12" id="dropy">
                <div class="form-group">
                    <label for="photoUrl">Upload Icon</label>
                    <input asp-for="photoUrl" id="photoUrl" class="dropify" type="file" data-show-errors="true" data-errors-position="outside" data-allowed-file-extensions="jpg jpeg bmp png icon" placeholder=".jpg .jpeg .bmp .png" data-height="100"/>
                </div>
            </div>                                
        </div> 
        <p style="display: none; color: red; text-align:center; margin-top:5px;" id="errorText"> Both fils is required</p>`
    );
    $('#modalTitle').text('Create interast');  
    $('.dropify').dropify();
    loadInterast();
}
function createInterst() {
    let name = $('#modalCrate #name').val(); 
    var icon = $("#photoUrl")[0].files[0];
    if(name == '' || icon == undefined)
    {
        $('#errorText').show();
        setInterval(() => {
            $('#errorText').hide();
        }, 5000);
        return;
    }
    const storage = getStorage(app);
    const storageRef = stRef(storage, 'icon/' + icon.name);

    uploadBytes(storageRef, icon)
    .then((snapshot) => {        
        getDownloadURL(snapshot.ref)
        .then((url) => {
            let interst = {
                name: name,
                iconName: icon.name,
                iconUri: url,
                createdBy: currentUser.uid,
                createdDate: Date(),
            }
            let newPostKey = push(child(dbRef(db), 'interst')).key;
            let updates = {};
            updates['/interst/' + newPostKey] = interst;
            update(dbRef(db), updates)
            .then(() => {
                $('#modalCrate').modal('hide');
                loadInterast();
            })
            .catch((e) => { 
                console.log(e);
            });
        })
        .catch((e) => { 
            console.log(e);
        });
    })
    .catch((e) => { 
        console.log(e);
    });
    
    return;
}
function loadInterast() {
    $('#tblSettings tbody').empty();
    let content = ``, sl = 0;
    onValue(dbRef(db, 'interst'), (snapshot) => {
        snapshot.forEach((snapshot) => {
            let newDate = new Date(snapshot.val().createdDate);
            let format = newDate.getDate() + "/" + newDate.getMonth() + 1 + "/" + newDate.getFullYear() + ' ' + newDate.getHours() + ':' + newDate.getMinutes();
                content += `<tr>
                                <td>${++sl}</td>
                                <td>${snapshot.val().name}</td>
                                <td>${format}</td>
                                <td class="text-center"> <img src="${snapshot.val().iconUri}" alt="${snapshot.val().iconName}" width="20" height="20"></td>
                                <td class="d-flex justify-content-center">
                                    <a href="javascript:void(0)" data-id="${snapshot.key}" class="remove-interast"><i class="las la-trash text-danger font-16" title="Remove Item"></i></a>                                                           
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
$(document).on('click', '.remove-interast', function() {
    let key = $(this).data('id');
    let intRef = dbRef(db, 'interst/' + key);
    remove(intRef)
    .then((e) => {
        loadInterast();
    });    
});
//#endregion 

//#region App settings begains
function appSettings() {
    $('#settingsBody').empty();
    $('#settingsBody').append(
        `<div class="row">
        <div class="col-md-6">
            <div class="card" id="settingsttArea">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-6">
                            <h4 id="cardHeaderTitleSettings">App Settings</h4>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex justify-content-end ">
                            <a class="btn btn-success" data-bs-toggle="modal" id="addNew" data-bs-target="#modalCrate">Add</a> 
                            </div>                                                
                        </div>
                    </div>                        
                </div>
                <div class="card-body" id="appSettingsBody">
                    
                </div>
            </div>                              
        </div>
        <div class="col-md-6">
            <div class="card" id="Analysis">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-6">
                            <h4 id="cardHeaderTitleAnalysis">App Settings Analysis</h4>
                        </div>
                        <div class="col-md-6">                
                        </div>
                    </div>                        
                </div>
                <div class="card-body ">
                    <div id="chartArea">
                    </div>
                </div>
            </div>                              
        </div>
    </div>`
    );
    $('#frm').empty();
    $('#frm').append(
        `<div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <input type="hidden" id="id" />
                    <label for="minDistance">Min Distance</label>
                    <input type="text" class="form-control" id="minDistance" name="naminDistanceme" placeholder="Enter min. Distance" required>
                </div>
                <div class="form-group">
                    <label for="maxDistance">Maximum Distance</label>
                    <input type="text" class="form-control" id="maxDistance" name="maxDistance" placeholder="Enter Max.Distance" required>
                </div>
                <p style="display: none; color: red; text-align:center; margin-top:5px;" id="errorText"> Both fils is required</p>
            </div>                              
        </div>`
    );
    $('#modalTitle').text('Create App Settings');

    loadAppSettings();
}
function createAppSettings() {
    let minDistance = $('#modalCrate #minDistance').val(); 
    let maxDistance = $('#modalCrate #maxDistance').val();
    if(minDistance == '' || maxDistance == '')
    {
        $('#errorText').show();
        setInterval(() => {
            $('#errorText').hide();
        }, 5000);
        return;
    }
    let modal = {
        minimumDistance: minDistance,
        maximumDistance: maxDistance,
        createdDate: Date()
    }
    let newPostKey = push(child(dbRef(db), 'appSettings')).key;
    let updates = {};
    updates['/appSettings/' + newPostKey] = modal;
    update(dbRef(db), updates)
        .then(() => {
            $('#modalCrate').modal('hide');
            loadAppSettings();
        })
        .catch((e) => { 
            console.log(e);
        });
}
function loadAppSettings() {
    $('#appSettingsBody').empty();
    let content = ``;
    onValue(dbRef(db, 'appSettings'), (snapshot) => {
        snapshot.forEach((snapshot) => {
            content += `<div class="row d-flex justify-content-around">                                            
                            <div class="col-md-5">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-9">                                                                                                                                
                                                <h6 class="my-1 font-12 fw-bold mt-3">Min Distance</h3>                                            
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <div class="d-flex justify-content-center align-items-center thumb-md bg-light-alt rounded-circle mx-auto">
                                                    <i class="font-12 align-self-center text-muted">${snapshot.val().minimumDistance} KM</i>                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-9">                                                                                                                                
                                                <h6 class="my-1 font-12 fw-bold mt-3">Max Distance</h3>                                            
                                            </div>
                                            <div class="col-3 align-self-center">
                                                <div class="d-flex justify-content-center align-items-center thumb-md bg-light-alt rounded-circle mx-auto">
                                                    <i class="font-12 align-self-center text-muted" >${snapshot.val().maximumDistance} KM</i>                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="d-flex justify-content-center align-items-center thumb-md bg-light-alt rounded-circle mx-auto">
                                            <a href="javascript:void(0)" data-id="${snapshot.key}" class="remove-appSettings"><i class="align-self-center las la-trash text-danger font-24" ></i></a>                                                   
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> <hr/>`
        });
            $('#appSettingsBody').append(content);
        }, 
        {
            onlyOnce: true,
        });
}
$(document).on('click', '.remove-appSettings', function() {
    let key = $(this).data('id');
    let intRef = dbRef(db, 'appSettings/' + key);
    remove(intRef)
    .then((e) => {
        loadAppSettings();
    });    
});
//#endregion

$(document).ready(() => {
    //interastSettings()
    //appSettings()
})
