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
    if(document.getElementById('seekerRequest').value == ''){
        alert('Please fill the seekerRequest details');
        return false;
    }
    if(document.forms[0].seekerRequest.value=='New Request'){
        if(document.getElementById('city').value == ''){
            alert('Please fill the city details');
            return false;
        }
        if(document.getElementById('bloodgroup').value == ''){
            alert('Please fill the Bloodgroup details');
            return false;
        }
    }
    return true
}


function enablePoints(){
    if(document.forms[0].donarName.value=='' || document.forms[0].donorId.value==''){
        document.getElementById('point_label').style.display='none';
        document.getElementById('points').style.display='none';
    }
    else{
        document.getElementById('point_label').style.display='block';
        document.getElementById('points').style.display='block';
    }
    return true;
}
function fetchCoins(){
    var userId = document.forms[0].donorId.value;
    var userName = document.forms[0].donarName.value;

    document.getElementById('overlay-loader').style.display = 'block';

    fetch('/fetchCoin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId,userName}),
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        document.forms[0].points.value=data.newPoints;
        document.forms[0].points.disabled=true;
        document.forms[0].points.readOnly='true';

        document.getElementById('fetchDonartCoins').className='btnDisable';
        document.getElementById('fetchDonartCoins').disabled='true';
        document.getElementById('fetchDonartCoins').readOnly='true';

        document.getElementById('donorId').className='fieldinput';
        document.getElementById('donorId').disabled='true';
        document.getElementById('donorId').readOnly='true';
        
        document.getElementById('donarName').className='fieldinput';
        document.getElementById('donarName').disabled='true';
        document.getElementById('donarName').readOnly='true';
    })
    .catch((error) => {
        console.error("Error sending email to " + userName[i], error);
        // failed.push(email[i]); // If there’s an error, add to the failed list
        document.getElementById('overlay-loader').style.display = 'none';
    })
    .finally(() => {
        document.getElementById('overlay-loader').style.display = 'none';
    });
}

function fetchUserHistoryData(){
    var userId = document.getElementById('userId').value;
    var userName = document.getElementById('userName').value;

    document.getElementById('overlay-loader').style.display = 'flex'; // overlay loading screen
            // const params = {
            //     param1: p1,
            //     param2: p2
            // };

            // Call the Flask API with parameters
            fetch('/fetchUserHistoryDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId,userName}),
            })
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                if(data.userName){
                    document.getElementById('fetchUserHistory').className='btnDisable';
                    document.getElementById('fetchUserHistory').disabled='true';
                    document.getElementById('fetchUserHistory').readOnly='true';

                    document.getElementById('userId').className='fieldinput';
                    document.getElementById('userId').disabled='true';
                    document.getElementById('userId').readOnly='true';

                    document.getElementById('userName').className='fieldinput';
                    document.getElementById('userName').disabled='true';
                    document.getElementById('userName').readOnly='true';


                    document.getElementById('fetchedDonarsHistory').style.display = 'block';
                
                    // Access the lists from the response
                    const username = data.userName;
                    const bloodgroup = data.bloodGroup;
                    const city = data.city;
                    const email = data.email;
					const date = data.date;

                    // Get the table body element
                    const tableBody = document.querySelector("#donorHistoryTable tbody");

                    // Clear the table body first
                    tableBody.innerHTML = '';

                    // Find the maximum length of the lists (assuming all lists are of equal length)
                    const maxLength = Math.max(username.length, bloodgroup.length, city.length,email.length);

                    // Loop through the lists and create table rows
                    for (let i = 0; i < maxLength; i++) {
                        const row = document.createElement('tr');

                        // Create table cells for each list
                        const cell1 = document.createElement('td');
                        cell1.textContent = username[i] || '';  // Use empty string if item doesn't exist
                        row.appendChild(cell1);

                        const cell2 = document.createElement('td');
                        cell2.textContent = bloodgroup[i] || '';
                        row.appendChild(cell2);

                        const cell3 = document.createElement('td');
                        cell3.textContent = city[i] || '';
                        row.appendChild(cell3);

                        const cell4 = document.createElement('td');
                        cell4.textContent = email[i] || '';
                        row.appendChild(cell4);
						
						const cell5 = document.createElement('td');
                        cell5.textContent = date[i] || '';
                        row.appendChild(cell5);

                        // Append the row to the table body
                        tableBody.appendChild(row);
                    }
                }
                document.getElementById('overlay-loader').style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);

                document.getElementById('overlay-loader').style.display = 'none';
            });
    return true;
}