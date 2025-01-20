function openHome(path) {
    document.getElementById('homepageframe').src = '/' + path;
}

function validateLogin() {
    if (document.forms[0].userType.value == '') {
        alert('please select the user Type');
    }
    else {
        parent.document.getElementById('MainHeaderDiv').style.display = "none";
        parent.document.getElementById('mainFooterDiv').style.display = "none";
    }

}

function openHospitalHome(path) {
    document.getElementById('hospitalHomePage').src = '/' + path;
}

function checkForError() {
    if (document.getElementsByName('errorMsg')[0].value == "failed") {
        alert('Login Failed');
        parent.document.getElementById('MainHeaderDiv').style.display = "block";
        parent.document.getElementById('mainFooterDiv').style.display = "block";
    }
}

function validateSeekerFetchbtn() {
    if (document.getElementById('seekerName').value == '' ){
        alert('Please fill the seekerName details');
        return false;
    }
    else if(document.getElementById('city').value == ''){
        alert('Please fill the city details');
        return false;
    }
    else if(document.getElementById('bloodgroup').value == ''){
        alert('Please fill the Bloodgroup details');
        return false;
    }
    else if(document.getElementById('seekerRequest').value == ''){
        alert('Please fill the seekerRequest details');
        return false;
    }
    else{
        return true;
    }
}