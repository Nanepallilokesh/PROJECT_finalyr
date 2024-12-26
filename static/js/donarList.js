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
