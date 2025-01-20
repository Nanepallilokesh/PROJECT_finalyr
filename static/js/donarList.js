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

                    for(i=0 ; i<username.length ; i++){
                        tempUserName = tempUserName+'~'+username[i];
                        tempBloodGroup = tempBloodGroup+'~'+bloodgroup[i];
                        tempCity = tempCity+'~'+city[i];
                        tempEmail = tempEmail+'~'+email[i];
                    }

                    //local storage for further use-->start
                    data = {
                        userName : tempUserName,
                        bloodGroup : tempBloodGroup,
                        city : tempCity,
                        email : tempEmail
                    }
                    localStorage.setItem(seekername, JSON.stringify(data));

                    //local storage for further use-->END

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

function enablefetchbuttons(){
    if(document.getElementById('seekerRequest').value =='newRequest'){
        document.getElementById("fetchDonartDeatails").style.display='block';
        document.getElementById("fetchSeekerRequestDeatails").style.display='none';
        document.getElementById("cityBloodFields").style.display='block';
        document.getElementById("cityBloodFieldsReplace").style.display='none';
    }
    else if(document.getElementById('seekerRequest').value=='alreadyRequested'){
        document.getElementById("fetchDonartDeatails").style.display='none';
        document.getElementById("fetchSeekerRequestDeatails").style.display='block';
        document.getElementById("cityBloodFields").style.display='none';
        document.getElementById("cityBloodFieldsReplace").style.display='block';
        
    }
    else{
        document.getElementById("fetchDonartDeatails").style.display='none';
        document.getElementById("fetchSeekerRequestDeatails").style.display='none';
    }
}
