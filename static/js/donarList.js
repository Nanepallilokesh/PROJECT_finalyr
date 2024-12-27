function sendAllEmails(userNameList, bloodGroupList, cityList, emailList, seekerName) {
    const successful = [];
    const failed = [];
    let completedRequests = 0;

    // Split the values into arrays
    userName = userNameList.value.split('~');
    bloodGroup = bloodGroupList.value.split('~');
    city = cityList.value.split('~');
    email = emailList.value.split('~');


    // Iterate through each donor record
    for (let i = 0; i < userName.length; i++) {
        const data = {
            to_email: email[i], // Donor email
            subject: 'Message from BLOOD DONATION',
            body: `
                Dear ${userName[i]},<br>

                A new seeker requires your blood donation assistance. Below are the details:<br>

                Seeker Name: ${seekerName.value}<br>
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
        })
        .catch((error) => {
            console.error("Error sending email to " + userName[i], error);
            // failed.push(email[i]); // If there’s an error, add to the failed list
        })
        .finally(() => {
            completedRequests++;
            // Check if all requests are complete
            if (completedRequests == userName.length) {
                if (failed.length == 0) {
                    alert("Successfully email sent to all the Donars");
                } else {
                    alert("Failed to send email to the following email IDs: " + failed.join(', '));
                }

            }
        });
    }
}


function donarList_onload(){
    alert('hello donars');
    let cleaned = document.forms[0].userNameList.value.replace(/[\[\]',]/g, '');
    document.forms[0].userNameList.value = cleaned.replace(/\s+/g, '~');

    let cleaned1 = document.forms[0].bloodGroupList.value.replace(/[\[\]',]/g, '');
    document.forms[0].bloodGroupList.value = cleaned1.replace(/\s+/g, '~');

    let cleaned2 = document.forms[0].cityList.value.replace(/[\[\]',]/g, '');
    document.forms[0].cityList.value = cleaned2.replace(/\s+/g, '~');

    let cleaned3 = document.forms[0].emailList.value.replace(/[\[\]',]/g, '');
    document.forms[0].emailList.value = cleaned3.replace(/\s+/g, '~');
}

function fetchDonors(){
    var seekername = document.getElementById('seekerName').value;
    var bloodgroup = document.getElementById('bloodgroup').value;
    var city = document.getElementById('city').value;
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
                }
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
            })
            .catch(error => {
                console.error('Error:', error);
            });
    return true;
}
