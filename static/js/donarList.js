function sendAllEmails() {
    const successful = [];
    const failed = [];
    let completedRequests = 0;

    // Split the values into arrays
    userName = document.forms[0].userNameList.value.split('~');
    bloodGroup = document.forms[0].bloodGroupList.value.split('~');
    city = document.forms[0].cityList.value.split('~');
    email = document.forms[0].emailList.value.split('~');
    seekerName = document.forms[0].seekerName.value;

    document.getElementById('overlay-loader').style.display = 'flex';

    // Iterate through each donor record
    for (let i = 0; i < userName.length; i++) {
        const data = {
            to_email: email[i], // Donor email
            subject: 'Message from BLOOD DONATION',
            body: `
                Dear ${userName[i]},<br>

                A new seeker requires your blood donation assistance. Below are the details:<br>

                Seeker Name: ${seekerName}<br>
                Seeker Blood Group: ${bloodGroup[i]}<br>
                Seeker City: ${city[i]}<br>

                Your timely help can save a life. Please consider donating.<br>

                Best Regards,<br>
                Blood Donation System
            `,
        };

        // Send the email via AJAX (POST request)
        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                successful.push(email[i]); // Add successful email to the list
            } else {
                failed.push(email[i]); // Add failed email to the list
            }

            document.getElementById('overlay-loader').style.display = 'none';
        })
        .catch((error) => {
            console.error("Error sending email to " + userName[i], error);
            // failed.push(email[i]); // If there’s an error, add to the failed list

            document.getElementById('overlay-loader').style.display = 'none';
        })
        .finally(() => {
            completedRequests++;
            // Check if all requests are complete
            if (completedRequests == userName.length) {
                if (failed.length == 0) {
                    alert("Successfully email sent to all the Donars");
                    document.getElementById('sendMailbtn').className='btnDisable';
                    document.getElementById('sendMailbtn').disabled='true';
                    document.getElementById('sendMailbtn').readOnly='true';
                    storeRequestedDetails(userName,bloodGroup,city,email,seekerName);
                } else {
                    alert("Failed to send email to the following email IDs: " + failed.join(', '));
                }

            }

            document.getElementById('overlay-loader').style.display = 'none';
        });
    }
}
function sendEmailsToRemaining() {
    const successful = [];
    const failed = [];
    const userName = [];
    const email = [];
    let completedRequests = 0;
    var donarUserName = '';
    var donarBloodGroup = '';
    var donarCity = '';
    var donarEmail = '';
    const seekerName = document.forms[0].seekerName.value;
    document.getElementById('overlay-loader').style.display = 'block';

    // Get the table element
    const table = document.getElementById("donorDataTable1");

    // Access rows from the tbody
    const rows = table.tBodies[0].rows;

    // Loop through the rows
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if(!document.getElementsByName('checkbox'+i)[0].checked){
            userName.push(row.cells[1].textContent); // Username cell
            email.push(row.cells[4].textContent); // Email cell
        }
        if(document.getElementsByName('checkbox'+i)[0].checked){
            donarUserName = row.cells[1].textContent;
            donarBloodGroup = row.cells[2].textContent;
            donarCity = row.cells[3].textContent;
            donarEmail = row.cells[4].textContent;
        }
    }

    console.log('user Names:',userName);
    console.log('emails:',email);
    
    // Iterate through each donor record
    for (let i = 0; i < userName.length; i++) {
        const data = {
            to_email: email[i], // Donor email
            subject: 'Message from BLOOD DONATION',
            body: `
                Dear ${userName[i]},<br>

                Thank you.. One of the donar arrrived to hospital for donation.<br>

                Best Regards,<br>
                Blood Donation System
            `,
        };

        // Send the email via AJAX (POST request)
        fetch('/sendReturnEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                successful.push(email[i]); // Add successful email to the list
            } else {
                failed.push(email[i]); // Add failed email to the list
            }

            document.getElementById('overlay-loader').style.display = 'none';
        })
        .catch((error) => {
            console.error("Error sending email to " + userName[i], error);
            // failed.push(email[i]); // If there’s an error, add to the failed list

            document.getElementById('overlay-loader').style.display = 'none';
        })
        .finally(() => {
            completedRequests++;
            // Check if all requests are complete
            if (completedRequests == userName.length) {
                if (failed.length == 0) {
                    alert("Successfully email sent to all the Donars");
                    document.getElementById('sendReturnMailbtn').className='btnDisable';
                    document.getElementById('sendReturnMailbtn').disabled='true';
                    document.getElementById('sendReturnMailbtn').readOnly='true';
                    updateRequestedDetails(seekerName);
                    updateDonarPoints(donarUserName,donarBloodGroup,donarCity,donarEmail);
                } else {
                    alert("Failed to send email to the following email IDs: " + failed.join(', '));
                }

            }

            document.getElementById('overlay-loader').style.display = 'none';
        });
    }
}



// function donarList_onload(){
//     alert('hello donars');
//     let cleaned = document.forms[0].userNameList.value.replace(/[\[\]',]/g, '');
//     document.forms[0].userNameList.value = cleaned.replace(/\s+/g, '~');

//     let cleaned1 = document.forms[0].bloodGroupList.value.replace(/[\[\]',]/g, '');
//     document.forms[0].bloodGroupList.value = cleaned1.replace(/\s+/g, '~');

//     let cleaned2 = document.forms[0].cityList.value.replace(/[\[\]',]/g, '');
//     document.forms[0].cityList.value = cleaned2.replace(/\s+/g, '~');

//     let cleaned3 = document.forms[0].emailList.value.replace(/[\[\]',]/g, '');
//     document.forms[0].emailList.value = cleaned3.replace(/\s+/g, '~');
// }

function fetchDonors(){
    var seekername = document.getElementById('seekerName').value;
    var bloodgroup = document.getElementById('bloodgroup').value;
    var city = document.getElementById('city').value;

    document.getElementById('overlay-loader').style.display = 'flex'; // overlay loading screen
            // const params = {
            //     param1: p1,
            //     param2: p2
            // };

            // Call the Flask API with parameters
            fetch('/Donar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({seekername,bloodgroup,city}),
            })
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                if(data.username){
                    document.getElementById('fetchedDonars').style.display='block';
                    document.getElementById('fetchedRequestedDonars').style.display='none';

                    document.getElementById('fetchDonartDeatails').className='btnDisable';
                    document.getElementById('fetchDonartDeatails').disabled='true';
                    document.getElementById('fetchDonartDeatails').readOnly='true';

                    document.getElementById('seekerName').className='btnDisable';
                    document.getElementById('seekerName').disabled='true';
                    document.getElementById('seekerName').readOnly='true';

                    document.getElementById('city').className='btnDisable';
                    document.getElementById('city').disabled='true';
                    document.getElementById('city').readOnly='true';

                    document.getElementById('bloodgroup').className='btnDisable';
                    document.getElementById('bloodgroup').disabled='true';
                    document.getElementById('bloodgroup').readOnly='true';

                    document.getElementById('seekerRequest').className='btnDisable';
                    document.getElementById('seekerRequest').disabled='true';
                    document.getElementById('seekerRequest').readOnly='true';
                
                    // Access the lists from the response
                    const username = data.username;
                    const bloodgroup = data.bloodgroup;
                    const city = data.city;
                    const email = data.email;
                    
                    var tempUserName = username[0];
                    var tempBloodGroup = bloodgroup[0];
                    var tempCity = city[0];
                    var tempEmail = email[0];

                    for(i=1 ; i<username.length ; i++){
                        tempUserName = tempUserName+'~'+username[i];
                        tempBloodGroup = tempBloodGroup+'~'+bloodgroup[i];
                        tempCity = tempCity+'~'+city[i];
                        tempEmail = tempEmail+'~'+email[i];
                    }

                    // //local storage for further use-->start
                    // data = {
                    //     userName : tempUserName,
                    //     bloodGroup : tempBloodGroup,
                    //     city : tempCity,
                    //     email : tempEmail
                    // }
                    // localStorage.setItem(seekername, JSON.stringify(data));

                    // //local storage for further use-->END

                    document.getElementsByName('userNameList')[0].value=tempUserName;
                    document.getElementsByName('bloodGroupList')[0].value=tempBloodGroup;
                    document.getElementsByName('cityList')[0].value=tempCity;
                    document.getElementsByName('emailList')[0].value=tempEmail;

                    // Get the table body element
                    const tableBody = document.querySelector("#donorDataTable tbody");

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

function fetchRequestedDonors(){
    var seekername = document.getElementById('seekerName').value;
    var requestType = document.forms[0].seekerRequest.value;

    document.getElementById('overlay-loader').style.display = 'flex'; // overlay loading screen
            // const params = {
            //     param1: p1,
            //     param2: p2
            // };

            // Call the Flask API with parameters
            fetch('/requestedDonar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({seekername}),
            })
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                if(data.username){
                    document.getElementById('fetchedDonars').style.display='none';
                    document.getElementById('fetchedRequestedDonars').style.display='block';

                    document.getElementById('fetchSeekerRequestDeatails').className='btnDisable';
                    document.getElementById('fetchSeekerRequestDeatails').disabled='true';
                    document.getElementById('fetchSeekerRequestDeatails').readOnly='true';

                    document.getElementById('seekerName').className='btnDisable';
                    document.getElementById('seekerName').disabled='true';
                    document.getElementById('seekerName').readOnly='true';

                    document.getElementById('seekerRequest').className='btnDisable';
                    document.getElementById('seekerRequest').disabled='true';
                    document.getElementById('seekerRequest').readOnly='true';
                
                    // Access the lists from the response
                    const username = data.username;
                    const bloodgroup = data.bloodgroup;
                    const city = data.city;
                    const email = data.email;
                    
                    var tempUserName = username[0];
                    var tempBloodGroup = bloodgroup[0];
                    var tempCity = city[0];
                    var tempEmail = email[0];

                    for(i=1 ; i<username.length ; i++){
                        tempUserName = tempUserName+'~'+username[i];
                        tempBloodGroup = tempBloodGroup+'~'+bloodgroup[i];
                        tempCity = tempCity+'~'+city[i];
                        tempEmail = tempEmail+'~'+email[i];
                    }

                    // //local storage for further use-->start
                    // data = {
                    //     userName : tempUserName,
                    //     bloodGroup : tempBloodGroup,
                    //     city : tempCity,
                    //     email : tempEmail
                    // }
                    // localStorage.setItem(seekername, JSON.stringify(data));

                    // //local storage for further use-->END

                    document.getElementsByName('userNameList')[0].value=tempUserName;
                    document.getElementsByName('bloodGroupList')[0].value=tempBloodGroup;
                    document.getElementsByName('cityList')[0].value=tempCity;
                    document.getElementsByName('emailList')[0].value=tempEmail;

                    // Get the table body element
                    const tableBody = document.querySelector("#donorDataTable1 tbody");

                    // Clear the table body first
                    tableBody.innerHTML = '';

                    // Find the maximum length of the lists (assuming all lists are of equal length)
                    const maxLength = Math.max(username.length, bloodgroup.length, city.length,email.length);
                    let allEmails = [];
                    // Loop through the lists and create table rows
                    for (let i = 0; i < maxLength; i++) {
                        const row = document.createElement('tr');

                        // Create table cells for each list
                        // Add a new column for the checkbox
                        const checkboxCell = document.createElement('td');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox'; // Set input type to checkbox
                        checkbox.setAttribute('name', `checkbox${i}`); 
                        // checkbox.value = username[i] || ''; // Optional: Set value to identify the row
                        // Add an event listener to allow only one checkbox to be selected
                        checkbox.addEventListener('change', (event) => {
                            if (event.target.checked) {
                                const emailCell = row.querySelector('td:nth-child(4)'); // Assuming email is the 4th column
                                
                                const emailValue = emailCell.textContent; // Get the email text
                                console.log("Email of the selected row: " + emailValue);
                                // Uncheck all other checkboxes in the table
                                const allCheckboxes = tableBody.querySelectorAll('input[type="checkbox"]');
                                allCheckboxes.forEach((cb) => {
                                    if (cb !== checkbox) {
                                        cb.checked = false;
                                    }
                                });
                                const emailsToSend = allEmails.filter((email) => email !== emailValue);
                                //sendEmailsToRemaining(emailsToSend);
                            }
                        });

                        checkboxCell.appendChild(checkbox);
                        row.appendChild(checkboxCell);

                        const cell1 = document.createElement('td');
                        cell1.textContent = username[i] || '';  // Use empty string if item doesn't exist
                        cell1.setAttribute('name', `username${i}`); 
                        row.appendChild(cell1);

                        const cell2 = document.createElement('td');
                        cell2.textContent = bloodgroup[i] || '';
                        cell2.setAttribute('name', `bloodgroup${i}`); // Add name attribute with sequence
                        row.appendChild(cell2);

                        const cell3 = document.createElement('td');
                        cell3.textContent = city[i] || '';
                        cell3.setAttribute('name', `city${i}`); // Add name attribute with sequence
                        row.appendChild(cell3);

                        const cell4 = document.createElement('td');
                        cell4.textContent = email[i] || '';
                        cell4.setAttribute('name', `email${i}`); // Add name attribute with sequence
                        row.appendChild(cell4);
                        allEmails.push(email[i]);

                        
                        
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

function enablefetchbuttons(){
    if(document.getElementById('seekerRequest').value =='newRequest'){
        document.getElementById("fetchDonartDeatails").style.display='block';
        document.getElementById("fetchSeekerRequestDeatails").style.display='none';
        document.getElementById("newRequestDiv").style.display='block';
        document.getElementById("requestDetailsDiv").style.display='none';
    }
    else if(document.getElementById('seekerRequest').value=='alreadyRequested'){
        document.getElementById("fetchDonartDeatails").style.display='none';
        document.getElementById("fetchSeekerRequestDeatails").style.display='block';
        document.getElementById("newRequestDiv").style.display='none';
        document.getElementById("requestDetailsDiv").style.display='block';
        
    }
    else{
        document.getElementById("fetchDonartDeatails").style.display='none';
        document.getElementById("fetchSeekerRequestDeatails").style.display='none';
    }
}

function storeRequestedDetails(userName,bloodGroup,city,email,seekerName){

    fetch('/storeRequestDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName,bloodGroup,city,email,seekerName}),
    })
    .then((response) => {
        if (response.ok) {
            alert('successfull Stored Data');
        } else {
            alert('Failed to Store Data');
        }
    })
    .catch((error) => {
        console.error("Error sending email to " + error);
        // failed.push(email[i]); // If there’s an error, add to the failed list

       // document.getElementById('overlay-loader').style.display = 'none';
    })
    .finally(() => {
        //document.getElementById('overlay-loader').style.display = 'none';
    });
}

function updateRequestedDetails(seekerName){
    fetch('/updateRequestRecord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({seekerName}),
    })
    .then((response) => {
        if (response.ok) {
            alert('Records Updated successfully');
        } else {
            alert('Failed to update records'); // Add failed email to the list
        }

        document.getElementById('overlay-loader').style.display = 'none';
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

function updateDonarPoints(userName,bloodGroup,city,email){
    fetch('/updateDonarPoints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName,bloodGroup,city,email}),
    })
    .then((response) => {
        if (response.ok) {
            alert('Records Updated successfully');
        } else {
            alert('Failed to update records'); // Add failed email to the list
        }
        document.getElementById('overlay-loader').style.display = 'none';
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